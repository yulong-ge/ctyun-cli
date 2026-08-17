// 展示层工具：状态码/计费模式翻译 + 简易表格
export const DEVELOP_ENV_STATUS = {
  0: "异常", 1: "等待创建", 2: "启动中", 3: "运行中", 4: "已停止", 5: "已完结",
  6: "运行失败", 7: "快照中", 8: "删除中", 9: "镜像挂载中", 10: "停止中",
  11: "更新中", 12: "变更存储中", 13: "停止快照中", 14: "变更规格中", 15: "更新配置中",
  100: "执行失败", 106: "已冻结",
};

export const BILLING_MODE = {
  1: "按需计费", 2: "包周期", 4: "专属资源池", 5: "免费试用",
};

export function statusName(states) {
  return DEVELOP_ENV_STATUS[states] ?? `未知(${states})`;
}

export function billingName(mode) {
  return BILLING_MODE[mode] ?? `模式${mode}`;
}

export function gpuText(ide) {
  const spec = ide.resourceSpecific ?? {};
  if (spec.specType === 0 || (!spec.quotaGpu && !spec.gpuModel)) return "无 (CPU)";
  return `${spec.quotaGpu}x ${spec.gpuModel ?? ""}`.trim();
}

export function fmtDuration(seconds) {
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  return h > 0 ? `${h}小时${m}分` : `${m}分钟`;
}

/** 极简 ASCII 表格：rows[0] 为表头 */
export function table(rows) {
  if (!rows.length) { console.log("(空)"); return; }
  const widths = [];
  for (const row of rows) {
    if (!Array.isArray(row)) continue;
    row.forEach((cell, i) => { widths[i] = Math.max(widths[i] ?? 0, String(cell).length); });
  }
  const line = (row) => row.map((cell, i) => String(cell).padEnd(widths[i])).join("  ");
  console.log(line(rows[0]));
  console.log(widths.map(w => "─".repeat(w)).join("──"));
  for (const row of rows.slice(1)) console.log(line(row));
}
