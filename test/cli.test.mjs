// ctyun-cli 单元测试 —— node:test（零额外依赖），覆盖签名器/请求体构造器/归一化/信封校验/help 面
// 运行: npm test （node --test test/）
import test from "node:test";
import assert from "node:assert/strict";
import { buildEopAuthorization, requireOfficialOk } from "../lib/official-client.mjs";
import { buildBatchCreateRequest } from "../lib/order.mjs";
import { statusName } from "../lib/format.mjs";
import { normalizeOfficialIde, buildProgram } from "../lib/cli.mjs";

const SIGN_INPUTS = {
  ak: "AK123456", sk: "SK-TEST",
  requestId: "0ffb9b07-d5a8-4e19-b3ce-12df9b9705a1",
  eopFull: "20260817T150000Z", eopDay: "20260817",
  bodyText: "{}",
};

test("Eop-Authorization 结构与确定性", () => {
  const a = buildEopAuthorization(SIGN_INPUTS);
  const b = buildEopAuthorization(SIGN_INPUTS);
  assert.ok(a.startsWith("AK123456 Headers=ctyun-eop-request-id;eop-date Signature="), "前缀结构");
  assert.equal(a, b, "同输入同签名（确定性）");
  const sig = a.split("Signature=")[1];
  assert.ok(sig.length > 40, "base64 签名非空");
  // body 变化必须改变签名（sha256(body) 参与派生）
  const c = buildEopAuthorization({ ...SIGN_INPUTS, bodyText: '{"x":1}' });
  assert.notEqual(a, c, "body 变化 → 签名变化");
});

test("requireOfficialOk 信封校验", () => {
  assert.deepEqual(
    requireOfficialOk({ statusCode: "200", returnObj: { ides: [] } }, "读取"),
    { ides: [] },
  );
  assert.deepEqual(
    requireOfficialOk({ statusCode: "200", returnObj: { status: { code: "ok" }, x: 1 } }, "读取"),
    { status: { code: "ok" }, x: 1 },
  );
  assert.throws(() => requireOfficialOk({ statusCode: "400", message: "参数错误" }, "读取"), /参数错误/);
  assert.throws(() => requireOfficialOk({ statusCode: "200", returnObj: { status: { code: "PermissionDenied", message: "无权限" } } }, "读取"), /无权限/);
});

test("官方 ide 状态归一化", () => {
  const n = normalizeOfficialIde({ id: 1, name: "test", state: "RUNNING", regionName: "zj-pinghu-1" });
  assert.equal(n.states, 3);
  assert.equal(n.statesString, "RUNNING");
  assert.equal(n.ideName, "test");
  assert.equal(n.regionNameEng, "zj-pinghu-1");
  assert.equal(statusName(n.states), "运行中");
  assert.equal(statusName("STOPPING"), "停止中");
});

test("buildBatchCreateRequest 请求体构造", () => {
  const formData = {
    poolType: "2", instanceNum: 2,
    storageInfo: [], researchStorageInfo: [],
    localPv: [{ size: 900, mountPath: "/research", enablePersistence: true }],
    sshEnabled: false, servicePortEnabled: false, dindEnabled: false,
  };
  const req = buildBatchCreateRequest(formData);
  assert.equal(req.instance_num, 2);
  assert.equal(req.ide_info.poolType, 2, "poolType 转数字");
  assert.equal(req.ide_info.localStorageInfo.pv_size, 950, "本地盘 = 扩容 + 50 基础");
  assert.equal(req.ide_info.localStorageInfo.release_policy, "Retain");
  assert.equal(req.ide_info.localStorageInfo.mount_path, "/home/dataset-local/research");
  assert.equal(req.ide_info.localPv, undefined, "localPv 折叠进 localStorageInfo");
});

test("命令面完整（cli-creator 契约: help 覆盖全部能力）", async () => {
  const program = buildProgram();
  const names = program.commands.map(c => c.name());
  for (const expected of ["login", "logout", "aksk", "status", "config", "envs", "env", "start", "stop", "delete",
    "rename", "create", "queues", "pool", "images", "specs", "keys", "jobs", "pvc", "metrics",
    "jexec", "ssh-setup", "api", "raw", "whoami", "summary", "batch-start", "batch-stop", "my-ip",
    "events", "job", "infer", "key", "image", "storage", "ssh-ips", "pools", "quotas", "bill", "preflight"]) {
    assert.ok(names.includes(expected), `缺少命令: ${expected}`);
  }
  // 旧平铺命令名必须已收敛为名词子命令组
  for (const removed of ["infers", "infer-start", "infer-stop", "infer-delete", "job-create", "job-start",
    "job-stop", "job-delete", "job-logs", "key-add", "key-delete", "image-save", "image-set",
    "image-delete", "storages", "storage-specs", "storage-create", "storage-resize", "storage-delete"]) {
    assert.ok(!names.includes(removed), `应已移除平铺命令: ${removed}`);
  }
  // 子命令组结构（cli-creator: 命令族用名词父命令分组）
  const subs = name => program.commands.find(c => c.name() === name)?.commands.map(c => c.name()) ?? [];
  assert.deepEqual(subs("job").sort(), ["create", "delete", "get", "list", "logs", "start", "stop"].sort());
  assert.deepEqual(subs("infer").sort(), ["delete", "get", "list", "start", "stop"].sort());
  assert.deepEqual(subs("key").sort(), ["add", "delete", "list"].sort());
  assert.deepEqual(subs("image").sort(), ["delete", "list", "save", "set"].sort());
  assert.deepEqual(subs("storage").sort(), ["create", "delete", "get", "list", "resize", "specs"].sort());
  assert.deepEqual(subs("env").sort(), ["create", "delete", "get", "list", "rename", "start", "stop"].sort());
  // --help 默认 process.exit —— exitOverride 改抛错 + 捕获输出
  program.exitOverride();
  let out = "";
  program.configureOutput({ writeOut: s => { out += s; } });
  await assert.rejects(() => program.parseAsync(["node", "ctyun", "--help"]));
  assert.ok(out.includes("envs"), "help 含 envs");
});
