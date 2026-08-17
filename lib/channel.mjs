// 双通道解析 —— 官方 OpenAPI (AK/SK) 优先，控制台会话为辅
// 每个命令声明自己的通道偏好；--channel official|console 可强制指定（排障用）。
// 官方通道无会话概念，控制台通道需要 ~/.ctyun/session（约 1h 过期，ctyun login 续）。
import fs from "node:fs/promises";
import { CtyunClient } from "./ctyun-client.mjs";
import { OfficialClient, readAksk } from "./official-client.mjs";
import { SESSION_DIR } from "./auth.mjs";

export async function consoleSessionExists() {
  try {
    await fs.access(`${SESSION_DIR}/cookies.txt`);
    await fs.access(`${SESSION_DIR}/token.txt`);
    return true;
  } catch {
    return false;
  }
}

/**
 * 解析命令实际使用的通道。
 * prefer: "official"（有 AK/SK 用官方，否则回退控制台）| "console"（必须控制台会话）
 * force:  "official" | "console" —— 来自 --channel 参数，强制且失败不回退
 * 返回 { mode, official?, console? }；不可用时抛带指引的错误。
 */
export async function pickChannel({ prefer = "official", force } = {}) {
  const aksk = await readAksk();
  const hasConsole = await consoleSessionExists();

  let want = force;
  if (!want) {
    if (prefer === "official") want = aksk || !hasConsole ? "official" : "console";
    else want = "console";
  }

  if (want === "official") {
    if (!aksk) {
      throw new Error(force === "official" || !hasConsole
        ? "官方 API 密钥未配置。运行: ctyun aksk（或设置 CTYUN_AK/CTYUN_SK 环境变量）"
        : "官方 API 密钥未配置（该命令优先官方通道）。运行: ctyun aksk，或加 --channel console 用控制台会话");
    }
    return { mode: "official", official: new OfficialClient(aksk) };
  }
  if (!hasConsole) {
    throw new Error(force === "console"
      ? "控制台会话不存在。运行: ctyun login"
      : "控制台会话不存在（该命令依赖控制台通道）。运行: ctyun login");
  }
  const client = new CtyunClient();
  await client.login();
  return { mode: "console", console: client };
}

/** 控制台客户端的兜底清理（会话 cookie 有轮换时回写续期） */
export async function closeChannel(channel) {
  await channel?.console?.persistSession().catch(() => {});
  await channel?.console?.close().catch(() => {});
}
