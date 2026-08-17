# 推理服务 / 模型仓库域 — 20 个端点

三个子域：**infer_service**（推理服务部署）、**model_repo**（模型仓库）、**model**（模型版本，挂在仓库下）。全部走 `/bc/v1`。

## 推理服务 infer_service

| 方法 | 端点 | SPA 服务函数 | 实测 | 说明 |
|---|---|---|---|---|
| GET | `/bc/v1/infer_service/list` | getInferList | ✅ ok | 服务列表（paging） |
| GET | `/bc/v1/infer_service/summary` | summaryInfer | ✅ ok | 状态计数 |
| GET | `/bc/v1/infer_service/framework/list` | getInferFrames | ✅ ok | 推理框架枚举 |
| GET | `/bc/v1/infer_service/detail` | getInferDetail | ⚠️ NotFound | 需真实 id（未找到 inferService 资源） |
| POST | `/bc/v1/infer_service/create` | createInfer | ✅ InvalidArgument | `invalid field Name` |
| POST | `/bc/v1/infer_service/launch` | startInfer | ✅ InvalidArgument | id |
| POST | `/bc/v1/infer_service/stop` | stopInfer | ✅ InvalidArgument | id |
| GET | `/bc/v1/infer_service/secret` | getInferSecret | ✅ InvalidArgument | id（服务调用凭据，对应权限码 `bc:infer:inferServiceSecret`） |
| DELETE | `/bc/v1/infer_service/delete/{id}` | deleteInfer | ⚠️ NotFound | 路径参数；假 id 报资源不存在 |
| POST | `/bc/v1/infer_service/cert/sync` | syncCert | ✅ InvalidArgument | user_key（服务私钥同步） |

## 模型仓库 model_repo

| 方法 | 端点 | 实测 | 说明 |
|---|---|---|---|
| GET | `/bc/v1/model_repo/list` | ✅ ok | 仓库列表（paging） |
| GET | `/bc/v1/model_repo/framework/list` | ✅ ok | 模型框架枚举 |
| GET | `/bc/v1/model_repo/detail` | ⚠️ NotFound | 需真实 id |
| POST | `/bc/v1/model_repo/create` | ✅ InvalidArgument | `invalid field Name` |
| DELETE | `/bc/v1/model_repo/delete/{id}` | ⚠️ NotFound | 路径参数 |

## 模型版本 model（挂在仓库下）

| 方法 | 端点 | 实测 | 说明 |
|---|---|---|---|
| GET | `/bc/v1/model/list` | ✅ InvalidArgument | query 必填 `modelRepoId` |
| POST | `/bc/v1/model/create` | ✅ InvalidArgument | `invalid field Version` |
| POST | `/bc/v1/model/checkModelUpload` | ✅ InvalidArgument | id（上传前检查） |
| POST | `/bc/v1/model/finishModelUpload` | ✅ InvalidArgument | id（上传完成确认） |
| DELETE | `/bc/v1/model/delete/{id}` | ⚠️ NotFound | 路径参数 |

## 版本上传时序（SPA 语义）

`create`（建版本记录）→ `checkModelUpload`（申请上传）→（对象存储上传，SPA 走预签名 URL）→ `finishModelUpload`（确认）。
