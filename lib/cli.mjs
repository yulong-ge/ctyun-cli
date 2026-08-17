// ctyun CLI —— Commander 命令定义；双通道: 官方 OpenAPI (AK/SK) 优先，控制台会话补充
// 通道矩阵: 官方可达成 envs/env/start/stop/delete/keys/jobs/images/metrics/jexec/ssh-setup
//           仅控制台 create(space 级存储挂载)/queues(已用GPU)/pool(rename/pvc/whoami/raw
import { Command, InvalidArgumentError } from "commander";
import fs from "node:fs/promises";
import { CtyunClient, requireOk } from "./ctyun-client.mjs";
import { statusName, billingName, gpuText, fmtDuration, table, OFFICIAL_STATE_TO_CONSOLE } from "./format.mjs";
import { loginWithCredentials, importFromMonitor, readCredentials, saveCredentials, sessionStatus, sessionPaths } from "./auth.mjs";
import { buildCreateFormData, submitCreate, buildBatchCreateRequest } from "./order.mjs";
import { JupyterChannel, channelFromEnv, injectSshKey } from "./jupyter.mjs";
import { OfficialClient, readAksk, saveAksk, clearAksk, requireOfficialOk, akskPath } from "./official-client.mjs";
import { pickChannel, closeChannel } from "./channel.mjs";

const pkg = JSON.parse(await fs.readFile(new URL("../package.json", import.meta.url), "utf8"));

// ---------- 参数解析工具 ----------

function intArg(value) {
  const n = Number(value);
  if (!Number.isInteger(n) || n <= 0) throw new InvalidArgumentError(`需要正整数, 收到: ${value}`);
  return n;
}

function channelArg(value) {
  if (value !== "official" && value !== "console") throw new InvalidArgumentError("只能是 official 或 console");
  return value;
}

async function prompt(question) {
  const readline = await import("node:readline/promises");
  const rl = readline.createInterface({ input: process.stdin, output: process.stdout });
  const answer = (await rl.question(question)).trim();
  rl.close();
  return answer;
}

async function promptHidden(question) {
  const readline = await import("node:readline/promises");
  const rl = readline.createInterface({ input: process.stdin, output: process.stdout });
  const stdin = process.stdin;
  stdin.setRawMode?.(true);
  return new Promise(resolve => {
    process.stdout.write(question);
    let buf = "";
    const onData = ch => {
      if (ch[0] === 13 || ch[0] === 10) {
        stdin.setRawMode?.(false);
        stdin.removeListener("data", onData);
        rl.close();
        process.stdout.write("\n");
        resolve(buf);
      } else if (ch[0] === 3) {
        process.exit(1);
      } else if (ch[0] === 127) {
        if (buf) buf = buf.slice(0, -1);
      } else {
        buf += ch.toString("utf8");
      }
    };
    stdin.on("data", onData);
  });
}

// ---------- 通道相关的公共逻辑 ----------

/** 官方 ide 对象 → 控制台口径字段（states 数字、regionNameEng 等），display 与 --json 共用 */
function normalizeOfficialIde(ide) {
  return {
    ...ide,
    ideName: ide.ideName ?? ide.name,
    states: OFFICIAL_STATE_TO_CONSOLE[ide.state] ?? ide.state,
    statesString: ide.state,
    regionNameEng: ide.regionNameEng ?? ide.regionName,
  };
}

async function officialIdeDetail(official, id, label = "读取开发机详情") {
  return normalizeOfficialIde(requireOfficialOk(await official.call("getIdeDetail", { ideId: id }), label));
}

