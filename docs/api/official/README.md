# 天翼云·科研助手 官方 OpenAPI 文档（本地化）

> **来源**：天翼云 OpenApi 能力开发平台 [eop.ctyun.cn](https://eop.ctyun.cn/ebp/ctapiDocument/search?sid=131&data=187&vid=265)，产品「科研助手」（serviceCode `bc`，API 版本 2023-10-11）。
> **抓取方式**：站点文档数据 JSON 接口直接拉取（46 个 API 详情 + 概览/终端节点/状态码），「构造请求/认证鉴权」从页面静态脚本还原。抓取日期 2026-08-17。
> **与逆向文档的关系**：见 [../README.md](../README.md#官方-api-与逆向-api对照与选型建议)。

## 基本信息

| 项 | 值 |
|---|---|
| 终端节点（Endpoint） | `bc-global.ctapi.ctyun.cn`（全局，无区域后缀） |
| 路径风格 | 全部 `POST /api/bc/v2/{action}`（46/46 为 POST + JSON，RPC 风格） |
| 认证 | AK/SK + `Eop-Authorization` 签名头（**无需登录会话**） |
| 是否需要审批 | 46 个接口全部「否」 |
| 默认流控 | 1000 QPS 级（各接口文档「流控信息」节） |

## 文件导航

| 文件 | 内容 | API 数 |
|---|---|---|
| [basics.md](basics.md) | 概述 / 终端节点 / 请求状态码（BC_0001… 业务码表） | — |
| [calling-guide.md](calling-guide.md) | **构造请求 + 认证鉴权**（Eop-Authorization 签名算法全步骤、规范 URI 编码） | — |
| [ide.md](ide.md) | 开发机：launchIde/stopIde/deleteIde/createIde/listIdes/getIdeDetail、公共/自定义镜像、SSH 公钥、SSH 白名单、换镜像 | 14 |
| [monitor.md](monitor.md) | getResourceUsageRate（注意并发限流，单次≤5 实例） | 1 |
| [resource-pool.md](resource-pool.md) | 资源池 CRUD、可用区/规格列表、一键初始化、本地盘余量、共享集群配额 | 9 |
| [queue.md](queue.md) | 队列 CRUD、实例与配额查询 | 5 |
| [storage-research.md](storage-research.md) | 科研文件 CRUD、扩容、存储规格 | 6 |
| [image.md](image.md) | saveIdeImage、自定义镜像组织（CRS）列表 | 3 |
| [training-job.md](training-job.md) | 并行计算作业全生命周期 + 日志 | 7 |
| [project-space.md](project-space.md) | 子账号账单明细 | 1 |
| [data/](data/) | 原始 JSON（catalog、official-uris、46 个 API 详情、前置页） | — |

## 全量 46 个官方 API（速查）

| 官方路径 | 中文名 | 英文名 | 对应控制台端点（逆向） |
|---|---|---|---|
| POST /api/bc/v2/createIde | 创建开发机 | createIde | `POST /bc/v1/ide/create` / `/ide/batch/create` |
| POST /api/bc/v2/launchIde | 启动开发机 | launchIde | `POST /bc/v1/ide/launch` |
| POST /api/bc/v2/stopIde | 停止开发机 | stopIde | `POST /bc/v1/ide/stop` |
| POST /api/bc/v2/deleteIde | 删除开发机 | deleteIde | `DELETE /bc/v1/ide/delete/{id}` |
| POST /api/bc/v2/listIdes | 开发机列表 | listIdes | `GET /bc/v1/ide/list` |
| POST /api/bc/v2/getIdeDetail | 开发机详情 | getIdeDetail | `GET /bc/v1/ide/get` |
| POST /api/bc/v2/updateIdeImage | 更新开发机镜像 | updateIdeImage | `POST /bc/v1/ide/updateImage` |
| POST /api/bc/v2/updateSSHClientIPs | 更新 SSH 白名单 | updateSSHClientIPs | `POST /bc/v1/ide/sshClientIPs/update` |
| POST /api/bc/v2/listPublicImages | 公共镜像列表 | listPublicImages | `GET /bc/v1/ide/image/list` |
| POST /api/bc/v2/listCustomerIdeImages | 自定义镜像列表 | listCustomerIdeImages | `GET /bc/v1/ide/user_image/list` |
| POST /api/bc/v2/deleteCustomerIdeImage | 删除自定义镜像 | deleteCustomerIdeImage | `POST /bc/v1/ide/user_image/delete` |
| POST /api/bc/v2/saveIdeImage | 保存开发机镜像 | saveIdeImage | `POST /bc/v1/ide/saveImage` |
| POST /api/bc/v2/createPublicKey | SSH 创建公钥 | createPublicKey | `POST /bc/v1/ide/publicKey/create` |
| POST /api/bc/v2/deletePublicKey | SSH 删除公钥 | deletePublicKey | `POST /bc/v1/ide/publicKey/delete` |
| POST /api/bc/v2/listPublicKeys | SSH 公钥列表 | listPublicKeys | `POST /bc/v1/ide/publicKey/list` |
| POST /api/bc/v2/getResourceUsageRate | 查询资源使用率 | getResourceUsageRate | `POST /bc/v1/monitor/getResourceUsageRateMetrics` |
| POST /api/bc/v2/createResourceAndQueueByOneClick | 一键初始化 | createResourceAndQueueByOneClick | `GET /bc/v1/resource/pool/oneclick` |
| POST /api/bc/v2/createResource | 创建资源池 | createResource | `POST /bc/v1/resource/pool/create` |
| POST /api/bc/v2/deleteResource | 删除资源池 | deleteResource | `POST /bc/v1/resource/pool/delete` |
| POST /api/bc/v2/listResources | 资源池列表 | listResources | `GET /bc/v1/resource/pool/list` |
| POST /api/bc/v2/getResourceDetail | 资源池详情 | getResourceDetail | `GET /bc/v1/resource/pool/detail` |
| POST /api/bc/v2/listResourceRegions | 可用区列表 | listResourceRegions | `GET /bc/v1/bc/ops/region/list` |
| POST /api/bc/v2/listResourceSpecs | 规格列表 | listResourceSpecs | `GET /bc/v1/resource/pool/spec/list` |
| POST /api/bc/v2/listSharedClusterQuotas | 共享集群/租户配额 | listSharedClusterQuotas | `GET /bc/v1/cluster/shared_quota` |
| POST /api/bc/v2/querySpecLocalStorageInventory | 本地盘余量 | querySpecLocalStorageInventory | `GET /bc/v1/resource/getSpecLocalStorageInventory` |
| POST /api/bc/v2/createQueue | 创建队列 | createQueue | `POST /bc/v1/queue/create` |
| POST /api/bc/v2/updateQueue | 更新队列 | updateQueue | `POST /bc/v1/queue/update` |
| POST /api/bc/v2/deleteQueue | 删除队列 | deleteQueue | `POST /bc/v1/queue/delete` |
| POST /api/bc/v2/listQueues | 队列列表 | listQueues | `GET /bc/v1/queue/list` |
| POST /api/bc/v2/getInstancesAndQuota | 实例和配额 | getInstancesAndQuota | `POST /bc/v1/queue/check/share`（近似） |
| POST /api/bc/v2/createTrainingJob | 创建并行计算作业 | createTrainingJob | `POST /bc/v1/job/createTrainingJob` |
| POST /api/bc/v2/startTrainingJob | 启动并行计算作业 | startTrainingJob | `POST /bc/v1/job/startTrainingJob` |
| POST /api/bc/v2/stopTrainingJob | 停止并行计算作业 | stopTrainingJob | `POST /bc/v1/job/stopTrainingJob` |
| POST /api/bc/v2/deleteTrainingJob | 删除并行计算作业 | deleteTrainingJob | `POST /bc/v1/job/deleteTrainingJob` |
| POST /api/bc/v2/listTrainingJobs | 作业列表 | listTrainingJobs | `POST /bc/v1/job/describeTrainingJobs` |
| POST /api/bc/v2/getTrainingJob | 作业详情 | getTrainingJob | `POST /bc/v1/job/describeTrainingJob` |
| POST /api/bc/v2/queryTrainingJobLogs | 作业日志 | queryTrainingJobLogs | （控制台无直接对应） |
| POST /api/bc/v2/createStorageResearch | 创建科研文件 | createStorageResearch | `POST /bc/v2/storage/research/create` |
| POST /api/bc/v2/deleteStorageResearch | 删除科研文件 | deleteStorageResearch | `POST /bc/v2/storage/research/delete` |
| POST /api/bc/v2/listStorageResearch | 科研文件列表 | listStorageResearch | `GET /bc/v2/storage/research/list` |
| POST /api/bc/v2/getStorageResearchDetail | 科研文件详情 | getStorageResearchDetail | `GET /bc/v2/storage/research/describe` |
| POST /api/bc/v2/resizeStorageResearch | 科研文件扩容 | resizeStorageResearch | `POST /bc/v2/storage/research/resize` |
| POST /api/bc/v2/listStorageResearchSpecs | 存储规格列表 | listStorageResearchSpecs | `GET /bc/v2/storage/research/spec/list` |
| POST /api/bc/v2/listCustomerImageOrgs | 镜像组织列表 | listCustomerImageOrgs | `POST /bc/v1/crs/project/page`（近似） |
| POST /api/bc/v2/listCustomerImageOrgRegions | 镜像组织区域 | listCustomerImageOrgRegions | （控制台无直接对应） |
| POST /api/bc/v2/listUserBillDetail | 子账号账单明细 | listUserBillDetail | `POST /bc/v1/project_space/list_user_bill_detail` |

## 调用要点（从官方文档提炼）

1. **签名头**（详见 [calling-guide.md](calling-guide.md)）：
   - `Eop-Authorization: <ak> Headers=ctyun-eop-request-id;eop-date Signature=<base64(hmacSHA256(sigture, kdate))>`
   - 密钥派生链：`ktime=hmacSHA256(eop-date, sk)` → `kAk=hmacSHA256(ak, ktime)` → `kdate=hmacSHA256(eop-date, kAk)`
   - `sigture = 排序后的签名 Header 列表 + "\n" + encode(query) + "\n" + toHex(sha256(body))`
2. **必带头**：`ctyun-eop-request-id`（UUID）、`Eop-date`（`yyyyMMddTHHmmssZ`）、`Content-Type: application/json`。
3. **规范 URI**：resource-path 每段需 RFC3986 编码；query 的值需 encode 后参与签名。
4. **响应信封**：`{statusCode: "200", message, returnObj: {...}}`（`returnObj` 内为业务数据，形态与控制台 API 基本一致，如 `status.code: "ok"`）。
5. **AK/SK 获取**：门户「我的→个人中心→安全设置→用户AccessKey→新建」。

## 重新抓取（文档更新时）

```sh
# 1. 目录与前置页（serviceId=187, versionId=265, sid=131）
curl 'https://eop.ctyun.cn/ebp/ctapiDocumOut/openApiMenu/187?versionId=265'          # 菜单(apiId)
curl 'https://eop.ctyun.cn/ebp/ctapiDocumOut/apiOverview/187?versionId=265'          # 概览(英文名)
curl 'https://eop.ctyun.cn/ebp/ctapiDocumOut/useMustKnowSummary/187/265'             # 概述
curl 'https://eop.ctyun.cn/ebp/ctapiDocumOut/useMustKnowEndpoint/187/265'            # 终端节点
curl 'https://eop.ctyun.cn/ebp/ctapiDocumOut/useMustKnowStateyErrorCode/187'         # 状态码
# 2. 每个 API（apiId 来自概览 capacityId）
curl 'https://eop.ctyun.cn/ebp/ctapioutDocument/queryCtApiByCapacityId/17300'        # launchIde
```
