# 资源池 — 官方 API 9 个

> 来源：天翼云 OpenApi 能力开发平台（eop.ctyun.cn），产品「科研助手」(sid=131, service=bc)，API 版本 2023-10-11。
> 终端节点：`bc-global.ctapi.ctyun.cn`，签名认证：Eop-Authorization（见 [calling-guide.md](calling-guide.md)）。
> 本文件由官方文档 JSON 自动生成于 2026-08-17。

## 一键初始化（createResourceAndQueueByOneClick）

一键初始化资源池及队列，将创建出有权限且处于上线的共享集群和满配队列，若名下已经至少有1个队列，则直接返回，不进行初始化

**接口功能介绍**：一键初始化资源池及队列，将创建出有权限且处于上线的共享集群和满配队列，若名下已经至少有1个队列，则直接返回，不进行初始化
**接口约束**：无
**接口是否审批**：否
**URI**：`POST` `/api/bc/v2/createResourceAndQueueByOneClick`
**Content-Type**：application/json
**响应参数**

| 参数 | 参数类型 | 说明 | 示例 | 下级对象 |
| --- | --- | --- | --- | --- |
| statusCode | String | 返回码取值范围：200 成功，400失败 | 200 |  |
| message | String | 返回信息 | 操作成功 |  |
| error | String | 错误信息 |  |  |
| returnObj | Object | 返回对象 |  | returnObj |

**表 returnObj**

| 参数 | 参数类型 | 说明 | 示例 | 下级对象 |
| --- | --- | --- | --- | --- |
| requestId | String | request id | 6e4eff9f8e634a917ae1950bca1d71ad |  |
| status | Object | 状态信息 |  | status |

**表 status**

| 参数 | 参数类型 | 说明 | 示例 | 下级对象 |
| --- | --- | --- | --- | --- |
| code | String | 状态码 |  |  |
| message | String | 状态信息 |  |  |

**响应示例**：

