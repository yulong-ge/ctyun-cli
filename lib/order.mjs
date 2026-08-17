// ctyun-cli 订单/创建模块 —— 移植自 gpu-platform-monitor 的 order.mjs + discover()，参数化改造
// 创建链路: project → region → queue → spec → image → storage → sshKey → formData → POST /bc/v1/ide/batch/create
import { requireOk } from "./ctyun-client.mjs";

const LOCAL_DISK_BASE_GB = 50;
const LOCAL_DISK_PREFIX = "/home/dataset-local";

function find(list, predicate, label) {
  const hit = list.find(predicate);
  if (!hit) throw new Error(`未找到${label}`);
  return hit;
}

// ---------- 发现层（全部只读，供 create 与 discover 子命令复用） ----------

/** 控制台响应校验：失败时抛含业务信息的错误（而非退化成误导性的"未找到 XX"） */
function checked(response, label) {
  const data = response?.json;
  if (response?.status !== 200 || data?.status?.code !== "ok") {
    throw new Error(`${label}失败: ${data?.status?.message ?? `HTTP ${response?.status}`}`);
  }
  return data;
}

export async function listProjects(client) {
  return checked(await client.postV1("/bc/project/list", { action_name: ["bc:job:create"] }), "读取企业项目").projects ?? [];
}

export async function listRegions(client, { poolType = "exclusive" } = {}) {
  return checked(await client.getV1("/bc/ops/region/list", {
    "paging.page": 1, "paging.perPage": 999, poolType,
  }), "读取可用区").opsRegionInfo ?? [];
}

export async function listQueues(client, region, project, { poolType = "exclusive" } = {}) {
  return checked(await client.getV1("/queue/list", {
    resourceId: region.resourceId, regionNameEng: region.regionNameEng, projectId: project.projectId, poolType,
  }), "读取队列").queues ?? [];
}

export async function listSpecs(client, region, queue, { poolType = "exclusive" } = {}) {
  return checked(await client.getV1("/resource/pool/spec/list", {
    resource_id: region.resourceId, regionNameEng: region.regionNameEng,
    "paging.page": 1, "paging.perPage": 999,
    querySpecKind: "ExclusivePoolProductSpec", exclusivePoolUuid: queue.exclusivePoolUuid,
  }), "读取规格").specs ?? [];
}

export async function listImages(client, region, { productType = 1, imageType = 0 } = {}) {
  return checked(await client.getV1("/ide/image/list", {
    arch: region.arch, productType, imageType, "paging.page": 1, "paging.perPage": 999,
  }), "读取镜像").images ?? [];
}

export async function listSshKeys(client) {
  return checked(await client.postV1("/ide/publicKey/list", {}), "读取公钥").publicKeyInfo ?? [];
}

export async function listResearchStorages(client, region, project) {
  return checked(await client.getV2("/storage/research/list", {
    resourceId: region.resourceId, regionNameEng: region.regionNameEng, projectId: project.projectId,
    "paging.page": 1, "paging.perPage": 999,
  }), "读取科研文件").storageResearches ?? [];
}

export async function listResearchSpaces(client, storage, project, region) {
  return checked(await client.getV2("/storage/research/space/list", {
    storageId: storage.id, projectId: project.projectId, resourceId: region.resourceId, regionNameEng: region.regionNameEng,
    "paging.page": 1, "paging.perPage": 999,
  }), "读取科研空间").storageSpaces ?? [];
}

export async function localDiskInventory(client, region, spec, queue) {
  return checked(await client.getV1("/resource/getSpecLocalStorageInventory", {
    resourceId: region.resourceId, specId: spec.id, regionNameEng: region.regionNameEng, exclusivePoolUuid: queue.exclusivePoolUuid,
  }), "读取本地盘库存");
}

export function maxLocalDiskExpansion(inventory) {
  const values = [inventory.inventoryLocalStorage, inventory.limitLocalStorage, inventory.quotaLocalStorage]
    .map(Number).filter(v => Number.isFinite(v) && v >= 0);
  if (values.length !== 3) throw new Error("本地盘库存信息不完整");
  const maxTotal = Math.min(...values);
  return { maxTotalGb: maxTotal, maxExpansionGb: Math.max(0, maxTotal - LOCAL_DISK_BASE_GB) };
}

// ---------- formData 构造（与 CreateDevelopEnv.buildIdeSubmitParams 同构） ----------

export function normalizeClientIps(value) {
  return String(value ?? "").split("\n").map(s => s.trim()).join(",").replace(/^,+|,+$/g, "");
}