/** 取开发机详情（官方优先，控制台回退）—— env/jexec/ssh-setup 共用 */
async function ideDetail({ prefer = "official", force }, id) {
  const channel = await pickChannel({ prefer, force });
  try {
    if (channel.mode === "official") {
      return { channel, info: await officialIdeDetail(channel.official, id) };
    }
    const info = requireOk(await channel.console.getV1("/ide/get", { id }), "读取开发机详情");
    return { channel, info };
  } catch (e) {
    await closeChannel(channel);
    throw e;
  }
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

// ---------- 命令定义 ----------

export function buildProgram() {
  const program = new Command();

  program
    .name("ctyun")
    .version(pkg.version, "-V, --version")
    .description("天翼云科研助手 CLI (esx.ctyun.cn) — 官方 OpenAPI (AK/SK) 优先，控制台通道补充")
    .addHelpText("after", `
通道说明:
  official  官方 OpenAPI (bc-global.ctapi.ctyun.cn)，凭据 ctyun aksk 配置，不过期
  console   控制台逆向通道 (esx.ctyun.cn)，凭据 ctyun login 登录，会话约 1 小时
  自动选择: 有 AK/SK 走官方；仅 create/queues/pool/pvc/rename/whoami/raw 需要控制台会话
  强制指定: 每个命令都接受 --channel official|console (排障用)
凭据目录: ~/.ctyun/ (aksk=官方密钥, credentials=控制台账密, session/=控制台会话)`);

  // ===== 认证与凭据 =====

  program.command("login")
    .description("控制台通道登录（账密直登，凭据存 ~/.ctyun/credentials）")
    .option("--import-monitor [dir]", "从 gpu-platform-monitor 会话一次性导入")
    .option("--user <user>", "账号（脚本用；密码建议走 credentials 文件）")
    .option("--password <password>", "密码（会进 shell history，仅脚本用）")
    .action(async options => {
      if (options.importMonitor) {
        const dir = typeof options.importMonitor === "string" ? options.importMonitor : undefined;
        const r = await importFromMonitor(dir);
        console.log(`✅ 已从 gpu-platform-monitor 导入会话 (${r.cookieCount} cookies)`);
        return;
      }
      let { username, password } = options.user ? { username: options.user, password: options.password } : (await readCredentials() ?? {});
      if (!username) username = await prompt("账号: ");
      if (!password) password = await promptHidden("密码: ");
      if (!username || !password) throw new Error("缺少账号或密码");
      const r = await loginWithCredentials({ username, password });
      await saveCredentials(username, password);
      console.log(`✅ 登录成功 (${r.cookieCount} cookies, token ${r.token.slice(0, 8)}…) — 凭据已存 ${sessionPaths().credFile}`);
      console.log("官方 API 通道请另行配置: ctyun aksk");
    });

  program.command("logout")
    .description("清除控制台会话与账密（官方 AK/SK 用 ctyun aksk --clear）")
    .action(async () => {
      const { sessionDir, credFile } = sessionPaths();
      await fs.rm(sessionDir, { recursive: true, force: true }).catch(() => {});
      await fs.rm(credFile, { force: true }).catch(() => {});
      console.log("✅ 已清除控制台会话与凭据");
    });

  program.command("aksk")
    .description("配置官方 OpenAPI AK/SK（门户 我的→个人中心→安全设置→用户AccessKey 新建）")
    .option("--ak <ak>", "Access Key ID（缺省交互式输入）")
    .option("--sk <sk>", "Secret Access Key（缺省交互式输入，不回显）")
    .option("--clear", "删除已存的 AK/SK")
    .action(async options => {
      if (options.clear) {
        await clearAksk();
        console.log("✅ 已清除官方 API 密钥");
        return;
      }
      let { ak, sk } = options;
      const existing = await readAksk();
      if (!ak) ak = await prompt(`Access Key ID${existing ? " (回车保留现有)" : ""}: `) || existing?.ak;
      if (!sk) sk = await promptHidden(`Secret Access Key${existing ? " (回车保留现有)" : ""}: `) || existing?.sk;
      if (!ak || !sk) throw new Error("缺少 AK 或 SK");
      await saveAksk(ak, sk);
      console.log(`✅ 已保存到 ${akskPath()} (600) — 验证官方通道…`);
      const official = new OfficialClient({ ak, sk, source: "file" });
      requireOfficialOk(await official.call("listIdes", { pageNum: 1, pageSize: 1 }), "官方通道验证");
      console.log("✅ 官方 API 验证通过 (listIdes)");
    });

  program.command("status")
    .description("体检: 版本 / 官方 AK/SK / 控制台会话 / 双通道业务验证（全失败退出码非 0）")
    .alias("doctor")
    .option("--json", "机器可读输出")
    .action(async options => {
      const aksk = await readAksk();
      const s = await sessionStatus();
      const cred = await readCredentials();
      const authSource = process.env.CTYUN_USERNAME && process.env.CTYUN_PASSWORD ? "env"
        : cred ? "config" : "missing";

      const report = {
        version: pkg.version,
        channels: {
          official: { configured: !!aksk, source: aksk?.source ?? null, probed: !!aksk, ok: null, error: null },
          console: {
            session: s.exists ? { source: s.source, mintedAt: s.mintedAt, cookieMtime: s.cookieMtime } : null,
            auth: { available: authSource !== "missing", source: authSource },
            probed: s.exists, ok: null, error: null,
          },
        },
      };

      if (aksk) {
        try {
          requireOfficialOk(await (new OfficialClient(aksk)).call("listIdes", { pageNum: 1, pageSize: 1 }), "官方通道验证");
          report.channels.official.ok = true;
        } catch (e) {
          report.channels.official.ok = false;
          report.channels.official.error = e.message;
        }
      } else {
        report.channels.official.error = "未配置 (ctyun aksk)";
      }

      if (s.exists) {
        try {
          const c = new CtyunClient();
          await c.login();
          requireOk(await c.getV1("/ide/list", { "paging.page": 1, "paging.perPage": 1 }), "验证");
          await c.persistSession();
          await c.close();
          report.channels.console.ok = true;
        } catch (e) {
          report.channels.console.ok = false;
          report.channels.console.error = e.message;
        }
      } else {
        report.channels.console.error = "未登录 (ctyun login)";
      }

      const anyOk = report.channels.official.ok === true || report.channels.console.ok === true;
      if (!anyOk) process.exitCode = 1;

      if (options.json) {
        console.log(JSON.stringify(report, null, 2));
        return;
      }
      console.log(`version:  ${report.version}`);
      const off = report.channels.official;
      console.log(`官方通道:  ${!off.configured ? "未配置 (ctyun aksk)" : off.ok === true ? "✅ 验证通过" : `❌ ${off.error}`}`);
      const con = report.channels.console;
      console.log(`控制台:    ${!con.session ? "无会话 (ctyun login)" : `${con.session.source} @ ${con.session.mintedAt}`}`);
      if (con.session) {
        console.log(`  账密:    ${con.auth.available ? `可用 (${con.auth.source})` : "缺失"}`);
        console.log(`  业务:    ${con.ok === true ? "✅ 验证通过" : `❌ ${con.error}`}`);
      }
    });

  // ===== 开发机（官方优先） =====

  program.command("envs")
    .description("开发机列表")
    .option("--json", "JSON 输出")
    .option("--perPage <n>", "每页条数（默认 100）", intArg)
    .option("--all-projects", "不过滤企业项目（控制台通道）")
    .action(async options => {
      const channel = await pickChannel({ prefer: "official", force: options.channel });
      try {
        let ides;
        if (channel.mode === "official") {
          const ret = requireOfficialOk(await channel.official.call("listIdes", { pageNum: 1, pageSize: options.perPage ?? 100 }), "读取开发机列表");
          ides = (ret.ides ?? []).map(normalizeOfficialIde);
        } else {
          const params = { "paging.page": 1, "paging.perPage": options.perPage ?? 100 };
          if (!options.allProjects) params.projectId = await getProjectId(channel.console);
          ides = requireOk(await channel.console.getV1("/ide/list", params), "读取开发机列表").ides ?? [];
        }
        if (options.json) { console.log(JSON.stringify(ides, null, 2)); return; }
        if (!ides.length) { console.log("没有开发机"); return; }
        table([
          ["ID", "名称", "别名", "状态", "GPU", "区域", "创建时间"],
          ...ides.map(i => [
            String(i.id), i.ideName, i.ideAlias || "-",
            statusName(i.states), gpuText(i), i.regionNameEng,
            (i.createTime ?? "").slice(0, 10),
          ]),
        ]);
      } finally { await closeChannel(channel); }
    });

  program.command("env")
    .description("开发机详情（--ssh 只打印 SSH 命令/Jupyter 链接）")
    .argument("<id>", "开发机 ID", intArg)
    .option("--ssh", "只打印 SSH 命令与 Jupyter 链接")
    .option("--json", "JSON 输出")
    .action(async (id, options) => {
      const { channel, info } = await ideDetail(options, id);
      try {
        if (options.json) { console.log(JSON.stringify(info, null, 2)); return; }
        if (options.ssh) {
          console.log(`SSH:    ${info.sshCommand ?? "(未启用)"}`);
          console.log(`Jupyter: ${info.openLink ?? "-"}`);
          return;
        }
        console.log(`名称:     ${info.ideAlias ? info.ideAlias + " | " : ""}${info.ideName ?? info.name}`);
        console.log(`ID:       ${info.id ?? id}`);
        console.log(`状态:     ${statusName(info.states)} (${info.statesString ?? "-"})`);
        if (info.billingMode !== undefined) console.log(`计费:     ${billingName(info.billingMode)}`);
        const spec = info.resourceSpecific ?? {};
        console.log(`规格:     ${gpuText(info)} | CPU ${spec.quotaCpu ?? "?"}核 | 内存 ${spec.quotaMem ?? "?"}GB`);
        console.log(`区域:     ${info.regionName ?? "-"}${info.regionNameEng ? ` (${info.regionNameEng})` : ""}`);
        if (info.queueName || info.queueId) console.log(`队列:     ${info.queueName ?? info.queueId}`);
        if (info.imageAddr || info.framework || info.imageName) console.log(`镜像:     ${info.imageAddr ?? info.imageName ?? info.framework}`);
        console.log(`SSH:      ${info.sshCommand ?? "(未启用)"}`);
        console.log(`Jupyter:  ${info.openLink ?? "-"}`);
        if (info.servicePortEnabled && info.servicePortMap) {
          for (const [port, addr] of Object.entries(info.servicePortMap)) console.log(`端口 ${port}: ${addr}`);
        }
        console.log(`创建:     ${info.createTime ?? "-"}`);
        if (info.localStorageInfo?.pvSize) console.log(`本地盘:   ${info.localStorageInfo.pvSize}GB @ ${info.localStorageInfo.mountPath}`);
        if (Number(info.leftTime) > 0) console.log(`自动停止: ${fmtDuration(Number(info.leftTime))} 后`);
      } finally { await closeChannel(channel); }
    });

  program.command("start")
    .description("启动开发机（仅已停止/失败/异常态）")
    .argument("<id>", "开发机 ID", intArg)
    .option("--cpu-only", "仅 CPU 启动（仅控制台通道支持 startMode）")
    .option("--dry-run", "只打印请求体")
    .action(async (id, options) => {
      if (options.cpuOnly && options.channel !== "console") options.channel = "console"; // startMode 仅控制台参数
      const { channel, info } = await ideDetail(options, id);
      try {
        const startableStates = channel.mode === "official"
          ? ["STOPPED", "FAILED"]
          : [0, 4, 6];
        const currentState = channel.mode === "official" ? info.statesString : info.states;
        if (!startableStates.includes(currentState)) {
          throw new Error(`开发机 ${id} 当前状态 ${statusName(info.states)}，不可启动（仅已停止/失败可启动）`);
        }
        if (channel.mode === "official") {
          const body = { ideId: id };
          if (options.dryRun) { console.log("[dry-run] POST /api/bc/v2/launchIde"); console.log(JSON.stringify(body, null, 2)); return; }
          const r = requireOfficialOk(await channel.official.call("launchIde", body), "启动开发机");
          console.log(`✅ 已提交启动: ${r.status?.message ?? "ok"}`);
          return;
        }
        // 控制台通道：与 BootDevelopEnvDialog 一致，保留原配置
        const body = {
          id: info.id, ideName: info.name, autoStop: info.autoStop, stopDuration: info.stopDuration,
          sshEnabled: info.sshEnabled, sshClientIps: info.sshClientIps, sshShareType: info.sshShareType,
          servicePortEnabled: info.servicePortEnabled, serviceInternalPorts: info.servicePortMap ? Object.keys(info.servicePortMap) : undefined,
          servicePortClientIps: info.servicePortClientIps, servicePortShareType: info.servicePortShareType,
          dindEnabled: info.dindEnabled, useIdleResource: info.useIdleResource ?? 0,
          aoneEduInfo: { aoneEduEnable: false },
        };
        if (options.cpuOnly) { body.servicePortEnabled = false; body.dindEnabled = false; body.useIdleResource = 0; body.startMode = "only_cpu"; }
        if (options.dryRun) { console.log("[dry-run] POST /bc/v1/ide/launch"); console.log(JSON.stringify(body, null, 2)); return; }
        const r = requireOk(await channel.console.postV1("/ide/launch", body), "启动开发机");
        console.log(`✅ 已提交启动: ${r.message ?? r.status?.message ?? "ok"}`);
      } finally { await closeChannel(channel); }
    });

  program.command("stop")
    .description("停止开发机（释放 GPU，数据保留）")
    .argument("<id>", "开发机 ID", intArg)
    .option("--dry-run", "只打印请求体")
    .action(async (id, options) => {
      const channel = await pickChannel({ prefer: "official", force: options.channel });
      try {
        if (channel.mode === "official") {
          const body = { ideId: id };
          if (options.dryRun) { console.log("[dry-run] POST /api/bc/v2/stopIde"); console.log(JSON.stringify(body, null, 2)); return; }
          const r = requireOfficialOk(await channel.official.call("stopIde", body), "停止开发机");
          console.log(`✅ 已提交停止: ${r.status?.message ?? "ok"}`);
          return;
        }
        const body = { id };
        if (options.dryRun) { console.log("[dry-run] POST /bc/v1/ide/stop"); console.log(JSON.stringify(body, null, 2)); return; }
        const r = requireOk(await channel.console.postV1("/ide/stop", body), "停止开发机");
        console.log(`✅ 已提交停止: ${r.message ?? r.status?.message ?? "ok"}`);
      } finally { await closeChannel(channel); }
    });

  program.command("delete")
    .description("删除开发机（不可恢复）")
    .argument("<id>", "开发机 ID", intArg)
    .requiredOption("--yes", "确认删除（必须显式给出）")
    .action(async (id, options) => {
      const channel = await pickChannel({ prefer: "official", force: options.channel });
      try {
        if (channel.mode === "official") {
          const r = requireOfficialOk(await channel.official.call("deleteIde", { ideId: id }), "删除开发机");
          console.log(`🗑️  已提交删除: ${r.status?.message ?? "ok"}`);
          return;
        }
        const r = requireOk(await channel.console.deleteV1(`/ide/delete/${id}`), "删除开发机");
        console.log(`🗑️  已提交删除: ${r.message ?? r.status?.message ?? "ok"}`);
      } finally { await closeChannel(channel); }
    });

  program.command("rename")
    .description("修改别名（空串清除；官方 API 无此端点，仅控制台通道）")
    .argument("<id>", "开发机 ID", intArg)
    .argument("<alias>", "新别名")
    .action(async (id, alias, options) => {
      const channel = await pickChannel({ prefer: "console", force: options.channel });
      try {
        const r = requireOk(await channel.console.postV1("/ide/updateAlias", { id, alias }), "修改别名");
        console.log(`✅ ${r.message ?? r.status?.message ?? "ok"}`);
      } finally { await closeChannel(channel); }
    });

  program.command("create")
    .description("创建开发机（默认复制监控配置；依赖控制台通道的 space 级存储挂载）")
    .option("--dry-run", "只打印提交体")
    .option("--yes", "确认提交（真实写操作）")
    .option("--projectName <name>", "企业项目名")
    .option("--region <name>", "可用区 (zj-pinghu-1)")
    .option("--queue <name>", "队列名")
    .option("--gpuModel <model>", "GPU 型号")
    .option("--cards <n>", "GPU 卡数", intArg)
    .option("--image <name>", "公共框架镜像名")
    .option("--ssh-key <name>", "SSH 公钥名")
    .option("--storage <name>", "科研文件存储名（不挂省略）")
    .option("--space <name>", "科研空间名")
    .option("--name <name>", "机器名（缺省 dev-env-随机）")
    .option("--local-gb <n>", "本地盘扩容 GB", intArg)
    .option("--local-mount <path>", "挂载点 (/research)")
    .option("--local-ephemeral", "本地盘不持久")
    .option("--ssh-dedicated", "专属 EIP 模式")
    .option("--ssh-ips <ips>", "SSH 白名单 IP")
    .option("--auto-stop <n>", "自动停止策略", intArg)
    .option("--stop-duration <n>", "停止时长", intArg)
    .option("--count <n>", "创建台数", intArg)
    .action(async options => {
      if (options.channel === "official") {
        throw new Error("create 依赖控制台通道（space 级科研存储挂载 + 企业项目发现，官方 createIde 仅 storageId 粒度）。请先 ctyun login");
      }
      const channel = await pickChannel({ prefer: "console", force: options.channel });
      try {
        const client = channel.console;
        const opts = {
          projectName: options.projectName, regionNameEng: options.region, queueName: options.queue,
          gpuModel: options.gpuModel, gpuCards: options.cards, imageName: options.image,
          sshKeyName: options.sshKey, researchStorageName: options.storage, researchSpaceName: options.space,
          machineName: options.name, localExpansionGb: options.localGb, localMountPath: options.localMount,
          localPersistence: options.localEphemeral ? false : undefined,
          sshShareType: options.sshDedicated ? "Dedicated" : undefined,
          sshClientIps: options.sshIps, autoStop: options.autoStop, stopDuration: options.stopDuration,
          count: options.count,
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
        if (options.dryRun) {
          console.log("\n[dry-run] POST /bc/v1/ide/batch/create");
          console.log(JSON.stringify(buildBatchCreateRequest(discovered.formData), null, 2));
          return;
        }
        if (!options.yes) throw new Error("创建开发机是真实写操作。确认参数无误后加 --yes 提交（或先 --dry-run 预览）");
        const { response, clamped, requestedGb, submitGb } = await submitCreate(client, discovered);
        if (clamped) console.log(`⚠️ 本地盘库存收缩: 请求 ${requestedGb}GB → 提交 ${submitGb}GB`);
        console.log(`✅ 创建已提交: ${response.message ?? "ok"}（到 ctyun envs 查看启动进度）`);
      } finally { await closeChannel(channel); }
    });

  // ===== 资源查询 =====

  program.command("queues")
    .description("各区域队列 GPU 占用（需要控制台会话：官方 API 无已用 GPU 字段）")
    .option("--json", "JSON 输出")
    .action(async options => {
      const channel = await pickChannel({ prefer: "console", force: options.channel });
      try {
        const client = channel.console;
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
        if (options.json) { console.log(JSON.stringify(out, null, 2)); return; }
        table([
          ["区域", "队列", "已用/总GPU", "空闲"],
          ...out.map(q => [q.region, q.queue, `${q.usedGpu}/${q.totalGpu}`, String(q.totalGpu - q.usedGpu)]),
        ]);
      } finally { await closeChannel(channel); }
    });

  program.command("pool")
    .description("监控目标队列快照（需要控制台会话：meetNeed/sellout 语义）")
    .option("--json", "JSON 输出")
    .action(async options => {
      const channel = await pickChannel({ prefer: "console", force: options.channel });
      try {
        const { snapshotQueue } = await import("./pool.mjs");
        const snap = await snapshotQueue(channel.console);
        if (options.json) { console.log(JSON.stringify(snap, null, 2)); return; }
        console.log(`队列:   ${snap.queue} (${snap.region})`);
        console.log(`GPU:    ${snap.usedGpu}/${snap.totalGpu} 已用, 空闲 ${snap.freeGpu}`);
        console.log(`售罄:   ${snap.sellout === 1 ? "是" : "否"}   满足需求: ${snap.meetNeed === 1 ? "是" : snap.meetNeed === 2 ? "否" : String(snap.meetNeed)}`);
        console.log(`可提交: ${snap.ready ? "✅ 是" : "❌ 否"}`);
      } finally { await closeChannel(channel); }
    });

  program.command("images [keyword]")
    .description("公共框架镜像")
    .option("--region <r>", "可用区过滤（控制台通道）")
    .action(async (keyword, options) => {
      const channel = await pickChannel({ prefer: "official", force: options.channel });
      try {
        if (channel.mode === "official") {
          const ret = requireOfficialOk(await channel.official.call("listPublicImages", { pageNum: 1, pageSize: 100, imageType: 0 }), "读取镜像");
          const list = keyword ? (ret.images ?? []).filter(i => i.name.includes(keyword)) : (ret.images ?? []);
          for (const i of list) console.log(`  ${i.imageId}  ${i.name}`);
          return;
        }
        const regions = await resolveRegion(channel.console, options.region);
        for (const region of regions) {
          const images = requireOk(await channel.console.getV1("/ide/image/list", {
            arch: region.arch, productType: 1, imageType: 0, "paging.page": 1, "paging.perPage": 999,
          }), "读取镜像").images ?? [];
          const list = keyword ? images.filter(i => i.name.includes(keyword)) : images;
          if (!options.region) console.log(`—— ${region.regionNameEng} ——`);
          for (const i of list) console.log(`  ${i.imageId}  ${i.name}`);
        }
      } finally { await closeChannel(channel); }
    });

  program.command("specs")
    .description("开发机规格（控制台通道）")
    .option("--region <r>", "可用区过滤")
    .action(async options => {
      const channel = await pickChannel({ prefer: "console", force: options.channel });
      try {
        const client = channel.console;
        const pid = await getProjectId(client);
        const regions = await resolveRegion(client, options.region);
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
      } finally { await closeChannel(channel); }
    });

  program.command("keys")
    .description("SSH 公钥")
    .option("--json", "JSON 输出")
    .action(async options => {
      const channel = await pickChannel({ prefer: "official", force: options.channel });
      try {
        let keys;
        if (channel.mode === "official") {
          keys = requireOfficialOk(await channel.official.call("listPublicKeys", { pageNum: 1, pageSize: 100 }), "读取公钥").publicKeyInfo ?? [];
        } else {
          keys = requireOk(await channel.console.postV1("/ide/publicKey/list", {}), "读取公钥").publicKeyInfo ?? [];
        }
        if (options.json) { console.log(JSON.stringify(keys, null, 2)); return; }
        for (const k of keys) console.log(`${k.id}  ${k.name}  (${(k.createTime ?? "").slice(0, 10)})`);
      } finally { await closeChannel(channel); }
    });

  program.command("jobs")
    .description("训练作业列表")
    .option("--json", "JSON 输出")
    .option("--perPage <n>", "每页条数（默认 20）", intArg)
    .action(async options => {
      const channel = await pickChannel({ prefer: "official", force: options.channel });
      try {
        let jobs;
        if (channel.mode === "official") {
          jobs = requireOfficialOk(await channel.official.call("listTrainingJobs", { pageNum: 1, pageSize: options.perPage ?? 20 }), "读取训练作业").trainingJobs ?? [];
        } else {
          const projectId = await getProjectId(channel.console);
          jobs = requireOk(await channel.console.getV1("/job/list", {
            projectId, "paging.page": 1, "paging.perPage": options.perPage ?? 20,
          }), "读取训练作业").jobs ?? [];
        }
        if (options.json) { console.log(JSON.stringify(jobs, null, 2)); return; }
        const rows = jobs.map(j => [
          String(j.trainingJobId ?? j.id), j.name ?? "-", j.stateName ?? j.state ?? String(j.state ?? "-"),
          j.gpuNum ?? "-", (j.createTime ?? j.createdAt ?? "-") + "",
        ]);
        table([["ID", "名称", "状态", "GPU", "创建时间"], ...rows]);
      } finally { await closeChannel(channel); }
    });

  program.command("pvc")
    .description("开发机挂载的存储卷（官方 API 无 PVC 明细，仅控制台通道）")
    .argument("<ideId>", "开发机数字 ID", intArg)
    .option("--json", "JSON 输出")
    .action(async (key, options) => {
      const channel = await pickChannel({ prefer: "console", force: options.channel });
      try {
        const client = channel.console;
        const info = requireOk(await client.getV1("/ide/get", { id: key }), "读取开发机");
        const r = requireOk(await client.request("GET", "/storage/pvc/list", {
          params: { resourceId: info.resourceId, queueId: info.queueId, "paging.page": 1, "paging.perPage": 50 },
        }), "读取存储卷");
        const pvcs = r.storagePvcs ?? [];
        if (options.json) { console.log(JSON.stringify(pvcs, null, 2)); return; }
        const rows = pvcs.map(p => [String(p.pvcName ?? p.name ?? "-"), String(p.pvSizeGb ?? p.sizeGb ?? p.capacity ?? "-"), p.status ?? "-", p.mountPath ?? p.mountPathInfo ?? "-"]);
        table([["名称", "容量(GB)", "状态", "挂载点"], ...rows]);
      } finally { await closeChannel(channel); }
    });

  program.command("metrics")
    .description("CPU/内存/GPU 利用率（objectUuid 从 env <id> --json 的 uuid 字段取）")
    .argument("<uuid>", "资源实例 UUID")
    .option("--json", "JSON 输出")
    .option("--minutes <n>", "时间窗（官方通道，默认 10，需 5-1440）", intArg)
    .action(async (uuid, options) => {
      const channel = await pickChannel({ prefer: "official", force: options.channel });
      try {
        if (channel.mode === "official") {
          const minutes = options.minutes ?? 10;
          const now = Math.floor(Date.now() / 1000);
          const ret = requireOfficialOk(await channel.official.call("getResourceUsageRate", {
            objectType: "ide", objectUuid: uuid, startTime: now - minutes * 60, endTime: now,
          }), "读取利用率指标");
          const metrics = ret.metrics ?? ret;
          if (options.json) { console.log(JSON.stringify(metrics, null, 2)); return; }
          const names = { cpuUsageRate: "CPU", memUsageRate: "内存", gpuUsageRate: "GPU", gpuMemUsageRate: "显存" };
          for (const [key, label] of Object.entries(names)) {
            const series = metrics[key];
            if (!Array.isArray(series) || !series.length) continue;
            // 每个 Pod 取最后一个数据点，再取平均
            const values = series.map(pod => {
              const points = pod.data ?? [];
              const last = points[points.length - 1] ?? {};
              return Number(last.usageRate ?? last.value ?? NaN);
            }).filter(v => Number.isFinite(v));
            if (values.length) console.log(`${label}: ${(values.reduce((a, b) => a + b, 0) / values.length).toFixed(1)}%`);
          }
          return;
        }
        const r = requireOk(await channel.console.request("POST", "/monitor/getResourceUsageRateMetrics", {
          json: { objectType: "ide", metric: [1, 2, 3], objectUuid: uuid },
        }), "读取利用率指标");
        const names = { cpu_usage_rate: "CPU", mem_usage_rate: "内存", gpu_usage_rate: "GPU" };
        if (options.json) { console.log(JSON.stringify(r.metricDataInfo ?? [], null, 2)); return; }
        for (const item of r.metricDataInfo ?? []) {
          console.log(`${names[item.metricName] ?? item.metricName}: ${Number(item.usageRate).toFixed(1)}%`);
        }
      } finally { await closeChannel(channel); }
    });

  // ===== Jupyter 通道（免 SSH 操作开发机） =====

  program.command("jexec")
    .description("经 Jupyter kernel 执行代码 (Python 代码 | 文件.py | cmd:shell命令)")
    .argument("<ideId>", "开发机 ID", intArg)
    .argument("[spec...]", "python代码 | 文件.py | cmd:shell命令")
    .action(async (id, specParts, options) => {
      const spec = specParts.join(" ");
      if (!spec) throw new Error("用法: ctyun jexec <ideId> <python代码 | 文件.py | cmd:shell命令>");
      const { channel, info } = await ideDetail(options, id);
      try {
        let code;
        if (spec.startsWith("cmd:")) {
          code = `import subprocess\nprint(subprocess.run(${JSON.stringify(spec.slice(4))}, shell=True, capture_output=True, text=True, timeout=120).stdout)`;
        } else if (/\.py$/.test(spec)) {
          const { readFileSync } = await import("node:fs");
          code = readFileSync(spec, "utf8");
        } else {
          code = spec;
        }
        const jchannel = await channelFromEnv(info).init();
        const out = await jchannel.exec(code, { timeoutMs: 180000 });
        process.stdout.write(out.endsWith("\n") ? out : out + "\n");
      } finally { await closeChannel(channel); }
    });

  program.command("ssh-setup")
    .description("注入公钥到开发机 authorized_keys（幂等）")
    .argument("<ideId>", "开发机 ID", intArg)
    .option("--key <path>", "公钥文件路径（默认 ~/.ssh/id_ed25519.pub）")
    .action(async (id, options) => {
      const { channel, info } = await ideDetail(options, id);
      try {
        const keyPath = options.key ?? "~/.ssh/id_ed25519.pub";
        const pubPath = keyPath.startsWith("~") ? keyPath.replace("~", process.env.HOME) : keyPath;
        const { readFileSync } = await import("node:fs");
        const pubLine = readFileSync(pubPath, "utf8").trim();
        if (!pubLine.startsWith("ssh-")) throw new Error(`不是合法公钥文件: ${pubPath}`);
        console.log(`目标: ${info.ideName ?? info.name} (${statusName(info.states)})`);
        console.log(`公钥: ${pubLine.slice(0, 50)}… ${pubLine.split(/\s+/).pop()}`);
        const jchannel = await channelFromEnv(info).init();
        const r = await injectSshKey(jchannel, pubLine);
        console.log(r.added ? `✅ 已注入 (authorized_keys 现有 ${r.totalKeys} 把):` : `已存在 (无需重复注入), 现有 ${r.totalKeys} 把:`);
        for (const k of r.keys) console.log(`  ${k}`);
      } finally { await closeChannel(channel); }
    });

  // ===== 其他 =====

  program.command("raw")
    .description("直接调控制台 API (如 raw GET /ide/summary；退出码反映业务码)")
    .argument("<method>", "HTTP 方法")
    .argument("<path>", "API 路径 (如 /ide/summary)")
    .argument("[body]", "JSON 请求体")
    .action(async (method, route, bodyText, options) => {
      const channel = await pickChannel({ prefer: "console", force: options.channel });
      try {
        const body = bodyText ? JSON.parse(bodyText) : undefined;
        const r = await channel.console.request(method.toUpperCase(), route, body !== undefined ? { json: body } : {});
        console.log(JSON.stringify(r.json ?? r.text, null, 2));
        const bizCode = r.json?.status?.code;
        if (r.status !== 200 || (bizCode !== undefined && bizCode !== "ok")) process.exitCode = 1;
      } finally { await closeChannel(channel); }
    });

  program.command("whoami")
    .description("项目/身份信息（仅控制台通道）")
    .action(async () => {
      const channel = await pickChannel({ prefer: "console" });
      try {
        const projects = requireOk(await channel.console.postV1("/bc/project/list", { action_name: ["bc:job:create"] }), "读取项目").projects ?? [];
        for (const p of projects.filter(x => x.status === 1)) {
          console.log(`项目: ${p.projectName}  (${p.projectId})`);
        }
      } finally { await closeChannel(channel); }
    });

  // 每个子命令都注册 --channel（Commander 命令选项与 program 级选项不互通，须逐个挂）
  for (const cmd of program.commands) {
    cmd.option("--channel <type>", "强制通道: official | console（默认自动选择）", channelArg);
  }
  return program;
}

export async function run(argv) {
  const program = buildProgram();
  await program.parseAsync(argv);
}
