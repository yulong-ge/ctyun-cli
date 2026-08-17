# 镜像 — 官方 API 3 个

> 来源：天翼云 OpenApi 能力开发平台（eop.ctyun.cn），产品「科研助手」(sid=131, service=bc)，API 版本 2023-10-11。
> 终端节点：`bc-global.ctapi.ctyun.cn`，签名认证：Eop-Authorization（见 [calling-guide.md](calling-guide.md)）。
> 本文件由官方文档 JSON 自动生成于 2026-08-17。

## 保存开发机镜像（saveIdeImage）

保存运行中的开发机镜像，将保存到个人的镜像仓库当中

**接口功能介绍**：保存运行中的开发机镜像，将保存到个人的镜像仓库当中
**接口约束**：需要先获取镜像组织名称，可通过调用自定义镜像组织列表接口获取
**接口是否审批**：否
**URI**：`POST` `/api/bc/v2/saveIdeImage`
**Content-Type**：application/json
**请求体body参数**

| 参数 | 是否必填 | 参数类型 | 说明 | 示例 | 下级对象 |
| --- | --- | --- | --- | --- | --- |
| ideId | 是 | Integer | 开发机id，值大于0 | 676 |  |
| orgRegionId | 是 | Integer | 组织区域id，可通过调用自定义镜像组织区域列表接口获取 | 1 |  |
| orgId | 是 | Integer | 镜像组织id，可通过调用自定义镜像组织列表接口获取 | 99 |  |
| imageName | 是 | String | 镜像名称：必须是小写字母、数字、下划线、中划线和点组成，其他字符不支持，且开头和结尾必须为小写字母和数字，长度为4-128个字符 | pytorch |  |
| imageTag | 是 | String | 镜像tag：必须是大小写字母、数字、下划线、中划线和点组成，其他字符不支持，且开头必须为大小写字母和数字，长度为2-128个字符 | v1 |  |

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
  "ideId" : 676,
  "orgRegionId" : 1,
  "orgId" : 99,
  "imageName" : "minimal-test",
  "imageTag" : "v0.0.2"
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

[官方文档](https://eop.ctyun.cn/ebp/ctapiDocument/search?sid=131&api=%E4%BF%9D%E5%AD%98%E5%BC%80%E5%8F%91%E6%9C%BA%E9%95%9C%E5%83%8F&data=187&vid=265)

---

## 自定义镜像组织区域列表（listCustomerImageOrgRegions）

自定义镜像组织区域列表

**接口功能介绍**：自定义镜像组织区域列表
**接口约束**：无
**接口是否审批**：否
**URI**：`POST` `/api/bc/v2/listCustomerImageOrgRegions`
**Content-Type**：application/json
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
| orgRegions | Array of Objects | 镜像组织区域列表信息 |  | orgRegion |
| requestId | String | 一个 API 请求的唯一标识 | 3251331e7ff2cb0d4149d9ab0cbfcd81 |  |
| status | Object | 状态信息 |  | status |

**表 orgRegion**

| 参数 | 参数类型 | 说明 | 示例 | 下级对象 |
| --- | --- | --- | --- | --- |
| orgRegionId | Integer | 组织区域id | 233 |  |
| orgRegionName | String | 组织区域名称 |  |  |
| registryUrl | String | 仓库名称 |  |  |

**表 status**

| 参数 | 参数类型 | 说明 | 示例 | 下级对象 |
| --- | --- | --- | --- | --- |
| code | String | 状态码 |  |  |
| message | String | 状态信息 |  |  |

**响应示例**：

```json
{
  "returnObj" : {
    "requestId" : "4aada82f978123e8698c681409b2ca8c",
    "status" : {
      "code" : "ok",
      "message" : "操作成功"
    },
    "orgRegions" : [ {
      "orgRegionId" : 2,
      "orgRegionName" : "测试区域1",
      "registryUrl" : "harbor-test.xxx.cn"
    }, {
      "orgRegionId" : 1,
      "orgRegionName" : "中心区域",
      "registryUrl" : "36.123.456.789:1180"
    } ]
  },
  "statusCode" : "200",
  "message" : "操作成功",
  "error" : ""
}
```
**流控信息**：1000

[官方文档](https://eop.ctyun.cn/ebp/ctapiDocument/search?sid=131&api=%E8%87%AA%E5%AE%9A%E4%B9%89%E9%95%9C%E5%83%8F%E7%BB%84%E7%BB%87%E5%8C%BA%E5%9F%9F%E5%88%97%E8%A1%A8&data=187&vid=265)

---

## 自定义镜像组织列表（listCustomerImageOrgs）

展示自定义镜像组织列表

**接口功能介绍**：展示自定义镜像组织列表
**接口约束**：无
**接口是否审批**：否
**URI**：`POST` `/api/bc/v2/listCustomerImageOrgs`
**Content-Type**：application/json
**请求体body参数**

| 参数 | 是否必填 | 参数类型 | 说明 | 示例 | 下级对象 |
| --- | --- | --- | --- | --- | --- |
| orgRegionId | 是 | Integer | 组织区域id，可通过调用自定义镜像组织区域列表接口获取 | 1 |  |

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
| orgs | Array of Objects | 镜像组织列表信息 |  | org |
| requestId | String | 一个 API 请求的唯一标识 | 3251331e7ff2cb0d4149d9ab0cbfcd81 |  |
| status | Object | 状态信息 |  | status |

**表 org**

| 参数 | 参数类型 | 说明 | 示例 | 下级对象 |
| --- | --- | --- | --- | --- |
| orgId | Integer | 镜像组织id | 99 |  |
| orgName | String | 镜像组织名称 | test |  |

**表 status**

| 参数 | 参数类型 | 说明 | 示例 | 下级对象 |
| --- | --- | --- | --- | --- |
| code | String | 状态码 |  |  |
| message | String | 状态信息 |  |  |

**请求体body示例**：

```json
{
  "orgRegionId" : 1
}
```
**响应示例**：

```json
{
  "returnObj" : {
    "orgs" : [ {
      "orgName" : "test",
      "orgId" : 99
    }, {
      "orgName" : "test2",
      "orgId" : 88
    } ],
    "requestId" : "09c6dc69700508442eebc0f1379c1c1c",
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

[官方文档](https://eop.ctyun.cn/ebp/ctapiDocument/search?sid=131&api=%E8%87%AA%E5%AE%9A%E4%B9%89%E9%95%9C%E5%83%8F%E7%BB%84%E7%BB%87%E5%88%97%E8%A1%A8&data=187&vid=265)

---

