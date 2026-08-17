#!/usr/bin/env node
// ctyun — 天翼云科研助手 CLI 入口。命令定义见 lib/cli.mjs（Commander）。
import { run } from "../lib/cli.mjs";

run(process.argv).catch(error => {
  // --json 模式下错误也必须机器可读（cli-creator: errors must be machine-readable）
  const jsonMode = process.argv.slice(2).includes("--json");
  if (jsonMode) {
    process.stderr.write(JSON.stringify({ ok: false, error: error.message }) + "\n");
  } else {
    console.error(`❌ ${error.message}`);
  }
  process.exitCode = 1;
});
