# 资源池 / 队列 / 规格 / 调度域 — 68 个端点

创建开发机/作业前的资源发现链：**企业项目 → 可用区（资源池）→ 队列 → 规格**，外加配额校验与售罄检查。专属池管理（exclusivePool）与调度策略为管理员域。

## 发现链四步（实测参数）

### 1. POST /bc/v1/bc/project/list — 企业项目

body：`{"action_name": ["bc:job:create"]}`（按操作过滤可用项目）。

```json
{ "projects": [ { "projectId": "<PROJECT_UUID>",
                  "projectName": "<PROJECT_NAME>",
                  "status": 1 } ] }
```

`status === 1` 为可用。> 注意：`/bc/v1/project/list`（无 /bc 前缀）在 SPA 中也被引用但返回 NotFound，属前端遗留，勿用。

### 2. GET /bc/v1/bc/ops/region/list — 可用区（资源池）

query：`paging.page=1&paging.perPage=999&poolType=exclusive`（共享池用 `shared`）。

`opsRegionInfo[]` 关键字段：`regionName`（中文）、`regionNameEng`（如 `zj-pinghu-1`）、`resourceId`（后续所有资源接口的主键）、`clusterId`、`arch`（1=x86，镜像查询用）、`capabilities`、`assistQueueId`、`storageNetworkState`、`professionalQueues`。

### 3. GET /bc/v1/queue/list — 队列

query：`resourceId`、`regionNameEng`、`projectId`、`poolType=exclusive`。

`queues[]` 关键字段：`id`（queueId）、`queueName`、`exclusivePoolUuid`（规格查询用）、`capabilityCpu/Gpu/Mem`（总容量）、`allocated: {cpu, gpu, mem}`（已用）、`guaranteeCpu/Gpu/Mem`、`state`、`weight`、`reclaimable`。

### 4. GET /bc/v1/resource/pool/spec/list — 规格

query：`resource_id`、`regionNameEng`、`paging.*`、`querySpecKind=ExclusivePoolProductSpec`、`exclusivePoolUuid`（来自队列）。

`specs[]` 字段：`id`（specId）、`quotaCpu/quotaGpu/quotaMem`、`gpuModel`（如 `NVIDIA-A100-SXM4-80GB`）、`k8sGpuModel`、`specType`、`sellout`、`lowCudaVersion/highCudaVersion`、`quotaLocalStorage`、`alias`、`gpuMem`、`singlePrecisionParam/halfPrecisionParam`（算力参数）。

## 配额与售罄检查（提交前预检）

| 方法 | 端点 | 参数 | 实测响应 |
|---|---|---|---|
| GET | `/bc/v1/resource/pool/spec/sellout` | `specId, resourceId, regionNameEng, exclusivePoolUuid, useIdleResource=0` | `{sellout: 2}`（1=售罄, 2=有货） |
| POST | `/bc/v1/queue/check/share` | `{queueId, resourceId, cpuReq, gpuReq, memReq, jobType:1, chipInfo:[{modelName, number, k8s_gpu_model}]}` | `{meetNeed:1, restCpu:48, restGpu:0, restMem:480, notEnoughRes:[]}`（meetNeed 2=不满足） |
| GET | `/bc/v1/resource/getSpecLocalStorageInventory` | `resourceId, specId, regionNameEng, exclusivePoolUuid` | `{inventoryLocalStorage:5350, limitLocalStorage:365122}`（可扩容上限 GB，需减基础 50） |
| POST | `/bc/v1/resource/batchCheckQuota` | 批量配额 | ⚠️ NotFound（空参），需有效上下文 |
| POST | `/bc/v2/resource/listGpuSpecs` | `{}` 也可 | GPU 规格枚举 ✅ ok |
| POST | `/bc/v2/resource/enumGpuModels` | `{}` | GPU 型号枚举 ✅ ok |
| POST | `/bc/v2/resource/compute/spec/enum` | `{}` | 规格类型枚举 ✅ ok |
| POST | `/bc/v2/resource/compute/spec/list` | — | ⚠️ Internal（需参数） |

## 汇总与状态