export function buildIdeSubmitParams(formData) {
  const payload = {
    ...formData,
    poolType: Number(formData.poolType),
    storageInfo: (formData.storageInfo ?? []).map(item => ({ ...item })),
    researchStorageInfo: (formData.researchStorageInfo ?? []).map(item => {
      const { mountPath, pathPrefix, spaceEnable, spaceId, ...rest } = item;
      return { ...rest, spaceId: spaceEnable ? Number(spaceId) : 0, mountPath: `${pathPrefix ?? ""}${mountPath ?? ""}` };
    }),
    localStorageInfo: formData.localPv?.length
      ? {
          pv_size: Number(formData.localPv[0].size ?? 0) + LOCAL_DISK_BASE_GB,
          release_policy: formData.localPv[0].enablePersistence ? "Retain" : "Delete",
          mount_path: `${LOCAL_DISK_PREFIX}${formData.localPv[0].mountPath ?? ""}`,
        }
      : undefined,
    aoneEduInfo: { aoneEduEnable: false, projectName: "", userName: "", userPass: "" },
  };

  if (payload.sshEnabled) {
    payload.sshClientIps = formData.sshShareType === "Dedicated" ? "" : normalizeClientIps(formData.sshClientIps);
    payload.sshShareType = formData.sshShareType || undefined;
    payload.sshEipId = formData.sshShareType === "Dedicated" && formData.sshEipId ? Number(formData.sshEipId) : undefined;
  } else {
    payload.sshClientIps = undefined; payload.sshShareType = undefined; payload.sshEipId = undefined;
  }
  if (!payload.servicePortEnabled) {
    payload.serviceInternalPorts = undefined; payload.servicePortClientIps = undefined;
    payload.servicePortShareType = undefined; payload.servicePortEipConfig = undefined;
  }
  if (!formData.dindEnabled) payload.dindInfo = undefined;
  delete payload.localPv;
  delete payload.instanceNum;
  return payload;
}

export function buildBatchCreateRequest(formData) {
  return { ide_info: buildIdeSubmitParams(formData), instance_num: Number(formData.instanceNum ?? 1) };
}

export function resolveSubmitLocalDisk(requestedGb, inventory) {
  const { maxExpansionGb } = maxLocalDiskExpansion(inventory);
  if (requestedGb <= maxExpansionGb) return { sizeGb: requestedGb, clamped: false };
  return { sizeGb: maxExpansionGb, clamped: true };
}

// ---------- 编排：参数 → 资源解析 → formData ----------

/**
 * options: { projectName?, regionNameEng?, queueName?, gpuModel?, gpuCards?, imageName?,
 *            sshKeyName?, researchStorageName?, researchSpaceName?, machineName?,
 *            localExpansionGb?, localMountPath?, localPersistence?, sshShareType?,
 *            sshClientIps?, autoStop?, stopDuration?, count? }
 * 缺省值沿用监控项目 SETTINGS（与该队列/项目绑定）。全部可覆盖。
 */
