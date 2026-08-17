#!/usr/bin/env node
// ctyun — 天翼云科研助手 (esx.ctyun.cn) 命令行
// 接口逆向自控制台 SPA (/bc/v1)。会话复用 gpu-platform-monitor 铸造的 cookies+token。
import { CtyunClient, requireOk } from "../lib/ctyun-client.mjs";
import { statusName, billingName, gpuText, fmtDuration, table } from "../lib/format.mjs";
import { loginWithCredentials, importFromMonitor, readCredentials, saveCredentials, sessionStatus, sessionPaths } from "../lib/auth.mjs";
import { buildCreateFormData, submitCreate, buildBatchCreateRequest } from "../lib/order.mjs";
import { JupyterChannel, channelFromEnv, injectSshKey } from "../lib/jupyter.mjs";

const HELP = `ctyun — 天翼云科研助手 CLI (esx.ctyun.cn)

用法: ctyun <命令> [参数]

认证:
  login [--import-monitor [DIR]]   交互式账号密码登录 (凭据存 ~/.ctyun/credentials, 600)
                                   迁移用: login --import-monitor 从 gpu-monitor 会话导入
  status | doctor [--json]         体检: 版本/会话/auth来源/业务验证 (失败退出码非 0)
  logout                            清除本地会话与凭据

开发机:
  envs [--json]                     开发机列表
  env <id> [--ssh] [--json]         开发机详情 (--ssh 只打印 SSH 命令/Jupyter 链接)
  start <id> [--cpu-only]           启动 (停止态→运行)
  stop <id>                         停止 (释放 GPU, 数据保留)
  rename <id> <alias>               修改别名
  delete <id> --yes                 删除 (不可恢复, 需显式 --yes)

资源:
  queues                            各区域资源池队列 + GPU 占用
  pool                              监控目标队列实时快照
  images [--region x] [关键词]      公共框架镜像
  specs [--region x]                开发机规格
  keys                              SSH 公钥
  jobs                              训练作业列表
  pvc <ideId|uuid>                  开发机挂载的存储卷
  metrics <uuid> [--days N]         GPU/CPU/内存利用率 (objectUuid)
  create [选项]                     创建开发机 (默认复制监控配置; --dry-run 只预览)

Jupyter 通道 (免 SSH 操作开发机):
  jexec <ideId> <code|file.mjs|cmd:...>  经 Jupyter kernel 执行 Python 代码
  ssh-setup <ideId> [--key <pub路径>]    注入公钥到开发机 authorized_keys

其他:
  raw <METHOD> <path> [json]        直接调 API (如 raw GET /ide/summary)
  whoami                            项目/身份信息
  help                              本帮助

会话: ~/.ctyun/session (独立于 gpu-platform-monitor; 401 时跑 ctyun login 重新直登)`;

function parseArgs(argv) {
  const positional = [];
  const flags = {};
  for (let i = 0; i < argv.length; i++) {
    const a = argv[i];
    if (a.startsWith("--")) {
      const key = a.slice(2);
      // --key=value | --key value | --flag
      if (a.includes("=")) flags[key.split("=")[0]] = a.split("=").slice(1).join("=");
      else if (argv[i + 1] && !argv[i + 1].startsWith("--") && ["project", "region", "pool", "user", "password", "import-monitor", "perPage"].includes(key)) {
        flags[key] = argv[++i];
      } else flags[key] = true;
    } else positional.push(a);
  }
  return { cmd: positional[0], args: positional.slice(1), flags };
}

async function getClient() {
  const client = new CtyunClient();
  await client.login();
  return client;
}

async function promptHidden(question) {
  const readline = await import("node:readline/promises");
  const rl = readline.createInterface({ input: process.stdin, output: process.stdout });
  // 关回显
  const stdin = process.stdin;
  stdin.setRawMode?.(true);
  return new Promise(resolve => {
    process.stdout.write(question);
    let buf = "";
    const onData = ch => {
      if (ch[0] === 13 || ch[0] === 10) { // Enter
        stdin.setRawMode?.(false);
        stdin.removeListener("data", onData);
        rl.close();
        process.stdout.write("\n");
        resolve(buf);
      } else if (ch[0] === 3) { // Ctrl-C
        process.exit(1);
      } else if (ch[0] === 127) { // Backspace
        if (buf) buf = buf.slice(0, -1);
      } else {
        buf += ch.toString("utf8");
      }
    };
    stdin.on("data", onData);
  });
}

