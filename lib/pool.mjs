// 监控目标队列实时快照 —— 双通道两套口径:
//   控制台(创建链路口径): 队列占用 + 队列级 spec/sellout + check/share 配额裁决(meetNeed)
//   官方(稳定轮询口径):   队列空卡(getInstancesAndQuota) + 资源池层库存(listResourceSpecs.sellout)
// 两层概念: ①资源池/供应商物理库存 ②本队列配额空卡——官方 sellout 是①，控制台 sellout 是队列分配层，
// 互不矛盾。监控器用法: 官方口径轮询 → 触发时控制台口径终审 → create。
import { requireOk } from "./ctyun-client.mjs";
import { requireOfficialOk } from "./official-client.mjs";
import { readCliConfig, requireConfig } from "./config.mjs";

function find(objects, predicate) {
  return (objects ?? []).find(predicate);
}

function assertStatus(data, label) {
  if (data?.status?.code !== "ok") throw new Error(`${label}失败：${data?.status?.message ?? "未知错误"}`);
  return data;
}

export async function snapshotQueue(client) {
  // 监控目标默认值来自 ~/.ctyun/config / 环境变量
  const cfg = (await readCliConfig()).values;
  const SETTINGS = {
    projectName: cfg.projectName,
    regionNameEng: cfg.regionNameEng,
    queueName: cfg.queueName,
    gpuModel: cfg.gpuModel,
    gpuCards: Number(cfg.gpuCards ?? 4),
    usedGpuThreshold: Number(cfg.usedGpuThreshold ?? 16),
  };
  requireConfig(SETTINGS, ["projectName", "regionNameEng", "queueName", "gpuModel"], "pool ");
  const projects = requireOk(await client.postV1("/bc/project/list", { action_name: ["bc:job:create"] }), "读取企业项目").projects ?? [];
  const project = find(projects, item => item.projectName === SETTINGS.projectName && item.status === 1);
  if (!project) throw new Error(`未找到可用企业项目：${SETTINGS.projectName}`);

  const regions = requireOk(await client.getV1("/bc/ops/region/list", {
    "paging.page": 1, "paging.perPage": 999, poolType: "exclusive",
  }), "读取可用区").opsRegionInfo ?? [];
  const region = find(regions, item => item.regionNameEng === SETTINGS.regionNameEng && item.resourceId);
  if (!region) throw new Error(`未找到可用区：${SETTINGS.regionNameEng}`);

  const queues = requireOk(await client.getV1("/queue/list", {
    resourceId: region.resourceId, regionNameEng: region.regionNameEng, projectId: project.projectId, poolType: "exclusive",
  }), "读取资源池队列").queues ?? [];
  const queue = find(queues, item => item.queueName === SETTINGS.queueName);
  if (!queue) throw new Error(`项目中未找到资源池队列：${SETTINGS.queueName}`);

  const specs = requireOk(await client.getV1("/resource/pool/spec/list", {
    resource_id: region.resourceId, regionNameEng: region.regionNameEng,
    "paging.page": 1, "paging.perPage": 999,
    querySpecKind: "ExclusivePoolProductSpec", exclusivePoolUuid: queue.exclusivePoolUuid,
  }), "读取开发机规格").specs ?? [];
  const spec = find(specs, item => item.gpuModel === SETTINGS.gpuModel && Number(item.quotaGpu) === SETTINGS.gpuCards);
  if (!spec) throw new Error(`未找到 ${SETTINGS.gpuCards} 卡 ${SETTINGS.gpuModel} 规格`);

  const usedGpu = Number(queue.allocated?.gpu);
  const totalGpu = Number(queue.capabilityGpu);
  const sellout = assertStatus((await client.getV1("/resource/pool/spec/sellout", {
    specId: spec.id, resourceId: region.resourceId, regionNameEng: region.regionNameEng,
    exclusivePoolUuid: queue.exclusivePoolUuid, useIdleResource: 0,
  })).json, "读取售罄状态");
  const quota = assertStatus((await client.postV1("/queue/check/share", {
    queueId: queue.id, resourceId: region.resourceId,
    cpuReq: String(spec.quotaCpu), gpuReq: String(spec.quotaGpu), memReq: String(spec.quotaMem),
    jobType: 1, chipInfo: [{ modelName: spec.gpuModel, number: String(spec.quotaGpu), k8s_gpu_model: spec.k8sGpuModel }],
  })).json, "读取队列配额");

  const ready = usedGpu < SETTINGS.usedGpuThreshold && sellout.sellout !== 1 && quota.meetNeed !== 2;
  return {
    at: new Date().toISOString(), channel: "console", project: project.projectName, region: region.regionNameEng,
    queue: queue.queueName, spec: `${spec.quotaGpu}x ${spec.gpuModel}`,
    usedGpu, totalGpu, freeGpu: totalGpu - usedGpu,
    sellout: sellout.sellout, meetNeed: quota.meetNeed, ready,
  };
}