export async function buildCreateFormData(client, options = {}) {
  const o = {
    projectName: "<PROJECT_NAME>",
    regionNameEng: "zj-pinghu-1",
    queueName: "q-<PROJECT>-pool02",
    gpuModel: "NVIDIA-A100-SXM4-80GB",
    gpuCards: 4,
    imageName: "jupyter-vllm0.26.0-openai-cuda13.0-ubuntu22.04",
    researchStorageName: "pool02-<PROJECT>",
    researchSpaceName: "<USER>",
    machineName: `dev-env-${Math.random().toString(36).slice(2, 7)}`,
    localExpansionGb: 3950,
    localMountPath: "/research",
    localPersistence: true,
    sshShareType: "Shared",
    sshClientIps: "",
    autoStop: 2,
    stopDuration: 0,
    count: 1,
    sshKeyName: "",
    ...options,
  };
  o.gpuCards = Number(o.gpuCards);
  o.localExpansionGb = Number(o.localExpansionGb);
  o.autoStop = Number(o.autoStop);
  o.stopDuration = Number(o.stopDuration);
  o.count = Number(o.count);

  const projects = await listProjects(client);
  const project = find(projects, p => (o.projectName ? p.projectName === o.projectName : p.status === 1), `企业项目: ${o.projectName ?? "(第一个可用)"}`);
  const regions = await listRegions(client);
  const region = find(regions, r => r.regionNameEng === o.regionNameEng && r.resourceId, `可用区: ${o.regionNameEng}`);
  const queues = await listQueues(client, region, project);
  const queue = find(queues, q => q.queueName === o.queueName, `队列: ${o.queueName}`);
  const specs = await listSpecs(client, region, queue);
  const spec = find(specs, s => s.gpuModel === o.gpuModel && Number(s.quotaGpu) === o.gpuCards, `规格: ${o.gpuCards}x ${o.gpuModel}`);
  const images = await listImages(client, region);
  const image = find(images, i => i.name === o.imageName && Number(i.imageType) === 0, `公共框架: ${o.imageName}`);
  const keys = await listSshKeys(client);
  const key = o.sshKeyName
    ? find(keys, k => k.name === o.sshKeyName, `SSH 公钥: ${o.sshKeyName}`)
    : keys.length === 1 ? keys[0] : undefined;
  if (!key) throw new Error(`SSH 公钥有 ${keys.length} 把（${
    keys.map(k => k.name).join(", ")}），用 --ssh-key 指定`);

  // 科研文件存储（可选：给了名字才挂）
  let storage = null, space = null;
  if (o.researchStorageName) {
    const storages = await listResearchStorages(client, region, project);
    storage = find(storages.filter(s => s.state === "Created" && s.urlReady), s => s.storageName === o.researchStorageName, `可挂载科研文件: ${o.researchStorageName}`);
    const spaces = await listResearchSpaces(client, storage, project, region);
    space = find(spaces.filter(s => s.readOnly === false), s => s.spaceName === o.researchSpaceName, `可写科研空间: ${o.researchSpaceName}`);
  }

  const inventory = await localDiskInventory(client, region, spec, queue);
  const limit = maxLocalDiskExpansion({ ...inventory, quotaLocalStorage: spec.quotaLocalStorage });
  if (o.localExpansionGb > limit.maxExpansionGb) {
    throw new Error(`本地盘扩容 ${o.localExpansionGb}GB 超过当前上限 ${limit.maxExpansionGb}GB`);
  }

  const formData = {
    billingMode: 4,
    ideModifyTime: 1,
    projectId: project.projectId,
    name: o.machineName,
    poolName: "",
    resourceId: Number(region.resourceId),
    queueId: Number(queue.id),
    regionNameEng: region.regionNameEng,
    description: "",
    autoStop: o.autoStop,
    stopDuration: o.stopDuration,
    poolType: "2",
    specType: 1,
    specId: Number(spec.id),
    cpuSpec: String(spec.quotaCpu),
    gpuSpec: String(spec.quotaGpu),
    memSpec: String(spec.quotaMem),
    useIdleResource: 0,
    imageSource: 1,
    imageId: Number(image.imageId),
    imageAddr: image.imageAddr,
    imageName: image.name,
    storageInfo: [],
    researchStorageInfo: storage ? [{
      storageId: storage.id,
      datasetName: storage.storageName,
      storageType: "Assist",
      spaceEnable: true,
      spaceId: String(space.spaceId),
      readOnly: false,
      pathPrefix: "/home/dataset-assist-0",
      mountPath: "/research",
    }] : [],
    localPv: o.localExpansionGb > 0 ? [{
      size: o.localExpansionGb, mountPath: o.localMountPath, enablePersistence: o.localPersistence,
    }] : [],
    cycleCnt: 1,
    cycleType: null,
    autoRenew: false,
    sshEnabled: true,
    sshKeys: [String(key.id)],
    sshClientIps: o.sshClientIps,
    sshShareType: o.sshShareType,
    instanceNum: o.count,
    servicePortEnabled: false,
    serviceInternalPorts: ["8000"],
    servicePortClientIps: "",
    servicePortShareType: "",
    servicePortEipConfig: [{ eipId: "", protocol: "TCP", port: "" }, { eipId: "", protocol: "UDP", port: "" }],
    visibility: "PERSONAL",
    dindEnabled: false,
    dindInfo: { quotaGpu: 0, quotaCpu: 0, quotaMem: 0 },
  };
  return { project, region, queue, spec, image, key, storage, space, localDiskLimit: limit, formData };
}

/** 提交前刷新本地盘库存并钳制扩容值（库存会随他人创建机器而缩小） */
export async function submitCreate(client, discovered) {
  const inventory = await localDiskInventory(client, discovered.region, discovered.spec, discovered.queue);
  const localDisk = resolveSubmitLocalDisk(discovered.formData.localPv[0]?.size ?? 0, {
    ...inventory, quotaLocalStorage: discovered.spec.quotaLocalStorage,
  });
  const formData = localDisk.sizeGb > 0
    ? { ...discovered.formData, localPv: [{ ...discovered.formData.localPv[0], size: localDisk.sizeGb }] }
    : { ...discovered.formData, localPv: [] };
  const response = requireOk(await client.postV1("/ide/batch/create", buildBatchCreateRequest(formData)), "创建开发机");
  return { response, clamped: localDisk.clamped, requestedGb: discovered.formData.localPv[0]?.size ?? 0, submitGb: localDisk.sizeGb };
}
