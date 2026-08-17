# 企业项目 / 项目空间域 — 32 个端点

两层概念：**企业项目**（IAM 侧，`/bc/v1/bc/project/list`，只读枚举）与**项目空间**（科研助手侧的成员/配额/账单管理，`/bc/v1/project_space/*`，多数管理操作需管理员）。

## 企业项目（只读）

| 方法 | 端点 | 实测 | 说明 |
|---|---|---|---|
| POST | `/bc/v1/bc/project/list` | ✅ ok | body `{action_name: ["bc:job:create"]}` → `projects[{projectId, projectName, status}]` |

## 项目空间 project_space

| 方法 | 端点 | SPA 函数 | 实测 | 说明 |
|---|---|---|---|---|
| GET | `/bc/v1/project_space/list` | getProjectSpacelist | ✅ ok | 空间列表 |
| GET | `/bc/v1/project_space/list_un_sync_project` | checkProjectSpaceSync | ✅ ok | 未同步项目 |
| GET | `/bc/v1/project_space/get` | getProjectSpace | ✅ InvalidArgument | `spaceId` |
| GET | `/bc/v1/project_space/getConfig` | getConfig | ✅ InvalidArgument | `projectId` |
| POST | `/bc/v1/project_space/check_delegate` | checkDelegate | ✅ ok | 委派检查 |
| GET | `/bc/v1/project_space/users` | getUserList | ✅ ok | 用户列表 |
| GET | `/bc/v1/project_space/user_groups` | getUserGroups | ✅ ok | 用户组列表 |
| GET | `/bc/v1/project_space/group_users` | getGroupUsers | ✅ InvalidArgument | `groupID` 必填 |
| GET | `/bc/v1/project_space/get_all_users` / `project_users` | — | ✅ InvalidArgument | `projectId` |
| GET | `/bc/v1/project_space/list_project_group` | getProjectGroup | ✅ InvalidArgument | `projectId` |
| POST | `/bc/v1/project_space/GetUserExclusivePoolGpuSpecEnum` | getExclusivePoolGpuSpecEnum | ✅ ok | GPU 规格枚举（注意：路径含大写，实测可调） |
| POST | `/bc/v1/project_space/getUserExclusivePoolQuota` | — | ✅ InvalidArgument | `projectId` |
| POST | `/bc/v1/project_space/query_budget_trend_metrics` | getComsumeTrend | ✅ InvalidArgument | `projectId` 消费趋势 |
| POST | `/bc/v1/project_space/queryProjectUsageStatistics` / `queryUserUsageStatistics` | — | ✅ InvalidArgument | `startTime/endTime`（秒时间戳） |
| POST | `/bc/v1/project_space/list_user_bill_detail` | getUserBillList | ✅ InvalidArgument | `accountPeriod`（账期 YYYY-MM） |
| POST | `/bc/v1/project_space/export_user_bill_detail` | exportUserBillDetail | ✅ InvalidArgument | 仅支持 xlsx/csv |
| POST | `/bc/v1/project_space/download_user_bill_detail` | exportBilling | ⚠️ http 500 | 导出下载 |
| POST | `/bc/v1/project_space/create_delegate_role` | createDelegateRole | ⚠️ Internal | 依赖外部 CTIAM 服务 |
| POST | `/bc/v1/project_space/create` / `edit` / `delete` | — | 🔐 PermissionDenied | 空间管理 |
| POST | `/bc/v1/project_space/attach_user_to_group` / `remove_user_out_group` / `attach_project_to_group` / `remove_project_from_group` / `set_user_policy` / `setUserExclusivePoolQuota` / `ide/duration` / `list_project_bill_record` / `delete_project_bill_record` | — | 🔐 PermissionDenied | 成员/配额/账单管理 |

## 权限码参考

`GET /bc/v1/permission/user/policy` 返回当前用户全部策略码（实测含）：`bc:res:queueCheckShare`、`bc:storage:fileDownload`、`bc:ide:imageShare`、`bc:ide:imageShareRecord`、`bc:infer:inferServiceSecret`、`bc:infer:inferServiceCertificate`、`bc:projectSpace:projectSpaceUsers`、`bc:projectSpace:projectSpaceUserGroups` 等。判断某功能是否可用，以此列表为准（完整样本见 `data/samples.json → permission.user.policy`）。
