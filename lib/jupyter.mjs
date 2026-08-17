// Jupyter 通道：复用 /ide/get 返回的 openLink + token，免 SSH 操作开发机
// 链路: openLink(302→lab) → _xsrf cookie → kernels API → WebSocket 执行代码
// 零依赖: Node ≥22 原生 WebSocket + fetch

export class JupyterChannel {
  constructor(baseUrl, token) {
    // baseUrl: https://hd4bc.esx.ctyun.cn:1443/bc/v1/Jupyter/<uuid>
    this.base = baseUrl.replace(/\/$/, "");
    this.token = token;
    this.cookies = new Map(); // name → value
  }

  #cookieHeader() {
    return [...this.cookies.entries()].map(([k, v]) => `${k}=${v}`).join("; ");
  }

  #absorbCookies(res) {
    const setCookies = res.headers.getSetCookie?.() ?? [];
    for (const sc of setCookies) {
      const [pair] = sc.split(";");
      const eq = pair.indexOf("=");
      if (eq > 0) this.cookies.set(pair.slice(0, eq).trim(), pair.slice(eq + 1).trim());
    }
  }

  get xsrf() {
    return this.cookies.get("_xsrf") ?? "";
  }

  async #request(path, method = "GET", body = null) {
    const headers = { "Content-Type": "application/json" };
    if (this.xsrf) { headers["X-XSRFToken"] = this.xsrf; headers["Cookie"] = this.#cookieHeader(); }
    if (this.cookies.size && !headers.Cookie) headers.Cookie = this.#cookieHeader();
    const res = await fetch(`${this.base}${path}?token=${encodeURIComponent(this.token)}`, {
      method, headers,
      body: body === null ? undefined : JSON.stringify(body),
    });
    this.#absorbCookies(res);
    const text = await res.text();
    let json = null;
    try { json = JSON.parse(text); } catch { /* HTML 或空 */ }
    return { status: res.status, json, text };
  }

  /** 激活链路: 访问 openLink 根路径（302 种会话 cookie）→ /lab 拿 _xsrf。
   *  必要性: /ide/get 返回的 JWT 不先经根路径激活，REST/WS 全部 401 "JWT token invalid"。
   *  坑: 激活 302 只在带尾斜杠的 URL 上发生（平台按精确路径路由），base 剥斜杠后必须补回 "/" */
  async init() {
    const root = await this.#request("/");
    if (root.status >= 400) throw new Error(`openLink 激活失败 HTTP ${root.status}`);
    await this.#request("/lab");
    // 激活后验证 token 真正可用
    const probe = await this.#request("/api/kernels");
    if (probe.status !== 200) throw new Error(`token 激活后仍不可用 (HTTP ${probe.status}: ${probe.text?.slice(0, 80)})`);
    if (!this.xsrf) throw new Error("未取得 _xsrf cookie（Jupyter 通道初始化失败）");
    return this;
  }

  /** 起一个 kernel（复用已有 idle kernel 优先） */
  async ensureKernel() {
    if (this.kernelId) return this.kernelId;
    const list = await this.#request("/api/kernels");
    const idle = (list.json?.find?.(k => k.execution_state === "idle")) ?? (list.json?.[0]);
    if (idle?.id) { this.kernelId = idle.id; return this.kernelId; }
    const created = await this.#request("/api/kernels", "POST", { name: "python3" });
    if (created.status !== 201 && created.status !== 200) {
      throw new Error(`kernel 创建失败 HTTP ${created.status}: ${created.text?.slice(0, 100)}`);
    }
    this.kernelId = created.json.id;
    return this.kernelId;
  }

  /** WebSocket 执行代码，返回 stdout 文本（WS 连接失败自动重试 ×3——平台网关偶发抖动） */
  async exec(code, { timeoutMs = 60000, retries = 3 } = {}) {
    let lastErr;
    for (let attempt = 1; attempt <= retries; attempt++) {
      try {
        return await this.#execOnce(code, timeoutMs);
      } catch (e) {
        lastErr = e;
        if (!/WebSocket 连接失败|连接超时/.test(e.message) || attempt === retries) throw e;
        await new Promise(r => setTimeout(r, 1500 * attempt));
      }
    }
    throw lastErr;
  }

  async #execOnce(code, timeoutMs) {
    const kid = await this.ensureKernel();
    const wsUrl = this.base.replace(/^http/, "ws") + `/api/kernels/${kid}/channels?token=${encodeURIComponent(this.token)}`;
    return await new Promise((resolve, reject) => {
      // 平台有两种 Jupyter server wire format:
      //  A) JSON 文本帧（老版本）
      //  B) 二进制帧 [n:u64LE][offsets[n]:u64LE][blobs...]（新版本默认）
      // 协议探测: open 后服务端会主动推送起始 status 帧（BIN 或 TEXT），据此选择发送格式。
      // 禁止盲发 JSON——binary server 收到文本帧直接 1006 断连。
      const ws = new WebSocket(wsUrl);
      const msgId = crypto.randomUUID();
      let stdout = "";
      let mode = null; // null=探测中
      const fail = err => { clearTimeout(timer); try { ws.close(); } catch {} reject(err); };
      const timer = setTimeout(() => fail(new Error(`kernel 执行超时 (${timeoutMs}ms)`)), timeoutMs);

      const headerObj = { msg_id: msgId, username: "ctyun-cli", session: "ctyun-cli", date: new Date().toISOString(), msg_type: "execute_request", version: "5.3" };
      const contentObj = { code, silent: false, store_history: false, user_expressions: {}, allow_stdin: false };
      const sendRequest = () => {
        if (mode === "binary") {
          const parts = ["shell", JSON.stringify(headerObj), "{}", "{}", JSON.stringify(contentObj), ""];
          const head = Buffer.alloc(8 + parts.length * 8);
          head.writeBigUInt64LE(BigInt(parts.length), 0);
          let acc = head.length;
          parts.forEach((p, i) => { head.writeBigUInt64LE(BigInt(acc), 8 + i * 8); acc += Buffer.byteLength(p); });
          ws.send(Buffer.concat([head, ...parts.map(p => Buffer.from(p))]));
        } else {
          ws.send(JSON.stringify({ header: headerObj, parent_header: {}, channel: "shell", content: contentObj, metadata: {}, buffers: [] }));
        }
      };

      ws.onopen = () => {
        // JSON server 不一定主动发起始帧 → 2s 静默兜底按 JSON 发送
        setTimeout(() => { if (mode === null) { mode = "json"; sendRequest(); } }, 2000);
      };
      ws.onmessage = async ev => {
        const isText = typeof ev.data === "string";
        let blobs = null;
        if (isText) {
          try {
            const m = JSON.parse(ev.data);
            blobs = [m.channel ?? "iopub", m.header, m.parent_header, m.metadata, m.content, ""];
          } catch { return; }
        } else {
          try {
            const buf = Buffer.from(await ev.data.arrayBuffer());
            const n = Number(buf.readBigUInt64LE(0));
            const offsets = [];
            for (let i = 0; i < n; i++) offsets.push(Number(buf.readBigUInt64LE(8 + i * 8)));
            blobs = offsets.map((o, i) => buf.subarray(o, i + 1 < n ? offsets[i + 1] : buf.length).toString("utf8"));
          } catch { return; }
        }
        if (!blobs) return;
        // 首帧 → 锁定模式并发送请求
        if (mode === null) {
          mode = isText ? "json" : "binary";
          sendRequest();
          return;
        }
        // 归一化: binary 模式 blobs 是字符串需 parse；JSON 模式 header/content 已是对象
        let header, content;
        try {
          header = typeof blobs[1] === "string" ? JSON.parse(blobs[1]) : blobs[1];
          content = typeof blobs[4] === "string" ? JSON.parse(blobs[4]) : blobs[4];
        } catch { return; }
        // 父头过滤: parent_header.msg_id 缺失时（部分 server 把 header 副本当 parent）视为放行
        let isMine = true;
        if (blobs[2] && blobs[2] !== "{}") {
          let ph = null;
          try { ph = typeof blobs[2] === "string" ? JSON.parse(blobs[2]) : blobs[2]; } catch { ph = null; }
          if (ph && ph.msg_id !== undefined) isMine = ph.msg_id === msgId;
        }
        const t = header.msg_type;
        if (t === "stream" && isMine) stdout += content.text ?? "";
        else if (t === "error" && isMine) { fail(new Error(`${content.ename}: ${content.evalue}`.slice(0, 300))); }
        else if (t === "status" && content.execution_state === "idle" && isMine) {
          try { ws.close(); } catch {} clearTimeout(timer); resolve(stdout);
        }
      };
      ws.onerror = () => { fail(new Error("WebSocket 连接失败")); };
    });
  }

  /** 读取文件内容（contents API，文本） */
  async readFile(path) {
    const r = await this.#request(`/api/contents/${path}`);
    if (r.status !== 200) throw new Error(`读取 ${path} 失败: HTTP ${r.status}`);
    return r.json;
  }

  async close() { /* kernel 复用不主动杀 */ }
}

