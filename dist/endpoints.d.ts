/**
 * Apiverket API endpoint registry.
 * Each entry describes an available API endpoint with its path, parameters, and category.
 */
/** Describes a single API endpoint parameter. */
export interface EndpointParam {
    name: string;
    in: "path" | "query";
    required: boolean;
    description: string;
}
/** Describes a single API endpoint. */
export interface Endpoint {
    path: string;
    method: string;
    summary: string;
    description: string;
    category: string;
    parameters: EndpointParam[];
}
/**
 * The complete endpoint registry, built from the OpenAPI spec.
 * Sorted by category then path for easy browsing.
 */
export declare const ENDPOINTS: Endpoint[];
/**
 * Returns all unique category names from the endpoint registry.
 * @returns Sorted array of category names
 */
export declare function getCategories(): string[];
/**
 * Searches endpoints by keyword across summary, description, path, and category.
 * @param query - Search term (case-insensitive)
 * @returns Matching endpoints
 */
export declare function searchEndpoints(query: string): Endpoint[];
/**
 * Returns endpoints filtered by category.
 * @param category - Category name (case-insensitive partial match)
 * @returns Matching endpoints
 */
export declare function getEndpointsByCategory(category: string): Endpoint[];
