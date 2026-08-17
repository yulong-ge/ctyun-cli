# 认证与会话

科研助手控制台没有独立的开放 API 认证，**完全复用天翼云门户的账号密码登录 + SSO 会话交换**。CLI 直登（无浏览器）流程如下，全部步骤经 2026-08-17 实测。

## 登录链路（4 步）

### 1. 拉取登录页（获取风控 Cookie）

```http
GET https://www.ctyun.cn/h5/auth/login?rd=%2Fbc%2Fdevelop-env-create
```

跟随重定向，落地后的 Cookie jar 中会有门户风控 Cookie。`rd` 参数任意 `/bc/...` 路径即可。

### 2. 门户登录（3DES-ECB 加密密码）

```http
POST https://www.ctyun.cn/gw/auth/Login
Content-Type: application/x-www-form-urlencoded
Origin: https://www.ctyun.cn
Referer: https://www.ctyun.cn/h5/auth/login?rd=%2Fbc%2Fdevelop-env-create

newMode=true&id=<账号>&loginType=password&other=<encodeURIComponent(账号)>&password=<加密后>&loginFree=false
```

**密码加密**（与网页前端一致）：

```
key  = encodeURIComponent(username).slice(0, 24).padEnd(24, "0")   // UTF-8 字节
pass = Base64( 3DES-ECB(key, password) )
```

- `other` 字段要 **双重编码**（表单体里再放一次 URL-encoded 用户名）——这是网页前端的原始行为，邮箱账号实测通过，"修复"它反而登录失败。
- 成功响应（门户信封）：

```json
{
  "code": "core.ok",
  "reason": "...",
  "data": { "property": { "accessToken": "e461a2f9-…", ... } }
}
```

`data.property.accessToken` 即后续业务 API 的 Bearer token（UUID 形态，形如 `xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx`）。

### 3. 控制台 SSO 交换（种 Cookie）

```http
GET https://esx.ctyun.cn/v1/auth/login?rd=%2Fbc%2Fdevelop-env-create
```

带门户 Cookie 跟随 302，落地后 Cookie jar 中得到控制台会话 Cookie（实测 3 个）。**HTTP 200 不代表成功**——失败时也可能回 HTML，必须做一次业务 API 验证。

### 4. 业务验证（防 cookie-less 风控假成功）

```http
GET https://esx.ctyun.cn/bc/v1/ide/list?paging.page=1&paging.perPage=1
Authorization: Bearer <accessToken>
Cookie: <控制台 cookie>
```

`status.code === "ok"` 才算会话真正可用。部分出口 IP 会被风控为 cookie-less 登录（SSO 200 但业务 API 拒绝），此时只能回退浏览器导入会话。

## 业务请求规范

之后所有 `/bc/vN/*` 请求同时携带：

| 头 | 值 |
|---|---|
| `Authorization` | `Bearer <accessToken>`（第 2 步获得） |
| `Cookie` | 控制台 Cookie（第 3 步获得，服务端会轮换更新，需要回写 jar） |
| `Content-Type` | `application/json`（POST body 为 JSON） |

两者缺一不可：只带 Bearer 或只带 Cookie 都会被拒。

## 会话生命周期

- **有效期约 1 小时**（实测中途莫名 401 即过期）。
- **无 refresh/续期端点**——SPA 内部对 401 的处理是跳转 `loginUrl` 重新走 SSO；CLI 的做法是重新执行上述 4 步。
- Cookie 由服务端轮换更新（响应 Set-Cookie），**每次请求后回写 cookie jar** 可小幅延长会话。
- 直连（绕过系统 proxy）是硬要求：`http_proxy` 环境变量会导致登录被风控/连接失败。

## 身份与门户辅助端点

| 方法 | 端点 | 说明 | 实测 |
|---|---|---|---|
| GET | `https://www.ctyun.cn/gw/auth/Current` | 当前登录身份（登录 ID、城市、认证等级等，门户信封 `core.ok`） | ✅ ok |
| GET | `https://www.ctyun.cn/gw/v1/portal/menu/GetTree?productId=18391` | 门户菜单树（需门户完整会话，控制台 cookie 不足 → `clnt.e2000`） | ⚠️ 需门户会话 |
| GET | `https://esx.ctyun.cn/v1/auth/login?rd=...` | SSO 交换（见上，302） | ✅ 302 |
| GET | `https://esx.ctyun.cn/xrops/auth-srv/tenant/v1/webResource/listAuthorized` | SPA 引用的授权资源列表（当前返回 404，疑似未部署） | ❌ 404 |

`/gw/auth/Current` 响应（节选，敏感字段已脱敏）：

```json
{
  "code": "core.ok", "reason": "服务调用成功",
  "data": { "pwdState": "10001", "property": {
    "consumptionLevel": "V7", "loginId": "23862407", "city": "8110100",
    "defaultzoneid": "200000003795", "channel": "1", ... } }
}
```

## 控制台内身份/权限端点

| 方法 | 端点 | 说明 | 实测 |
|---|---|---|---|
| POST | `/bc/v1/account/type` | 账号类型：`{accountType: "child"|"main", originChannel, isAdminGroup, auditStatus}` | ✅ ok |
| GET | `/bc/v1/permission/user/policy` | 当前用户策略码列表（`bc:ide:xxx` 形式），判断功能开关的最权威依据 | ✅ ok |
| POST | `/bc/v1/permission/business` | 业务权限矩阵 | ✅ ok |
| POST | `/bc/v1/serviceAuthorization/verify` | 服务授权校验 | ⚠️ InvalidArgument（需 ctyunUserId+AuthorizeService 参数） |
| POST | `/bc/v1/serviceAuthorization/create` | 创建服务授权 | ⚠️ 同上 |

`accountType === "child"`（子账号）直接解释了大量 PermissionDenied 端点——开通类/管理类操作要求主账号。
