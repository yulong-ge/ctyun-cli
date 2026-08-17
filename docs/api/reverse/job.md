# 训练作业（Job）域 — 24 个端点

作业域分两套并存 API：**普通作业**（`/job/create`、`/job/list`…，Argo 风格）与 **TrainingJob**（`/job/createTrainingJob`、`/job/describeTrainingJobs`…）。TrainingJob 的 start/stop/delete/describe 单条对普通子账号 `Unauthenticated: 没有权限`，但列表/汇总可用。

## 端点总表

| 方法 | 端点 | SPA 服务函数 | 实测 | 说明 |
|---|---|---|---|---|
| GET | `/bc/v1/job/list` | getArgoList | ✅ ok | 作业列表（query: `projectId, paging.*`） |
| GET | `/bc/v1/job/detail` | getArgoDetail | ✅ InvalidArgument | `jobId` |
| POST | `/bc/v1/job/create` | createTask | ✅ InvalidArgument | `invalid field QueueId` |
| POST | `/bc/v1/job/edit` | editTask | ✅ InvalidArgument | `jobId` |
| POST | `/bc/v1/job/delete` | deleteTask | ✅ InvalidArgument | `jobId` |
| POST | `/bc/v1/job/delete/batch` | batchDeleteTask | ✅ InvalidArgument | `jobIds` 数组 |
| POST | `/bc/v1/job/manage` | manageTask | ✅ InvalidArgument | 启停控制（`jobId` + action） |
| GET | `/bc/v1/job/summary` | getJobSummaryInfo | ✅ ok | 状态计数 |
| POST | `/bc/v1/job/metric/pull` | getPrometheusMetric | ✅ ok | Prometheus 直查 |
| POST | `/bc/v1/job/resource/metric` | getMetric | ⚠️ NotFound | 需真实作业 id（training_job 资源） |
| POST | `/bc/v1/job/arguments` | getJobArguments | ⚠️ NotFound | 空参 Not Found；模板参数 |
| GET | `/bc/v1/job/pod/container/list` | getContainerList | ✅ InvalidArgument | `clusterId`（K8s 上下文） |
| GET | `/bc/v1/job/pod/event/list` | getEventsList | ✅ InvalidArgument | `clusterId` |
| POST | `/bc/v1/job/createTrainingJob` | createTrainingJob | ✅ InvalidArgument | `invalid field Name` |
| POST | `/bc/v1/job/updateTrainingJob` | updateTrainingJobAlias | ⚠️ Unknown | record not found（需真实 id） |
| POST | `/bc/v1/job/describeTrainingJobs` | getTrainingJobs | ✅ ok | TrainingJob 列表（body: `projectId, paging.*`） |
| POST | `/bc/v1/job/describeTrainingJob` | getTrainingDetail | 🔐 Unauthenticated | 单条详情无权限 |
| POST | `/bc/v1/job/startTrainingJob` / `stopTrainingJob` / `deleteTrainingJob` | — | 🔐 Unauthenticated | 无权限 |
| GET | `/bc/v1/job/template/list` | getJobTemplateList | ⚠️ Internal | 空参触发后端 nil（路由存在） |
| GET | `/bc/v1/job/template/detail` | getJobTemplateDetail | ✅ InvalidArgument | `templateId` |
| POST | `/bc/v1/job/template/create` | createJobTemplate | ✅ InvalidArgument | `templateName` |
| POST | `/bc/v1/job/template/delete` | deleteJobTemplate | ✅ InvalidArgument | `templateId` |
| POST | `/bc/v1/bcProxy/ops/jobTemplate/list` | getTaskTemplateList | ✅ ok | 运营侧任务模板 |

## GET /bc/v1/job/list

query：`projectId`、`paging.page`、`paging.perPage`。响应 `{jobs: [], paging}`（当前账号无作业时 jobs 空数组）。

## POST /bc/v1/job/create（普通作业）

必填校验顺序（空参实测）：`QueueId` → 其余字段。SPA 侧构建包含队列/规格/镜像/存储挂载，与开发机创建同构。

## Pod 级诊断

`/job/pod/container/list` 与 `/job/pod/event/list` 需要 `clusterId`（来自 `/bc/v1/bc/ops/region/list` 的 `clusterId` 字段）+ pod 坐标，用于作业容器日志与 K8s 事件排查。

另有 K8s API 直通端点（SPA 内引用，需要集群名与命名空间上下文，未做实测探测）：

- `GET /bc/v1/k8s/{cluster}/api/v1/namespaces/{ns}/events`
- `GET /bc/v1/k8s/{cluster}/apis/autoscaling/v2beta1/namespaces/{ns}/horizontalpodautoscalers/{name}`
