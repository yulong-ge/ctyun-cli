// 官方 OpenAPI 通道 —— bc-global.ctapi.ctyun.cn，AK/SK + Eop-Authorization 签名
// 算法依据 docs/api/official/calling-guide.md（天翼云 OpenApi 平台「如何调用API」原文）
// 与控制台通道 (~/.ctyun/session) 完全独立：无会话、不过期、不受登录风控影响。
import crypto from "node:crypto";
import fs from "node:fs/promises";
import { ROOT } from "./auth.mjs";

const ENDPOINT = "https://bc-global.ctapi.ctyun.cn";
const AKSK_FILE = `${ROOT}/aksk`;

export function akskPath() { return AKSK_FILE; }

function unquote(value) {
  const t = value.trim();
  if (t.length >= 2 && ((t.startsWith('"') && t.endsWith('"')) || (t.startsWith("'") && t.endsWith("'")))) return t.slice(1, -1);
  return t;
}

/** AK/SK 来源：环境变量 CTYUN_AK/CTYUN_SK 优先，其次 ~/.ctyun/aksk (KEY=VALUE, 600) */
export async function readAksk() {
  if (process.env.CTYUN_AK && process.env.CTYUN_SK) {
    return { ak: process.env.CTYUN_AK, sk: process.env.CTYUN_SK, source: "env" };
  }
  try {
    const text = await fs.readFile(AKSK_FILE, "utf8");
    const pairs = {};
    for (const line of text.split("\n")) {
      const m = line.match(/^([A-Z_]+)=(.*)$/);
      if (m) pairs[m[1]] = unquote(m[2]);
    }
    if (pairs.CTYUN_AK && pairs.CTYUN_SK) return { ak: pairs.CTYUN_AK, sk: pairs.CTYUN_SK, source: "file" };
  } catch { /* 无 aksk 文件 */ }
  return null;
}

export async function saveAksk(ak, sk) {
  await fs.mkdir(ROOT, { recursive: true });
  await fs.writeFile(AKSK_FILE, `CTYUN_AK=${ak}\nCTYUN_SK=${sk}\n`, { mode: 0o600 });
  await fs.chmod(AKSK_FILE, 0o600).catch(() => {});
}

export async function clearAksk() {
  await fs.rm(AKSK_FILE, { force: true }).catch(() => {});
}

// ---------- Eop-Authorization 签名 ----------

/** 北京时间 (UTC+8) 墙钟格式化为 yyyyMMddTHHmmssZ。Eop-date 的 Z 仅是格式后缀，非 UTC 语义 */
function eopDateNow() {
  const beijing = new Date(Date.now() + 8 * 3600 * 1000);
  const p = (n, w = 2) => String(n).padStart(w, "0");
  return {
    full: `${beijing.getUTCFullYear()}${p(beijing.getUTCMonth() + 1)}${p(beijing.getUTCDate())}T${p(beijing.getUTCHours())}${p(beijing.getUTCMinutes())}${p(beijing.getUTCSeconds())}Z`,
    day: `${beijing.getUTCFullYear()}${p(beijing.getUTCMonth() + 1)}${p(beijing.getUTCDate())}`,
  };
}

const hmac = (key, data) => crypto.createHmac("sha256", key).update(data).digest();
const sha256hex = (data) => crypto.createHash("sha256").update(data).digest("hex");

/** 构造 Eop-Authorization 头。POST /api/bc/v2/* 无 query 参数，query 段为空串 */
export function buildEopAuthorization({ ak, sk, requestId, eopFull, eopDay, bodyText }) {
  // sigture = 签名 header 列表(每个以 \n 结尾) + "\n" + encode(query) + "\n" + toHex(sha256(body))
  const sigture =
    `ctyun-eop-request-id:${requestId}\neop-date:${eopFull}\n` +
    `\n${""}\n${sha256hex(bodyText)}`;
  // 密钥派生链: ktime=hmac(sk, eop-date) → kAk=hmac(ktime, ak) → kdate=hmac(kAk, yyyyMMdd)
  const ktime = hmac(sk, eopFull);
  const kAk = hmac(ktime, ak);
  const kdate = hmac(kAk, eopDay);
  const signature = crypto.createHmac("sha256", kdate).update(sigture).digest("base64");
  return `${ak} Headers=ctyun-eop-request-id;eop-date Signature=${signature}`;
}

// ---------- 客户端 ----------

export class OfficialClient {
  #aksk = null;

  constructor(aksk) {
    this.#aksk = aksk;
  }

  static async create() {
    const aksk = await readAksk();
    return aksk ? new OfficialClient(aksk) : null;
  }

  get source() { return this.#aksk.source; }

  /** 调用官方 RPC 风格 API: POST /api/bc/v2/{action}，JSON body，返回完整信封 */
  async call(action, body = {}, { timeoutSec = 45 } = {}) {
    const bodyText = JSON.stringify(body);
    const requestId = crypto.randomUUID();
    const { full, day } = eopDateNow();
    const authorization = buildEopAuthorization({
      ak: this.#aksk.ak, sk: this.#aksk.sk,
      requestId, eopFull: full, eopDay: day, bodyText,
    });
    let response;
    try {
      response = await fetch(`${ENDPOINT}/api/bc/v2/${action}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "ctyun-eop-request-id": requestId,
          "Eop-Authorization": authorization,
          "Eop-date": full,
        },
        body: bodyText,
        signal: AbortSignal.timeout(timeoutSec * 1000),
      });
    } catch (error) {
      throw new Error(`官方 API 网络请求失败 (${action}): ${error.message}`);
    }
    const text = await response.text();
    let json;
    try { json = JSON.parse(text); } catch { json = undefined; }
    if (!response.ok || !json) {
      // EOP 网关错误体: {eopErrCode, message, statusCode:"CTAPI_xxx"} —— 提炼而非裸抛
      const detail = json?.message ?? String(text).slice(0, 200);
      const code = json?.eopErrCode ?? json?.statusCode ? ` [${json.eopErrCode ?? json.statusCode}]` : "";
      throw new Error(`官方 API ${action} 失败: HTTP ${response.status}${code} ${detail}`);
    }
    return json;
  }
}

/** 官方信封校验: {statusCode:"200", message, returnObj:{...,status:{code,message}}}
 *  statusCode!=200 或 returnObj.status.code!=ok 时抛错，成功返回 returnObj */
export function requireOfficialOk(envelope, label) {
  if (envelope?.statusCode !== "200") {
    throw new Error(`${label}失败: ${envelope?.message ?? envelope?.error ?? `statusCode ${envelope?.statusCode}`}`);
  }
  const returnObj = envelope.returnObj;
  const biz = returnObj?.status;
  if (biz && biz.code !== "ok") {
    throw new Error(`${label}失败: ${biz.message ?? biz.code}`);
  }
  return returnObj ?? {};
}
