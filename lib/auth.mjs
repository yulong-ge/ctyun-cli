// ctyun-cli 认证模块 —— 自包含：账号密码直登 / 导入监控会话 / 续期 / 状态查询
// 会话目录默认 ~/.ctyun/session (700)，凭据存 ~/.ctyun/credentials (600)
import crypto from "node:crypto";
import fs from "node:fs/promises";
import path from "node:path";
import os from "node:os";

export const ROOT = process.env.CTYUN_CLI_HOME ?? path.join(os.homedir(), ".ctyun");
export const SESSION_DIR = path.join(ROOT, "session");
export const CRED_FILE = path.join(ROOT, "credentials");
const COOKIE_FILE = path.join(SESSION_DIR, "cookies.txt");
const TOKEN_FILE = path.join(SESSION_DIR, "token.txt");
const META_FILE = path.join(SESSION_DIR, "meta.json");

const PORTAL = "https://www.ctyun.cn";
const CONSOLE = "https://esx.ctyun.cn";

export function noProxyEnv() {
  const environment = { ...process.env };
  for (const name of ["http_proxy", "https_proxy", "all_proxy", "HTTP_PROXY", "HTTPS_PROXY", "ALL_PROXY"]) delete environment[name];
  return environment;
}

/** 门户登录接口要求 3DES-ECB 加密密码（与网页前端一致） */
export function encryptedPassword(username, password) {
  const key = Buffer.from(encodeURIComponent(username).slice(0, 24).padEnd(24, "0"), "utf8");
  const cipher = crypto.createCipheriv("des-ede3-ecb", key, null);
  return Buffer.concat([cipher.update(password, "utf8"), cipher.final()]).toString("base64");
}

/** 剥离成对引号：仅当首尾同时是 " 或 ' 时才剥（dotenv 语义）。
 * 避免误伤首尾恰好带引号字面量的密码。 */
function unquote(value) {
  const t = value.trim();
  if (t.length >= 2 && ((t.startsWith('"') && t.endsWith('"')) || (t.startsWith("'") && t.endsWith("'")))) {
    return t.slice(1, -1);
  }
  return t;
}

export async function readCredentials() {
  // 优先环境变量，其次 ~/.ctyun/credentials (KEY=VALUE 格式)
  if (process.env.CTYUN_USERNAME && process.env.CTYUN_PASSWORD) {
    return { username: process.env.CTYUN_USERNAME, password: process.env.CTYUN_PASSWORD };
  }
  try {
    const text = await fs.readFile(CRED_FILE, "utf8");
    const cred = {};
    for (const line of text.split("\n")) {
      const m = line.match(/^([A-Z_]+)=(.*)$/);
      if (m) cred[m[1]] = unquote(m[2]);
    }
    if (cred.CTYUN_USERNAME && cred.CTYUN_PASSWORD) return { username: cred.CTYUN_USERNAME, password: cred.CTYUN_PASSWORD };
  } catch { /* no cred file */ }
  return null;
}

export async function saveCredentials(username, password) {
  await fs.mkdir(ROOT, { recursive: true });
  await fs.writeFile(CRED_FILE, `CTYUN_USERNAME=${username}\nCTYUN_PASSWORD=${password}\n`, { mode: 0o600 });
  await fs.chmod(CRED_FILE, 0o600).catch(() => {}); // 已存在文件时 writeFile 不改 mode，显式兜底
}

/** 写会话文件：显式 0600 + chmod 兜底（不用 copyFile——它会传播源文件的 0644） */
async function writeSessionFile(dest, content) {
  await fs.writeFile(dest, content, { mode: 0o600 });
  await fs.chmod(dest, 0o600).catch(() => {});
}

async function writeSession(cookiesNetscape, token, source) {
  await fs.mkdir(SESSION_DIR, { recursive: true, mode: 0o700 }).catch(() => fs.mkdir(SESSION_DIR, { recursive: true }));
  await fs.chmod(SESSION_DIR, 0o700).catch(() => {});
  await writeSessionFile(COOKIE_FILE, cookiesNetscape);
  await writeSessionFile(TOKEN_FILE, token);
  await writeSessionFile(META_FILE, JSON.stringify({ source, mintedAt: new Date().toISOString() }, null, 1) + "\n");
}

