import type { Endpoint } from "./endpoints.js";

export interface FamilyPlaybook {
  id: string;
  title: string;
  queries: string[];
  categories?: string[];
  entrypoints: string[];
  workflow: string[];
  constraints?: string[];
  recovery?: string[];
  avoid?: string[];
  examples?: string[];
}

export const FAMILY_PLAYBOOKS: FamilyPlaybook[] = [
  {
    id: "transport",
    title: "Transport & Infrastructure",
    queries: ["transport", "traffic", "train", "trains", "transit", "departure", "departures", "station", "stop", "road", "ferry", "parking", "ev", "charger", "travel time"],
    categories: ["Transport & Infrastructure"],
    entrypoints: ["/v1/transport/trains/{station}", "/v1/transit/departures", "/v1/transport/statistics/datasets", "/v1/transport/traffic", "/v1/infrastructure/ev-chargers"],
    workflow: [
      "For train departures, use /v1/transport/trains/{station} with a Trafikverket station name or short code such as Cst.",
      "For local public transport departures, use a ResRobot stop ID with /v1/transit/departures; if the user only has a name, ask for or derive the stop ID before querying.",
      "For transport statistics, list datasets first, then call /v1/transport/statistics with the selected dataset code.",
      "For nearby infrastructure such as EV chargers or parking, collect Swedish lat/lon coordinates first."
    ],
    constraints: [
      "Station, stop, dataset, county, road, lat, and lon values are not interchangeable.",
      "Nearby endpoints need coordinates inside Sweden; do not invent coordinates when the user provided only a place name."
    ],
    recovery: [
      "If a station or stop request fails, rediscover the relevant transport endpoint and verify whether the endpoint expects a Trafikverket station code, ResRobot stop ID, or coordinates.",
      "If a dataset request fails, call /v1/transport/statistics/datasets before retrying."
    ],
    avoid: [
      "Do not guess unsupported /v1/transport/* subpaths.",
      "Do not use train station codes for transit stop IDs."
    ],
    examples: [
      "govdata_discover(query: \"train departures\")",
      "govdata_query(endpoint: \"/v1/transport/trains/{station}\", path_params: {station: \"Cst\"})",
      "govdata_query(endpoint: \"/v1/infrastructure/ev-chargers\", query_params: {lat: 59.33, lon: 18.07})"
    ]
  },
  {
    id: "weather",
    title: "Weather & Climate",
    queries: ["weather", "forecast", "temperature", "warnings", "air quality", "pollen", "hydrology", "ocean", "lightning", "station"],
    categories: ["Weather & Climate"],
    entrypoints: ["/v1/weather/{city}", "/v1/weather/{city}/forecast", "/v1/weather/warnings", "/v1/air-quality/stations", "/v1/air-quality/current"],
    workflow: [
      "Use city endpoints for simple current weather or forecasts.",
      "Use /v1/weather/warnings for national warning context.",
      "For air quality, list stations when the user asks for monitoring sites, or use current readings with lat/lon for nearest-station readings.",
      "For hydrology and ocean observations, verify the required parameter or coordinates before querying."
    ],
    constraints: [
      "City, station, lat, lon, and environmental parameter inputs are different concepts.",
      "Observation and station-style endpoints may return large lists; use limit/offset where available."
    ],
    recovery: [
      "If a city lookup fails, retry with a normalized Swedish city name or ask the user for a clearer location.",
      "If lat/lon is missing, ask for coordinates or use a geography endpoint to identify a place first."
    ],
    examples: [
      "govdata_query(endpoint: \"/v1/weather/{city}\", path_params: {city: \"Stockholm\"})",
      "govdata_query(endpoint: \"/v1/air-quality/current\", query_params: {lat: 59.33, lon: 18.07})"
    ]
  },
  {
    id: "geo-municipal",
    title: "Geography, Demographics & Municipalities",
    queries: ["geo", "geography", "municipality", "municipalities", "county", "counties", "population", "demographics", "deso", "income", "place", "place names"],
    categories: ["Geography", "Demographics & Municipalities"],
    entrypoints: ["/v1/geo/municipalities", "/v1/geo/counties", "/v1/geo/place-names/search", "/v1/municipalities", "/v1/municipalities/kpis", "/v1/population/{municipalityCode}"],
    workflow: [
      "Use municipality/county list or place-name search to find official codes before detail calls.",
      "For KOLADA-style statistics, search KPI definitions first, then call the municipality KPI endpoint with municipality id and kpiId.",
      "For DeSO demographics, collect lat/lon coordinates instead of municipality names.",
      "Only request geometry when the user needs shapes or boundaries."
    ],
    constraints: [
      "Municipality codes, county codes, DeSO areas, KPI IDs, and coordinates are separate identifiers.",
      "Geometry payloads can be large; keep include_geometry false unless needed."
    ],
    recovery: [
      "If a code lookup fails, use /v1/geo/municipalities, /v1/geo/counties, or /v1/geo/place-names/search to find the official code.",
      "If a KPI request fails, search /v1/municipalities/kpis before retrying."
    ],
    examples: [
      "govdata_query(endpoint: \"/v1/geo/place-names/search\", query_params: {q: \"Uppsala\"})",
      "govdata_query(endpoint: \"/v1/population/{municipalityCode}\", path_params: {municipalityCode: \"0180\"})"
    ]
  },
  {
    id: "jobs",
    title: "Jobs & Labor Market",
    queries: ["job", "jobs", "occupation", "skill", "taxonomy", "concept", "employment", "arbetsformedlingen"],
    categories: ["Jobs & Labor Market"],
    entrypoints: ["/v1/jobs/search", "/v1/taxonomy/types", "/v1/taxonomy/concepts", "/v1/taxonomy/autocomplete"],
    workflow: [
      "Use /v1/jobs/search for ordinary keyword job search.",
      "Use taxonomy types and concepts when the user needs controlled occupation, skill, or concept filters.",
      "Use autocomplete for partial user input before a concept search."
    ],
    constraints: [
      "Taxonomy concept type is required for /v1/taxonomy/concepts.",
      "Municipality filters on jobs expect municipality names/codes from the jobs data context, not arbitrary region text."
    ],
    recovery: [
      "If taxonomy concepts fail because type is missing, call /v1/taxonomy/types first.",
      "If jobs search is too broad, add q, limit, or municipality filters."
    ],
    examples: [
      "govdata_query(endpoint: \"/v1/jobs/search\", query_params: {q: \"developer\", limit: 5})",
      "govdata_query(endpoint: \"/v1/taxonomy/types\")"
    ]
  },
  {
    id: "government",
    title: "Government & Safety",
    queries: ["government", "parliament", "riksdag", "police", "crime", "member", "vote", "document", "calendar", "law", "sfs", "sou"],
    categories: ["Government & Safety"],
    entrypoints: ["/v1/parliament/calendar", "/v1/parliament/documents", "/v1/parliament/members", "/v1/parliament/committees", "/v1/police/events", "/v1/police/stations"],
    workflow: [
      "For Riksdag work, choose calendar, documents, members, committees, SFS, SOU, or voting statistics based on the user question.",
      "Use document type/session filters only when known; otherwise start broad with a small limit.",
      "For police, use events for incident feeds and stations for locations."
    ],
    constraints: [
      "Parliament member detail needs a member id from the members endpoint.",
      "Document/session/type filters must match Riksdag conventions."
    ],
    recovery: [
      "If member detail fails, search members first and reuse the returned id.",
      "If parliament document results are empty, loosen type/session filters."
    ],
    examples: [
      "govdata_query(endpoint: \"/v1/parliament/members\", query_params: {party: \"S\", limit: 10})",
      "govdata_query(endpoint: \"/v1/police/events\", query_params: {location: \"Stockholm\", limit: 10})"
    ]
  },
  {
    id: "culture-education-tourism-environment",
    title: "Culture, Education, Tourism & Environment",
    queries: ["school", "schools", "education", "library", "museum", "heritage", "radio", "tourism", "destination", "environment", "protected", "contaminated", "nutrition", "bathing"],
    categories: ["Culture & Media", "Education", "Tourism", "Environment & Nature", "Health & Medicine"],
    entrypoints: ["/v1/schools/search", "/v1/schools/{code}", "/v1/library/search", "/v1/museum/search", "/v1/heritage/search", "/v1/destinations", "/v1/environment/protected-areas", "/v1/contaminated-sites/search", "/v1/nutrition/foods"],
    workflow: [
      "For schools, search by name first, then use the returned school code for detail.",
      "For library, museum, heritage, destinations, nutrition, and contaminated sites, start with the search endpoint and a specific query.",
      "For protected areas and bathing/environment endpoints, collect municipality, type, or coordinates before querying."
    ],
    constraints: [
      "Most search endpoints require at least 2 characters in q.",
      "School detail requires a numeric school code returned by search.",
      "Nearby/environment endpoints may require Swedish coordinates."
    ],
    recovery: [
      "If a detail endpoint fails, go back to the corresponding search endpoint and reuse the returned id/code.",
      "If a search endpoint returns a 400, check that q or required coordinates are present and specific enough."
    ],
    examples: [
      "govdata_query(endpoint: \"/v1/schools/search\", query_params: {q: \"Klara\", limit: 5})",
      "govdata_query(endpoint: \"/v1/library/search\", query_params: {q: \"Astrid Lindgren\", limit: 5})"
    ]
  }
];

