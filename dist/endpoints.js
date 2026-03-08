/**
 * Apiverket API endpoint registry.
 * Each entry describes an available API endpoint with its path, parameters, and category.
 */
/**
 * Maps a path prefix to a human-readable category name.
 * @param path - The API endpoint path
 * @returns The category name
 */
function categorize(path) {
    if (path.startsWith("/v1/weather") || path.startsWith("/v1/pollen") || path.startsWith("/v1/air-quality"))
        return "Weather & Climate";
    if (path.startsWith("/v1/transport") || path.startsWith("/v1/transit") || path.startsWith("/v1/infrastructure") || path.startsWith("/v1/road-conditions"))
        return "Transport & Infrastructure";
    if (path.startsWith("/v1/rates") || path.startsWith("/v1/currencies") || path.startsWith("/v1/gdp") || path.startsWith("/v1/prices") || path.startsWith("/v1/labor") || path.startsWith("/v1/housing") || path.startsWith("/v1/income") || path.startsWith("/v1/trade") || path.startsWith("/v1/wages") || path.startsWith("/v1/public-finance") || path.startsWith("/v1/money-supply") || path.startsWith("/v1/financial-series") || path.startsWith("/v1/energy") || path.startsWith("/v1/statistics"))
        return "Economy & Finance";
    if (path.startsWith("/v1/health") || path.startsWith("/v1/healthcare") || path.startsWith("/v1/public-health") || path.startsWith("/v1/nutrition"))
        return "Health & Medicine";
    if (path.startsWith("/v1/environment") || path.startsWith("/v1/hydrology") || path.startsWith("/v1/ocean") || path.startsWith("/v1/water-quality") || path.startsWith("/v1/contaminated") || path.startsWith("/v1/bathing") || path.startsWith("/v1/geology") || path.startsWith("/v1/climate") || path.startsWith("/v1/agriculture"))
        return "Environment & Nature";
    if (path.startsWith("/v1/parliament") || path.startsWith("/v1/police") || path.startsWith("/v1/crisis") || path.startsWith("/v1/elections") || path.startsWith("/v1/crime"))
        return "Government & Safety";
    if (path.startsWith("/v1/social-insurance") || path.startsWith("/v1/parental-leave"))
        return "Social Insurance";
    if (path.startsWith("/v1/schools") || path.startsWith("/v1/education") || path.startsWith("/v1/qualifications"))
        return "Education";
    if (path.startsWith("/v1/jobs") || path.startsWith("/v1/taxonomy"))
        return "Jobs & Labor Market";
    if (path.startsWith("/v1/companies") || path.startsWith("/v1/vat"))
        return "Business & Companies";
    if (path.startsWith("/v1/library") || path.startsWith("/v1/heritage") || path.startsWith("/v1/museum") || path.startsWith("/v1/radio"))
        return "Culture & Media";
    if (path.startsWith("/v1/municipalities") || path.startsWith("/v1/population") || path.startsWith("/v1/demographics") || path.startsWith("/v1/names"))
        return "Demographics & Municipalities";
    if (path.startsWith("/v1/telecom") || path.startsWith("/v1/power-grid") || path.startsWith("/v1/open-data"))
        return "Telecom & Data";
    if (path.startsWith("/v1/geo"))
        return "Geography";
    if (path.startsWith("/v1/tourism") || path.startsWith("/v1/destinations"))
        return "Tourism";
    return "Other";
}
/**
 * The complete endpoint registry, built from the OpenAPI spec.
 * Sorted by category then path for easy browsing.
 */