```json
{
  "returnObj" : {
    "requestId" : "3333faf4785c2f341f500cdecfc1e5e2",
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

[官方文档](https://eop.ctyun.cn/ebp/ctapiDocument/search?sid=131&api=%E4%B8%80%E9%94%AE%E5%88%9D%E5%A7%8B%E5%8C%96&data=187&vid=265)

---

## 创建资源池（createResource）

创建资源池

**接口功能介绍**：创建资源池
**接口约束**：需要传入未被使用过的共享集群id，可通过"查看共享资源池剩余配额"接口获取未被使用过的集群id
**接口是否审批**：否
**URI**：`POST` `/api/bc/v2/createResource`
**Content-Type**：application/json
**请求体body参数**

| 参数 | 是否必填 | 参数类型 | 说明 | 示例 | 下级对象 |
| --- | --- | --- | --- | --- | --- |
| clusterId | 是 | Integer | 集群id，值大于0 | 18230 |  |
| resourcePoolName | 是 | String | 资源池名称：必须是小写字母开头、小写字母或数字结尾，中间由小写字母、数字或中划线（-）组成，长度为4-32个字符 | luzfrtest |  |

**响应参数**

| 参数 | 参数类型 | 说明 | 示例 | 下级对象 |
| --- | --- | --- | --- | --- |
| statusCode | String | 返回码取值范围：200 成功，400失败 | 200 |  |
| message | String | 返回信息 | 操作成功 |  |
| error | String | 错误信息 |  |  |
| returnObj | Object | 返回对象 |  | returnObj |

**表 returnObj**

| 参数 | 参数类型 | 说明 | 示例 | 下级对象 |
| --- | --- | --- | --- | --- |
| resourcePoolId | Integer | 资源池id | 740 |  |
| requestId | String | request id | 6e4eff9f8e634a917ae1950bca1d71ad |  |
| status | Object | 状态信息 |  | status |

**表 status**

| 参数 | 参数类型 | 说明 | 示例 | 下级对象 |
| --- | --- | --- | --- | --- |
| code | String | 状态码 |  |  |
| message | String | 状态信息 |  |  |

**请求体body示例**：

```json
{
  "clusterId" : 18230,
  "resourcePoolName" : "luzfrtest"
}
```
**响应示例**：

```json
{
  "returnObj" : {
    "requestId" : "3333faf4785c2f341f500cdecfc1e5e2",
    "resourcePoolId" : 740,
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

[官方文档](https://eop.ctyun.cn/ebp/ctapiDocument/search?sid=131&api=%E5%88%9B%E5%BB%BA%E8%B5%84%E6%BA%90%E6%B1%A0&data=187&vid=265)

---

## 删除资源池（deleteResource）

删除资源池

**接口功能介绍**：删除资源池
**接口约束**：无
**接口是否审批**：否
**URI**：`POST` `/api/bc/v2/deleteResource`
**Content-Type**：application/json
**请求体body参数**

| 参数 | 是否必填 | 参数类型 | 说明 | 示例 | 下级对象 |
| --- | --- | --- | --- | --- | --- |
| resourcePoolId | 是 | Integer | 资源池id，值大于0 | 18230 |  |

**响应参数**

| 参数 | 参数类型 | 说明 | 示例 | 下级对象 |
| --- | --- | --- | --- | --- |
| statusCode | String | 返回码取值范围：200 成功，400失败 | 200 |  |
| message | String | 返回信息 | 操作成功 |  |
| error | String | 错误信息 |  |  |
| returnObj | Object | 返回对象 |  | returnObj |

**表 returnObj**

| 参数 | 参数类型 | 说明 | 示例 | 下级对象 |
| --- | --- | --- | --- | --- |
| requestId | String | request id | 6e4eff9f8e634a917ae1950bca1d71ad |  |
| status | Object | 状态信息 |  | status |

**表 status**

| 参数 | 参数类型 | 说明 | 示例 | 下级对象 |
| --- | --- | --- | --- | --- |
| code | String | 状态码 |  |  |
| message | String | 状态信息 |  |  |

**请求体body示例**：

```json
{
  "resourcePoolId" : 18230
}
```
**响应示例**：

```json
{
  "returnObj" : {
    "requestId" : "3333faf4785c2f341f500cdecfc1e5e2",
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

[官方文档](https://eop.ctyun.cn/ebp/ctapiDocument/search?sid=131&api=%E5%88%A0%E9%99%A4%E8%B5%84%E6%BA%90%E6%B1%A0&data=187&vid=265)

---

## 查看当前共享资源池的共享集群信息、租户配额信息（listSharedClusterQuotas）

查看当前共享资源池的共享集群信息、租户配额信息

**接口功能介绍**：查看当前共享资源池的共享集群信息、租户配额信息
**接口约束**：无
**接口是否审批**：否
**URI**：`POST` `/api/bc/v2/listSharedClusterQuotas`
**Content-Type**：application/json
**请求体body参数**

| 参数 | 是否必填 | 参数类型 | 说明 | 示例 | 下级对象 |
| --- | --- | --- | --- | --- | --- |
| clusterId | 否 | Integer | 共享集群id，不填或填0则表示查询所有集群 | 0 |  |

**响应参数**

| 参数 | 参数类型 | 说明 | 示例 | 下级对象 |
| --- | --- | --- | --- | --- |
| statusCode | String | 返回码取值范围：200 成功，400失败 | 200 |  |
| message | String | 返回信息 | 操作成功 |  |
| error | String | 错误码 |  |  |
| returnObj | Object | 返回对象 |  | returnObj |

**表 returnObj**

| 参数 | 参数类型 | 说明 | 示例 | 下级对象 |
| --- | --- | --- | --- | --- |
| sharedClusters | Array of Objects | 共享集群信息 |  | sharedClusters |
| tenantQuota | Array of Objects | 租户配额 |  | tenantQuota |
| requestId | String | request id |  |  |
| status | Object | 状态信息 |  | status |

**表 status**

| 参数 | 参数类型 | 说明 | 示例 | 下级对象 |
| --- | --- | --- | --- | --- |
| code | String | 状态码 |  |  |
| message | String | 状态信息 |  |  |

**表 sharedClusters**

| 参数 | 参数类型 | 说明 | 示例 | 下级对象 |
| --- | --- | --- | --- | --- |
| clusterId | String | 集群id | 123 |  |
| clusterName | String | 集群名称 | suzhou |  |
| clusterUsedState | String | 集群使用状态：UNUSED-未使用；USED-已被使用 | USED |  |

**表 tenantQuota**

| 参数 | 参数类型 | 说明 | 示例 | 下级对象 |
| --- | --- | --- | --- | --- |
| clusterId | String | 集群id | 123 |  |
| totalQuota | Object | 总配额 |  | resourceQuota |
| usedQuota | Object | 已使用配额 |  | resourceQuota |
| idleQuota | Object | 剩余配额 |  | resourceQuota |

**表 resourceQuota**

| 参数 | 参数类型 | 说明 | 示例 | 下级对象 |
| --- | --- | --- | --- | --- |
| cpu | String | CPU核数 | 3 |  |
| memory | String | 内存大小，单位G | 3 |  |
| gpu | String | GPU卡数 | 3 |  |
| gpuMemory | String | GPU内存大小 | 3 |  |
| storage | String | 存储大小 | 3 |  |
| updateTime | Integer | 更新时间，时间戳数据 |  |  |

**请求体body示例**：

```json
{
  "clusterId" : 0
}
```
**响应示例**：

```json
{
  "returnObj" : {
    "requestId" : "5daedc491de5ee1f9af1425752d6b949",
    "sharedClusters" : [ {
      "clusterId" : 18233,
      "clusterName" : "新作业集群",
      "clusterUsedState" : "UNUSED"
    }, {
      "clusterId" : 18229,
      "clusterName" : "华南三区",
      "clusterUsedState" : "USED"
    }, {
      "clusterId" : 18224,
      "clusterName" : "SFS验证集群",
      "clusterUsedState" : "USED"
    } ],
    "status" : {
      "code" : "ok",
      "message" : "操作成功"
    },
    "tenantQuota" : [ {
      "clusterId" : 18233,
      "idleQuota" : {
        "cpu" : "500",
        "gpu" : "55",
        "gpuMemory" : "0",
        "memory" : "5000",
        "storage" : "2000",
        "updateTime" : 1728893695
      },
      "totalQuota" : {
        "cpu" : "500",
        "gpu" : "55",
        "gpuMemory" : "0",
        "memory" : "5000",
        "storage" : "",
        "updateTime" : 0
      },
      "usedQuota" : {
        "cpu" : "",
        "gpu" : "",
        "gpuMemory" : "",
        "memory" : "",
        "storage" : "",
        "updateTime" : 0
      }
    }, {
      "clusterId" : 18229,
      "idleQuota" : {
        "cpu" : "0.00",
        "gpu" : "0.00",
        "gpuMemory" : "0.00",
        "memory" : "0.00",
        "storage" : "",
        "updateTime" : 0
      },
      "totalQuota" : {
        "cpu" : "500",
        "gpu" : "55",
        "gpuMemory" : "0",
        "memory" : "5000",
        "storage" : "",
        "updateTime" : 0
      },
      "usedQuota" : {
        "cpu" : "500.00",
        "gpu" : "55.00",
        "gpuMemory" : "0.00",
        "memory" : "5000.00",
        "storage" : "",
        "updateTime" : 0
      }
    }, {
      "clusterId" : 18224,
      "idleQuota" : {
        "cpu" : "500",
        "gpu" : "55",
        "gpuMemory" : "0",
        "memory" : "5000",
        "storage" : "2000",
        "updateTime" : 1700647127
      },
      "totalQuota" : {
        "cpu" : "500",
        "gpu" : "55",
        "gpuMemory" : "0",
        "memory" : "5000",
        "storage" : "",
        "updateTime" : 0
      },
      "usedQuota" : {
        "cpu" : "",
        "gpu" : "",
        "gpuMemory" : "",
        "memory" : "",
        "storage" : "",
        "updateTime" : 0
      }
    } ]
  },
  "statusCode" : "200",
  "message" : "操作成功",
  "error" : ""
}
```
**流控信息**：1000

[官方文档](https://eop.ctyun.cn/ebp/ctapiDocument/search?sid=131&api=%E6%9F%A5%E7%9C%8B%E5%BD%93%E5%89%8D%E5%85%B1%E4%BA%AB%E8%B5%84%E6%BA%90%E6%B1%A0%E7%9A%84%E5%85%B1%E4%BA%AB%E9%9B%86%E7%BE%A4%E4%BF%A1%E6%81%AF%E3%80%81%E7%A7%9F%E6%88%B7%E9%85%8D%E9%A2%9D%E4%BF%A1%E6%81%AF&data=187&vid=265)

---

## 获取本地盘存储余量（querySpecLocalStorageInventory）

查询某个规格本地盘库存量，若库存为0则表示该规格的本地盘已售罄。

**接口功能介绍**：查询某个规格本地盘库存量，若库存为0则表示该规格的本地盘已售罄。
**接口约束**：无
**接口是否审批**：否
**URI**：`POST` `/api/bc/v2/querySpecLocalStorageInventory`
**Content-Type**：application/json
**请求体body参数**

| 参数 | 是否必填 | 参数类型 | 说明 | 示例 | 下级对象 |
| --- | --- | --- | --- | --- | --- |
| regionNameEng | 是 | String | 可用区英文名称，可通过资源池可用区列表接口获取 | wuqing-1 |  |
| specId | 是 | Integer | 规格id，可通过资源池规格接口获取 | 3041 |  |

**响应参数**

| 参数 | 参数类型 | 说明 | 示例 | 下级对象 |
| --- | --- | --- | --- | --- |
| statusCode | String | 返回码取值范围：200 成功，400失败 | 200 |  |
| message | String | 返回信息 | 操作成功 |  |
| returnObj | Object | 返回对象 |  | returnObj |
| error | String | 错误信息 |  |  |

**表 returnObj**

| 参数 | 参数类型 | 说明 | 示例 | 下级对象 |
| --- | --- | --- | --- | --- |
| localStorageCapacity | Integer | 本地盘余量 | 60 |  |
| requestId | String | request id | 3d6227fd8dc9ac7b7d5b8556a2c47e40 |  |
| status | Object | 状态信息 |  | status |

**表 status**

| 参数 | 参数类型 | 说明 | 示例 | 下级对象 |
| --- | --- | --- | --- | --- |
| code | String | 状态码 | ok |  |
| message | String | 状态信息 | 操作成功 |  |

**请求体body示例**：

```json
{
  "regionName" : "wuqing-1",
  "specId" : 3041
}
```
**响应示例**：

```json
{
  "returnObj" : {
    "requestId" : "3d6227fd8dc9ac7b7d5b8556a2c47e40",
    "localStorageCapacity" : 60,
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

[官方文档](https://eop.ctyun.cn/ebp/ctapiDocument/search?sid=131&api=%E8%8E%B7%E5%8F%96%E6%9C%AC%E5%9C%B0%E7%9B%98%E5%AD%98%E5%82%A8%E4%BD%99%E9%87%8F&data=187&vid=265)

---

## 资源池列表（listResources）

查询该租户下的资源池列表

**接口功能介绍**：查询该租户下的资源池列表
**接口约束**：无
**接口是否审批**：否
**URI**：`POST` `/api/bc/v2/listResources`
**Content-Type**：application/json
**请求体body参数**

| 参数 | 是否必填 | 参数类型 | 说明 | 示例 | 下级对象 |
| --- | --- | --- | --- | --- | --- |
| pageNum | 否 | Integer | 当前页，值大于等于0。pageNum或pageSize有一个不填或填0，则pageNum默认为1 | 1 |  |
| pageSize | 否 | Integer | 每页个数，值大于大于等于0且最大值为100。pageNum或pageSize有一个不填或填0，则pageSize默认为20 | 20 |  |

**响应参数**

| 参数 | 参数类型 | 说明 | 示例 | 下级对象 |
| --- | --- | --- | --- | --- |
| statusCode | String | 返回码取值范围：200 成功，400失败 | 200 |  |
| message | String | 返回信息 | 操作成功 |  |
| error | String | 错误信息 |  |  |
| returnObj | Object | 返回对象 |  | returnObj |

**表 returnObj**

| 参数 | 参数类型 | 说明 | 示例 | 下级对象 |
| --- | --- | --- | --- | --- |
| totalRecord | Integer | 总记录数 | 1 |  |
| resources | Array of Objects | 资源池信息 |  | resources |
| requestId | String | request id | 6e4eff9f8e634a917ae1950bca1d71ad |  |
| status | Object | 状态信息 |  | status |

**表 status**

| 参数 | 参数类型 | 说明 | 示例 | 下级对象 |
| --- | --- | --- | --- | --- |
| code | String | 状态码 |  |  |
| message | String | 状态信息 |  |  |

**表 resources**

| 参数 | 参数类型 | 说明 | 示例 | 下级对象 |
| --- | --- | --- | --- | --- |
| createTime | String | 创建时间 | 2024-05-10T09:45:05+08:00 |  |
| description | String | 描述 | 该资源池由一键初始化创建 |  |
| clusterId | Integer | 集群id | 18229 |  |
| id | Integer | 资源池id | 694 |  |
| modifyTime | String | 修改时间 | 2024-05-10T09:45:05+08:00 |  |
| resourcePoolName | String | 资源池名称 | hu10-sfs-295 |  |
| state | String | 资源池状态： RUNNING-运行中， ABNORMAL-运行中的异常 | RUNNING |  |
| clusterName | String | 集群名称 | 华南一区 |  |

**响应示例**：

```json
{
  "returnObj" : {
    "requestId" : "",
    "resources" : [ {
      "clusterId" : 18229,
      "createTime" : "2024-10-14T09:20:19+08:00",
      "description" : "",
      "id" : 818,
      "modifyTime" : "2024-10-14T09:20:19+08:00",
      "resourcePoolName" : "luz21",
      "state" : "RUNNING",
      "clusterName" : "华南一区"
    } ],
    "status" : {
      "code" : "ok",
      "message" : "操作成功"
    },
    "totalRecord" : 1
  },
  "statusCode" : "200",
  "message" : "操作成功",
  "error" : ""
}
```
**流控信息**：1000

[官方文档](https://eop.ctyun.cn/ebp/ctapiDocument/search?sid=131&api=%E8%B5%84%E6%BA%90%E6%B1%A0%E5%88%97%E8%A1%A8&data=187&vid=265)

---

## 资源池详情（getResourceDetail）

查询当前用户下的资源池信息详情

**接口功能介绍**：查询当前用户下的资源池信息详情
**接口约束**：无
**接口是否审批**：否
**URI**：`POST` `/api/bc/v2/getResourceDetail`
**Content-Type**：application/json
**请求体body参数**

| 参数 | 是否必填 | 参数类型 | 说明 | 示例 | 下级对象 |
| --- | --- | --- | --- | --- | --- |
| resourcePoolId | 是 | Integer | 资源池id，值大于0 | 410 |  |

**响应参数**

| 参数 | 参数类型 | 说明 | 示例 | 下级对象 |
| --- | --- | --- | --- | --- |
| statusCode | String | 返回码取值范围：200 成功，400失败 | 200 |  |
| message | String | 返回信息 | 操作成功 |  |
| error | String | 错误信息 |  |  |
| returnObj | Object | 返回对象 |  | returnObj |

**表 returnObj**

| 参数 | 参数类型 | 说明 | 示例 | 下级对象 |
| --- | --- | --- | --- | --- |
| totalRecord | Integer | 总记录数 | 1 |  |
| resource | Object | 资源池信息 |  | resource |
| requestId | String | request id | 6e4eff9f8e634a917ae1950bca1d71ad |  |
| status | Object | 状态信息 |  | status |

**表 status**

| 参数 | 参数类型 | 说明 | 示例 | 下级对象 |
| --- | --- | --- | --- | --- |
| code | String | 状态码 |  |  |
| message | String | 状态信息 |  |  |

**表 resource**

| 参数 | 参数类型 | 说明 | 示例 | 下级对象 |
| --- | --- | --- | --- | --- |
| createTime | String | 创建时间 | 2024-05-10T09:45:05+08:00 |  |
| description | String | 描述 | 该资源池由一键初始化创建 |  |
| clusterId | Integer | 集群id | 18229 |  |
| id | Integer | 资源池id | 694 |  |
| modifyTime | String | 修改时间 | 2024-05-10T09:45:05+08:00 |  |
| resourcePoolName | String | 资源池名称 | bc-csl123 |  |
| state | String | 资源池状态： RUNNING-运行中， ABNORMAL-运行中的异常 | RUNNING |  |

**响应示例**：

```json
{
  "returnObj" : {
    "requestId" : "",
    "resource" : {
      "clusterId" : 18229,
      "createTime" : "2024-10-14T09:20:19+08:00",
      "description" : "",
      "id" : 818,
      "modifyTime" : "2024-10-14T09:20:19+08:00",
      "resourcePoolName" : "luz21",
      "state" : "RUNNING"
    },
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

[官方文档](https://eop.ctyun.cn/ebp/ctapiDocument/search?sid=131&api=%E8%B5%84%E6%BA%90%E6%B1%A0%E8%AF%A6%E6%83%85&data=187&vid=265)

---

## 资源池可用区列表（listResourceRegions）

展示资源池下所有可以选择的可用区

**接口功能介绍**：展示资源池下所有可以选择的可用区
**接口约束**：无
**接口是否审批**：否
**URI**：`POST` `/api/bc/v2/listResourceRegions`
**Content-Type**：application/json
**请求体body参数**

| 参数 | 是否必填 | 参数类型 | 说明 | 示例 | 下级对象 |
| --- | --- | --- | --- | --- | --- |
| resourcePoolId | 是 | Integer | 资源池id，值大于0。若用户不传该参数，则该字段默认取0值，响应内容会提示参数错误 | 123 |  |

**响应参数**

| 参数 | 参数类型 | 说明 | 示例 | 下级对象 |
| --- | --- | --- | --- | --- |
| statusCode | String | 返回码取值范围：200 成功，400失败 | 200 |  |
| message | String | 返回信息 | 操作成功 |  |
| error | String | 错误码信息 |  |  |
| returnObj | Object | 返回对象 |  | returnObj |

**表 returnObj  **

| 参数 | 参数类型 | 说明 | 示例 | 下级对象 |
| --- | --- | --- | --- | --- |
| resourceRegionInfo | Array of Objects | 可用区信息 |  | resourceRegionInfo |
| requestId | String | request id |  |  |
| status | Object | 状态信息 |  | status |

**表 status  **

| 参数 | 参数类型 | 说明 | 示例 | 下级对象 |
| --- | --- | --- | --- | --- |
| code | String | 状态码 |  |  |
| message | String | 状态信息 |  |  |

**表 resourceRegionInfo**

| 参数 | 参数类型 | 说明 | 示例 | 下级对象 |
| --- | --- | --- | --- | --- |
| capabilitiesName | Array of Strings | 特性名称列表： "ALL","FEAT-SFS","FEAT-SHARE-DATASET","FEAT-JFS" | FEAT-SFS |  |
| clusterId | Integer | 集群id | 18228 |  |
| id | Integer | 可用区id | 193 |  |
| providerType | String | 提供商类型 | SFS |  |
| regionName | String | 可用区名称 | fuzhou-6 |  |
| regionCnName | String | 可用区名称 中文 | 南京-1 |  |

**请求体body示例**：

```json
{
  "resourcePoolId" : 819
}
```
**响应示例**：

```json
{
  "returnObj" : {
    "requestId" : "",
    "resourceRegionInfo" : [ {
      "capabilitiesName" : [ "FEAT-SFS", "FEAT-HPFS", "FEAT-JFS", "FEAT-SHARE-DATASET" ],
      "clusterId" : 18228,
      "id" : 190,
      "providerType" : "SFS",
      "regionName" : "hi-haikou-6",
      "regionCnName" : "海口-1"
    }, {
      "capabilitiesName" : [ "FEAT-JFS", "FEAT-HPFS" ],
      "clusterId" : 18228,
      "id" : 191,
      "providerType" : "SFS",
      "regionName" : "nm-huhehaote-6",
      "regionCnName" : "呼和浩特-6"
    }, {
      "capabilitiesName" : [ "FEAT-JFS" ],
      "clusterId" : 18228,
      "id" : 193,
      "providerType" : "SFS",
      "regionName" : "fuzhou-6",
      "regionCnName" : "福州-6"
    } ],
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

[官方文档](https://eop.ctyun.cn/ebp/ctapiDocument/search?sid=131&api=%E8%B5%84%E6%BA%90%E6%B1%A0%E5%8F%AF%E7%94%A8%E5%8C%BA%E5%88%97%E8%A1%A8&data=187&vid=265)

---

## 资源池规格列表（listResourceSpecs）

查询该租户下的资源池规格列表，例如cpu，内存和显卡信息

**接口功能介绍**：查询该租户下的资源池规格列表，例如cpu，内存和显卡信息
**接口约束**：无
**接口是否审批**：否
**URI**：`POST` `/api/bc/v2/listResourceSpecs`
**Content-Type**：application/json
**请求体body参数**

| 参数 | 是否必填 | 参数类型 | 说明 | 示例 | 下级对象 |
| --- | --- | --- | --- | --- | --- |
| resourcePoolId | 是 | Integer | 资源池id，值大于0 | 694 |  |
| regionName | 是 | String | 可用区名称 | fuzhou-6 |  |
| pageNum | 否 | Integer | 当前页，值大于等于0。pageNum或pageSize有一个不填或填0，则pageNum默认为1 | 1 |  |
| pageSize | 否 | Integer | 每页个数，值大于大于等于0且最大值为100。pageNum或pageSize有一个不填或填0，则pageSize默认为20 | 20 |  |

**响应参数**

| 参数 | 参数类型 | 说明 | 示例 | 下级对象 |
| --- | --- | --- | --- | --- |
| statusCode | String | 返回码取值范围：200 成功，400失败 | 200 |  |
| message | String | 返回信息 | 操作成功 |  |
| returnObj | Object | 返回对象 |  | returnObj |
| error | String | 错误信息 |  |  |

**表 returnObj**

| 参数 | 参数类型 | 说明 | 示例 | 下级对象 |
| --- | --- | --- | --- | --- |
| totalRecord | Integer | 总记录数 | 1 |  |
| specs | Array of Objects | 资源池规格信息 |  | specs |
| requestId | String | request id | 3d6227fd8dc9ac7b7d5b8556a2c47e40 |  |
| status | Object | 状态信息 |  | status |

**表 status**

| 参数 | 参数类型 | 说明 | 示例 | 下级对象 |
| --- | --- | --- | --- | --- |
| code | String | 状态码 | ok |  |
| message | String | 状态信息 | 操作成功 |  |

**表 specs**

| 参数 | 参数类型 | 说明 | 示例 | 下级对象 |
| --- | --- | --- | --- | --- |
| description | String | 描述 | 资源池规格列表描述 |  |
| id | Integer | 规格id | 11 |  |
| quotaCpu | Integer | CPU配额，单位是核数 | 1 |  |
| quotaGpu | Integer | GPU配额，单位是卡数 | 1 |  |
| quotaMem | Integer | 内存配额，单位是Gi | 1 |  |
| sellout | String | 是否售罄：SOLDOUT-已售罄 ，UNSOLDOUT-未售罄 | UNSOLDOUT |  |
| specType | String | 资源规格类型: GPU-GPU加速型， GENERAL-通用计算型， NPU-NPU加速型 | GPU |  |
| gpuModel | String | GPU型号 | NVIDIA-A800-SXM4-40GB |  |
| gpuMem | String | gpu内存大小 | 100 |  |

**请求体body示例**：

```json
{
  "resourcePoolId" : 819,
  "regionName" : "huhehaote-10",
  "pageNum" : 1,
  "pageSize" : 10
}
```
**响应示例**：

```json
{
  "returnObj" : {
    "requestId" : "",
    "specs" : [ {
      "description" : "",
      "id" : 3034,
      "quotaCpu" : 2,
      "quotaGpu" : 1,
      "quotaMem" : 4,
      "sellout" : "UNSOLDOUT",
      "specType" : "GPU",
      "gpuModel" : "NVIDIA-A800-SXM4-40GB",
      "gpuMem" : "24"
    }, {
      "description" : "",
      "id" : 3037,
      "quotaCpu" : 2,
      "quotaGpu" : 1,
      "quotaMem" : 6,
      "sellout" : "UNSOLDOUT",
      "specType" : "GPU",
      "gpuModel" : "NVIDIA-A800-SXM4-40GB",
      "gpuMem" : "24"
    }, {
      "description" : "",
      "id" : 3038,
      "quotaCpu" : 2,
      "quotaGpu" : 1,
      "quotaMem" : 8,
      "sellout" : "UNSOLDOUT",
      "specType" : "GPU",
      "gpuModel" : "NVIDIA-A800-SXM4-40GB",
      "gpuMem" : "24"
    }, {
      "description" : "",
      "id" : 3030,
      "quotaCpu" : 4,
      "quotaGpu" : 1,
      "quotaMem" : 8,
      "sellout" : "UNSOLDOUT",
      "specType" : "GPU",
      "gpuModel" : "NVIDIA-A800-SXM4-40GB",
      "gpuMem" : "24"
    }, {
      "description" : "",
      "id" : 3031,
      "quotaCpu" : 4,
      "quotaGpu" : 1,
      "quotaMem" : 10,
      "sellout" : "UNSOLDOUT",
      "specType" : "GPU",
      "gpuModel" : "NVIDIA-A800-SXM4-40GB",
      "gpuMem" : "24"
    }, {
      "description" : "",
      "id" : 3028,
      "quotaCpu" : 6,
      "quotaGpu" : 1,
      "quotaMem" : 24,
      "sellout" : "UNSOLDOUT",
      "specType" : "GPU",
      "gpuModel" : "NVIDIA-A800-SXM4-40GB",
      "gpuMem" : "24"
    }, {
      "description" : "hrn",
      "id" : 5,
      "quotaCpu" : 2,
      "quotaGpu" : 0,
      "quotaMem" : 4,
      "sellout" : "UNSOLDOUT",
      "specType" : "GENERAL",
      "gpuModel" : "NVIDIA-A100",
      "gpuMem" : "100"
    }, {
      "description" : "hrn",
      "id" : 6,
      "quotaCpu" : 2,
      "quotaGpu" : 0,
      "quotaMem" : 4,
      "sellout" : "UNSOLDOUT",
      "specType" : "GENERAL",
      "gpuModel" : "NVIDIA-A100",
      "gpuMem" : "100"
    }, {
      "description" : "",
      "id" : 3009,
      "quotaCpu" : 4,
      "quotaGpu" : 0,
      "quotaMem" : 8,
      "sellout" : "UNSOLDOUT",
      "specType" : "GENERAL",
      "gpuModel" : "NVIDIA-A100",
      "gpuMem" : "100"
    }, {
      "description" : "通用大数据测试",
      "id" : 3035,
      "quotaCpu" : 88,
      "quotaGpu" : 0,
      "quotaMem" : 888,
      "sellout" : "SOLDOUT",
      "specType" : "GENERAL",
      "gpuModel" : "NVIDIA-A100",
      "gpuMem" : "100"
    } ],
    "status" : {
      "code" : "ok",
      "message" : "操作成功"
    },
    "totalRecord" : 10
  },
  "statusCode" : "200",
  "message" : "操作成功",
  "error" : ""
}
```
**流控信息**：1000

[官方文档](https://eop.ctyun.cn/ebp/ctapiDocument/search?sid=131&api=%E8%B5%84%E6%BA%90%E6%B1%A0%E8%A7%84%E6%A0%BC%E5%88%97%E8%A1%A8&data=187&vid=265)

---

