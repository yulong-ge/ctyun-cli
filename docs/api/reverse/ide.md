# 开发机（IDE）域 — 55 个端点

开发机是科研助手的计算主体（`ideType=2` 为标准开发机）。生命周期端点走 `/bc/v1`；`/bc/v2` 的同路径对普通子账号 PermissionDenied（除 summary/toRemove/delay）。

## 端点总表

> 实测口径：空参探测。✅ ok = 空参即成功；✅ InvalidArgument = 路由存在、缺必填参数；🔐 = 无权限；⚠️ = 存在但异常。

| 方法 | 端点 | SPA 服务函数 | 实测 | 服务端提示 |
|---|---|---|---|---|
| GET | `/bc/v1/ide/list` | getDevelopEnvList | ✅ ok | 列表 |
| GET | `/bc/v1/ide/get` | getDevelopEnvInfo | ✅ InvalidArgument | `invalid field Id` |
| POST | `/bc/v1/ide/create` | createDevelopEnv | ✅ InvalidArgument | `invalid field Name` |
| POST | `/bc/v1/ide/batch/create` | batchCreateDevelopEnv | ✅ InvalidArgument | `参数错误：instance number` |
| POST | `/bc/v1/ide/createTrial` | createTrialDevelopEnv | ✅ InvalidArgument | 试用版创建 |
| POST | `/bc/v1/ide/launch` | launchDevelopEnv | ✅ InvalidArgument | `invalid field Id` |
| POST | `/bc/v1/ide/batchLaunch` | batchLaunchDevelopEnv | ✅ ok（空列表无副作用） | 批量启动 |
| POST | `/bc/v1/ide/stop` | stopDevelopEnv | ✅ InvalidArgument | `invalid field Id` |
| POST | `/bc/v1/ide/batchStop` | batchStopDevelopEnv | ✅ ok（空列表无副作用） | 批量停止 |
| POST | `/bc/v2/ide/delay` | delayStop | ✅ InvalidArgument | 延迟自动停止 |
| DELETE | `/bc/v1/ide/delete/{id}` | deleteDevelopEnv | ✅ InvalidArgument | `未找到ide资源`（带真实 id 即可） |
| POST | `/bc/v1/ide/updateAlias` | updateIdeAlias | ✅ InvalidArgument | 别名 |
| POST | `/bc/v1/ide/updateSpecific` | updateSpecific | ✅ InvalidArgument | 变更规格 |
| POST | `/bc/v1/ide/updateImage` | updateImage | ✅ InvalidArgument | 换镜像 |
| POST | `/bc/v1/ide/updateVolume` | updateVolume | ✅ InvalidArgument | 存储扩容 |
| POST | `/bc/v1/ide/updateActiveTime` | updateActiveTime | ✅ InvalidArgument | 活跃时长 |
| POST | `/bc/v1/ide/updateVisibility` | updateVisibility | ✅ InvalidArgument | PERSONAL/ALL 可见性 |
| POST | `/bc/v1/ide/updateIDEConfig` | updateIDEConfig | ✅ InvalidArgument | 按 uuid 更新配置 |
| POST | `/bc/v1/ide/changeQueueForIDE` | changeQueueForIDE | ✅ InvalidArgument | 换队列（uuid） |
| POST | `/bc/v1/ide/sshClientIPs/update` | updateSSHClientIPs | ✅ InvalidArgument | SSH 白名单 |
| POST | `/bc/v1/ide/servicePortIPs/update` | updateServicePortIPs | ✅ InvalidArgument | 服务端口白名单 |
| POST | `/bc/v1/ide/updateSSHKey` / `updateSSHKeys` | updateSSHKey/updatePublicKey | ✅ InvalidArgument | 公钥绑定 |
| POST | `/bc/v1/ide/listIDEPublicKeyBind` | getPublicKeyBindList | ✅ InvalidArgument | ideId 正整数 |
| POST | `/bc/v1/ide/refundPeriod` / `renewPeriod` / `submitPeriod` | 包周期退订/续费 | 🔐 PermissionDenied | 管理员权限 |
| GET | `/bc/v1/ide/summary` | getIdeSummary | ✅ ok | 状态计数 |
| GET | `/bc/v1/ide/toRemove` | getAboutToBeDeletedIde | ✅ ok | 待回收列表 |
| GET | `/bc/v1/ide/trialIdeParams` | getTrialIdeParams | ✅ ok | 试用参数 |
| POST | `/bc/v1/ide/regionInfo/list` | getIdeRegionOptions | ✅ ok | 区域选项 |
| POST | `/bc/v1/ide/calculate/dindQuota` | getDockerResourceQuota | ✅ InvalidArgument | dind 资源配额（specId） |
| POST | `/bc/v1/ide/preCheckLocalStorageIDELaunch` | preCheckLocalStorageIDELaunch | ✅ InvalidArgument | 本地盘启动预检（uuid） |
| POST | `/bc/v1/ide/saveImage` | saveDevelopEnvImage | ✅ InvalidArgument | 保存为私有镜像（见 image.md） |
| POST | `/bc/v1/ide/stopSavingImage` | stopSavingDevelopEnvImage | ✅ InvalidArgument | 中止保存 |
| POST | `/bc/v1/ide/publicKey/list` | getPublicKeyList | ✅ ok | SSH 公钥列表 |
| POST | `/bc/v1/ide/publicKey/create` | createPublicKey | ✅ InvalidArgument | 公钥格式校验在前端之外也有 |
| POST | `/bc/v1/ide/publicKey/delete` | deletePublicKey | ✅ InvalidArgument | |
| POST | `/bc/v1/ide/publicKey/email` | getEmailSuggestions | ✅ ok | 邮箱建议 |
| GET | `/bc/v1/ide/overview/recommendedImage/list` | getRecommendedImageList | ✅ ok | 总览推荐镜像 |
| POST | `/bc/v1/ide/resource/metric`（v2） | getIdeResourceMetric | ⚠️ NotFound | v2 资源指标 |
| （v2 同路径） | `list/get/create/launch/stop/delete/...` | 同名服务 | 🔐 PermissionDenied | 普通账号不可用（summary/toRemove/delay 除外，✅） |

