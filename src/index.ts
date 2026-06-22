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
import type { ApiResult } from "./api-client.js";
import type { Endpoint } from "./endpoints.js";
import {
  endpointPlaybookRank,
  formatFamilyPlaybook,
  matchFamilyPlaybooks,
} from "./playbooks.js";
import { pathToFileURL } from "node:url";

// ── Server instance ──────────────────────────────────────────────────

const server = new McpServer({
  name: "govdata-mcp-server",
  version: "1.2.0",
});

// ── Helpers ──────────────────────────────────────────────────────────

/**
 * Formats an endpoint for display in tool responses.
 * @param ep - The endpoint to format
 * @returns A human-readable markdown string
 */
export function formatEndpoint(ep: Endpoint): string {
  const params = ep.parameters.length > 0
    ? ep.parameters.map(p => `  - \`${p.name}\` (${p.in}${p.required ? ", required" : ""}): ${p.description}`).join("\n")
    : "  None";
  const guidance = ep.guidance ? [
    ep.guidance.whenToUse ? `**When to use:** ${ep.guidance.whenToUse}` : undefined,
    ep.guidance.workflow?.length ? `**Workflow:**\n${ep.guidance.workflow.map((item, index) => `  ${index + 1}. ${item}`).join("\n")}` : undefined,
    ep.guidance.constraints?.length ? `**Constraints:**\n${ep.guidance.constraints.map(item => `  - ${item}`).join("\n")}` : undefined,
    ep.guidance.avoid?.length ? `**Avoid:**\n${ep.guidance.avoid.map(item => `  - ${item}`).join("\n")}` : undefined,
    ep.guidance.quotaNotes?.length ? `**Quota notes:**\n${ep.guidance.quotaNotes.map(item => `  - ${item}`).join("\n")}` : undefined,
    ep.guidance.recovery?.length ? `**Recovery:**\n${ep.guidance.recovery.map(item => `  - ${item}`).join("\n")}` : undefined,
    ep.guidance.examples?.length ? `**Examples:**\n${ep.guidance.examples.map(item => `  - ${item}`).join("\n")}` : undefined,
    ep.guidance.upgradeTrigger ? `**Upgrade trigger:** ${ep.guidance.upgradeTrigger}` : undefined,
  ].filter(Boolean).join("\n") : "";

  return [
    `### ${ep.summary}`,
    `\`${ep.method.toUpperCase()} ${ep.path}\``,
    `Category: ${ep.category}`,
    ep.description,
    `**Parameters:**\n${params}`,
    guidance,
  ].filter(Boolean).join("\n");
}

