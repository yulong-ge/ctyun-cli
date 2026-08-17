# ctyun-cli — 天翼云科研助手命令行

esx.ctyun.cn（息壤·科研助手）网页版的 CLI 封装。**认证完全自包含**（账号密码直登，无需浏览器）。经独立代码审查修复：凭据脱敏、会话文件权限、状态护栏。

📖 **完整 API 文档见 [docs/api/](docs/api/README.md)** —— 369 个端点全量逆向（SPA 153 个 JS chunk 静态提取 + 2026-08-17 逐端点实测探测），含认证流程、响应信封、分域详解与机器可读原始数据，是本 CLI 的接口权威参考。

📚 **官方 OpenAPI 文档已本地化到 [docs/api/official/](docs/api/official/README.md)** —— 46 个官方 API（`bc-global.ctapi.ctyun.cn`，AK/SK 签名）+ 与逆向 API 的逐条对照 + CLI 双通道选型建议。

## 安装

零 npm 依赖（Node ≥ 18 + curl；`jexec`/`ssh-setup` 走原生 WebSocket 需 **Node ≥ 22**）。入口 `~/.local/bin/ctyun`。

## 认证（自包含）

```sh
ctyun login              # 交互式输入账号密码（密码不回显），或读取 ~/.ctyun/credentials
ctyun status             # 会话状态 + 业务验证（失败退出码非 0，可用于脚本健康检查）
ctyun logout             # 清除会话与凭据
```

- 凭据：`~/.ctyun/credentials`（**明文**，600 权限——风险自担；也可用 `CTYUN_USERNAME`/`CTYUN_PASSWORD` 环境变量）
- 会话：`~/.ctyun/session/`（700 目录，cookies.txt/token.txt 600 权限）
- 登录流程（与网页一致，纯 HTTP 无浏览器）：登录页拿风控 cookie → `POST /gw/auth/Login`（密码 3DES-ECB 加密）→ `accessToken` → SSO 交换 → 控制台 cookie（实测仅 3 个）→ **登录后自动做一次业务 API 验证**（防 cookie-less 风控假成功）
- `--user`/`--password` 参数仍可用于脚本，但密码会进 shell history，帮助文本不再宣传
- 迁移：`ctyun login --import-monitor` 从 gpu-platform-monitor 会话一次性导入（不再共享）

## 命令

```
ctyun envs [--json] [--perPage N] # 开发机列表（默认上限 100 条）
ctyun env <id> [--ssh] [--json] # 详情；--ssh 只打印 SSH 命令 + Jupyter 链接
ctyun start <id> [--cpu-only] [--dry-run] # 启动（仅已停止/失败/异常态；--dry-run 只打印提交体）
ctyun stop <id> [--dry-run]    # 停止（--dry-run 只打印请求体）
ctyun rename <id> <alias>      # 别名（--json）
ctyun delete <id> --yes        # 删除（必须显式 --yes）
ctyun queues                   # 各区域队列 GPU 占用
ctyun pool [--json]            # 监控目标队列快照
ctyun images [--region r] [kw] # 公共镜像
ctyun specs [--region r]       # 开发机规格
ctyun keys [--json]            # SSH 公钥
ctyun jobs [--json]            # 训练作业列表
ctyun pvc <ideId> [--json]     # 开发机存储卷
ctyun metrics <uuid> [--json]  # CPU/内存/GPU 利用率快照
ctyun create [选项] [--dry-run|--yes] # 创建开发机（默认复制监控配置，全参数可覆盖）
ctyun jexec <ideId> <代码|文件.py|cmd:...> # 经 Jupyter kernel 免 SSH 执行代码
ctyun ssh-setup <ideId> [--key <公钥>]     # 注入 SSH 公钥（幂等）
ctyun raw METHOD path [json]   # 任意端点（退出码反映业务码）
ctyun whoami                   # 项目信息
```

`--json` 支持于：envs / env / status(doctor) / queues / pool / keys / jobs / pvc / metrics（其余命令为表格/文本输出）。

### create 选项（全部可选，缺省=监控项目的抢卡配置）

