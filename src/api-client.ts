/**
 * HTTP client for the Apiverket API.
 * Handles authentication, request construction, and error formatting.
 */

/** Character limit for tool responses to avoid overwhelming the LLM context. */
export const CHARACTER_LIMIT = 25_000;

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
 * Builds and validates the outbound Apiverket URL.
 * @param baseUrl - Configured Apiverket base URL
 * @param path - Resolved API path
 * @param queryParams - Optional query parameters
 * @returns A URL object scoped to the configured API origin
 */
function buildApiUrl(
  baseUrl: string,
  path: string,
  queryParams?: Record<string, string | number | boolean | undefined>
): URL {
  if (!path.startsWith("/") || path.startsWith("//") || path.includes("\\") || /[\r\n]/.test(path)) {
    throw new Error("Endpoint must be a relative API path starting with a single slash.");
  }

  const base = new URL(baseUrl);
  const url = new URL(path, base);

  if (url.origin !== base.origin) {
    throw new Error("Endpoint resolved outside the configured Apiverket API origin.");
  }

  if (queryParams) {
    for (const [key, value] of Object.entries(queryParams)) {
      if (value !== undefined && value !== null) {
        url.searchParams.set(key, String(value));
      }
    }
  }

  return url;
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

/** Structured result from an API call. */
export interface ApiResult {
  success: boolean;
  status: number;
  data: unknown;
  error?: string;
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

  try {
    const url = buildApiUrl(baseUrl, path, queryParams);
    const response = await fetch(url, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        Accept: "application/json",
      },
      signal: AbortSignal.timeout(30_000),
    });

    const body = await response.text();

    if (!response.ok) {
      let errorMessage: string;
      try {
        const errorJson = JSON.parse(body);
        errorMessage = errorJson.error?.message ?? errorJson.message ?? `HTTP ${response.status}`;
      } catch {
        errorMessage = `HTTP ${response.status}: ${body.slice(0, 200)}`;
      }

      return {
        success: false,
        status: response.status,
        data: null,
        error: errorMessage,
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
