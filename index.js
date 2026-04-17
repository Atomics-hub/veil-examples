const DEFAULT_BASE_URL = "https://veil-api.com/v1";

function requireNonEmptyString(name, value) {
  if (typeof value !== "string" || !value.trim()) {
    throw new TypeError(`${name} is required`);
  }
  return value.trim();
}

function normalizeBaseURL(baseURL = DEFAULT_BASE_URL) {
  const value = requireNonEmptyString("baseURL", baseURL);
  return value.endsWith("/") ? value.slice(0, -1) : value;
}

function normalizeCSV(value, transform = (item) => item) {
  if (value == null) {
    return undefined;
  }

  const items = Array.isArray(value) ? value : String(value).split(",");
  const normalized = items
    .map((item) => transform(String(item).trim()))
    .filter(Boolean);

  return normalized.length ? normalized.join(",") : undefined;
}

function buildPath(path, params) {
  const normalized = path.startsWith("/") ? path : `/${path}`;
  if (!params || Object.keys(params).length === 0) {
    return normalized;
  }

  const search = new URLSearchParams();
  for (const [key, value] of Object.entries(params)) {
    if (value == null) {
      continue;
    }
    search.set(key, String(value));
  }

  const query = search.toString();
  return query ? `${normalized}?${query}` : normalized;
}

export class VeilApiError extends Error {
  constructor(message, { status, data } = {}) {
    super(message);
    this.name = "VeilApiError";
    this.status = status;
    this.data = data;
  }
}

export function createVeilHeaders({
  veilApiKey,
  upstreamApiKey,
  upstreamProvider,
  inputPolicy,
  outputPolicy,
  hallucinationFlags,
  headers = {},
} = {}) {
  const resolved = { ...headers };

  resolved.Authorization = `Bearer ${requireNonEmptyString("veilApiKey", veilApiKey)}`;

  if (upstreamApiKey != null) {
    resolved["x-upstream-key"] = requireNonEmptyString("upstreamApiKey", upstreamApiKey);
  }

  if (upstreamProvider != null) {
    resolved["x-upstream-provider"] = requireNonEmptyString("upstreamProvider", upstreamProvider);
  }

  if (inputPolicy != null) {
    resolved["x-veil-input-policy"] = requireNonEmptyString("inputPolicy", inputPolicy);
  }

  if (outputPolicy != null) {
    resolved["x-veil-output-policy"] = requireNonEmptyString("outputPolicy", outputPolicy);
  }

  if (hallucinationFlags != null) {
    resolved["x-veil-hallucination-flags"] = requireNonEmptyString("hallucinationFlags", hallucinationFlags);
  }

  return resolved;
}

export function createVeilOpenAIConfig({
  veilApiKey,
  upstreamApiKey,
  upstreamProvider,
  inputPolicy,
  outputPolicy,
  hallucinationFlags,
  baseURL = DEFAULT_BASE_URL,
  defaultHeaders = {},
  ...rest
} = {}) {
  const resolvedUpstreamKey = requireNonEmptyString("upstreamApiKey", upstreamApiKey);

  return {
    ...rest,
    apiKey: resolvedUpstreamKey,
    baseURL: normalizeBaseURL(baseURL),
    defaultHeaders: createVeilHeaders({
      veilApiKey,
      upstreamApiKey: resolvedUpstreamKey,
      upstreamProvider,
      inputPolicy,
      outputPolicy,
      hallucinationFlags,
      headers: defaultHeaders,
    }),
  };
}

export class VeilClient {
  constructor({
    apiKey,
    baseURL = DEFAULT_BASE_URL,
    fetch: customFetch,
    defaultHeaders = {},
  } = {}) {
    this.apiKey = requireNonEmptyString("apiKey", apiKey);
    this.baseURL = normalizeBaseURL(baseURL);
    this.defaultHeaders = { ...defaultHeaders };
    this.fetch = customFetch ?? globalThis.fetch?.bind(globalThis);

    if (!this.fetch) {
      throw new Error("A fetch implementation is required");
    }
  }

  async request(path, { method = "GET", headers = {}, body, signal } = {}) {
    const finalHeaders = {
      ...this.defaultHeaders,
      Authorization: `Bearer ${this.apiKey}`,
      ...headers,
    };

    if (body !== undefined) {
      finalHeaders["Content-Type"] ??= "application/json";
    }

    const response = await this.fetch(`${this.baseURL}${path}`, {
      method,
      headers: finalHeaders,
      body: body !== undefined ? JSON.stringify(body) : undefined,
      signal,
    });

    const raw = await response.text();
    let data = raw;

    if (raw) {
      try {
        data = JSON.parse(raw);
      } catch {
        data = raw;
      }
    } else {
      data = null;
    }

    if (!response.ok) {
      const message =
        data?.detail ||
        data?.error?.message ||
        (typeof data === "string" && data) ||
        `Veil request failed with status ${response.status}`;
      throw new VeilApiError(message, { status: response.status, data });
    }

    return data;
  }

  chatCompletions(body, { upstreamApiKey, upstreamProvider, signal } = {}) {
    const headers = createVeilHeaders({
      veilApiKey: this.apiKey,
      upstreamApiKey,
      upstreamProvider,
    });

    delete headers.Authorization;

    return this.request("/chat/completions", {
      method: "POST",
      headers,
      body,
      signal,
    });
  }

  redact({
    text,
    scoreThreshold,
    compliance,
    allowTypes,
    allowValues,
    signal,
  } = {}) {
    if (typeof text !== "string") {
      throw new TypeError("text must be a string");
    }

    const headers = {};
    const complianceHeader = normalizeCSV(compliance, (item) => item.toLowerCase());
    const allowTypesHeader = normalizeCSV(allowTypes, (item) => item.toUpperCase());
    const allowValuesHeader = normalizeCSV(allowValues);

    if (complianceHeader) {
      headers["x-veil-compliance"] = complianceHeader;
    }
    if (allowTypesHeader) {
      headers["x-veil-allow"] = allowTypesHeader;
    }
    if (allowValuesHeader) {
      headers["x-veil-allow-values"] = allowValuesHeader;
    }

    const body = { text };
    if (scoreThreshold !== undefined) {
      body.score_threshold = scoreThreshold;
    }

    return this.request("/redact", {
      method: "POST",
      headers,
      body,
      signal,
    });
  }

  providers({ signal } = {}) {
    return this.request("/providers", { signal });
  }

  usage({ signal } = {}) {
    return this.request("/usage", { signal });
  }

  firewallInput(body, { signal } = {}) {
    return this.request("/firewall/input", {
      method: "POST",
      body,
      signal,
    });
  }

  firewallOutput(body, { signal } = {}) {
    return this.request("/firewall/output", {
      method: "POST",
      body,
      signal,
    });
  }

  firewallMcp(body, { signal } = {}) {
    return this.request("/firewall/mcp", {
      method: "POST",
      body,
      signal,
    });
  }

  firewallAudit({ limit = 50, signal } = {}) {
    return this.request(buildPath("/audit/firewall", { limit }), { signal });
  }

  audit({ compliance = false, verify = false, limit = 50, signal } = {}) {
    const path = compliance
      ? verify
        ? "/audit/verify"
        : buildPath("/audit/compliance", { limit })
      : buildPath("/audit", { limit });

    return this.request(path, { signal });
  }
}

export { DEFAULT_BASE_URL };