/** execFile 失败时错误消息含完整 curl 命令行（Bearer token / 表单体）——统一脱敏 */
export function sanitizeCurlError(error) {
  const message = String(error?.message ?? error ?? "");
  return message
    .replace(/-H Authorization: Bearer [^\s"']+/g, "-H Authorization: Bearer ***")
    .replace(/--data-raw [^\n]*/g, "--data-raw ***");
}

/**
 * 账号密码直登（无浏览器）。流程与网页登录一致：
 *  1. GET 登录页（拿风控 cookie）
 *  2. POST /gw/auth/Login (3DES 密码) → accessToken
 *  3. GET esx.ctyun.cn/v1/auth/login (SSO 交换) → 控制台 cookie
 *  4. 轻量 API 调用验证会话真的可用（SSO 200 也可能只是回了 HTML）
 * 返回 { token, cookieCount }
 */
export async function loginWithCredentials({ username, password }, { verify = true } = {}) {
  const { execFile } = await import("node:child_process");
  const { promisify } = await import("node:util");
  const execFileAsync = promisify(execFile);
  const curlExec = async (args) => {
    try {
      const { stdout } = await execFileAsync("curl", args, { env: noProxyEnv(), maxBuffer: 2_000_000 });
      return stdout;
    } catch (error) {
      throw new Error(`网络请求失败: ${sanitizeCurlError(error).slice(0, 200)}`);
    }
  };

  const workDir = await fs.mkdtemp("/tmp/ctyun-login-");
  const jar = path.join(workDir, "cookies.txt");
  try {
    const loginPage = `${PORTAL}/h5/auth/login?rd=%2Fbc%2Fdevelop-env-create`;
    await curlExec(["-sS", "-L", "--max-time", "30", "-b", jar, "-c", jar, "-o", "/dev/null", loginPage]);

    // 注: other 字段的 encodeURIComponent + URLSearchParams 双重编码是网页前端的原始行为
    // （服务端表单解码一次后拿到 URL-encoded 用户名），邮箱用户名实测通过，勿"修复"。
    const form = new URLSearchParams({
      newMode: "true", id: username, loginType: "password",
      other: encodeURIComponent(username),
      password: encryptedPassword(username, password),
      loginFree: "false",
    });
    const loginOut = await curlExec(["-sS", "-L", "--max-time", "30", "-b", jar, "-c", jar,
      "-H", "Origin: https://www.ctyun.cn", "-H", `Referer: ${loginPage}`,
      "-H", "Content-Type: application/x-www-form-urlencoded", "--data-raw", form.toString(),
      `${PORTAL}/gw/auth/Login`]);
    let loginJson;
    try { loginJson = JSON.parse(loginOut); } catch { throw new Error(`登录响应无法解析: ${loginOut.slice(0, 150)}`); }
    if (loginJson?.code !== "core.ok") {
      throw new Error(`门户登录失败: ${loginJson?.reason ?? loginJson?.message ?? JSON.stringify(loginJson).slice(0, 150)}`);
    }
    const token = loginJson?.data?.property?.accessToken ?? "";
    if (!token) throw new Error("登录成功但未返回 accessToken");

    const ssoCode = await curlExec(["-sS", "-L", "--max-time", "30", "-b", jar, "-c", jar,
      "-o", "/dev/null", "-w", "%{http_code}", `${CONSOLE}/v1/auth/login?rd=%2Fbc%2Fdevelop-env-create`]);
    if (ssoCode !== "200") throw new Error(`控制台 SSO 交换失败 (HTTP ${ssoCode})`);

    const cookieText = await fs.readFile(jar, "utf8");
    const count = cookieText.split("\n").filter(l => l && !l.startsWith("#")).length;
    await writeSession(cookieText, token, "credentials");

    if (verify) {
      const probeCode = await curlExec(["-sS", "--max-time", "30", "-b", jar, "-c", jar,
        "-H", `Authorization: Bearer ${token}`,
        "-o", path.join(workDir, "probe.json"), "-w", "%{http_code}",
        `${CONSOLE}/bc/v1/ide/list?paging.page=1&paging.perPage=1`]);
      let probeOk = probeCode === "200";
      if (probeOk) {
        try {
          const probe = JSON.parse(await fs.readFile(path.join(workDir, "probe.json"), "utf8"));
          probeOk = probe?.status?.code === "ok";
        } catch { probeOk = false; }
      }
      if (!probeOk) {
        throw new Error("登录完成但业务 API 验证失败（会话可能被风控为 cookie-less）。回退方案: ctyun login --import-monitor");
      }
    }
    return { token, cookieCount: count };
  } finally {
    await fs.rm(workDir, { recursive: true, force: true });
  }
}

/** 从 gpu-platform-monitor 的会话目录导入（一次性迁移，之后独立续期） */
export async function importFromMonitor(monitorSessionDir) {
  const src = monitorSessionDir ?? path.join(os.homedir(), "gpu-platform-monitor", "session");
  const cookies = await fs.readFile(path.join(src, "cookies.txt"), "utf8");
  const token = (await fs.readFile(path.join(src, "token.txt"), "utf8")).trim();
  await writeSession(cookies, token, "imported-from-monitor");
  return { token, cookieCount: cookies.split("\n").filter(l => l && !l.startsWith("#")).length };
}

export async function sessionStatus() {
  try {
    const meta = JSON.parse(await fs.readFile(META_FILE, "utf8"));
    const stat = await fs.stat(COOKIE_FILE);
    const token = (await fs.readFile(TOKEN_FILE, "utf8")).trim();
    return { exists: true, source: meta.source, mintedAt: meta.mintedAt, cookieMtime: stat.mtime.toISOString(), tokenPreview: token.slice(0, 8) + "…" };
  } catch {
    return { exists: false };
  }
}

export function sessionPaths() {
  return { root: ROOT, sessionDir: SESSION_DIR, cookieFile: COOKIE_FILE, tokenFile: TOKEN_FILE, credFile: CRED_FILE };
}
