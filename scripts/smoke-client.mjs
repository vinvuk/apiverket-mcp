#!/usr/bin/env node
import { Client } from "@modelcontextprotocol/sdk/client/index.js";
import { StdioClientTransport } from "@modelcontextprotocol/sdk/client/stdio.js";

const serverPath = new URL("../dist/index.js", import.meta.url).pathname;
const apiUrl = process.env.GOVDATA_API_URL ?? "https://apiverket.se";
const apiKey = process.env.GOVDATA_API_KEY ?? "sk_test_demo";

function assert(condition, message) {
  if (!condition) throw new Error(message);
}

function textContent(result) {
  return result.content?.map((item) => item.text ?? "").join("\n") ?? "";
}

const transport = new StdioClientTransport({
  command: "node",
  args: [serverPath],
  env: {
    ...process.env,
    GOVDATA_API_URL: apiUrl,
    GOVDATA_API_KEY: apiKey,
  },
});

const client = new Client({ name: "apiverket-mcp-smoke", version: "1.0.0" });
await client.connect(transport);

try {
  const tools = await client.listTools();
  const toolNames = tools.tools.map((tool) => tool.name);
  for (const expected of ["govdata_discover", "govdata_query", "govdata_account"]) {
    assert(toolNames.includes(expected), `Missing MCP tool: ${expected}`);
  }

  const discoveryCases = [
    ["company", "Company search has a separate daily quota"],
    ["train", "Recommended workflow: Transport & Infrastructure"],
    ["weather", "Recommended workflow: Weather & Climate"],
    ["municipality", "Recommended workflow: Geography, Demographics & Municipalities"],
    ["jobs", "Recommended workflow: Jobs & Labor Market"],
    ["parliament", "Recommended workflow: Government & Safety"],
    ["school", "Recommended workflow: Culture, Education, Tourism & Environment"],
    ["geo", "Recommended workflow: Geography, Demographics & Municipalities"],
  ];

  for (const [query, expected] of discoveryCases) {
    const result = await client.callTool({ name: "govdata_discover", arguments: { query } });
    const text = textContent(result);
    assert(text.includes(expected), `Discovery for "${query}" did not include expected guidance: ${expected}`);
  }

  const unsupported = await client.callTool({
    name: "govdata_query",
    arguments: { endpoint: "/v1/transport/trains/Cst/board" },
  });
  const unsupportedText = textContent(unsupported);
  assert(unsupportedText.includes("Recommended workflow: Transport & Infrastructure"), "Unsupported transport path did not include transport workflow recovery");

  const account = await client.callTool({ name: "govdata_account", arguments: {} });
  const accountText = textContent(account);
  assert(/Tier: /.test(accountText), "Account summary did not include tier");
  assert(accountText.includes("Company search:"), "Account summary did not include company-search quota");
  assert(!accountText.includes("sk_test_demo") && !accountText.includes("sk_live"), "Account summary leaked an API key");

  console.log(JSON.stringify({
    status: "ok",
    tools: toolNames,
    discoveries_checked: discoveryCases.length,
    api_url: apiUrl,
  }, null, 2));
} finally {
  await client.close();
}