export const ENDPOINTS = [
    // === Business & Companies ===
    { path: "/v1/vat/validate/{vatNumber}", method: "get", summary: "Validate an EU VAT number", description: "Checks whether a VAT number is valid using the EU VIES service. Returns the registered company name and address when available.", category: "Business & Companies", parameters: [{ name: "vatNumber", in: "path", required: true, description: "EU VAT number including country prefix (e.g. SE556703614301)" }] },
    { path: "/v1/companies/search", method: "get", summary: "Search Swedish companies", description: "Search for Swedish registered companies by name or organization number via Bolagsverket.", category: "Business & Companies", parameters: [{ name: "q", in: "query", required: true, description: "Company name or org number to search for" }, { name: "limit", in: "query", required: false, description: "Max results (default 20)" }, { name: "offset", in: "query", required: false, description: "Pagination offset" }] },
    { path: "/v1/companies/{orgNumber}", method: "get", summary: "Get company details", description: "Returns detailed information about a specific Swedish company by organization number.", category: "Business & Companies", parameters: [{ name: "orgNumber", in: "path", required: true, description: "Swedish organization number (e.g. 5568710426 or 556871-0426)" }] },
    // === Culture & Media ===
    { path: "/v1/library/search", method: "get", summary: "Search Swedish library catalog", description: "Search books and media in the LIBRIS national library catalog.", category: "Culture & Media", parameters: [{ name: "q", in: "query", required: true, description: "Search query" }, { name: "limit", in: "query", required: false, description: "Max results" }] },
    { path: "/v1/heritage/search", method: "get", summary: "Search cultural heritage sites", description: "Search Sweden's cultural heritage database (K-Samsök) for monuments, buildings, and archaeological sites.", category: "Culture & Media", parameters: [{ name: "q", in: "query", required: true, description: "Search query" }, { name: "limit", in: "query", required: false, description: "Max results" }] },
    { path: "/v1/museum/search", method: "get", summary: "Search museum collections", description: "Search Swedish museum collections via Digitalt Museum.", category: "Culture & Media", parameters: [{ name: "q", in: "query", required: true, description: "Search query" }, { name: "limit", in: "query", required: false, description: "Max results" }] },
    { path: "/v1/radio/channels", method: "get", summary: "List Sveriges Radio channels", description: "Returns all Sveriges Radio channels.", category: "Culture & Media", parameters: [] },
    { path: "/v1/radio/programs", method: "get", summary: "Search radio programs", description: "Search Sveriges Radio programs by name.", category: "Culture & Media", parameters: [{ name: "q", in: "query", required: true, description: "Program name to search" }] },
    // === Demographics & Municipalities ===
    { path: "/v1/municipalities", method: "get", summary: "List Swedish municipalities", description: "Returns all 290 Swedish municipalities with population and area data.", category: "Demographics & Municipalities", parameters: [{ name: "limit", in: "query", required: false, description: "Max results" }, { name: "offset", in: "query", required: false, description: "Pagination offset" }] },
    { path: "/v1/municipalities/{id}", method: "get", summary: "Get municipality details", description: "Returns details for a specific municipality by its 4-digit code.", category: "Demographics & Municipalities", parameters: [{ name: "id", in: "path", required: true, description: "Municipality code (4 digits, e.g. 0180 for Stockholm)" }] },
    { path: "/v1/municipalities/kpis", method: "get", summary: "Search municipal KPIs", description: "Search Kolada KPI definitions by title.", category: "Demographics & Municipalities", parameters: [{ name: "q", in: "query", required: true, description: "KPI title to search" }] },
    { path: "/v1/municipalities/{id}/kpi/{kpiId}", method: "get", summary: "Get KPI for a municipality", description: "Returns time-series data for a specific Kolada KPI for a municipality.", category: "Demographics & Municipalities", parameters: [{ name: "id", in: "path", required: true, description: "Municipality code (4 digits)" }, { name: "kpiId", in: "path", required: true, description: "Kolada KPI ID (e.g. N00945)" }] },
    { path: "/v1/population", method: "get", summary: "Get national population statistics", description: "Returns Sweden's population data including totals and growth rates.", category: "Demographics & Municipalities", parameters: [] },
    { path: "/v1/population/{municipalityCode}", method: "get", summary: "Get population by municipality", description: "Returns population data for a specific municipality.", category: "Demographics & Municipalities", parameters: [{ name: "municipalityCode", in: "path", required: true, description: "Municipality code" }] },
    { path: "/v1/population/pyramid", method: "get", summary: "Get population pyramid", description: "Returns age distribution (population pyramid) data for Sweden.", category: "Demographics & Municipalities", parameters: [] },
    { path: "/v1/demographics/deso", method: "get", summary: "Get demographic statistics by area", description: "Returns detailed demographics for a small geographic area (DeSO).", category: "Demographics & Municipalities", parameters: [{ name: "lat", in: "query", required: true, description: "Latitude" }, { name: "lon", in: "query", required: true, description: "Longitude" }] },
    { path: "/v1/names", method: "get", summary: "Search Swedish name statistics", description: "Returns popularity and trends for given names in Sweden.", category: "Demographics & Municipalities", parameters: [{ name: "q", in: "query", required: true, description: "Name to search" }] },
    // === Economy & Finance ===
    { path: "/v1/rates", method: "get", summary: "Get exchange rates and policy rate", description: "Returns latest EUR/SEK, USD/SEK exchange rates and the Riksbank policy rate.", category: "Economy & Finance", parameters: [] },
    { path: "/v1/rates/bonds", method: "get", summary: "Get government bond yields", description: "Returns Swedish government bond yields (2Y, 5Y, 10Y).", category: "Economy & Finance", parameters: [] },
    { path: "/v1/rates/treasury-bills", method: "get", summary: "Get treasury bill rates", description: "Returns Swedish treasury bill rates (1M, 3M, 6M).", category: "Economy & Finance", parameters: [] },
    { path: "/v1/rates/mortgage", method: "get", summary: "Get mortgage interest rates", description: "Returns current Swedish mortgage interest rates.", category: "Economy & Finance", parameters: [] },
    { path: "/v1/currencies", method: "get", summary: "Get multiple currency rates", description: "Returns exchange rates for multiple currencies against SEK.", category: "Economy & Finance", parameters: [] },
    { path: "/v1/currencies/{pair}/history", method: "get", summary: "Get historical exchange rates", description: "Returns historical exchange rate data for a currency pair.", category: "Economy & Finance", parameters: [{ name: "pair", in: "path", required: true, description: "Currency pair (e.g. EUR-SEK)" }, { name: "from", in: "query", required: false, description: "Start date (YYYY-MM-DD)" }, { name: "to", in: "query", required: false, description: "End date (YYYY-MM-DD)" }] },
    { path: "/v1/gdp", method: "get", summary: "Get GDP and national accounts", description: "Returns Sweden's GDP growth and national accounts data.", category: "Economy & Finance", parameters: [] },
    { path: "/v1/prices", method: "get", summary: "Get consumer price index", description: "Returns CPI and inflation data for Sweden.", category: "Economy & Finance", parameters: [] },
    { path: "/v1/prices/cpi", method: "get", summary: "Get detailed CPI data", description: "Returns detailed Consumer Price Index data.", category: "Economy & Finance", parameters: [] },
    { path: "/v1/prices/ppi", method: "get", summary: "Get producer price index", description: "Returns Producer Price Index data.", category: "Economy & Finance", parameters: [] },
    { path: "/v1/labor", method: "get", summary: "Get labor market statistics", description: "Returns unemployment, employment, and labor force data.", category: "Economy & Finance", parameters: [] },
    { path: "/v1/housing", method: "get", summary: "Get housing market data", description: "Returns housing prices, sales volumes, and market trends.", category: "Economy & Finance", parameters: [] },
    { path: "/v1/housing/stock", method: "get", summary: "Get housing stock data", description: "Returns housing stock and availability data.", category: "Economy & Finance", parameters: [] },
    { path: "/v1/income", method: "get", summary: "Get income statistics", description: "Returns income distribution and wage data for Sweden.", category: "Economy & Finance", parameters: [] },
    { path: "/v1/trade", method: "get", summary: "Get trade statistics", description: "Returns import/export data for Sweden.", category: "Economy & Finance", parameters: [] },
    { path: "/v1/wages", method: "get", summary: "Get wage statistics", description: "Returns wage levels and salary data by sector.", category: "Economy & Finance", parameters: [] },
    { path: "/v1/public-finance", method: "get", summary: "Get public finance data", description: "Returns government budget and public spending data.", category: "Economy & Finance", parameters: [] },
    { path: "/v1/money-supply", method: "get", summary: "Get money supply data", description: "Returns money supply (M1, M2, M3) and credit data.", category: "Economy & Finance", parameters: [] },
    { path: "/v1/financial-series", method: "get", summary: "Get financial time series", description: "Returns historical financial data series from Riksbanken.", category: "Economy & Finance", parameters: [] },
    { path: "/v1/energy", method: "get", summary: "Get energy statistics", description: "Returns energy production, consumption, and mix data.", category: "Economy & Finance", parameters: [] },
    { path: "/v1/statistics/industry/{sniCode}", method: "get", summary: "Get industry statistics by SNI code", description: "Returns enterprise count and size distribution for a Swedish Standard Industrial Classification (SNI) code.", category: "Economy & Finance", parameters: [{ name: "sniCode", in: "path", required: true, description: "SNI 2007 industry code (e.g. 62010 for software development)" }] },
    // === Education ===
    { path: "/v1/schools/search", method: "get", summary: "Search Swedish schools", description: "Search schools by name via Skolverket.", category: "Education", parameters: [{ name: "q", in: "query", required: true, description: "School name to search (min 2 chars)" }, { name: "limit", in: "query", required: false, description: "Max results" }] },
    { path: "/v1/schools/{code}", method: "get", summary: "Get school details", description: "Returns detailed info about a school by its Skolverket code.", category: "Education", parameters: [{ name: "code", in: "path", required: true, description: "Skolverket school unit code" }] },
    { path: "/v1/schools/grades", method: "get", summary: "Get school grades by municipality", description: "Returns school grades and test results.", category: "Education", parameters: [{ name: "municipality", in: "query", required: false, description: "Municipality name" }] },
    { path: "/v1/education", method: "get", summary: "Get education statistics", description: "Returns enrollment and attainment statistics.", category: "Education", parameters: [] },
    { path: "/v1/qualifications", method: "get", summary: "List vocational qualifications", description: "Returns vocational qualifications from MYH (Swedish National Agency for Higher Vocational Education).", category: "Education", parameters: [{ name: "q", in: "query", required: false, description: "Search query" }, { name: "limit", in: "query", required: false, description: "Max results" }] },
    { path: "/v1/qualifications/{id}", method: "get", summary: "Get qualification details", description: "Returns details for a specific vocational qualification.", category: "Education", parameters: [{ name: "id", in: "path", required: true, description: "Qualification ID" }] },
    // === Environment & Nature ===
    { path: "/v1/environment/protected-areas", method: "get", summary: "Search protected nature areas", description: "Returns protected areas (nature reserves, national parks) from Naturvårdsverket.", category: "Environment & Nature", parameters: [{ name: "municipality", in: "query", required: false, description: "Filter by municipality" }, { name: "type", in: "query", required: false, description: "Filter by protection type" }, { name: "limit", in: "query", required: false, description: "Max results" }] },
    { path: "/v1/environment/flood-risk", method: "get", summary: "Get flood risk assessment", description: "Returns flood risk assessment for a geographic location.", category: "Environment & Nature", parameters: [{ name: "lat", in: "query", required: true, description: "Latitude" }, { name: "lon", in: "query", required: true, description: "Longitude" }] },
    { path: "/v1/environment/emissions", method: "get", summary: "Get emissions data", description: "Returns industrial emissions data from Naturvårdsverket.", category: "Environment & Nature", parameters: [] },
    { path: "/v1/hydrology", method: "get", summary: "Get water levels and discharge", description: "Returns water levels and discharge data from SMHI hydrological stations.", category: "Environment & Nature", parameters: [{ name: "lat", in: "query", required: false, description: "Latitude" }, { name: "lon", in: "query", required: false, description: "Longitude" }] },
    { path: "/v1/ocean", method: "get", summary: "Get ocean observations", description: "Returns sea temperature, salinity, and wave data from SMHI.", category: "Environment & Nature", parameters: [{ name: "lat", in: "query", required: false, description: "Latitude" }, { name: "lon", in: "query", required: false, description: "Longitude" }] },
    { path: "/v1/water-quality/stations", method: "get", summary: "Get water quality stations", description: "Returns water quality monitoring stations.", category: "Environment & Nature", parameters: [{ name: "lat", in: "query", required: false, description: "Latitude" }, { name: "lon", in: "query", required: false, description: "Longitude" }] },
    { path: "/v1/contaminated-sites/search", method: "get", summary: "Search contaminated sites", description: "Search the contaminated sites registry.", category: "Environment & Nature", parameters: [{ name: "municipality", in: "query", required: false, description: "Municipality name" }, { name: "q", in: "query", required: false, description: "Search query" }] },
    { path: "/v1/bathing", method: "get", summary: "Get bathing sites", description: "Returns bathing site locations and water quality classifications.", category: "Environment & Nature", parameters: [{ name: "lat", in: "query", required: false, description: "Latitude" }, { name: "lon", in: "query", required: false, description: "Longitude" }, { name: "limit", in: "query", required: false, description: "Max results" }] },
    { path: "/v1/geology/boreholes", method: "get", summary: "Get borehole data", description: "Returns geological borehole data from SGU.", category: "Environment & Nature", parameters: [{ name: "lat", in: "query", required: true, description: "Latitude" }, { name: "lon", in: "query", required: true, description: "Longitude" }] },
    { path: "/v1/agriculture", method: "get", summary: "Get agriculture and pest alerts", description: "Returns pest alerts and agricultural forecasts from Jordbruksverket.", category: "Environment & Nature", parameters: [] },
    // === Geography ===
    { path: "/v1/geo/elevation", method: "get", summary: "Get elevation data", description: "Returns elevation (meters above sea level) for a coordinate from Lantmäteriet.", category: "Geography", parameters: [{ name: "lat", in: "query", required: true, description: "Latitude" }, { name: "lon", in: "query", required: true, description: "Longitude" }] },
    // === Government & Safety ===
    { path: "/v1/parliament/members", method: "get", summary: "List parliament members", description: "Returns current and former members of the Swedish parliament (Riksdagen).", category: "Government & Safety", parameters: [{ name: "party", in: "query", required: false, description: "Filter by party (e.g. S, M, SD)" }, { name: "limit", in: "query", required: false, description: "Max results" }] },
    { path: "/v1/parliament/members/{id}", method: "get", summary: "Get parliament member details", description: "Returns biography and committee memberships for a parliament member.", category: "Government & Safety", parameters: [{ name: "id", in: "path", required: true, description: "Member ID" }] },
    { path: "/v1/parliament/documents", method: "get", summary: "Search parliamentary documents", description: "Search motions, propositions, and other documents.", category: "Government & Safety", parameters: [{ name: "type", in: "query", required: false, description: "Document type (mot, prop, bet)" }, { name: "session", in: "query", required: false, description: "Parliamentary session" }] },
    { path: "/v1/parliament/calendar", method: "get", summary: "Get parliamentary calendar", description: "Returns upcoming parliamentary events and debates.", category: "Government & Safety", parameters: [{ name: "from", in: "query", required: false, description: "Start date" }, { name: "to", in: "query", required: false, description: "End date" }] },
    { path: "/v1/parliament/committees", method: "get", summary: "List parliamentary committees", description: "Returns all parliamentary committees.", category: "Government & Safety", parameters: [] },
    { path: "/v1/parliament/bills", method: "get", summary: "Search bills and propositions", description: "Search legislative bills.", category: "Government & Safety", parameters: [{ name: "limit", in: "query", required: false, description: "Max results" }] },
    { path: "/v1/parliament/voting-stats", method: "get", summary: "Get voting statistics", description: "Returns voting statistics and results.", category: "Government & Safety", parameters: [] },
    { path: "/v1/parliament/sou", method: "get", summary: "Search government reports (SOU)", description: "Search Swedish Government Official Reports.", category: "Government & Safety", parameters: [{ name: "limit", in: "query", required: false, description: "Max results" }] },
    { path: "/v1/parliament/sfs", method: "get", summary: "Search Swedish law (SFS)", description: "Search the Swedish Code of Statutes.", category: "Government & Safety", parameters: [{ name: "limit", in: "query", required: false, description: "Max results" }] },
    { path: "/v1/police/events", method: "get", summary: "Get police events", description: "Returns recent police events (crimes, accidents, missing persons).", category: "Government & Safety", parameters: [{ name: "type", in: "query", required: false, description: "Event type filter" }, { name: "location", in: "query", required: false, description: "Location filter" }, { name: "limit", in: "query", required: false, description: "Max results" }] },
    { path: "/v1/police/stations", method: "get", summary: "Get police stations", description: "Returns police station locations.", category: "Government & Safety", parameters: [{ name: "location", in: "query", required: false, description: "Location filter" }] },
    { path: "/v1/police/wanted", method: "get", summary: "Get wanted persons", description: "Returns the current list of wanted persons from Swedish police.", category: "Government & Safety", parameters: [] },
    { path: "/v1/crisis/news", method: "get", summary: "Get crisis information", description: "Returns current crisis notices from Krisinformation.se (floods, fires, etc.).", category: "Government & Safety", parameters: [{ name: "days", in: "query", required: false, description: "Number of days to look back" }] },
    { path: "/v1/crisis/vmas", method: "get", summary: "Get VMA alerts", description: "Returns active VMA (Important Public Announcements) alerts.", category: "Government & Safety", parameters: [] },
    { path: "/v1/elections", method: "get", summary: "Get election results", description: "Returns Swedish election results and voting statistics.", category: "Government & Safety", parameters: [] },
    { path: "/v1/crime", method: "get", summary: "Get crime statistics", description: "Returns crime rates and prosecution data from SCB.", category: "Government & Safety", parameters: [] },
    // === Health & Medicine ===
    { path: "/v1/health/diagnoses/{code}", method: "get", summary: "Get diagnosis info by ICD-10 code", description: "Returns Socialstyrelsen's guidance for a given ICD-10 diagnosis code.", category: "Health & Medicine", parameters: [{ name: "code", in: "path", required: true, description: "ICD-10 code (e.g. M54, F32)" }] },
    { path: "/v1/health/sick-leave/{code}", method: "get", summary: "Get sick leave recommendation", description: "Returns Socialstyrelsen FMB's insurance medicine recommendation for an ICD-10 code.", category: "Health & Medicine", parameters: [{ name: "code", in: "path", required: true, description: "ICD-10 code" }] },
    { path: "/v1/health/sick-leave-full", method: "get", summary: "Get full sick leave database", description: "Returns the full FMB sick leave recommendation database.", category: "Health & Medicine", parameters: [{ name: "q", in: "query", required: false, description: "Search query" }, { name: "limit", in: "query", required: false, description: "Max results" }] },
    { path: "/v1/health/mortality", method: "get", summary: "Get mortality statistics", description: "Returns death rates and mortality trends.", category: "Health & Medicine", parameters: [] },
    { path: "/v1/healthcare/wait-times", method: "get", summary: "Get healthcare wait times", description: "Returns wait times for hospitals and clinics.", category: "Health & Medicine", parameters: [{ name: "region", in: "query", required: false, description: "Region filter" }] },
    { path: "/v1/healthcare/care-quality", method: "get", summary: "Get care quality metrics", description: "Returns quality metrics for healthcare providers.", category: "Health & Medicine", parameters: [{ name: "q", in: "query", required: false, description: "Search query" }] },
    { path: "/v1/public-health", method: "get", summary: "Get public health statistics", description: "Returns public health surveillance data from Folkhälsomyndigheten.", category: "Health & Medicine", parameters: [] },
    { path: "/v1/nutrition/foods", method: "get", summary: "Search food database", description: "Search the Swedish food database (Livsmedelsverket). Swedish only.", category: "Health & Medicine", parameters: [{ name: "q", in: "query", required: true, description: "Food name in Swedish" }] },
    // === Jobs & Labor Market ===
    { path: "/v1/jobs/search", method: "get", summary: "Search job listings", description: "Search Swedish job listings via JobTech (Arbetsförmedlingen).", category: "Jobs & Labor Market", parameters: [{ name: "q", in: "query", required: true, description: "Search query" }, { name: "municipality", in: "query", required: false, description: "Municipality filter" }, { name: "limit", in: "query", required: false, description: "Max results" }] },
    { path: "/v1/taxonomy/types", method: "get", summary: "List taxonomy types", description: "Returns available taxonomy types (occupations, skills, etc.) from JobTech.", category: "Jobs & Labor Market", parameters: [] },
    { path: "/v1/taxonomy/concepts", method: "get", summary: "Get taxonomy concepts", description: "Look up concepts by type (occupation names, skills, etc.).", category: "Jobs & Labor Market", parameters: [{ name: "type", in: "query", required: true, description: "Concept type (e.g. occupation-name, skill)" }, { name: "q", in: "query", required: false, description: "Search query" }] },
    { path: "/v1/taxonomy/autocomplete", method: "get", summary: "Autocomplete taxonomy terms", description: "Returns autocomplete suggestions for job-related terms.", category: "Jobs & Labor Market", parameters: [{ name: "q", in: "query", required: true, description: "Partial search term" }] },
    // === Social Insurance ===
    { path: "/v1/social-insurance", method: "get", summary: "Get social insurance overview", description: "Returns general social insurance benefits overview from Försäkringskassan.", category: "Social Insurance", parameters: [] },
    { path: "/v1/social-insurance/child-allowance", method: "get", summary: "Get child allowance info", description: "Returns child allowance amounts and rules.", category: "Social Insurance", parameters: [] },
    { path: "/v1/social-insurance/disability", method: "get", summary: "Get disability benefits info", description: "Returns disability benefit information.", category: "Social Insurance", parameters: [] },
    { path: "/v1/social-insurance/housing-allowance", method: "get", summary: "Get housing allowance info", description: "Returns housing allowance information and eligibility.", category: "Social Insurance", parameters: [] },
    { path: "/v1/social-insurance/rehabilitation", method: "get", summary: "Get rehabilitation benefits", description: "Returns rehabilitation benefit information.", category: "Social Insurance", parameters: [] },
    { path: "/v1/social-insurance/work-injury", method: "get", summary: "Get work injury insurance", description: "Returns work injury insurance information.", category: "Social Insurance", parameters: [] },
    { path: "/v1/social-insurance/pension", method: "get", summary: "Get pension information", description: "Returns pension information and calculations.", category: "Social Insurance", parameters: [] },
    { path: "/v1/parental-leave", method: "get", summary: "Get parental leave info", description: "Returns parental leave benefits and rules from Försäkringskassan.", category: "Social Insurance", parameters: [] },
    // === Telecom & Data ===
    { path: "/v1/telecom/operator", method: "get", summary: "Look up telecom operator", description: "Returns which operator owns a phone number.", category: "Telecom & Data", parameters: [{ name: "area_code", in: "query", required: true, description: "Area code" }, { name: "number", in: "query", required: true, description: "Phone number" }] },
    { path: "/v1/telecom/wireless", method: "get", summary: "Check wireless coverage", description: "Returns mobile network coverage data for a location.", category: "Telecom & Data", parameters: [{ name: "lat", in: "query", required: true, description: "Latitude" }, { name: "lon", in: "query", required: true, description: "Longitude" }] },
    { path: "/v1/power-grid", method: "get", summary: "Get power grid status", description: "Returns electricity grid status, load, and frequency from Svenska Kraftnät.", category: "Telecom & Data", parameters: [] },
    { path: "/v1/open-data", method: "get", summary: "Search open data catalog", description: "Search Sweden's open data catalog (dataportal.se).", category: "Telecom & Data", parameters: [{ name: "q", in: "query", required: false, description: "Search query" }, { name: "limit", in: "query", required: false, description: "Max results" }] },
    // === Tourism ===
    { path: "/v1/tourism", method: "get", summary: "Get tourism statistics", description: "Returns tourism statistics and trends for Sweden.", category: "Tourism", parameters: [] },
    { path: "/v1/destinations", method: "get", summary: "Search tourist destinations", description: "Search tourist destinations in Sweden.", category: "Tourism", parameters: [{ name: "type", in: "query", required: false, description: "Destination type (e.g. LodgingBusiness)" }, { name: "limit", in: "query", required: false, description: "Max results" }] },
    { path: "/v1/destinations/types", method: "get", summary: "List destination types", description: "Returns available destination types.", category: "Tourism", parameters: [] },
    // === Transport & Infrastructure ===
    { path: "/v1/transport/trains/{station}", method: "get", summary: "Get train departures/arrivals", description: "Returns upcoming train departures and arrivals. Uses Trafikverket real-time data.", category: "Transport & Infrastructure", parameters: [{ name: "station", in: "path", required: true, description: "Station signature (e.g. Cst for Stockholm Central)" }] },
    { path: "/v1/transport/ferries/{route}", method: "get", summary: "Get ferry schedule", description: "Returns ferry departures for a route (e.g. Furusundsleden).", category: "Transport & Infrastructure", parameters: [{ name: "route", in: "path", required: true, description: "Ferry route name" }] },
    { path: "/v1/transport/traffic", method: "get", summary: "Get traffic situations", description: "Returns live traffic situations (accidents, congestion, roadwork).", category: "Transport & Infrastructure", parameters: [{ name: "type", in: "query", required: false, description: "Situation type" }, { name: "region", in: "query", required: false, description: "Region filter" }] },
    { path: "/v1/transport/road-conditions", method: "get", summary: "Get road conditions", description: "Returns road surface conditions.", category: "Transport & Infrastructure", parameters: [{ name: "region", in: "query", required: false, description: "Region filter" }] },
    { path: "/v1/transport/statistics", method: "get", summary: "Get transport statistics", description: "Returns transport statistics from Trafikanalys.", category: "Transport & Infrastructure", parameters: [{ name: "dataset", in: "query", required: false, description: "Dataset name" }] },
    { path: "/v1/transport/statistics/datasets", method: "get", summary: "List transport datasets", description: "Returns available transport statistics datasets.", category: "Transport & Infrastructure", parameters: [] },
    { path: "/v1/transit/departures", method: "get", summary: "Get public transit departures", description: "Returns bus, train, and metro departures from ResRobot.", category: "Transport & Infrastructure", parameters: [{ name: "stop", in: "query", required: true, description: "Stop name or ID" }, { name: "limit", in: "query", required: false, description: "Max results" }] },
    { path: "/v1/road-conditions", method: "get", summary: "Get road conditions (standalone)", description: "Returns real-time road surface conditions.", category: "Transport & Infrastructure", parameters: [{ name: "region", in: "query", required: false, description: "Region filter" }] },
    { path: "/v1/infrastructure/ev-chargers", method: "get", summary: "Find EV charging stations", description: "Returns nearby electric vehicle charging stations.", category: "Transport & Infrastructure", parameters: [{ name: "lat", in: "query", required: true, description: "Latitude" }, { name: "lon", in: "query", required: true, description: "Longitude" }] },
    { path: "/v1/infrastructure/parking", method: "get", summary: "Find parking locations", description: "Returns nearby parking locations.", category: "Transport & Infrastructure", parameters: [{ name: "lat", in: "query", required: true, description: "Latitude" }, { name: "lon", in: "query", required: true, description: "Longitude" }] },
    { path: "/v1/infrastructure/cameras", method: "get", summary: "Get traffic cameras", description: "Returns traffic camera locations and status.", category: "Transport & Infrastructure", parameters: [] },
    { path: "/v1/infrastructure/bridges", method: "get", summary: "Get bridge information", description: "Returns bridge locations and status.", category: "Transport & Infrastructure", parameters: [] },
    { path: "/v1/infrastructure/fuel-stations", method: "get", summary: "Find fuel stations", description: "Returns nearby fuel station locations.", category: "Transport & Infrastructure", parameters: [{ name: "lat", in: "query", required: false, description: "Latitude" }, { name: "lon", in: "query", required: false, description: "Longitude" }] },
    { path: "/v1/infrastructure/rest-areas", method: "get", summary: "Find rest areas", description: "Returns highway rest areas.", category: "Transport & Infrastructure", parameters: [] },
    { path: "/v1/infrastructure/travel-times", method: "get", summary: "Get travel time estimates", description: "Returns estimated travel times between locations.", category: "Transport & Infrastructure", parameters: [{ name: "q", in: "query", required: false, description: "Route query" }] },
    { path: "/v1/infrastructure/traffic-flow", method: "get", summary: "Get real-time traffic flow", description: "Returns real-time traffic flow data.", category: "Transport & Infrastructure", parameters: [] },
    // === Weather & Climate ===
    { path: "/v1/weather/{city}", method: "get", summary: "Get current weather", description: "Returns latest weather observation from nearest SMHI station for a Swedish city.", category: "Weather & Climate", parameters: [{ name: "city", in: "path", required: true, description: "Swedish city name (e.g. stockholm, gothenburg, malmö)" }] },
    { path: "/v1/weather/{city}/forecast", method: "get", summary: "Get weather forecast", description: "Returns 7-10 day weather forecast for a Swedish city.", category: "Weather & Climate", parameters: [{ name: "city", in: "path", required: true, description: "Swedish city name" }] },
    { path: "/v1/weather/warnings", method: "get", summary: "Get weather warnings", description: "Returns active SMHI weather warnings for Sweden.", category: "Weather & Climate", parameters: [{ name: "limit", in: "query", required: false, description: "Max results" }] },
    { path: "/v1/weather/lightning", method: "get", summary: "Get lightning data", description: "Returns recent lightning strike data.", category: "Weather & Climate", parameters: [] },
    { path: "/v1/weather/lightning/summary", method: "get", summary: "Get lightning summary", description: "Returns monthly lightning strike statistics.", category: "Weather & Climate", parameters: [] },
    { path: "/v1/pollen/forecast", method: "get", summary: "Get pollen forecast", description: "Returns pollen forecast (birch, grass, ragweed, etc.).", category: "Weather & Climate", parameters: [] },
    { path: "/v1/air-quality/stations", method: "get", summary: "Get air quality stations", description: "Returns air quality monitoring stations.", category: "Weather & Climate", parameters: [] },
    { path: "/v1/air-quality/current", method: "get", summary: "Get current air quality", description: "Returns current air quality index for a location.", category: "Weather & Climate", parameters: [{ name: "lat", in: "query", required: true, description: "Latitude" }, { name: "lon", in: "query", required: true, description: "Longitude" }] },
];
/**
 * Returns all unique category names from the endpoint registry.
 * @returns Sorted array of category names
 */
export function getCategories() {
    return [...new Set(ENDPOINTS.map(e => e.category))].sort();
}
/**
 * Searches endpoints by keyword across summary, description, path, and category.
 * @param query - Search term (case-insensitive)
 * @returns Matching endpoints
 */
export function searchEndpoints(query) {
    const lower = query.toLowerCase();
    return ENDPOINTS.filter(e => e.summary.toLowerCase().includes(lower) ||
        e.description.toLowerCase().includes(lower) ||
        e.path.toLowerCase().includes(lower) ||
        e.category.toLowerCase().includes(lower));
}
/**
 * Returns endpoints filtered by category.
 * @param category - Category name (case-insensitive partial match)
 * @returns Matching endpoints
 */
export function getEndpointsByCategory(category) {
    const lower = category.toLowerCase();
    return ENDPOINTS.filter(e => e.category.toLowerCase().includes(lower));
}
//# sourceMappingURL=endpoints.js.map