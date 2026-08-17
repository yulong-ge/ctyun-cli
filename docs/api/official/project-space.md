# 项目空间 — 官方 API 1 个

> 来源：天翼云 OpenApi 能力开发平台（eop.ctyun.cn），产品「科研助手」(sid=131, service=bc)，API 版本 2023-10-11。
> 终端节点：`bc-global.ctapi.ctyun.cn`，签名认证：Eop-Authorization（见 [calling-guide.md](calling-guide.md)）。
> 本文件由官方文档 JSON 自动生成于 2026-08-17。

## 查询子账号账单明细（listUserBillDetail）

查询子用户账单明细。接口会返回账单明细和账单统计。

**接口功能介绍**：查询子用户账单明细。接口会返回账单明细和账单统计。
**接口约束**：1.账号需通过科研助手运营平台增加白名单才可以访问，可联系运营人员申请加入。2.主账号可直接调用；子账号调用该接口，需加入admin用户组。3.如遇到"请授权天翼云科研助手服务为您开通统一身份认证服务功能"的错误提示，需到控制台，点击”项目空间“授权。
**接口是否审批**：否
**URI**：`POST` `/api/bc/v2/listUserBillDetail`
**Content-Type**：application/json
**请求体body参数**

| 参数 | 是否必填 | 参数类型 | 说明 | 示例 | 下级对象 |
| --- | --- | --- | --- | --- | --- |
| pageNum | 否 | Integer | 当前页，值大于等于0。pageNum或pageSize有一个不填或填0，则pageNum默认为1 | 1 |  |
| pageSize | 否 | Integer | 每页个数，值大于大于等于0且最大值为100。pageNum或pageSize有一个不填或填0，则pageSize默认为20 | 20 |  |
| projectId | 是 | String | 企业项目id。企业项目id的获取接口，可参考 “统一身份认证“ 服务的相关接口 | 0 |  |
| ctyunUserId | 否 | String | 天翼云账号UserID, 不传值查主账号和所有子账号下的账单。天翼云账号UserID的获取接口，可参考 “统一身份认证“ 服务的相关接口 | 01243fxxxxxxx23423 |  |
| accountPeriod | 是 | String | 账期，输入形式是年月，查询粒度是月份，长度固定为6位 | 202509 |  |

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
| totalPage | Integer | 总页数 | 1 |  |
| billList | Array of Objects | 用户账单明细列表 |  | billList |
| userBillStatistics | Object | 账单统计， 只有查询第一页数据才会返回，即pageNum设置为1才会返回 |  | userBillStatistics |
| requestId | String | request id | 13637fd7907900926a9591631cda7ada |  |
| status | Object | 状态信息 |  | status |

**表 status**

| 参数 | 参数类型 | 说明 | 示例 | 下级对象 |
| --- | --- | --- | --- | --- |
| code | String | 状态码 |  |  |
| message | String | 状态信息 |  |  |

**表 billList**

| 参数 | 参数类型 | 说明 | 示例 | 下级对象 |
| --- | --- | --- | --- | --- |
| uuid | String | 账单uuid | 6802dedd-xxxx-xxxx-xxxx-e3cc8ea55cdf |  |
| ctyunAcctId | String | 天翼云账号AccountID | 1111cccxxxxxxx43543 |  |
| ctyunUserId | String | 天翼云账号UserID | 01243fxxxxxxx23423 |  |
| name | String | 用户名称 | xxxxx |  |
| email | String | 用户邮箱 | xxx@xxx.com |  |
| instanceName | String | 资源实例名称 | fake-name |  |
| chargingItem | String | 计费项 | MEM |  |
| resourceSpec | String | 资源规格 | 4G |  |
| projectName | String | 企业项目名称 | 企业项目A |  |
| usage | String | 资源用量 | 1.08 |  |
| payableAmount | String | 应付金额 | 0.021600 |  |
| billDate | String | 账单日期 | 2025-08-01 |  |

**表 userBillStatistics**