```
--projectName X  项目名          --region X       可用区 (zj-pinghu-1)
--queue X        队列名          --gpuModel X     GPU 型号
--cards N        GPU 卡数        --image X        公共框架镜像名
--ssh-key X      SSH 公钥名      --storage X      科研文件存储名（不挂省略）
--space X        科研空间名      --name X         机器名（缺省 dev-env-随机）
--local-gb N     本地盘扩容 GB   --local-mount X  挂载点 (/research)
--local-ephemeral  本地盘不持久  --ssh-dedicated  专属 EIP 模式
--ssh-ips X      SSH 白名单 IP   --auto-stop N    自动停止策略
--count N        创建台数
```

示例：复制监控配置抢卡 → `ctyun create --dry-run`（核对）→ `ctyun create --yes`；
换 2 卡 + 小盘 → `ctyun create --cards 2 --local-gb 900 --yes`。提交前会自动按最新本地盘库存钳制扩容值（库存收缩时下调，不丢单）。

## Jupyter 通道（免 SSH 操作开发机）

开发机控制台除了 REST API，还有一条 **Jupyter 通道**（网页版终端/JupyterLab 同款）：复用 `/ide/get` 返回的 `openLink` + token，通过 Jupyter kernel 的 WebSocket 在开发机内执行代码。零依赖（Node ≥ 22 原生 WebSocket + fetch），不需要机器开了 SSH 端口、不需要公钥。

```sh
ctyun jexec 10031883 "print('hello')"          # 直接执行 Python 代码
ctyun jexec 10030973 /path/to/script.py        # 执行本地 .py 文件（读取后经 kernel 运行）
ctyun jexec 10031883 "cmd:df -h"               # 执行 shell 命令（subprocess shell=True）
ctyun ssh-setup 10031883                       # 注入 ~/.ssh/id_ed25519.pub 到 authorized_keys
ctyun ssh-setup 10030973 --key /tmp/other.pub  # 指定公钥文件
```

- `ssh-setup` **幂等**：公钥已存在时显示"已存在"，不重复追加；顺带修复 authorized_keys 历史粘连问题（文件末尾无换行导致多把 key 拼在一行）
- `jexec` 输出 kernel stdout；执行超时 180s；WebSocket 连接抖动自动重试 ×3
- 实现：`lib/jupyter.mjs`（JupyterChannel 类 + `injectSshKey()`）

**为什么要做协议自适应**：平台两种 Jupyter server 版本的 WebSocket 帧格式不同——老版本发 JSON 文本帧，新版本（默认）发二进制帧 `[块数][偏移量][6 个数据块]`。二进制 server 收到 JSON 文本帧会直接断连，所以连接后先静默等服务端推第一帧探测格式，再按对应格式发送，用户无感。

**踩过的坑**：`/ide/get` 返回的 token 不能直接用，必须先访问一次 `openLink` 根路径（**带尾斜杠**！平台按精确路径路由，不带就 404）触发 302 种下会话 cookie，再访问 `/lab` 拿 `_xsrf`，之后 REST/WS 才 401-free。平台会话约 1 小时过期（中途莫名 401 = 会话过期，`ctyun login` 重登即可）。

## JSON 策略

**Pass-through vs CLI envelope**：
- `envs --json` / `env --json` / `keys --json` / `raw`：**原样透传** API 返回的 JSON 对象/数组（stdout 纯 JSON，进度/诊断走 stderr）
- `status --json` / `queues --json` / `pool --json`：**CLI 构造** 的稳定 shape（字段见下）

**Success shape**（exit 0）：
- 透传类：API 原始对象（如 envs 为 `[{id, ideName, states, ...}]`）
- envelope 类示例——`status --json`：
  ```json
  {"version":"1.1.0","session":{"source":"credentials","mintedAt":"…","cookieMtime":"…"},
   "auth":{"available":true,"source":"config","missing_step":null},
   "api":{"reachable":true,"ok":true,"error":null}}
  ```

**Error shape**（exit 1，任何命令）：`{"ok": false, "error": "<人类可读原因>"}` 输出到 **stderr**；不含凭据（token/密码已脱敏）。stdout 无输出。

**每命令族示例**：
```sh
ctyun envs --json | jq '.[0].id'        # 透传: 直接取 API 字段
ctyun status --json | jq '.auth.source' # envelope: 取 CLI 字段
ctyun env 99999999 --json; echo $?      # → stderr {"ok":false,"error":"…"} , exit 1
```