/** 从开发机详情构造通道（控制台 /ide/get 与官方 getIdeDetail 均可：
 *  控制台返回绝对 URL，官方返回相对路径 /bc/v2/Jupyter/<uuid>/?token=…） */
export function channelFromEnv(envDetail) {
  const link = envDetail.openLink ?? envDetail.jupyterUrl;
  if (!link) throw new Error("该开发机无 Jupyter 链接（openLink 为空）");
  const u = new URL(link.startsWith("/") ? `https://esx.ctyun.cn${link}` : link);
  const token = u.searchParams.get("token");
  if (!token) throw new Error("Jupyter 链接缺少 token");
  // openLink 形如 https://host:1443/bc/v1/Jupyter/<uuid>/?token=...
  return new JupyterChannel(`${u.origin}${u.pathname}`.replace(/\/$/, ""), token);
}

/** 往 authorized_keys 追加公钥行（处理平台文件末尾无换行的历史问题） */
export async function injectSshKey(channel, pubLine) {
  const code = `
import os, re, hashlib
AK = os.path.expanduser("~/.ssh/authorized_keys")
os.makedirs(os.path.dirname(AK), mode=0o700, exist_ok=True)
pub_line = ${JSON.stringify(pubLine)}
raw = open(AK).read() if os.path.exists(AK) else ""
# 修复历史粘连（无换行导致的 key 拼接）并规范分行
fixed = re.sub(r"(?<=\\S)(ssh-(?:rsa|ed25519|dss) )", r"\\n\\1", raw)
lines = [l.strip() for l in fixed.splitlines() if l.strip()]
added = pub_line not in lines
if added:
    lines.append(pub_line)
with open(AK, "w") as f:
    f.write("\\n".join(lines) + "\\n")
os.chmod(AK, 0o600)
print("RESULT", "added" if added else "already-present", len(lines))
for l in lines:
    p = l.split()
    print("KEY", p[0], p[-1] if len(p) >= 3 else "?")
`;
  const out = await channel.exec(code);
  const result = /RESULT (\S+) (\d+)/.exec(out);
  if (!result) throw new Error(`kernel 输出异常: ${out.slice(0, 200)}`);
  const keys = [...out.matchAll(/^KEY (\S+) (.+)$/gm)].map(m => `${m[1]} ${m[2]}`);
  return { added: result[1] === "added", totalKeys: Number(result[2]), keys };
}