async function getProjectId(client) {
  const projects = requireOk(await client.postV1("/bc/project/list", { action_name: ["bc:job:create"] }), "读取项目").projects ?? [];
  const active = projects.filter(p => p.status === 1);
  if (!active.length) throw new Error("没有可用企业项目");
  return active[0].projectId;
}

async function listRegions(client) {
  return requireOk(await client.getV1("/bc/ops/region/list", {
    "paging.page": 1, "paging.perPage": 999, poolType: "exclusive",
  }), "读取可用区").opsRegionInfo ?? [];
}

async function resolveRegion(client, hint) {
  const regions = await listRegions(client);
  if (!hint) return regions;
  const hit = regions.find(r => r.regionNameEng === hint || r.regionName === hint);
  if (!hit) throw new Error(`未找到可用区: ${hint} (可用: ${regions.map(r => r.regionNameEng).join(", ")})`);
  return [hit];
}

async function main() {
  const { cmd, args, flags } = parseArgs(process.argv.slice(2));
  if (!cmd || cmd === "help" || flags.help) { console.log(HELP); return; }

  // 认证类命令在建立客户端之前处理（无会话也要能跑）
  if (cmd === "login") {
    if (flags["import-monitor"]) {
      const dir = typeof flags["import-monitor"] === "string" ? flags["import-monitor"] : undefined;
      const r = await importFromMonitor(dir);
      console.log(`✅ 已从 gpu-platform-monitor 导入会话 (${r.cookieCount} cookies)`);
      return;
    }
    const readline = await import("node:readline/promises");
    // 凭据来源: 环境变量或已存的 credentials 文件; 缺什么交互式问什么
    // (--user/--password 仍可用于脚本, 但密码会进 shell history, 不再写入帮助文本)
    let { username, password } = flags.user ? { username: flags.user, password: flags.password } : (await readCredentials() ?? {});
    if (!username) {
      const rl = readline.createInterface({ input: process.stdin, output: process.stdout });
      username = (await rl.question("账号: ")).trim();
      rl.close();
    }
    if (!password) password = await promptHidden("密码: ");
    if (!username || !password) throw new Error("缺少账号或密码");
    const r = await loginWithCredentials({ username, password });
    await saveCredentials(username, password);
    console.log(`✅ 登录成功 (${r.cookieCount} cookies, token ${r.token.slice(0, 8)}…) — 凭据已存 ${sessionPaths().credFile}`);
    return;
  }
  if (cmd === "logout") {
    const fs = await import("node:fs/promises");
    const { sessionDir, credFile } = sessionPaths();
    await fs.rm(sessionDir, { recursive: true, force: true }).catch(() => {});
    await fs.rm(credFile, { force: true }).catch(() => {});
    console.log("✅ 已清除本地会话与凭据");
    return;
  }
  if (cmd === "status" || cmd === "doctor") {
    const s = await sessionStatus();
    const cred = await readCredentials();
    const version = "1.1.0";
    // doctor 报告: 即使未登录也不 crash，报告缺什么
    const authSource = process.env.CTYUN_USERNAME && process.env.CTYUN_PASSWORD ? "env"
      : cred ? "config" : flags.user ? "flag" : "missing";
    const report = {
      version,
      session: s.exists ? { source: s.source, mintedAt: s.mintedAt, cookieMtime: s.cookieMtime } : null,
      auth: { available: authSource !== "missing", source: authSource,
        missing_step: authSource === "missing" ? "运行 ctyun login（交互式输入账号密码）" : null },
      api: { reachable: null, ok: null, error: null }, // 探测后填充
    };
    if (s.exists) {
      try {
        const c = await getClient();
        const r = requireOk(await c.getV1("/ide/list", { "paging.page": 1, "paging.perPage": 1 }), "验证");
        await c.persistSession();
        report.api = { reachable: true, ok: true, error: null };
        await c.close();
      } catch (e) {
        report.api = { reachable: true, ok: false, error: e.message };
        process.exitCode = 1;
      }
    } else {
      report.api = { reachable: null, ok: null, error: "未登录" };
      process.exitCode = 1;
    }
    if (flags.json) {
      console.log(JSON.stringify(report, null, 2));
      return;
    }
    // 人类可读输出
    console.log(`version:  ${report.version}`);
    console.log(`session:  ${s.exists ? `${s.source} @ ${s.mintedAt}` : "无（未登录）"}`);
    console.log(`auth:     ${authSource}${report.auth.missing_step ? ` — ${report.auth.missing_step}` : ""}`);
    if (report.api.ok === true) console.log("api:      ✅ 业务验证通过");
    else if (report.api.ok === false) console.log(`api:      ❌ ${report.api.error}`);
    else console.log("api:      未验证（未登录）");
    return;
  }

  const client = await getClient();
  try {
    switch (cmd) {
      case "envs": {
        const params = { "paging.page": 1, "paging.perPage": flags.perPage ? Number(flags.perPage) : 100 };
        if (!flags["all-projects"]) params.projectId = await getProjectId(client);
        const r = requireOk(await client.getV1("/ide/list", params), "读取开发机列表");
        const ides = r.ides ?? [];
        if (flags.json) { console.log(JSON.stringify(ides, null, 2)); break; }
        if (!ides.length) { console.log("没有开发机"); break; }
        table([
          ["ID", "名称", "别名", "状态", "GPU", "区域", "创建时间"],
          ...ides.map(i => [
            String(i.id), i.ideName, i.ideAlias || "-",
            statusName(i.states), gpuText(i), i.regionNameEng,
            (i.createTime ?? "").slice(0, 10),
          ]),
        ]);
        break;
      }
      case "env": {
        const id = Number(args[0]);
        if (!id) throw new Error("用法: ctyun env <id>");
        const r = requireOk(await client.getV1("/ide/get", { id }), "读取开发机详情");
        if (flags.json) { console.log(JSON.stringify(r, null, 2)); break; }
        if (flags.ssh) {
          console.log(`SSH:    ${r.sshCommand ?? "(未启用)"}`);
          console.log(`Jupyter: ${r.openLink ?? "-"}`);
          break;
        }
        console.log(`名称:     ${r.ideAlias ? r.ideAlias + " | " : ""}${r.name}`);
        console.log(`ID:       ${r.id ?? id}`);
        console.log(`状态:     ${statusName(r.states)} (${r.statesString})`);
        console.log(`计费:     ${billingName(r.billingMode)}`);
        console.log(`规格:     ${gpuText(r)} | CPU ${r.resourceSpecific?.quotaCpu}核 | 内存 ${r.resourceSpecific?.quotaMem}GB`);
        console.log(`区域:     ${r.regionName} (${r.regionNameEng})`);
        console.log(`队列:     ${r.queueName}`);
        console.log(`镜像:     ${r.imageAddr}`);
        console.log(`SSH:      ${r.sshCommand ?? "(未启用)"}`);
        console.log(`Jupyter:  ${r.openLink ?? "-"}`);
        if (r.servicePortEnabled && r.servicePortMap) {
          for (const [port, addr] of Object.entries(r.servicePortMap)) console.log(`端口 ${port}: ${addr}`);
        }
        console.log(`创建:     ${r.createTime}`);
        if (r.localStorageInfo?.pvSize) console.log(`本地盘:   ${r.localStorageInfo.pvSize}GB @ ${r.localStorageInfo.mountPath}`);
        if (Number(r.leftTime) > 0) console.log(`自动停止: ${fmtDuration(Number(r.leftTime))} 后`);
        break;
      }
      case "start": {
        const id = Number(args[0]);
        if (!id) throw new Error("用法: ctyun start <id> [--cpu-only]");
        // 先取详情构造启动参数(与 BootDevelopEnvDialog 一致: 保留原配置)
        const info = requireOk(await client.getV1("/ide/get", { id }), "读取开发机详情");
        // 护栏: 仅已停止(4)/运行失败(6)/异常(0) 可启动; 过渡态重复提交会被服务端拒绝或产生副作用
        const startableStates = [0, 4, 6];
        if (!startableStates.includes(info.states)) {
          throw new Error(`开发机 ${id} 当前状态 ${statusName(info.states)}(${info.states})，不可启动（仅已停止/失败/异常可启动）`);
        }
        const body = {
          id: info.id, ideName: info.name, autoStop: info.autoStop, stopDuration: info.stopDuration,
          sshEnabled: info.sshEnabled, sshClientIps: info.sshClientIps, sshShareType: info.sshShareType,
          servicePortEnabled: info.servicePortEnabled, serviceInternalPorts: info.servicePortMap ? Object.keys(info.servicePortMap) : undefined,
          servicePortClientIps: info.servicePortClientIps, servicePortShareType: info.servicePortShareType,
          dindEnabled: info.dindEnabled, useIdleResource: info.useIdleResource ?? 0,
          aoneEduInfo: { aoneEduEnable: false },
        };
        if (flags["cpu-only"]) { body.servicePortEnabled = false; body.dindEnabled = false; body.useIdleResource = 0; body.startMode = "only_cpu"; }
        if (flags["dry-run"]) {
          console.log("[dry-run] POST /bc/v1/ide/launch");
          console.log(JSON.stringify(body, null, 2));
          break;
        }
        const r = requireOk(await client.postV1("/ide/launch", body), "启动开发机");
        console.log(`✅ 已提交启动: ${r.message ?? r.status?.message ?? "ok"}`);
        break;
      }
      case "stop": {
        const id = Number(args[0]);
        if (!id) throw new Error("用法: ctyun stop <id> [--dry-run]");
        if (flags["dry-run"]) {
          console.log("[dry-run] POST /bc/v1/ide/stop");
          console.log(JSON.stringify({ id }, null, 2));
          break;
        }
        const r = requireOk(await client.postV1("/ide/stop", { id }), "停止开发机");
        console.log(`✅ 已提交停止: ${r.message ?? r.status?.message ?? "ok"}`);
        break;
      }
      case "delete": {
        const id = Number(args[0]);
        if (!id) throw new Error("用法: ctyun delete <id> --yes");
        if (!flags.yes) throw new Error("删除不可恢复。确认请加 --yes");
        const r = requireOk(await client.deleteV1(`/ide/delete/${id}`), "删除开发机");
        console.log(`🗑️  已提交删除: ${r.message ?? r.status?.message ?? "ok"}`);
        break;
      }
      case "rename": {
        const id = Number(args[0]);
        const alias = args[1];
        if (!id || alias === undefined) throw new Error("用法: ctyun rename <id> <alias> (空串清除别名)");
        const r = requireOk(await client.postV1("/ide/updateAlias", { id, alias }), "修改别名");
        console.log(`✅ ${r.message ?? r.status?.message ?? "ok"}`);
        break;
      }
      case "queues": {
        const pid = await getProjectId(client);
        const out = [];
        for (const region of await listRegions(client)) {
          const queues = requireOk(await client.getV1("/queue/list", {
            resourceId: region.resourceId, regionNameEng: region.regionNameEng, projectId: pid, poolType: "exclusive",
          }), `读取队列 ${region.regionNameEng}`).queues ?? [];
          for (const q of queues) out.push({
            region: region.regionNameEng, regionName: region.regionName, queue: q.queueName,
            id: q.id, usedGpu: Number(q.allocated?.gpu ?? 0), totalGpu: Number(q.capabilityGpu ?? 0),
          });
        }
        if (flags.json) { console.log(JSON.stringify(out, null, 2)); break; }
        table([
          ["区域", "队列", "已用/总GPU", "空闲"],
          ...out.map(q => [q.region, q.queue, `${q.usedGpu}/${q.totalGpu}`, String(q.totalGpu - q.usedGpu)]),
        ]);
        break;
      }
      case "pool": {
        // 监控目标队列快照（与 monitor.mjs 同口径）
        const { snapshotQueue } = await import("../lib/pool.mjs");
        const snap = await snapshotQueue(client);
        if (flags.json) { console.log(JSON.stringify(snap, null, 2)); break; }
        console.log(`队列:   ${snap.queue} (${snap.region})`);
        console.log(`GPU:    ${snap.usedGpu}/${snap.totalGpu} 已用, 空闲 ${snap.freeGpu}`);
        console.log(`售罄:   ${snap.sellout === 1 ? "是" : "否"}   满足需求: ${snap.meetNeed === 1 ? "是" : snap.meetNeed === 2 ? "否" : String(snap.meetNeed)}`);
        console.log(`可提交: ${snap.ready ? "✅ 是" : "❌ 否"}`);
        break;
      }
      case "images": {
        const regions = await resolveRegion(client, flags.region);
        const kw = args[0];
        for (const region of regions) {
          const images = requireOk(await client.getV1("/ide/image/list", {
            arch: region.arch, productType: 1, imageType: 0, "paging.page": 1, "paging.perPage": 999,
          }), "读取镜像").images ?? [];
          const list = kw ? images.filter(i => i.name.includes(kw)) : images;
          if (!flags.region) console.log(`—— ${region.regionNameEng} ——`);
          for (const i of list) console.log(`  ${i.imageId}  ${i.name}`);
        }
        break;
      }
      case "specs": {
        const pid = await getProjectId(client);
        const regions = await resolveRegion(client, flags.region);
        for (const region of regions) {
          const queues = requireOk(await client.getV1("/queue/list", {
            resourceId: region.resourceId, regionNameEng: region.regionNameEng, projectId: pid, poolType: "exclusive",
          }), "读取队列").queues ?? [];
          for (const q of queues) {
            const specs = requireOk(await client.getV1("/resource/pool/spec/list", {
              resource_id: region.resourceId, regionNameEng: region.regionNameEng,
              "paging.page": 1, "paging.perPage": 999,
              querySpecKind: "ExclusivePoolProductSpec", exclusivePoolUuid: q.exclusivePoolUuid,
            }), "读取规格").specs ?? [];
            if (!specs.length) continue;
            console.log(`—— ${region.regionNameEng} / ${q.queueName} ——`);
            table([
              ["规格ID", "GPU", "CPU", "内存", "本地盘"],
              ...specs.map(s => [String(s.id), `${s.quotaGpu}x ${s.gpuModel}`, String(s.quotaCpu), `${s.quotaMem}GB`, `${s.quotaLocalStorage ?? 0}GB`]),
            ]);
          }
        }
        break;
      }
      case "keys": {
        const keys = requireOk(await client.postV1("/ide/publicKey/list", {}), "读取公钥").publicKeyInfo ?? [];
        if (flags.json) { console.log(JSON.stringify(keys, null, 2)); break; }
        for (const k of keys) console.log(`${k.id}  ${k.name}  (${(k.createTime ?? "").slice(0, 10)})`);
        break;
      }
      case "raw": {
        const method = (args[0] ?? "GET").toUpperCase();
        const route = args[1];
        if (!route) throw new Error("用法: ctyun raw <METHOD> <path> [json-body]  (path 如 /ide/summary)");
        const body = args[2] ? JSON.parse(args[2]) : undefined;
        const r = await client.request(method, route, body !== undefined ? { json: body } : {});
        console.log(JSON.stringify(r.json ?? r.text, null, 2));
        // 统一退出码: HTTP 非 200 或业务码非 ok → 1 (输出仍完整打印, 便于调试)
        const bizCode = r.json?.status?.code;
        if (r.status !== 200 || (bizCode !== undefined && bizCode !== "ok")) process.exitCode = 1;
        break;
      }
      case "create": {
        const opts = {
          projectName: flags.projectName, regionNameEng: flags.region, queueName: flags.queue,
          gpuModel: flags.gpuModel, gpuCards: flags.cards, imageName: flags.image,
          sshKeyName: flags["ssh-key"], researchStorageName: flags.storage, researchSpaceName: flags.space,
          machineName: flags.name, localExpansionGb: flags["local-gb"], localMountPath: flags["local-mount"],
          localPersistence: flags["local-ephemeral"] ? false : undefined,
          sshShareType: flags["ssh-dedicated"] ? "Dedicated" : undefined,
          sshClientIps: flags["ssh-ips"], autoStop: flags["auto-stop"], stopDuration: flags["stop-duration"],
          count: flags.count,
        };
        for (const k of Object.keys(opts)) if (opts[k] === undefined) delete opts[k];
        const discovered = await buildCreateFormData(client, opts);
        console.log("解析到的创建参数:");
        console.log(`  项目: ${discovered.project.projectName}`);
        console.log(`  区域: ${discovered.region.regionNameEng} | 队列: ${discovered.queue.queueName}`);
        console.log(`  规格: ${discovered.spec.quotaGpu}x ${discovered.spec.gpuModel} (${discovered.spec.quotaCpu}C/${discovered.spec.quotaMem}G)`);
        console.log(`  镜像: ${discovered.image.name}`);
        console.log(`  SSH: ${discovered.key.name}${discovered.storage ? ` | 科研存储: ${discovered.storage.storageName}/${discovered.space.spaceName}` : ""}`);
        console.log(`  本地盘: 扩容上限 ${discovered.localDiskLimit.maxExpansionGb}GB, 本次请求 ${discovered.formData.localPv[0]?.size ?? 0}GB`);
        if (flags["dry-run"]) {
          console.log("\n[dry-run] POST /bc/v1/ide/batch/create");
          console.log(JSON.stringify(buildBatchCreateRequest(discovered.formData), null, 2));
          break;
        }
        if (!flags.yes) throw new Error("创建开发机是真实写操作。确认参数无误后加 --yes 提交（或先 --dry-run 预览）");
        const { response, clamped, requestedGb, submitGb } = await submitCreate(client, discovered);
        if (clamped) console.log(`⚠️ 本地盘库存收缩: 请求 ${requestedGb}GB → 提交 ${submitGb}GB`);
        console.log(`✅ 创建已提交: ${response.message ?? "ok"}（到 ctyun envs 查看启动进度）`);
        break;
      }
      case "jobs": {
        const projectId = await getProjectId(client);
        const r = requireOk(await client.getV1("/job/list", {
          projectId, "paging.page": 1, "paging.perPage": flags.perPage ? Number(flags.perPage) : 20,
        }), "读取训练作业");
        if (flags.json) { console.log(JSON.stringify(r.jobs ?? [], null, 2)); break; }
        const rows = (r.jobs ?? []).map(j => [String(j.id), j.name ?? "-", j.stateName ?? String(j.state ?? "-"), j.gpuNum ?? "-", j.createdAt ?? "-"]);
        table([["ID", "名称", "状态", "GPU", "创建时间"], ...rows]);
        break;
      }
      case "pvc": {
        const key = args[0];
        if (!key) throw new Error("用法: ctyun pvc <ideId> [--json]");
        let resourceId, queueId;
        try {
          const info = requireOk(await client.getV1("/ide/get", { id: Number(key) }), "读取开发机");
          resourceId = info.resourceId; queueId = info.queueId;
        } catch {
          throw new Error("请传开发机数字 ID");
        }
        const r = requireOk(await client.request("GET", "/storage/pvc/list", {
          params: { resourceId, queueId, "paging.page": 1, "paging.perPage": 50 },
        }), "读取存储卷");
        const pvcs = r.storagePvcs ?? [];
        if (flags.json) { console.log(JSON.stringify(pvcs, null, 2)); break; }
        const rows = pvcs.map(p => [String(p.pvcName ?? p.name ?? "-"), String(p.pvSizeGb ?? p.sizeGb ?? p.capacity ?? "-"), p.status ?? "-", p.mountPath ?? p.mountPathInfo ?? "-"]);
        table([["名称", "容量(GB)", "状态", "挂载点"], ...rows]);
        break;
      }
      case "metrics": {
        const uuid = args[0];
        if (!uuid) throw new Error("用法: ctyun metrics <objectUuid> [--json]（uuid 从 env <id> --json 的 uuid 字段取）");
        const r = requireOk(await client.request("POST", "/monitor/getResourceUsageRateMetrics", {
          json: { objectType: "ide", metric: [1, 2, 3], objectUuid: uuid },
        }), "读取利用率指标");
        // API 返回当前快照: metricDataInfo: [{metricName, usageRate}] (无时间范围参数)
        const names = { cpu_usage_rate: "CPU", mem_usage_rate: "内存", gpu_usage_rate: "GPU" };
        if (flags.json) { console.log(JSON.stringify(r.metricDataInfo ?? [], null, 2)); break; }
        for (const item of r.metricDataInfo ?? []) {
          console.log(`${names[item.metricName] ?? item.metricName}: ${Number(item.usageRate).toFixed(1)}%`);
        }
        break;
      }
      case "ssh-setup": {
        const id = Number(args[0]);
        if (!id) throw new Error("用法: ctyun ssh-setup <ideId> [--key <公钥文件路径>]");
        const info = requireOk(await client.getV1("/ide/get", { id }), "读取开发机");
        const keyPath = flags.key ?? "~/.ssh/id_ed25519.pub";
        const pubPath = keyPath.startsWith("~") ? keyPath.replace("~", process.env.HOME) : keyPath;
        const { readFileSync } = await import("node:fs");
        const pubLine = readFileSync(pubPath, "utf8").trim();
        if (!pubLine.startsWith("ssh-")) throw new Error(`不是合法公钥文件: ${pubPath}`);
        console.log(`目标: ${info.name} (${statusName(info.states)})`);
        console.log(`公钥: ${pubLine.split().slice(0, 2).join(" ").slice(0, 50)}… ${pubLine.split().pop()}`);
        const channel = await channelFromEnv(info).init();
        const r = await injectSshKey(channel, pubLine);
        console.log(r.added ? `✅ 已注入 (authorized_keys 现有 ${r.totalKeys} 把):` : `已存在 (无需重复注入), 现有 ${r.totalKeys} 把:`);
        for (const k of r.keys) console.log(`  ${k}`);
        break;
      }
      case "jexec": {
        const id = Number(args[0]);
        const spec = args.slice(1).join(" ");
        if (!id || !spec) throw new Error("用法: ctyun jexec <ideId> <python代码 | 文件.py | cmd:shell命令>");
        const info = requireOk(await client.getV1("/ide/get", { id }), "读取开发机");
        let code;
        if (spec.startsWith("cmd:")) {
          code = `import subprocess\nprint(subprocess.run(${JSON.stringify(spec.slice(4))}, shell=True, capture_output=True, text=True, timeout=120).stdout)`;
        } else if (/\.py$/.test(spec)) {
          const { readFileSync } = await import("node:fs");
          code = readFileSync(spec, "utf8");
        } else {
          code = spec;
        }
        const channel = await channelFromEnv(info).init();
        const out = await channel.exec(code, { timeoutMs: 180000 });
        process.stdout.write(out.endsWith("\n") ? out : out + "\n");
        break;
      }
      case "whoami": {
        const projects = requireOk(await client.postV1("/bc/project/list", { action_name: ["bc:job:create"] }), "读取项目").projects ?? [];
        for (const p of projects.filter(x => x.status === 1)) {
          console.log(`项目: ${p.projectName}  (${p.projectId})`);
        }
        break;
      }
      default:
        console.error(`未知命令: ${cmd}\n`);
        console.log(HELP);
        process.exitCode = 1;
    }
  } finally {
    await client.close();
  }
}

main().catch(error => {
  // --json 模式下错误也必须机器可读（cli-creator: errors must be machine-readable）
  const jsonMode = process.argv.slice(2).includes("--json");
  if (jsonMode) {
    process.stderr.write(JSON.stringify({ ok: false, error: error.message }) + "\n");
  } else {
    console.error(`❌ ${error.message}`);
  }
  process.exitCode = 1;
});