function normalize(text: string): string {
  return text.toLowerCase().replace(/[^a-z0-9åäö]+/g, " ").trim();
}

function containsQueryToken(haystack: string, query: string): boolean {
  const normalizedHaystack = normalize(haystack);
  const normalizedQuery = normalize(query);
  if (!normalizedQuery) return false;
  if (normalizedHaystack.includes(normalizedQuery)) return true;
  if (normalizedQuery.endsWith("y") && normalizedHaystack.includes(normalizedQuery.slice(0, -1) + "ies")) return true;
  if (normalizedQuery.endsWith("s") && normalizedHaystack.includes(normalizedQuery.replace(/s$/, ""))) return true;
  return false;
}

export function matchFamilyPlaybooks(query?: string, category?: string, endpoints: Endpoint[] = []): FamilyPlaybook[] {
  const terms = [query, category].filter(Boolean).join(" ");
  const endpointText = endpoints.map((endpoint) => `${endpoint.path} ${endpoint.summary} ${endpoint.category}`).join(" ");

  return FAMILY_PLAYBOOKS.filter((playbook) => {
    const queryMatch = terms && playbook.queries.some((item) => containsQueryToken(terms, item) || containsQueryToken(item, terms));
    const categoryMatch = category && playbook.categories?.some((item) => containsQueryToken(category, item));
    const endpointMatch = endpoints.length > 0 && playbook.entrypoints.some((path) => endpoints.some((endpoint) => endpoint.path === path))
      || (endpointText && playbook.queries.some((item) => containsQueryToken(endpointText, item)));
    return Boolean(queryMatch || categoryMatch || endpointMatch);
  });
}

