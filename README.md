# Apiverket MCP Server

<!-- mcp-name: io.github.vinvuk/apiverket-mcp -->

An MCP (Model Context Protocol) server that gives AI assistants access to Swedish public data through the [Apiverket API](https://apiverket.se). It works with Claude Code, Claude Desktop, Cursor, VS Code, Gemini CLI-style MCP clients, and other MCP-compatible tools.

## What it does

| Tool | Purpose |
|------|---------|
| `govdata_discover` | Search and browse supported Apiverket endpoints before choosing a path |
| `govdata_query` | Call a discovered endpoint and return structured JSON or recovery guidance |
| `govdata_account` | Inspect sanitized key mode, tier, daily usage, company-search quota, and upgrade-relevant limits |

Agents should call `govdata_discover` before `govdata_query` instead of guessing `/v1` paths. After a 429 or when a user asks about limits, agents should call `govdata_account`.

## How Agents Should Use Apiverket

1. Discover: call `govdata_discover` with the user's topic, not a guessed path.
2. Check context: call `govdata_account` for quota, tier, and production-readiness questions.
3. Query: call `govdata_query` only with a supported endpoint returned by discovery.
4. Recover: if a request fails, use the structured recovery guidance before retrying.

Discovery includes family workflows for transport, weather, geography, municipalities, jobs, government, culture, education, tourism, environment, and company data. These workflows explain search/list/detail patterns, required codes, coordinates, date formats, pagination, and common recovery steps.

## Quick Start

### Claude Code / Claude Desktop

```json
{
  "mcpServers": {
    "apiverket": {
      "command": "npx",
      "args": ["-y", "apiverket-mcp-server"],
      "env": {
        "GOVDATA_API_URL": "https://apiverket.se",
        "GOVDATA_API_KEY": "sk_test_demo"
      }
    }
  }
}
```

### Cursor / VS Code

```json
{
  "servers": {
    "apiverket": {
      "command": "npx",
      "args": ["-y", "apiverket-mcp-server"],
      "env": {
        "GOVDATA_API_URL": "https://apiverket.se",
        "GOVDATA_API_KEY": "sk_test_demo"
      }
    }
  }
}
```

### Gemini CLI-Style MCP Config

```json
{
  "mcpServers": {
    "apiverket": {
      "command": "npx",
      "args": ["-y", "apiverket-mcp-server"],
      "env": {
        "GOVDATA_API_URL": "https://apiverket.se",
        "GOVDATA_API_KEY": "sk_test_demo"
      }
    }
  }
}
```

## Keys And Limits

| Variable | Default | Description |
|----------|---------|-------------|
| `GOVDATA_API_URL` | `https://apiverket.se` | Apiverket API base URL |
| `GOVDATA_API_KEY` | `sk_test_demo` | Sandbox key by default. Use a `sk_live_*` key from Apiverket for real production data. |

`sk_test_demo` is for setup and safe sandbox responses. It is useful for checking that your MCP client is wired correctly, but production workflows should use a live key. Free live keys are good for exploration; upgrade when daily API or company-search limits block a real workflow.

## Company Data With Agents

Company search and company lookup have different jobs:

1. Use `govdata_discover(query: "company")` to find the supported company endpoints.
2. Use `/v1/companies/search` when the user only has a company name or uncertain organisation number.
3. Cache the returned `org_number`.
4. Use `/v1/companies/{orgNumber}` for repeated enrichment and automation.
5. If company search returns 429, stop retrying until `reset_at`; use lookup when org numbers are already known.

Company search has a separate daily quota by tier. `govdata_account` shows the configured key tier, remaining company-search quota, reset time, and available upgrade tiers. Apiverket does not expose company board, officer, owner, or UBO subresource paths through the company API.

## Common Family Workflows

| Family | Good first query | Agent workflow |
|--------|------------------|----------------|
| Transport | `govdata_discover(query: "train departures")` | Use station codes for `/v1/transport/trains/{station}`; use stop IDs for `/v1/transit/departures`; list datasets before transport statistics. |
| Weather | `govdata_discover(query: "weather forecast")` | Use city endpoints for simple weather, warnings for national alerts, and station/lat/lon flows for air quality or observations. |
| Geography & municipalities | `govdata_discover(query: "municipality population")` | Find official municipality/county/place codes first; search KPIs before municipality KPI detail calls; request geometry only when needed. |
| Jobs | `govdata_discover(query: "jobs taxonomy")` | Use `/v1/jobs/search` for ordinary search; use taxonomy types/concepts/autocomplete for controlled filters. |
| Government & safety | `govdata_discover(query: "parliament documents")` | Choose calendar, documents, members, committees, SFS, SOU, police events, or police stations based on the question. |
| Culture, education & environment | `govdata_discover(query: "school search")` | Search first, then reuse returned IDs/codes for detail endpoints; ensure `q`, municipality, type, or coordinates are present. |

## Tool Examples

```text
# Discover endpoints
govdata_discover(query: "electricity prices")
govdata_discover(category: "Weather & Climate")
govdata_discover(query: "train departures")
govdata_discover(query: "municipality KPI")
govdata_discover(query: "jobs taxonomy")

# Query data after discovery
govdata_query(endpoint: "/v1/weather/{city}", path_params: {city: "stockholm"})
govdata_query(endpoint: "/v1/transport/trains/{station}", path_params: {station: "Cst"})
govdata_query(endpoint: "/v1/jobs/search", query_params: {q: "developer", limit: 5})
govdata_query(endpoint: "/v1/taxonomy/types")
govdata_query(endpoint: "/v1/companies/search", query_params: {q: "volvo", limit: 10})
govdata_query(endpoint: "/v1/companies/{orgNumber}", path_params: {orgNumber: "5560125790"})

# Inspect tier and quota state
govdata_account()
```

## Build From Source

```bash
git clone https://github.com/vinvuk/apiverket-mcp.git
cd apiverket-mcp
npm install
npm run build
```

## How It Works

1. The MCP server runs locally over stdio.
2. `govdata_discover` searches the built-in endpoint catalog without an API call.
3. `govdata_query` calls Apiverket with the configured API key.
4. Structured API errors are turned into recovery guidance for agents.
5. Large responses are truncated with pagination guidance.

## Requirements

- Node.js >= 18
- An Apiverket API key, or `sk_test_demo` for sandbox setup

## License

MIT