## GET /bc/v1/ide/list — 开发机列表

参数（query）：`paging.page`、`paging.perPage`、可选 `projectId`（不传=全部项目）。

响应 `ides[]` 元素字段（实测样本）：

| 字段 | 类型 | 说明 |
|---|---|---|
| `id` | int | 开发机数字 ID（生命周期操作都用它） |
| `ideName` / `ideAlias` | str | 名称 / 别名（别名可空） |
| `states` | int | 状态码（见下） |
| `imageAddr` / `imageId` | str/int | 镜像 |
| `resourceSpecific` | obj | `{quotaCpu, quotaGpu, quotaMem, gpuModel, specType, lowCudaVersion, highCudaVersion, quotaLocalStorage}` |
| `openLink` | str | Jupyter 入口（含 token，见下文 Jupyter 通道） |
| `token` | str | Jupyter JWT（需激活） |
| `createTime` | str | ISO8601 +08:00 |
| `resourceId` / `queueId` / `queueName` | int/int/str | 归属资源池/队列 |
| `poolType` | int | 2=专属池 |
| `autoStop` / `stopDuration` / `leftTime` | int/int/str | 自动停止策略与剩余秒 |
| `ideType` | int | 2=开发机 |
| `billingMode` | int | 4=按量（实测环境） |
| `uuid` | str | 机器 uuid（监控 objectType=ide 用） |

**状态码 `states` 实测口径**：`0`=异常, `3`=运行中(Running), `4`=已停止, `6`=启动失败。`statesString`（get 接口）给出英文态名，`idleStateString` 给闲置态（Abnormal 等）。

## GET /bc/v1/ide/get — 开发机详情

参数：`id`。除 list 字段外额外返回（实测完整样本见 `data/samples.json → ide.get`）：

| 字段 | 说明 |
|---|---|
| `name` | 机器名（区别于 ideName） |
| `regionName` / `regionNameEng` | 区域中文/英文名 |
| `queueName`, `poolName` | 队列/池名 |
| `sshEnabled`, `sshCommand`, `sshClientIps`, `sshShareType`(Shared/Dedicated), `sshEipId/sshEipName` | SSH 通道与白名单（CIDR 逗号分隔） |
| `sshKeys[]` | `{name, id, creatorName}` 绑定的公钥 |
| `servicePortEnabled`, `servicePortMap`(端口→`ip:port`), `servicePortClientIps`, `servicePortShareType`, `servicePortEipConfig` | 自定义服务端口 |
| `researchStorageInfo[]` | 科研存储挂载：`{type:"OceanDisk", storageName, mountPath, storageId, spaceId, spaceFolder, spaceName, readOnly}` |
| `localStorageInfo` | `{pvSize, releasePolicy: Retain/Delete, mountPath:"/home/dataset-local", subPath:"ide_data"}` |
| `vncInfo` | `{userName, password(Base64)}` — VNC 凭据（无需独立端点） |
| `dindEnabled`, `dindInfo{quotaCpu,quotaGpu,quotaMem}` | 容器内 docker 资源 |
| `monitorId` | `ide-<uuid>` 监控对象 ID |
| `idleState/idleTimeLength/idleStopTime/idleDelayTime/idleStateString` | 闲置策略状态 |
| `useIdleResource` | 闲置资源抢占标记 |
| `startMode` | `only_cpu` 等启动模式 |
| `userName/userEmail` | 归属人 |
| `projectId/projectName` | 归属项目 |
| `ideVisibility` / `enableVisibilitySwitch` | PERSONAL/ALL |
| `isFreeze/urlReady/isOffline/isPendingTooLong/localStorageStatus` | 辅助状态 |

## POST /bc/v1/ide/batch/create — 创建开发机（核心写操作）

body 结构（SPA `buildIdeSubmitParams` 源码同构，实测验证）：

