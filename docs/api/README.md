# 天翼云·息壤科研助手 API 文档

两套并行的 API 文档集，交叉对照：

| 文档集 | 内容 | 端点数 |
|---|---|---|
| [reverse/](reverse/README.md) | **控制台逆向 API**：`esx.ctyun.cn` SPA 153 个 JS chunk 静态提取 + 2026-08-17 逐端点实测探测的完整快照 | 369 |
| [official/](official/README.md) | **官方 OpenAPI**：eop.ctyun.cn「科研助手」文档全量本地化（46 个 API + AK/SK 签名指南） | 46 |

- 逆向文档：[认证](reverse/authentication.md) · [开发机+Jupyter](reverse/ide.md) · [资源池/队列/规格](reverse/resource.md) · [训练作业](reverse/job.md) · [存储](reverse/storage.md) · [镜像](reverse/image.md) · [推理/模型仓库](reverse/inference.md) · [项目空间](reverse/project.md) · [监控](reverse/monitor.md) · [网络](reverse/network.md) · [平台基础](reverse/platform.md) · [全量索引](reverse/endpoint-index.md) · [原始数据](reverse/data/)
- 官方文档：[调用指南/签名](official/calling-guide.md) · [基础信息/状态码](official/basics.md) · [开发机](official/ide.md) · [资源池](official/resource-pool.md) · [队列](official/queue.md) · [科研文件](official/storage-research.md) · [并行计算](official/training-job.md) · [镜像](official/image.md) · [监控](official/monitor.md) · [账单](official/project-space.md) · [原始数据](official/data/)

## 官方 API 与逆向 API：对照与选型建议

> 本节结论基于 2026-08-17 对官方文档逐字段的核对（含 createIde/getResourceDetail/listQueues/getInstancesAndQuota/getIdeDetail 的完整参数表）。

| 维度 | 官方 OpenAPI | 控制台逆向 API |
|---|---|---|
| 端点数 | **46**（全部 `POST /api/bc/v2/{action}`，终端节点 `bc-global.ctapi.ctyun.cn`） | **369**（v1 291 + v2 74 + 门户 4） |
| 认证 | AK/SK + Eop-Authorization 签名（**无会话概念，不过期、无风控**） | 账号密码登录 → cookie + Bearer（约 1h 过期，有风控风险） |
| 稳定性 | 官方契约，有版本与变更历史 | 随前端发版变化，无契约 |
| 响应信封 | `{statusCode, message, error, returnObj:{...}}`（returnObj 内与控制台信封同构） | `{requestId, status:{code,message}, ...业务字段}` |

### CLI 核心流程的官方覆盖核对（逐项验证）

| CLI 需求 | 官方 API | 状态 |
|---|---|---|
| 创建链：企业项目 | `createIde.projectId` 可选（默认 "0"）；projectId/projectName 可从 `listQueues` 响应中发现 | ✅ |
| 创建链：可用区 | `listResourceRegions` | ✅ |
| 创建链：队列 | `listQueues`（含 `capabilityGpu/Cpu/Mem`、`state`） | ✅ |
| 创建链：规格 | `listResourceSpecs`（含 `gpuModel`、`quotaGpu`、**`sellout` SOLDOUT/UNSOLDOUT**） | ✅ 售罄直接内置 |
| 创建链：镜像 | `listPublicImages` / `listCustomerIdeImages` + `createIde.imageType`(0 公共/1 社区/2 自定义) | ✅ |
| 创建链：SSH 公钥 | `listPublicKeys` / `createPublicKey` / `deletePublicKey` | ✅ |
| 创建链：科研文件挂载 | `createIde.researchStorageInfo[{storageId, mountPath}]`（上限 2 个）+ `listStorageResearch` | ✅ storageId 粒度 |
| 创建链：本地盘 | `createIde.localStorageInfo{pvSize≥50, mountPath, isPersistenceEnabled}` + `querySpecLocalStorageInventory` 余量 | ✅ |
| 抢卡轮询：队列已用/总 GPU | `listQueues.capabilityGpu`（总）+ `getInstancesAndQuota`（quota + `usageInfo{total, used, usageRate}`，rest=total−used 自行换算） | ✅ |
| 抢卡轮询：售罄 | `listResourceSpecs.sellout` | ✅ |
| 抢卡轮询：配额预检 | `getInstancesAndQuota` | ✅ 近似（控制台 `queue/check/share` 有 `meetNeed` 结论字段，官方需自行计算） |
| 开发机列表/详情/生命周期 | `listIdes` / `getIdeDetail`（**含 `openLink`、`token`、`sshCommand`、`vncInfo`**）/ `launchIde` / `stopIde` / `deleteIde` / `createIde` / `updateIdeImage` / `updateSSHClientIPs` | ✅ |
| Jupyter 通道 | `getIdeDetail` 返回 `openLink` + `token`，激活链路与控制台相同 | ✅ 可引导 |
| 监控 | `getResourceUsageRate`（注意单次≤5 实例限流） | ✅ |
| 训练作业 | 全套 lifecycle + `queryTrainingJobLogs`（**日志查询为官方独有**） | ✅ |
| 科研文件管理 | `create` / `delete` / `list` / `getDetail` / `resize` / `listSpecs` | ✅ |

### 官方 API 的真实剩余差距

1. **空间（space）粒度**：控制台挂载是 spaceId 级（同一 storage 按人员分空间、配额隔离）；官方 `createIde.researchStorageInfo` 只到 **storageId** 粒度、无 spaceId 参数，也无空间列表/创建 API。单空间场景无差异；多人共享同一 storage 时隔离行为未验证（官方 API 版本 2023-10-11 可能早于 space 功能上线）。
2. **便利功能**：批量操作（batchCreate/Launch/Stop）、别名（updateAlias）、`ide/summary`、`toRemove`、变配（updateSpecific）、保存镜像进度查询（saveIdeImage 无 pushProgress 对应端点）。
3. **长尾运维域**：推理服务、模型仓库、EIP、ECR Secret、PVC 明细、调度策略、专属池管理、项目空间成员管理、AI 助手、数据迁移——官方均无。
4. **响应字段丰富度**：控制台 `/ide/get` 返回 ~80 个字段（服务端口映射、闲置策略、visibility 等），官方 `getIdeDetail` 约 35 个——做监控面板时控制台信息更全。

### 选型建议：官方为主、逆向为辅

1. **CLI 主通道切官方 API**（需新增 AK/SK 凭据支持，如 `ctyun login --ak-sk`）：创建链、抢卡轮询、开发机/作业生命周期、监控、科研文件、Jupyter 通道引导全部官方可达成——从此不受 1 小时会话过期、登录风控、SPA 改版影响。批量创建用循环单台 `createIde` 即可。
2. **控制台通道保留为补充**，覆盖官方没有的：空间级挂载（如需隔离）、别名/summary/变配、推理服务/模型仓库/EIP/调度等扩展命令，以及需要 `/ide/get` 全字段的场景。凭证仍是账密登录。
3. **参数语义两侧一致**（`ideId`/`autoStop`/`stopDuration`/`sshClientIps` 同名同义），CLI 内部可做一层通道无关的抽象，两通道按端点可用性自动降级/切换。

逐条对照表见 [official/README.md](official/README.md#全量-46-个官方-api速查)。
