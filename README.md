# Apiverket MCP Server

An MCP (Model Context Protocol) server that gives AI assistants access to **139 Swedish government data endpoints** via the [Apiverket API](https://apiverket.se). Works with Claude Code, Claude Desktop, Cursor, VS Code, and any MCP-compatible client.

## What it does

Two tools, one goal: let AI assistants query Swedish public data using natural language.

| Tool | Purpose |
|------|---------|
| `govdata_discover` | Search and browse 139 endpoints across 16 categories |
| `govdata_query` | Call any endpoint and get structured JSON data |

Ask *"What's the weather in Stockholm?"* or *"Show train delays from Gothenburg"* — the AI finds the right endpoint, fills in parameters, and returns the data.

## Categories

Business & Companies, Culture & Media, Demographics, Economy & Finance, Education, Environment & Nature, Geography, Government & Safety, Health & Medicine, Jobs & Labor, Social Insurance, Telecom, Tourism, Transport & Infrastructure, Weather & Climate

## Quick start

### Claude Code / Claude Desktop

Add to your MCP config (`~/.claude/claude_code_config.json` or Claude Desktop settings):

```json
{
  "mcpServers": {
    "apiverket": {
      "command": "node",
      "args": ["/path/to/apiverket-mcp/dist/index.js"],
      "env": {
        "GOVDATA_API_URL": "https://apiverket.se",
        "GOVDATA_API_KEY": "sk_test_demo"
      }
    }
  }
}
```

### Cursor / VS Code

Add to `.cursor/mcp.json` or `.vscode/mcp.json`:

```json
{
  "servers": {
    "apiverket": {
      "command": "node",
      "args": ["/path/to/apiverket-mcp/dist/index.js"],
      "env": {
        "GOVDATA_API_URL": "https://apiverket.se",
        "GOVDATA_API_KEY": "sk_test_demo"
      }
    }
  }
}
```

### npx (no install)

```json
{
  "mcpServers": {
    "apiverket": {
      "command": "npx",
      "args": ["apiverket-mcp-server"],
      "env": {
        "GOVDATA_API_URL": "https://apiverket.se",
        "GOVDATA_API_KEY": "sk_test_demo"
      }
    }
  }
}
```

## Build from source

```bash
git clone https://github.com/vinvuk/apiverket-mcp.git
cd apiverket-mcp
npm install
npm run build
```

## Configuration

| Variable | Default | Description |
|----------|---------|-------------|
| `GOVDATA_API_URL` | `http://localhost:3010` | Apiverket API base URL |
| `GOVDATA_API_KEY` | `sk_test_demo` | API key (`sk_test_*` for sandbox, `sk_live_*` for production) |

The test key (`sk_test_demo`) returns sandbox data for all endpoints — no signup required.

## Tools

### `govdata_discover`

Search and browse available endpoints.

```
# List all categories
govdata_discover()

# Search by keyword
govdata_discover(query: "electricity prices")

# Browse a category
govdata_discover(category: "Weather & Climate")

# Search within a category
govdata_discover(query: "forecast", category: "Weather")
```

### `govdata_query`

Call any endpoint with parameters.

```
# Current weather
govdata_query(endpoint: "/v1/weather/{city}", path_params: {city: "stockholm"})

# Job search
govdata_query(endpoint: "/v1/jobs/search", query_params: {q: "developer", limit: 5})

# Exchange rates
govdata_query(endpoint: "/v1/rates/exchange")

# Train departures
govdata_query(endpoint: "/v1/transport/trains/{station}", path_params: {station: "Cst"})

# Electricity prices by area
govdata_query(endpoint: "/v1/energy/electricity/{area}", path_params: {area: "SE3"})

# Company lookup
govdata_query(endpoint: "/v1/companies/{orgNumber}", path_params: {orgNumber: "5568710426"})

# Police events
govdata_query(endpoint: "/v1/police/events", query_params: {limit: 10})

# VAT validation
govdata_query(endpoint: "/v1/vat/{vatNumber}", path_params: {vatNumber: "SE556871042601"})
```

## How it works

1. The MCP server runs as a local process using **stdio** transport
2. Your AI client sends tool calls via the MCP protocol
3. `govdata_discover` searches the built-in endpoint catalog (no API call needed)
4. `govdata_query` makes authenticated HTTP requests to the Apiverket API
5. Responses over 25,000 characters are truncated with pagination guidance

## Requirements

- Node.js >= 18
- An Apiverket API key (or use `sk_test_demo` for sandbox)

## License

MIT
