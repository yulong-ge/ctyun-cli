# 并行计算 — 官方 API 7 个

> 来源：天翼云 OpenApi 能力开发平台（eop.ctyun.cn），产品「科研助手」(sid=131, service=bc)，API 版本 2023-10-11。
> 终端节点：`bc-global.ctapi.ctyun.cn`，签名认证：Eop-Authorization（见 [calling-guide.md](calling-guide.md)）。
> 本文件由官方文档 JSON 自动生成于 2026-08-17。

## 并行计算任务日志（queryTrainingJobLogs）

查询并行计算作业日志

**接口功能介绍**：查询并行计算作业日志
**接口约束**：无
**接口是否审批**：否
**URI**：`POST` `/api/bc/v2/queryTrainingJobLogs`
**Content-Type**：application/json
**请求体body参数**

| 参数 | 是否必填 | 参数类型 | 说明 | 示例 | 下级对象 |
| --- | --- | --- | --- | --- | --- |
| pageNum | 否 | Integer | 当前页，值大于0。pageNum或pageSize有一个不填，则pageNum默认为1 | 1 |  |
| pageSize | 否 | Integer | 每页个数，值大于0且最大值为100。pageNum或pageSize有一个不填，则pageSize默认为20 | 20 |  |
| beginTimestamp | 是 | String | 查询的起始时间戳，起始时间戳不能大于结束时间戳 | 1741853069 |  |
| endTimestamp | 是 | String | 查询的结束时间戳，起始时间戳不能大于结束时间戳 | 1741853366 |  |
| podName | 是 | String | 并行计算作业相关pod名称，可通过并行计算作业详情接口获取 | training-job-0f576291e68e4f1ab5708e867c7d22a1-launcher-lsw65 |  |
| trainingJobId | 是 | String | 并行计算作业id | 936fc8677d0049dfa9904415f93df7fb |  |

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
| requestId | String | request id | 6e4eff9f8e634a917ae1950bca1d71ad |  |
| status | Object | 状态信息 |  | status |
| paging | Object | 分页偏移量，默认请求一页，每页二十个 |  | paging |
| contents | Array of Strings | 日志内容，倒序返回 |  |  |

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
  "pageNum" : 1,
  "pageSize" : 100,
  "podName" : "training-job-0f576291e68e4f1ab5708e867c7d22a1-launcher-lsw65",
  "beginTimestamp" : "1741853069",
  "endTimestamp" : "1741853366",
  "trainingJobId" : "936fc8677d0049dfa9904415f93df7fb"
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
    "paging" : {
      "totalPage" : 1,
      "page" : 1,
      "perPage" : 100,
      "totalRecord" : 4
    },
    "contents" : [ "Warning: The program will execute properly!!!", "Started SSH daemon in the background.", "Run Launcher As Worker", "Running as Launcher" ]
  },
  "statusCode" : "200",
  "message" : "操作成功",
  "error" : ""
}
```
**流控信息**：1000

[官方文档](https://eop.ctyun.cn/ebp/ctapiDocument/search?sid=131&api=%E5%B9%B6%E8%A1%8C%E8%AE%A1%E7%AE%97%E4%BB%BB%E5%8A%A1%E6%97%A5%E5%BF%97&data=187&vid=265)

---

## 停止并行计算作业（stopTrainingJob）

停止并行计算作业

**接口功能介绍**：停止并行计算作业
**接口约束**：无
**接口是否审批**：否
**URI**：`POST` `/api/bc/v2/stopTrainingJob`
**Content-Type**：application/json
**请求体body参数**

| 参数 | 是否必填 | 参数类型 | 说明 | 示例 | 下级对象 |
| --- | --- | --- | --- | --- | --- |
| trainingJobId | 是 | String | 并行计算作业id | 936fc8677d0049dfa9904415f93df7fb |  |

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
| requestId | String | request id | 6e4eff9f8e634a917ae1950bca1d71ad |  |
| status | Object | 状态信息 |  | status |
| instanceId | String | 并行计算作业实例id | 65bd64f404bf4c86b0f35c5bdbf60a57 |  |
| trainingJobId | String | 并行计算作业id | a96197bf87514378b7537a7a475f8e02 |  |

**表 status**

| 参数 | 参数类型 | 说明 | 示例 | 下级对象 |
| --- | --- | --- | --- | --- |
| code | String | 状态码 |  |  |
| message | String | 状态信息 |  |  |

**请求体body示例**：

```json
{
  "trainingJobId" : "a96197bf87514378b7537a7a475f8e02"
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
    "instanceId" : "65bd64f404bf4c86b0f35c5bdbf60a57",
    "trainingJobId" : "a96197bf87514378b7537a7a475f8e02"
  },
  "statusCode" : "200",
  "message" : "操作成功",
  "error" : ""
}
```
**流控信息**：1000

[官方文档](https://eop.ctyun.cn/ebp/ctapiDocument/search?sid=131&api=%E5%81%9C%E6%AD%A2%E5%B9%B6%E8%A1%8C%E8%AE%A1%E7%AE%97%E4%BD%9C%E4%B8%9A&data=187&vid=265)

---

## 创建并行计算作业（createTrainingJob）

创建并行计算作业

**接口功能介绍**：创建并行计算作业
**接口约束**：无
**接口是否审批**：否
**URI**：`POST` `/api/bc/v2/createTrainingJob`
**Content-Type**：application/json
**请求体body参数**

| 参数 | 是否必填 | 参数类型 | 说明 | 示例 | 下级对象 |
| --- | --- | --- | --- | --- | --- |
| name | 是 | String | 并行计算作业名称,必须是小写字母开头、小写字母或数字结尾，中间由小写字母、数字或中划线（-）组成，长度为4-32个字符 | job-uo1we-ttt |  |
| trainingMode | 是 | String | 并行计算作业框架类型，当前仅支持MPI和PyTorch框架 | MPI |  |
| regionName | 是 | String | 可用区名称，可从可用区列表接口获取 | huhehaote-xxx |  |
| nodeConfigs | 是 | Array of Objects | 并行计算角色配置，不同的角色可设置不同的配置 |  | nodeConfig |
| storageConfigs | 否 | Array of Objects | 科研文件存储配置 |  | storageConfig |
| envConfigs | 否 | Map of String | 环境变量配置，键值对类型为String |  |  |
| queueId | 否 | Integer | 队列id，若未输入则选择该可用区下所属的一个队列，可从队列列表接口获取，但需选择和可用区所属的资源池相同的队列 |  |  |
| projectId | 否 | String | 企业项目id，默认为default项目，值为"0" | 0 |  |

**表 nodeConfig**

| 参数 | 是否必填 | 参数类型 | 说明 | 示例 | 下级对象 |
| --- | --- | --- | --- | --- | --- |
| specId | 是 | Integer | 资源规格id | 32 |  |
| instanceCount | 是 | Integer | 实例数量，输入范围需为1~99 |  |  |
| imageAddress | 是 | String | 角色配置镜像地址，不能为空，目前仅支持公网镜像，私有镜像或需要认证的镜像暂不支持 |  |  |
| startCommand | 否 | String | 启动命令 |  |  |

**表 storageConfig**

| 参数 | 是否必填 | 参数类型 | 说明 | 示例 | 下级对象 |
| --- | --- | --- | --- | --- | --- |
| mountPath | 是 | String | 挂载地址 |  |  |
| researchStorageConfigs | 是 | Object | 科研文件存储配置 |  | researchStorageConfigs |

**表 researchStorageConfigs**

| 参数 | 是否必填 | 参数类型 | 说明 | 示例 | 下级对象 |
| --- | --- | --- | --- | --- | --- |
| storageId | 是 | Integer | 科研文件id | 380 |  |

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
| requestId | String | request id | 6e4eff9f8e634a917ae1950bca1d71ad |  |
| status | Object | 状态信息 |  | status |
| instanceId | String | 并行计算作业实例id | 65bd64f404bf4c86b0f35c5bdbf60a57 |  |
| trainingJobId | String | 并行计算作业id | a96197bf87514378b7537a7a475f8e02 |  |

**表 status**

| 参数 | 参数类型 | 说明 | 示例 | 下级对象 |
| --- | --- | --- | --- | --- |
| code | String | 状态码 |  |  |
| message | String | 状态信息 |  |  |

**请求体body示例**：

```json
{
  "name" : "job-uo1we-ttt2",
  "trainingMode" : "MPI",
  "projectId" : "0",
  "envConfigs" : {
    "ENV_VAR_1" : "value1",
    "ENV_VAR_2" : "value2"
  },
  "regionName" : "huhehaote-xxx",
  "nodeConfigs" : [ {
    "imageAddress" : "public.xxx.com/public/cuda-11.7-torch2.0.0:v1.0.0",
    "startCommand" : "sleep 1800",
    "specId" : 4,
    "instanceCount" : 1
  } ],
  "storageConfigs" : [ {
    "mountPath" : "/tmp",
    "researchStorageConfigs" : {
      "storageId" : "380"
    }
  } ]
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
    "instanceId" : "65bd64f404bf4c86b0f35c5bdbf60a57",
    "trainingJobId" : "a96197bf87514378b7537a7a475f8e02"
  },
  "statusCode" : "200",
  "message" : "操作成功",
  "error" : ""
}
```
**流控信息**：1000

[官方文档](https://eop.ctyun.cn/ebp/ctapiDocument/search?sid=131&api=%E5%88%9B%E5%BB%BA%E5%B9%B6%E8%A1%8C%E8%AE%A1%E7%AE%97%E4%BD%9C%E4%B8%9A&data=187&vid=265)

---

## 删除并行计算作业（deleteTrainingJob）

删除并行计算作业

**接口功能介绍**：删除并行计算作业
**接口约束**：无
**接口是否审批**：否
**URI**：`POST` `/api/bc/v2/deleteTrainingJob`
**Content-Type**：application/json
**请求体body参数**

| 参数 | 是否必填 | 参数类型 | 说明 | 示例 | 下级对象 |
| --- | --- | --- | --- | --- | --- |
| trainingJobId | 是 | String | 并行计算作业id | 936fc8677d0049dfa9904415f93df7fb |  |

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
| requestId | String | request id | 6e4eff9f8e634a917ae1950bca1d71ad |  |
| status | Object | 状态信息 |  | status |
| instanceId | String | 并行计算作业实例id | 65bd64f404bf4c86b0f35c5bdbf60a57 |  |
| trainingJobId | String | 并行计算作业id | a96197bf87514378b7537a7a475f8e02 |  |

**表 status**

| 参数 | 参数类型 | 说明 | 示例 | 下级对象 |
| --- | --- | --- | --- | --- |
| code | String | 状态码 |  |  |
| message | String | 状态信息 |  |  |

**请求体body示例**：

```json
{
  "trainingJobId" : "a96197bf87514378b7537a7a475f8e02"
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
    "instanceId" : "65bd64f404bf4c86b0f35c5bdbf60a57",
    "trainingJobId" : "a96197bf87514378b7537a7a475f8e02"
  },
  "statusCode" : "200",
  "message" : "操作成功",
  "error" : ""
}
```
**流控信息**：1000

[官方文档](https://eop.ctyun.cn/ebp/ctapiDocument/search?sid=131&api=%E5%88%A0%E9%99%A4%E5%B9%B6%E8%A1%8C%E8%AE%A1%E7%AE%97%E4%BD%9C%E4%B8%9A&data=187&vid=265)

---

## 启动并行计算作业（startTrainingJob）

启动并行计算作业

**接口功能介绍**：启动并行计算作业
**接口约束**：无
**接口是否审批**：否
**URI**：`POST` `/api/bc/v2/startTrainingJob`
**Content-Type**：application/json
**请求体body参数**

| 参数 | 是否必填 | 参数类型 | 说明 | 示例 | 下级对象 |
| --- | --- | --- | --- | --- | --- |
| trainingJobId | 是 | String | 并行计算作业id | 936fc8677d0049dfa9904415f93df7fb |  |

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
| requestId | String | request id | 6e4eff9f8e634a917ae1950bca1d71ad |  |
| status | Object | 状态信息 |  | status |
| instanceId | String | 并行计算作业实例id | 65bd64f404bf4c86b0f35c5bdbf60a57 |  |
| trainingJobId | String | 并行计算作业id | a96197bf87514378b7537a7a475f8e02 |  |

**表 status**

| 参数 | 参数类型 | 说明 | 示例 | 下级对象 |
| --- | --- | --- | --- | --- |
| code | String | 状态码 |  |  |
| message | String | 状态信息 |  |  |

**请求体body示例**：

```json
{
  "trainingJobId" : "a96197bf87514378b7537a7a475f8e02"
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
    "instanceId" : "65bd64f404bf4c86b0f35c5bdbf60a57",
    "trainingJobId" : "a96197bf87514378b7537a7a475f8e02"
  },
  "statusCode" : "200",
  "message" : "操作成功",
  "error" : ""
}
```
**流控信息**：1000

[官方文档](https://eop.ctyun.cn/ebp/ctapiDocument/search?sid=131&api=%E5%90%AF%E5%8A%A8%E5%B9%B6%E8%A1%8C%E8%AE%A1%E7%AE%97%E4%BD%9C%E4%B8%9A&data=187&vid=265)

---

## 并行计算作业列表（listTrainingJobs）

并行计算作业列表

**接口功能介绍**：并行计算作业列表
**接口约束**：无
**接口是否审批**：否
**URI**：`POST` `/api/bc/v2/listTrainingJobs`
**Content-Type**：application/json
**请求体body参数**

| 参数 | 是否必填 | 参数类型 | 说明 | 示例 | 下级对象 |
| --- | --- | --- | --- | --- | --- |
| pageNum | 否 | Integer | 当前页，值大于等于0。pageNum或pageSize有一个不填或填0，则pageNum默认为1 | 1 |  |
| pageSize | 否 | Integer | 每页个数，值大于大于等于0且最大值为100。pageNum或pageSize有一个不填或填0，则pageSize默认为20 | 20 |  |
| name | 否 | String | 并行计算作业名称 | job-uo1we |  |
| state | 否 | Array of Strings | 并行计算作业状态的字符串数组，Stopping（停止中）/Starting（启动中）/Completed（已完成）/Failed（失败）/Abnormal（异常）/Running（运行中） |  |  |
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
| requestId | String | request id | 6e4eff9f8e634a917ae1950bca1d71ad |  |
| status | Object | 状态信息 |  | status |
| paging | Object | 分页偏移量，默认请求一页，每页二十个 |  | paging |
| trainingJobs | Array of Objects | 并行计算作业列表 |  | trainingJob |

**表 status**

| 参数 | 参数类型 | 说明 | 示例 | 下级对象 |
| --- | --- | --- | --- | --- |
| code | String | 状态码 |  |  |
| message | String | 状态信息 |  |  |

**表 trainingJob**

| 参数 | 参数类型 | 说明 | 示例 | 下级对象 |
| --- | --- | --- | --- | --- |
| name | String | 并行计算作业名称 | job-uo1we-ttt |  |
| trainingJobId | String | 并行计算作业id | trainingJob |  |
| instanceId | String | 并行计算作业实例的id，也是话单关联中的id，重启后会改变 | 0f576291e68e4f1ab5708e867c7d22a1 |  |
| regionName | String | 可用区名称 | huhehaote-xxx |  |
| regionId | Integer | 可用区id | 200 |  |
| trainingMode | String | 并行计算作业框架类型，当前支持MPI和PyTorch框架 | MPI |  |
| state | String | 并行计算作业状态， 支持状态 Queuing（排队中）/Pending（等待中）/Deleting（删除中）/Stopping（停止中）/Stopped（停止）/Starting（启动中）/Completed（已完成）/Failed（失败）/Abnormal（异常）/Running（运行中） | Running |  |
| nodeConfigs | Array of Objects | 并行计算角色配置，不同的角色可设置不同的配置 |  | nodeConfig |
| description | String | 描述 |  |  |
| createTime | String | 作业创建时间 |  |  |
| startTime | String | 作业开始运行时间 |  |  |
| endTime | String | 作业结束运行时间 |  |  |
| modifyTime | String | 作业更新时间 |  |  |
| projectId | String | 并行计算作业所属企业项目id | 0 |  |
| projectName | String | 并行计算作业所属企业项目名称，默认为 default | default |  |
| queueId | Integer | 并行计算所属队列id | 167 |  |

**表 nodeConfig**

| 参数 | 参数类型 | 说明 | 示例 | 下级对象 |
| --- | --- | --- | --- | --- |
| nodeRole | String | 角色 | Worker |  |
| specId | Integer | 资源规格id | 32 |  |
| instanceCount | Integer | 实例数量 |  |  |
| imageAddress | String | 角色配置镜像地址 |  |  |
| startCommand | String | 启动命令 |  |  |
| specType | String | 资源规格类型: GPU-GPU加速型， GENERAL-通用计算型， NPU-NPU加速型 |  |  |
| Cpu | Integer | CPU数量，单位为核 |  |  |
| Memory | Integer | 内存大小，单位为G |  |  |
| Gpu | Integer | GPU卡数量，单位为张 |  |  |
| gpuModel | String | GPU型号 |  |  |

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
  "pageNum" : 1,
  "pageSize" : 2,
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
    "paging" : {
      "totalPage" : 51,
      "page" : 1,
      "perPage" : 2,
      "totalRecord" : 101
    },
    "trainingJobs" : [ {
      "name" : "job-uo1we-ttt",
      "trainingJobId" : "936fc8677d0049dfa9904415f93df7fb",
      "instanceId" : "0f576291e68e4f1ab5708e867c7d22a1",
      "regionName" : "huhehaote-xxx",
      "regionId" : 200,
      "trainingMode" : "MPI",
      "state" : "Completed",
      "description" : "",
      "createTime" : "2025-03-13T15:57:00+08:00",
      "startTime" : "2025-03-13T16:04:30+08:00",
      "endTime" : "2025-03-13T16:36:38+08:00",
      "modifyTime" : "2025-03-13T16:04:29+08:00",
      "projectId" : "0",
      "projectName" : "default",
      "queueId" : 167,
      "nodeConfigs" : [ {
        "nodeRole" : "Worker",
        "specId" : 4,
        "instanceCount" : 1,
        "imageAddress" : "cuda-11.7-torch2.0.0:v1.0.0",
        "startCommand" : "sleep 1800;",
        "specType" : "GENERAL",
        "Cpu" : 1000,
        "Memory" : 2048,
        "Gpu" : 0,
        "gpuModel" : "CPU"
      } ]
    }, {
      "name" : "job-iob45",
      "trainingJobId" : "4de847dc9ee04d108b791cded1433370",
      "instanceId" : "8d757b7add0b43b8b0a80a67deb57779",
      "regionName" : "fuzhou-xxx",
      "regionId" : 205,
      "trainingMode" : "PyTorch",
      "state" : "Stopped",
      "description" : "",
      "createTime" : "2025-03-12T09:22:37+08:00",
      "startTime" : "",
      "endTime" : "",
      "modifyTime" : "2025-03-12T09:29:43+08:00",
      "projectId" : "0",
      "projectName" : "default",
      "nodeConfigs" : [ {
        "nodeRole" : "Worker",
        "specId" : 125,
        "instanceCount" : 1,
        "imageAddress" : "cuda-11.7-torch2.0.0:v1.0.0",
        "startCommand" : "python /opt/mnist/src/mnist.py --epochs=100",
        "specType" : "GENERAL",
        "Cpu" : 2000,
        "Memory" : 1024,
        "Gpu" : 0,
        "gpuModel" : "CPU"
      } ]
    } ]
  },
  "statusCode" : "200",
  "message" : "操作成功",
  "error" : ""
}
```
**流控信息**：1000

