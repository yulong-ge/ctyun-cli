# 控制台逆向 API 文档（reverse）

> **对象**：`https://esx.ctyun.cn`（息壤·科研助手，控制台 SPA 路径前缀 `/bc/`）
> **来源**：全部端点从控制台 SPA 的 **153 个 JS chunk 静态提取**，并于 **2026-08-17 逐个实测探测**（369 条探测记录）。
> **口径**：本文档独立于 ctyun-cli 现有代码，是对控制台 API 面的完整快照。
> **官方 API 对照**：见[上级 README](../README.md#官方-api-与逆向-api对照与选型建议)。

## 文档导航

| 文档 | 内容 | 端点数 |
|---|---|---|
| [authentication.md](authentication.md) | 认证与会话（账号密码直登、3DES、SSO、Bearer、有效期） | 9 |
| [ide.md](ide.md) | 开发机全生命周期 + Jupyter 通道 | 55 |
| [resource.md](resource.md) | 资源池 / 队列 / 规格 / 专属池 / 调度策略 | 68 |
| [job.md](job.md) | 训练作业（创建/停止/模板/Pod/指标） | 24 |
| [storage.md](storage.md) | 存储（科研文件存储 / PVC / 存储源 / 数据迁移） | 39 |
| [image.md](image.md) | 镜像（公共框架/私有/分享/保存） | 21 |
| [inference.md](inference.md) | 推理服务 / 模型仓库 / 模型版本 | 20 |
| [project.md](project.md) | 企业项目 / 项目空间 / 成员 / 账单 | 32 |
| [monitor.md](monitor.md) | 监控指标（快照 + 时间序列） | 4 |
| [network.md](network.md) | 网络（EIP / ECR Secret / 白名单 IP） | 15 |
| [platform.md](platform.md) | 平台基础（区域/运营代理/配置/集群/CRS/活动/套餐/AI 助手等） | 82 |
| [endpoint-index.md](endpoint-index.md) | **全量 369 端点速查表**（一键检索） | 369 |
| [data/](data/) | 机器可读原始数据（endpoints / probe-results / samples，样本已脱敏） | — |

## API 面（Origin 与版本）

| Origin | 前缀 | 用途 |
|---|---|---|
| `https://esx.ctyun.cn` | `/bc/v1/*` | 控制台主 API（291 端点）。**核心生命周期均走 v1** |
| `https://esx.ctyun.cn` | `/bc/v2/*` | 新版 API（74 端点）。同路径常与 v1 并存；**开发机生命周期/镜像/PVC 在 v2 对普通账号 PermissionDenied**，但 storage/research、resource 枚举、userFavor、ide summary 等在 v2 可用 |
| `https://esx.ctyun.cn` | `/v1/auth/login` | SSO 会话交换（302 → 种控制台 cookie） |
| `https://www.ctyun.cn` | `/gw/auth/*`, `/gw/v1/portal/*` | 门户认证与菜单（信封为 `core.ok` 风格，与控制台不同） |

## 响应信封（控制台 `/bc/vN/*` 统一）

```json
{
  "requestId": "204bfffafb3cf075d92aa2943632d5bf",
  "status": { "code": "ok", "message": "操作成功" },
  ...业务字段（平铺在顶层）
}
```

- **成功**：`status.code === "ok"`。业务数据不嵌套在 `data` 里，直接平铺在响应顶层（如 `ides`、`queues`、`specs`、`jobs`）。
- **失败**：`status.code` 为 gRPC 风格码。实测出现过的全集：

| code | 含义 | 出现场景（实测计数） |
|---|---|---|
| `ok` | 成功 | 96（含空参即成功） |
| `InvalidArgument` | 参数校验失败（**路由存在**，传对参数即可用） | 125 |
| `PermissionDenied` | 无权限（多为管理员功能） | 72 |
| `NotFound` | 资源不存在 / 功能未开通（路由多存在） | 26 |
| `Internal` | 服务端内部错误（多为缺参导致，路由存在） | 21 |
| `Unauthenticated` | 需额外授权（子账号限制/运营审批） | 6 |
| `Unknown` | 服务端语义错误（记录不存在等） | 4 |
| `FailedPrecondition` / `ResourceExhausted` | 前置条件/配额不满足 | 1 / 2 |
| `100002` / `clnt.e2000` | bcProxy 网关 / 门户网关 的参数或会话错误 | 3 |

- 门户 `/gw/*` 信封不同：`{"code": "core.ok", "reason": "服务调用成功", "data": {...}}`。

## 通用约定

- **分页**：GET 查询参数 `paging.page`（从 1 起）+ `paging.perPage`；响应含 `paging: {page, perPage, totalPage, totalRecord}`。
- **鉴权**：`Authorization: Bearer <accessToken>` + 控制台 Cookie（两者都要带，详见 [authentication.md](authentication.md)）。
- **去缓存**：SPA 对 GET 请求追加 `?_<timestamp>`（服务端不要求）。
- **幂等性**：`batchLaunch` / `batchStop` 空列表提交返回 ok（无副作用），重复提交由状态机拦截。
- **路径参数**：仅 DELETE 使用（`/ide/delete/{id}`、`/infer_service/delete/{id}`、`/model/delete/{id}`、`/model_repo/delete/{id}`）；其余全部为查询参数或 JSON body。

## 探测方法与结果口径

1. **提取**：下载 SPA 入口 + 全部 153 个 chunk（18MB），解析 `HttpRequest` 实例的 `baseURL`（`http$1→/bc/v1`，`http/httpV2*→/bc/v2`）后，静态抽取全部 `VAR.get/post/put/delete("path")` 调用及其服务函数名、params 键、body 键。
2. **探测**：对每个端点发起最小请求——GET 不带参数；POST 发空 JSON `{}`；DELETE 用不存在 ID `99999999`。记录 HTTP 码、`status.code`、`status.message`、响应顶层键。
3. **空 body POST 不会造成副作用**：服务端第一道参数校验直接拒绝（如 `invalid field Id: ...值需要大于0`），这正是"路由存在"的判定依据。
4. **深度抓取**：对 96 个空参即成功的端点，用真实参数（项目/区域/队列/规格链）二次调用，保存完整响应样本（`data/samples.json`，72 组，敏感字段已脱敏）。

### 探测统计（按域）

| 域 | 端点数 | 空参可用 | 路由存在(缺参被拒) | 无权限 | 其他 |
|---|---|---|---|---|---|
| 开发机 ide | 55 | 10 | 27 | 17 | 1 |
| 资源池/队列/规格 | 68 | 15 | 17 | 27 | 9 |
| 存储 | 39 | 7 | 19 | 11 | 2 |
| 项目空间 | 32 | 5 | 14 | 11 | 2 |
| 训练作业 job | 24 | 5 | 13 | 4 | 2 |
| 镜像 | 21 | 6 | 9 | 6 | 0 |
| 推理/模型仓库 | 20 | 4 | 13 | 0 | 3 |
| 活动运营 bs | 20 | 3 | 2 | 1 | 14 |
| 容器集群 ecx/eck/crs | 18 | 6 | 4 | 0 | 8 |
| 平台基础 bc/bcProxy | 17 | 9 | 6 | 0 | 2 |
| 网络 eip/secret | 15 | 3 | 6 | 4 | 2 |
| AI 助手 agent | 7 | 0 | 0 | 0 | 7 |
| 账号/权限/配置 | 8 | 6 | 0 | 0 | 2 |
| 套餐 packages | 6 | 3 | 3 | 0 | 0 |
| 监控 monitor | 4 | 0 | 4 | 0 | 0 |
| 门户 portal | 4 | 1 | 0 | 0 | 3 |
| 其他 misc | 11 | 2 | 5 | 3 | 1 |
| **合计** | **369** | **95** | **139** | **84** | **53** |

> 注：agent 域 7 个端点 HTTP 200 但 AI 后端服务对当前账号返回 `Internal`（科研智能体服务错误），路由确实存在。
> `Internal` 大量出现在 bs/activity 域（运营功能，空参触发 Go 后端 nil 崩溃）——同样证明路由存在。

## 已知 SPA 层面的坑（实测确认）

1. **v1/v2 并存**：同一逻辑路径两版都有时，普通账号必须选对版本。实测规律：开发机生命周期、镜像、PVC 走 **v1**；科研文件存储、资源枚举（GPU 型号/规格列表）、用户收藏走 **v2** 也可用。
2. `/bc/v1/project/list` 与 `/bc/v1/v1/ops/tenant/region/list` 在 SPA 中被引用但返回 NotFound（前端遗留/笔误），**正确路径**分别是 `/bc/v1/bc/project/list` 与 `/bc/v1/storage/region/list`（或带 `queryType`）。
3. nginx 对无 `/v1` 的路径 POST 返回 **405**（不是 404）。
4. 开发机的 Jupyter `token`（`/ide/get` 返回）不能直接用，必须先 GET `openLink` 根路径（**带尾斜杠**）激活 302 种下 cookie，详见 [ide.md](ide.md#jupyter-通道免-ssh-执行代码)。
5. 会话约 1 小时过期；无 refresh 端点，401 后重新登录（见 [authentication.md](authentication.md)）。