```json
{
  "ide_info": {
    "billingMode": 4, "ideModifyTime": 1,
    "projectId": "<PROJECT_UUID>",
    "name": "dev-env-xxxxx", "poolName": "",
    "resourceId": 34364, "queueId": 53192,
    "regionNameEng": "zj-pinghu-1",
    "description": "",
    "autoStop": 2, "stopDuration": 0,
    "poolType": 2, "specType": 1, "specId": 3208,
    "cpuSpec": "24", "gpuSpec": "2", "memSpec": "240",
    "useIdleResource": 0,
    "imageSource": 1, "imageId": 367, "imageAddr": "...", "imageName": "...",
    "storageInfo": [],
    "researchStorageInfo": [{
      "storageId": "7018", "datasetName": "pool02-<PROJECT>",
      "storageType": "Assist", "spaceEnable": true, "spaceId": 4093,
      "readOnly": false, "pathPrefix": "/home/dataset-assist-0", "mountPath": "/research"
    }],
    "localStorageInfo": { "pv_size": 2000, "release_policy": "Retain", "mount_path": "/home/dataset-local" },
    "aoneEduInfo": { "aoneEduEnable": false, "projectName": "", "userName": "", "userPass": "" },
    "cycleCnt": 1, "cycleType": null, "autoRenew": false,
    "sshEnabled": true, "sshKeys": ["2784"],
    "sshClientIps": "1.2.3.4/32", "sshShareType": "Shared",
    "servicePortEnabled": false,
    "visibility": "PERSONAL",
    "dindEnabled": false, "dindInfo": { "quotaGpu": 0, "quotaCpu": 0, "quotaMem": 0 }
  },
  "instance_num": 1
}
```

要点：
- `localStorageInfo.pv_size` = 扩容值 + 50（基础盘），上限受 `/resource/getSpecLocalStorageInventory` 约束。
- `spaceEnable: false` 时 `spaceId` 必须为 0。
- `sshShareType: "Dedicated"` 时 `sshClientIps` 置空、`sshEipId` 必填数字。
- 单台创建也可用 `/ide/create`（不带 instance_num 包装）。

## POST /bc/v1/ide/launch — 启动

body（与 BootDevelopEnvDialog 同构，从 `/ide/get` 回填）：

```json
{
  "id": 10031883, "ideName": "dev-env-gr039",
  "autoStop": 2, "stopDuration": 0,
  "sshEnabled": true, "sshClientIps": "...", "sshShareType": "Shared",
  "servicePortEnabled": true, "serviceInternalPorts": ["8000"],
  "servicePortClientIps": "...", "servicePortShareType": "Shared",
  "dindEnabled": false, "useIdleResource": 0,
  "aoneEduInfo": { "aoneEduEnable": false },
  "startMode": "only_cpu"   // 可选，--cpu-only 模式
}
```

仅 `states ∈ {0 异常, 4 已停止, 6 失败}` 可启动（重复提交被状态机拒绝）。

## POST /bc/v1/ide/stop 与 DELETE /bc/v1/ide/delete/{id}

- stop body：`{"id": 10031883}` — 停机释放 GPU、数据保留。
- delete：`DELETE /bc/v1/ide/delete/10031883`（路径参数，无 body）。
- 批量：`/ide/batchLaunch`、`/ide/batchStop` body `{"ids": [..]}`（空数组返回 ok 无副作用）。

## GET /bc/v1/ide/summary

```json
{ "demandSummary": { "otherNum":0, "creatingNum":0, "pendingNum":0, "runningNum":0,
                     "suspendNum":0, "successNum":0, "failNum":0, "imageSavingNum":0, "totalNum":0 },
  "periodSummary": { ...同构... } }
```

## Jupyter 通道（免 SSH 执行代码）

`/ide/get` 返回的 `openLink` 形如 `https://hd4bc.esx.ctyun.cn:1443/bc/v1/Jupyter/<uuid>/?token=<JWT>`，这是一个**独立 Jupyter server**（按机器分 host），支持标准 Jupyter REST + WebSocket：

| 方法 | 路径（base = openLink 去掉尾斜杠与 ?token） | 说明 |
|---|---|---|
| GET | `/` | **必须先访问（带尾斜杠）**→ 302 种会话 cookie，否则后续全部 401 |
| GET | `/lab` | 拿 `_xsrf` cookie |
| GET | `/api/kernels?token=<JWT>` | kernel 列表（复用 idle kernel） |
| POST | `/api/kernels?token=<JWT>` body `{"name":"python3"}` | 新建 kernel（201） |
| GET | `/api/contents/<path>?token=<JWT>` | 读文件（含 notebook） |
| WS | `/api/kernels/<id>/channels?token=<JWT>` | 执行代码（Jupyter 5.x 协议） |

**实测坑**：
1. openLink 根路径**必须带尾斜杠**才触发 302（平台按精确路径路由）。
2. 平台两种 server wire format：老版发 JSON 文本帧；新版（默认）发二进制帧 `[n:u64LE][offsets[n]][blobs]`。**二进制 server 收到 JSON 文本帧直接断连**——先等服务端首帧探测格式再发送。
3. Jupyter 会话约 1 小时过期；执行超时建议 ≥180s。
