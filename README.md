# ctyun-cli

天翼云科研助手（esx.ctyun.cn）命令行工具。管理 GPU 开发机、队列资源、训练作业、推理服务、科研文件存储、自定义镜像与 SSH 公钥，支持脚本化调用（JSON 输出、非零退出码）。

## 功能

- 开发机生命周期：列表、详情、创建、启动、停止、删除、别名
- 队列与资源：队列 GPU 占用、开发机规格（含售罄状态）、资源池清单、共享集群与租户配额
- 训练作业：列表、详情、创建、启动、停止、删除、日志
- 推理服务：列表、详情、启动、停止、删除
- 科研文件存储：列表、详情、创建、扩容、删除
- 镜像：公共镜像与自定义镜像列表、开发机保存为镜像、更换镜像、删除镜像
- SSH 公钥与白名单管理
- 监控指标：CPU、内存、GPU、显存利用率
- 在开发机内执行代码（经 Jupyter 通道，无需 SSH）
- 通用接口调用（`api`、`raw`），可访问全部已文档化接口

## 环境要求

- Node.js ≥ 18（`env exec`、`env ssh-setup` 需要 Node ≥ 22）
- curl

## 安装

```sh
npm install -g git+https://github.com/yulong-ge/ctyun-cli.git
ctyun --version
```

升级：重复执行安装命令。

## 凭据配置

工具使用两类凭据，按命令自动选择；也可用 `--channel official|console` 指定。

| 凭据 | 配置方式 | 特性 |
|---|---|---|
| 官方 OpenAPI AK/SK | `ctyun aksk`（交互式输入）或环境变量 `CTYUN_AK` / `CTYUN_SK` | 不过期 |
| 控制台账号密码 | `ctyun login`（交互式输入）或环境变量 `CTYUN_USERNAME` / `CTYUN_PASSWORD` | 会话约 1 小时过期，过期后重新执行 `ctyun login` |

配置完成后运行 `ctyun status` 验证两类凭据。

以下命令仅使用控制台凭据：`env create`、`queue probe`、`env pvc`、`env rename`、`whoami`、`raw`、`summary`、`events`、`infer *`、`key list`（子账号）。

## 快速开始

```sh
ctyun aksk                    # 配置 AK/SK
ctyun login                   # 配置控制台凭据
ctyun status                  # 验证

ctyun env list                # 开发机列表
ctyun env <id>                # 开发机详情（SSH 命令、Jupyter 链接）
ctyun env <id> --ssh          # 只输出 SSH 命令与 Jupyter 链接
ctyun queue list              # 队列 GPU 占用
ctyun spec list               # 开发机规格（含售罄状态）
ctyun queue probe             # 监控目标队列快照（目标来自 ~/.ctyun/config）

ctyun env metrics <id>        # 利用率（可直接传开发机数字 ID，自动解析 uuid）
ctyun env exec <id> "print(1)"   # 在开发机内执行 Python 代码
ctyun env exec <id> cmd:nvidia-smi
```

## 命令一览

完整列表运行 `ctyun --help`，各命令参数运行 `ctyun <命令> --help`。命令按资源分组：

| 分类 | 命令 |
|---|---|
| 凭据与诊断 | `config` `login` `logout` `aksk` `status` |
| 开发机 | `env <id>` `env get` `env list` `env create` `env start`（接受多台）`env stop`（接受多台）`env delete` `env rename` `env set-image` `env pvc` `env metrics` `env exec` `env ssh-setup` `env ssh-ips` |
| 训练作业 | `job list` `job get` `job create` `job start` `job stop` `job delete` `job logs` |
| 推理服务 | `infer list` `infer get` `infer start` `infer stop` `infer delete` |
| 科研存储 | `storage list` `storage get` `storage specs` `storage create` `storage resize` `storage delete` |
| 镜像 | `image list` `image save` `image delete`（更换开发机镜像用 `env set-image`） |
| SSH 公钥 | `key list` `key create` `key delete` |
| 队列与资源池 | `queue list` `queue probe` `pool list` `spec list` `quota list` `bill` |
| 监控与审计 | `summary` `my-ip` `events` `whoami` |
| 通用接口调用 | `api`（官方 OpenAPI）`raw`（控制台接口） |

破坏性操作（`env delete`、`job delete`、`infer delete`、`image delete`、`storage delete`、`key delete`）需要显式 `--yes`；`env create`、`env start`、`env stop` 与 `job create` 支持 `--dry-run` 预览提交内容。

## 用户默认配置

`env create` 与 `queue probe` 的默认参数来自 `~/.ctyun/config`（KEY=VALUE 格式，权限 600）。`ctyun config` 查看当前生效值与来源。优先级：命令行参数 > 环境变量 > 配置文件。

| 配置键 | 说明 |
|---|---|
| `CTYUN_PROJECT_NAME` | 企业项目名 |
| `CTYUN_REGION` | 可用区 |
| `CTYUN_QUEUE` | 队列名（`queue probe` 的监控目标） |
| `CTYUN_GPU_MODEL` / `CTYUN_GPU_CARDS` | GPU 型号与卡数 |
| `CTYUN_IMAGE` | 公共镜像名 |
| `CTYUN_STORAGE` / `CTYUN_SPACE` | 科研存储名与空间名 |
| `CTYUN_LOCAL_GB` / `CTYUN_LOCAL_MOUNT` | 本地盘扩容容量与挂载点 |
| `CTYUN_SSH_KEY` | SSH 公钥名 |
| `CTYUN_USED_GPU_THRESHOLD` | `queue probe` 的队列占用上限 |
| `CTYUN_AUTO_STOP` | 自动停止时长（小时） |

## JSON 输出约定

- 成功：API 原始 JSON 输出到 stdout，退出码 0
- 失败：`{"ok": false, "error": "..."}` 输出到 stderr，退出码 1

```sh
ctyun env list --json | jq '.[0].id'
```

## 常见问题

| 现象 | 处理方式 |
|---|---|
| 报错"会话已失效 (HTTP 401)" | 重新执行 `ctyun login` |
| `key list` 提示 "Only the primary account has permission" 后自动改用控制台通道 | 官方接口仅主账号可用；子账号需要控制台凭据 |
| `bill` 报 "non-admin groups are not authorized" | 该接口需要主账号或平台加白名单 |
| `env list` 使用官方凭据时返回的开发机多于控制台 | 官方接口默认返回主账号下全部开发机，不按企业项目过滤 |
| `summary` 的开发机计数为 0 | 原因未查明；输出中附带口径说明，开发机清单以 `ctyun env list` 为准 |
| `my-ip` 提示未返回出口 IP | 原因未查明；可使用 `curl -s ifconfig.me` 替代 |

## 相关项目

- 接口文档：`docs/api/`（官方 OpenAPI 与控制台接口的本地化文档）
