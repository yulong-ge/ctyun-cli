# 网络域（EIP / ECR Secret / 白名单 IP）— 15 个端点

## EIP 弹性公网 IP（/bc/v1/eip/*）

开发机 SSH（Dedicated 模式）与服务端口暴露用的独立 EIP。

| 方法 | 端点 | SPA 函数 | 实测 | 说明 |
|---|---|---|---|---|
| GET | `/bc/v1/eip/list` | getList | ✅ ok | query: `resourceId, regionNameEng, paging.*` |
| GET | `/bc/v1/eip/get` | get | ✅ InvalidArgument | query `uuid` |
| GET | `/bc/v1/eip/regionInfo/list` | getRegionInfoList | ✅ ok | EIP 可用区域 |
| POST | `/bc/v1/eip/create` / `delete` / `updateClientIPs` | — | 🔐 PermissionDenied | EIP 管理需授权 |

## ECR 容器仓库 Secret（/bc/v1/secret/*）

| 方法 | 端点 | 实测 | 说明 |
|---|---|---|---|
| GET | `/bc/v1/secret/list` | ✅ InvalidArgument | `queueId` 必填（区域级列表） |
| POST | `/bc/v1/secret/create` / `delete` | ✅ InvalidArgument | `name` |
| GET | `/bc/v1/secret/ecr/check`（v1/v2） | ✅ InvalidArgument | `queueId` — 检查队列是否已配 ECR 拉取凭据 |

## 预定义白名单 IP（/bc/v1/predefClientIPs/*）

项目空间级别的预置 IP 白名单（SSH/端口放行），依赖 project_space 上下文：

| 方法 | 端点 | 实测 | 说明 |
|---|---|---|---|
| POST | `/bc/v1/predefClientIPs/getClientIP` | ✅ ok | **探测当前出口 IP**（CLI 自动填白名单用） |
| POST | `/bc/v1/predefClientIPs/getPredefClientIPs` | ⚠️ NotFound | 需 project_space（未找到 project_space 资源） |
| POST | `/bc/v1/predefClientIPs/setPredefClientIPs` / `unsetPredefClientIPs` | ⚠️ NotFound | 同上 |

## 白名单格式约定（实测自 /ide/get 响应）

`sshClientIps` / `servicePortClientIps` 为**逗号分隔的 CIDR** 字符串，如 `"203.0.113.10/32,198.51.100.7/32"`。更新走 `/ide/sshClientIPs/update`、`/ide/servicePortIPs/update`（见 ide.md）。
