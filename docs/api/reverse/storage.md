# 存储域 — 39 个端点

四类存储面：**科研文件存储**（research，v2 可用）、**PVC 数据卷**（v1 可用）、**存储源**（storage/resource）、**数据迁移**（DataSync，v2）。存储网络（network）与公共数据集（public/dataset）归入本域。

## 科研文件存储（/bc/v2/storage/research/*）

挂载到开发机的共享文件存储（OceanDisk），按「存储 → 空间（space）」两级组织。

| 方法 | 端点 | 实测 | 说明 |
|---|---|---|---|
| GET | `/bc/v2/storage/research/list` | ✅ ok | query: `resourceId, regionNameEng, projectId, paging.*` → `storageResearches[]` |
| GET | `/bc/v2/storage/research/space/list` | ✅ ok（带参）/⚠️ Unknown（空参） | query: `storageId, projectId, resourceId, regionNameEng, paging.*` → `storageSpaces[]` |
| GET | `/bc/v2/storage/research/describe` | ✅ InvalidArgument | `storageId` 详情 |
| GET | `/bc/v2/storage/research/summary` | ✅ InvalidArgument | `regionId` |
| GET | `/bc/v2/storage/research/spec/list` | ⚠️ NotFound | 存储规格（需有效池） |
| POST | `/bc/v2/storage/research/create` / `delete` / `resize` / `releaseStorageBinding` | 🔐 PermissionDenied | 管理操作 |
| POST | `/bc/v2/storage/research/renew` | ✅ InvalidArgument | 续费（storageId） |
| POST | `/bc/v2/storage/research/upgradeFSServer` | ✅ InvalidArgument | 升级 FS |
| POST | `/bc/v2/storage/research/describeBindingResource` | ✅ InvalidArgument | 绑定的资源列表（researchStorageId） |
| POST | `/bc/v2/storage/research/space/create` | ⚠️ Unknown | record not found（需有效 storageId） |
| POST | `/bc/v2/storage/research/space/edit` / `delete` | ✅ InvalidArgument | spaceId |

`storageResearches[]` 元素（实测样本）：`{id, storageName, state: "Created", urlReady, ...}` — 挂载前提是 `state === "Created" && urlReady`。
`storageSpaces[]` 元素：`{spaceId, spaceName, readOnly, ...}` — 挂载要求 `readOnly === false`。

开发机关联（`/ide/get` 的 `researchStorageInfo[]`）：`{storageId, spaceId, spaceFolder, spaceName, mountPath, readOnly, type: "OceanDisk"}`。

## PVC 数据卷（v1 可用，v2 无权限）

| 方法 | 端点 | 实测 | 说明 |
|---|---|---|---|
| GET | `/bc/v1/storage/pvc/list` | ✅ InvalidArgument | query: `resourceId` + `queueId` **必须同时给**（否则报错）→ `storagePvcs[]` |
| POST | `/bc/v1/storage/pvc/create` | ✅ InvalidArgument | `resourceId` 必填 |
| GET | `/bc/v1/storage/pvc/delete` | ✅ InvalidArgument | `storagePvcId` |
| POST | `/bc/v1/storage/pvc/resize` | ✅ InvalidArgument | `pvcId` |
| POST | `/bc/v1/storage/sfs/precheck` | ✅ InvalidArgument | SFS 预检 |
| （v2 同路径） | `pvc/create` / `delete` / `list` | 🔐 PermissionDenied | 走 v1 |

## 存储源（storage/resource）

| 方法 | 端点 | 实测 | 说明 |
|---|---|---|---|
| GET | `/bc/v1/storage/resource/list` | ✅ ok | 存储源列表 |
| GET | `/bc/v1/storage/resource/get` | ✅ InvalidArgument | `storageId` |
| POST | `/bc/v1/storage/resource/create` | ✅ InvalidArgument | `resourceId` |
| POST | `/bc/v1/storage/resource/resize` | ✅ InvalidArgument | `storageId`（timeout 30s 长操作） |
| GET | `/bc/v1/storage/resource/delete` | ✅ InvalidArgument | `storageResourceId` |

## 存储网络与区域

| 方法 | 端点 | 实测 | 说明 |
|---|---|---|---|
| GET | `/bc/v1/storage/network/list` | ✅ ok | 存储网络列表 |
| POST | `/bc/v1/storage/network/create` | ✅ InvalidArgument | |
| GET | `/bc/v1/storage/region/list` | ✅ InvalidArgument | `queryType` 必填（>0）— 集群区域 |

## 公共数据集

| 方法 | 端点 | 实测 | 说明 |
|---|---|---|---|
| POST | `/bc/v1/storage/public/dataset/list` | ✅ ok | 公共数据集目录 |
| POST | `/bc/v1/bcProxy/ops/dataset/typeList` | ✅ ok | 数据集类型（运营代理） |

## 数据迁移 DataSync（/bc/v2/storage/*DataSync*）

| 方法 | 端点 | 实测 | 说明 |
|---|---|---|---|
| POST | `/bc/v2/storage/getDataSyncConfig` | ✅ ok | 迁移配置/配额 |
| POST | `/bc/v2/storage/listLocalStorage` | ✅ ok | 可迁移本地盘列表 |
| POST | `/bc/v2/storage/createDataSyncTask` | ✅ InvalidArgument | 名称规则校验 |
| POST | `/bc/v2/storage/describeDataSyncTask` | ✅ InvalidArgument | `taskId` |
| POST | `/bc/v2/storage/listDataSyncTasks` | 🔐 PermissionDenied | 项目权限 |
| POST | `/bc/v2/storage/stopDataSyncTask` / `deleteDataSyncTask` | ✅ InvalidArgument | `taskId` |

## 集群存储配额

| 方法 | 端点 | 实测 | 说明 |
|---|---|---|---|
| GET | `/bc/v1/cluster/storage_quota`（v1/v2 同） | ⚠️ ResourceExhausted | `可用存储配额不足`（功能真实存在，配额受限） |
| POST | `/bc/v1/cluster/getTenantQuotaInfo` | ✅ ok | `{totalQuota:{additionalExternalServicePort:"0"}, ext:[]}` |
| GET | `/bc/v1/cluster/shared_quota` | ✅ ok | 共享集群区域 |
