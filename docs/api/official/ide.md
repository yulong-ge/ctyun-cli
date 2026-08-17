# 开发机（IDE）— 官方 API 14 个

> 来源：天翼云 OpenApi 能力开发平台（eop.ctyun.cn），产品「科研助手」(sid=131, service=bc)，API 版本 2023-10-11。
> 终端节点：`bc-global.ctapi.ctyun.cn`，签名认证：Eop-Authorization（见 [calling-guide.md](calling-guide.md)）。
> 本文件由官方文档 JSON 自动生成于 2026-08-17。

## 启动开发机（launchIde）

启动开发机

**接口功能介绍**：启动开发机
**接口约束**：无
**接口是否审批**：否
**URI**：`POST` `/api/bc/v2/launchIde`
**Content-Type**：application/json
**请求体body参数**

| 参数 | 是否必填 | 参数类型 | 说明 | 示例 | 下级对象 |
| --- | --- | --- | --- | --- | --- |
| ideId | 是 | Integer | 开发机id,值大于0 | 676 |  |
| autoStop | 否 | String | 是否自动停止：ON：开启，OFF：关闭  不填默认关闭 | ON |  |
| stopDuration | 否 | Integer | 自动停止持续时长 单位:h 如果选择非自动停止，需要填入 | 2 |  |
| sshEnabled | 否 | Boolean | 是否开启SSH登录，true-开启，false-不开启，默认不开启 | true |  |
| sshKeys | 否 | Array of Integers | ssh密钥列表,可通过调用【ssh公钥列表】获得，若开启SSH登录，该字段为必填项 | [21,22,16] |  |
| sshClientIps | 否 | String | SSH客户端IP白名单，格式为CIDR方式即“A.B.C.D/N”，若需要添加多个IP，以逗号分隔，不超过10条，若开启SSH登录，该字段为必填项 | 234.168.4.3/32,268.168.4.4/32 |  |
| dindEnabled | 否 | Boolean | 是否启用Docker，true-开启，false-不开启，默认不开启，若启用Docker必须必须配置本地存储挂载点，默认将分配全部GPU资源，自动占用除预留2核CPU/4GB内存外的所有计算资源 | true |  |

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
  "autoStop" : "ON",
  "stopDuration" : 2,
  "sshEnabled" : true,
  "sshKeys" : [ 21, 16, 10 ],
  "sshClientIps" : "234.168.4.3/32,268.168.4.4/32",
  "dindEnabled" : true
}
```
**响应示例**：

```json
{
  "returnObj" : {
    "requestId" : "5c8df34f6afc3f747787b112652211bc",
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

[官方文档](https://eop.ctyun.cn/ebp/ctapiDocument/search?sid=131&api=%E5%90%AF%E5%8A%A8%E5%BC%80%E5%8F%91%E6%9C%BA&data=187&vid=265)

---

## 停止开发机（stopIde）

停止开发机

**接口功能介绍**：停止开发机
**接口约束**：无
**接口是否审批**：否
**URI**：`POST` `/api/bc/v2/stopIde`
**Content-Type**：application/json
**请求体body参数**

| 参数 | 是否必填 | 参数类型 | 说明 | 示例 | 下级对象 |
| --- | --- | --- | --- | --- | --- |
| ideId | 是 | Integer | 开发机 id，值大于0 | 670 |  |

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
  "ideId" : 670
}
```
**响应示例**：

```json
{
  "returnObj" : {
    "requestId" : "2e3b7ba5679db4cc2fcf1f757485c503",
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

[官方文档](https://eop.ctyun.cn/ebp/ctapiDocument/search?sid=131&api=%E5%81%9C%E6%AD%A2%E5%BC%80%E5%8F%91%E6%9C%BA&data=187&vid=265)

---

## 开发机公共镜像列表（listPublicImages）

展示开发机公共镜像列表

**接口功能介绍**：展示开发机公共镜像列表
**接口约束**：无
**接口是否审批**：否
**URI**：`POST` `/api/bc/v2/listPublicImages`
**Content-Type**：application/json
**请求体body参数**

| 参数 | 是否必填 | 参数类型 | 说明 | 示例 | 下级对象 |
| --- | --- | --- | --- | --- | --- |
| pageNum | 否 | Integer | 当前页，值大于等于0。pageNum或pageSize有一个不填或填0，则pageNum默认为1 | 1 |  |
| pageSize | 否 | Integer | 每页个数，值大于大于等于0且最大值为100。pageNum或pageSize有一个不填或填0，则pageSize默认为20 | 20 |  |
| imageType | 否 | Integer | 镜像类型， 0：公共镜像 1：社区镜像，不传默认展示公共镜像 | 0 |  |

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
| images | Array of Objects | 镜像列表信息 |  | images |
| totalRecord | Integer | 总记录数 | 24 |  |
| requestId | String | 一个 API 请求的唯一标识 | 3251331e7ff2cb0d4149d9ab0cbfcd81 |  |
| status | Object | 状态信息 |  | status |

**表 images**

| 参数 | 参数类型 | 说明 | 示例 | 下级对象 |
| --- | --- | --- | --- | --- |
| aiFramework | String | ai框架类型: TENSORFLOW/PYTORCH/PADDLE/NONE | PYTORCH |  |
| createTime | String | 创建时间 | 2023-08-29T10:58:13+08:00 |  |
| cudaVersion | String | cuda版本号 | cuda11.1-torch1.8.1-gpu-monitor |  |
| descr | String | 描述 | 测试镜像架构与规格类型匹配关系 |  |
| ideType | String | ide类型：VsCode/Jupyter/VNC | Jupyter |  |
| imageAddr | String | 镜像地址 | harbor.ctyuncdn.cn/bc-test/pytorch-jupyter:cuda11.1-torch1.8.1-monitor |  |
| imageId | Integer | 镜像id，值大于0 | 4364 |  |
| name | String | 镜像名称 | pytorch-jupyter:cuda11.1-torch1.8.1-gpu-monitor |  |
| updateTime | String | 更新时间 | 2023-08-29T10:58:20+08:00 |  |
| arch | String | cpu架构: UNDEFINED x64 arm64 | x64 |  |
| features | Array of Strings | 特性 | ["Jupyter","runtime"] |  |
| labels | Array of Strings | 标签 | ["pytorch:1.11.0","cuda:11.3"] |  |
| productType | Array of Integers | 支持的产品规格类型，0-所有类型 1-GPU加速型 2-通用计算型  4-NPU型 6-DCU加速型 | [1, 2] |  |
| imageType | Integer | 镜像类型， 0：公共镜像 1：社区镜像 | 0 |  |

**表 status  **

| 参数 | 参数类型 | 说明 | 示例 | 下级对象 |
| --- | --- | --- | --- | --- |
| code | String | 状态码 |  |  |
| message | String | 状态信息 |  |  |

**请求体body示例**：

```json
{
  "imageType" : 0
}
```
**响应示例**：

```json
{
  "returnObj" : {
    "images" : [ {
      "aiFramework" : "NONE",
      "createTime" : "2024-08-28T15:06:06+08:00",
      "cudaVersion" : "-",
      "descr" : "测试大镜像",
      "ideType" : "Jupyter",
      "imageAddr" : "registry.cn-hangzhou.aliyuncs.com/hrn-images/pytorch:2.4.0-cuda11.8-cudnn9-devel",
      "imageId" : 4551,
      "name" : "test-large-image",
      "updateTime" : "2024-08-28T15:06:06+08:00",
      "arch" : "x64",
      "features" : [ "Jupyter", "runtime" ],
      "labels" : [ "pytorch:1.11.0", "cuda:11.3" ],
      "productType" : [ ],
      "imageType" : 0
    }, {
      "aiFramework" : "PYTORCH",
      "createTime" : "2024-07-31T15:13:46+08:00",
      "cudaVersion" : "cuda11.3-pytorch1.11.0",
      "descr" : "runtime镜像",
      "ideType" : "Jupyter",
      "imageAddr" : "harbor.ctyuncdn.cn/bc-test/jupyter-runtime:pytorch1.11.0-cuda11.3-cudnn8",
      "imageId" : 4544,
      "name" : "juypter-runtime-torch1.11.0",
      "updateTime" : "2024-08-13T13:35:49+08:00",
      "arch" : "x64",
      "features" : [ "Jupyter", "runtime" ],
      "labels" : [ "pytorch:1.11.0", "cuda:11.3" ],
      "productType" : [ ],
      "imageType" : 0
    }, {
      "aiFramework" : "PYTORCH",
      "createTime" : "2024-06-11T10:24:44+08:00",
      "cudaVersion" : "cuda11.1-pytorch1.8.1",
      "descr" : "ops-bc测试",
      "ideType" : "Jupyter",
      "imageAddr" : "harbor.ctyuncdn.cn/bc-test/minimal-jupyterlab:3.5.3",
      "imageId" : 4464,
      "name" : "minimal-jupyterlab",
      "updateTime" : "2024-08-13T11:06:16+08:00",
      "arch" : "x64",
      "features" : [ "Jupyter", "runtime" ],
      "labels" : [ "pytorch:1.11.0", "cuda:11.3" ],
      "productType" : [ ],
      "imageType" : 0
    }, {
      "aiFramework" : "PYTORCH",
      "createTime" : "2024-07-04T09:28:31+08:00",
      "cudaVersion" : "cuda14.4-pytorch1.13.1",
      "descr" : "测试镜像架构与规格类型匹配关系",
      "ideType" : "Jupyter",
      "imageAddr" : "harbor.ctyuncdn.cn/bc-test/minimal-jupyterlab:3.5.3",
      "imageId" : 4525,
      "name" : "minimal-test-amd64",
      "updateTime" : "2024-07-19T11:35:45+08:00",
      "arch" : "amd64",
      "features" : [ "Jupyter", "runtime" ],
      "labels" : [ "pytorch:1.11.0", "cuda:11.3" ],
      "productType" : [ ],
      "imageType" : 0
    }, {
      "aiFramework" : "PYTORCH",
      "createTime" : "2024-07-02T17:13:02+08:00",
      "cudaVersion" : "cuda11.1-pytorch1.8.1",
      "descr" : "测试镜像架构与规格类型匹配关系",
      "ideType" : "Jupyter",
      "imageAddr" : "harbor.ctyuncdn.cn/bc-test/minimal-jupyterlab:3.5.3",
      "imageId" : 4522,
      "name" : "minimal-test-arm64",
      "updateTime" : "2024-07-04T09:54:33+08:00",
      "arch" : "arm64",
      "features" : [ "Jupyter", "runtime" ],
      "labels" : [ "pytorch:1.11.0", "cuda:11.3" ],
      "productType" : [ ],
      "imageType" : 0
    }, {
      "aiFramework" : "NONE",
      "createTime" : "2024-06-27T14:14:05+08:00",
      "cudaVersion" : "-",
      "descr" : "假的，duhj1专用，测试拉取镜像超时",
      "ideType" : "VsCode",
      "imageAddr" : "harbor.ctyuncdn.cn/bc-test/vnc-matlab:fake",
      "imageId" : 4520,
      "name" : "to-test-timeout-fake-image",
      "updateTime" : "2024-06-27T14:14:14+08:00",
      "arch" : "arm64",
      "features" : [ "Jupyter", "runtime" ],
      "labels" : [ "pytorch:1.11.0", "cuda:11.3" ],
      "productType" : [ ],
      "imageType" : 0
    }, {
      "aiFramework" : "NONE",
      "createTime" : "2024-06-21T17:15:21+08:00",
      "cudaVersion" : "-",
      "descr" : "",
      "ideType" : "VNC",
      "imageAddr" : "harbor.ctyuncdn.cn/bc-test/vnc-matlab-simulink:v0.8",
      "imageId" : 4518,
      "name" : "matalb",
      "updateTime" : "2024-06-21T17:15:21+08:00",
      "arch" : "x64",
      "features" : [ "Jupyter", "runtime" ],
      "labels" : [ "pytorch:1.11.0", "cuda:11.3" ],
      "productType" : [ ],
      "imageType" : 0
    }, {
      "aiFramework" : "NONE",
      "createTime" : "2024-06-20T14:09:41+08:00",
      "cudaVersion" : "-",
      "descr" : "",
      "ideType" : "VNC",
      "imageAddr" : "harbor.ctyuncdn.cn/bc-test/vnc-matlab-simulink:v0.2",
      "imageId" : 4514,
      "name" : "matlab-equip-witch-sumulink",
      "updateTime" : "2024-06-20T14:09:41+08:00",
      "arch" : "x64",
      "features" : [ "Jupyter", "runtime" ],
      "labels" : [ "pytorch:1.11.0", "cuda:11.3" ],
      "productType" : [ ],
      "imageType" : 0
    }, {
      "aiFramework" : "NONE",
      "createTime" : "2023-12-19T11:39:52+08:00",
      "cudaVersion" : "-",
      "descr" : "缩减版jupyterlab，无cuda",
      "ideType" : "Jupyter",
      "imageAddr" : "harbor.ctyuncdn.cn/bc-test/minimal-jupyterlab:3.5.3",
      "imageId" : 4419,
      "name" : "pytorch-jupyter:cuda11.1-minimal-jupyter",
      "updateTime" : "2024-06-13T15:35:29+08:00",
      "arch" : "arm64",
      "features" : [ "Jupyter", "runtime" ],
      "labels" : [ "pytorch:1.11.0", "cuda:11.3" ],
      "productType" : [ ],
      "imageType" : 1
    }, {
      "aiFramework" : "PYTORCH",
      "createTime" : "2024-06-12T20:53:36+08:00",
      "cudaVersion" : "cuda11.1-pytorch1.18.1",
      "descr" : "测试minimal-jupyterlab",
      "ideType" : "Jupyter",
      "imageAddr" : "harbor.ctyuncdn.cn/bc-test/minimal-jupyterlab:3.5.3",
      "imageId" : 4502,
      "name" : "minimal-jupyterlab-test",
      "updateTime" : "2024-06-12T20:53:52+08:00",
      "arch" : "x64",
      "features" : [ "Jupyter", "runtime" ],
      "labels" : [ "pytorch:1.11.0", "cuda:11.3" ],
      "productType" : [ ],
      "imageType" : 1
    }, {
      "aiFramework" : "PYTORCH",
      "createTime" : "2024-06-12T14:06:17+08:00",
      "cudaVersion" : "cuda11.1-pytorch1.8.1",
      "descr" : "hrn test vscode in common user",
      "ideType" : "VsCode",
      "imageAddr" : "harbor.ctyuncdn.cn/bc-test/pytorch-vscode:cuda11.1-torch1.8.1",
      "imageId" : 4489,
      "name" : "pytorch-vscode-cuda11.1-torch1.8.1",
      "updateTime" : "2024-06-12T15:52:14+08:00",
      "arch" : "arm64",
      "features" : [ "Jupyter", "runtime" ],
      "labels" : [ "pytorch:1.11.0", "cuda:11.3" ],
      "productType" : [ ],
      "imageType" : 1
    }, {
      "aiFramework" : "PYTORCH",
      "createTime" : "2024-06-06T19:40:25+08:00",
      "cudaVersion" : "cuda11.1-pytorch1.13.1",
      "descr" : "",
      "ideType" : "Jupyter",
      "imageAddr" : "https://ehub.ctcdn.cn/test/jupyter:v4.0",
      "imageId" : 4460,
      "name" : "jupyter",
      "updateTime" : "2024-06-11T15:32:34+08:00",
      "arch" : "x64",
      "features" : [ "Jupyter", "runtime" ],
      "labels" : [ "pytorch:1.11.0", "cuda:11.3" ],
      "productType" : [ ],
      "imageType" : 1
    }, {
      "aiFramework" : "PYTORCH",
      "createTime" : "2024-05-31T14:44:31+08:00",
      "cudaVersion" : "cuda11.3-torch1.12.1",
      "descr" : "hrn test vnc with torch",
      "ideType" : "VNC",
      "imageAddr" : "harbor.ctyuncdn.cn/bc-test/vnc-ubuntu20.04-cuda11.3:torch1.12.1",
      "imageId" : 4455,
      "name" : "pytorch-vnc:cuda11.3-torch1.12.1",
      "updateTime" : "2024-05-31T14:44:31+08:00",
      "arch" : "x64",
      "features" : [ "Jupyter", "runtime" ],
      "labels" : [ "pytorch:1.11.0", "cuda:11.3" ],
      "productType" : [ ],
      "imageType" : 1
    }, {
      "aiFramework" : "NONE",
      "createTime" : "2024-05-29T11:26:56+08:00",
      "cudaVersion" : "-",
      "descr" : "",
      "ideType" : "VNC",
      "imageAddr" : "harbor.ctyuncdn.cn/bc-test/kasmvnccore-ubuntu-batchcom:focal-0529",
      "imageId" : 4451,
      "name" : "vnc",
      "updateTime" : "2024-05-29T11:26:56+08:00",
      "arch" : "arm64",
      "features" : [ "Jupyter", "runtime" ],
      "labels" : [ "pytorch:1.11.0", "cuda:11.3" ],
      "productType" : [ ],
      "imageType" : 1
    }, {
      "aiFramework" : "PYTORCH",
      "createTime" : "2024-05-23T16:43:00+08:00",
      "cudaVersion" : "cuda11.1-torch1.8.1",
      "descr" : "测试 python user agent",
      "ideType" : "Jupyter",
      "imageAddr" : "harbor.ctyuncdn.cn/bc-test/pytorch-jupyter:cuda11.1-cudnn8-lsp-v4",
      "imageId" : 4448,
      "name" : "pytorch-jupyter:cuda11.1-torch1.8.1",
      "updateTime" : "2024-05-23T16:43:00+08:00",
      "arch" : "arm64",
      "features" : [ "Jupyter", "runtime" ],
      "labels" : [ "pytorch:1.11.0", "cuda:11.3" ],
      "productType" : [ ],
      "imageType" : 1
    }, {
      "aiFramework" : "PYTORCH",
      "createTime" : "2023-11-07T13:45:10+08:00",
      "cudaVersion" : "cann7.0-torch1.8.1",
      "descr" : "ascend test",
      "ideType" : "Jupyter",
      "imageAddr" : "harbor.ctyuncdn.cn/bc-test/pytorch-jupyter:cann7.0-torch1.8.1-npu",
      "imageId" : 4393,
      "name" : "pytorch-jupyter:cann7.0-torch1.8.1",
      "updateTime" : "2024-05-21T16:36:38+08:00",
      "arch" : "arm64",
      "features" : [ "Jupyter", "runtime" ],
      "labels" : [ "pytorch:1.11.0", "cuda:11.3" ],
      "productType" : [ ],
      "imageType" : 1
    }, {
      "aiFramework" : "PYTORCH",
      "createTime" : "2024-03-18T20:12:15+08:00",
      "cudaVersion" : "cuda11.1-torch1.8.1-lspUser",
      "descr" : "",
      "ideType" : "Jupyter",
      "imageAddr" : "harbor.ctyuncdn.cn/bc-test/pytorch-jupyter:cuda11.1-cudnn8-lsp-user-v2",
      "imageId" : 4434,
      "name" : "pytorch-jupyter:cuda11.1-torch1.8.1-lspuser",
      "updateTime" : "2024-05-21T11:29:33+08:00",
      "arch" : "x64",
      "features" : [ "Jupyter", "runtime" ],
      "labels" : [ "pytorch:1.11.0", "cuda:11.3" ],
      "productType" : [ ],
      "imageType" : 1
    }, {
      "aiFramework" : "NONE",
      "createTime" : "2024-05-14T18:08:53+08:00",
      "cudaVersion" : "cuda1.13.1",
      "descr" : "test",
      "ideType" : "Jupyter",
      "imageAddr" : "harbor.ctyuncdn.cn/bc-test/minimal-jupyterlab:3.5.3",
      "imageId" : 4438,
      "name" : "jupyter:cuda1.13.1",
      "updateTime" : "2024-05-20T16:16:42+08:00",
      "arch" : "x64",
      "features" : [ "Jupyter", "runtime" ],
      "labels" : [ "pytorch:1.11.0", "cuda:11.3" ],
      "productType" : [ ],
      "imageType" : 1
    }, {
      "aiFramework" : "PYTORCH",
      "createTime" : "2024-03-22T10:16:46+08:00",
      "cudaVersion" : "cuda11.1-torch1.8.1-lsp",
      "descr" : "",
      "ideType" : "Jupyter",
      "imageAddr" : "harbor.ctyuncdn.cn/bc-test/pytorch-jupyter:cuda11.1-cudnn8-lsp-root-v1",
      "imageId" : 4435,
      "name" : "pytorch-jupyter:cuda11.1-torch1.8.1-lsp",
      "updateTime" : "2024-05-15T15:12:50+08:00",
      "arch" : "arm64",
      "features" : [ "Jupyter", "runtime" ],
      "labels" : [ "pytorch:1.11.0", "cuda:11.3" ],
      "productType" : [ ],
      "imageType" : 1
    }, {
      "aiFramework" : "PYTORCH",
      "createTime" : "2023-11-03T09:21:02+08:00",
      "cudaVersion" : "cann10.11-torch11.2",
      "descr" : "just for test",
      "ideType" : "Jupyter",
      "imageAddr" : "fake-cann",
      "imageId" : 4392,
      "name" : "pytorch-jupyter:cann10.11-torch11.2",
      "updateTime" : "2023-11-03T09:21:13+08:00",
      "arch" : "x64",
      "features" : [ "Jupyter", "runtime" ],
      "labels" : [ "pytorch:1.11.0", "cuda:11.3" ],
      "productType" : [ ],
      "imageType" : 1
    } ],
    "requestId" : "30b9ca28a9cbaa5f779cdcb9a3a980cd",
    "status" : {
      "code" : "ok",
      "message" : "操作成功"
    },
    "totalRecord" : 22
  },
  "statusCode" : "200",
  "message" : "操作成功",
  "error" : ""
}
```
**流控信息**：1000

[官方文档](https://eop.ctyun.cn/ebp/ctapiDocument/search?sid=131&api=%E5%BC%80%E5%8F%91%E6%9C%BA%E5%85%AC%E5%85%B1%E9%95%9C%E5%83%8F%E5%88%97%E8%A1%A8&data=187&vid=265)

---

## 删除开发机（deleteIde）

删除开发机

**接口功能介绍**：删除开发机
**接口约束**：无
**接口是否审批**：否
**URI**：`POST` `/api/bc/v2/deleteIde`
**Content-Type**：application/json
**请求体body参数**

| 参数 | 是否必填 | 参数类型 | 说明 | 示例 | 下级对象 |
| --- | --- | --- | --- | --- | --- |
| ideId | 是 | Integer | 开发机 id,值大于0 | 667 |  |

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
  "ideId" : 1777
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

[官方文档](https://eop.ctyun.cn/ebp/ctapiDocument/search?sid=131&api=%E5%88%A0%E9%99%A4%E5%BC%80%E5%8F%91%E6%9C%BA&data=187&vid=265)

---

## SSH创建公钥（createPublicKey）

公钥创建，用户可以通过该接口创建公钥。

**接口功能介绍**：公钥创建，用户可以通过该接口创建公钥。
**接口约束**：无
**接口是否审批**：否
**URI**：`POST` `/api/bc/v2/createPublicKey`
**Content-Type**：application/json
**请求体body参数**

| 参数 | 是否必填 | 参数类型 | 说明 | 示例 | 下级对象 |
| --- | --- | --- | --- | --- | --- |
| publicKey | 是 | String | 公钥原内容，用户输入的原内容，未经base64编码 | ssh-rsa AAAAB3NzaC1yc2EAAADAQEB |  |
| name | 是 | String | 公钥名称, 4-32位数，以小写字母开头、小写字母或数字结尾，中间以小写字母、数字或中划线（-）组成 | test0417 |  |

**响应参数**

| 参数 | 参数类型 | 说明 | 示例 | 下级对象 |
| --- | --- | --- | --- | --- |
| statusCode | String | 返回码取值范围：200 成功，400失败 | 200 |  |
| message | String | 返回信息 | 操作成功 |  |
| returnObj | Object | 返回对象 |  | returnObj |
| error | String | 错误码信息 |  |  |

**表 returnObj**

| 参数 | 参数类型 | 说明 | 示例 | 下级对象 |
| --- | --- | --- | --- | --- |
| requestId | String | 一个 API 请求的唯一标识 | 2e3b7ba5679db4cc2fcf1f757485c503 |  |
| id | Integer | ssh 公钥id | 24 |  |
| status | Object | 状态信息 |  | status |

**表 status**

| 参数 | 参数类型 | 说明 | 示例 | 下级对象 |
| --- | --- | --- | --- | --- |
| code | String | 状态码 |  |  |
| message | String | 状态信息 |  |  |

**请求url示例**：

```json
/bc/v2/createPublicKey
```
**请求体body示例**：

```json
{
  "publicKey" : "ssh-rsa AAAAB3NzaC1yc2EAAADAQEB",
  "name" : "test0417"
}
```
**响应示例**：

```json
{
  "returnObj" : {
    "id" : 24,
    "requestId" : "2e3b7ba5679db4cc2fcf1f757485c503",
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

[官方文档](https://eop.ctyun.cn/ebp/ctapiDocument/search?sid=131&api=SSH%E5%88%9B%E5%BB%BA%E5%85%AC%E9%92%A5&data=187&vid=265)

---

## SSH删除公钥（deletePublicKey）

删除公钥，公钥没有被使用时，才可进行删除

**接口功能介绍**：删除公钥，公钥没有被使用时，才可进行删除
**接口约束**：无
**接口是否审批**：否
**URI**：`POST` `/api/bc/v2/deletePublicKey`
**Content-Type**：application/json
**请求体body参数**

| 参数 | 是否必填 | 参数类型 | 说明 | 示例 | 下级对象 |
| --- | --- | --- | --- | --- | --- |
| id | 是 | Integer | ssh 公钥id，可通过调用【ssh公钥列表】获得 | 24 |  |

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

**请求url示例**：

```json
/bc/v2/deletePublicKey
```
**请求体body示例**：

```json
{
  "id" : 24
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

[官方文档](https://eop.ctyun.cn/ebp/ctapiDocument/search?sid=131&api=SSH%E5%88%A0%E9%99%A4%E5%85%AC%E9%92%A5&data=187&vid=265)

---

## SSH公钥列表（listPublicKeys）

展示公钥列表，支持分页展示

**接口功能介绍**：展示公钥列表，支持分页展示
**接口约束**：无
**接口是否审批**：否
**URI**：`POST` `/api/bc/v2/listPublicKeys`
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
| returnObj | Object | 返回对象 |  | returnObj |
| error | String | 错误码信息 |  |  |

**表 returnObj**

| 参数 | 参数类型 | 说明 | 示例 | 下级对象 |
| --- | --- | --- | --- | --- |
| publicKeyInfo | Array of Objects | 公钥内容 |  | publicKeyInfo |
| requestId | String | 一个 API 请求的唯一标识 | 32fdfb01489a9034218405a112b24126 |  |
| status | Object | ResponseStatus 请求返回状态，success对应http状态码200, InternalError对应http状态码500 |  | status |
| paging | Object | 分页偏移量，默认请求一页，每页二十个 |  | paging |

**表 publicKeyInfo**

| 参数 | 参数类型 | 说明 | 示例 | 下级对象 |
| --- | --- | --- | --- | --- |
| publicKey | String | 公钥内容，通过base64编码后的值(将创建时输入的公钥内容经过编码后展示) | c0OFZGe2QnZMNjRzZlJUMHBNak90Q2lJWEcwOUU9IHJvb3RASFJO |  |
| id | Integer | ssh 公钥id | 24 |  |
| name | String | 公钥的别名 | test-supervisor |  |
| createTime | String | 创建时间 | 2025-02-26T13:05:47+08:00 |  |
| modifyTime | String | 更新时间 | 2025-02-26T13:05:47+08:00 |  |
| bindingIdeInfo | Array of Objects | 绑定的ide信息,一个公钥可绑定多个ide，ide信息包含ideId和ideName |  | bindingIdeInfo |

**表 bindingIdeInfo**

| 参数 | 参数类型 | 说明 | 示例 | 下级对象 |
| --- | --- | --- | --- | --- |
| ideId | Integer | 开发机id | 10000874 |  |
| ideName | String | 开发机名称 | dev-env-upw7g |  |

**表 paging**

| 参数 | 参数类型 | 说明 | 示例 | 下级对象 |
| --- | --- | --- | --- | --- |
| totalPage | Integer | 总页数 | 1 |  |
| page | Integer | 当前页数 | 1 |  |
| perPage | Integer | 每页显示的记录条数 | 20 |  |
| totalRecord | Integer | 总记录数 | 1 |  |

**表 status**

| 参数 | 参数类型 | 说明 | 示例 | 下级对象 |
| --- | --- | --- | --- | --- |
| code | String | 状态码 |  |  |
| message | String | 状态信息 |  |  |

**请求url示例**：

```json
/bc/v2/listPublicKeys
```
**请求体body示例**：

```json
{
  "pageNum" : 1,
  "pageSize" : 20
}
```
**响应示例**：

```json
{
  "returnObj" : {
    "publicKeyInfo" : [ {
      "publicKey" : "c0OFZGe2QnZMNjRzZlJUMHBNak90Q2lJWEcwOUU9IHJvb3RASFJO",
      "id" : 21,
      "name" : "test-supervisor",
      "createTime" : "2025-02-26T13:05:47+08:00",
      "modifyTime" : "2025-02-26T13:05:47+08:00",
      "bindingIdeInfo" : [ {
        "ideId" : "10000874",
        "ideName" : "dev-env-upw7g"
      }, {
        "ideId" : "10000878",
        "ideName" : "dev-env-uoa05"
      }, {
        "ideId" : "10000899",
        "ideName" : "dev-env-biihx"
      } ]
    } ],
    "paging" : {
      "totalPage" : 1,
      "page" : 1,
      "perPage" : 20,
      "totalRecord" : 1
    },
    "requestId" : "3b1f6a12636133f836f18950a4c4c012",
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

[官方文档](https://eop.ctyun.cn/ebp/ctapiDocument/search?sid=131&api=SSH%E5%85%AC%E9%92%A5%E5%88%97%E8%A1%A8&data=187&vid=265)

---

## 更新开发机SSH客户端IP白名单（updateSSHClientIPs）

更新开发机SSH客户端IP白名单,要求开发机为启动状态，并开启SSH服务

**接口功能介绍**：更新开发机SSH客户端IP白名单,要求开发机为启动状态，并开启SSH服务
**接口约束**：无
**接口是否审批**：否
**URI**：`POST` `/api/bc/v2/updateSSHClientIPs`
**Content-Type**：application/json
**请求体body参数**

| 参数 | 是否必填 | 参数类型 | 说明 | 示例 | 下级对象 |
| --- | --- | --- | --- | --- | --- |
| ideId | 是 | Integer | 开发机id，值大于0 | 676 |  |
| sshClientIps | 是 | String | SSH客户端IP白名单，格式为CIDR方式即“A.B.C.D/N”，若需要添加多个IP，以逗号分隔，不超过10条 | 234.168.4.3/32,268.168.4.4/32 |  |

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
  "ideId" : 1776,
  "sshClientIps" : "192.168.4.3/32,192.168.4.4/32"
}
```
**响应示例**：

```json
{
  "returnObj" : {
    "requestId" : "32fdfb01489a9034218405a112b24126",
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

[官方文档](https://eop.ctyun.cn/ebp/ctapiDocument/search?sid=131&api=%E6%9B%B4%E6%96%B0%E5%BC%80%E5%8F%91%E6%9C%BASSH%E5%AE%A2%E6%88%B7%E7%AB%AFIP%E7%99%BD%E5%90%8D%E5%8D%95&data=187&vid=265)

---

## 更新开发机镜像（updateIdeImage）

停止状态的开发机，支持更换镜像

**接口功能介绍**：停止状态的开发机，支持更换镜像
**接口约束**：无
**接口是否审批**：否
**URI**：`POST` `/api/bc/v2/updateIdeImage`
**Content-Type**：application/json
**请求体body参数**

| 参数 | 是否必填 | 参数类型 | 说明 | 示例 | 下级对象 |
| --- | --- | --- | --- | --- | --- |
| ideId | 是 | Integer | 开发机id，值大于0 | 676 |  |
| imageId | 是 | Integer | 镜像id，值大于0 | 1 |  |
| imageType | 否 | Integer | 镜像类型只能为整型0/1/2，其中0为公共镜像，1为社区镜像，2为自定义镜像，不传默认为公共镜像（公共镜像和社区镜像可通过【开发机公共镜像列表】查询，自定义镜像可通过【自定义开发机镜像列表】查询） | 0 |  |

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
  "ideId" : 1776,
  "imageId" : 4519,
  "imageType" : 2
}
```
**响应示例**：

```json
{
  "returnObj" : {
    "requestId" : "32fdfb01489a9034218405a112b24126",
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

[官方文档](https://eop.ctyun.cn/ebp/ctapiDocument/search?sid=131&api=%E6%9B%B4%E6%96%B0%E5%BC%80%E5%8F%91%E6%9C%BA%E9%95%9C%E5%83%8F&data=187&vid=265)

---

## 开发机列表（listIdes）

展示开发机列表

**接口功能介绍**：展示开发机列表
**接口约束**：无
**接口是否审批**：否
**URI**：`POST` `/api/bc/v2/listIdes`
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
| ides | Array of Objects | ide 列表信息 |  | ides |
| totalRecord | Integer | 总记录数 | 1 |  |
| requestId | String | 一个 API 请求的唯一标识 | 3251331e7ff2cb0d4149d9ab0cbfcd81 |  |
| status | Object | 状态信息 |  | status |

**表 ides**

| 参数 | 参数类型 | 说明 | 示例 | 下级对象 |
| --- | --- | --- | --- | --- |
| activeDuration | Integer | 运行时长，单位：h | 11 |  |
| createTime | String | 创建时间 | 2023-09-07T18:05:21+08:00 |  |
| description | String | 开发机简介 |  |  |
| id | Integer | 开发机id，也是话单关联中的id | 670 |  |
| ideName | String | ide 名称 | test |  |
| ideType | String | ide类型: VsCode /Jupyter /VNC | Jupyter |  |
| imageId | Integer | 镜像id | 4364 |  |
| isFreezed | Boolean | 是否冻结 | false |  |
| openLink | String | 打开ide的跳转链接 | /bc/v2/Jupyter/ea014521e3614d1ea6d6abc42cef4821/?token=xxx |  |
| queueId | Integer | 队列id | 167 |  |
| regionName | String | 可选区域名称 | fuzhou-6 |  |
| resourceSpecific | Object | 资源规格 |  | resourceSpecific |
| specId | Integer | 资源规格id | 1 |  |
| state | String | 开发机状态： CREATING: 待创建 ，LAUNCHING：启动中 ，RUNNING：运行中 ，STOPPED：暂停 ，SUCCEEDED：成功， FAILED： 失败，  IMAGE_SAVING: 镜像保存中 ，DELETING-删除中，STOPPING-停止中 | CREATING |  |
| token | String | token | xxx |  |
| urlReady | Boolean | 访问链接是否就绪 | false |  |
| arch | String | cpu架构:  x64/arm64 | x64 |  |
| framework | String | 框架版本 | minimal-jupyterlab-test |  |
| uuid | String | uuid，与话单关联的是开发机id，不是uuid | 2e9f0ee561564cb2ad5ba0c94569e747 |  |
| autoStop | String | 是否自动停止：ON：开启，OFF：关闭 | ON |  |
| stopDuration | Integer | 自动停止持续时长 单位:h | 2 |  |
| projectId | String | 开发机企业项目id | 0 |  |
| projectName | String | 开发机所属项目名称，默认为 default | default |  |
| sshEnabled | Boolean | 是否开启SSH登录，true-开启，false-不开启，默认不开启 | false |  |
| sshKeys | Array of Objects | ssh密钥信息 |  | sshKey |
| sshClientIps | String | SSH客户端IP白名单，格式为CIDR方式即“A.B.C.D/N”，若需要添加多个IP，以逗号分隔，不超过10条 | 234.168.4.3/32,268.168.4.4/32 |  |
| sshCommand | String | ssh命令 | ssh -p 30004 batchcom@234.168.10.13 |  |
| dindEnabled | Boolean | 是否启用Docker，true-开启，false-不开启 | true |  |
| dindInfo | Object | 启用Docker分配的GPU、CPU与内存信息，不启用Docker时为空 |  | dindInfo |

**表 resourceSpecific**

| 参数 | 参数类型 | 说明 | 示例 | 下级对象 |
| --- | --- | --- | --- | --- |
| gpuModel | String | gpu型号，共享资源池类型参数 | CPU |  |
| quotaCpu | Integer | 资源池配额CPU/核 | 1 |  |
| quotaGpu | Integer | 资源池配额GPU/卡 | 0 |  |
| quotaMem | Integer | 资源池配额内存/G | 2 |  |
| specType | String | 资源规格类型： GPU-GPU加速型， GENERAL-通用计算型 | GPU |  |

**表 dindInfo**

| 参数 | 参数类型 | 说明 | 示例 | 下级对象 |
| --- | --- | --- | --- | --- |
| quotaCpu | Integer | CPU/核 | 2 |  |
| quotaGpu | Integer | GPU/卡 | 4 |  |
| quotaMem | Integer | 内存/G | 50 |  |

**表 sshKey**

| 参数 | 参数类型 | 说明 | 示例 | 下级对象 |
| --- | --- | --- | --- | --- |
| name | String | 公钥名称 | test-supervisor |  |
| id | Integer | ssh 公钥id | 21 |  |

**表 status**

| 参数 | 参数类型 | 说明 | 示例 | 下级对象 |
| --- | --- | --- | --- | --- |
| code | String | 状态码 |  |  |
| message | String | 状态信息 |  |  |

**请求体body示例**：

```json
{
  "pageNum" : 1,
  "pageSize" : 20
}
```
**响应示例**：

```json
{
  "returnObj" : {
    "ides" : [ {
      "activeDuration" : 0,
      "arch" : "x64",
      "createTime" : "2024-06-24T11:23:04+08:00",
      "description" : "",
      "framework" : "minimal-jupyterlab-test",
      "id" : 1785,
      "ideName" : "ttttttt1",
      "ideType" : "Jupyter",
      "imageId" : 4502,
      "isFreezed" : false,
      "leftTime" : 0,
      "openLink" : "http://hn-002.esx-nm-develop.ctyun.xyz:1180/bc/v1/Jupyter/d06c39042f8a407887dcfabf59f631bc/?token=xxx",
      "queueId" : 293,
      "regionName" : "fuzhou-6",
      "projectId" : "0",
      "projectName" : "default",
      "sshEnabled" : true,
      "sshKeys" : [ {
        "name" : "test-supervisor",
        "id" : 21
      } ],
      "sshClientIps" : "234.168.4.3/32,268.168.4.4/32",
      "sshCommand" : "ssh -p 30004 batchcom@234.63.10.13",
      "resourceSpecific" : {
        "gpuModel" : "CPU",
        "quotaCpu" : 1,
        "quotaGpu" : 0,
        "quotaMem" : 1,
        "specType" : "GENERAL"
      },
      "specId" : 3041,
      "state" : "STOPPED",
      "token" : "xxx",
      "urlReady" : false,
      "uuid" : "2e9f0ee561564cb2ad5ba0c94569e747",
      "autoStop" : "ON",
      "stopDuration" : 2,
      "dindEnabled" : true,
      "dindInfo" : {
        "quotaCpu" : 2,
        "quotaGpu" : 4,
        "quotaMem" : 50
      }
    } ],
    "requestId" : "3b1f6a12636133f836f18950a4c4c012",
    "status" : {
      "code" : "ok",
      "message" : "操作成功"
    },
    "totalRecord" : 5
  },
  "statusCode" : "200",
  "message" : "操作成功",
  "error" : ""
}
```
**流控信息**：1000

[官方文档](https://eop.ctyun.cn/ebp/ctapiDocument/search?sid=131&api=%E5%BC%80%E5%8F%91%E6%9C%BA%E5%88%97%E8%A1%A8&data=187&vid=265)

---

## 自定义开发机镜像列表（listCustomerIdeImages）

展示自定义开发机镜像列表

**接口功能介绍**：展示自定义开发机镜像列表
**接口约束**：无
**接口是否审批**：否
**URI**：`POST` `/api/bc/v2/listCustomerIdeImages`
**Content-Type**：application/json
**请求体body参数**

| 参数 | 是否必填 | 参数类型 | 说明 | 示例 | 下级对象 |
| --- | --- | --- | --- | --- | --- |
| pageNum | 否 | Integer | 当前页，非负数。不填或传0值则默认为1 | 1 |  |
| pageSize | 否 | Integer | 每页个数，非负数，且最大值为100。不填或传0值则默认为20 | 20 |  |
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
| images | Array of Objects | 镜像列表信息 |  | images |
| totalRecord | Integer | 总记录数 | 24 |  |
| requestId | String | 一个 API 请求的唯一标识 | 3251331e7ff2cb0d4149d9ab0cbfcd81 |  |
| status | Object | 状态信息 |  | status |

**表 images**

| 参数 | 参数类型 | 说明 | 示例 | 下级对象 |
| --- | --- | --- | --- | --- |
| aiFramework | String | AI框架类型，例如TensorFlow、PyTorch和Paddle等 | PyTorch |  |
| createTime | String | 创建时间 | 2023-08-29T10:58:13+08:00 |  |
| cudaVersion | String | CUDA版本号 | cuda11.1-torch1.8.1-gpu-monitor |  |
| ideType | String | 开发机类型，例如VsCode、Jupyter和VNC | Jupyter |  |
| imageAddr | String | 镜像地址 | harbor.ctyuncdn.cn/bc-test/pytorch-jupyter:cuda11.1-torch1.8.1-monitor |  |
| imageId | Integer | 镜像id | 4364 |  |
| imageTag | String | 镜像tag | v1 |  |
| name | String | 镜像名称 | pytorch-jupyter |  |
| orgName | String | 镜像组织名称 | test |  |
| state | String | 镜像状态：SAVING-保存中， SUCCESS-成功，FAILED-失败， SHARED-共享中， ABNORMAL-异常 | SUCCESS |  |
| updateTime | String | 更新时间 | 2023-08-29T10:58:20+08:00 |  |
| arch | String | cpu架构: UNDEFINED x64 arm64 | 1 |  |
| features | Array of Strings | 特性 | ["Jupyter","runtime"] |  |
| labels | Array of Strings | 标签 | ["pytorch:1.11.0","cuda:11.3"] |  |
| productType | Array of Integers | 支持的产品规格类型，0-所有类型 1-GPU加速型 2-通用计算型  4-NPU型 6-DCU加速型 | [1, 2] |  |

**表 status**

| 参数 | 参数类型 | 说明 | 示例 | 下级对象 |
| --- | --- | --- | --- | --- |
| code | String | 状态码 |  |  |
| message | String | 状态信息 |  |  |

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
    "images" : [ {
      "aiFramework" : "PyTorch",
      "createTime" : "2024-07-03T17:53:40+08:00",
      "cudaVersion" : "cuda11.1-torch1.8.1-gpu-monitor",
      "ideType" : "Jupyter",
      "imageAddr" : "36.123.456.789:1180/xxx-test-1/abc:v22",
      "imageId" : 208,
      "imageTag" : "re",
      "name" : "e",
      "orgName" : "xxx-test-1",
      "state" : "SAVING",
      "updateTime" : "2024-07-03T17:53:40+08:00",
      "arch" : "x64",
      "features" : [ "Jupyter", "runtime" ],
      "labels" : [ "pytorch:1.11.0", "cuda:11.3" ],
      "productType" : [ ]
    }, {
      "aiFramework" : "NONE",
      "createTime" : "2024-07-03T16:06:20+08:00",
      "cudaVersion" : "-",
      "ideType" : "Jupyter",
      "imageAddr" : "36.123.456.789:1180/org1/test:v2.98",
      "imageId" : 206,
      "imageTag" : "rer",
      "name" : "trter",
      "orgName" : "tets",
      "state" : "SUCCESS",
      "updateTime" : "2024-07-03T17:51:16+08:00",
      "arch" : "arm64",
      "features" : [ "Jupyter", "runtime" ],
      "labels" : [ "pytorch:1.11.0", "cuda:11.3" ],
      "productType" : [ ]
    } ],
    "requestId" : "4aada82f978123e8698c681409b2ca8c",
    "status" : {
      "code" : "ok",
      "message" : "操作成功"
    },
    "totalRecord" : 2
  },
  "statusCode" : "200",
  "message" : "操作成功",
  "error" : ""
}
```
**流控信息**：1000

[官方文档](https://eop.ctyun.cn/ebp/ctapiDocument/search?sid=131&api=%E8%87%AA%E5%AE%9A%E4%B9%89%E5%BC%80%E5%8F%91%E6%9C%BA%E9%95%9C%E5%83%8F%E5%88%97%E8%A1%A8&data=187&vid=265)

---

## 删除自定义开发机镜像（deleteCustomerIdeImage）

删除自定义开发机镜像

**接口功能介绍**：删除自定义开发机镜像
**接口约束**：无
**接口是否审批**：否
**URI**：`POST` `/api/bc/v2/deleteCustomerIdeImage`
**Content-Type**：application/json
**请求体body参数**

| 参数 | 是否必填 | 参数类型 | 说明 | 示例 | 下级对象 |
| --- | --- | --- | --- | --- | --- |
| imageId | 是 | Integer | 镜像id，值大于0 | 667 |  |

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
  "imageId" : 1777
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

[官方文档](https://eop.ctyun.cn/ebp/ctapiDocument/search?sid=131&api=%E5%88%A0%E9%99%A4%E8%87%AA%E5%AE%9A%E4%B9%89%E5%BC%80%E5%8F%91%E6%9C%BA%E9%95%9C%E5%83%8F&data=187&vid=265)

---

## 创建开发机（createIde）

创建开发机，创建之后的开发机的状态会处于待创建，启动中直至运行中

**接口功能介绍**：创建开发机，创建之后的开发机的状态会处于待创建，启动中直至运行中
**接口约束**：无
**接口是否审批**：否
**URI**：`POST` `/api/bc/v2/createIde`
**Content-Type**：application/json
**请求体body参数**

| 参数 | 是否必填 | 参数类型 | 说明 | 示例 | 下级对象 |
| --- | --- | --- | --- | --- | --- |
| imageId | 是 | Integer | 镜像id，值大于0 | 4364 |  |
| name | 是 | String | 开发机名称：必须是小写字母开头、小写字母或数字结尾，中间由小写字母、数字或中划线（-）组成，长度为4-32个字符 | test |  |
| queueId | 是 | Integer | 队列id，值大于0 | 167 |  |
| regionName | 是 | String | 可用区名称 | jiangsu-nanjing-2 |  |
| specId | 是 | Integer | 资源规格id，值大于0 | 4 |  |
| researchStorageInfo | 否 | Array of Objects | 科研文件存储信息, 注意挂载数量上限为2个 |  | researchStorageInfo |
| projectId | 否 | String | 企业项目id，默认为default项目，值为"0" | 0 |  |
| autoStop | 否 | String | 是否自动停止：ON：开启，OFF：关闭  不填默认关闭 | ON |  |
| stopDuration | 否 | Integer | 自动停止持续时长 单位:h 如果选择非自动停止，需要填入 | 2 |  |
| sshEnabled | 否 | Boolean | 是否开启SSH登录，true-开启，false-不开启，默认不开启 | true |  |
| sshKeys | 否 | Array of Integers | ssh密钥列表,可通过调用【ssh公钥列表】获得，若开启SSH登录，该字段为必填项 | [21,22,16] |  |
| sshClientIps | 否 | String | SSH客户端IP白名单，格式为CIDR方式即“A.B.C.D/N”，若需要添加多个IP，以逗号分隔，不超过10条，若开启SSH登录，该字段为必填项 | 234.168.4.3/32,268.168.4.4/32 |  |
| localStorageInfo | 否 | Object | 本地存储信息，需要提前对可用区进行加白方可挂载本地盘 |  | localStorageInfo |
| dindEnabled | 否 | Boolean | 是否启用Docker，true-开启，false-不开启，默认不开启，若启用Docker必须必须配置本地存储挂载点，默认将分配全部GPU资源，自动占用除预留2核CPU/4GB内存外的所有计算资源 | true |  |
| imageType | 否 | Integer | 镜像类型只能为整型0/1/2，其中0为公共镜像，1为社区镜像，2为自定义镜像，不传默认为公共镜像（公共镜像和社区镜像可通过【开发机公共镜像列表】查询，自定义镜像可通过【自定义开发机镜像列表】查询） | 0 |  |

**表 researchStorageInfo**

| 参数 | 是否必填 | 参数类型 | 说明 | 示例 | 下级对象 |
| --- | --- | --- | --- | --- | --- |
| mountPath | 否 | String | 挂载路径服务端自动添加/home/dataset-assist-index前缀,其中index为数组中位置，以0开始。挂载路径必须以/开头，长度限制为64，只能包含以下字符：/、a-z、A-Z、0-9、.、-、_ | /home/dataset-research-fs-0/ |  |
| storageId | 否 | Integer | 科研存储ID，获取方式：查询用户的科研文件列表 | 140 |  |

**表 localStorageInfo**

| 参数 | 是否必填 | 参数类型 | 说明 | 示例 | 下级对象 |
| --- | --- | --- | --- | --- | --- |
| pvSize | 否 | Integer | 本地盘大小，最小为50G，可通过【获取本地存储余量】接口查看某个可用区下某个规格的本地存储余量 | 50 |  |
| mountPath | 否 | String | 挂载路径自动添加/home/dataset-local前缀，可以为空，非空时：必须以/开头，仅支持字母（大小写敏感）、数字、以及/、-、_ 符号，长度不超过12个字符 | /data/demo |  |
| isPersistenceEnabled | 否 | Boolean | 是否进行本地持久化存储：true-开启本地盘数据持久化（持久化停机15天后自动清空数据）；false-不开启（默认选项）；可选值：true/false（不填默认false） | false |  |

**响应参数**

| 参数 | 参数类型 | 说明 | 示例 | 下级对象 |
| --- | --- | --- | --- | --- |
| statusCode | String | 返回码取值范围：200 成功，400失败 | 200 |  |
| message | String | 返回信息 | 操作成功 |  |
| returnObj | Object | 返回对象 |  | returnObj |
| error | String | 错误码信息 |  |  |

**表 returnObj**

| 参数 | 参数类型 | 说明 | 示例 | 下级对象 |
| --- | --- | --- | --- | --- |
| requestId | String | 一个 API 请求的唯一标识 | 3251331e7ff2cb0d4149d9ab0cbfcd81 |  |
| ideId | String | 开发机id | 111 |  |
| status | Object | 状态信息 |  | status |

**表 status**

| 参数 | 参数类型 | 说明 | 示例 | 下级对象 |
| --- | --- | --- | --- | --- |
| code | String | 状态码 |  |  |
| message | String | 状态信息 |  |  |

**请求体body示例**：

```json
{
  "name" : "ttttttt13",
  "specId" : 3041,
  "imageId" : 4502,
  "queueId" : 2333,
  "regionName" : "fuzhou-6",
  "projectId" : "0",
  "autoStop" : "ON",
  "stopDuration" : 2,
  "sshEnabled" : true,
  "imageType" : 0,
  "sshKeys" : [ 21, 16, 10 ],
  "sshClientIps" : "234.168.4.3/32,268.168.4.4/32",
  "localStorageInfo" : {
    "pvSize" : 50,
    "mountPath" : "/data/demo",
    "isPersistenceEnabled" : false
  }
}
```
**响应示例**：

```json
{
  "returnObj" : {
    "ideId" : "801",
    "requestId" : "5a764668beecdade61e18ee47c1a8eac",
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

[官方文档](https://eop.ctyun.cn/ebp/ctapiDocument/search?sid=131&api=%E5%88%9B%E5%BB%BA%E5%BC%80%E5%8F%91%E6%9C%BA&data=187&vid=265)

---

## 开发机详情（getIdeDetail）

展示开发机详情

**接口功能介绍**：展示开发机详情
**接口约束**：无
**接口是否审批**：否
**URI**：`POST` `/api/bc/v2/getIdeDetail`
**Content-Type**：application/json
**请求体body参数**

| 参数 | 是否必填 | 参数类型 | 说明 | 示例 | 下级对象 |
| --- | --- | --- | --- | --- | --- |
| ideId | 是 | Integer | 开发机id，值大于0 | 676 |  |

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
| activeDuration | Integer | 运行时长，单位：秒 | 11 |  |
| createTime | String | 创建时间 | 2023-09-07T18:05:21+08:00 |  |
| description | String | 开发机简介 |  |  |
| name | String | ide 名称 | test |  |
| ideType | String | ide类型: VsCode/Jupyter /VNC | Jupyter |  |
| imageId | Integer | 镜像id | 4364 |  |
| isFreezed | Boolean | 是否冻结 | false |  |
| leftTime | Integer | 剩余时长,单位秒 | 0 |  |
| modifyTime | String | 修改时间 | 2024-06-24T12:23:07+08:00 |  |
| openLink | String | 打开ide的跳转链接 | /bc/v2/Jupyter/ea014521e3614d1ea6d6abc42cef4821/?token=xxx |  |
| queueId | Integer | 队列id | 167 |  |
| regionName | String | 可选区域名称 | fuzhou-6 |  |
| resourceSpecific | Object | 资源规格 |  | resourceSpecific |
| specId | Integer | 资源规格id | 1 |  |
| state | String | 开发机状态: CREATING: 待创建， LAUNCHING：启动中， RUNNING：运行中 ， FAILED： 失败 ， IMAGE_SAVING: 镜像保存中 ，DELETING-删除中 | CREATING |  |
| token | String | token | xxx |  |
| urlReady | Boolean | 访问链接是否就绪 | false |  |
| arch | String | cpu架构:  x64/arm64 | x64 |  |
| framework | String | 框架版本 | minimal-jupyterlab-test |  |
| status | Object | 状态信息 |  | status |
| requestId | String | 一个 API 请求的唯一标识 | 6fe0829622d744a85fd447010785ecd9 |  |
| resourcePoolId | Integer | 资源池id | 123 |  |
| vncInfo | Object | VNC 信息 |  | vncInfo |
| researchStorageInfo | Array of Objects | 科研文件存储信息 |  | researchStorageInfo |
| autoStop | String | 是否自动停止：ON：开启，OFF：关闭 | ON |  |
| stopDuration | Integer | 自动停止持续时长 单位:h | 2 |  |
| projectId | String | 开发机所属企业项目id | 0 |  |
| projectName | String | 开发机所属项目名称，默认为 default | default |  |
| sshEnabled | Boolean | 是否开启SSH登录，true-开启，false-不开启，默认不开启 | false |  |
| sshKeys | Array of Objects | ssh密钥信息 |  | sshKey |
| sshClientIps | String | SSH客户端IP白名单，格式为CIDR方式即“A.B.C.D/N”，若需要添加多个IP，以逗号分隔，不超过10条 | 234.168.4.3/32,268.168.4.4/32 |  |
| sshCommand | String | ssh命令 | ssh -p 30004 batchcom@234.168.10.13 |  |
| dindEnabled | Boolean | 是否启用Docker，true-开启，false-不开启 | true |  |
| dindInfo | Object | 启用Docker分配的GPU、CPU与内存信息，不启用Docker时为空 |  | dindInfo |
| localStorageInfo | Object | 本地存储信息 |  | localStorageInfo |

**表 resourceSpecific**

| 参数 | 参数类型 | 说明 | 示例 | 下级对象 |
| --- | --- | --- | --- | --- |
| gpuModel | String | gpu型号，共享资源池类型参数 | RTX3060ti |  |
| quotaCpu | Integer | 资源池配额CPU/核 | 2 |  |
| quotaGpu | Integer | 资源池配额GPU/卡 | 1 |  |
| quotaMem | Integer | 资源池配额内存/G | 4 |  |
| specType | String | 资源规格类型： GPU-GPU加速型 GENERAL-通用计算型 | GPU |  |

**表 status**

| 参数 | 参数类型 | 说明 | 示例 | 下级对象 |
| --- | --- | --- | --- | --- |
| code | String | 状态码 |  |  |
| message | String | 状态信息 |  |  |

**表 vncInfo**

| 参数 | 参数类型 | 说明 | 示例 | 下级对象 |
| --- | --- | --- | --- | --- |
| userName | String | 用户名 | test |  |
| password | String | 用户密码 | tstete |  |

**表 researchStorageInfo**

| 参数 | 参数类型 | 说明 | 示例 | 下级对象 |
| --- | --- | --- | --- | --- |
| mountPath | String | 挂载路径 | /home/dataset-research-fs-0/ |  |
| storageId | Integer | 科研存储ID | 140 |  |
| type | String | 支持的存储类型 | Juicefs |  |
| storageName | String | 科研存名称 | researchfile |  |

**表 sshKey**

| 参数 | 参数类型 | 说明 | 示例 | 下级对象 |
| --- | --- | --- | --- | --- |
| name | String | 公钥名称 | test-supervisor |  |
| id | Integer | ssh 公钥id | 21 |  |

**表 dindInfo**

| 参数 | 参数类型 | 说明 | 示例 | 下级对象 |
| --- | --- | --- | --- | --- |
| quotaCpu | Integer | CPU/核 | 2 |  |
| quotaGpu | Integer | GPU/卡 | 4 |  |
| quotaMem | Integer | 内存/G | 50 |  |

**表 localStorageInfo**

| 参数 | 参数类型 | 说明 | 示例 | 下级对象 |
| --- | --- | --- | --- | --- |
| pvSize | Integer | 本地盘大小，最小为50G | 50 |  |
| isPersistenceEnabled | Boolean | 是否进行本地持久化存储：true-开启本地盘数据持久化（持久化停机15天后自动清空数据）；false-不开启（默认选项）；可选值：true/false（不填默认false） | false |  |
| mountPath | String | 本地存储挂载路径 | data/demo1 |  |

**请求体body示例**：

```json
{
  "ideId" : 1777
}
```
**响应示例**：

```json
{
  "returnObj" : {
    "activeDuration" : "0",
    "arch" : "x64",
    "createTime" : "2024-06-24T11:23:04+08:00",
    "description" : "",
    "framework" : "",
    "ideType" : 2,
    "imageId" : 4502,
    "isFreezed" : false,
    "leftTime" : "0",
    "modifyTime" : "2024-06-24T12:23:07+08:00",
    "name" : "",
    "openLink" : "http://hn-002.esx-nm-develop.ctyun.xyz:1180/bc/v1/Jupyter/d06c39042f8a407887dcfabf59f631bc/?token=xxx",
    "queueId" : 293,
    "regionName" : "fuzhou-6",
    "requestId" : "3801a5c011251823090af7a7c1a47711",
    "resourcePoolId" : 410,
    "autoStop" : "OFF",
    "stopDuration" : 0,
    "projectId" : "0",
    "projectName" : "default",
    "sshEnabled" : true,
    "sshKeys" : [ {
      "name" : "test-supervisor",
      "id" : 21
    } ],
    "sshClientIps" : "234.168.4.3/32,268.168.4.4/32",
    "sshCommand" : "ssh -p 30004 batchcom@234.63.10.13",
    "resourceSpecific" : {
      "gpuModel" : "CPU",
      "quotaCpu" : 1,
      "quotaGpu" : 0,
      "quotaMem" : 1,
      "specType" : "GPU"
    },
    "specId" : 3041,
    "state" : "STOPPED",
    "status" : {
      "code" : "ok",
      "message" : "操作成功"
    },
    "token" : "xxx",
    "urlReady" : false,
    "vncInfo" : {
      "password" : "",
      "userName" : "batchcom"
    },
    "dindEnabled" : true,
    "dindInfo" : {
      "quotaCpu" : 2,
      "quotaGpu" : 4,
      "quotaMem" : 50
    },
    "localStorageInfo" : {
      "pvSize" : 50,
      "isPersistenceEnabled" : false,
      "mountPath" : "/home/dataset-local/data/demo1"
    }
  },
  "statusCode" : "200",
  "message" : "操作成功",
  "error" : ""
}
```
**流控信息**：1000

[官方文档](https://eop.ctyun.cn/ebp/ctapiDocument/search?sid=131&api=%E5%BC%80%E5%8F%91%E6%9C%BA%E8%AF%A6%E6%83%85&data=187&vid=265)

---

