# 平台基础与扩展域

汇集：平台运营代理（bcProxy）、区域/配置、容器集群（ECX/ECK/CRS）、AI 科研助手（agent）、套餐（packages）、活动运营（bs）、闲置策略（idleRule）及杂项。信封与鉴权同总览。

## 平台基础（bc / bcProxy / config / util）

| 方法 | 端点 | SPA 函数 | 实测 | 说明 |
|---|---|---|---|---|
| GET | `/bc/v1/bc/ops/region/list` | getRegionOptions | ✅ ok | **可用区列表**（资源发现链第 2 步，query: `paging.*, poolType`） |
| GET | `/bc/v2/bc/ops/region/list` | getRegionOptions | ✅ ok | v2 同构 |
| POST | `/bc/v2/bc/ops/region/filter` | getRegionListNew | ✅ InvalidArgument | `specType` 筛选 |
| POST | `/bc/v1/bc/project/list` | getProjectList | ✅ ok | 企业项目（见 project.md） |
| POST | `/bc/v1/bc/ops/advert/list` | getAdvertList | ✅ ok | 控制台广告位 |
| POST | `/bc/v1/bc/ops/claimCustomer` | claimCustomer | ✅ InvalidArgument | 客户认领 |
| POST | `/bc/v1/bc/ops/getGrayFeature` | getGrayFeature | ✅ InvalidArgument | 灰度开关 |
| POST | `/bc/v1/bcProxy/ops/region/user/list` | getRegionList | ✅ ok | 用户可见区域 |
| POST | `/bc/v1/bcProxy/ops/productSpec/availableList` | getSpecAvailableList | ✅ ok | 可购规格 |
| POST | `/bc/v1/bcProxy/ops/jobTemplate/list` | getTaskTemplateList | ✅ ok | 任务模板 |
| POST | `/bc/v1/bcProxy/ops/displayItem/list` | getImageWallAttr | ✅ ok | 展示位 |
| POST | `/bc/v1/bcProxy/ops/imagewall/list` | getImageWallList | ✅ ok | 镜像墙 |
| POST | `/bc/v1/bcProxy/ops/imagewall/detail` | getImageDetail | ⚠️ 100002 | `field id is not set` |
| GET | `/bc/v1/bcProxy/ops/eventlog/list` | getOperationLogs | ✅ ok | 操作审计日志 |
| POST | `/bc/v1/bcProxy/ops/dict/list` | getDictList | ⚠️ 100002 | `dictTypeCodeList` 类型不匹配（需字符串数组） |
| POST | `/bc/v1/bcProxy/ops/dataset/typeList` | getDatasetTypeList | ✅ ok | 数据集类型 |
| POST | `/bc/v1/config/frontend` | getFrontendConfig | ✅ ok | 前端运行时配置（见下） |
| GET | `/bc/v1/util/baidu/accessToken` | getAccessToken | ⚠️ Internal | 百度地图 token 代理（后端到百度失败） |
| POST | `/bc/v1/user/listCreator` | getCreatorInfoList | ✅ InvalidArgument | 创建者列表（非空字符串参数） |

`/bc/v1/config/frontend` 响应（实测）：

```json
{ "config": { "ctiamConf": {
    "ctiamHostPort": "https://iam.ctyun.cn",
    "createProjectUri": "https://iam.ctyun.cn/enterpriseManagement" } } }
```

## 容器集群（ECX / ECK / CRS）

| 方法 | 端点 | 实测 | 说明 |
|---|---|---|---|
| GET | `/bc/v1/ecx/clusterList` | ✅ ok | ECX 弹性集群列表 |
| GET | `/bc/v1/ecx/{specList, imageList, diskList, vpcList, checkSnatExist}` | — | ECX 查询（模板字符串 query，如 `/ecx/specList?${qs}`） |
| GET | `/bc/v1/eck/k8sCluster/{list, get, getK8s, listRegions}` | ⚠️ NotFound | ECK 集群功能未开通（路由在） |
| POST | `/bc/v1/crs/cluster/page` | ✅ ok | CRS 镜像分发集群分页 |
| POST | `/bc/v1/crs/project/page` | ✅ ok | CRS 项目分页 |
| POST | `/bc/v1/crs/imagetag/page` | ✅ ok | CRS 镜像 tag 分页 |
| POST | `/bc/v1/crs/project/usage` | ✅ ok | CRS 用量 |
| POST | `/bc/v1/crs/check/login` | ✅ ok | CRS 登录态检查 |
| POST | `/bc/v1/crs/image/page` | ⚠️ Internal | 需先登录镜像分发服务 |
| POST | `/bc/v1/crs/register/user` | ⚠️ Internal | 同上 |
| GET | `/bc/v1/cluster/shared_quota` / `getTenantQuotaInfo` / `storage_quota` / `resource/logs` | ✅/⚠️ | 见 storage.md / misc |