[官方文档](https://eop.ctyun.cn/ebp/ctapiDocument/search?sid=131&api=%E5%B9%B6%E8%A1%8C%E8%AE%A1%E7%AE%97%E4%BD%9C%E4%B8%9A%E5%88%97%E8%A1%A8&data=187&vid=265)

---

## 并行计算作业详情（getTrainingJob）

并行计算作业详情

**接口功能介绍**：并行计算作业详情
**接口约束**：无
**接口是否审批**：否
**URI**：`POST` `/api/bc/v2/getTrainingJob`
**Content-Type**：application/json
**请求体body参数**

| 参数 | 是否必填 | 参数类型 | 说明 | 示例 | 下级对象 |
| --- | --- | --- | --- | --- | --- |
| trainingJobId | 是 | String | 并行计算作业id | 936fc8677d0049dfa9904415f93df7fb |  |

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
| requestId | String | request id | 6e4eff9f8e634a917ae1950bca1d71ad |  |
| status | Object | 状态信息 |  | status |
| trainingJob | Object | 并行计算作业详情 |  | trainingJob |

**表 status**

| 参数 | 参数类型 | 说明 | 示例 | 下级对象 |
| --- | --- | --- | --- | --- |
| code | String | 状态码 |  |  |
| message | String | 状态信息 |  |  |

**表 trainingJob**

| 参数 | 参数类型 | 说明 | 示例 | 下级对象 |
| --- | --- | --- | --- | --- |
| name | String | 并行计算作业名称 | job-uo1we-ttt |  |
| trainingJobId | String | 并行计算作业id | trainingJob |  |
| instanceId | String | 并行计算作业实例id | 0f576291e68e4f1ab5708e867c7d22a1 |  |
| regionName | String | 可用区名称 | huhehaote-xxx |  |
| regionId | Integer | 可用区id | 200 |  |
| trainingMode | String | 并行计算作业框架类型，当前支持MPI和PyTorch框架 | MPI |  |
| state | String | 并行计算作业状态， 支持状态 Queuing（排队中）/Pending（等待中）/Deleting（删除中）/Stopping（停止中）/Stopped（停止）/Starting（启动中）/Completed（已完成）/Failed（失败）/Abnormal（异常）/Running（运行中） | Running |  |
| podList | Array of Objects | pod列表 |  | podInfo |
| nodeConfigs | Array of Objects | 并行计算角色配置，不同的角色可设置不同的配置 |  | nodeConfig |
| storageConfigs | Array of Objects | 科研文件存储配置 |  | storageConfig |
| envConfigs | Map of String | 环境变量配置，键值对类型为String |  |  |
| createTime | String | 作业创建时间 |  |  |
| startTime | String | 作业开始运行时间 |  |  |
| endTime | String | 作业结束运行时间 |  |  |
| modifyTime | String | 作业更新时间 |  |  |
| projectId | String | 并行计算作业所属企业项目id | 0 |  |
| projectName | String | 并行计算作业所属企业项目名称，默认为 default | default |  |
| queueId | Integer | 并行计算所属队列id | 167 |  |

**表 podInfo**

| 参数 | 参数类型 | 说明 | 示例 | 下级对象 |
| --- | --- | --- | --- | --- |
| podName | String | pod名称 | training-job-0f576291e68e4f1ab5708e867c7d22a1-launcher-lsw65 |  |
| podUid | String | pod的uid | a982248d-a637-4ab5-bc4a-258efda8c41d |  |
| state | String | pod状态 | Running |  |
| podIp | String | pod的ip | 10.0.224.105 |  |
| createTime | String | pod创建时间 |  |  |
| startTime | String | pod启动时间 |  |  |
| endTime | String | pod结束运行时间 |  |  |
| imageAddr | String | 镜像地址 | cuda-11.7-torch2.0.0:v1.0.0 |  |
| containerName | String | 容器名称 | mpi |  |

**表 nodeConfig**

| 参数 | 参数类型 | 说明 | 示例 | 下级对象 |
| --- | --- | --- | --- | --- |
| nodeRole | String | 角色 | Worker |  |
| specId | Integer | 资源规格id | 32 |  |
| instanceCount | Integer | 实例数量 |  |  |
| imageAddress | String | 角色配置镜像地址 |  |  |
| startCommand | String | 启动命令 |  |  |
| specType | String | 资源规格类型: GPU-GPU加速型， GENERAL-通用计算型， NPU-NPU加速型 |  |  |
| Cpu | Integer | CPU数量，单位为核 |  |  |
| Memory | Integer | 内存大小，单位为G |  |  |
| Gpu | Integer | GPU卡数量，单位为张 |  |  |
| gpuModel | String | GPU型号 |  |  |

**表 storageConfig**

| 参数 | 参数类型 | 说明 | 示例 | 下级对象 |
| --- | --- | --- | --- | --- |
| mountPath | String | 挂载地址 |  |  |
| researchStorageConfigs | Object | 科研文件存储配置 |  |  |

**表 researchStorageConfigs**

| 参数 | 参数类型 | 说明 | 示例 | 下级对象 |
| --- | --- | --- | --- | --- |
| storageId | Integer | 科研文件id | 380 |  |
| path | String | 科研文件存储挂载路径 |  |  |
| storageName | String | 科研文件存储名称 |  |  |

**请求体body示例**：

```json
{
  "trainingJobId" : "a96197bf87514378b7537a7a475f8e02"
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
    "trainingJob" : {
      "name" : "job-uo1we-ttt",
      "trainingJobId" : "936fc8677d0049dfa9904415f93df7fb",
      "instanceId" : "0f576291e68e4f1ab5708e867c7d22a1",
      "regionName" : "huhehaote-xxx",
      "regionId" : 200,
      "trainingMode" : "MPI",
      "state" : "Running",
      "projectId" : "0",
      "projectName" : "default",
      "queueId" : 167,
      "podList" : [ {
        "podName" : "training-job-0f576291e68e4f1ab5708e867c7d22a1-launcher-lsw65",
        "podUid" : "a982248d-a637-4ab5-bc4a-258efda8c41d",
        "state" : "Running",
        "podIp" : "10.0.224.105",
        "createTime" : "",
        "startTime" : "",
        "endTime" : "",
        "imageAddr" : "cuda-11.7-torch2.0.0:v1.0.0",
        "containerName" : "mpi"
      } ],
      "nodeConfigs" : [ {
        "nodeRole" : "Worker",
        "specId" : 4,
        "instanceCount" : 1,
        "imageAddress" : "cuda-11.7-torch2.0.0:v1.0.0",
        "startCommand" : "sleep 1800;",
        "specType" : "GENERAL",
        "Cpu" : 1000,
        "Memory" : 2048,
        "Gpu" : 0,
        "gpuModel" : "CPU"
      } ],
      "storageConfigs" : [ {
        "mountPath" : "/tmp",
        "researchStorageConfigs" : {
          "storageId" : 380,
          "path" : "/",
          "storageName" : "research-storage-ysjlhrwy"
        }
      } ],
      "envConfigs" : {
        "TEST_ENV" : "test"
      },
      "createTime" : "2025-03-13T16:04:30+08:00",
      "startTime" : "2025-03-13T16:04:30+08:00",
      "endTime" : "",
      "modifyTime" : "2025-03-13T16:04:50+08:00"
    }
  },
  "statusCode" : "200",
  "message" : "操作成功",
  "error" : ""
}
```
**流控信息**：1000

[官方文档](https://eop.ctyun.cn/ebp/ctapiDocument/search?sid=131&api=%E5%B9%B6%E8%A1%8C%E8%AE%A1%E7%AE%97%E4%BD%9C%E4%B8%9A%E8%AF%A6%E6%83%85&data=187&vid=265)

---

