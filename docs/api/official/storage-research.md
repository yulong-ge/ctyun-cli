# 科研文件 — 官方 API 6 个

> 来源：天翼云 OpenApi 能力开发平台（eop.ctyun.cn），产品「科研助手」(sid=131, service=bc)，API 版本 2023-10-11。
> 终端节点：`bc-global.ctapi.ctyun.cn`，签名认证：Eop-Authorization（见 [calling-guide.md](calling-guide.md)）。
> 本文件由官方文档 JSON 自动生成于 2026-08-17。

## 科研文件扩容（resizeStorageResearch）

科研文件扩容

**接口功能介绍**：科研文件扩容
**接口约束**：无
**接口是否审批**：否
**URI**：`POST` `/api/bc/v2/resizeStorageResearch`
**Content-Type**：application/json
**请求体body参数**

| 参数 | 是否必填 | 参数类型 | 说明 | 示例 | 下级对象 |
| --- | --- | --- | --- | --- | --- |
| storageId | 是 | Integer | 科研文件id，值需大于0 | 667 |  |
| volumeSize | 是 | Integer | 扩容容量大小，单位GB，需大于0。若科研文件的存储提供商类型为Hpfs，则值需为512的整数倍；其余类型对应值则需为整数 | 10 |  |

**响应参数**

| 参数 | 参数类型 | 说明 | 示例 | 下级对象 |
| --- | --- | --- | --- | --- |
| statusCode | String | 返回码取值范围：200 成功，400失败 | 200 |  |
| message | String | 返回信息 | 操作成功 |  |
| error | String | 错误码信息 |  |  |
| returnObj | Object | 返回对象 |  | returnObj |

**表 returnObj**

| 参数 | 参数类型 | 说明 | 示例 | 下级对象 |
| --- | --- | --- | --- | --- |
| requestId | String | 一个 API 请求的唯一标识 | 3251331e7ff2cb0d4149d9ab0cbfcd81 |  |
| status | Object | 状态信息 |  | status |

**表 status**

| 参数 | 参数类型 | 说明 | 示例 | 下级对象 |
| --- | --- | --- | --- | --- |
| code | String | 状态码 |  |  |
| message | String | 状态信息 |  |  |

**请求体body示例**：

```json
{
  "storageId" : 439,
  "volumeSize" : 1
}
```
**响应示例**：

```json
{
  "returnObj" : {
    "requestId" : "675eb92486525c4533f3a8fdcef33333",
    "status" : {
      "code" : "ok",
      "message" : "操作成功"
    }
  },
  "statusCode" : "200",
  "message" : "操作成功",
  "error" : ""
}
```
**流控信息**：1000

