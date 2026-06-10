/**
 * HTTP client for the Apiverket API.
 * Handles authentication, request construction, and error formatting.
 */

/** Character limit for tool responses to avoid overwhelming the LLM context. */
export const CHARACTER_LIMIT = 25_000;
export const MCP_CLIENT_NAME = "apiverket-mcp";
export const MCP_CLIENT_VERSION = "1.2.0";

/**
 * Resolves the Apiverket API base URL from environment or defaults to localhost.
 * @returns The base URL without trailing slash
 */
function getBaseUrl(): string {
  return (process.env.GOVDATA_API_URL ?? "http://localhost:3010").replace(/\/$/, "");
}

/**
 * Resolves the API key from environment.
 * Falls back to the demo test key for local development.
 * @returns The API key string
 */
function getApiKey(): string {
  return process.env.GOVDATA_API_KEY ?? "sk_test_demo";
}

/**
 * Replaces path parameters like {city} or {code} in a URL template.
 * @param pathTemplate - URL path with {param} placeholders
 * @param pathParams - Object mapping param names to values
 * @returns The resolved path
 */
export function resolvePathParams(
  pathTemplate: string,
  pathParams: Record<string, string>
): string {
  let resolved = pathTemplate;
  for (const [key, value] of Object.entries(pathParams)) {
    resolved = resolved.replace(`{${key}}`, encodeURIComponent(value));
  }
  return resolved;
}

/**
 * Builds a query string from an object of key-value pairs.
 * Skips undefined and null values.
 * @param params - Query parameter object
 * @returns Query string starting with "?" or empty string
 */
function buildQueryString(params: Record<string, string | number | boolean | undefined>): string {
  const entries = Object.entries(params).filter(([, v]) => v !== undefined && v !== null);
  if (entries.length === 0) return "";
  const qs = entries.map(([k, v]) => `${encodeURIComponent(k)}=${encodeURIComponent(String(v))}`).join("&");
  return `?${qs}`;
}

/** Structured result from an API call. */
export interface ApiResult {
  success: boolean;
  status: number;
  data: unknown;
  error?: string;
  errorDetails?: ApiErrorDetails;
  retryAfter?: string | null;
}

/** Structured Apiverket error details preserved for agent recovery guidance. */
export interface ApiErrorDetails {
  type?: string;
  code?: string;
  message?: string;
  param?: string;
  source?: string;
  request_id?: string;
  rate_limit?: {
    scope?: string;
    tier?: string;
    limit?: number;
    remaining?: number;
    reset_at?: string;
    retry_after_seconds?: number;
  };
  guidance?: {
    action?: string;
    message?: string;
    docs_url?: string;
    upgrade_url?: string;
  };
  help?: {
    message?: string;
    suggested_endpoint?: string;
    examples?: string[];
    available_examples?: string[];
    docs_url?: string;
    console_url?: string;
  };
}

/**
 * Calls the Apiverket API with the given path and parameters.
 * @param path - Resolved API path (e.g. "/v1/weather/stockholm")
 * @param queryParams - Optional query parameters
 * @returns The API response data or error info
 */
export async function callApi(
  path: string,
  queryParams?: Record<string, string | number | boolean | undefined>
): Promise<ApiResult> {
  const baseUrl = getBaseUrl();
  const apiKey = getApiKey();
  const qs = queryParams ? buildQueryString(queryParams) : "";
  const url = `${baseUrl}${path}${qs}`;

  try {
    const response = await fetch(url, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        Accept: "application/json",
        "User-Agent": `${MCP_CLIENT_NAME}/${MCP_CLIENT_VERSION}`,
        "X-Apiverket-Client": "mcp",
        "X-Apiverket-MCP-Version": MCP_CLIENT_VERSION,
      },
      signal: AbortSignal.timeout(30_000),
    });

    const body = await response.text();

    if (!response.ok) {
      let errorMessage: string;
      let errorDetails: ApiErrorDetails | undefined;
      try {
        const errorJson = JSON.parse(body);
        errorDetails = errorJson.error;
        errorMessage = errorDetails?.message ?? errorJson.message ?? `HTTP ${response.status}`;
      } catch {
        errorMessage = `HTTP ${response.status}: ${body.slice(0, 200)}`;
      }

      return {
        success: false,
        status: response.status,
        data: null,
        error: errorMessage,
        errorDetails,
        retryAfter: response.headers.get("Retry-After"),
      };
    }

    const data = JSON.parse(body);
    return { success: true, status: response.status, data };
  } catch (error) {
    if (error instanceof Error && error.name === "TimeoutError") {
      return { success: false, status: 0, data: null, error: "Request timed out after 30 seconds. The API may be slow or unavailable." };
    }
    if (error instanceof TypeError && (error as NodeJS.ErrnoException).code === "ECONNREFUSED") {
      return { success: false, status: 0, data: null, error: `Cannot connect to Apiverket API at ${baseUrl}. Make sure the API server is running.` };
    }
    return {
      success: false,
      status: 0,
      data: null,
      error: `Unexpected error: ${error instanceof Error ? error.message : String(error)}`,
    };
  }
}

/**
 * Truncates a JSON string if it exceeds the character limit.
 * @param json - The JSON string to potentially truncate
 * @returns The original or truncated string with a notice
 */
export function truncateIfNeeded(json: string): string {
  if (json.length <= CHARACTER_LIMIT) return json;
  return json.slice(0, CHARACTER_LIMIT) +
    "\n\n... [Response truncated. Use 'limit' or 'offset' parameters to paginate, or add filters to narrow results.]";
}
