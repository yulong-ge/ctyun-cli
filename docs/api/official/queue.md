# 队列 — 官方 API 5 个

> 来源：天翼云 OpenApi 能力开发平台（eop.ctyun.cn），产品「科研助手」(sid=131, service=bc)，API 版本 2023-10-11。
> 终端节点：`bc-global.ctapi.ctyun.cn`，签名认证：Eop-Authorization（见 [calling-guide.md](calling-guide.md)）。
> 本文件由官方文档 JSON 自动生成于 2026-08-17。

## 删除队列（deleteQueue）

删除队列资源，删除之后，队列资源将不存在

**接口功能介绍**：删除队列资源，删除之后，队列资源将不存在
**接口约束**：删除之前需要确认队列关联的作业，开发机是否已经删除，只有关联的相关资源被删除才能进行删除队列操作
**接口是否审批**：否
**URI**：`POST` `/api/bc/v2/deleteQueue`
**Content-Type**：application/json
**请求体body参数**

| 参数 | 是否必填 | 参数类型 | 说明 | 示例 | 下级对象 |
| --- | --- | --- | --- | --- | --- |
| queueId | 是 | Integer | 队列id，值大于0 | 123 |  |

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
| requestId | String | requestId | 01e90de762bde79d48c8749e8015c6a9 |  |
| status | Object | 状态信息 |  | status |

**表 status**

| 参数 | 参数类型 | 说明 | 示例 | 下级对象 |
| --- | --- | --- | --- | --- |
| code | String | 状态码 |  |  |
| message | String | 状态信息 | 信息描述 |  |

**请求体body示例**：

```json
{
  "queueId" : 721
}
```
**响应示例**：

```json
{
  "statusCode" : "200",
  "message" : "操作成功",
  "returnObj" : {
    "requestId" : "01e90de762bde79d48c8749e8015c6a9",
    "status" : {
      "code" : "ok",
      "message" : "操作成功"
    }
  },
  "error" : ""
}
```
**流控信息**：1000

