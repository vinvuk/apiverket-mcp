#!/usr/bin/env node
/**
 * Apiverket MCP Server.
 *
 * Provides two tools for querying Swedish government data via the Apiverket API:
 * - govdata_discover: Search and browse available API endpoints
 * - govdata_query: Call any endpoint with parameters
 *
 * Plus a resource exposing the full endpoint catalog.
 */
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { z } from "zod";
import { ENDPOINTS, searchEndpoints, getEndpointsByCategory, getCategories } from "./endpoints.js";
import { callApi, resolvePathParams, truncateIfNeeded } from "./api-client.js";
// ── Server instance ──────────────────────────────────────────────────
const server = new McpServer({
    name: "govdata-mcp-server",
    version: "1.0.0",
});
// ── Helpers ──────────────────────────────────────────────────────────
/**
 * Formats an endpoint for display in tool responses.
 * @param ep - The endpoint to format
 * @returns A human-readable markdown string
 */
function formatEndpoint(ep) {
    const params = ep.parameters.length > 0
        ? ep.parameters.map(p => `  - \`${p.name}\` (${p.in}${p.required ? ", required" : ""}): ${p.description}`).join("\n")
        : "  None";
    return `### ${ep.summary}\n\`${ep.method.toUpperCase()} ${ep.path}\`\nCategory: ${ep.category}\n${ep.description}\n**Parameters:**\n${params}`;
}
// ── Tool: govdata_discover ───────────────────────────────────────────
const DiscoverInputSchema = z.object({
    query: z.string()
        .max(200)
        .optional()
        .describe("Search keyword to find relevant endpoints (e.g. 'weather', 'train', 'population', 'pension'). Leave empty to list all categories."),
    category: z.string()
        .optional()
        .describe("Filter by category name (e.g. 'Weather & Climate', 'Economy & Finance'). Use without query to browse a category."),
}).strict();
server.registerTool("govdata_discover", {
    title: "Discover Apiverket Endpoints",
    description: `Search and browse available Swedish government data endpoints in the Apiverket API.

Use this tool to find the right endpoint before calling govdata_query. The API covers 139 endpoints across 16 categories including weather, transport, economy, health, environment, parliament, police, education, and more.

Args:
  - query (string, optional): Keyword to search across endpoint names, descriptions, and paths
  - category (string, optional): Filter by category name

When called with no arguments, returns all available categories with endpoint counts.

Examples:
  - Find weather endpoints: query="weather"
  - Browse transport category: category="Transport"
  - Find pension info: query="pension"
  - List all categories: (no arguments)

Returns:
  Matching endpoints with their paths, parameters, and descriptions.`,
    inputSchema: DiscoverInputSchema,
    annotations: {
        readOnlyHint: true,
        destructiveHint: false,
        idempotentHint: true,
        openWorldHint: false,
    },
}, async (params) => {
    let results;
    let heading;
    if (params.query && params.category) {
        // Both: search within category
        const catEndpoints = getEndpointsByCategory(params.category);
        const lower = params.query.toLowerCase();
        results = catEndpoints.filter(e => e.summary.toLowerCase().includes(lower) ||
            e.description.toLowerCase().includes(lower) ||
            e.path.toLowerCase().includes(lower));
        heading = `# Endpoints matching "${params.query}" in ${params.category}`;
    }
    else if (params.query) {
        results = searchEndpoints(params.query);
        heading = `# Endpoints matching "${params.query}"`;
    }
    else if (params.category) {
        results = getEndpointsByCategory(params.category);
        heading = `# ${params.category} Endpoints`;
    }
    else {
        // No args: show categories overview
        const categories = getCategories();
        const lines = ["# Apiverket API — Available Categories\n"];
        for (const cat of categories) {
            const count = ENDPOINTS.filter(e => e.category === cat).length;
            lines.push(`- **${cat}** (${count} endpoints)`);
        }
        lines.push(`\n**Total: ${ENDPOINTS.length} endpoints**`);
        lines.push("\nUse `category` to browse a specific category, or `query` to search by keyword.");
        return {
            content: [{ type: "text", text: lines.join("\n") }],
        };
    }
    if (results.length === 0) {
        return {
            content: [{ type: "text", text: `No endpoints found matching your search. Try a different keyword or browse categories by calling with no arguments.` }],
        };
    }
    const text = `${heading}\n\nFound ${results.length} endpoint(s):\n\n${results.map(formatEndpoint).join("\n\n---\n\n")}`;
    return {
        content: [{ type: "text", text: truncateIfNeeded(text) }],
    };
});
// ── Tool: govdata_query ──────────────────────────────────────────────
const QueryInputSchema = z.object({
    endpoint: z.string()
        .describe("API endpoint path from the discover tool (e.g. '/v1/weather/{city}', '/v1/rates', '/v1/police/events')"),
    path_params: z.record(z.string())
        .optional()
        .describe("Path parameter values to substitute in the endpoint URL. Example: { \"city\": \"stockholm\" } for /v1/weather/{city}"),
    query_params: z.record(z.union([z.string(), z.number(), z.boolean()]))
        .optional()
        .describe("Query string parameters. Example: { \"q\": \"developer\", \"limit\": 5 } for search endpoints"),
}).strict();
server.registerTool("govdata_query", {
    title: "Query Apiverket API",
    description: `Call any Apiverket API endpoint to retrieve Swedish government data.

Use govdata_discover first to find the right endpoint path and required parameters. Then call this tool with the endpoint path and any path/query parameters.

Args:
  - endpoint (string, required): The API path (e.g. "/v1/weather/{city}")
  - path_params (object, optional): Values for path parameters like {city}, {code}, {id}
  - query_params (object, optional): Query string parameters (q, limit, offset, lat, lon, etc.)

Examples:
  - Current weather in Stockholm:
    endpoint="/v1/weather/{city}", path_params={"city": "stockholm"}
  - Search jobs:
    endpoint="/v1/jobs/search", query_params={"q": "developer", "limit": 5}
  - Train departures from Stockholm Central:
    endpoint="/v1/transport/trains/{station}", path_params={"station": "Cst"}
  - Exchange rates:
    endpoint="/v1/rates"
  - Population by municipality:
    endpoint="/v1/population/{municipalityCode}", path_params={"municipalityCode": "0180"}
  - Police events in Stockholm:
    endpoint="/v1/police/events", query_params={"location": "Stockholm", "limit": 10}
  - Find EV chargers near a location:
    endpoint="/v1/infrastructure/ev-chargers", query_params={"lat": 59.33, "lon": 18.07}

Returns:
  The API response as JSON, containing a "meta" envelope with request info and a "data" object with the actual data.

Error handling:
  - Returns clear error messages if the API is unreachable, the endpoint doesn't exist, or parameters are invalid
  - Large responses are automatically truncated with pagination guidance`,
    inputSchema: QueryInputSchema,
    annotations: {
        readOnlyHint: true,
        destructiveHint: false,
        idempotentHint: true,
        openWorldHint: true,
    },
}, async (params) => {
    // Resolve path parameters if provided
    const resolvedPath = params.path_params
        ? resolvePathParams(params.endpoint, params.path_params)
        : params.endpoint;
    // Validate path doesn't still contain unresolved {params}
    const unresolvedMatch = resolvedPath.match(/\{(\w+)\}/);
    if (unresolvedMatch) {
        return {
            content: [{
                    type: "text",
                    text: `Error: Missing path parameter "{${unresolvedMatch[1]}}". Provide it in path_params. Example: path_params={"${unresolvedMatch[1]}": "value"}`,
                }],
        };
    }
    // Call the API
    const result = await callApi(resolvedPath, params.query_params);
    if (!result.success) {
        return {
            content: [{
                    type: "text",
                    text: `Error querying ${resolvedPath}: ${result.error}`,
                }],
        };
    }
    const json = JSON.stringify(result.data, null, 2);
    return {
        content: [{ type: "text", text: truncateIfNeeded(json) }],
    };
});
// ── Resource: endpoint catalog ───────────────────────────────────────
server.registerResource("endpoint-catalog", "govdata://endpoints", {
    description: "Complete list of all available Apiverket API endpoints with descriptions and parameters",
    mimeType: "application/json",
}, async () => {
    const catalog = {
        total: ENDPOINTS.length,
        categories: getCategories(),
        endpoints: ENDPOINTS.map(e => ({
            path: e.path,
            method: e.method,
            summary: e.summary,
            category: e.category,
            parameters: e.parameters,
        })),
    };
    return {
        contents: [{
                uri: "govdata://endpoints",
                mimeType: "application/json",
                text: JSON.stringify(catalog, null, 2),
            }],
    };
});
// ── Prompt: data analysis ────────────────────────────────────────────
server.registerPrompt("analyze_swedish_data", {
    title: "Analyze Swedish Data",
    description: "Template for analyzing Swedish government data — guides through discovery, querying, and analysis.",
    argsSchema: {
        topic: z.string().describe("What data to analyze (e.g. 'housing prices', 'train delays', 'crime in Stockholm')"),
    },
}, async ({ topic }) => ({
    messages: [
        {
            role: "user",
            content: {
                type: "text",
                text: `I want to analyze Swedish government data about: ${topic}

Please help me by:
1. Using govdata_discover to find relevant API endpoints for this topic
2. Using govdata_query to fetch the actual data
3. Summarizing the key findings in a clear, structured way

Focus on the most relevant data points and highlight any interesting trends or notable values.`,
            },
        },
    ],
}));
// ── Start server ─────────────────────────────────────────────────────
/**
 * Starts the MCP server using stdio transport.
 */
async function main() {
    const transport = new StdioServerTransport();
    await server.connect(transport);
    console.error("Apiverket MCP server running via stdio");
}
main().catch((error) => {
    console.error("Fatal error:", error);
    process.exit(1);
});
//# sourceMappingURL=index.js.map