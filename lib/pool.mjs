// 监控目标队列实时快照（与 gpu-platform-monitor/monitor.mjs 的 snapshotAndPreflight 同口径）
import { requireOk } from "./ctyun-client.mjs";
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
    at: new Date().toISOString(), project: project.projectName, region: region.regionNameEng,
    queue: queue.queueName, spec: `${spec.quotaGpu}x ${spec.gpuModel}`,
    usedGpu, totalGpu, freeGpu: totalGpu - usedGpu,
    sellout: sellout.sellout, meetNeed: quota.meetNeed, ready,
  };
}
