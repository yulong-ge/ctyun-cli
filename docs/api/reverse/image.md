# 镜像域 — 21 个端点

镜像分**公共框架镜像**（平台提供）、**私有镜像**（user_image，含开发机 saveImage 保存的）、**分享镜像**（他人分享给我）。走 `/bc/v1`（v2 对普通账号 PermissionDenied）。

## 端点总表

| 方法 | 端点 | SPA 服务函数 | 实测 | 说明 |
|---|---|---|---|---|
| GET | `/bc/v1/ide/image/list` | getImageList | ✅ ok | 镜像查询（核心） |
| GET | `/bc/v1/ide/user_image/list` | getUserImageList | ✅ ok | 私有镜像列表 |
| POST | `/bc/v1/ide/user_image/delete` | deleteUserImage | ✅ InvalidArgument | 私有镜像删除（id） |
| POST | `/bc/v1/ide/saveImage` | saveDevelopEnvImage | ✅ InvalidArgument | 开发机 → 私有镜像 |
| POST | `/bc/v1/ide/stopSavingImage` | stopSavingDevelopEnvImage | ✅ InvalidArgument | 中止保存 |
| GET | `/bc/v1/ide/image/pushProgress` | getImagePushProgress | ✅ InvalidArgument | 保存进度（userImageId） |
| GET | `/bc/v1/ide/image/recommendedSpec` | getImageSpec | ✅ InvalidArgument | 镜像推荐规格（imageId） |
| POST | `/bc/v1/ide/image/featLabels/list` | getFeatLabels | ✅ ok | 特性标签全集 |
| POST | `/bc/v1/ide/image/featLabels/get` | getFeatLabelsById | ✅ InvalidArgument | 单镜像特性（imageId） |
| POST | `/bc/v1/ide/image/share` | shareImage | ✅ InvalidArgument | 分享（shareUserId） |
| POST | `/bc/v1/ide/image/unshare` | unshareImage | ✅ InvalidArgument | 取消分享（shareImageId） |
| GET | `/bc/v1/ide/image/shareRecord` | imageShareRecord | ✅ ok | 我的分享记录 |
| GET | `/bc/v1/ide/image/shareImage/list` | imageShareImageList | ✅ ok | 分享给我的镜像 |
| GET | `/bc/v1/ide/overview/recommendedImage/list` | getRecommendedImageList | ✅ ok | 总览推荐 |
| POST | `/bc/v1/bcProxy/ops/imagewall/list` | getImageWallList | ✅ ok | 镜像墙（运营） |
| POST | `/bc/v1/bcProxy/ops/imagewall/detail` | getImageDetail | ⚠️ 100002 | `field id is not set` |
| （v2 同路径） | `image/list`、`user_image/*`、`saveImage`、`shareImage/list`、`image/list` 等 | — | 🔐 PermissionDenied | v2 镜像域普通账号不可用 |
| POST | `/bc/v2/ide/image/featLabels/list` / `share` / `unshare` | — | ✅ InvalidArgument | v2 例外：标签与分享可用 |
| GET | `/bc/v2/ide/image/shareRecord` | imageShareRecord | ✅ ok | v2 例外 |

## GET /bc/v1/ide/image/list — 镜像查询

query（实测有效组合）：

| 参数 | 值 | 说明 |
|---|---|---|
| `arch` | `1` / `2` | 架构（来自 region.arch：1=x86） |
| `productType` | `1` | 产品类型：1=开发机 |
| `imageType` | `0` / 其他 | 0=公共框架镜像（CLI 按 `Number(imageType)===0` 筛公共镜像） |
| `paging.page` / `paging.perPage` | `1` / `999` | |

响应 `images[]` 元素：`{imageId, name, imageAddr, imageType, ...}`。实测镜像名如 `jupyter-vllm0.26.0-openai-cuda13.0-ubuntu22.04`（名称即软件栈清单）。

## 保存开发机为镜像的流程

1. `POST /ide/saveImage` body `{id: <ideId>, name, description, ...}` → 生成 user_image 记录
2. 轮询 `GET /ide/image/pushProgress?userImageId=<id>` 直到完成
3. 中止：`POST /ide/stopSavingImage` body `{id}`
4. 删除：`POST /ide/user_image/delete` body `{id}`
