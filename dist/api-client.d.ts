/**
 * HTTP client for the Apiverket API.
 * Handles authentication, request construction, and error formatting.
 */
/** Character limit for tool responses to avoid overwhelming the LLM context. */
export declare const CHARACTER_LIMIT = 25000;
/**
 * Replaces path parameters like {city} or {code} in a URL template.
 * @param pathTemplate - URL path with {param} placeholders
 * @param pathParams - Object mapping param names to values
 * @returns The resolved path
 */
export declare function resolvePathParams(pathTemplate: string, pathParams: Record<string, string>): string;
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
export declare function callApi(path: string, queryParams?: Record<string, string | number | boolean | undefined>): Promise<ApiResult>;
/**
 * Truncates a JSON string if it exceeds the character limit.
 * @param json - The JSON string to potentially truncate
 * @returns The original or truncated string with a notice
 */
export declare function truncateIfNeeded(json: string): string;