| 方法 | 端点 | 说明 | 实测 |
|---|---|---|---|
| GET | `/bc/v1/resource/summary` | 资源池状态计数 `{summary:{runningNum,unNormalNum,sleepNum,...}}` | ✅ ok |
| GET | `/bc/v1/resource/pool/list` | 专属资源池列表（管理员视角全量） | ✅ ok |
| GET | `/bc/v1/resource/pool/list/weight` | 池权重列表 | ✅ ok |
| GET | `/bc/v1/resource/pool/detail` | 池详情（resourceId） | ✅ InvalidArgument |
| GET | `/bc/v1/resource/pool/init/info` | 开池日志 | ✅ InvalidArgument |
| POST | `/bc/v1/resource/pool/update` / `create` / `delete` / `delete/batch` / `edit` | 池管理 | 🔐 / ✅ InvalidArgument |
| GET | `/bc/v1/resource/pool/oneclick`（v1/v2 同） | 一键开池向导 | ✅ ok |
| GET | `/bc/v2/resource/pool/task/list` | 一键开池任务流 | ✅ ok |
| POST | `/bc/v1/resource/pool/az/init` | 可用区初始化 | v1 🔐 无可用区权限；v2 ⚠️ 已初始化（FailedPrecondition） |
| GET | `/bc/v1/resource/pool/az/init/list`（v1/v2） | 初始化进度 | ✅ ok |
| GET | `/bc/v1/resource/welfare` | 免费试用资源：`{freeInfo:[{welfareType:"freeTrial", specId, startTime, expireTime, isUsed}], isTrial}` | ✅ ok |
| GET | `/bc/v1/resource/billing/access` | 计费开关 | ✅ ok |
| GET | `/bc/v1/resource/research/storage/inquiry` | 科研存储询价 | ✅ ok |
| GET | `/bc/v1/resource/eip/inquiry` | EIP 询价（CycleType 参数） | ⚠️ Unknown（参数不合法） |
| GET | `/bc/v1/resource/storage/spec/list`（v1/v2） | 存储规格 | ⚠️ NotFound（需有效 resourceId） |
| POST | `/bc/v1/resource/refund/package` | 退订套餐 | ⚠️ Internal |
| POST | `/bc/v1/resource/submit/package` / `trialPackage` | 提交套餐单 | 🔐 Unauthenticated（运营授权） |
| POST | `/bc/v1/resource/submit/nonOrder/open` / `trial_order` | 开通类 | 🔐 仅主账号 |

## 队列管理（管理员域）

| 方法 | 端点 | 实测 |
|---|---|---|
| POST | `/bc/v1/queue/create` / `update` / `delete` / `delete/batch` | 🔐 PermissionDenied |
| GET | `/bc/v1/queue/get` | ✅ InvalidArgument（queueId） |

## 专属资源池 exclusivePool（管理员域，14 端点）

`describeMultiExclusivePools` 空参即 ✅ ok（列表可读）；其余（create/delete/配额分配/订单 purchase/renew/refund）全部 🔐 PermissionDenied：

`/bc/v1/createExclusivePool`、`/bc/v1/exclusivePool/{createProjectDeserveQuota, deleteExclusivePool, describeExclusivePoolDetail, describeExclusivePoolUsage, describeProjectDeserveQuota, getExclusivePoolQuota, listOrderItems, listProjectDeserveQuota, purchaseOrderItem, refundOrderItem, renewOrderItem, updateProjectDeserveQuota}`、`describeExclusivePoolWorkload`（✅ InvalidArgument，uuid）。

## 调度策略 scheduling

| 方法 | 端点 | 实测 |
|---|---|---|
| GET | `/bc/v1/scheduling/list` | ✅ ok → `{schedule:[], paging:null}` |
| GET | `/bc/v1/scheduling/plugin/list` | ✅ ok |
| GET | `/bc/v1/scheduling/action/list` | ✅ ok |
| GET | `/bc/v1/scheduling/get` | ✅ InvalidArgument（id） |
| POST | `/bc/v1/scheduling/create` / `update` / `delete` | ✅ InvalidArgument（路由存在，普通用户实际可用性取决于策略归属） |