## AI 科研助手（agent，信封不同）

> 注意：本域响应为 **SSE/非标准信封**（`requestId, status, contents`），且当前账号实测 AI 后端 `Internal: 科研智能体服务错误`——路由存在，服务不可用。

| 方法 | 端点 | SPA 函数 | 实测 |
|---|---|---|---|
| POST | `/bc/v1/agent/education/chat` | fetchSSE 直调 | ⏭️ 未探测（SSE 长连接）。body：`{query, agentType:"BCOVERVIEWPAGE_QA", contextId, conversationId, preMessageId, presetId, searchByNet, files[]}` |
| POST | `/bc/v1/agent/chat` | sendMessage | ⚠️ http 500 |
| GET | `/bc/v1/agent/conversation/list` / `detail` / `delete` | 会话管理 | ⚠️ http 200 + Internal 业务体 |
| POST | `/bc/v1/agent/conversation/stop` / `top` / `updateTitle` | 会话操作 | ⚠️ 同上 |

## 套餐 packages

| 方法 | 端点 | 实测 | 说明 |
|---|---|---|---|
| GET | `/bc/v1/packages/purchased/list` | ✅ ok | 已购套餐 |
| GET | `/bc/v1/packages/purchasable/list` | ✅ ok | 可购套餐 |
| POST | `/bc/v1/packages/billing/list` | ✅ ok | 计费明细 |
| POST | `/bc/v1/packages/billing/download` | ⚠️ NotFound | 账单导出 |
| POST | `/bc/v1/packages/purchased/delete` / `updateAlias` | ✅ InvalidArgument | id |

## 活动运营 bs/activity

教学/竞赛活动资源批量发放域。`listActivities`/`listActivityUsers`/`bindUsers`/`removeUsers` 空参 ✅ ok；**其余 13 个端点空参全部 Internal（Go nil 崩溃）**——路由存在但需要有效活动上下文：`createActivity, createBatchResources, describeActivityDetail(🔐 非活动成员), describeTemplateDetail, listResources(activity uuid), listTemplates, publishTemplate, queryFailedTaskDetail, queryOperationLogs, removeActivity, removeLog, removeTemplate, retryFailedTask, updateActivity, updateTemplate, describeMultiChildAccount(NotFound)`。

## 闲置策略 idleRule（/bc/v2/idleRule/*）

| 方法 | 端点 | 实测 | 说明 |
|---|---|---|---|
| GET | `/bc/v2/idleRule/get` | ✅ InvalidArgument | `projectId` 查询闲置规则 |
| POST | `/bc/v2/idleRule/policy/list` | ✅ InvalidArgument | `ruleId` 排除策略列表 |
| POST | `/bc/v2/idleRule/on` / `off` / `save` / `policy/save` | 🔐 PermissionDenied | 管理员 |

## 用户收藏 userFavor（/bc/v2/userFavor/*）

| 方法 | 端点 | 实测 |
|---|---|---|
| GET | `/bc/v2/userFavor/get` | ✅ ok |
| POST | `/bc/v2/userFavor/set` | ✅ ok（空 body 无操作语义） |

## 杂项（SPA 引用但异常的路径）

| 端点 | 实测 | 结论 |
|---|---|---|
| POST `/bc/v1/project/list` | NotFound | **前端遗留**，正确为 `/bc/v1/bc/project/list` |
| GET `/bc/v1/v1/ops/tenant/region/list` | NotFound | **前端 double-v1 笔误**，正确为 `/bc/v1/storage/region/list` |
| GET `/bc/v1/k8s/{cluster}/...` | SKIP | K8s 直通（见 job.md） |