## 普通用户权限矩阵（2026-08-16 实测）

对普通用户（无管理员权限）实测 25+ 端点：**零 PermissionDenied**。核心可用域：
- ✅ 开发机全生命周期（list/get/launch/stop/delete/alias/summary/toRemove/user_image）
- ✅ 队列与资源（queue/list+get、resource/summary、pool/list、pool/spec/list、sellout、check/share、本地盘库存）
- ✅ 训练作业（job/list、job/summary、job/template/list）
- ✅ 监控（monitor/getResourceUsageRateMetrics，POST + objectUuid）
- ✅ 镜像（image/list、shareImage/list、recommendedImage）
- ✅ EIP（eip/list）、权限（permission/user/policy）、项目空间（project_space/list）
- ⚠️ 部分端点返回 NotFound/Unimplemented 是**功能未开通或参数不全**（如 idleRule、predefClientIPs 需要 project_space 上下文），不是权限拒绝

SPA 路由对照后，CLI 未覆盖但已确认可用的域（按需可加命令）：`job/*` 训练作业管理、`infer_service/*` 推理服务、`ide/saveImage` 自定义镜像保存、`storage/pvc` 存储卷管理。

## 已验证接口

完整端点清单与实测结果见 [docs/api/reverse/endpoint-index.md](docs/api/reverse/endpoint-index.md)（369 条）。核心操作摘要：

| 操作 | 接口 | 验证方式 |
|---|---|---|
| 账号密码直登 | `POST www.ctyun.cn/gw/auth/Login` + SSO | ✅ 实测（3 cookies + token，业务 API 通） |
| 列表/详情 | `GET /bc/v1/ide/list` `/ide/get` | ✅ 实测（完整响应样本存 docs/api/reverse/data/samples.json） |
| 别名 | `POST /bc/v1/ide/updateAlias` | ✅ 实测写入+清除往返 |
| 启动 | `POST /bc/v1/ide/launch` | ✅ 路由实测（InvalidArgument 参数校验），实弹未做 |
| 停止 | `POST /bc/v1/ide/stop {id}` | ✅ 路由实测，实弹未做 |
| 删除 | `DELETE /bc/v1/ide/delete/{id}` | ✅ 路由实测（假 id 报"未找到ide资源"），实弹未做 |
| Jupyter kernel 执行代码 | `GET /ide/get` openLink + token → 激活 → `/api/kernels` → WS channels | ✅ 实测双协议（JSON + 二进制帧，2 台机器各一种） |
| SSH 公钥注入 | 同上链路 + `injectSshKey()` | ✅ 实测幂等、粘连修复 |

## 坑

1. nginx 对无 `/v1` 的路径 POST 返回 405（不是 404）。
2. `/bc/v2/*` 与 v1 同路径并存：**开发机生命周期/镜像/PVC 在 v2 对普通子账号 PermissionDenied**；但 v2 的科研存储（storage/research）、资源枚举（listGpuSpecs/enumGpuModels）、userFavor、ide summary/toRemove/delay 实测可用（详见 docs/api/README.md 的版本对照）。
3. 门户必须直连：客户端自动剔除 proxy 环境变量。
4. `.env` 风格文件里的值可能带引号——解析时必须剥 `"` 和 `'`。
5. 凭据直登曾经在某些出口 IP 被风控（cookie-less 登录）；本机当前可行（2026-08-16 实测）。若哪天直登拿到的会话无法访问业务 API，回退方案是 `login --import-monitor` 用浏览器会话。
6. Jupyter token 必须激活：访问 `openLink` 根路径要**带尾斜杠**（不带 404，302 不触发），否则 REST/WS 全部 401。
7. 平台 Jupyter server 有两种 WebSocket 帧格式（JSON 文本 / 二进制），禁止盲发 JSON——二进制 server 收到文本帧直接 1006 断连（`lib/jupyter.mjs` 已自动探测，改动时不要删掉）。
8. 平台会话约 1 小时过期：`jexec`/`ssh-setup` 中途莫名 401，跑 `ctyun login` 重登即可。
9. authorized_keys 文件末尾无换行会把多把 key 拼在一行导致 SSH 认证失败——`ssh-setup` 已自动修复。
