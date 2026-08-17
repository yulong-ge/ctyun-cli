# 全量端点索引（369 个）

> 生成于 2026-08-17，方法：SPA 153 个 JS chunk 静态提取 + 逐端点实测探测。
> 「实测」列含义：✅ 空参可用 / ✅ 路由存在(缺参被拒) / 🔐 无权限 / ⚠️ 存在但异常。详见 [overview](README.md#探测方法与结果口径)。

| # | 方法 | 端点 | 服务函数(SPA) | 实测 | 业务码 | 说明 |
|---|------|------|---------------|------|--------|------|
| 1 | POST | `/bc/v1/account/type` | getUserType | ✅ | ok | 操作成功 — 空参调用即成功（数据可用） |
| 2 | POST | `/bc/v1/config/frontend` | getFrontendConfig | ✅ | ok | 操作成功 — 空参调用即成功（数据可用） |
| 3 | POST | `/bc/v1/permission/business` | getPermissionBusiness | ✅ | ok | 操作成功 — 空参调用即成功（数据可用） |
| 4 | GET | `/bc/v1/permission/user/policy` | getUserPolicy | ✅ | ok | 操作成功 — 空参调用即成功（数据可用） |
| 5 | POST | `/bc/v1/serviceAuthorization/create` | authorizeService | ✅ | InvalidArgument | 参数错误：[CreateServiceAuthorization] ctyunUserId and  — 路由存在，缺必填参数被拒（传对参数即可用） |
| 6 | POST | `/bc/v1/serviceAuthorization/verify` | verifyAuthority | ✅ | InvalidArgument | 参数错误：[VerifyServiceAuthorization] ctyunUserId and  — 路由存在，缺必填参数被拒（传对参数即可用） |
| 7 | GET | `/bc/v2/userFavor/get` | getUserFavor | ✅ | ok | 操作成功 — 空参调用即成功（数据可用） |
| 8 | POST | `/bc/v2/userFavor/set` | setUserFavor | ✅ | ok | 操作成功 — 空参调用即成功（数据可用） |
| 9 | POST | `/bc/v1/bs/activity/bindUsers` | bindUsers | ✅ | ok | 操作成功 — 空参调用即成功（数据可用） |
| 10 | POST | `/bc/v1/bs/activity/createActivity` | createActivity | ⚠️ | Internal | runtime error: invalid memory address or nil point —  存在路由，服务端处理异常（多为缺参导致内部错误） |
| 11 | POST | `/bc/v1/bs/activity/createBatchResources` |  | ⚠️ | Internal | runtime error: invalid memory address or nil point —  存在路由，服务端处理异常（多为缺参导致内部错误） |
| 12 | POST | `/bc/v1/bs/activity/describeActivityDetail` | describeActivityDetail | 🔐 | PermissionDenied | 没有权限：当前用户不是活动成员 —  路由存在，当前普通账号无权限（管理员/开通后可用） |
| 13 | POST | `/bc/v1/bs/activity/describeMultiChildAccount` | describeMultiChildAccount | ⚠️ | NotFound | Not Found —  存在路由但资源不存在 / 功能未开通（带有效上下文可能可用 |
| 14 | POST | `/bc/v1/bs/activity/describeTemplateDetail` | describeTemplateDetail | ⚠️ | Internal | runtime error: invalid memory address or nil point —  存在路由，服务端处理异常（多为缺参导致内部错误） |
| 15 | POST | `/bc/v1/bs/activity/listActivities` | listActivities | ✅ | ok | 操作成功 — 空参调用即成功（数据可用） |
| 16 | POST | `/bc/v1/bs/activity/listActivityUsers` | listActivityUsers | ✅ | ok | 操作成功 — 空参调用即成功（数据可用） |
| 17 | POST | `/bc/v1/bs/activity/listResources` | listResources | ✅ | InvalidArgument | 参数错误：activity uuid is required — 路由存在，缺必填参数被拒（传对参数即可用） |
| 18 | POST | `/bc/v1/bs/activity/listTemplates` | listTemplates | ⚠️ | Internal | runtime error: invalid memory address or nil point —  存在路由，服务端处理异常（多为缺参导致内部错误） |
| 19 | POST | `/bc/v1/bs/activity/publishTemplate` | publishTemplate | ⚠️ | Internal | runtime error: invalid memory address or nil point —  存在路由，服务端处理异常（多为缺参导致内部错误） |
| 20 | POST | `/bc/v1/bs/activity/queryFailedTaskDetail` | queryFailedTaskDetail | ⚠️ | Internal | runtime error: invalid memory address or nil point —  存在路由，服务端处理异常（多为缺参导致内部错误） |
| 21 | POST | `/bc/v1/bs/activity/queryOperationLogs` | queryOperationLogs | ⚠️ | Internal | runtime error: invalid memory address or nil point —  存在路由，服务端处理异常（多为缺参导致内部错误） |
| 22 | POST | `/bc/v1/bs/activity/removeActivity` | removeActivity | ⚠️ | Internal | runtime error: invalid memory address or nil point —  存在路由，服务端处理异常（多为缺参导致内部错误） |
| 23 | POST | `/bc/v1/bs/activity/removeLog` | removeLog | ⚠️ | Internal | runtime error: invalid memory address or nil point —  存在路由，服务端处理异常（多为缺参导致内部错误） |
| 24 | POST | `/bc/v1/bs/activity/removeTemplate` | removeTemplate | ⚠️ | Internal | runtime error: invalid memory address or nil point —  存在路由，服务端处理异常（多为缺参导致内部错误） |
| 25 | POST | `/bc/v1/bs/activity/removeUsers` | removeUsers | ✅ | ok | 操作成功 — 空参调用即成功（数据可用） |
| 26 | POST | `/bc/v1/bs/activity/retryFailedTask` | retryFailedTask | ⚠️ | Internal | runtime error: invalid memory address or nil point —  存在路由，服务端处理异常（多为缺参导致内部错误） |
| 27 | POST | `/bc/v1/bs/activity/updateActivity` | updateActivity | ⚠️ | Internal | runtime error: invalid memory address or nil point —  存在路由，服务端处理异常（多为缺参导致内部错误） |
| 28 | POST | `/bc/v1/bs/activity/updateTemplate` | updateTemplate | ⚠️ | Internal | runtime error: invalid memory address or nil point —  存在路由，服务端处理异常（多为缺参导致内部错误） |
| 29 | POST | `/bc/v1/agent/chat` | sendMessage | ❓ | http:500 | — |
| 30 | GET | `/bc/v1/agent/conversation/delete` | deleteConversation | ❓ | http:200 | — |
| 31 | GET | `/bc/v1/agent/conversation/detail` | getConversationDetail | ❓ | http:200 | — |
| 32 | GET | `/bc/v1/agent/conversation/list` | getHistoryConversations | ❓ | http:200 | — |
| 33 | POST | `/bc/v1/agent/conversation/stop` | stopConversation | ❓ | http:200 | — |
| 34 | POST | `/bc/v1/agent/conversation/top` | topConversation | ❓ | http:200 | — |
| 35 | POST | `/bc/v1/agent/conversation/updateTitle` | updateConversationTitle | ❓ | http:200 | — |
| 36 | POST | `/bc/v1/cluster/getTenantQuotaInfo` | getTenantQuotaInfo | ✅ | ok | 操作成功 — 空参调用即成功（数据可用） |
| 37 | GET | `/bc/v1/cluster/resource/events` | getEventsList, getInferEvents | ⚠️ | NotFound | 未找到ide资源，请检查后重试 —  存在路由但资源不存在 / 功能未开通（带有效上下文可能可用 |
| 38 | POST | `/bc/v1/cluster/resource/logs` | getResourceLog | ✅ | InvalidArgument | 参数错误：instance type  — 路由存在，缺必填参数被拒（传对参数即可用） |
| 39 | GET | `/bc/v1/cluster/shared_quota` | getSharedClusterRegion | ✅ | ok | 操作成功 — 空参调用即成功（数据可用） |
| 40 | GET | `/bc/v1/cluster/storage_quota` | getClusterStorageQuota | ⚠️ | ResourceExhausted | 可用存储配额不足，请联系运营人员。 —  配额不足（功能真实存在） |
| 41 | POST | `/bc/v1/crs/check/login` | checkCRSLogin | ✅ | ok | 操作成功 — 空参调用即成功（数据可用） |
| 42 | POST | `/bc/v1/crs/cluster/page` | getGroupCluster | ✅ | ok | 操作成功 — 空参调用即成功（数据可用） |
| 43 | POST | `/bc/v1/crs/image/page` | searchImage | ⚠️ | Internal | 镜像分发服务错误，请登录镜像分发服务后重试或联系工作人员 —  存在路由，服务端处理异常（多为缺参导致内部错误） |
| 44 | POST | `/bc/v1/crs/imagetag/page` | searchImageTag | ✅ | ok | 操作成功 — 空参调用即成功（数据可用） |
| 45 | POST | `/bc/v1/crs/project/page` | searchProject | ✅ | ok | 操作成功 — 空参调用即成功（数据可用） |
| 46 | POST | `/bc/v1/crs/project/usage` | checkCRSUsage | ✅ | ok | 操作成功 — 空参调用即成功（数据可用） |
| 47 | POST | `/bc/v1/crs/register/user` | registerUser | ⚠️ | Internal | 镜像分发服务错误，请登录镜像分发服务后重试或联系工作人员 —  存在路由，服务端处理异常（多为缺参导致内部错误） |
| 48 | GET | `/bc/v1/eck/k8sCluster/get` | getK8sClusterInfo | ⚠️ | NotFound | Not Found —  存在路由但资源不存在 / 功能未开通（带有效上下文可能可用 |
| 49 | GET | `/bc/v1/eck/k8sCluster/getK8s` | getK8sCluster | ⚠️ | NotFound | Not Found —  存在路由但资源不存在 / 功能未开通（带有效上下文可能可用 |
| 50 | GET | `/bc/v1/eck/k8sCluster/list` | getK8sClusterList | ⚠️ | NotFound | Not Found —  存在路由但资源不存在 / 功能未开通（带有效上下文可能可用 |
| 51 | GET | `/bc/v1/eck/k8sCluster/listRegions` | getRegionClusters | ⚠️ | NotFound | Not Found —  存在路由但资源不存在 / 功能未开通（带有效上下文可能可用 |
| 52 | GET | `/bc/v1/ecx/clusterList` | getClusterList | ✅ | ok | 操作成功 — 空参调用即成功（数据可用） |
| 53 | GET | `/bc/v2/cluster/storage_quota` | getClusterStorageQuota | ⚠️ | ResourceExhausted | 可用存储配额不足，请联系运营人员。 —  配额不足（功能真实存在） |
| 54 | POST | `/bc/v1/ide/batch/create` | batchCreateDevelopEnv | ✅ | InvalidArgument | 参数错误：instance number — 路由存在，缺必填参数被拒（传对参数即可用） |
| 55 | POST | `/bc/v1/ide/batchLaunch` | batchLaunchDevelopEnv | ✅ | ok | 操作成功 — 空参调用即成功（数据可用） |
| 56 | POST | `/bc/v1/ide/batchStop` | batchStopDevelopEnv | ✅ | ok | 操作成功 — 空参调用即成功（数据可用） |
| 57 | POST | `/bc/v1/ide/calculate/dindQuota` | getDockerResourceQuota | ✅ | InvalidArgument | invalid field SpecId: 规格{id}值需要大于0 — 路由存在，缺必填参数被拒（传对参数即可用） |
| 58 | POST | `/bc/v1/ide/changeQueueForIDE` | changeQueueForIDE | ✅ | InvalidArgument | invalid field Uuid: 开发机{uuid}值需要非空 — 路由存在，缺必填参数被拒（传对参数即可用） |
| 59 | POST | `/bc/v1/ide/create` | createDevelopEnv | ✅ | InvalidArgument | invalid field Name: 开发环境名称{name}的长度需要大于0 — 路由存在，缺必填参数被拒（传对参数即可用） |
| 60 | POST | `/bc/v1/ide/createTrial` | createTrialDevelopEnv | ✅ | InvalidArgument | invalid field Name: 开发环境名称{name}的长度需要大于0 — 路由存在，缺必填参数被拒（传对参数即可用） |
| 61 | DELETE | `/bc/v1/ide/delete/:_` |  | ⚠️ | NotFound | 未找到ide资源，请检查后重试 —  存在路由但资源不存在 / 功能未开通（带有效上下文可能可用 |
| 62 | GET | `/bc/v1/ide/get` | getDevelopEnvInfo | ✅ | InvalidArgument | invalid field Id: 开发环境的id{id}值需要大于0 — 路由存在，缺必填参数被拒（传对参数即可用） |
| 63 | POST | `/bc/v1/ide/launch` | launchDevelopEnv | ✅ | InvalidArgument | invalid field Id: 开发环境{id}值需要大于0 — 路由存在，缺必填参数被拒（传对参数即可用） |
| 64 | GET | `/bc/v1/ide/list` | getDevelopEnvList | ✅ | ok | 操作成功 — 空参调用即成功（数据可用） |
| 65 | POST | `/bc/v1/ide/listIDEPublicKeyBind` | getPublicKeyBindList | ✅ | InvalidArgument | ideId必须为正整数，请检查后重试 — 路由存在，缺必填参数被拒（传对参数即可用） |
| 66 | GET | `/bc/v1/ide/overview/recommendedImage/list` | getRecommendedImageList | ✅ | ok | 操作成功 — 空参调用即成功（数据可用） |
| 67 | POST | `/bc/v1/ide/preCheckLocalStorageIDELaunch` | preCheckLocalStorageIDELaunch | ✅ | InvalidArgument | invalid field Uuid: 开发机{uuid}值需要非空 — 路由存在，缺必填参数被拒（传对参数即可用） |
| 68 | POST | `/bc/v1/ide/publicKey/create` | createPublicKey | ✅ | InvalidArgument | 公钥格式不正确，请重新输入 — 路由存在，缺必填参数被拒（传对参数即可用） |
| 69 | POST | `/bc/v1/ide/publicKey/delete` | deletePublicKey | ✅ | InvalidArgument | invalid field Id: 公钥管理{id}值需大于0 — 路由存在，缺必填参数被拒（传对参数即可用） |
| 70 | POST | `/bc/v1/ide/publicKey/email` | getEmailSuggestions | ✅ | ok | 操作成功 — 空参调用即成功（数据可用） |
| 71 | POST | `/bc/v1/ide/publicKey/list` | getPublicKeyList | ✅ | ok | 操作成功 — 空参调用即成功（数据可用） |
| 72 | POST | `/bc/v1/ide/refundPeriod` | refundPeriod | 🔐 | PermissionDenied | 权限不足，请联系管理员授权后重试! —  路由存在，当前普通账号无权限（管理员/开通后可用） |
| 73 | POST | `/bc/v1/ide/regionInfo/list` | getIdeRegionOptions | ✅ | ok | 操作成功 — 空参调用即成功（数据可用） |
| 74 | POST | `/bc/v1/ide/renewPeriod` | renewPeriod | 🔐 | PermissionDenied | 权限不足，请联系管理员授权后重试! —  路由存在，当前普通账号无权限（管理员/开通后可用） |
| 75 | POST | `/bc/v1/ide/servicePortIPs/update` | updateServicePortIPs | ✅ | InvalidArgument | invalid field Id: 开发环境{id}值需要大于0 — 路由存在，缺必填参数被拒（传对参数即可用） |
| 76 | POST | `/bc/v1/ide/sshClientIPs/update` | updateSSHClientIPs | ✅ | InvalidArgument | invalid field Id: 开发环境{id}值需要大于0 — 路由存在，缺必填参数被拒（传对参数即可用） |
| 77 | POST | `/bc/v1/ide/stop` | stopDevelopEnv | ✅ | InvalidArgument | invalid field Id: 开发环境{id}值需要大于0 — 路由存在，缺必填参数被拒（传对参数即可用） |
| 78 | POST | `/bc/v1/ide/stopSavingImage` | stopSavingDevelopEnvImage | ✅ | InvalidArgument | invalid field Id: 开发机id{id}值需要大于0 — 路由存在，缺必填参数被拒（传对参数即可用） |
| 79 | POST | `/bc/v1/ide/submitPeriod` | submitPeriod | 🔐 | PermissionDenied | 权限不足，请联系管理员授权后重试! —  路由存在，当前普通账号无权限（管理员/开通后可用） |
| 80 | GET | `/bc/v1/ide/summary` | getIdeSummary | ✅ | ok | 操作成功 — 空参调用即成功（数据可用） |
| 81 | GET | `/bc/v1/ide/toRemove` | getAboutToBeDeletedIde | ✅ | ok | 操作成功 — 空参调用即成功（数据可用） |
| 82 | GET | `/bc/v1/ide/trialIdeParams` | getTrialIdeParams | ✅ | ok | 操作成功 — 空参调用即成功（数据可用） |
| 83 | POST | `/bc/v1/ide/updateActiveTime` | updateActiveTime | ✅ | InvalidArgument | invalid field Id: 开发环境{id}值需要大于0 — 路由存在，缺必填参数被拒（传对参数即可用） |
| 84 | POST | `/bc/v1/ide/updateAlias` | updateIdeAlias | ✅ | InvalidArgument | invalid field Id: 开发环境{id}值需要大于0 — 路由存在，缺必填参数被拒（传对参数即可用） |
| 85 | POST | `/bc/v1/ide/updateIDEConfig` | updateIDEConfig | ✅ | InvalidArgument | invalid field Uuid: 开发机{uuid}值需要非空 — 路由存在，缺必填参数被拒（传对参数即可用） |
| 86 | POST | `/bc/v1/ide/updateImage` | updateImage | ✅ | InvalidArgument | invalid field Id: 开发环境{id}值需要大于0 — 路由存在，缺必填参数被拒（传对参数即可用） |
| 87 | POST | `/bc/v1/ide/updateSpecific` | updateSpecific | ✅ | InvalidArgument | invalid field Id: 开发环境{id}值需要大于0 — 路由存在，缺必填参数被拒（传对参数即可用） |
| 88 | POST | `/bc/v1/ide/updateSSHKey` | updateSSHKey | ✅ | InvalidArgument | invalid field Id: 公钥{id}值需要大于0 — 路由存在，缺必填参数被拒（传对参数即可用） |
| 89 | POST | `/bc/v1/ide/updateSSHKeys` | updatePublicKey | ✅ | InvalidArgument | invalid field Id: 开发环境{id}值需要大于0 — 路由存在，缺必填参数被拒（传对参数即可用） |
| 90 | POST | `/bc/v1/ide/updateVisibility` | updateVisibility | ✅ | InvalidArgument | invalid field Id: 开发环境{id}值需要大于0 — 路由存在，缺必填参数被拒（传对参数即可用） |
| 91 | POST | `/bc/v1/ide/updateVolume` | updateVolume | ✅ | InvalidArgument | invalid field Id: 开发环境{id}值需要大于0 — 路由存在，缺必填参数被拒（传对参数即可用） |
| 92 | POST | `/bc/v2/ide/create` | createDevelopEnv | 🔐 | PermissionDenied | 权限不足，请联系管理员授权后重试! —  路由存在，当前普通账号无权限（管理员/开通后可用） |
| 93 | POST | `/bc/v2/ide/delay` | delayStop | ✅ | InvalidArgument | invalid field Id: 开发环境{id}值需要大于0 — 路由存在，缺必填参数被拒（传对参数即可用） |
| 94 | DELETE | `/bc/v2/ide/delete/:_` |  | 🔐 | PermissionDenied | 权限不足，请联系管理员授权后重试! —  路由存在，当前普通账号无权限（管理员/开通后可用） |
| 95 | GET | `/bc/v2/ide/get` | getDevelopEnvInfo | 🔐 | PermissionDenied | 权限不足，请联系管理员授权后重试! —  路由存在，当前普通账号无权限（管理员/开通后可用） |
| 96 | POST | `/bc/v2/ide/launch` | launchDevelopEnv | 🔐 | PermissionDenied | 权限不足，请联系管理员授权后重试! —  路由存在，当前普通账号无权限（管理员/开通后可用） |
| 97 | GET | `/bc/v2/ide/list` | getDevelopEnvList | 🔐 | PermissionDenied | 权限不足，请联系管理员授权后重试! —  路由存在，当前普通账号无权限（管理员/开通后可用） |
| 98 | GET | `/bc/v2/ide/overview/recommendedImage/list` | getRecommendedImageList | 🔐 | PermissionDenied | 权限不足，请联系管理员授权后重试! —  路由存在，当前普通账号无权限（管理员/开通后可用） |
| 99 | POST | `/bc/v2/ide/refundPeriod` | refundPeriod | 🔐 | PermissionDenied | 权限不足，请联系管理员授权后重试! —  路由存在，当前普通账号无权限（管理员/开通后可用） |
| 100 | POST | `/bc/v2/ide/renewPeriod` | renewPeriod | 🔐 | PermissionDenied | 权限不足，请联系管理员授权后重试! —  路由存在，当前普通账号无权限（管理员/开通后可用） |
| 101 | POST | `/bc/v2/ide/resource/metric` | getIdeResourceMetric | ⚠️ | NotFound | Not Found —  存在路由但资源不存在 / 功能未开通（带有效上下文可能可用 |
| 102 | POST | `/bc/v2/ide/stop` | stopDevelopEnv | 🔐 | PermissionDenied | 权限不足，请联系管理员授权后重试! —  路由存在，当前普通账号无权限（管理员/开通后可用） |
| 103 | POST | `/bc/v2/ide/submitPeriod` | submitPeriod | 🔐 | PermissionDenied | 权限不足，请联系管理员授权后重试! —  路由存在，当前普通账号无权限（管理员/开通后可用） |
| 104 | GET | `/bc/v2/ide/summary` | getIdeSummary | ✅ | ok | 操作成功 — 空参调用即成功（数据可用） |
| 105 | GET | `/bc/v2/ide/toRemove` | getAboutToBeDeletedIde | ✅ | ok | 操作成功 — 空参调用即成功（数据可用） |
| 106 | POST | `/bc/v2/ide/updateActiveTime` | updateActiveTime | 🔐 | PermissionDenied | 权限不足，请联系管理员授权后重试! —  路由存在，当前普通账号无权限（管理员/开通后可用） |
| 107 | POST | `/bc/v2/ide/updateImage` | updateImage | 🔐 | PermissionDenied | 权限不足，请联系管理员授权后重试! —  路由存在，当前普通账号无权限（管理员/开通后可用） |
| 108 | POST | `/bc/v2/ide/updateSpecific` | updateSpecific | 🔐 | PermissionDenied | 权限不足，请联系管理员授权后重试! —  路由存在，当前普通账号无权限（管理员/开通后可用） |
| 109 | POST | `/bc/v1/ide/image/featLabels/get` | getFeatLabelsById | ✅ | InvalidArgument | invalid field ImageId: 镜像id{imageId}值需要大于0 — 路由存在，缺必填参数被拒（传对参数即可用） |
| 110 | POST | `/bc/v1/ide/image/featLabels/list` | getFeatLabels | ✅ | ok | 操作成功 — 空参调用即成功（数据可用） |
| 111 | GET | `/bc/v1/ide/image/list` | getImageList | ✅ | ok | 操作成功 — 空参调用即成功（数据可用） |
| 112 | GET | `/bc/v1/ide/image/pushProgress` | getImagePushProgress | ✅ | InvalidArgument | invalid field UserImageId: 镜像id{user_image_id}值需要大 — 路由存在，缺必填参数被拒（传对参数即可用） |
| 113 | GET | `/bc/v1/ide/image/recommendedSpec` | getImageSpec | ✅ | InvalidArgument | invalid field ImageId: 镜像id{imageId}值需要大于0 — 路由存在，缺必填参数被拒（传对参数即可用） |
| 114 | POST | `/bc/v1/ide/image/share` | shareImage | ✅ | InvalidArgument | invalid field ShareUserId: 分享对象用户ID{id}的长度值需要大于0 — 路由存在，缺必填参数被拒（传对参数即可用） |
| 115 | GET | `/bc/v1/ide/image/shareImage/list` | imageShareImageList | ✅ | ok | 操作成功 — 空参调用即成功（数据可用） |
| 116 | GET | `/bc/v1/ide/image/shareRecord` | imageShareRecord | ✅ | ok | 操作成功 — 空参调用即成功（数据可用） |
| 117 | POST | `/bc/v1/ide/image/unshare` | unshareImage | ✅ | InvalidArgument | invalid field ShareImageId: 分享镜像id{share_image_id} — 路由存在，缺必填参数被拒（传对参数即可用） |
| 118 | POST | `/bc/v1/ide/saveImage` | saveDevelopEnvImage | ✅ | InvalidArgument | invalid field Id: 开发环境{id}值需要大于0 — 路由存在，缺必填参数被拒（传对参数即可用） |
| 119 | POST | `/bc/v1/ide/user_image/delete` | deleteUserImage | ✅ | InvalidArgument | invalid field Id: 私有镜像id{id}值需要大于0 — 路由存在，缺必填参数被拒（传对参数即可用） |
| 120 | GET | `/bc/v1/ide/user_image/list` | getUserImageList | ✅ | ok | 操作成功 — 空参调用即成功（数据可用） |
| 121 | POST | `/bc/v2/ide/image/featLabels/list` | getFeatLabels | ✅ | ok | 操作成功 — 空参调用即成功（数据可用） |
| 122 | GET | `/bc/v2/ide/image/list` | getImageList | 🔐 | PermissionDenied | 权限不足，请联系管理员授权后重试! —  路由存在，当前普通账号无权限（管理员/开通后可用） |
| 123 | POST | `/bc/v2/ide/image/share` | shareImage | ✅ | InvalidArgument | invalid field ShareUserId: 分享对象用户ID{id}的长度值需要大于0 — 路由存在，缺必填参数被拒（传对参数即可用） |
| 124 | GET | `/bc/v2/ide/image/shareImage/list` | imageShareImageList | 🔐 | PermissionDenied | 权限不足，请联系管理员授权后重试! —  路由存在，当前普通账号无权限（管理员/开通后可用） |
| 125 | GET | `/bc/v2/ide/image/shareRecord` | imageShareRecord | ✅ | ok | 操作成功 — 空参调用即成功（数据可用） |
| 126 | POST | `/bc/v2/ide/image/unshare` | unshareImage | ✅ | InvalidArgument | invalid field ShareImageId: 分享镜像id{share_image_id} — 路由存在，缺必填参数被拒（传对参数即可用） |
| 127 | POST | `/bc/v2/ide/saveImage` | saveDevelopEnvImage | 🔐 | PermissionDenied | 权限不足，请联系管理员授权后重试! —  路由存在，当前普通账号无权限（管理员/开通后可用） |
| 128 | POST | `/bc/v2/ide/user_image/delete` | deleteUserImage | 🔐 | PermissionDenied | 权限不足，请联系管理员授权后重试! —  路由存在，当前普通账号无权限（管理员/开通后可用） |
| 129 | GET | `/bc/v2/ide/user_image/list` | getUserImageList | 🔐 | PermissionDenied | 权限不足，请联系管理员授权后重试! —  路由存在，当前普通账号无权限（管理员/开通后可用） |
| 130 | POST | `/bc/v1/infer_service/cert/sync` | syncCert | ✅ | InvalidArgument | invalid field UserKey: 科研服务私钥{user_key}的长度需要大于0 — 路由存在，缺必填参数被拒（传对参数即可用） |
| 131 | POST | `/bc/v1/infer_service/create` | createInfer | ✅ | InvalidArgument | invalid field Name: 科研服务的名称{name}的长度需要大于0 — 路由存在，缺必填参数被拒（传对参数即可用） |
| 132 | DELETE | `/bc/v1/infer_service/delete/:_` | deleteInfer | ⚠️ | NotFound | 未找到inferService资源，请检查后重试 —  存在路由但资源不存在 / 功能未开通（带有效上下文可能可用 |
| 133 | GET | `/bc/v1/infer_service/detail` | getInferDetail | ⚠️ | NotFound | 未找到inferService资源，请检查后重试 —  存在路由但资源不存在 / 功能未开通（带有效上下文可能可用 |
| 134 | GET | `/bc/v1/infer_service/framework/list` | getInferFrames | ✅ | ok | 操作成功 — 空参调用即成功（数据可用） |
| 135 | POST | `/bc/v1/infer_service/launch` | startInfer | ✅ | InvalidArgument | invalid field Id: 科研服务id{id}的值需要大于0 — 路由存在，缺必填参数被拒（传对参数即可用） |
| 136 | GET | `/bc/v1/infer_service/list` | getInferList | ✅ | ok | 操作成功 — 空参调用即成功（数据可用） |
| 137 | GET | `/bc/v1/infer_service/secret` | getInferSecret | ✅ | InvalidArgument | invalid field Id: 科研服务id{id}的值需要大于0 — 路由存在，缺必填参数被拒（传对参数即可用） |
| 138 | POST | `/bc/v1/infer_service/stop` | stopInfer | ✅ | InvalidArgument | invalid field Id: 科研服务id{id}的值需要大于0 — 路由存在，缺必填参数被拒（传对参数即可用） |
| 139 | GET | `/bc/v1/infer_service/summary` | summaryInfer | ✅ | ok | 操作成功 — 空参调用即成功（数据可用） |
| 140 | POST | `/bc/v1/model_repo/create` | createModel | ✅ | InvalidArgument | invalid field Name: 模型的名称{name}的长度需要大于0 — 路由存在，缺必填参数被拒（传对参数即可用） |
| 141 | DELETE | `/bc/v1/model_repo/delete/:_` | deleteModel | ⚠️ | NotFound | 未找到model_repo资源，请检查后重试 —  存在路由但资源不存在 / 功能未开通（带有效上下文可能可用 |
| 142 | GET | `/bc/v1/model_repo/detail` | getModelDetail | ⚠️ | NotFound | 未找到model_repo资源，请检查后重试 —  存在路由但资源不存在 / 功能未开通（带有效上下文可能可用 |
| 143 | GET | `/bc/v1/model_repo/framework/list` | getModelFrameList | ✅ | ok | 操作成功 — 空参调用即成功（数据可用） |
| 144 | GET | `/bc/v1/model_repo/list` | getModelList | ✅ | ok | 操作成功 — 空参调用即成功（数据可用） |
| 145 | POST | `/bc/v1/model/checkModelUpload` | checkModelVersionUpload | ✅ | InvalidArgument | invalid field Id: 模型版本id{id}的值需要大于0 — 路由存在，缺必填参数被拒（传对参数即可用） |
| 146 | POST | `/bc/v1/model/create` | createModelVersion | ✅ | InvalidArgument | invalid field Version: 模型的版本{version}的长度需要大于0 — 路由存在，缺必填参数被拒（传对参数即可用） |
| 147 | DELETE | `/bc/v1/model/delete/:_` | deleteModelVersion | ⚠️ | NotFound | 未找到model资源，请检查后重试 —  存在路由但资源不存在 / 功能未开通（带有效上下文可能可用 |
| 148 | POST | `/bc/v1/model/finishModelUpload` | finishModelUpload | ✅ | InvalidArgument | invalid field Id: 模型版本id{id}的值需要大于0 — 路由存在，缺必填参数被拒（传对参数即可用） |
| 149 | GET | `/bc/v1/model/list` | getModelVersionList | ✅ | InvalidArgument | 参数错误：modelRepoId should not be empty — 路由存在，缺必填参数被拒（传对参数即可用） |
| 150 | POST | `/bc/v1/job/arguments` | getJobArguments | ⚠️ | NotFound | Not Found —  存在路由但资源不存在 / 功能未开通（带有效上下文可能可用 |
| 151 | POST | `/bc/v1/job/create` | createTask | ✅ | InvalidArgument | invalid field QueueId: 队列的id{queue_id}值需要大于0 — 路由存在，缺必填参数被拒（传对参数即可用） |
| 152 | POST | `/bc/v1/job/createTrainingJob` | createTrainingJob | ✅ | InvalidArgument | invalid field Name: 任务名称{name}的长度需要大于0 — 路由存在，缺必填参数被拒（传对参数即可用） |
| 153 | POST | `/bc/v1/job/delete` | deleteTask | ✅ | InvalidArgument | invalid field JobId: 作业id{job_id}值需要大于0 — 路由存在，缺必填参数被拒（传对参数即可用） |
| 154 | POST | `/bc/v1/job/delete/batch` | batchDeleteTask | ✅ | InvalidArgument | invalid field JobIds: 批量作业ids{job_ids}的数量需要大于0 — 路由存在，缺必填参数被拒（传对参数即可用） |
| 155 | POST | `/bc/v1/job/deleteTrainingJob` | deleteTrainingJob | 🔐 | Unauthenticated | 没有权限：no permission —  需要额外授权（子账号/运营审批） |
| 156 | POST | `/bc/v1/job/describeTrainingJob` | getTrainingDetail, getParallelDetail | 🔐 | Unauthenticated | 没有权限：no permission —  需要额外授权（子账号/运营审批） |
| 157 | POST | `/bc/v1/job/describeTrainingJobs` | getTrainingJobs | ✅ | ok | 操作成功 — 空参调用即成功（数据可用） |
| 158 | GET | `/bc/v1/job/detail` | getArgoDetail | ✅ | InvalidArgument | invalid field JobId: 作业id{job_id}值需要大于0 — 路由存在，缺必填参数被拒（传对参数即可用） |
| 159 | POST | `/bc/v1/job/edit` | editTask | ✅ | InvalidArgument | invalid field JobId: 作业id{job_id}值需要大于0 — 路由存在，缺必填参数被拒（传对参数即可用） |
| 160 | GET | `/bc/v1/job/list` | getArgoList | ✅ | ok | 操作成功 — 空参调用即成功（数据可用） |
| 161 | POST | `/bc/v1/job/manage` | manageTask | ✅ | InvalidArgument | invalid field JobId: 作业id{job_id}值需要大于0 — 路由存在，缺必填参数被拒（传对参数即可用） |
| 162 | POST | `/bc/v1/job/metric/pull` | getPrometheusMetric | ✅ | ok | 操作成功 — 空参调用即成功（数据可用） |
| 163 | GET | `/bc/v1/job/pod/container/list` | getContainerList | ✅ | InvalidArgument | invalid field ClusterId: 集群id{cluster_id}值需要大于0 — 路由存在，缺必填参数被拒（传对参数即可用） |
| 164 | GET | `/bc/v1/job/pod/event/list` | getEventsList | ✅ | InvalidArgument | invalid field ClusterId: 集群id{cluster_id}值需要大于0 — 路由存在，缺必填参数被拒（传对参数即可用） |
| 165 | POST | `/bc/v1/job/resource/metric` | getMetric | ⚠️ | NotFound | 未找到training_job资源，请检查后重试 —  存在路由但资源不存在 / 功能未开通（带有效上下文可能可用 |
| 166 | POST | `/bc/v1/job/startTrainingJob` | startTrainingJob | 🔐 | Unauthenticated | 没有权限：no permission —  需要额外授权（子账号/运营审批） |
| 167 | POST | `/bc/v1/job/stopTrainingJob` | stopTrainingJob | 🔐 | Unauthenticated | 没有权限：no permission —  需要额外授权（子账号/运营审批） |
| 168 | GET | `/bc/v1/job/summary` | getJobSummaryInfo | ✅ | ok | 操作成功 — 空参调用即成功（数据可用） |
| 169 | POST | `/bc/v1/job/template/create` | createJobTemplate | ✅ | InvalidArgument | invalid field TemplateName: 模板名称{template_name}的长度 — 路由存在，缺必填参数被拒（传对参数即可用） |
| 170 | POST | `/bc/v1/job/template/delete` | deleteJobTemplate | ✅ | InvalidArgument | invalid field TemplateId: 模板id{template_id}的值需要大于0 — 路由存在，缺必填参数被拒（传对参数即可用） |
| 171 | GET | `/bc/v1/job/template/detail` | getJobTemplateDetail | ✅ | InvalidArgument | invalid field TemplateId: 模板id{template_id}的值需要大于0 — 路由存在，缺必填参数被拒（传对参数即可用） |
| 172 | GET | `/bc/v1/job/template/list` | getJobTemplateList | ⚠️ | Internal | runtime error: invalid memory address or nil point —  存在路由，服务端处理异常（多为缺参导致内部错误） |
| 173 | POST | `/bc/v1/job/updateTrainingJob` | updateTrainingJobAlias | ⚠️ | Unknown | record not found —  存在路由，服务端语义错误（参数值不合法） |
| 174 | GET | `/bc/v1/k8s/:_/api/v1/namespaces/:_/events` | SSE/长连接 | ❓跳过 | SKIP | — |
| 175 | GET | `/bc/v1/k8s/:_/apis/autoscaling/v2beta1/namespaces/:_/horizontalpodautoscalers/:_` | SSE/长连接 | ❓跳过 | SKIP | — |
| 176 | POST | `/bc/v1/project/list` | getProjectlist | ⚠️ | NotFound | Not Found —  存在路由但资源不存在 / 功能未开通（带有效上下文可能可用 |
| 177 | POST | `/bc/v1/user/listCreator` | getCreatorInfoList | ✅ | InvalidArgument | 为非空字符串，请检查后重试 — 路由存在，缺必填参数被拒（传对参数即可用） |
| 178 | GET | `/bc/v1/v1/ops/tenant/region/list` | getRegionList | ⚠️ | NotFound | Not Found —  存在路由但资源不存在 / 功能未开通（带有效上下文可能可用 |
| 179 | GET | `/bc/v2/idleRule/get` | getIdleConfig | ✅ | InvalidArgument | invalid field ProjectId: 企业项目{project_id}的长度需要大于0 — 路由存在，缺必填参数被拒（传对参数即可用） |
| 180 | POST | `/bc/v2/idleRule/off` |  | 🔐 | PermissionDenied | 权限不足，请联系管理员授权后重试! —  路由存在，当前普通账号无权限（管理员/开通后可用） |
| 181 | POST | `/bc/v2/idleRule/on` |  | 🔐 | PermissionDenied | 权限不足，请联系管理员授权后重试! —  路由存在，当前普通账号无权限（管理员/开通后可用） |
| 182 | POST | `/bc/v2/idleRule/policy/list` | getIdlePolicyList | ✅ | InvalidArgument | invalid field RuleId: 规则id{rule_id}的值需要大于0 — 路由存在，缺必填参数被拒（传对参数即可用） |
| 183 | POST | `/bc/v2/idleRule/policy/save` | saveIdleExcludePolicy | 🔐 | PermissionDenied | 权限不足，请联系管理员授权后重试! —  路由存在，当前普通账号无权限（管理员/开通后可用） |
| 184 | POST | `/bc/v2/idleRule/save` | saveIdleRule | 🔐 | PermissionDenied | 权限不足，请联系管理员授权后重试! —  路由存在，当前普通账号无权限（管理员/开通后可用） |
| 185 | POST | `/bc/v1/monitor/getMultipleResourceMetrics` | getMultipleResourceMetrics | ✅ | InvalidArgument | 参数错误：start time must be less than end time, start: — 路由存在，缺必填参数被拒（传对参数即可用） |
| 186 | POST | `/bc/v1/monitor/getResourceMetrics` | getResourceMetric | ✅ | InvalidArgument | 参数错误：start time must be less than end time, start: — 路由存在，缺必填参数被拒（传对参数即可用） |
| 187 | POST | `/bc/v1/monitor/getResourceUsageRateGraph` | getResourceUsageRateGraph | ✅ | InvalidArgument | 参数错误：request params is invalid — 路由存在，缺必填参数被拒（传对参数即可用） |
| 188 | POST | `/bc/v1/monitor/getResourceUsageRateMetrics` | getResourceUsageRateMetrics | ✅ | InvalidArgument | 参数错误：request params is invalid — 路由存在，缺必填参数被拒（传对参数即可用） |
| 189 | POST | `/bc/v1/eip/create` | create | 🔐 | PermissionDenied | 权限不足，请联系管理员授权后重试! —  路由存在，当前普通账号无权限（管理员/开通后可用） |
| 190 | POST | `/bc/v1/eip/delete` | unsubscribe | 🔐 | PermissionDenied | 权限不足，请联系管理员授权后重试! —  路由存在，当前普通账号无权限（管理员/开通后可用） |
| 191 | GET | `/bc/v1/eip/get` | get | ✅ | InvalidArgument | invalid field Uuid: EIP的UUID{uuid}的长度需要大于0 — 路由存在，缺必填参数被拒（传对参数即可用） |
| 192 | GET | `/bc/v1/eip/list` | getList | ✅ | ok | 操作成功 — 空参调用即成功（数据可用） |
| 193 | GET | `/bc/v1/eip/regionInfo/list` | getRegionInfoList | ✅ | ok | 操作成功 — 空参调用即成功（数据可用） |
| 194 | POST | `/bc/v1/eip/updateClientIPs` | updateClientIPs | 🔐 | PermissionDenied | 权限不足，请联系管理员授权后重试! —  路由存在，当前普通账号无权限（管理员/开通后可用） |
| 195 | POST | `/bc/v1/predefClientIPs/getClientIP` | detectClientIP | ✅ | ok | 操作成功 — 空参调用即成功（数据可用） |
| 196 | POST | `/bc/v1/predefClientIPs/getPredefClientIPs` | getPredefClientIPs | ⚠️ | NotFound | 未找到project_space资源，请检查后重试 —  存在路由但资源不存在 / 功能未开通（带有效上下文可能可用 |
| 197 | POST | `/bc/v1/predefClientIPs/setPredefClientIPs` | setPredefClientIPs | ⚠️ | NotFound | 未找到project_space资源，请检查后重试 —  存在路由但资源不存在 / 功能未开通（带有效上下文可能可用 |
| 198 | POST | `/bc/v1/predefClientIPs/unsetPredefClientIPs` | closePredefClientIPs | ⚠️ | NotFound | 未找到project_space资源，请检查后重试 —  存在路由但资源不存在 / 功能未开通（带有效上下文可能可用 |
| 199 | POST | `/bc/v1/secret/create` | createEcrSecret | ✅ | InvalidArgument | invalid field Name: secret名称{name}的长度需要大于0 — 路由存在，缺必填参数被拒（传对参数即可用） |
| 200 | POST | `/bc/v1/secret/delete` | deleteEcrSecret | ✅ | InvalidArgument | invalid field Name: secret名称{name}的值需要大于0 — 路由存在，缺必填参数被拒（传对参数即可用） |
| 201 | GET | `/bc/v1/secret/ecr/check` | getEcrSecret | ✅ | InvalidArgument | invalid field QueueId: 队列id{queue_id}的值需要大于0 — 路由存在，缺必填参数被拒（传对参数即可用） |
| 202 | GET | `/bc/v1/secret/list` | getSecretList | ✅ | InvalidArgument | invalid field QueueId: 队列id{queue_id}的值需要大于0 — 路由存在，缺必填参数被拒（传对参数即可用） |
| 203 | GET | `/bc/v2/secret/ecr/check` | getEcrSecret | ✅ | InvalidArgument | invalid field QueueId: 队列id{queue_id}的值需要大于0 — 路由存在，缺必填参数被拒（传对参数即可用） |
| 204 | POST | `/bc/v1/packages/billing/download` | exportBilling | ⚠️ | NotFound | Not Found —  存在路由但资源不存在 / 功能未开通（带有效上下文可能可用 |
| 205 | POST | `/bc/v1/packages/billing/list` | getBillinglist | ✅ | ok | 操作成功 — 空参调用即成功（数据可用） |
| 206 | GET | `/bc/v1/packages/purchasable/list` | getPurchasableList | ✅ | ok | 操作成功 — 空参调用即成功（数据可用） |
| 207 | POST | `/bc/v1/packages/purchased/delete` | deletePackageOrder | ✅ | InvalidArgument | invalid field Id: 套餐包订单{id}值需要大于0 — 路由存在，缺必填参数被拒（传对参数即可用） |
| 208 | GET | `/bc/v1/packages/purchased/list` | getPurchasedList | ✅ | ok | 操作成功 — 空参调用即成功（数据可用） |
| 209 | POST | `/bc/v1/packages/purchased/updateAlias` | updateAlias | ✅ | InvalidArgument | invalid field Id: 套餐包订单{id}值需要大于0 — 路由存在，缺必填参数被拒（传对参数即可用） |
| 210 | POST | `/bc/v1/bc/ops/advert/list` | getAdvertList | ✅ | ok | 操作成功 — 空参调用即成功（数据可用） |
| 211 | POST | `/bc/v1/bc/ops/claimCustomer` | claimCustomer | ✅ | InvalidArgument | 参数错误：ClaimCustomer req.Uuid is empty — 路由存在，缺必填参数被拒（传对参数即可用） |
| 212 | POST | `/bc/v1/bc/ops/getGrayFeature` | getGrayFeature | ✅ | InvalidArgument | 参数错误：<no value> — 路由存在，缺必填参数被拒（传对参数即可用） |
| 213 | GET | `/bc/v1/bc/ops/region/list` | getRegionOptions | ✅ | ok | 操作成功 — 空参调用即成功（数据可用） |
| 214 | POST | `/bc/v1/bc/project/list` | getProjectList | ✅ | ok | 操作成功 — 空参调用即成功（数据可用） |
| 215 | POST | `/bc/v1/bcProxy/ops/dataset/typeList` | getDatasetTypeList | ✅ | ok | 操作成功 — 空参调用即成功（数据可用） |
| 216 | POST | `/bc/v1/bcProxy/ops/dict/list` | getDictList | ❓ | 100002 | 参数错误 ,error: type mismatch for field dictTypeCodeL — de=100002 |
| 217 | POST | `/bc/v1/bcProxy/ops/displayItem/list` | getImageWallAttr | ✅ | ok | 操作成功 — 空参调用即成功（数据可用） |
| 218 | GET | `/bc/v1/bcProxy/ops/eventlog/list` | getOperationLogs | ✅ | ok | 操作成功 — 空参调用即成功（数据可用） |
| 219 | POST | `/bc/v1/bcProxy/ops/imagewall/detail` | getImageDetail | ❓ | 100002 | 参数错误 ,field id is not set — de=100002 |
| 220 | POST | `/bc/v1/bcProxy/ops/imagewall/list` | getImageWallList | ✅ | ok | 操作成功 — 空参调用即成功（数据可用） |
| 221 | POST | `/bc/v1/bcProxy/ops/jobTemplate/list` | getTaskTemplateList | ✅ | ok | 操作成功 — 空参调用即成功（数据可用） |
| 222 | POST | `/bc/v1/bcProxy/ops/productSpec/availableList` | getSpecAvailableList | ✅ | ok | 操作成功 — 空参调用即成功（数据可用） |
| 223 | POST | `/bc/v1/bcProxy/ops/region/user/list` | getRegionList | ✅ | ok | 操作成功 — 空参调用即成功（数据可用） |
| 224 | GET | `/bc/v1/util/baidu/accessToken` | getAccessToken | ⚠️ | Internal | GenAccessToken error: HttpStatusCode is not equal  —  存在路由，服务端处理异常（多为缺参导致内部错误） |
| 225 | POST | `/bc/v2/bc/ops/region/filter` | getRegionListNew | ✅ | InvalidArgument | invalid field SpecType: 规格类型{spec_type}值需要大于0 — 路由存在，缺必填参数被拒（传对参数即可用） |
| 226 | GET | `/bc/v2/bc/ops/region/list` | getRegionOptions | ✅ | ok | 操作成功 — 空参调用即成功（数据可用） |
| 227 | GET | `https://esx.ctyun.cn/v1/auth/login?rd=%2Fbc%2Foverview` |  | ❓ | http:302 | — |
| 228 | GET | `https://esx.ctyun.cn/xrops/auth-srv/tenant/v1/webResource/listAuthorized` |  | ❓ | http:404 | — |
| 229 | GET | `https://www.ctyun.cn/gw/auth/Current` |  | ❓ | core.ok | de=core.ok |
| 230 | GET | `https://www.ctyun.cn/gw/v1/portal/menu/GetTree?productId=18391` |  | ❓ | clnt.e2000 | de=clnt.e2000 |
| 231 | POST | `/bc/v1/project_space/attach_project_to_group` | postAttachProjectToGroup | 🔐 | PermissionDenied | 权限不足，请联系管理员授权后重试! —  路由存在，当前普通账号无权限（管理员/开通后可用） |
| 232 | POST | `/bc/v1/project_space/attach_user_to_group` | postAttachUserToGroup | 🔐 | PermissionDenied | 权限不足，请联系管理员授权后重试! —  路由存在，当前普通账号无权限（管理员/开通后可用） |
| 233 | POST | `/bc/v1/project_space/check_delegate` | checkDelegate | ✅ | ok | 操作成功 — 空参调用即成功（数据可用） |
| 234 | POST | `/bc/v1/project_space/create` | createProjectSpace | 🔐 | PermissionDenied | 权限不足，请联系管理员授权后重试! —  路由存在，当前普通账号无权限（管理员/开通后可用） |
| 235 | POST | `/bc/v1/project_space/create_delegate_role` | createDelegateRole | ⚠️ | Internal | 项目空间请求CTIAM失败：[requestID: 6a4763d1-448c-4881-9bac- —  存在路由，服务端处理异常（多为缺参导致内部错误） |
| 236 | POST | `/bc/v1/project_space/delete` | deleteProjectSpace | 🔐 | PermissionDenied | 权限不足，请联系管理员授权后重试! —  路由存在，当前普通账号无权限（管理员/开通后可用） |
| 237 | POST | `/bc/v1/project_space/delete_project_bill_record` | deleteFile | 🔐 | PermissionDenied | 没有对应项目权限，请联系管理员添加 —  路由存在，当前普通账号无权限（管理员/开通后可用） |
| 238 | POST | `/bc/v1/project_space/download_user_bill_detail` | exportBilling, downloadUserBillDetail | ❓ | http:500 | — |
| 239 | POST | `/bc/v1/project_space/edit` | editProjectSpace | 🔐 | PermissionDenied | 权限不足，请联系管理员授权后重试! —  路由存在，当前普通账号无权限（管理员/开通后可用） |
| 240 | POST | `/bc/v1/project_space/export_user_bill_detail` | exportUserBillDetail | ✅ | InvalidArgument | 参数错误：文件导出仅支持xlsx和csv格式 — 路由存在，缺必填参数被拒（传对参数即可用） |
| 241 | GET | `/bc/v1/project_space/get` | getProjectSpace | ✅ | InvalidArgument | invalid field SpaceId: 项目空间ID{space_id}值需要大于0 — 路由存在，缺必填参数被拒（传对参数即可用） |
| 242 | GET | `/bc/v1/project_space/get_all_users` | getProjectUsers | ✅ | InvalidArgument | invalid field ProjectId: 企业项目{project_id}的长度需要大于0 — 路由存在，缺必填参数被拒（传对参数即可用） |
| 243 | GET | `/bc/v1/project_space/getConfig` | getConfig | ✅ | InvalidArgument | invalid field ProjectId: 企业项目ID{project_id}的长度需要大于 — 路由存在，缺必填参数被拒（传对参数即可用） |
| 244 | POST | `/bc/v1/project_space/GetUserExclusivePoolGpuSpecEnum ` | getExclusivePoolGpuSpecEnum | ❓ | http:-1 | — |
| 245 | POST | `/bc/v1/project_space/getUserExclusivePoolQuota` | getUserExclusivePoolQuota | ✅ | InvalidArgument | invalid field ProjectId: 企业项目ID{project_id}的长度需要大于 — 路由存在，缺必填参数被拒（传对参数即可用） |
| 246 | POST | `/bc/v1/project_space/group_users` | getGroupUsers | ✅ | InvalidArgument | 参数错误：groupID is empty — 路由存在，缺必填参数被拒（传对参数即可用） |
| 247 | POST | `/bc/v1/project_space/ide/duration` | updateAutoStop | 🔐 | PermissionDenied | 权限不足，请联系管理员授权后重试! —  路由存在，当前普通账号无权限（管理员/开通后可用） |
| 248 | GET | `/bc/v1/project_space/list` | getProjectSpacelist | ✅ | ok | 操作成功 — 空参调用即成功（数据可用） |
| 249 | POST | `/bc/v1/project_space/list_project_bill_record` | getProjectBillList | 🔐 | PermissionDenied | 没有对应项目权限，请联系管理员添加 —  路由存在，当前普通账号无权限（管理员/开通后可用） |
| 250 | GET | `/bc/v1/project_space/list_project_group` | getProjectGroup | ✅ | InvalidArgument | invalid field ProjectId: 企业项目ID{project_id}的长度需要大于 — 路由存在，缺必填参数被拒（传对参数即可用） |
| 251 | GET | `/bc/v1/project_space/list_un_sync_project` | checkProjectSpaceSync | ✅ | ok | 操作成功 — 空参调用即成功（数据可用） |
| 252 | POST | `/bc/v1/project_space/list_user_bill_detail` | getUserBillList | ✅ | InvalidArgument | invalid field AccountPeriod: 账期{account_period}的长度 — 路由存在，缺必填参数被拒（传对参数即可用） |
| 253 | GET | `/bc/v1/project_space/project_users` | getProjectUserList | ✅ | InvalidArgument | invalid field ProjectId: 企业项目ID{project_id}的长度需要大于 — 路由存在，缺必填参数被拒（传对参数即可用） |
| 254 | POST | `/bc/v1/project_space/query_budget_trend_metrics` | getComsumeTrend | ✅ | InvalidArgument | invalid field ProjectId: 企业项目ID{project_id}的长度需要大于 — 路由存在，缺必填参数被拒（传对参数即可用） |
| 255 | POST | `/bc/v1/project_space/queryProjectUsageStatistics` | queryProjectUsageStatistics | ✅ | InvalidArgument | 参数错误：起始时间或起始时间输入不合法, startTime: 0, endTime: 0 — 路由存在，缺必填参数被拒（传对参数即可用） |
| 256 | POST | `/bc/v1/project_space/queryUserUsageStatistics` | queryUserUsageStatistics | ✅ | InvalidArgument | 参数错误：起始时间或起始时间输入不合法, startTime: 0, endTime: 0 — 路由存在，缺必填参数被拒（传对参数即可用） |
| 257 | POST | `/bc/v1/project_space/remove_project_from_group` | postRemoveProjectFromGroup | 🔐 | PermissionDenied | 权限不足，请联系管理员授权后重试! —  路由存在，当前普通账号无权限（管理员/开通后可用） |
| 258 | POST | `/bc/v1/project_space/remove_user_out_group` | postRemoveUserOutGroup | 🔐 | PermissionDenied | 权限不足，请联系管理员授权后重试! —  路由存在，当前普通账号无权限（管理员/开通后可用） |
| 259 | POST | `/bc/v1/project_space/set_user_policy` | setUserPolicy | 🔐 | PermissionDenied | 权限不足，请联系管理员授权后重试! —  路由存在，当前普通账号无权限（管理员/开通后可用） |
| 260 | POST | `/bc/v1/project_space/setUserExclusivePoolQuota` | setUserExclusivePoolQuota | 🔐 | PermissionDenied | 权限不足，请联系管理员授权后重试! —  路由存在，当前普通账号无权限（管理员/开通后可用） |
| 261 | GET | `/bc/v1/project_space/user_groups` | getUserGroups | ✅ | ok | 操作成功 — 空参调用即成功（数据可用） |
| 262 | GET | `/bc/v1/project_space/users` | getUserList | ✅ | ok | 操作成功 — 空参调用即成功（数据可用） |
| 263 | POST | `/bc/v1/createExclusivePool` | create | 🔐 | PermissionDenied | 权限不足，请联系管理员授权后重试! —  路由存在，当前普通账号无权限（管理员/开通后可用） |
| 264 | POST | `/bc/v1/exclusivePool/createProjectDeserveQuota` | createProjectQuota | 🔐 | PermissionDenied | 权限不足，请联系管理员授权后重试! —  路由存在，当前普通账号无权限（管理员/开通后可用） |
| 265 | POST | `/bc/v1/exclusivePool/deleteExclusivePool` | deleteExclusivePool | 🔐 | PermissionDenied | 权限不足，请联系管理员授权后重试! —  路由存在，当前普通账号无权限（管理员/开通后可用） |
| 266 | POST | `/bc/v1/exclusivePool/describeExclusivePoolDetail` | getDetail | 🔐 | PermissionDenied | 权限不足，请联系管理员授权后重试! —  路由存在，当前普通账号无权限（管理员/开通后可用） |
| 267 | POST | `/bc/v1/exclusivePool/describeExclusivePoolUsage` | getResourceUsage | 🔐 | PermissionDenied | 权限不足，请联系管理员授权后重试! —  路由存在，当前普通账号无权限（管理员/开通后可用） |
| 268 | POST | `/bc/v1/exclusivePool/describeExclusivePoolWorkload` | getWorkload | ✅ | InvalidArgument | invalid field ExclusivePoolUuid: 专属资源池uuid{uuid}长度 — 路由存在，缺必填参数被拒（传对参数即可用） |
| 269 | POST | `/bc/v1/exclusivePool/describeMultiExclusivePools` | getList | ✅ | ok | 操作成功 — 空参调用即成功（数据可用） |
| 270 | POST | `/bc/v1/exclusivePool/describeProjectDeserveQuota` | getProjectExclusivePoolQuota | 🔐 | PermissionDenied | 权限不足，请联系管理员授权后重试! —  路由存在，当前普通账号无权限（管理员/开通后可用） |
| 271 | POST | `/bc/v1/exclusivePool/getExclusivePoolQuota` | getSharedExclusivePoolQuota, getExclusivePoolQuota | 🔐 | PermissionDenied | 权限不足，请联系管理员授权后重试! —  路由存在，当前普通账号无权限（管理员/开通后可用） |
| 272 | POST | `/bc/v1/exclusivePool/listOrderItems` | listOrderItems | 🔐 | PermissionDenied | 权限不足，请联系管理员授权后重试! —  路由存在，当前普通账号无权限（管理员/开通后可用） |
| 273 | POST | `/bc/v1/exclusivePool/listProjectDeserveQuota` | getProjectQuotaList | 🔐 | PermissionDenied | 权限不足，请联系管理员授权后重试! —  路由存在，当前普通账号无权限（管理员/开通后可用） |
| 274 | POST | `/bc/v1/exclusivePool/purchaseOrderItem` | purchaseOrderItem | 🔐 | PermissionDenied | 权限不足，请联系管理员授权后重试! —  路由存在，当前普通账号无权限（管理员/开通后可用） |
| 275 | POST | `/bc/v1/exclusivePool/refundOrderItem` | refundOrderItem | 🔐 | PermissionDenied | 权限不足，请联系管理员授权后重试! —  路由存在，当前普通账号无权限（管理员/开通后可用） |
| 276 | POST | `/bc/v1/exclusivePool/renewOrderItem` | renewOrderItem | 🔐 | PermissionDenied | 权限不足，请联系管理员授权后重试! —  路由存在，当前普通账号无权限（管理员/开通后可用） |
| 277 | POST | `/bc/v1/exclusivePool/updateProjectDeserveQuota` | updateProjectDeserveQuota | 🔐 | PermissionDenied | 权限不足，请联系管理员授权后重试! —  路由存在，当前普通账号无权限（管理员/开通后可用） |
| 278 | POST | `/bc/v1/queue/check/share` | checkQueueQuota | ✅ | InvalidArgument | invalid field QueueId: 队列id{queue_id}的值需要大于0 — 路由存在，缺必填参数被拒（传对参数即可用） |
| 279 | POST | `/bc/v1/queue/create` | createQueue | 🔐 | PermissionDenied | 权限不足，请联系管理员授权后重试! —  路由存在，当前普通账号无权限（管理员/开通后可用） |
| 280 | POST | `/bc/v1/queue/delete` | deleteQueue | 🔐 | PermissionDenied | 权限不足，请联系管理员授权后重试! —  路由存在，当前普通账号无权限（管理员/开通后可用） |
| 281 | POST | `/bc/v1/queue/delete/batch` | batchDeleteQueue | 🔐 | PermissionDenied | 权限不足，请联系管理员授权后重试! —  路由存在，当前普通账号无权限（管理员/开通后可用） |
| 282 | GET | `/bc/v1/queue/get` | getQueueInfo | ✅ | InvalidArgument | invalid field QueueId: 队列id{queue_id}的值需要大于0 — 路由存在，缺必填参数被拒（传对参数即可用） |
| 283 | GET | `/bc/v1/queue/list` | getList | ✅ | ok | 操作成功 — 空参调用即成功（数据可用） |
| 284 | POST | `/bc/v1/queue/update` | updateQueue | 🔐 | PermissionDenied | 权限不足，请联系管理员授权后重试! —  路由存在，当前普通账号无权限（管理员/开通后可用） |
| 285 | POST | `/bc/v1/resource/batchCheckQuota` | batchCheckQuota | ⚠️ | NotFound | Not Found —  存在路由但资源不存在 / 功能未开通（带有效上下文可能可用 |
| 286 | GET | `/bc/v1/resource/billing/access` | billingAccess | ✅ | ok | 操作成功 — 空参调用即成功（数据可用） |
| 287 | GET | `/bc/v1/resource/eip/inquiry` | inquiry | ⚠️ | Unknown | EIPInquiry CycleType[0] is not supported —  存在路由，服务端语义错误（参数值不合法） |
| 288 | GET | `/bc/v1/resource/getSpecLocalStorageInventory` | getSpecLocalStorageInventory | ⚠️ | Internal | 查询失败，请联系运营人员或稍后重试。 —  存在路由，服务端处理异常（多为缺参导致内部错误） |
| 289 | POST | `/bc/v1/resource/pool/az/init` | initPoolAz | 🔐 | PermissionDenied | 当前租户无该可用区权限，请联系客户经理申请开通。 —  路由存在，当前普通账号无权限（管理员/开通后可用） |
| 290 | GET | `/bc/v1/resource/pool/az/init/list` | getInitProcess | ✅ | ok | 操作成功 — 空参调用即成功（数据可用） |
| 291 | POST | `/bc/v1/resource/pool/create` | createProprietaryResourcePool | 🔐 | PermissionDenied | 权限不足，请联系管理员授权后重试! —  路由存在，当前普通账号无权限（管理员/开通后可用） |
| 292 | POST | `/bc/v1/resource/pool/delete` | deleteProprietaryResourcePool | 🔐 | PermissionDenied | 权限不足，请联系管理员授权后重试! —  路由存在，当前普通账号无权限（管理员/开通后可用） |
| 293 | POST | `/bc/v1/resource/pool/delete/batch` | batchDeleteProprietaryResourcePool | 🔐 | PermissionDenied | 权限不足，请联系管理员授权后重试! —  路由存在，当前普通账号无权限（管理员/开通后可用） |
| 294 | GET | `/bc/v1/resource/pool/detail` | getProprietaryResourcePoolInfo | ✅ | InvalidArgument | invalid field ResourceId: 资源池id{resource_id}的值需要大于 — 路由存在，缺必填参数被拒（传对参数即可用） |
| 295 | POST | `/bc/v1/resource/pool/edit` | getProprietaryResourcePoolEditInfo | ✅ | InvalidArgument | invalid field ResourceId: 资源池id{resource_id}的值需要大于 — 路由存在，缺必填参数被拒（传对参数即可用） |
| 296 | GET | `/bc/v1/resource/pool/init/info` | getInitLogs | ✅ | InvalidArgument | invalid field ResourceId: 资源池id{resource_id}的值需要大于 — 路由存在，缺必填参数被拒（传对参数即可用） |
| 297 | GET | `/bc/v1/resource/pool/inquiry` | getResourcePoolInquiry | ⚠️ | NotFound | 查询失败，请联系运营人员或稍后重试。 —  存在路由但资源不存在 / 功能未开通（带有效上下文可能可用 |
| 298 | GET | `/bc/v1/resource/pool/list` | getProprietaryResourcePoolList | ✅ | ok | 操作成功 — 空参调用即成功（数据可用） |
| 299 | GET | `/bc/v1/resource/pool/list/weight` | getProprietaryResourcePoolWeightList | ✅ | ok | 操作成功 — 空参调用即成功（数据可用） |
| 300 | GET | `/bc/v1/resource/pool/oneclick` | oneClickCreateResourcePool | ✅ | ok | 操作成功 — 空参调用即成功（数据可用） |
| 301 | GET | `/bc/v1/resource/pool/spec/list` | getResourcePoolSpecList | ✅ | InvalidArgument | invalid field ResourceId: 资源池id{resource_id}的值需要大于 — 路由存在，缺必填参数被拒（传对参数即可用） |
| 302 | GET | `/bc/v1/resource/pool/spec/sellout` | checkSellout | ✅ | ok | 操作成功 — 空参调用即成功（数据可用） |
| 303 | POST | `/bc/v1/resource/pool/update` | updateProprietaryResourcePool | ✅ | InvalidArgument | invalid field ResourceId: 资源池id{resource_id}的值需要大于 — 路由存在，缺必填参数被拒（传对参数即可用） |
| 304 | POST | `/bc/v1/resource/refund/package` | unsubscribePackage | ⚠️ | Internal | 查询失败，请联系运营人员或稍后重试。 —  存在路由，服务端处理异常（多为缺参导致内部错误） |
| 305 | GET | `/bc/v1/resource/research/storage/inquiry` | getAssistStorageInquiry | ✅ | ok | 操作成功 — 空参调用即成功（数据可用） |
| 306 | GET | `/bc/v1/resource/storage/spec/list` | getStorageSpecList | ⚠️ | NotFound | 未找到ResourcePool资源，请检查后重试 —  存在路由但资源不存在 / 功能未开通（带有效上下文可能可用 |
| 307 | POST | `/bc/v1/resource/submit/nonOrder/open` | submitBCOrder | 🔐 | PermissionDenied | 只能主账号开通，子账号无法开通，请切换主账号操作 —  路由存在，当前普通账号无权限（管理员/开通后可用） |
| 308 | POST | `/bc/v1/resource/submit/package` | submitPackage | 🔐 | Unauthenticated | 存在授权问题,请联系运营人员处理。 —  需要额外授权（子账号/运营审批） |
| 309 | POST | `/bc/v1/resource/submit/trial_order` | submitTrialBCOrder | 🔐 | PermissionDenied | 只能主账号开通，子账号无法开通，请切换主账号操作 —  路由存在，当前普通账号无权限（管理员/开通后可用） |
| 310 | POST | `/bc/v1/resource/submit/trialPackage` | submitTrialPackage | 🔐 | Unauthenticated | 存在授权问题,请联系运营人员处理。 —  需要额外授权（子账号/运营审批） |
| 311 | GET | `/bc/v1/resource/summary` | getResourcePoolSummaryInfo | ✅ | ok | 操作成功 — 空参调用即成功（数据可用） |
| 312 | GET | `/bc/v1/resource/welfare` | getWelfare | ✅ | ok | 操作成功 — 空参调用即成功（数据可用） |
| 313 | GET | `/bc/v1/scheduling/action/list` | getSchedulingActionList | ✅ | ok | 操作成功 — 空参调用即成功（数据可用） |
| 314 | POST | `/bc/v1/scheduling/create` | createSchedulingStategy | ✅ | InvalidArgument | invalid field Name: 调度策略名称{name}的长度需要大于0 — 路由存在，缺必填参数被拒（传对参数即可用） |
| 315 | POST | `/bc/v1/scheduling/delete` | deleteSchedulingStategy | ✅ | InvalidArgument | invalid field Id: 调度策略id{id}的值需要大于0 — 路由存在，缺必填参数被拒（传对参数即可用） |
| 316 | GET | `/bc/v1/scheduling/get` | getSchedulingInfo | ✅ | InvalidArgument | invalid field Id: 调度策略id{id}的值需要大于0 — 路由存在，缺必填参数被拒（传对参数即可用） |
| 317 | GET | `/bc/v1/scheduling/list` | getSchedulingList | ✅ | ok | 操作成功 — 空参调用即成功（数据可用） |
| 318 | GET | `/bc/v1/scheduling/plugin/list` | getSchedulingPluginList | ✅ | ok | 操作成功 — 空参调用即成功（数据可用） |
| 319 | POST | `/bc/v1/scheduling/update` | updateSchedulingStategy | ✅ | InvalidArgument | invalid field Id: 调度策略id{id}的值需要大于0 — 路由存在，缺必填参数被拒（传对参数即可用） |
| 320 | POST | `/bc/v2/resource/compute/spec/enum` | getSpecTypeList | ✅ | ok | 操作成功 — 空参调用即成功（数据可用） |
| 321 | POST | `/bc/v2/resource/compute/spec/list` | getComputeSpecList | ⚠️ | Internal | 查询失败，请联系运营人员或稍后重试。 —  存在路由，服务端处理异常（多为缺参导致内部错误） |
| 322 | POST | `/bc/v2/resource/enumGpuModels` | enumGpuModels | ✅ | ok | 操作成功 — 空参调用即成功（数据可用） |
| 323 | POST | `/bc/v2/resource/listGpuSpecs` | listGpuSpecs | ✅ | ok | 操作成功 — 空参调用即成功（数据可用） |
| 324 | POST | `/bc/v2/resource/pool/az/init` | initPoolAz | ⚠️ | FailedPrecondition | 可用区已初始化，请勿重复操作 —  前置条件不满足（功能已开通，状态不允许） |
| 325 | GET | `/bc/v2/resource/pool/az/init/list` | getInitProcess | ✅ | ok | 操作成功 — 空参调用即成功（数据可用） |
| 326 | GET | `/bc/v2/resource/pool/oneclick` | initEnv | ✅ | ok | 操作成功 — 空参调用即成功（数据可用） |
| 327 | GET | `/bc/v2/resource/pool/spec/list` | getResourcePoolSpecList | ✅ | InvalidArgument | invalid field ResourceId: 资源池id{resource_id}的值需要大于 — 路由存在，缺必填参数被拒（传对参数即可用） |
| 328 | GET | `/bc/v2/resource/pool/spec/sellout` | checkSellout | ✅ | ok | 操作成功 — 空参调用即成功（数据可用） |
| 329 | GET | `/bc/v2/resource/pool/task/list` | getInitEnvFlow | ✅ | ok | 操作成功 — 空参调用即成功（数据可用） |
| 330 | GET | `/bc/v2/resource/storage/spec/list` | getStorageSpecList | ⚠️ | NotFound | 未找到ResourcePool资源，请检查后重试 —  存在路由但资源不存在 / 功能未开通（带有效上下文可能可用 |
| 331 | POST | `/bc/v1/storage/network/create` | creatNetwork | ✅ | InvalidArgument | invalid field ResourceId: 资源池id{resource_id}的值需要大于 — 路由存在，缺必填参数被拒（传对参数即可用） |
| 332 | GET | `/bc/v1/storage/network/list` | getNetworkList | ✅ | ok | 操作成功 — 空参调用即成功（数据可用） |
| 333 | POST | `/bc/v1/storage/public/dataset/list` | getPublicDatasetList | ✅ | ok | 操作成功 — 空参调用即成功（数据可用） |
| 334 | POST | `/bc/v1/storage/pvc/create` | createPVC | ✅ | InvalidArgument | invalid field ResourceId: 资源池id{resource_id}的值需要大于 — 路由存在，缺必填参数被拒（传对参数即可用） |
| 335 | GET | `/bc/v1/storage/pvc/delete` | deletePVC | ✅ | InvalidArgument | invalid field StoragePvcId: 数据集id{storage_pvc_id}的 — 路由存在，缺必填参数被拒（传对参数即可用） |
| 336 | GET | `/bc/v1/storage/pvc/list` | getPVCList | ✅ | InvalidArgument | 参数错误：resourceId and queueId can't be empty in the  — 路由存在，缺必填参数被拒（传对参数即可用） |
| 337 | POST | `/bc/v1/storage/pvc/resize` | resizePVC | ✅ | InvalidArgument | invalid field PvcId: 数据集id值{pvc_id}需要大于0 — 路由存在，缺必填参数被拒（传对参数即可用） |
| 338 | GET | `/bc/v1/storage/region/list` | getClusterRegionList | ✅ | InvalidArgument | invalid field QueryType: 查询类型{query_type}的值需要大于0 — 路由存在，缺必填参数被拒（传对参数即可用） |
| 339 | POST | `/bc/v1/storage/resource/create` | createStorageResource | ✅ | InvalidArgument | invalid field ResourceId: 资源池id{resource_id}的值需要大于 — 路由存在，缺必填参数被拒（传对参数即可用） |
| 340 | GET | `/bc/v1/storage/resource/delete` | deleteStorageResource | ✅ | InvalidArgument | invalid field StorageResourceId: 存储源id值{storage_id — 路由存在，缺必填参数被拒（传对参数即可用） |
| 341 | GET | `/bc/v1/storage/resource/get` | getStorageDetail | ✅ | InvalidArgument | invalid field StorageId: 存储源id值{storage_id}需要大于0 — 路由存在，缺必填参数被拒（传对参数即可用） |
| 342 | GET | `/bc/v1/storage/resource/list` | getStorageSourceList | ✅ | ok | 操作成功 — 空参调用即成功（数据可用） |
| 343 | POST | `/bc/v1/storage/resource/resize` | expandStorage | ✅ | InvalidArgument | invalid field StorageId: 存储源id值{storage_id}需要大于0 — 路由存在，缺必填参数被拒（传对参数即可用） |
| 344 | POST | `/bc/v1/storage/sfs/precheck` | SFSpreCheck | ✅ | InvalidArgument | invalid field ResourceId: 资源池id{resource_id}的值需要大于 — 路由存在，缺必填参数被拒（传对参数即可用） |
| 345 | POST | `/bc/v2/storage/createDataSyncTask` | createMigrationTask | ✅ | InvalidArgument | 参数错误：名称不符合规则 — 路由存在，缺必填参数被拒（传对参数即可用） |
| 346 | POST | `/bc/v2/storage/deleteDataSyncTask` | deleteMigrationTask | ✅ | InvalidArgument | invalid field TaskId: 同步任务id{task_id}的值需要大于0 — 路由存在，缺必填参数被拒（传对参数即可用） |
| 347 | POST | `/bc/v2/storage/describeDataSyncTask` | getMigrationTasInfo | ✅ | InvalidArgument | invalid field TaskId: 同步任务ID{task_id}的值需要大于0 — 路由存在，缺必填参数被拒（传对参数即可用） |
| 348 | POST | `/bc/v2/storage/getDataSyncConfig` | getMigrationQuota | ✅ | ok | 操作成功 — 空参调用即成功（数据可用） |
| 349 | POST | `/bc/v2/storage/listDataSyncTasks` | getMigrationTaskList | 🔐 | PermissionDenied | 没有对应项目权限，请联系管理员添加 —  路由存在，当前普通账号无权限（管理员/开通后可用） |
| 350 | POST | `/bc/v2/storage/listLocalStorage` | getMigrationDevList | ✅ | ok | 操作成功 — 空参调用即成功（数据可用） |
| 351 | POST | `/bc/v2/storage/pvc/create` | createPVC | 🔐 | PermissionDenied | 权限不足，请联系管理员授权后重试! —  路由存在，当前普通账号无权限（管理员/开通后可用） |
| 352 | GET | `/bc/v2/storage/pvc/delete` | deletePVC | 🔐 | PermissionDenied | 权限不足，请联系管理员授权后重试! —  路由存在，当前普通账号无权限（管理员/开通后可用） |
| 353 | GET | `/bc/v2/storage/pvc/list` | getPVCList | 🔐 | PermissionDenied | 权限不足，请联系管理员授权后重试! —  路由存在，当前普通账号无权限（管理员/开通后可用） |
| 354 | POST | `/bc/v2/storage/research/create` | createAssist | 🔐 | PermissionDenied | 权限不足，请联系管理员授权后重试! —  路由存在，当前普通账号无权限（管理员/开通后可用） |
| 355 | POST | `/bc/v2/storage/research/delete` | deleteAssist | 🔐 | PermissionDenied | 权限不足，请联系管理员授权后重试! —  路由存在，当前普通账号无权限（管理员/开通后可用） |
| 356 | GET | `/bc/v2/storage/research/describe` | getAssistStorageDetail | ✅ | InvalidArgument | invalid field StorageId: 科研存储ID{storage_id}的值需要大于0 — 路由存在，缺必填参数被拒（传对参数即可用） |
| 357 | POST | `/bc/v2/storage/research/describeBindingResource` | getBindingResourceList | ✅ | InvalidArgument | invalid field ResearchStorageId: 科研文件id{research_s — 路由存在，缺必填参数被拒（传对参数即可用） |
| 358 | GET | `/bc/v2/storage/research/list` | getAssistList | ✅ | ok | 操作成功 — 空参调用即成功（数据可用） |
| 359 | POST | `/bc/v2/storage/research/releaseStorageBinding` | releaseStorageBinding | 🔐 | PermissionDenied | 权限不足，请联系管理员授权后重试! —  路由存在，当前普通账号无权限（管理员/开通后可用） |
| 360 | POST | `/bc/v2/storage/research/renew` | renewAssist | ✅ | InvalidArgument | invalid field StorageId: 科研存储ID{storage_id}的值需要大于0 — 路由存在，缺必填参数被拒（传对参数即可用） |
| 361 | POST | `/bc/v2/storage/research/resize` | expandStorage | 🔐 | PermissionDenied | 权限不足，请联系管理员授权后重试! —  路由存在，当前普通账号无权限（管理员/开通后可用） |
| 362 | POST | `/bc/v2/storage/research/space/create` | createExclusiveSpace | ⚠️ | Unknown | record not found —  存在路由，服务端语义错误（参数值不合法） |
| 363 | POST | `/bc/v2/storage/research/space/delete` | deleteExclusiveSpace | ✅ | InvalidArgument | invalid field SpaceId: 空间id{space_id}的值需要大于0 — 路由存在，缺必填参数被拒（传对参数即可用） |
| 364 | POST | `/bc/v2/storage/research/space/edit` | updateExclusiveSpace | ✅ | InvalidArgument | invalid field SpaceId: 空间id{space_id}的值需要大于0 — 路由存在，缺必填参数被拒（传对参数即可用） |
| 365 | GET | `/bc/v2/storage/research/space/list` | getExclusiveSpaces | ⚠️ | Unknown | record not found —  存在路由，服务端语义错误（参数值不合法） |
| 366 | GET | `/bc/v2/storage/research/spec/list` | getAssistSpecList | ⚠️ | NotFound | 未找到ResourcePool资源，请检查后重试 —  存在路由但资源不存在 / 功能未开通（带有效上下文可能可用 |
| 367 | GET | `/bc/v2/storage/research/summary` | getAssistStorageSummary | ✅ | InvalidArgument | invalid field RegionId: 可用区ID{region_id}的值需要大于0 — 路由存在，缺必填参数被拒（传对参数即可用） |
| 368 | POST | `/bc/v2/storage/research/upgradeFSServer` | upgradeFSServer | ✅ | InvalidArgument | invalid field StorageId: 科研文件id{storage_id}的值需要大于0 — 路由存在，缺必填参数被拒（传对参数即可用） |
| 369 | POST | `/bc/v2/storage/stopDataSyncTask` | stopMigrationTask | ✅ | InvalidArgument | invalid field TaskId: 同步任务id{task_id}的值需要大于0 — 路由存在，缺必填参数被拒（传对参数即可用） |