export function endpointPlaybookRank(endpoint: Endpoint, playbooks: FamilyPlaybook[]): number {
  if (!playbooks.length) return 999;
  const ranks = playbooks.map((playbook) => {
    const index = playbook.entrypoints.indexOf(endpoint.path);
    return index === -1 ? 100 : index;
  });
  return Math.min(...ranks);
}

export function formatFamilyPlaybook(playbook: FamilyPlaybook): string {
  return [
    `## Recommended workflow: ${playbook.title}`,
    `**Best entrypoints:** ${playbook.entrypoints.map((path) => `\`${path}\``).join(", ")}`,
    `**Workflow:**\n${playbook.workflow.map((item, index) => `  ${index + 1}. ${item}`).join("\n")}`,
    playbook.constraints?.length ? `**Constraints:**\n${playbook.constraints.map((item) => `  - ${item}`).join("\n")}` : undefined,
    playbook.recovery?.length ? `**Recovery:**\n${playbook.recovery.map((item) => `  - ${item}`).join("\n")}` : undefined,
    playbook.avoid?.length ? `**Avoid:**\n${playbook.avoid.map((item) => `  - ${item}`).join("\n")}` : undefined,
    playbook.examples?.length ? `**Examples:**\n${playbook.examples.map((item) => `  - ${item}`).join("\n")}` : undefined,
  ].filter(Boolean).join("\n");
}