[官方文档](https://eop.ctyun.cn/ebp/ctapiDocument/search?sid=131&api=%E7%A7%91%E7%A0%94%E6%96%87%E4%BB%B6%E6%89%A9%E5%AE%B9&data=187&vid=265)

---

## 获取科研文件详情（getStorageResearchDetail）

依据storageId获取科研文件详情

**接口功能介绍**：依据storageId获取科研文件详情
**接口约束**：无
**接口是否审批**：否
**URI**：`POST` `/api/bc/v2/getStorageResearchDetail`
**Content-Type**：application/json
**请求体body参数**

| 参数 | 是否必填 | 参数类型 | 说明 | 示例 | 下级对象 |
| --- | --- | --- | --- | --- | --- |
| storageId | 是 | Integer | 科研文件id，值大于0 | 561 |  |

**响应参数**

| 参数 | 参数类型 | 说明 | 示例 | 下级对象 |
| --- | --- | --- | --- | --- |
| statusCode | String | 返回码取值范围：200 成功，400失败 | 200 |  |
| message | String | 返回信息 | 操作成功 |  |
| error | String | 错误码信息 |  |  |
| returnObj | Object | 返回对象 |  | returnObj |

**表 returnObj**

| 参数 | 参数类型 | 说明 | 示例 | 下级对象 |
| --- | --- | --- | --- | --- |
| requestId | String | 请求 ID | 6e4eff9f8e634a917ae1950bca1d71ad |  |
| status | Object | 状态信息 |  | status |
| storageResearch | Object | 科研文件详情 |  |  |

**表 storageResearch**

| 参数 | 参数类型 | 说明 | 示例 | 下级对象 |
| --- | --- | --- | --- | --- |
| storageId | Integer | 561 | 无 |  |
| storageName | String | research-storage-r9fdba0 | 无 |  |
| volumeSize | Integer | 10 | 无 |  |
| resourceId | Integer | 1040 | 无 |  |
| resourceName | String | hu10-sfs-839 | 无 |  |
| regionId | Integer | 194 | 无 |  |
| specName | String | BC_STO.基础性能版 | 无 |  |
| state | String | Created | 无 |  |
| specId | Integer | 3072 | 无 |  |
| provider | String | SFS | 无 |  |
| createTime | String | 2024-11-06T16:21:51+08:00 | 无 |  |
| uuid | String | "94ac6b1d-8ff4-4b6f-876d-12736fe4b282" | 无 |  |
| chunk_size | Integer | 1048576 | 无 |  |
| qps | Integer | 5 | 无 |  |
| projectId | String | 0 |  |  |
| projectName | String | default |  |  |

**请求url示例**：

```json
/bc/v2/getStorageResearchDetail
```
**请求体body示例**：

```json
{
  "storageId" : 561
}
```
**响应示例**：

```json
{
  "returnObj" : {
    "requestId" : "6e4eff9f8e634a917ae1950bca1d71ad",
    "status" : {
      "code" : "ok",
      "message" : "操作成功"
    },
    "storageResearch" : {
      "storageId" : 561,
      "storageName" : "research-storage-r9fdba0",
      "volumeSize" : 10,
      "resourceId" : 1040,
      "resourceName" : "hu10-sfs-839",
      "regionId" : 194,
      "specName" : "BC_STO.基础性能版",
      "state" : "Created",
      "specId" : 3072,
      "createTime" : "2024-11-18T14:51:10+08:00",
      "provider" : "SFS",
      "uuid" : "94ac6b1d-8ff4-4b6f-876d-12736fe4b282",
      "chunkSize" : 1048576,
      "qps" : 5,
      "projectId" : "0",
      "projectName" : "default"
    }
  },
  "statusCode" : "200",
  "message" : "操作成功",
  "error" : ""
}
```
**流控信息**：1000

[官方文档](https://eop.ctyun.cn/ebp/ctapiDocument/search?sid=131&api=%E8%8E%B7%E5%8F%96%E7%A7%91%E7%A0%94%E6%96%87%E4%BB%B6%E8%AF%A6%E6%83%85&data=187&vid=265)

---

## 创建科研文件（createStorageResearch）

创建科研文件

**接口功能介绍**：创建科研文件
**接口约束**：无
**接口是否审批**：否
**URI**：`POST` `/api/bc/v2/createStorageResearch`
**Content-Type**：application/json
**请求体body参数**

| 参数 | 是否必填 | 参数类型 | 说明 | 示例 | 下级对象 |
| --- | --- | --- | --- | --- | --- |
| name | 是 | String | 科研文件名称：4-32位数，以小写字母开头、小写字母或数字结尾，中间以小写字母、数字或中划线（-）组成的名称 | xiamen-4 |  |
| specId | 是 | Integer | 规格id | 3066 |  |
| volumeSize | 是 | Integer | 科研文件存储最小要求：10，单位Gi，数值大小受限制于用户具体科研存储的配额大小。注意，若选择规格的存储类型为HPFS，则起步需要512且大小是512的整数倍 | 3066 |  |
| regionId | 是 | Integer | 可用区id | 194 |  |
| projectId | 否 | String | 企业项目id，默认为default项目，值为"0" | 0 |  |

**响应参数**

| 参数 | 参数类型 | 说明 | 示例 | 下级对象 |
| --- | --- | --- | --- | --- |
| statusCode | String | 返回码取值范围：200 成功，400失败 | 200 |  |
| message | String | 返回信息 | 操作成功 |  |
| error | String | 错误码信息 |  |  |
| returnObj | Object | 返回对象 |  | returnObj |

**表 returnObj**

| 参数 | 参数类型 | 说明 | 示例 | 下级对象 |
| --- | --- | --- | --- | --- |
| orderId | String | 订单id | 111 |  |
| requestId | String | 请求 ID | 13637fd7907900926a9591631cda7ada |  |
| success | Boolean | 是否订购成功 | true |  |
| orderDetailUrl | String | 订单详情页跳转链接 | http://xxx.test.com |  |
| rechargeUrl | String | 充值跳转链接 | http://xxx.test.com |  |
| orderNo | String | 订单号 | 1111 |  |
| isDelegate | Boolean | 是否委托代理 | true |  |
| businessReceiptUrl | String | 业务受理单页面跳转链接 | http://xxx.test.com |  |
| storageId | Integer | 科研文件id | 123 |  |
| status | Object | 状态信息 |  | status |

**表 status**

| 参数 | 参数类型 | 说明 | 示例 | 下级对象 |
| --- | --- | --- | --- | --- |
| code | String | 状态码 |  |  |
| message | String | 状态信息 |  |  |

**请求体body示例**：

```json
{
  "name" : "rese2ar1ch-st1wor2age-2cw1g",
  "specId" : 3066,
  "volumeSize" : 10,
  "regionId" : 194,
  "projectId" : "0"
}
```
**响应示例**：

```json
{
  "returnObj" : {
    "requestId" : "e9efb1dd7cb9d48a4e895de368316090",
    "status" : {
      "code" : "ok",
      "message" : "操作成功"
    },
    "orderId" : "5174dae027c64325bc266576b6a92a04",
    "success" : true,
    "orderDetailUrl" : "https://wwwtest.ctyun.cn",
    "rechargeUrl" : "https://www.ctyun.cn",
    "orderNo" : "20250106162901605084",
    "isDelegate" : false,
    "businessReceiptUrl" : "https://wwwtest.ctyun.cn",
    "storageId" : 227
  },
  "statusCode" : "200",
  "message" : "操作成功",
  "error" : ""
}
```
**流控信息**：1000

[官方文档](https://eop.ctyun.cn/ebp/ctapiDocument/search?sid=131&api=%E5%88%9B%E5%BB%BA%E7%A7%91%E7%A0%94%E6%96%87%E4%BB%B6&data=187&vid=265)

---

## 删除科研文件（deleteStorageResearch）

删除科研文件

**接口功能介绍**：删除科研文件
**接口约束**：无
**接口是否审批**：否
**URI**：`POST` `/api/bc/v2/deleteStorageResearch`
**Content-Type**：application/json
**请求体body参数**

| 参数 | 是否必填 | 参数类型 | 说明 | 示例 | 下级对象 |
| --- | --- | --- | --- | --- | --- |
| storageId | 是 | Integer | 科研文件id，值大于0 | 667 |  |

**响应参数**

| 参数 | 参数类型 | 说明 | 示例 | 下级对象 |
| --- | --- | --- | --- | --- |
| statusCode | String | 返回码取值范围：200 成功，400失败 | 200 |  |
| message | String | 返回信息 | 操作成功 |  |
| error | String | 错误码信息 |  |  |
| returnObj | Object | 返回对象 |  | returnObj |

**表 returnObj**

| 参数 | 参数类型 | 说明 | 示例 | 下级对象 |
| --- | --- | --- | --- | --- |
| requestId | String | 一个 API 请求的唯一标识 | 3251331e7ff2cb0d4149d9ab0cbfcd81 |  |
| status | Object | 状态信息 |  | status |

**表 status**

| 参数 | 参数类型 | 说明 | 示例 | 下级对象 |
| --- | --- | --- | --- | --- |
| code | String | 状态码 |  |  |
| message | String | 状态信息 |  |  |

**请求体body示例**：

```json
{
  "storageId" : 1777
}
```
**响应示例**：

```json
{
  "returnObj" : {
    "requestId" : "675eb92486525c4533f3a8fdcef33333",
    "status" : {
      "code" : "ok",
      "message" : "操作成功"
    }
  },
  "statusCode" : "200",
  "message" : "操作成功",
  "error" : ""
}
```
**流控信息**：1000

[官方文档](https://eop.ctyun.cn/ebp/ctapiDocument/search?sid=131&api=%E5%88%A0%E9%99%A4%E7%A7%91%E7%A0%94%E6%96%87%E4%BB%B6&data=187&vid=265)

---

## 科研文件列表（listStorageResearch）

查询用户的科研文件列表

**接口功能介绍**：查询用户的科研文件列表
**接口约束**：无
**接口是否审批**：否
**URI**：`POST` `/api/bc/v2/listStorageResearch`
**Content-Type**：application/json
**请求体body参数**

| 参数 | 是否必填 | 参数类型 | 说明 | 示例 | 下级对象 |
| --- | --- | --- | --- | --- | --- |
| regionName | 否 | String | 可用区名称，英文，可通过 POST /bc/v2/listResourceRegions 接口获取 | xiamen-4 |  |
| pageNum | 否 | Integer | 当前页，值大于等于0。pageNum或pageSize有一个不填或填0，则pageNum默认为1 | 1 |  |
| pageSize | 否 | Integer | 每页个数，值大于大于等于0且最大值为100。pageNum或pageSize有一个不填或填0，则pageSize默认为20 | 20 |  |
| projectId | 否 | String | 企业项目id | 0 |  |

**响应参数**

| 参数 | 参数类型 | 说明 | 示例 | 下级对象 |
| --- | --- | --- | --- | --- |
| statusCode | String | 返回码取值范围：200 成功，400失败 | 200 |  |
| message | String | 返回信息 | 操作成功 |  |
| error | String | 错误码信息 |  |  |
| returnObj | Object | 返回对象 |  | returnObj |

**表 returnObj**

| 参数 | 参数类型 | 说明 | 示例 | 下级对象 |
| --- | --- | --- | --- | --- |
| storageResearches | Array of Objects | 科研文件列表 |  | storageResearchInfo |
| requestId | String | 请求 ID | 13637fd7907900926a9591631cda7ada |  |
| paging | Object | 分页偏移量，默认请求一页，每页二十个 |  | paging |
| status | Object | 状态信息 |  | status |

**表 storageResearchInfo**

| 参数 | 参数类型 | 说明 | 示例 | 下级对象 |
| --- | --- | --- | --- | --- |
| storageId | Integer | 科研文件id | 69 | 无 |
| storageName | String | 科研文件存储名称 | research-storage-bnw4k7 | 无 |
| volumeSize | Integer | 存储容量大小 | 10 | 无 |
| resourceId | Integer | 资源池id | 394 | 无 |
| resourceName | String | 资源池名称 | bc-huanan03 | 无 |
| regionId | Integer | 可用区id | 194 | 无 |
| specName | String | 科研文件存储规格名称 | BC_STO.基础性能版 | 无 |
| state | String | 科研文件存储状态：Abnormal-异常，Creating-创建中，Created-创建成功，Purchasing-订购中，Refunding-退款中，Renewing-续期中，Refunded-退订成功，Failed-创建失败，Freezing-冻结中，Destroying-销毁中，Unfreezing-解冻中，Deleting-删除中，DeleteFailed-删除失败 | Created | 无 |
| specId | Integer | 规格id | 3072 | 无 |
| provider | String | 存储提供商类型：SFS-弹性文件服务，Juicefs-高性能分布式文件系统，Hpfs-并行文件服务 | SFS | 无 |
| createTime | String | 创建时间 | 2024-11-06T16:21:51+08:00 | 无 |
| uuid | String | 话单关联的id | 94ac6b1d-8ff4-4b6f-876d-12736fe4b282 | 无 |
| projectId | String | 科研文件所属企业项目id | 0 |  |
| projectName | String | 科研文件所属企业项目名称，默认为 default | default |  |

**表 status**

| 参数 | 参数类型 | 说明 | 示例 | 下级对象 |
| --- | --- | --- | --- | --- |
| code | String | 状态码 |  |  |
| message | String | 状态信息 |  |  |

**表 paging**

| 参数 | 参数类型 | 说明 | 示例 | 下级对象 |
| --- | --- | --- | --- | --- |
| totalPage | Integer | 总页数 | 1 |  |
| page | Integer | 当前页数 | 1 |  |
| perPage | Integer | 每页显示的记录条数 | 1 |  |
| totalRecord | Integer | 总记录数 | 1 |  |

**请求体body示例**：

```json
{
  "regionName" : "xiamen-4",
  "pageNum" : 1,
  "pageSize" : 20,
  "projectId" : "0"
}
```
**响应示例**：

```json
{
  "returnObj" : {
    "requestId" : "",
    "status" : {
      "code" : "ok",
      "message" : "操作成功"
    },
    "storageResearches" : [ {
      "storageId" : 90,
      "storageName" : "research-storage-m9gixv",
      "volumeSize" : 10,
      "resourceId" : 394,
      "resourceName" : "bc-huanan03",
      "regionId" : 194,
      "specName" : "BC_STO.基础性能版",
      "state" : "Created",
      "specId" : 3072,
      "createTime" : "2024-11-18T14:51:10+08:00",
      "provider" : "SFS",
      "uuid" : "94ac6b1d-8ff4-4b6f-876d-12736fe4b282",
      "projectId" : "0",
      "projectName" : "default"
    } ],
    "paging" : {
      "totalPage" : 1,
      "page" : 1,
      "perPage" : 20,
      "totalRecord" : 1
    }
  },
  "statusCode" : "200",
  "message" : "操作成功",
  "error" : ""
}
```
**流控信息**：1000

[官方文档](https://eop.ctyun.cn/ebp/ctapiDocument/search?sid=131&api=%E7%A7%91%E7%A0%94%E6%96%87%E4%BB%B6%E5%88%97%E8%A1%A8&data=187&vid=265)

---

## 科研文件存储规格列表（listStorageResearchSpecs）

展示当前租户下的所有科研文件存储规格列表，当前接口暂不支持分页。

**接口功能介绍**：展示当前租户下的所有科研文件存储规格列表，当前接口暂不支持分页。
**接口约束**：无
**接口是否审批**：否
**URI**：`POST` `/api/bc/v2/listStorageResearchSpecs`
**Content-Type**：application/json
**请求体body参数**

| 参数 | 是否必填 | 参数类型 | 说明 | 示例 | 下级对象 |
| --- | --- | --- | --- | --- | --- |
| regionId | 是 | Integer | 可用区id | 1 |  |

**响应参数**

| 参数 | 参数类型 | 说明 | 示例 | 下级对象 |
| --- | --- | --- | --- | --- |
| statusCode | String | 返回码取值范围：200 成功，400失败 | 200 |  |
| message | String | 返回信息 | 操作成功 |  |
| error | String | 错误码信息 |  |  |
| returnObj | Object | 返回对象 |  | returnObj |

**表 returnObj**

| 参数 | 参数类型 | 说明 | 示例 | 下级对象 |
| --- | --- | --- | --- | --- |
| specs | Array of Objects | 科研文件存储规格列表 |  | spec |
| requestId | String | 请求 ID | 13637fd7907900926a9591631cda7ada |  |
| paging | Object | 分页偏移量，默认请求一页，每页二十个 |  | paging |
| status | Object | 状态信息 |  | status |

**表 spec**

| 参数 | 参数类型 | 说明 | 示例 | 下级对象 |
| --- | --- | --- | --- | --- |
| specName | String | 科研文件存储规格名称 | BC_STO.基础性能版 | 无 |
| resourceId | Integer | 资源池id | 394 | 无 |
| regionId | Integer | 可用区id | 194 | 无 |
| regionName | String | 可用区名称 | hu-10 | 无 |
| specId | Integer | 规格id | 3072 | 无 |
| extraInfo | Object | 存储额外信息 |  | extraInfo |

**表 extraInfo**

| 参数 | 参数类型 | 说明 | 示例 | 下级对象 |
| --- | --- | --- | --- | --- |
| minSize | Integer | 存储起步容量 | 10 |  |
| provider | String | 存储类型 | Juicefs |  |

**表 status**

| 参数 | 参数类型 | 说明 | 示例 | 下级对象 |
| --- | --- | --- | --- | --- |
| code | String | 状态码 |  |  |
| message | String | 状态信息 |  |  |

**表 paging**

| 参数 | 参数类型 | 说明 | 示例 | 下级对象 |
| --- | --- | --- | --- | --- |
| totalPage | Integer | 总页数 | 1 |  |
| page | Integer | 当前页数 | 1 |  |
| perPage | Integer | 每页显示的记录条数 | 1 |  |
| totalRecord | Integer | 总记录数 | 1 |  |

**响应示例**：

```json
{
  "returnObj" : {
    "requestId" : "",
    "status" : {
      "code" : "ok",
      "message" : "操作成功"
    },
    "specs" : [ {
      "specId" : 3072,
      "specName" : "BC_STO.基础性能版",
      "resourceId" : 394,
      "regionId" : 194,
      "regionName" : "hu-10",
      "extraInfo" : {
        "minSize" : 10,
        "provider" : "Juicefs"
      }
    }, {
      "specId" : 3066,
      "specName" : "BC_STO.专业入门版",
      "resourceId" : 394,
      "regionId" : 194,
      "regionName" : "hu-10",
      "extraInfo" : {
        "minSize" : 512,
        "provider" : "Hpfs"
      }
    } ],
    "paging" : {
      "totalPage" : 1,
      "page" : 1,
      "perPage" : 20,
      "totalRecord" : 2
    }
  },
  "statusCode" : "200",
  "message" : "操作成功",
  "error" : ""
}
```
**流控信息**：1000

[官方文档](https://eop.ctyun.cn/ebp/ctapiDocument/search?sid=131&api=%E7%A7%91%E7%A0%94%E6%96%87%E4%BB%B6%E5%AD%98%E5%82%A8%E8%A7%84%E6%A0%BC%E5%88%97%E8%A1%A8&data=187&vid=265)

---