/** 官方通道快照（轮询用，无会话过期）:
 *  ready = 队列占用<阈值 && 资源池层未售罄 && 队列空卡 ≥ 目标卡数。
 *  无队列级 sellout / meetNeed（控制台口径），故 sellout/meetNeed 置 null。 */
export async function snapshotQueueOfficial(official) {
  const cfg = (await readCliConfig()).values;
  const SETTINGS = {
    regionNameEng: cfg.regionNameEng,
    queueName: cfg.queueName,
    gpuModel: cfg.gpuModel,
    gpuCards: Number(cfg.gpuCards ?? 4),
    usedGpuThreshold: Number(cfg.usedGpuThreshold ?? 16),
  };
  requireConfig(SETTINGS, ["regionNameEng", "queueName", "gpuModel"], "pool(official) ");

  const queues = requireOfficialOk(await official.call("listQueues", { pageNum: 1, pageSize: 100 }), "读取队列").queues ?? [];
  const queue = find(queues, q => q.queueName === SETTINGS.queueName);
  if (!queue) throw new Error(`官方通道未找到队列: ${SETTINGS.queueName}（可用: ${queues.map(q => q.queueName).join(", ") || "无"}）`);

  const quotaData = requireOfficialOk(await official.call("getInstancesAndQuota", { queueId: queue.id }), "读取实例配额").data;
  const free = (r) => Number((Number(r?.total ?? 0) - Number(r?.used ?? 0)).toFixed(2));
  const usedGpu = Number(quotaData?.quota?.gpu?.used ?? 0);
  const totalGpu = Number(quotaData?.quota?.gpu?.total ?? queue.capabilityGpu ?? 0);

  const specs = requireOfficialOk(await official.call("listResourceSpecs", {
    resourcePoolId: queue.resourcePoolId, regionName: SETTINGS.regionNameEng, pageNum: 1, pageSize: 100,
  }), "读取规格").specs ?? [];
  const spec = find(specs, s => s.gpuModel === SETTINGS.gpuModel && Number(s.quotaGpu) === SETTINGS.gpuCards);
  const poolSellout = spec?.sellout ?? null;

  const gpuFree = totalGpu - usedGpu;
  const ready = usedGpu < SETTINGS.usedGpuThreshold && poolSellout !== "SOLDOUT" && gpuFree >= SETTINGS.gpuCards;
  return {
    at: new Date().toISOString(), channel: "official",
    region: SETTINGS.regionNameEng, queue: queue.queueName, spec: `${SETTINGS.gpuCards}x ${SETTINGS.gpuModel}`,
    usedGpu, totalGpu, freeGpu: gpuFree,
    gpuFree, cpuFree: free(quotaData?.quota?.cpu), memFree: free(quotaData?.quota?.memory),
    poolSellout,
    sellout: null, meetNeed: null, ready,
    note: "官方口径: 队列空卡+资源池库存; 队列级 sellout/meetNeed 终审用 --channel console",
  };
}