function maskPath(path: string): string {
  if (/^\/v1\/companies\/search(?:$|[/?#])/.test(path)) return "/v1/companies/search";
  if (/^\/v1\/companies\/[^/]+\/.+/.test(path)) return "/v1/companies/:orgNumber/:subpath";
  if (/^\/v1\/companies\/[^/]+/.test(path)) return "/v1/companies/:orgNumber";
  return path;
}

function companyAgentRecoveryLines(path: string, result?: ApiResult): string[] {
  const err = result?.errorDetails;
  const masked = maskPath(path);
  const isCompany = masked.startsWith("/v1/companies/")
    || masked === "/v1/companies/search"
    || /^\/v1\/companies(?:\/|$)/.test(path);
  if (!isCompany) return [];

  const code = err?.code ?? "";
  const scope = err?.rate_limit?.scope ?? "";
  const isSearchQuota = scope === "company_search_daily" || code === "company_search_daily_limit_exceeded" || code === "company_search_retry_loop";
  const isWorkflowCooldown = scope === "company_automation_cooldown";
  const isLookupValidation = err?.param === "orgNumber" || (masked === "/v1/companies/:orgNumber" && result?.status === 400);
  const isUnsupportedSubpath = masked === "/v1/companies/:orgNumber/:subpath" || code === "endpoint_not_found";

  const lines = [
    "Agent self-healing instructions:",
    "  1. Do not call govdata_query again with the same endpoint and params.",
  ];

  if (isSearchQuota) {
    lines.push(
      "  2. Call govdata_account before any further company search to inspect tier, reset time, and remaining company-search quota.",
      "  3. Call govdata_discover with query=\"company\" if the workflow is uncertain.",
      "  4. Until search resets, use /v1/companies/{orgNumber} only when org_number is already known.",
      "  5. Mention upgrade only if the user needs production-scale company discovery/search volume."
    );
    return lines;
  }

  if (isWorkflowCooldown) {
    lines.push(
      "  2. Call govdata_account to inspect cooldown/quota context before choosing another company call.",
      "  3. Call govdata_discover with query=\"company\" to refresh the supported search-then-lookup workflow.",
      "  4. Only make a new lookup when you have a validated Swedish 10-digit org_number.",
      "  5. If the user only provided a name or uncertain identifier, wait for search availability and search once, then cache org_number."
    );
    return lines;
  }

  if (isLookupValidation) {
    lines.push(
      "  2. Treat the current value as invalid or uncertain; do not transform it into another guessed org number.",
      "  3. Call govdata_discover with query=\"company\" if you need to re-check the supported workflow.",
      "  4. If the user gave a company name, call /v1/companies/search once and cache the returned org_number.",
      "  5. If the user intended an org number, ask for or derive a valid Swedish 10-digit organisation number before lookup."
    );
    return lines;
  }

  if (isUnsupportedSubpath) {
    lines.push(
      "  2. Do not guess board, owner, officer, UBO, or other company subresource paths.",
      "  3. Call govdata_discover with query=\"company\" and choose one of the supported company endpoints.",
      "  4. Use search for discovery and lookup for enrichment once org_number is known."
    );
    return lines;
  }

  lines.push(
    "  2. Call govdata_discover with query=\"company\" before trying a different company endpoint.",
    "  3. Use search only for discovery; cache org_number; use lookup for repeated enrichment."
  );
  return lines;
}

export function formatUnsupportedEndpoint(endpoint: string): string {
  if (/^\/v1\/companies(?:\/|$)/.test(endpoint)) {
    const subresource = /^\/v1\/companies\/[^/]+\/.+/.test(endpoint) || /^\/v1\/companies\/(board|officers?|directors?|owners?|beneficial-owners|ubo|representatives)(?:\/|$)/i.test(endpoint);
    return [
      `Error: Unsupported company endpoint "${subresource ? "/v1/companies/:orgNumber/:subpath" : maskPath(endpoint)}".`,
      "Use govdata_discover with query=\"company\" to select a supported company endpoint.",
      "Supported workflow: call /v1/companies/search once when you only have a company name, cache the returned org_number, then call /v1/companies/{orgNumber} for repeated lookups.",
      "Apiverket does not expose board, officer, owner, UBO, or other company subresource paths through the company API.",
      ...companyAgentRecoveryLines(endpoint),
    ].join("\n");
  }

  const playbooks = matchFamilyPlaybooks(endpoint);
  if (playbooks.length) {
    return [
      `Error: Unsupported endpoint "${maskPath(endpoint)}".`,
      "Use govdata_discover to select a supported Apiverket endpoint instead of guessing /v1 paths.",
      formatFamilyPlaybook(playbooks[0]),
    ].join("\n\n");
  }

  return `Error: Unsupported endpoint "${endpoint}". Use govdata_discover to select one of the ${ENDPOINTS.length} supported Apiverket endpoints instead of guessing /v1 paths.`;
}

export function formatApiFailure(path: string, result: ApiResult): string {
  const err = result.errorDetails;
  const lines = [
    `Error querying ${maskPath(path)}: ${err?.message ?? result.error ?? `HTTP ${result.status}`}`,
  ];

  if (result.status) lines.push(`Status: ${result.status}`);
  if (err?.code) lines.push(`Code: ${err.code}`);
  if (err?.param) lines.push(`Parameter: ${err.param}`);
  if (err?.request_id) lines.push(`Request ID: ${err.request_id}`);

  if (err?.guidance?.message) lines.push(`Guidance: ${err.guidance.message}`);
  if (err?.guidance?.action) lines.push(`Recommended action: ${err.guidance.action}`);
  if (err?.guidance?.diagnosis) {
    const diagnosis = err.guidance.diagnosis;
    if (diagnosis.problem) lines.push(`Diagnosis: ${diagnosis.problem}`);
    if (diagnosis.likely_cause) lines.push(`Likely cause: ${diagnosis.likely_cause}`);
    if (diagnosis.correct_workflow?.length) {
      lines.push("Correct workflow:");
      diagnosis.correct_workflow.forEach((step, index) => {
        lines.push(`  ${index + 1}. ${step}`);
      });
    }
  }

  const rateLimit = err?.rate_limit;
  if (rateLimit) {
    const parts = [
      rateLimit.scope ? `scope=${rateLimit.scope}` : undefined,
      rateLimit.tier ? `tier=${rateLimit.tier}` : undefined,
      typeof rateLimit.limit === "number" ? `limit=${rateLimit.limit}` : undefined,
      typeof rateLimit.remaining === "number" ? `remaining=${rateLimit.remaining}` : undefined,
      rateLimit.reset_at ? `reset_at=${rateLimit.reset_at}` : undefined,
      rateLimit.retry_after_seconds ? `retry_after_seconds=${rateLimit.retry_after_seconds}` : undefined,
    ].filter(Boolean);
    if (parts.length) lines.push(`Rate limit: ${parts.join(", ")}`);
  } else if (result.retryAfter) {
    lines.push(`Retry-After: ${result.retryAfter} seconds`);
  }

  if (err?.help?.message) lines.push(`Help: ${err.help.message}`);
  if (err?.help?.suggested_endpoint) lines.push(`Suggested endpoint: ${err.help.suggested_endpoint}`);
  if (err?.help?.available_examples?.length) lines.push(`Available examples: ${err.help.available_examples.join(", ")}`);
  else if (err?.help?.examples?.length) lines.push(`Examples: ${err.help.examples.join(", ")}`);

  if (err?.rate_limit?.scope === "company_search_daily") {
    lines.push("Company-search recovery: stop retrying search until reset_at, use /v1/companies/{orgNumber} if you already have org numbers, and call govdata_account to inspect the current tier and remaining company-search quota.");
    if (err.guidance?.upgrade_url) lines.push(`Upgrade when needed: ${err.guidance.upgrade_url}`);
  }

  if (err?.rate_limit?.scope === "company_automation_cooldown") {
    lines.push("Company workflow recovery: pause retries for the cooldown window. Do not keep retrying the same failing request. Use govdata_discover if the endpoint choice is uncertain, use company search only for discovery, cache org_number, and use lookup for repeated enrichment.");
    if (err.code === "company_search_retry_loop" && err.guidance?.upgrade_url) lines.push(`Upgrade when search volume becomes production usage: ${err.guidance.upgrade_url}`);
  }

  if (err?.param === "orgNumber" || maskPath(path).startsWith("/v1/companies/")) {
    lines.push("Company lookup tip: organisation numbers must be valid Swedish 10-digit numbers. If the user only gave a company name, use /v1/companies/search first and cache the returned org_number.");
  }

  lines.push(...companyAgentRecoveryLines(path, result));

  const playbooks = matchFamilyPlaybooks(path);
  if (playbooks.length && !maskPath(path).startsWith("/v1/companies/")) {
    lines.push("Family recovery:");
    for (const item of playbooks[0].recovery ?? playbooks[0].workflow.slice(0, 2)) {
      lines.push(`- ${item}`);
    }
  }

  return lines.join("\n");
}

function asRecord(value: unknown): Record<string, unknown> {
  return value && typeof value === "object" && !Array.isArray(value) ? value as Record<string, unknown> : {};
}

function formatNumber(value: unknown): string {
  return typeof value === "number" ? value.toLocaleString("en-US") : "unknown";
}

function formatPrice(value: unknown): string {
  if (typeof value !== "number") return "custom";
  return value === 0 ? "0 SEK/mo" : `${value.toLocaleString("en-US")} SEK/mo`;
}

export async function buildAccountSummary(): Promise<string> {
  const [infoResult, usageResult, tiersResult] = await Promise.all([
    callApi("/v1/account/info"),
    callApi("/v1/account/usage"),
    callApi("/v1/account/tiers"),
  ]);

  if (!infoResult.success) return formatApiFailure("/v1/account/info", infoResult);
  if (!usageResult.success) return formatApiFailure("/v1/account/usage", usageResult);
  if (!tiersResult.success) return formatApiFailure("/v1/account/tiers", tiersResult);

  const info = asRecord(asRecord(infoResult.data).data);
  const limits = asRecord(info.limits);
  const usage = asRecord(asRecord(usageResult.data).data);
  const companySearch = asRecord(usage.company_search);
  const tiers = Array.isArray(asRecord(asRecord(tiersResult.data).data).tiers)
    ? asRecord(asRecord(tiersResult.data).data).tiers as Record<string, unknown>[]
    : [];

  const tier = String(info.tier ?? usage.tier ?? "unknown");
  const mode = String(info.mode ?? "unknown");
  const dailyLimit = usage.daily_limit ?? limits.daily_limit;
  const todayCount = usage.today_count;
  const todayRemaining = usage.today_remaining;
  const companyDailyLimit = companySearch.daily_limit ?? limits.company_search_daily_limit;
  const companyToday = companySearch.today_count ?? companySearch.today_requests;
  const companyRemaining = companySearch.remaining;

  const lines = [
    "# Apiverket account",
    `Mode: ${mode}`,
    `Tier: ${tier}`,
    `Daily API usage: ${formatNumber(todayCount)} of ${formatNumber(dailyLimit)} used (${formatNumber(todayRemaining)} remaining).`,
    `Rate limit: ${formatNumber(limits.rate_limit_per_minute ?? usage.rate_limit_per_minute)} requests/minute.`,
    `Company search: ${formatNumber(companyToday)} of ${formatNumber(companyDailyLimit)} used (${formatNumber(companyRemaining)} remaining).`,
  ];

  if (typeof companySearch.reset_at === "string") lines.push(`Company-search reset: ${companySearch.reset_at}`);
  if (typeof companySearch.recent_429_count === "number" && companySearch.recent_429_count > 0) {
    lines.push(`Recent company-search 429s: ${companySearch.recent_429_count}. Stop retrying search until reset; use /v1/companies/{orgNumber} when org numbers are already known.`);
  }

  if (tier === "free") {
    lines.push("Upgrade cue: Free is good for exploration. Upgrade when daily API or company-search limits block a real workflow.");
  }

  if (tiers.length) {
    lines.push("\n## Available tiers");
    for (const item of tiers) {
      lines.push(`- ${String(item.name)}: ${formatNumber(item.daily_limit)} requests/day, ${formatNumber(item.rate_limit_per_minute)} req/min, ${formatNumber(item.company_search_daily_limit)} company searches/day, ${formatPrice(item.price_sek_per_month)}`);
    }
  }

  return lines.join("\n");
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

server.registerTool(
  "govdata_discover",
  {
    title: "Discover Apiverket Endpoints",
    description: `Search and browse available Swedish government data endpoints in the Apiverket API.

Use this tool to find the right endpoint before calling govdata_query. The API covers ${ENDPOINTS.length} endpoints across ${getCategories().length} categories including weather, transport, economy, health, environment, parliament, police, education, and more.

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
  },
  async (params) => {
    let results: Endpoint[];
    let heading: string;

    if (params.query && params.category) {
      // Both: search within category
      const catEndpoints = getEndpointsByCategory(params.category);
      const lower = params.query.toLowerCase();
      results = catEndpoints.filter(e =>
        e.summary.toLowerCase().includes(lower) ||
        e.description.toLowerCase().includes(lower) ||
        e.path.toLowerCase().includes(lower)
      );
      heading = `# Endpoints matching "${params.query}" in ${params.category}`;
    } else if (params.query) {
      results = searchEndpoints(params.query);
      heading = `# Endpoints matching "${params.query}"`;
    } else if (params.category) {
      results = getEndpointsByCategory(params.category);
      heading = `# ${params.category} Endpoints`;
    } else {
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
        content: [{ type: "text", text: `No endpoints found matching your search. Try a different keyword, browse categories by calling with no arguments, or use /api outside MCP for the machine-readable endpoint list. Do not guess unsupported /v1 paths.` }],
      };
    }

    const playbooks = matchFamilyPlaybooks(params.query, params.category, results).slice(0, 2);
    if (playbooks.length) {
      results = [...results].sort((a, b) => {
        const rankDiff = endpointPlaybookRank(a, playbooks) - endpointPlaybookRank(b, playbooks);
        if (rankDiff !== 0) return rankDiff;
        return a.path.localeCompare(b.path);
      });
    }

    const playbookText = playbooks.length ? `${playbooks.map(formatFamilyPlaybook).join("\n\n")}\n\n---\n\n` : "";
    const recommended = playbooks.length
      ? `\n\n**Top recommended entrypoints:** ${results.slice(0, 3).map((endpoint) => `\`${endpoint.path}\``).join(", ")}`
      : "";
    const text = `${heading}\n\n${playbookText}Found ${results.length} endpoint(s):${recommended}\n\n${results.map(formatEndpoint).join("\n\n---\n\n")}`;

    return {
      content: [{ type: "text", text: truncateIfNeeded(text) }],
    };
  }
);

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

server.registerTool(
  "govdata_query",
  {
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
  },
  async (params) => {
    const endpoint = ENDPOINTS.find(e => e.path === params.endpoint);
    if (!endpoint) {
      return {
        content: [{
          type: "text",
          text: formatUnsupportedEndpoint(params.endpoint),
        }],
      };
    }

    // Resolve path parameters if provided
    const resolvedPath = params.path_params
      ? resolvePathParams(endpoint.path, params.path_params)
      : endpoint.path;

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
    const result = await callApi(resolvedPath, params.query_params as Record<string, string | number | boolean | undefined>);

    if (!result.success) {
      return {
        content: [{
          type: "text",
          text: formatApiFailure(resolvedPath, result),
        }],
      };
    }

    const json = JSON.stringify(result.data, null, 2);
    return {
      content: [{ type: "text", text: truncateIfNeeded(json) }],
    };
  }
);

// ── Tool: govdata_account ────────────────────────────────────────────

const AccountInputSchema = z.object({}).strict();

server.registerTool(
  "govdata_account",
  {
    title: "Inspect Apiverket Account Limits",
    description: `Return sanitized account and quota context for the configured Apiverket API key.

Use this tool when the user asks about limits, quota, production readiness, upgrade needs, or after any 429 response. It reports key mode, tier, daily API usage, company-search usage, reset time, and available tiers without exposing API keys, emails, or identifiers.`,
    inputSchema: AccountInputSchema,
    annotations: {
      readOnlyHint: true,
      destructiveHint: false,
      idempotentHint: true,
      openWorldHint: false,
    },
  },
  async () => ({
    content: [{ type: "text", text: truncateIfNeeded(await buildAccountSummary()) }],
  })
);

// ── Resource: endpoint catalog ───────────────────────────────────────

server.registerResource(
  "endpoint-catalog",
  "govdata://endpoints",
  {
    description: "Complete list of all available Apiverket API endpoints with descriptions and parameters",
    mimeType: "application/json",
  },
  async () => {
    const catalog = {
      total: ENDPOINTS.length,
      categories: getCategories(),
      endpoints: ENDPOINTS.map(e => ({
        path: e.path,
        method: e.method,
        summary: e.summary,
        description: e.description,
        category: e.category,
        parameters: e.parameters,
        guidance: e.guidance,
      })),
    };

    return {
      contents: [{
        uri: "govdata://endpoints",
        mimeType: "application/json",
        text: JSON.stringify(catalog, null, 2),
      }],
    };
  }
);

// ── Prompt: data analysis ────────────────────────────────────────────

server.registerPrompt(
  "analyze_swedish_data",
  {
    title: "Analyze Swedish Data",
    description: "Template for analyzing Swedish government data — guides through discovery, querying, and analysis.",
    argsSchema: {
      topic: z.string().describe("What data to analyze (e.g. 'housing prices', 'train delays', 'crime in Stockholm')"),
    },
  },
  async ({ topic }) => ({
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
  })
);

server.registerPrompt(
  "recover_company_workflow",
  {
    title: "Recover Company Workflow",
    description: "Guides an agent out of failed Apiverket company lookup/search loops without retrying the same request.",
    argsSchema: {
      situation: z.string().optional().describe("What happened, such as invalid org number, search quota, workflow cooldown, or unsupported company subpath."),
    },
  },
  async ({ situation }) => ({
    messages: [
      {
        role: "user",
        content: {
          type: "text",
          text: `Recover the Apiverket company workflow${situation ? ` for this situation: ${situation}` : ""}.

Follow these rules:
1. Do not retry the same govdata_query endpoint and params that just failed.
2. If the failure was a 429 or cooldown, call govdata_account before any further company search.
3. Call govdata_discover with query="company" if endpoint choice or workflow is uncertain.
4. Use /v1/companies/search only for discovery when the input is a name or uncertain identifier.
5. Cache the returned org_number.
6. Use /v1/companies/{orgNumber} for repeated enrichment once org_number is known.
7. Never guess unsupported company subpaths such as board, owners, officers, UBO, or representatives.
8. Mention upgrade only when company search/discovery volume is the constraint, not when lookup input is invalid.

Return a concise next-step plan before making another company API call.`,
        },
      },
    ],
  })
);

// ── Start server ─────────────────────────────────────────────────────

/**
 * Starts the MCP server using stdio transport.
 */
async function main(): Promise<void> {
  const transport = new StdioServerTransport();
  await server.connect(transport);
  console.error("Apiverket MCP server running via stdio");
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  main().catch((error) => {
    console.error("Fatal error:", error);
    process.exit(1);
  });
}
