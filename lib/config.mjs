// 用户级默认配置 —— ~/.ctyun/config (KEY=VALUE, 600)。
// 解决「公开仓库不能含内部项目名，但本机要默认值」：真实值只存本机，仓库代码零内置。
// 优先级: 环境变量 > config 文件 > 命令行覆盖 (create --project-name 等)。
import fs from "node:fs/promises";
import { ROOT } from "./auth.mjs";

export const CONFIG_FILE = `${ROOT}/config`;

// 环境变量名 → 语义属性名
export const CONFIG_KEYS = {
  CTYUN_PROJECT_NAME: "projectName",
  CTYUN_REGION: "regionNameEng",
  CTYUN_QUEUE: "queueName",
  CTYUN_GPU_MODEL: "gpuModel",
  CTYUN_GPU_CARDS: "gpuCards",
  CTYUN_IMAGE: "imageName",
  CTYUN_STORAGE: "researchStorageName",
  CTYUN_SPACE: "researchSpaceName",
  CTYUN_LOCAL_GB: "localExpansionGb",
  CTYUN_LOCAL_MOUNT: "localMountPath",
  CTYUN_SSH_KEY: "sshKeyName",
  CTYUN_USED_GPU_THRESHOLD: "usedGpuThreshold",
  CTYUN_AUTO_STOP: "autoStop",
};

function unquote(value) {
  const t = value.trim();
  if (t.length >= 2 && ((t.startsWith('"') && t.endsWith('"')) || (t.startsWith("'") && t.endsWith("'")))) return t.slice(1, -1);
  return t;
}

/** 返回 { values: {属性名: 值}, sources: {属性名: "env"|"file"|undefined} } */
export async function readCliConfig() {
  const fileVals = {};
  try {
    const text = await fs.readFile(CONFIG_FILE, "utf8");
    for (const line of text.split("\n")) {
      const m = line.match(/^([A-Z_]+)=(.*)$/);
      if (m && m[1] in CONFIG_KEYS) fileVals[m[1]] = unquote(m[2]);
    }
  } catch { /* 无 config 文件 */ }
  const values = {}, sources = {};
  for (const [envName, prop] of Object.entries(CONFIG_KEYS)) {
    if (process.env[envName] !== undefined) { values[prop] = process.env[envName]; sources[prop] = "env"; }
    else if (fileVals[envName] !== undefined) { values[prop] = fileVals[envName]; sources[prop] = "file"; }
  }
  return { values, sources };
}

/** create/queue probe 必需的键缺失时抛带指引的错误 */
export function requireConfig(values, keys, label) {
  const missing = keys.filter(k => !values[k]);
  if (missing.length) {
    throw new Error(`${label}缺少默认配置: ${missing.join(", ")}。编辑 ${CONFIG_FILE} 设置对应 CTYUN_* 键（ctyun config 查看全部键名）`);
  }
}