| 参数 | 参数类型 | 说明 | 示例 | 下级对象 |
| --- | --- | --- | --- | --- |
| uuid | String | 账单uuid | 6802dedd-xxxx-xxxx-xxxx-e3cc8ea55cdf |  |
| ctyunAcctId | String | 天翼云账号AccountID | 1111cccxxxxxxx43543 |  |
| ctyunUserId | String | 天翼云账号UserID | 01243fxxxxxxx23423 |  |
| instanceName | String | 资源实例名称 | fake-name |  |
| cpuUsage | String | CPU资源用量 | 60.98 |  |
| cpuAmount | String | CPU金额 | 3.797800 |  |
| memUsage | String | MEM资源用量 | 66.89 |  |
| memAmount | String | MEM金额 | 2.839000 |  |
| gpuUsage | String | GPU资源用量 | 30.65 |  |
| gpuAmount | String | GPU金额 | 384.768100 |  |
| storageUsage | String | 存储资源用量 | 12288 |  |
| storageAmount | String | 存储金额 | 3.022848 |  |
| totalAmount | String | 总金额 | 394.427748 |  |

**请求体body示例**：

```json
{
  "accountPeriod" : "202508",
  "projectId" : "7b3bb796a7404c8da0990be09273e9a5",
  "pageNum" : 1,
  "pageSize" : 10
}
```
**响应示例**：

```json
{
  "returnObj" : {
    "requestId" : "015af813f9ae484002fb02354c5a5b3a",
    "status" : {
      "code" : "ok",
      "message" : "操作成功"
    },
    "totalRecord" : 2,
    "totalPage" : 1,
    "billList" : [ {
      "uuid" : "6802dedd-xxxx-xxxx-xxxx-e3cc8ea55cdf",
      "ctyunAcctId" : "dc69a70xxxxx5555c4abbc18",
      "ctyunUserId" : "51955xxxxxxxafe9d2dcaa715114",
      "name" : "蔡xx",
      "email" : "c****2@chinatelecom.cn",
      "instanceName" : "research-storage-oon07j",
      "chargingItem" : "STO",
      "resourceSpec" : "BC_STO.特惠版",
      "projectName" : "企业项目A",
      "usage" : "12288",
      "payableAmount" : "3.022848",
      "billDate" : "2025-08-13"
    }, {
      "uuid" : "412543e9-xxxx-xxxx-xxxx-de6fd56d066c",
      "ctyunAcctId" : "dc69a70xxxxx5555c4abbc18",
      "ctyunUserId" : "51955xxxxxxxafe9d2dcaa715114",
      "name" : "蔡xx",
      "email" : "c****2@chinatelecom.cn",
      "instanceName" : "dev-env-e74rrc",
      "chargingItem" : "MEM",
      "resourceSpec" : "4G",
      "projectName" : "企业项目A",
      "usage" : "1.08",
      "payableAmount" : "0.021600",
      "billDate" : "2025-08-01"
    } ],
    "userBillStatistics" : {
      "uuid" : "da04ff47-xxxx-xxxx-xxxx-949c135aeff2",
      "ctyunAcctId" : "dc69a708dxxxxxxx555c4abbc18",
      "ctyunUserId" : "",
      "instanceName" : "",
      "cpuUsage" : "60.98",
      "cpuAmount" : "3.797800",
      "memUsage" : "66.89",
      "memAmount" : "2.839000",
      "gpuUsage" : "30.65",
      "gpuAmount" : "384.768100",
      "storageUsage" : "12288",
      "storageAmount" : "3.022848",
      "totalAmount" : "394.427748"
    }
  },
  "statusCode" : "200",
  "message" : "操作成功",
  "error" : ""
}
```
**流控信息**：1000

[官方文档](https://eop.ctyun.cn/ebp/ctapiDocument/search?sid=131&api=%E6%9F%A5%E8%AF%A2%E5%AD%90%E8%B4%A6%E5%8F%B7%E8%B4%A6%E5%8D%95%E6%98%8E%E7%BB%86&data=187&vid=265)

---

