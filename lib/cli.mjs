// ctyun CLI —— Commander 命令定义；双通道: 官方 OpenAPI (AK/SK) 优先，控制台会话补充
// 通道矩阵: 官方可达成 envs/env/start/stop/delete/keys/jobs/images/metrics/jexec/ssh-setup
//           仅控制台 create(space 级存储挂载)/queues(已用GPU)/pool(rename/pvc/whoami/raw
import { Command, InvalidArgumentError, Help as CommanderHelp } from "commander";
import fs from "node:fs/promises";
import { CtyunClient, requireOk } from "./ctyun-client.mjs";
import { statusName, billingName, gpuText, fmtDuration, table, OFFICIAL_STATE_TO_CONSOLE } from "./format.mjs";
import { loginWithCredentials, importFromMonitor, readCredentials, saveCredentials, sessionStatus, sessionPaths } from "./auth.mjs";
import { buildCreateFormData, submitCreate, buildBatchCreateRequest } from "./order.mjs";
import { JupyterChannel, channelFromEnv, injectSshKey } from "./jupyter.mjs";
import { OfficialClient, readAksk, saveAksk, clearAksk, requireOfficialOk, akskPath } from "./official-client.mjs";
import { pickChannel, closeChannel, consoleSessionExists } from "./channel.mjs";
import { readCliConfig, CONFIG_KEYS, CONFIG_FILE } from "./config.mjs";

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
export function normalizeOfficialIde(ide) {
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
    .showSuggestionAfterError()
    .configureOutput({
      writeErr: text => {
        process.stderr.write(text);
        if (/^error: (unknown|missing|required|invalid|option)/m.test(text) && !text.includes("ctyun --help")) {
          process.stderr.write("（运行 ctyun --help 查看全部命令）\n");
        }
      },
    })
    .addHelpText("after", `
通道说明:
  official  官方 OpenAPI (bc-global.ctapi.ctyun.cn)，凭据 ctyun aksk 配置，不过期
  console   控制台逆向通道 (esx.ctyun.cn)，凭据 ctyun login 登录，会话约 1 小时
  自动选择: 有 AK/SK 走官方。以下命令仅控制台通道可用（官方 API 无对应端点/权限）:
            create / pool / pvc / rename / whoami / raw / summary / events /
            infer * / keys（子账号——官方 listPublicKeys 仅主账号）
  强制指定: 每个命令都接受 --channel official|console (排障用)
  JSON 契约: --json 成功时输出 API 原始 JSON (stdout)；任何失败输出 {"ok":false,"error":…}
             到 stderr 且退出码非 0 —— jq 管道请先检查退出码
凭据目录: ~/.ctyun/ (aksk=官方密钥, credentials=控制台账密, session/=控制台会话, config=默认值)`);

  // ===== 认证与凭据 =====

  program.command("config")
    .description("查看用户默认配置（create/pool 缺省值来源；编辑 ~/.ctyun/config，环境变量 CTYUN_* 优先）")
    .action(async () => {
      const { values, sources } = await readCliConfig();
      console.log(`配置文件: ${CONFIG_FILE} (600)`);
      for (const [envName, prop] of Object.entries(CONFIG_KEYS)) {
        const v = values[prop];
        console.log(`${envName.padEnd(26)} ${v === undefined ? "(未设置)" : v}${sources[prop] ? `  [${sources[prop]}]` : ""}`);
      }
    });

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

  const envsListAction = async options => {
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
  };

  const envDetailAction = async (id, options) => {
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
      const regionLabel = info.regionNameEng && info.regionNameEng !== info.regionName
        ? `${info.regionName ?? "-"} (${info.regionNameEng})`
        : (info.regionName ?? info.regionNameEng ?? "-");
      console.log(`区域:     ${regionLabel}`);
      if (info.queueName || info.queueId) console.log(`队列:     ${info.queueName ?? info.queueId}${info.queueId ? ` (ctyun queues 查 ID 对照)` : ""}`);
      if (info.imageAddr || info.framework || info.imageName) console.log(`镜像:     ${info.imageAddr ?? info.imageName ?? info.framework}`);
      console.log(`SSH:      ${info.sshCommand ?? "(未启用)"}`);
      console.log(`Jupyter:  ${info.openLink ?? "-"}`);
      if (info.servicePortEnabled && info.servicePortMap) {
        for (const [port, addr] of Object.entries(info.servicePortMap)) console.log(`端口 ${port}: ${addr}`);
      }
      console.log(`创建:     ${(info.createTime ?? "-").replace(/T(\d{2}:\d{2})[^+]*/, " $1")}`);
      if (info.localStorageInfo?.pvSize) console.log(`本地盘:   ${info.localStorageInfo.pvSize}GB @ ${info.localStorageInfo.mountPath}`);
      if (Number(info.leftTime) > 0) console.log(`自动停止: ${fmtDuration(Number(info.leftTime))} 后`);
    } finally { await closeChannel(channel); }
  };

  const envCmd = program.command("env")
    .description("开发机（ctyun env <id> = 详情，env list = 列表；生命周期用顶层 start/stop/delete/rename/create）")
    .argument("[id]", "开发机 ID（直接查看详情；缺省打印组帮助）", intArg)
    .option("--ssh", "只打印 SSH 命令与 Jupyter 链接")
    .option("--json", "JSON 输出")
    .action(async (id, options) => {
      if (id === undefined) {
        envCmd.outputHelp();
        process.exitCode = 1;
        return;
      }
      await envDetailAction(id, options);
    });

  envCmd.command("help", { hidden: true })
    .description("显示组帮助")
    .action(() => { envCmd.outputHelp(); });

  envCmd.command("list")
    .description("开发机列表")
    .option("--json", "JSON 输出")
    .option("--perPage <n>", "每页条数（默认 100）", intArg)
    .option("--all-projects", "不过滤企业项目（控制台通道）")
    .action(envsListAction);



  const envStartAction = async (id, options) => {
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
        id: info.id, ideName: info.ideName ?? info.name, autoStop: info.autoStop, stopDuration: info.stopDuration,
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
  };

  const envStopAction = async (id, options) => {
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
  };

  const envDeleteAction = async (id, options) => {
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
  };

  const envRenameAction = async (id, alias, options) => {
    const channel = await pickChannel({ prefer: "console", force: options.channel });
    try {
      const r = requireOk(await channel.console.postV1("/ide/updateAlias", { id, alias }), "修改别名");
      console.log(`✅ ${r.message ?? r.status?.message ?? "ok"}`);
    } finally { await closeChannel(channel); }
  };

  const envCreateAction = async options => {
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
      const localReqGb = discovered.formData.localPv[0]?.size ?? 0;
      console.log(`  本地盘: 扩容上限 ${discovered.localDiskLimit.maxExpansionGb}GB, 本次扩容 ${localReqGb}GB + 基础 50GB = 提交 ${localReqGb + 50}GB`);
      if (options.dryRun) {
        console.log("\n[dry-run] POST /bc/v1/ide/batch/create");
        console.log(JSON.stringify(buildBatchCreateRequest(discovered.formData), null, 2));
        return;
      }
      if (!options.yes) throw new Error("创建开发机是真实写操作。确认参数无误后加 --yes 提交（或先 --dry-run 预览）");
      const { response, clamped, requestedGb, submitGb } = await submitCreate(client, discovered);
      if (clamped) console.log(`⚠️ 本地盘库存收缩: 请求 ${requestedGb}GB → 提交 ${submitGb}GB`);
      console.log(`✅ 创建已提交: ${response.message ?? "ok"}（到 ctyun env list 查看启动进度）`);
    } finally { await closeChannel(channel); }
  };

  // 顶层平铺动词保留为开发机操作的主入口（主资源约定）；env 组下等价重复挂载
  program.command("start")
    .description("启动开发机（仅已停止/失败/异常态）")
    .argument("<id>", "开发机 ID", intArg)
    .option("--cpu-only", "仅 CPU 启动（仅控制台通道支持 startMode）")
    .option("--dry-run", "只打印请求体")
    .action(envStartAction);

  program.command("stop")
    .description("停止开发机（释放 GPU，数据保留）")
    .argument("<id>", "开发机 ID", intArg)
    .option("--dry-run", "只打印请求体")
    .action(envStopAction);

  program.command("delete")
    .description("删除开发机（不可恢复）")
    .argument("<id>", "开发机 ID", intArg)
    .requiredOption("--yes", "确认删除（必须显式给出）")
    .action(envDeleteAction);

  program.command("rename")
    .description("修改开发机别名（空串清除；仅控制台通道）")
    .argument("<id>", "开发机 ID", intArg)
    .argument("<alias>", "新别名")
    .action(envRenameAction);

  program.command("create")
    .description("创建开发机（默认=用户配置 ~/.ctyun/config；依赖控制台通道）")
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
    .option("--local-gb <n>", "本地盘扩容 GB（实际提交 = 扩容 + 50GB 基础）", intArg)
    .option("--local-mount <path>", "挂载点 (/research)")
    .option("--local-ephemeral", "本地盘不持久")
    .option("--ssh-dedicated", "专属 EIP 模式")
    .option("--ssh-ips <ips>", "SSH 白名单 IP")
    .option("--auto-stop <n>", "自动停止策略", intArg)
    .option("--stop-duration <n>", "停止时长", intArg)
    .option("--count <n>", "创建台数", intArg)
    .action(envCreateAction);

  // ===== 资源查询 =====

  program.command("queues")
    .description("队列与 GPU 占用（官方: listQueues+实例配额；控制台: 专属池队列）")
    .option("--json", "JSON 输出")
    .action(async options => {
      const channel = await pickChannel({ prefer: "official", force: options.channel });
      try {
        const out = [];
        if (channel.mode === "official") {
          const queues = requireOfficialOk(await channel.official.call("listQueues", { pageNum: 1, pageSize: 100 }), "读取队列").queues ?? [];
          for (const q of queues) {
            let usedGpu = null;
            try {
              const quota = requireOfficialOk(await channel.official.call("getInstancesAndQuota", { queueId: q.id }), "读取实例配额").data;
              usedGpu = Number(quota?.quota?.gpu?.used ?? NaN);
            } catch { /* 单队列配额失败不阻塞整体 */ }
            out.push({
              pool: q.resourcePoolName, queue: q.queueName, id: q.id,
              usedGpu, totalGpu: Number(q.capabilityGpu ?? 0), state: q.state,
            });
          }
        } else {
          const client = channel.console;
          const pid = await getProjectId(client);
          for (const region of await listRegions(client)) {
            const queues = requireOk(await client.getV1("/queue/list", {
              resourceId: region.resourceId, regionNameEng: region.regionNameEng, projectId: pid, poolType: "exclusive",
            }), `读取队列 ${region.regionNameEng}`).queues ?? [];
            for (const q of queues) out.push({
              region: region.regionNameEng, regionName: region.regionName, queue: q.queueName,
              id: q.id, usedGpu: Number(q.allocated?.gpu ?? 0), totalGpu: Number(q.capabilityGpu ?? 0),
            });
          }
        }
        if (options.json) { console.log(JSON.stringify(out, null, 2)); return; }
        const hasRegion = out.some(q => q.region);
        table([
          hasRegion ? ["区域", "队列", "ID", "已用/总GPU", "空闲"] : ["资源池", "队列", "ID", "已用/总GPU", "空闲", "状态"],
          ...out.map(q => hasRegion
            ? [q.region, q.queue, String(q.id), `${q.usedGpu}/${q.totalGpu}`, String(q.totalGpu - q.usedGpu)]
            : [q.pool ?? "-", q.queue, String(q.id), `${q.usedGpu ?? "?"}/${q.totalGpu}`, q.usedGpu == null ? "?" : String(q.totalGpu - q.usedGpu), q.state ?? "-"]),
        ]);
      } finally { await closeChannel(channel); }
    });

  const poolSnapshotAction = async options => {
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
  };

  const poolCmd = program.command("pool")
    .description("监控目标队列快照：GPU 占用/售罄/配额/可提交（目标来自 ~/.ctyun/config）。注意与 pool list（资源池清单）是两回事")
    .option("--json", "JSON 输出")
    .action(poolSnapshotAction);


  const imagesAction = async (keyword, options) => {
    const channel = await pickChannel({ prefer: "official", force: options.channel });
    try {
      if (options.custom) {
        let list;
        if (channel.mode === "official") {
          list = requireOfficialOk(await channel.official.call("listCustomerIdeImages", { pageNum: 1, pageSize: 100 }), "读取自定义镜像").images ?? [];
        } else {
          list = requireOk(await channel.console.getV1("/ide/user_image/list", { "paging.page": 1, "paging.perPage": 100 }), "读取私有镜像").images ?? [];
        }
        const filtered = keyword ? list.filter(i => i.name.includes(keyword)) : list;
        table([["ID", "名称", "状态"], ...filtered.map(i => [String(i.imageId ?? i.id), `${i.name}:${i.imageTag ?? ""}`, i.state ?? "-"])]);
        return;
      }
      if (channel.mode === "official") {
        const ret = requireOfficialOk(await channel.official.call("listPublicImages", { pageNum: 1, pageSize: 100, imageType: 0 }), "读取镜像");
        const list = keyword ? (ret.images ?? []).filter(i => i.name.includes(keyword)) : (ret.images ?? []);
        table([["ID", "名称"], ...list.map(i => [String(i.imageId), i.name])]);
        return;
      }
      const regions = await resolveRegion(channel.console, options.region);
      for (const region of regions) {
        const images = requireOk(await channel.console.getV1("/ide/image/list", {
          arch: region.arch, productType: 1, imageType: 0, "paging.page": 1, "paging.perPage": 999,
        }), "读取镜像").images ?? [];
        const list = keyword ? images.filter(i => i.name.includes(keyword)) : images;
        if (!options.region) console.log(`—— ${region.regionNameEng} ——`);
        table([["ID", "名称"], ...list.map(i => [String(i.imageId), i.name])]);
      }
    } finally { await closeChannel(channel); }
  };



  program.command("specs")
    .description("开发机规格（官方通道含售罄状态；控制台通道按队列）")
    .option("--region <r>", "可用区过滤")
    .action(async options => {
      const channel = await pickChannel({ prefer: "official", force: options.channel });
      try {
        if (channel.mode === "official") {
          const pools = requireOfficialOk(await channel.official.call("listResources", { pageNum: 1, pageSize: 100 }), "读取资源池").resources ?? [];
          for (const pool of pools) {
            const regions = requireOfficialOk(await channel.official.call("listResourceRegions", { resourcePoolId: pool.id }), "读取可用区").resourceRegionInfo ?? [];
            for (const region of regions) {
              if (options.region && region.regionName !== options.region) continue;
              const specs = requireOfficialOk(await channel.official.call("listResourceSpecs", {
                resourcePoolId: pool.id, regionName: region.regionName, pageNum: 1, pageSize: 100,
              }), "读取规格").specs ?? [];
              if (!specs.length) continue;
              console.log(`—— ${region.regionName} (${region.regionCnName ?? ""}) ——`);
              table([
                ["规格ID", "GPU", "CPU", "内存", "售罄", "类型"],
                ...specs.map(s => [String(s.id), `${s.quotaGpu}x ${s.gpuModel ?? ""}`, String(s.quotaCpu), `${s.quotaMem}GB`, s.sellout === "SOLDOUT" ? "售罄" : "有货", s.specType ?? "-"]),
              ]);
            }
          }
          return;
        }
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

  const keysListAction = async options => {
    let channel = await pickChannel({ prefer: "official", force: options.channel });
    try {
      let keys;
      if (channel.mode === "official") {
        try {
          keys = requireOfficialOk(await channel.official.call("listPublicKeys", { pageNum: 1, pageSize: 100 }), "读取公钥").publicKeyInfo ?? [];
        } catch (e) {
          // 子账号对官方 listPublicKeys 无权限（Only the primary account…）→ 控制台通道兜底
          if (!await consoleSessionExists()) throw e;
          await closeChannel(channel);
          channel = await pickChannel({ prefer: "console", force: "console" });
          try {
            keys = requireOk(await channel.console.postV1("/ide/publicKey/list", {}), "读取公钥").publicKeyInfo ?? [];
          } catch (fallbackError) {
            // 级联失败汇总为一条可行动的结论，而非两条堆叠的报错
            throw new Error(`两条通道均不可用 —— 官方: 子账号无权限（预期内，listPublicKeys 仅主账号）；控制台: ${fallbackError.message}。请运行: ctyun login 后重试`);
          }
        }
      } else {
        keys = requireOk(await channel.console.postV1("/ide/publicKey/list", {}), "读取公钥").publicKeyInfo ?? [];
      }
      if (options.json) { console.log(JSON.stringify(keys, null, 2)); return; }
      table([["ID", "名称", "创建时间"], ...keys.map(k => [String(k.id), k.name, (k.createTime ?? "").slice(0, 10)])]);
    } finally { await closeChannel(channel); }
  };



  const jobsListAction = async options => {
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
      if (!jobs.length) {
        console.log("(空——本通道仅返回当前可见/活跃作业；历史与已完结作业的计数见 ctyun summary)");
        return;
      }
      const rows = jobs.map(j => [
        String(j.trainingJobId ?? j.id), j.name ?? "-", j.stateName ?? j.state ?? String(j.state ?? "-"),
        j.gpuNum ?? "-", (j.createTime ?? j.createdAt ?? "-") + "",
      ]);
      table([["ID", "名称", "状态", "GPU", "创建时间"], ...rows]);
    } finally { await closeChannel(channel); }
  };



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

  // ===== 总览 / 批量操作 / 推理服务（控制台逆向通道） =====

  program.command("summary")
    .description("开发机/作业/资源池状态计数总览")
    .option("--json", "JSON 输出")
    .action(async options => {
      const channel = await pickChannel({ prefer: "console", force: options.channel });
      try {
        const client = channel.console;
        const [ide, job, resource] = await Promise.all([
          requireOk(await client.getV1("/ide/summary", {}), "读取开发机总览"),
          requireOk(await client.getV1("/job/summary", {}), "读取作业总览"),
          requireOk(await client.getV1("/resource/summary", {}), "读取资源总览"),
        ]);
        if (options.json) { console.log(JSON.stringify({ ide, job, resource }, null, 2)); return; }
        const flat = (obj, prefix) => {
          for (const [k, v] of Object.entries(obj ?? {})) {
            if (k === "requestId" || k === "status") continue;
            if (v && typeof v === "object") flat(v, `${prefix}${k}.`);
            else console.log(`${prefix}${k}: ${v}`);
          }
        };
        console.log("—— 开发机 ——"); flat(ide, "  ");
        if (Number(ide?.demandSummary?.totalNum ?? 1) === 0 && Number(ide?.periodSummary?.totalNum ?? 1) === 0) {
          console.log("  (口径说明: 控制台 summary 按需求单统计，本账号为 0——机器清单以 ctyun env list 为准)");
        }
        console.log("—— 作业 ——"); flat(job, "  ");
        const jobTotal = Number(job?.summary?.totalNum ?? job?.totalNum ?? 0);
        if (jobTotal > 0) console.log(`  (口径说明: summary 统计含历史/已完结作业 ${jobTotal} 条；当前作业清单以 ctyun job list 为准)`);
        console.log("—— 资源池 ——"); flat(resource, "  ");
      } finally { await closeChannel(channel); }
    });

  program.command("batch-start")
    .description("批量启动开发机")
    .argument("<id...>", "开发机 ID 列表")
    .action(async (ids, options) => {
      const channel = await pickChannel({ prefer: "console", force: options.channel });
      try {
        const r = requireOk(await channel.console.postV1("/ide/batchLaunch", { ids: ids.map(Number) }), "批量启动");
        console.log(`✅ 已批量提交启动 ${ids.length} 台: ${r.message ?? r.status?.message ?? "ok"}`);
      } finally { await closeChannel(channel); }
    });

  program.command("batch-stop")
    .description("批量停止开发机")
    .argument("<id...>", "开发机 ID 列表")
    .action(async (ids, options) => {
      const channel = await pickChannel({ prefer: "console", force: options.channel });
      try {
        const r = requireOk(await channel.console.postV1("/ide/batchStop", { ids: ids.map(Number) }), "批量停止");
        console.log(`✅ 已批量提交停止 ${ids.length} 台: ${r.message ?? r.status?.message ?? "ok"}`);
      } finally { await closeChannel(channel); }
    });

  program.command("my-ip")
    .description("探测当前出口 IP（可填 SSH 白名单）")
    .action(async options => {
      const channel = await pickChannel({ prefer: "console", force: options.channel });
      try {
        const r = requireOk(await channel.console.postV1("/predefClientIPs/getClientIP", {}), "探测出口 IP");
        const ip = r.clientIp ?? r.ip ?? r.clientIP;
        if (ip) {
          console.log(`出口 IP: ${ip}  (CIDR: ${ip}/32)`);
        } else {
          console.error("⚠️ API 未返回出口 IP（该端点可能需要 project_space 上下文）。兜底: curl -s ifconfig.me");
          process.exitCode = 1;
        }
      } finally { await closeChannel(channel); }
    });

  const infer = program.command("infer")
    .description("推理服务（官方 API 无此域，控制台逆向通道）");

  infer.command("list")
    .description("推理服务列表")
    .option("--json", "JSON 输出")
    .action(async options => {
      const channel = await pickChannel({ prefer: "console", force: options.channel });
      try {
        const r = requireOk(await channel.console.getV1("/infer_service/list", { "paging.page": 1, "paging.perPage": 100 }), "读取推理服务");
        const list = r.inferServices ?? r.services ?? [];
        if (options.json) { console.log(JSON.stringify(list, null, 2)); return; }
        table([
          ["ID", "名称", "状态", "框架", "创建时间"],
          ...list.map(s => [String(s.id), s.name ?? "-", s.stateName ?? s.state ?? "-", s.framework ?? "-", (s.createTime ?? "").slice(0, 10)]),
        ]);
      } finally { await closeChannel(channel); }
    });

  infer.command("get")
    .description("推理服务详情")
    .argument("<id>", "推理服务 ID", intArg)
    .option("--json", "JSON 输出")
    .action(async (id, options) => {
      const channel = await pickChannel({ prefer: "console", force: options.channel });
      try {
        const r = requireOk(await channel.console.getV1("/infer_service/detail", { id }), "读取推理服务详情");
        if (options.json) { console.log(JSON.stringify(r, null, 2)); return; }
        const d = r.inferService ?? r;
        console.log(`名称:   ${d.name ?? "-"}`);
        console.log(`ID:     ${d.id ?? id}`);
        console.log(`状态:   ${d.stateName ?? d.state ?? "-"}`);
        console.log(`框架:   ${d.framework ?? "-"}`);
        if (d.url) console.log(`调用:   ${d.url}`);
        console.log(`创建:   ${d.createTime ?? "-"}`);
      } finally { await closeChannel(channel); }
    });

  infer.command("start")
    .description("启动推理服务")
    .argument("<id>", "推理服务 ID", intArg)
    .action(async (id, options) => {
      const channel = await pickChannel({ prefer: "console", force: options.channel });
      try {
        const r = requireOk(await channel.console.postV1("/infer_service/launch", { id }), "启动推理服务");
        console.log(`✅ 已提交启动: ${r.message ?? r.status?.message ?? "ok"}`);
      } finally { await closeChannel(channel); }
    });

  infer.command("stop")
    .description("停止推理服务")
    .argument("<id>", "推理服务 ID", intArg)
    .action(async (id, options) => {
      const channel = await pickChannel({ prefer: "console", force: options.channel });
      try {
        const r = requireOk(await channel.console.postV1("/infer_service/stop", { id }), "停止推理服务");
        console.log(`✅ 已提交停止: ${r.message ?? r.status?.message ?? "ok"}`);
      } finally { await closeChannel(channel); }
    });

  infer.command("delete")
    .description("删除推理服务（不可恢复）")
    .argument("<id>", "推理服务 ID", intArg)
    .requiredOption("--yes", "确认删除（必须显式给出）")
    .action(async (id, options) => {
      const channel = await pickChannel({ prefer: "console", force: options.channel });
      try {
        const r = requireOk(await channel.console.deleteV1(`/infer_service/delete/${id}`), "删除推理服务");
        console.log(`🗑️  已提交删除: ${r.message ?? r.status?.message ?? "ok"}`);
      } finally { await closeChannel(channel); }
    });

  program.command("events")
    .description("操作审计日志")
    .option("--perPage <n>", "条数（默认 20）", intArg)
    .option("--json", "JSON 输出")
    .action(async options => {
      const channel = await pickChannel({ prefer: "console", force: options.channel });
      try {
        const r = requireOk(await channel.console.getV1("/bcProxy/ops/eventlog/list", {
          "paging.page": 1, "paging.perPage": options.perPage ?? 20,
        }), "读取操作日志");
        const list = r.opLogs ?? r.logs ?? [];
        if (options.json) { console.log(JSON.stringify(list, null, 2)); return; }
        // 事件时间戳为秒级 Unix，平台时区为北京时间
        const fmtTs = ts => Number(ts) > 0
          ? new Date(Number(ts) * 1000 + 8 * 3600 * 1000).toISOString().slice(0, 16).replace("T", " ")
          : String(ts ?? "-");
        table([
          ["时间", "操作", "对象", "操作者"],
          ...list.map(e => [fmtTs(e.createTime), e.action ?? "-", e.instanceName ?? e.object ?? "-", e.operatorName ?? e.email ?? "-"]),
        ]);
      } finally { await closeChannel(channel); }
    });

  // ===== 其他 =====

  program.command("api")
    .description("直接调官方 OpenAPI (POST /api/bc/v2/<action>，body 为 JSON 文本；退出码反映业务码)")
    .argument("<action>", "官方 API action 名 (如 listIdes)")
    .argument("[body]", "JSON 请求体")
    .action(async (action, bodyText, options) => {
      const channel = await pickChannel({ prefer: "official", force: options.channel });
      try {
        if (channel.mode !== "official") throw new Error("此命令需要官方通道。先运行: ctyun aksk");
        const body = bodyText ? JSON.parse(bodyText) : {};
        const r = await channel.official.call(action, body);
        console.log(JSON.stringify(r, null, 2));
        const bizCode = r?.returnObj?.status?.code;
        if (r?.statusCode !== "200" || (bizCode !== undefined && bizCode !== "ok")) process.exitCode = 1;
      } finally { await closeChannel(channel); }
    });

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
    .description("项目/身份信息（--verbose 附账号类型与权限码全集）")
    .option("--verbose", "附账号类型 + 权限码（解释各种 PermissionDenied）")
    .action(async options => {
      const channel = await pickChannel({ prefer: "console", force: options.channel });
      try {
        const projects = requireOk(await channel.console.postV1("/bc/project/list", { action_name: ["bc:job:create"] }), "读取项目").projects ?? [];
        for (const p of projects.filter(x => x.status === 1)) {
          console.log(`项目: ${p.projectName}  (${p.projectId})`);
        }
        if (!options.verbose) return;
        const account = requireOk(await channel.console.postV1("/account/type", {}), "读取账号类型");
        console.log(`账号类型: ${account.accountType ?? account.type ?? JSON.stringify(account).slice(0, 80)}`);
        const policy = requireOk(await channel.console.getV1("/permission/user/policy", {}), "读取权限码");
        const codes = (policy.allowPolicyList ?? []).map(c => typeof c === "string" ? c : c.actionName ?? c.name).filter(Boolean);
        const denied = (policy.denyPolicyList ?? []).map(c => typeof c === "string" ? c : c.actionName ?? c.name).filter(Boolean);
        if (codes.length) console.log(`权限码 (${codes.length}): ${codes.join(", ")}`);
        if (denied.length) console.log(`显式拒绝 (${denied.length}): ${denied.join(", ")}`);
      } finally { await closeChannel(channel); }
    });

  // ===== 训练作业（官方 OpenAPI；Argo 作业经控制台通道回退） =====

  const job = program.command("job")
    .description("训练作业（官方 OpenAPI 全生命周期；Argo 作业经控制台回退）");

  job.command("list")
    .description("作业列表")
    .option("--json", "JSON 输出")
    .option("--perPage <n>", "每页条数（默认 20）", intArg)
    .action(jobsListAction);

  job.command("get")
    .description("作业详情（含 podList——查日志的 podName 来源）")
    .argument("<trainingJobId>", "作业 ID（官方为 uuid；控制台 Argo 作业为数字 jobId）")
    .option("--json", "JSON 输出")
    .action(async (jobId, options) => {
      const channel = await pickChannel({ prefer: "official", force: options.channel });
      try {
        let job;
        if (channel.mode === "official") {
          job = requireOfficialOk(await channel.official.call("getTrainingJob", { trainingJobId: jobId }), "读取作业详情").trainingJob;
        } else {
          job = requireOk(await channel.console.getV1("/job/detail", { jobId }), "读取作业详情");
        }
        if (options.json) { console.log(JSON.stringify(job, null, 2)); return; }
        const j = job?.trainingJob ?? job;
        console.log(`名称:     ${j.name ?? "-"}`);
        console.log(`ID:       ${j.trainingJobId ?? jobId}`);
        console.log(`状态:     ${j.state ?? j.stateName ?? "-"}`);
        console.log(`框架:     ${j.trainingMode ?? "-"}`);
        console.log(`区域:     ${j.regionName ?? "-"}`);
        console.log(`创建:     ${j.createTime ?? "-"}`);
        for (const node of j.nodeConfigs ?? []) {
          console.log(`节点:     ${node.instanceCount}x spec#${node.specId} ${node.gpuModel ? `(${node.gpuModel})` : ""} ${node.imageAddress ?? ""}`);
        }
        for (const pod of j.podList ?? []) {
          console.log(`Pod:      ${pod.podName} (${pod.state ?? "-"})`);
        }
      } finally { await closeChannel(channel); }
    });

  job.command("create")
    .description("创建并行计算作业（官方 OpenAPI；镜像须公网可拉取）")
    .requiredOption("--name <name>", "作业名（小写字母/数字/中划线, 4-32 字符）")
    .requiredOption("--region <region>", "可用区英文名（specId 所属区域）")
    .requiredOption("--spec-id <id>", "规格 ID（ctyun specs 查看）", intArg)
    .requiredOption("--image <addr>", "公网镜像地址 (如 public.xxx.com/xxx:v1)")
    .option("--mode <mode>", "框架类型: MPI | PyTorch", "PyTorch")
    .option("--count <n>", "实例数（默认 1）", intArg)
    .option("--cmd <startCommand>", "启动命令")
    .option("--queue-id <id>", "队列 ID（不填自动选）", intArg)
    .option("--storage-id <id>", "科研存储 ID（挂载用）", intArg)
    .option("--storage-mount <path>", "科研存储挂载点 (默认 /research)")
    .option("--env <json>", '环境变量 JSON (如 \'{"K":"V"}\')')
    .option("--dry-run", "只打印请求体")
    .action(async options => {
      const channel = await pickChannel({ prefer: "official", force: options.channel });
      try {
        if (channel.mode !== "official") throw new Error("job create 需要官方通道。先运行: ctyun aksk");
        const body = {
          name: options.name, trainingMode: options.mode, regionName: options.region,
          nodeConfigs: [{
            specId: options.specId, instanceCount: options.count ?? 1,
            imageAddress: options.image, ...(options.cmd ? { startCommand: options.cmd } : {}),
          }],
        };
        if (options.queueId) body.queueId = options.queueId;
        if (options.storageId) {
          body.storageConfigs = [{ mountPath: options.storageMount ?? "/research", researchStorageConfigs: { storageId: options.storageId } }];
        }
        if (options.env) body.envConfigs = JSON.parse(options.env);
        if (options.dryRun) { console.log("[dry-run] POST /api/bc/v2/createTrainingJob"); console.log(JSON.stringify(body, null, 2)); return; }
        const r = requireOfficialOk(await channel.official.call("createTrainingJob", body), "创建作业");
        console.log(`✅ 作业已创建: ${r.trainingJobId}（ctyun job get <id> 查看状态）`);
      } finally { await closeChannel(channel); }
    });

  job.command("start")
    .description("启动并行计算作业（官方 OpenAPI）")
    .argument("<trainingJobId>", "作业 ID")
    .action(async (jobId, options) => {
      const channel = await pickChannel({ prefer: "official", force: options.channel });
      try {
        if (channel.mode !== "official") throw new Error("job start 需要官方通道。先运行: ctyun aksk");
        const r = requireOfficialOk(await channel.official.call("startTrainingJob", { trainingJobId: jobId }), "启动作业");
        console.log(`✅ 已提交启动: ${r.status?.message ?? "ok"}`);
      } finally { await closeChannel(channel); }
    });

  job.command("stop")
    .description("停止并行计算作业（官方 OpenAPI）")
    .argument("<trainingJobId>", "作业 ID")
    .action(async (jobId, options) => {
      const channel = await pickChannel({ prefer: "official", force: options.channel });
      try {
        if (channel.mode !== "official") throw new Error("job stop 需要官方通道。先运行: ctyun aksk");
        const r = requireOfficialOk(await channel.official.call("stopTrainingJob", { trainingJobId: jobId }), "停止作业");
        console.log(`✅ 已提交停止: ${r.status?.message ?? "ok"}`);
      } finally { await closeChannel(channel); }
    });

  job.command("delete")
    .description("删除并行计算作业（不可恢复）")
    .argument("<trainingJobId>", "作业 ID")
    .requiredOption("--yes", "确认删除（必须显式给出）")
    .action(async (jobId, options) => {
      const channel = await pickChannel({ prefer: "official", force: options.channel });
      try {
        if (channel.mode === "official") {
          const r = requireOfficialOk(await channel.official.call("deleteTrainingJob", { trainingJobId: jobId }), "删除作业");
          console.log(`🗑️  已提交删除: ${r.status?.message ?? "ok"}`);
        } else {
          const r = requireOk(await channel.console.postV1("/job/delete", { jobId }), "删除作业");
          console.log(`🗑️  已提交删除: ${r.message ?? r.status?.message ?? "ok"}`);
        }
      } finally { await closeChannel(channel); }
    });

  job.command("logs")
    .description("作业日志（官方 OpenAPI 独有；默认取第一个 pod，最近 60 分钟）")
    .argument("<trainingJobId>", "作业 ID")
    .option("--pod <podName>", "pod 名（默认取详情 podList 第一个）")
    .option("--minutes <n>", "时间窗分钟数（默认 60）", intArg)
    .option("--pageSize <n>", "日志条数上限（官方上限 100）", intArg)
    .action(async (jobId, options) => {
      const channel = await pickChannel({ prefer: "official", force: options.channel });
      try {
        if (channel.mode !== "official") throw new Error("job logs 需要官方通道。先运行: ctyun aksk");
        let podName = options.pod;
        if (!podName) {
          const detail = requireOfficialOk(await channel.official.call("getTrainingJob", { trainingJobId: jobId }), "读取作业详情").trainingJob;
          podName = detail?.podList?.[0]?.podName;
          if (!podName) throw new Error("作业详情无 podList（作业可能未运行过）——用 --pod 指定");
          console.error(`pod: ${podName}（--pod 可指定其他）`);
        }
        const end = Math.floor(Date.now() / 1000);
        const r = requireOfficialOk(await channel.official.call("queryTrainingJobLogs", {
          trainingJobId: jobId, podName,
          beginTimestamp: String(end - (options.minutes ?? 60) * 60),
          endTimestamp: String(end),
          ...(options.pageSize ? { pageSize: options.pageSize } : {}),
        }), "读取作业日志");
        // 官方按时间倒序返回
        for (const line of r.contents ?? []) console.log(line);
      } finally { await closeChannel(channel); }
    });

  // ===== SSH 公钥管理 =====

  const key = program.command("key")
    .description("SSH 公钥管理");

  key.command("list")
    .description("公钥列表")
    .option("--json", "JSON 输出")
    .action(keysListAction);

  key.command("add")
    .description("上传 SSH 公钥（默认读 ~/.ssh/id_ed25519.pub）")
    .argument("<name>", "公钥名（小写字母/数字/中划线, 4-32 字符）")
    .argument("[publicKey]", "公钥内容字符串（与 --file 二选一）")
    .option("--file <path>", "公钥文件路径")
    .action(async (name, publicKey, options) => {
      let pub = publicKey;
      if (!pub) {
        const keyPath = options.file ?? "~/.ssh/id_ed25519.pub";
        const pubPath = keyPath.startsWith("~") ? keyPath.replace("~", process.env.HOME) : keyPath;
        const { readFileSync } = await import("node:fs");
        pub = readFileSync(pubPath, "utf8").trim();
      }
      if (!/^ssh-(ed25519|rsa|dss)|^ecdsa-/.test(pub)) throw new Error("不是合法的 SSH 公钥内容");
      const channel = await pickChannel({ prefer: "official", force: options.channel });
      try {
        if (channel.mode === "official") {
          const r = requireOfficialOk(await channel.official.call("createPublicKey", { publicKey: pub, name }), "创建公钥");
          console.log(`✅ 已上传: ${name} (id ${r.id})`);
        } else {
          const r = requireOk(await channel.console.postV1("/ide/publicKey/create", { publicKey: pub, name }), "创建公钥");
          console.log(`✅ 已上传: ${name} (${r.message ?? r.status?.message ?? "ok"})`);
        }
      } finally { await closeChannel(channel); }
    });

  key.command("delete")
    .description("删除 SSH 公钥（须未被开发机使用）")
    .argument("<id>", "公钥 ID", intArg)
    .requiredOption("--yes", "确认删除（必须显式给出）")
    .action(async (id, options) => {
      const channel = await pickChannel({ prefer: "official", force: options.channel });
      try {
        if (channel.mode === "official") {
          const r = requireOfficialOk(await channel.official.call("deletePublicKey", { id }), "删除公钥");
          console.log(`🗑️  已删除公钥 ${id}: ${r.status?.message ?? "ok"}`);
        } else {
          const r = requireOk(await channel.console.postV1("/ide/publicKey/delete", { id }), "删除公钥");
          console.log(`🗑️  已删除公钥 ${id}: ${r.message ?? r.status?.message ?? "ok"}`);
        }
      } finally { await closeChannel(channel); }
    });

  // ===== 镜像管理（自定义镜像全生命周期） =====

  const image = program.command("image")
    .description("镜像管理");

  image.command("list")
    .description("镜像列表（--custom 为自定义/私有镜像）")
    .argument("[keyword]", "名称关键词过滤")
    .option("--region <r>", "可用区过滤（控制台通道）")
    .option("--custom", "自定义镜像（官方 listCustomerIdeImages / 控制台 user_image/list）")
    .action((keyword, options) => imagesAction(keyword, options));

  image.command("save")
    .description("保存运行中开发机为自定义镜像（异步——image list --custom 轮询 state=SUCCESS）")
    .argument("<ideId>", "开发机 ID", intArg)
    .requiredOption("--name <name>", "镜像名（小写字母/数字/._-, 4-128 字符）")
    .requiredOption("--tag <tag>", "镜像 tag（如 v1）")
    .option("--org-region-id <id>", "镜像组织区域 ID（默认自动取第一个）", intArg)
    .option("--org-id <id>", "镜像组织 ID（默认自动取第一个）", intArg)
    .action(async (ideId, options) => {
      const channel = await pickChannel({ prefer: "official", force: options.channel });
      try {
        if (channel.mode !== "official") throw new Error("image save 需要官方通道。先运行: ctyun aksk");
        const info = await officialIdeDetail(channel.official, ideId);
        const state = info.statesString ?? "";
        if (state && state !== "RUNNING") throw new Error(`保存镜像须运行中状态，当前: ${statusName(info.states)}`);
        let orgRegionId = options.orgRegionId, orgId = options.orgId;
        if (!orgRegionId) {
          const regions = requireOfficialOk(await channel.official.call("listCustomerImageOrgRegions", {}), "读取镜像组织区域").orgRegions ?? [];
          if (!regions.length) throw new Error("无可用镜像组织区域");
          orgRegionId = regions[0].orgRegionId;
          console.error(`组织区域: ${regions[0].orgRegionName} (${orgRegionId})`);
        }
        if (!orgId) {
          const orgs = requireOfficialOk(await channel.official.call("listCustomerImageOrgs", { orgRegionId }), "读取镜像组织").orgs ?? [];
          if (!orgs.length) throw new Error(`组织区域 ${orgRegionId} 下无可用组织`);
          orgId = orgs[0].orgId;
          console.error(`组织: ${orgs[0].orgName} (${orgId})`);
        }
        const r = requireOfficialOk(await channel.official.call("saveIdeImage", {
          ideId, orgRegionId, orgId, imageName: options.name, imageTag: options.tag,
        }), "保存镜像");
        console.log(`✅ 已提交保存: ${options.name}:${options.tag}（${r.status?.message ?? "ok"}；image list --custom 查看进度）`);
      } finally { await closeChannel(channel); }
    });

  image.command("set")
    .description("更换开发机镜像（须停止状态）")
    .argument("<ideId>", "开发机 ID", intArg)
    .requiredOption("--image-id <id>", "目标镜像 ID", intArg)
    .option("--image-type <t>", "镜像类型: 0 公共(默认) 1 社区 2 自定义", intArg)
    .action(async (ideId, options) => {
      const channel = await pickChannel({ prefer: "official", force: options.channel });
      try {
        if (channel.mode !== "official") throw new Error("image set 需要官方通道。先运行: ctyun aksk");
        const info = await officialIdeDetail(channel.official, ideId);
        const state = info.statesString ?? "";
        if (state && state !== "STOPPED") throw new Error(`换镜像须停止状态，当前: ${statusName(info.states)}`);
        const body = { ideId, imageId: options.imageId };
        if (options.imageType !== undefined) body.imageType = options.imageType;
        const r = requireOfficialOk(await channel.official.call("updateIdeImage", body), "更换镜像");
        console.log(`✅ 已提交换镜像: ${r.status?.message ?? "ok"}`);
      } finally { await closeChannel(channel); }
    });

  image.command("delete")
    .description("删除自定义镜像（不可恢复）")
    .argument("<imageId>", "自定义镜像 ID", intArg)
    .requiredOption("--yes", "确认删除（必须显式给出）")
    .action(async (imageId, options) => {
      const channel = await pickChannel({ prefer: "official", force: options.channel });
      try {
        if (channel.mode === "official") {
          const r = requireOfficialOk(await channel.official.call("deleteCustomerIdeImage", { imageId }), "删除镜像");
          console.log(`🗑️  已提交删除: ${r.status?.message ?? "ok"}`);
        } else {
          const r = requireOk(await channel.console.postV1("/ide/user_image/delete", { id: imageId }), "删除镜像");
          console.log(`🗑️  已提交删除: ${r.message ?? r.status?.message ?? "ok"}`);
        }
      } finally { await closeChannel(channel); }
    });

  program.command("ssh-ips")
    .description("更新开发机 SSH 白名单（须运行中且已开 SSH）")
    .argument("<ideId>", "开发机 ID", intArg)
    .requiredOption("--ips <ips>", "CIDR 逗号分隔 (如 1.2.3.4/32,5.6.7.8/32)")
    .action(async (ideId, options) => {
      const channel = await pickChannel({ prefer: "official", force: options.channel });
      try {
        if (channel.mode === "official") {
          const r = requireOfficialOk(await channel.official.call("updateSSHClientIPs", { ideId, sshClientIps: options.ips }), "更新 SSH 白名单");
          console.log(`✅ 已更新白名单: ${options.ips} (${r.status?.message ?? "ok"})`);
        } else {
          const r = requireOk(await channel.console.postV1("/ide/sshClientIPs/update", { id: ideId, sshClientIps: options.ips }), "更新 SSH 白名单");
          console.log(`✅ 已更新白名单: ${options.ips} (${r.message ?? r.status?.message ?? "ok"})`);
        }
      } finally { await closeChannel(channel); }
    });

  // ===== 科研文件存储 =====

  const storage = program.command("storage")
    .description("科研文件存储（官方 OpenAPI）");

  storage.command("list")
    .description("科研文件存储列表")
    .option("--region <r>", "可用区英文名过滤（官方通道）")
    .option("--json", "JSON 输出")
    .action(async options => {
      const channel = await pickChannel({ prefer: "official", force: options.channel });
      try {
        let list;
        if (channel.mode === "official") {
          const body = { pageNum: 1, pageSize: 100 };
          if (options.region) body.regionName = options.region;
          list = requireOfficialOk(await channel.official.call("listStorageResearch", body), "读取科研文件").storageResearches ?? [];
        } else {
          const { listResearchStorages } = await import("./order.mjs");
          const pid = await getProjectId(channel.console);
          list = [];
          for (const region of await listRegions(channel.console)) {
            list.push(...await listResearchStorages(channel.console, region, { projectId: pid }));
          }
        }
        if (options.json) { console.log(JSON.stringify(list, null, 2)); return; }
        table([
          ["ID", "名称", "容量GB", "规格", "状态", "区域ID"],
          ...list.map(s => [String(s.storageId ?? s.id), s.storageName ?? "-", String(s.volumeSize ?? "-"), s.specName ?? "-", s.state ?? "-", String(s.regionId ?? "-")]),
        ]);
      } finally { await closeChannel(channel); }
    });

  storage.command("get")
    .description("科研文件存储详情")
    .argument("<storageId>", "存储 ID", intArg)
    .option("--json", "JSON 输出")
    .action(async (storageId, options) => {
      const channel = await pickChannel({ prefer: "official", force: options.channel });
      try {
        let s;
        if (channel.mode === "official") {
          s = requireOfficialOk(await channel.official.call("getStorageResearchDetail", { storageId }), "读取存储详情").storageResearch;
        } else {
          s = requireOk(await channel.console.getV2("/storage/research/describe", { storageId }), "读取存储详情");
        }
        if (options.json) { console.log(JSON.stringify(s, null, 2)); return; }
        const d = s?.storageResearch ?? s;
        console.log(`名称:     ${d.storageName ?? "-"}`);
        console.log(`ID:       ${d.storageId ?? storageId}`);
        console.log(`容量:     ${d.volumeSize ?? "-"}GB`);
        console.log(`规格:     ${d.specName ?? "-"} (${d.provider ?? "-"})`);
        console.log(`状态:     ${d.state ?? "-"}`);
        console.log(`区域:     ${d.regionId ?? "-"}`);
        console.log(`创建:     ${d.createTime ?? "-"}`);
      } finally { await closeChannel(channel); }
    });

  storage.command("specs")
    .description("科研存储规格列表（regionId 从 storage list 取）")
    .argument("<regionId>", "区域数字 ID", intArg)
    .action(async (regionId, options) => {
      const channel = await pickChannel({ prefer: "official", force: options.channel });
      try {
        if (channel.mode !== "official") throw new Error("storage specs 需要官方通道。先运行: ctyun aksk");
        const specs = requireOfficialOk(await channel.official.call("listStorageResearchSpecs", { regionId }), "读取存储规格").specs ?? [];
        table([
          ["specId", "规格名", "最小容量GB", "provider", "区域"],
          ...specs.map(s => [String(s.specId), s.specName ?? "-", String(s.extraInfo?.minSize ?? "-"), s.extraInfo?.provider ?? "-", s.regionName ?? "-"]),
        ]);
      } finally { await closeChannel(channel); }
    });

  storage.command("create")
    .description("创建科研文件存储（HPFS 规格须 ≥512 且为 512 整数倍）")
    .requiredOption("--name <name>", "存储名（小写字母/数字/中划线, 4-32 字符）")
    .requiredOption("--gb <size>", "容量 GB（最小 10）", intArg)
    .requiredOption("--region-id <id>", "区域数字 ID（storage specs 查看）", intArg)
    .requiredOption("--spec-id <id>", "规格 ID（storage specs 查看）", intArg)
    .option("--dry-run", "只打印请求体")
    .action(async options => {
      const channel = await pickChannel({ prefer: "official", force: options.channel });
      try {
        if (channel.mode !== "official") throw new Error("storage create 需要官方通道。先运行: ctyun aksk");
        const body = { name: options.name, specId: options.specId, volumeSize: options.gb, regionId: options.regionId };
        if (options.dryRun) { console.log("[dry-run] POST /api/bc/v2/createStorageResearch"); console.log(JSON.stringify(body, null, 2)); return; }
        const r = requireOfficialOk(await channel.official.call("createStorageResearch", body), "创建存储");
        console.log(`✅ 已提交创建: ${options.name} (storageId ${r.storageId})`);
        if (r.orderDetailUrl) console.log(`订购单: ${r.orderDetailUrl}`);
      } finally { await closeChannel(channel); }
    });

  storage.command("resize")
    .description("科研文件存储扩容（Hpfs 须 512 整数倍）")
    .argument("<storageId>", "存储 ID", intArg)
    .requiredOption("--gb <size>", "新容量 GB（须大于当前）", intArg)
    .action(async (storageId, options) => {
      const channel = await pickChannel({ prefer: "official", force: options.channel });
      try {
        if (channel.mode !== "official") throw new Error("storage resize 需要官方通道。先运行: ctyun aksk");
        const r = requireOfficialOk(await channel.official.call("resizeStorageResearch", { storageId, volumeSize: options.gb }), "扩容存储");
        console.log(`✅ 已提交扩容 → ${options.gb}GB: ${r.status?.message ?? "ok"}`);
      } finally { await closeChannel(channel); }
    });

  storage.command("delete")
    .description("删除科研文件存储（不可恢复）")
    .argument("<storageId>", "存储 ID", intArg)
    .requiredOption("--yes", "确认删除（必须显式给出）")
    .action(async (storageId, options) => {
      const channel = await pickChannel({ prefer: "official", force: options.channel });
      try {
        if (channel.mode === "official") {
          const r = requireOfficialOk(await channel.official.call("deleteStorageResearch", { storageId }), "删除存储");
          console.log(`🗑️  已提交删除: ${r.status?.message ?? "ok"}`);
        } else {
          const r = requireOk(await channel.console.postV2("/storage/research/delete", { storageId }), "删除存储");
          console.log(`🗑️  已提交删除: ${r.message ?? r.status?.message ?? "ok"}`);
        }
      } finally { await closeChannel(channel); }
    });

  // ===== 资源池 / 配额 / 账单 =====

  const poolsListAction = async options => {
    const channel = await pickChannel({ prefer: "official", force: options.channel });
    try {
      let list;
      if (channel.mode === "official") {
        list = requireOfficialOk(await channel.official.call("listResources", { pageNum: 1, pageSize: 100 }), "读取资源池").resources ?? [];
      } else {
        list = requireOk(await channel.console.getV1("/resource/pool/list", { "paging.page": 1, "paging.perPage": 100 }), "读取资源池").resources ?? [];
      }
  if (options.json) { console.log(JSON.stringify(list, null, 2)); return; }
  table([
    ["资源池ID", "名称", "集群", "状态", "创建时间"],
    ...list.map(p => [String(p.id ?? p.resourcePoolId), p.resourcePoolName ?? p.poolName ?? "-", p.clusterName ?? "-", p.state ?? "-", (p.createTime ?? "").slice(0, 10)]),
  ]);
} finally { await closeChannel(channel); }
  };


  poolCmd.command("list")
    .description("资源池清单（池是队列的容器）")
    .option("--json", "JSON 输出")
    .action(poolsListAction);

  program.command("quotas")
    .description("共享集群与租户配额总览")
    .option("--json", "JSON 输出")
    .action(async options => {
      const channel = await pickChannel({ prefer: "official", force: options.channel });
      try {
        let data;
        if (channel.mode === "official") {
          data = requireOfficialOk(await channel.official.call("listSharedClusterQuotas", {}), "读取配额");
        } else {
          data = requireOk(await channel.console.getV1("/cluster/shared_quota", {}), "读取配额");
        }
        if (options.json) { console.log(JSON.stringify(data, null, 2)); return; }
        for (const c of data.sharedClusters ?? []) {
          console.log(`集群: ${c.clusterName} (${c.clusterId}) ${c.clusterUsedState === "UNUSED" ? "未使用" : "使用中"}`);
        }
        for (const q of data.tenantQuota ?? []) {
          const t = q.totalQuota ?? {}, u = q.usedQuota ?? {};
          console.log(`租户配额 (集群 ${q.clusterId}): CPU ${u.cpu ?? 0}/${t.cpu ?? "?"}  内存 ${u.memory ?? 0}/${t.memory ?? "?"}  GPU ${u.gpu ?? 0}/${t.gpu ?? "?"}`);
        }
      } finally { await closeChannel(channel); }
    });

  program.command("bill")
    .description("子账号账单明细（需科研助手运营平台加白名单）")
    .option("--month <ym>", "账期 YYYYMM（默认当月）")
    .option("--project-id <id>", "企业项目 ID（默认 0）")
    .option("--json", "JSON 输出")
    .action(async options => {
      const channel = await pickChannel({ prefer: "official", force: options.channel });
      try {
        if (channel.mode !== "official") throw new Error("bill 需要官方通道。先运行: ctyun aksk");
        const now = new Date();
        const month = options.month ?? `${now.getFullYear()}${String(now.getMonth() + 1).padStart(2, "0")}`;
        const r = requireOfficialOk(await channel.official.call("listUserBillDetail", {
          projectId: options.projectId ?? "0", accountPeriod: month, pageNum: 1, pageSize: 100,
        }), "读取账单");
        if (options.json) { console.log(JSON.stringify(r, null, 2)); return; }
        const stats = r.userBillStatistics;
        if (stats) {
          console.log(`账期 ${month}: 总额 ¥${stats.totalAmount ?? "-"} (CPU ¥${stats.cpuAmount ?? 0} / 内存 ¥${stats.memAmount ?? 0} / GPU ¥${stats.gpuAmount ?? 0} / 存储 ¥${stats.storageAmount ?? 0})`);
        }
        table([
          ["实例", "计费项", "规格", "用量", "金额", "日期"],
          ...(r.billList ?? []).map(b => [b.instanceName ?? "-", b.chargingItem ?? "-", b.resourceSpec ?? "-", String(b.usage ?? "-"), String(b.payableAmount ?? "-"), b.billDate ?? "-"]),
        ]);
      } finally { await closeChannel(channel); }
    });

  // 每个命令（含嵌套子命令组）都注册 --channel（Commander 命令选项不继承，须逐个挂）
  const addChannel = cmd => {
    cmd.option("--channel <type>", "强制通道: official | console（默认自动选择）", channelArg);
    for (const sub of cmd.commands) addChannel(sub);
  };
  for (const cmd of program.commands) addChannel(cmd);

  // 顶层 help 的 Commands 区按功能分组渲染（子命令仍用默认格式）
  const HELP_GROUPS = [
    ["凭据与诊断", ["config", "login", "logout", "aksk", "status"]],
    ["开发机", ["env", "start", "stop", "delete", "rename", "create", "jexec", "ssh-setup", "ssh-ips", "pvc", "metrics", "batch-start", "batch-stop"]],
    ["训练作业", ["job"]],
    ["推理服务", ["infer"]],
    ["科研存储", ["storage"]],
    ["镜像", ["image"]],
    ["SSH 公钥", ["key"]],
    ["资源与账单", ["queues", "specs", "quotas", "bill"]],
    ["监控与审计", ["pool", "summary", "events", "whoami", "my-ip"]],
    ["逃生舱", ["api", "raw"]],
  ];
  const plainHelp = new CommanderHelp();
  program.configureHelp({
    formatHelp: (cmd, helper) => {
      const base = plainHelp.formatHelp(cmd, helper);
      if (cmd !== program) return base;
      const marker = "\nCommands:\n";
      const at = base.indexOf(marker);
      if (at === -1) return base;
      const visible = cmd.commands.filter(c => !c._hidden);
      const width = Math.max(...visible.map(c => helper.subcommandTerm(c).length)) + 2;
      const grouped = new Set(HELP_GROUPS.flatMap(([, names]) => names));
      const lines = [];
      const emit = groupName => {
        const cmds = visible.filter(c => groupName === null ? !grouped.has(c.name()) : groupName[1].includes(c.name()));
        if (!cmds.length) return;
        lines.push(groupName === null ? "其他:" : `${groupName[0]}:`);
        for (const c of cmds) {
          lines.push(`  ${helper.subcommandTerm(c).padEnd(width)}${c.description()}`);
        }
      };
      for (const g of HELP_GROUPS) emit(g);
      emit(null);
      return base.slice(0, at + 1) + "Commands:\n" + lines.join("\n") + "\n";
    },
  });
  return program;
}

export async function run(argv) {
  // cli-creator 契约: 支持 `ctyun --json doctor` 全局 flag 形式 —— 若 --json 出现在
  // 命令名之前，移位为命令级 flag（Commander 命令选项不继承 program 级）
  let adjusted = argv;
  const args = argv.slice(2);
  const jsonIdx = args.indexOf("--json");
  const firstWordIdx = args.findIndex(a => !a.startsWith("-"));
  if (jsonIdx !== -1 && firstWordIdx !== -1 && jsonIdx < firstWordIdx) {
    const moved = args.filter((_, i) => i !== jsonIdx);
    moved.splice(firstWordIdx + 1, 0, "--json");
    adjusted = [...argv.slice(0, 2), ...moved];
  }
  const program = buildProgram();
  await program.parseAsync(adjusted);
}
