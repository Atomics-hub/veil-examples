export const DEFAULT_BASE_URL: string;

export class VeilApiError extends Error {
  status?: number;
  data?: unknown;
}

export interface VeilHeaderOptions {
  veilApiKey: string;
  upstreamApiKey?: string;
  upstreamProvider?: string;
  headers?: Record<string, string>;
}

export interface VeilOpenAIConfigOptions extends VeilHeaderOptions {
  baseURL?: string;
  defaultHeaders?: Record<string, string>;
  [key: string]: unknown;
}

export interface VeilClientOptions {
  apiKey: string;
  baseURL?: string;
  fetch?: typeof fetch;
  defaultHeaders?: Record<string, string>;
}

export interface RedactOptions {
  text: string;
  scoreThreshold?: number;
  compliance?: string | string[];
  allowTypes?: string | string[];
  allowValues?: string | string[];
  signal?: AbortSignal;
}

export interface ChatCompletionOptions {
  upstreamApiKey: string;
  upstreamProvider?: string;
  signal?: AbortSignal;
}

export interface AuditOptions {
  compliance?: boolean;
  verify?: boolean;
  limit?: number;
  signal?: AbortSignal;
}

export function createVeilHeaders(options: VeilHeaderOptions): Record<string, string>;
export function createVeilOpenAIConfig(options: VeilOpenAIConfigOptions): Record<string, unknown>;

export class VeilClient {
  constructor(options: VeilClientOptions);
  request(path: string, options?: {
    method?: string;
    headers?: Record<string, string>;
    body?: unknown;
    signal?: AbortSignal;
  }): Promise<any>;
  chatCompletions(body: Record<string, unknown>, options: ChatCompletionOptions): Promise<any>;
  redact(options: RedactOptions): Promise<any>;
  providers(options?: { signal?: AbortSignal }): Promise<any>;
  usage(options?: { signal?: AbortSignal }): Promise<any>;
  audit(options?: AuditOptions): Promise<any>;
}
