# 监控域 — 4 个端点

全部 `POST /bc/v1/monitor/*`。对象标识用 `objectUuid`（开发机取 `/ide/get` 的 `uuid` 字段，监控 ID 形如 `ide-<uuid>`）。

## 端点总表

| 端点 | SPA 函数 | 实测 | 用途 |
|---|---|---|---|
| `POST /bc/v1/monitor/getResourceUsageRateMetrics` | getResourceUsageRateMetrics | ✅（真实调用 ok） | **当前时刻利用率快照** |
| `POST /bc/v1/monitor/getResourceMetrics` | getResourceMetric | ✅ InvalidArgument | 时间序列指标（start/end 必填，start < end） |
| `POST /bc/v1/monitor/getResourceUsageRateGraph` | getResourceUsageRateGraph | ✅ InvalidArgument | 利用率曲线 |
| `POST /bc/v1/monitor/getMultipleResourceMetrics` | getMultipleResourceMetrics | ✅ InvalidArgument | 多对象批量指标 |

## 快照：getResourceUsageRateMetrics

body（实测有效）：

```json
{ "objectType": "ide", "metric": [1, 2, 3], "objectUuid": "<ide uuid>" }
```

响应（实测样本）：

```json
{
  "metricDataInfo": [
    { "metricName": "cpu_usage_rate", "usageRate": 1.5835093 },
    { "metricName": "mem_usage_rate", "usageRate": 96.2394 },
    { "metricName": "gpu_usage_rate", "usageRate": 0 }
  ]
}
```

无时间范围参数——就是"现在"的快照。

## 时间序列

`getResourceMetrics` / `getMultipleResourceMetrics` 空参报 `start time must be less than end time, start: 0, end: 0`，即 body 需 `startTime`/`endTime`（秒时间戳）+ `objectUuid`（批量版传数组）。作业维度另有 `POST /bc/v1/job/metric/pull`（Prometheus 直查，空参即 ok）。

## 相关端点（跨域）

- `POST /bc/v1/job/resource/metric` — 训练作业资源指标（NotFound：需真实 training_job id）
- `POST /bc/v2/ide/resource/metric` — v2 开发机指标（NotFound）
- `GET /bc/v1/cluster/resource/events` — 集群资源事件（NotFound：需 ide 上下文）
- `POST /bc/v1/cluster/resource/logs` — 资源日志（InvalidArgument：instance type）
