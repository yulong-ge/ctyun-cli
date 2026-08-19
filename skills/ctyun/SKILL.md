---
name: ctyun
description: "Use when operating 天翼云科研助手 (esx.ctyun.cn) GPU dev environments, training jobs, inference services, or research storage — list/start/stop/delete dev envs, grab free GPUs, run code via Jupyter, manage SSH keys and custom images. Install: npm install -g git+https://github.com/yulong-ge/ctyun-cli.git"
---

# ctyun — 天翼云科研助手 CLI

## Verify the command exists

```sh
command -v ctyun || npm install -g git+https://github.com/yulong-ge/ctyun-cli.git
ctyun --version
```

## First command to run

```sh
ctyun status        # 双通道体检: 官方 AK/SK + 控制台会话 + 业务验证; 全失败 exit 1
ctyun --json status # 机器可读版 (cli-creator 契约)
```

## Auth (two channels, auto-selected per command)

- **official** (preferred): AK/SK, never expires. Setup once: `ctyun aksk` (interactive, SK hidden). Or env `CTYUN_AK`/`CTYUN_SK`. Covers env lifecycle, jobs, images, keys, storage, quotas, bill.
- **console**: username/password session (~1h expiry). `ctyun login` (interactive). Covers env create (space-level storage mount), queue probe, env pvc, env rename, inference services, summary, events, raw.
- Defaults for env create / queue probe live in `~/.ctyun/config` (never in the repo). `ctyun config` shows them.
- Force one channel for debugging: any command `--channel official|console`.

## Discovery → stable IDs

```sh
ctyun env list                 # dev env IDs (first column)
ctyun env get <id> --json      # details incl. openLink
ctyun whoami                   # enterprise project ID
ctyun spec list / queue list / pool list   # specId / queueId / resourcePoolId
ctyun image list [kw] [--custom]     # imageId (public / custom)
ctyun storage list              # storageId + regionId
ctyun key list                 # SSH key ids
```

## Safe read path (start here)

```sh
ctyun env list ; ctyun env get <id> ; ctyun job list ; ctyun env metrics <id>
```

## Intended write path (always preview first)

```sh
ctyun env start/stop <id> [<id> ...]      # lifecycle (state-guarded; multiple ids = batch)
ctyun env create --dry-run → --yes        # dev env (defaults from ~/.ctyun/config)
ctyun job logs <jobId>                    # training logs (official-only)
ctyun env exec <id> "print('hi')"         # run Python via Jupyter (no SSH needed)
```

## Raw escape hatches

```sh
ctyun api listResources '{}'              # any official OpenAPI action (46)
ctyun raw GET /ide/summary                # any console endpoint (369 documented in docs/api/)
```

## Do NOT run without explicit user approval

- Any `--yes` destructive command: `env delete`, `job delete`, `image delete`, `storage delete`, `infer delete`, `key delete`.
- Real `env create --yes`, `job create`, `storage create` (spends quota/money) — always `--dry-run` first and show the user.
- `raw`/`api` with non-GET methods against production.

## Copy-pasteable examples

```sh
ctyun queue probe                                 # 目标队列快照: 空闲/售罄/可提交
ctyun env get 10031883 --ssh                      # SSH 命令 + Jupyter 链接
ctyun env exec 10031883 cmd:nvidia-smi            # 免 SSH 查 GPU
ctyun env metrics 10031883                        # CPU/内存/GPU 利用率（数字 ID 自动解析 uuid）
ctyun env stop 10031883 10031884                  # 多台批量停止
```

Full API reference: repo `docs/api/` (official + reverse-engineered, with per-endpoint caveats).
