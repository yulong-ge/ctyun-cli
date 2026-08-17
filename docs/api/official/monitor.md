# 监控 — 官方 API 1 个

> 来源：天翼云 OpenApi 能力开发平台（eop.ctyun.cn），产品「科研助手」(sid=131, service=bc)，API 版本 2023-10-11。
> 终端节点：`bc-global.ctapi.ctyun.cn`，签名认证：Eop-Authorization（见 [calling-guide.md](calling-guide.md)）。
> 本文件由官方文档 JSON 自动生成于 2026-08-17。

## 查询资源使用率（getResourceUsageRate）

查询当前正在运行中的实例对应的CPU使用率、内存使用率、GPU使用率和显存使用率。（接口存在并发限流限制，建议单次请求不超过5个）

**接口功能介绍**：查询当前正在运行中的实例对应的CPU使用率、内存使用率、GPU使用率和显存使用率。（接口存在并发限流限制，建议单次请求不超过5个）
**接口约束**：无
**接口是否审批**：否
**URI**：`POST` `/api/bc/v2/getResourceUsageRate`
**Content-Type**：application/json
**请求体body参数**

| 参数 | 是否必填 | 参数类型 | 说明 | 示例 | 下级对象 |
| --- | --- | --- | --- | --- | --- |
| objectType | 是 | String | 资源类型：开发机-ide，并行计算-trainingJob | ide |  |
| objectUuid | 是 | String | 资源实例UUID | be8bd387fdc94058a9f6dff40b28e134 |  |
| startTime | 是 | Integer | 开始时间，单位秒。起始时间小于结束时间，且两者间隔不能少于5分钟和超过24h | 1763986494 |  |
| endTime | 是 | Integer | 结束时间，单位秒。起始时间小于结束时间，且两者间隔不能少于5分钟和超过24h | 1763987394 |  |

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
| metrics | Object | 监控数据 |  | metricInfo |

**表 status**

| 参数 | 参数类型 | 说明 | 示例 | 下级对象 |
| --- | --- | --- | --- | --- |
| code | String | 状态码 | ok |  |
| message | String | 状态信息 | 操作成功 |  |

**表 metricInfo**

| 参数 | 参数类型 | 说明 | 示例 | 下级对象 |
| --- | --- | --- | --- | --- |
| cpuUsageRate | Array of Objects | 每个Pod实例的CPU使用率 |  | usageRateInfo |
| memUsageRate | Array of Objects | 每个Pod实例的内存使用率 |  | usageRateInfo |
| gpuUsageRate | Array of Objects | 每个Pod实例的GPU使用率 |  | usageRateInfo |
| gpuMemUsageRate | Array of Objects | 每个Pod实例的显存使用率 |  | usageRateInfo |

**表 usageRateInfo**

| 参数 | 参数类型 | 说明 | 示例 | 下级对象 |
| --- | --- | --- | --- | --- |
| name | String | Pod名称 |  |  |
| data | Array of Objects | 指标数据，默认5分钟1个数据点 |  | data |

**表 data**

| 参数 | 参数类型 | 说明 | 示例 | 下级对象 |
| --- | --- | --- | --- | --- |
| time | String | 某一时刻的时间戳 | 1763986939 |  |
| value | Float | 某一时刻的资源使用率 | 50% |  |

**请求体body示例**：

```json
{
  "start" : 1763986494,
  "end" : 1763987394,
  "objectType" : "ide",
  "objectUuid" : "be8bd387fdc94058a9f6dff40b28e134"
}
```
**响应示例**：

```json
{
  "requestId" : "7d0824e95093ce2fe15734a98903f9aa",
  "status" : {
    "code" : "ok",
    "message" : "操作成功"
  },
  "metrics" : {
    "cpuUsageRate" : [ {
      "name" : "ide-be8bd387fdc94058a9f6dff40b28e134-8d960f",
      "data" : [ {
        "time" : "1763986494",
        "value" : 50
      }, {
        "time" : "1763987394",
        "value" : 50
      } ]
    } ],
    "memUsageRate" : [ {
      "name" : "ide-be8bd387fdc94058a9f6dff40b28e134-8d960f",
      "data" : [ {
        "time" : "1763986494",
        "value" : 50
      }, {
        "time" : "1763987394",
        "value" : 50
      } ]
    } ],
    "gpuUsageRate" : [ {
      "name" : "ide-be8bd387fdc94058a9f6dff40b28e134-8d960f",
      "data" : [ {
        "time" : "1763986494",
        "value" : 50
      }, {
        "time" : "1763987394",
        "value" : 50
      } ]
    } ],
    "gpuMemUsageRate" : [ {
      "name" : "ide-be8bd387fdc94058a9f6dff40b28e134-8d960f",
      "data" : [ {
        "time" : "1763986494",
        "value" : 50
      }, {
        "time" : "1763987394",
        "value" : 50
      } ]
    } ]
  }
}
```
**流控信息**：1000

[官方文档](https://eop.ctyun.cn/ebp/ctapiDocument/search?sid=131&api=%E6%9F%A5%E8%AF%A2%E8%B5%84%E6%BA%90%E4%BD%BF%E7%94%A8%E7%8E%87&data=187&vid=265)

---