[官方文档](https://eop.ctyun.cn/ebp/ctapiDocument/search?sid=131&api=%E5%88%A0%E9%99%A4%E9%98%9F%E5%88%97&data=187&vid=265)

---

## 创建队列（createQueue）

创建队列资源。队列在资源池配额的基础上进一步对资源配额进行限制，是业务实例获取集群资源的划分依据

**接口功能介绍**：创建队列资源。队列在资源池配额的基础上进一步对资源配额进行限制，是业务实例获取集群资源的划分依据
**接口约束**：需要先确认是否已创建资源池且资源池剩余配额是否充足，若未创建资源池或者资源池配额不充足则不能创建一个队列
**接口是否审批**：否
**URI**：`POST` `/api/bc/v2/createQueue`
**Content-Type**：application/json
**请求体body参数**

| 参数 | 是否必填 | 参数类型 | 说明 | 示例 | 下级对象 |
| --- | --- | --- | --- | --- | --- |
| queueName | 是 | String | 队列名称：必须是小写字母开头、小写字母或数字结尾，中间由小写字母、数字或中划线（-）组成，长度为4-32个字符 | test-queue |  |
| resourcePoolId | 是 | Integer | 资源池id，值大于0 | 694 |  |
| capability | 是 | Object | 该队列的资源的上限，队列中的正在运行的各种资源累计不能超过限制资源的上限，若应用超出该上限，超出部分的资源将不会被调度成功 |  | capability |
| projectId | 否 | String | 企业项目id，默认为default项目，值为"0" | 0 |  |

**表 capability**

| 参数 | 是否必填 | 参数类型 | 说明 | 示例 | 下级对象 |
| --- | --- | --- | --- | --- | --- |
| cpu | 是 | String | CPU核数，最小值为1，最大值通过查询共享资源池剩余配额接口获取 | 4 |  |
| gpu | 是 | String | GPU卡数，最小值为0，最大值通过查询共享资源池剩余配额接口获取 | 4 |  |
| memory | 是 | String | 内存大小，最小值为1，最大值通过查询共享资源池剩余配额接口获取 | 1 |  |

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
| queueId | Integer | 队列id | 12 |  |
| requestId | String | request id | 13637fd7907900926a9591631cda7ada |  |
| status | Object | 状态信息 |  | status |

**表 status**

| 参数 | 参数类型 | 说明 | 示例 | 下级对象 |
| --- | --- | --- | --- | --- |
| code | String | 状态码 |  |  |
| message | String | 状态信息 |  |  |

**请求体body示例**：

```json
{
  "resourcePoolId" : 817,
  "queueName" : "test3luz5f",
  "projectId" : "0",
  "capability" : {
    "cpu" : "1",
    "memory" : "1",
    "gpu" : "1"
  }
}
```
**响应示例**：

```json
{
  "requestId" : "",
  "status" : {
    "code" : "ok",
    "message" : "操作成功"
  },
  "queueId" : 947
}
```
**流控信息**：1000

[官方文档](https://eop.ctyun.cn/ebp/ctapiDocument/search?sid=131&api=%E5%88%9B%E5%BB%BA%E9%98%9F%E5%88%97&data=187&vid=265)

---

## 更新队列（updateQueue）

对已经创建的队列配额进行更改。

**接口功能介绍**：对已经创建的队列配额进行更改。
**接口约束**：无。
**接口是否审批**：否
**URI**：`POST` `/api/bc/v2/updateQueue`
**Content-Type**：application/json
**请求体body参数**

| 参数 | 是否必填 | 参数类型 | 说明 | 示例 | 下级对象 |
| --- | --- | --- | --- | --- | --- |
| queueId | 是 | Integer | 队列id，值大于0 | 123 |  |
| capability | 是 | Object | 该队列的资源的上限，队列中的正在运行的各种资源累计不能超过限制资源的上限，若应用超出该上限，超出部分的资源将不会被调度成功 |  | capability |

**表 capability**

| 参数 | 是否必填 | 参数类型 | 说明 | 示例 | 下级对象 |
| --- | --- | --- | --- | --- | --- |
| cpu | 是 | String | CPU核数，最小值为1，最大值通过查询共享资源池剩余配额接口获取 | 4 |  |
| gpu | 是 | String | GPU卡数，最小值为0，最大值通过查询共享资源池剩余配额接口获取 | 4 |  |
| memory | 是 | String | 内存大小，最小值为1，最大值通过查询共享资源池剩余配额接口获取 | 1 |  |

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
| queueId | Integer | 队列id | 112 |  |
| requestId | String | request id | 4f745b36fa8bea691f7ca43f84db0fa1 |  |
| status | Object | 状态信息 |  | status |

**表 status**

| 参数 | 参数类型 | 说明 | 示例 | 下级对象 |
| --- | --- | --- | --- | --- |
| code | String | 状态码 |  |  |
| message | String | 状态信息 |  |  |

**请求体body示例**：

```json
{
  "queueId" : 721,
  "capability" : {
    "cpu" : "10",
    "memory" : "10",
    "gpu" : "10"
  }
}
```
**响应示例**：

```json
{
  "statusCode" : "200",
  "message" : "操作成功",
  "returnObj" : {
    "queueId" : 721,
    "requestId" : "4f745b36fa8bea691f7ca43f84db0fa1",
    "status" : {
      "code" : "ok",
      "message" : "操作成功"
    }
  },
  "error" : ""
}
```
**流控信息**：1000

[官方文档](https://eop.ctyun.cn/ebp/ctapiDocument/search?sid=131&api=%E6%9B%B4%E6%96%B0%E9%98%9F%E5%88%97&data=187&vid=265)

---

## 查询实例和配额（getInstancesAndQuota）

查询当前队列正在运行中的开发机或并行计算实例列表和资源配额。

**接口功能介绍**：查询当前队列正在运行中的开发机或并行计算实例列表和资源配额。
**接口约束**：无
**接口是否审批**：否
**URI**：`POST` `/api/bc/v2/getInstancesAndQuota`
**Content-Type**：application/json
**请求体body参数**

| 参数 | 是否必填 | 参数类型 | 说明 | 示例 | 下级对象 |
| --- | --- | --- | --- | --- | --- |
| queueId | 是 | Integer | 队列ID，值大于0 | 123 |  |

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
| requestId | String | request id | 13637fd7907900926a9591631cda7ada |  |
| status | Object | 状态信息 |  | status |
| data | Object | 业务数据 |  | data |

**表 status**

| 参数 | 参数类型 | 说明 | 示例 | 下级对象 |
| --- | --- | --- | --- | --- |
| code | String | 状态码 | ok |  |
| message | String | 状态信息 | 操作成功 |  |

**表 data**

| 参数 | 参数类型 | 说明 | 示例 | 下级对象 |
| --- | --- | --- | --- | --- |
| instances | Array of Objects | 正在运行中的实例信息 |  | instanceInfo |
| quota | Object | 所有正在运行中的实例的配额信息 |  | quotaInfo |
| project | Object | 队列关联的企业项目 |  | projectInfo |

**表 instanceInfo**

| 参数 | 参数类型 | 说明 | 示例 | 下级对象 |
| --- | --- | --- | --- | --- |
| objectType | String | 资源类型：开发机-ide，并行计算-trainingJob | ide |  |
| objectUuid | String | 资源实例UUID：开发机-uuid，并行计算-trainingJobId | be8bd387fdc94058a9f6dff40b28e134 |  |
| projectId | String | 资源关联的企业项目ID | 企业项目A |  |
| projectName | String | 资源关联的企业项目名称 | 7b3bb796a7404c8da0990be09273e9a5 |  |

**表 quotaInfo**

| 参数 | 参数类型 | 说明 | 示例 | 下级对象 |
| --- | --- | --- | --- | --- |
| cpu | Object | CPU配额信息：专业队列为队列配额CPU上限，科研队列为用户配额CPU上限 |  | usageInfo |
| memory | Object | 内存配额信息：专业队列为队列配额内存上限，科研队列为用户配额内存上限 |  | usageInfo |
| gpu | Object | GPU配额信息：专业队列为队列配额GPU上限，科研队列为用户配额GPU上限 |  | usageInfo |

**表 usageInfo**

| 参数 | 参数类型 | 说明 | 示例 | 下级对象 |
| --- | --- | --- | --- | --- |
| total | Float | 总量 | 1000 |  |
| used | Float | 使用量 | 100 |  |
| usageRate | Float | 使用率 | 10% |  |

**表 projectInfo**

| 参数 | 参数类型 | 说明 | 示例 | 下级对象 |
| --- | --- | --- | --- | --- |
| projectId | String | 企业项目ID，-1表示不属于任何企业 | 0 |  |
| projectName | String | 企业项目名称，当projectId为-1时为，该值为空 | default |  |

**请求体body示例**：

```json
{
  "queueId" : 123
}
```
**响应示例**：

```json
{
  "requestId" : "45e67d8ebcdd645aaa30580d827ac357",
  "status" : {
    "code" : "ok",
    "message" : "操作成功"
  },
  "data" : {
    "instances" : [ {
      "objectType" : "ide",
      "objectUuid" : "4cb5ac8977354f1c8722b62d0636858f",
      "projectId" : "7b3bb796a7404c8da0990be09273e9a5",
      "projectName" : "企业项目A"
    }, {
      "objectType" : "trainingJob",
      "objectUuid" : "efce0a8fd5f74204b87b1a8f9197ae0b",
      "projectId" : "0",
      "projectName" : "default"
    } ],
    "quota" : {
      "cpu" : {
        "total" : 800,
        "used" : 2,
        "usageRate" : 0.0025
      },
      "memory" : {
        "total" : 1800,
        "used" : 3,
        "usageRate" : 0.0016666667
      },
      "gpu" : {
        "total" : 100,
        "used" : 5,
        "usageRate" : 0.05
      }
    },
    "project" : {
      "projectId" : "-1",
      "projectName" : ""
    }
  }
}
```
**流控信息**：1000

[官方文档](https://eop.ctyun.cn/ebp/ctapiDocument/search?sid=131&api=%E6%9F%A5%E8%AF%A2%E5%AE%9E%E4%BE%8B%E5%92%8C%E9%85%8D%E9%A2%9D&data=187&vid=265)

---

## 队列列表（listQueues）

展示当前租户下的所有队列资源

**接口功能介绍**：展示当前租户下的所有队列资源
**接口约束**：无
**接口是否审批**：否
**URI**：`POST` `/api/bc/v2/listQueues`
**Content-Type**：application/json
**请求体body参数**

| 参数 | 是否必填 | 参数类型 | 说明 | 示例 | 下级对象 |
| --- | --- | --- | --- | --- | --- |
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
| totalRecord | Integer | 总记录数 | 1 |  |
| queues | Array of Objects | 队列列表 |  | queues |
| requestId | String | request id | 13637fd7907900926a9591631cda7ada |  |
| status | Object | 状态信息 |  | status |

**表 status**

| 参数 | 参数类型 | 说明 | 示例 | 下级对象 |
| --- | --- | --- | --- | --- |
| code | String | 状态码 |  |  |
| message | String | 状态信息 |  |  |

**表 queues**

| 参数 | 参数类型 | 说明 | 示例 | 下级对象 |
| --- | --- | --- | --- | --- |
| id | Integer | 队列id | 123 |  |
| queueName | String | 队列名称 | queuename |  |
| clusterId | String | 集群id | 12 |  |
| resourcePoolId | String | 资源池id | 11 |  |
| resourcePoolName | String | 资源池名称 | resourceName |  |
| createTime | String | 创建时间 | 2024-06-03T09:27:16+08:00 |  |
| capabilityCpu | String | CPU上限 | 3 |  |
| capabilityMem | String | 内存上限 | 2 |  |
| capabilityGpu | String | GPU卡数上限 | 2 |  |
| state | String | 队列状态:Open-队列开放，Closed-队列关闭，Closing-队列正在关闭中 | Open |  |
| projectId | String | 队列所属企业项目id，-1代表不属于任何企业 | -1 |  |
| projectName | String | 队列所属企业项目名称，当projectId为-1时，该值为空 | default |  |

**请求体body示例**：

```json
{
  "pageNum" : 1,
  "pageSize" : 20,
  "projectId" : "0"
}
```
**响应示例**：

```json
{
  "returnObj" : {
    "queues" : [ {
      "capabilityCpu" : "1",
      "capabilityGpu" : "1",
      "capabilityMem" : "1",
      "clusterId" : 18229,
      "createTime" : "2024-06-03T09:27:16+08:00",
      "id" : 737,
      "queueName" : "csl1234",
      "resourcePoolId" : 410,
      "resourcePoolName" : "bc-csl123",
      "state" : "Open",
      "projectId" : "-1",
      "projectName" : ""
    } ],
    "requestId" : "015af813f9ae484002fb02354c5a5b3a",
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

[官方文档](https://eop.ctyun.cn/ebp/ctapiDocument/search?sid=131&api=%E9%98%9F%E5%88%97%E5%88%97%E8%A1%A8&data=187&vid=265)

---

