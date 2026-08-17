// ctyun-cli 独立 API 客户端 —— 自包含会话 (~/.ctyun/session)，curl 子进程，零依赖
import crypto from "node:crypto";
import fs from "node:fs/promises";
import path from "node:path";
import { execFile } from "node:child_process";
import { promisify } from "node:util";
import { SESSION_DIR, noProxyEnv } from "./auth.mjs";

const execFileAsync = promisify(execFile);
const CONSOLE_ORIGIN = "https://esx.ctyun.cn";

function queryString(params = {}) {
  const query = new URLSearchParams();
  for (const [key, value] of Object.entries(params)) {
    if (value !== undefined && value !== null && value !== "") query.set(key, String(value));
  }
  const text = query.toString();
  return text ? `?${text}` : "";
}

export class CtyunClient {
  #sessionDir;
  #workDir;
  #cookieFile;
  #accessToken = "";

  constructor({ sessionDir } = {}) {
    this.#sessionDir = path.resolve(String(sessionDir ?? SESSION_DIR));
  }

  static fromSessionDir(sessionDir) { return new CtyunClient({ sessionDir }); }

  async login() {
    if (this.#workDir) return;
    this.#workDir = await fs.mkdtemp("/tmp/ctyun-cli-");
    try {
      this.#cookieFile = path.join(this.#workDir, "cookies.txt");
      await fs.copyFile(path.join(this.#sessionDir, "cookies.txt"), this.#cookieFile);
      this.#accessToken = (await fs.readFile(path.join(this.#sessionDir, "token.txt"), "utf8")).trim();
    } catch (error) {
      await this.close();
      throw new Error(`加载会话失败 (${this.#sessionDir}): ${error.message}。请先运行: ctyun login`);
    }
  }

  /** 会话工作 jar 中的 cookie 有服务端轮换更新时回写到会话目录（续期）。
   * 用 readFile+writeFile(0600) 而非 copyFile —— copyFile 会传播源文件(curl 建的 0644)的 mode。 */
  async persistSession() {
    if (!this.#workDir) return;
    try {
      const content = await fs.readFile(this.#cookieFile, "utf8");
      await fs.writeFile(path.join(this.#sessionDir, "cookies.txt"), content, { mode: 0o600 });
      await fs.chmod(path.join(this.#sessionDir, "cookies.txt"), 0o600).catch(() => {});
    } catch { /* 尽力而为 */ }
  }

  async close() {
    this.#accessToken = "";
    if (this.#workDir) await fs.rm(this.#workDir, { recursive: true, force: true });
    this.#workDir = undefined;
    this.#cookieFile = undefined;
  }

  /** 通用请求。route: "/ide/list" (v1) | "/bc/v2/..." (绝对) | 完整 URL。401 时抛专用错误 */
  async request(method, route, { params, json, timeoutSec = 45 } = {}) {
    if (!this.#cookieFile) throw new Error("请先调用 login()");
    const url = route.startsWith("http") ? route
      : route.startsWith("/bc/") ? `${CONSOLE_ORIGIN}${route}`
      : `${CONSOLE_ORIGIN}/bc/v1${route}`;
    const fullUrl = `${url}${queryString(params)}`;
    const bodyFile = path.join(this.#workDir, `response-${crypto.randomUUID()}.body`);
    const args = ["-sS", "-L", "--max-time", String(timeoutSec), "-b", this.#cookieFile, "-c", this.#cookieFile,
      "-o", bodyFile, "-w", "%{http_code}"];
    args.push("-X", method.toUpperCase());
    if (this.#accessToken) args.push("-H", `Authorization: Bearer ${this.#accessToken}`);
    if (json !== undefined) {
      args.push("-H", "Content-Type: application/json", "--data-raw", JSON.stringify(json));
    }
    args.push(fullUrl);
    let stdout;
    try {
      ({ stdout } = await execFileAsync("curl", args, { env: noProxyEnv(), maxBuffer: 2_000_000 }));
    } catch (error) {
      // execFile 错误消息含完整命令行（Bearer token / 请求体）——脱敏后再抛
      const sanitized = String(error?.message ?? "").slice(0, 200)
        .replace(/-H Authorization: Bearer [^\s"']+/g, "-H Authorization: Bearer ***")
        .replace(/--data-raw [^\n]*/g, "--data-raw ***");
      throw new Error(`网络请求失败: ${sanitized}`);
    }
    const text = await fs.readFile(bodyFile, "utf8");
    let parsed;
    try { parsed = JSON.parse(text); } catch { parsed = undefined; }
    return { status: Number(stdout.trim()), json: parsed, text };
  }

  async getV1(route, params) { return this.request("GET", `/bc/v1${route}`, { params }); }
  async postV1(route, json) { return this.request("POST", `/bc/v1${route}`, { json }); }
  async getV2(route, params) { return this.request("GET", `/bc/v2${route}`, { params }); }
  async postV2(route, json) { return this.request("POST", `/bc/v2${route}`, { json }); }
  async deleteV1(route) { return this.request("DELETE", `/bc/v1${route}`); }
}

export function requireOk(response, label) {
  const status = response?.json?.status;
  if (response?.status === 401) {
    throw new Error(`${label}失败: 会话已失效 (HTTP 401)。请运行: ctyun login`);
  }
  if (response?.status !== 200 || status?.code !== "ok") {
    const detail = status?.message ?? response?.json?.message
      ?? (response?.text ? `HTTP ${response?.status}: ${String(response.text).slice(0, 120)}` : `HTTP ${response?.status ?? "unknown"}`);
    throw new Error(`${label}失败: ${detail}`);
  }
  return response.json;
}

