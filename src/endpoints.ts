/**
 * Generated Apiverket MCP endpoint catalog.
 * Source of truth: src/endpoint-registry.ts
 */

export interface EndpointParam {
  name: string;
  in: "path" | "query";
  required: boolean;
  description: string;
}

export interface Endpoint {
  path: string;
  method: string;
  summary: string;
  description: string;
  category: string;
  parameters: EndpointParam[];
  guidance?: {
    whenToUse?: string;
    workflow?: string[];
    constraints?: string[];
    avoid?: string[];
    quotaNotes?: string[];
    examples?: string[];
    recovery?: string[];
    upgradeTrigger?: string;
  };
}

export const ENDPOINTS: Endpoint[] = [
  {
    "path": "/v1/rates",
    "method": "get",
    "summary": "Get current exchange rates and policy rate",
    "description": "Returns the latest EUR/SEK, USD/SEK exchange rates and the Riksbank policy rate.",
    "category": "Economy & Finance",
    "parameters": []
  },
  {
    "path": "/v1/rates/bonds",
    "method": "get",
    "summary": "Get government bond yields",
    "description": "Returns current Swedish government bond yields (2Y, 5Y, 10Y) from Riksbanken.",
    "category": "Economy & Finance",
    "parameters": []
  },
  {
    "path": "/v1/rates/mortgage",
    "method": "get",
    "summary": "Mortgage interest rates",
    "description": "Returns current mortgage interest rates.",
    "category": "Economy & Finance",
    "parameters": []
  },
  {
    "path": "/v1/rates/treasury-bills",
    "method": "get",
    "summary": "Get Treasury Bill rates",
    "description": "Returns current Swedish Treasury Bill rates (1M, 3M, 6M) from Riksbanken.",
    "category": "Economy & Finance",
    "parameters": []
  },
  {
    "path": "/v1/currencies",
    "method": "get",
    "summary": "List all available currency pairs",
    "description": "Returns all available currency pairs with current rates.",
    "category": "Economy & Finance",
    "parameters": []
  },
  {
    "path": "/v1/currencies/{pair}/history",
    "method": "get",
    "summary": "Get historical rates for a currency pair",
    "description": "Returns historical exchange rates for the given currency pair.",
    "category": "Economy & Finance",
    "parameters": [
      {
        "name": "pair",
        "in": "path",
        "required": true,
        "description": "Currency pair (e.g. EUR/SEK)"
      },
      {
        "name": "from",
        "in": "query",
        "required": false,
        "description": "Start date"
      },
      {
        "name": "to",
        "in": "query",
        "required": false,
        "description": "End date"
      }
    ]
  },
  {
    "path": "/v1/statistics/industry/{sniCode}",
    "method": "get",
    "summary": "Get industry statistics by SNI code",
    "description": "Returns enterprise count and size distribution for a given Swedish Standard Industrial Classification (SNI) code from SCB.",
    "category": "Economy & Finance",
    "parameters": [
      {
        "name": "sniCode",
        "in": "path",
        "required": true,
        "description": "SNI 2007 industry code (e.g. 62010 for software development)"
      }
    ]
  },
  {
    "path": "/v1/municipalities",
    "method": "get",
    "summary": "List all municipalities",
    "description": "Lists all Swedish municipalities and regions from KOLADA.",
    "category": "Demographics & Municipalities",
    "parameters": [
      {
        "name": "offset",
        "in": "query",
        "required": false,
        "description": "Pagination offset"
      },
      {
        "name": "limit",
        "in": "query",
        "required": false,
        "description": "Page size"
      }
    ]
  },
  {
    "path": "/v1/municipalities/{id}",
    "method": "get",
    "summary": "Municipality detail",
    "description": "Returns detailed info for a specific municipality from Kolada.",
    "category": "Demographics & Municipalities",
    "parameters": [
      {
        "name": "id",
        "in": "path",
        "required": true,
        "description": "Municipality ID (e.g. 0180)"
      }
    ]
  },
  {
    "path": "/v1/municipalities/{id}/kpi/{kpiId}",
    "method": "get",
    "summary": "Get a KPI for a municipality",
    "description": "Returns the latest value for a specific Kolada KPI for a given municipality. Municipality IDs are 4-digit codes (e.g. 0180 = Stockholm).",
    "category": "Demographics & Municipalities",
    "parameters": [
      {
        "name": "id",
        "in": "path",
        "required": true,
        "description": "Municipality code (4 digits, e.g. 0180)"
      },
      {
        "name": "kpiId",
        "in": "path",
        "required": true,
        "description": "Kolada KPI ID (e.g. N00945)"
      }
    ]
  },
  {
    "path": "/v1/municipalities/kpis",
    "method": "get",
    "summary": "Search KPI definitions",
    "description": "Searches for KPI definitions from KOLADA by title.",
    "category": "Demographics & Municipalities",
    "parameters": [
      {
        "name": "q",
        "in": "query",
        "required": true,
        "description": "KPI name search (min 2 chars)"
      },
      {
        "name": "offset",
        "in": "query",
        "required": false,
        "description": "Pagination offset"
      },
      {
        "name": "limit",
        "in": "query",
        "required": false,
        "description": "Page size"
      }
    ]
  },
  {
    "path": "/v1/population",
    "method": "get",
    "summary": "National population statistics",
    "description": "Returns national population statistics from SCB.",
    "category": "Demographics & Municipalities",
    "parameters": []
  },
  {
    "path": "/v1/population/{municipalityCode}",
    "method": "get",
    "summary": "Population by municipality",
    "description": "Returns population data for a specific municipality.",
    "category": "Demographics & Municipalities",
    "parameters": [
      {
        "name": "municipalityCode",
        "in": "path",
        "required": true,
        "description": "Municipality code (e.g. 0180)"
      }
    ]
  },
  {
    "path": "/v1/population/pyramid",
    "method": "get",
    "summary": "Population pyramid by age and sex",
    "description": "Returns population distribution by age group and sex.",
    "category": "Demographics & Municipalities",
    "parameters": []
  },
  {
    "path": "/v1/demographics/deso",
    "method": "get",
    "summary": "Get DeSO-level demographics by coordinates",
    "description": "Returns demographic data (population, age distribution, education, foreign-born percentage) for the DeSO area at given coordinates.",
    "category": "Demographics & Municipalities",
    "parameters": [
      {
        "name": "lat",
        "in": "query",
        "required": true,
        "description": "Latitude"
      },
      {
        "name": "lon",
        "in": "query",
        "required": true,
        "description": "Longitude"
      }
    ]
  },
  {
    "path": "/v1/prices",
    "method": "get",
    "summary": "Get consumer price index",
    "description": "Returns CPI and inflation data for Sweden.",
    "category": "Economy & Finance",
    "parameters": []
  },
  {
    "path": "/v1/prices/cpi",
    "method": "get",
    "summary": "Consumer price index",
    "description": "Returns consumer price index (CPI) data from SCB.",
    "category": "Economy & Finance",
    "parameters": []
  },
  {
    "path": "/v1/prices/ppi",
    "method": "get",
    "summary": "Producer price index",
    "description": "Returns producer price index (PPI) data from SCB.",
    "category": "Economy & Finance",
    "parameters": []
  },
  {
    "path": "/v1/labor",
    "method": "get",
    "summary": "Labor market statistics",
    "description": "Returns labor market statistics from SCB — employment, unemployment rates.",
    "category": "Economy & Finance",
    "parameters": []
  },
  {
    "path": "/v1/housing",
    "method": "get",
    "summary": "Housing price statistics",
    "description": "Returns housing price statistics from SCB.",
    "category": "Economy & Finance",
    "parameters": []
  },
  {
    "path": "/v1/housing/stock",
    "method": "get",
    "summary": "Housing stock data",
    "description": "Returns housing stock data from SCB.",
    "category": "Economy & Finance",
    "parameters": []
  },
  {
    "path": "/v1/income",
    "method": "get",
    "summary": "Income statistics",
    "description": "Returns income statistics from SCB.",
    "category": "Economy & Finance",
    "parameters": [
      {
        "name": "year",
        "in": "query",
        "required": false,
        "description": "Filter by year"
      },
      {
        "name": "municipality",
        "in": "query",
        "required": false,
        "description": "Filter by municipality"
      }
    ]
  },
  {
    "path": "/v1/trade",
    "method": "get",
    "summary": "Import/export trade data",
    "description": "Returns import/export trade data from SCB.",
    "category": "Economy & Finance",
    "parameters": [
      {
        "name": "year",
        "in": "query",
        "required": false,
        "description": "Filter by year"
      }
    ]
  },
  {
    "path": "/v1/wages",
    "method": "get",
    "summary": "Wage statistics",
    "description": "Returns wage statistics from SCB.",
    "category": "Economy & Finance",
    "parameters": []
  },
  {
    "path": "/v1/public-finance",
    "method": "get",
    "summary": "Government budget/finance data",
    "description": "Returns government budget and finance data from SCB/Ekonomistyrningsverket.",
    "category": "Economy & Finance",
    "parameters": []
  },
  {
    "path": "/v1/money-supply",
    "method": "get",
    "summary": "M1/M2/M3 monetary aggregates",
    "description": "Returns monetary aggregates (M1, M2, M3) from Riksbanken.",
    "category": "Economy & Finance",
    "parameters": []
  },
  {
    "path": "/v1/financial-series",
    "method": "get",
    "summary": "Riksbanken time series",
    "description": "Returns time series data from Riksbanken.",
    "category": "Economy & Finance",
    "parameters": [
      {
        "name": "series",
        "in": "query",
        "required": true,
        "description": "Series ID"
      },
      {
        "name": "from",
        "in": "query",
        "required": false,
        "description": "Start date"
      },
      {
        "name": "to",
        "in": "query",
        "required": false,
        "description": "End date"
      }
    ]
  },
  {
    "path": "/v1/transport/ferries/{route}",
    "method": "get",
    "summary": "Get ferry departures for a route",
    "description": "Returns ferry departure data for a named route from Trafikverket.",
    "category": "Transport & Infrastructure",
    "parameters": [
      {
        "name": "route",
        "in": "path",
        "required": true,
        "description": "Ferry route name (e.g. Vaxholm-Rindo)"
      },
      {
        "name": "offset",
        "in": "query",
        "required": false,
        "description": "Pagination offset"
      },
      {
        "name": "limit",
        "in": "query",
        "required": false,
        "description": "Page size"
      }
    ]
  },
  {
    "path": "/v1/transport/road-conditions",
    "method": "get",
    "summary": "Get road condition reports",
    "description": "Returns road condition data from Trafikverket, optionally filtered by region.",
    "category": "Transport & Infrastructure",
    "parameters": [
      {
        "name": "region",
        "in": "query",
        "required": false,
        "description": "Filter by region"
      },
      {
        "name": "offset",
        "in": "query",
        "required": false,
        "description": "Pagination offset"
      },
      {
        "name": "limit",
        "in": "query",
        "required": false,
        "description": "Page size"
      }
    ]
  },
  {
    "path": "/v1/transport/statistics",
    "method": "get",
    "summary": "Get transport statistics by dataset code",
    "description": "Returns transport statistics from Trafikanalys for a given dataset code. Use the /datasets endpoint to discover available datasets.",
    "category": "Transport & Infrastructure",
    "parameters": [
      {
        "name": "dataset",
        "in": "query",
        "required": true,
        "description": "Dataset code (e.g. t10011 for bus statistics)"
      }
    ]
  },
  {
    "path": "/v1/transport/statistics/datasets",
    "method": "get",
    "summary": "List available transport datasets",
    "description": "Returns a list of available transport statistics datasets from Trafikanalys with their codes and descriptions.",
    "category": "Transport & Infrastructure",
    "parameters": []
  },
  {
    "path": "/v1/transport/traffic",
    "method": "get",
    "summary": "Get traffic situations",
    "description": "Returns traffic situation data from Trafikverket, filterable by type and region.",
    "category": "Transport & Infrastructure",
    "parameters": [
      {
        "name": "type",
        "in": "query",
        "required": false,
        "description": "Filter by situation type"
      },
      {
        "name": "region",
        "in": "query",
        "required": false,
        "description": "Filter by region"
      },
      {
        "name": "offset",
        "in": "query",
        "required": false,
        "description": "Pagination offset"
      },
      {
        "name": "limit",
        "in": "query",
        "required": false,
        "description": "Page size"
      }
    ]
  },
  {
    "path": "/v1/transport/trains/{station}",
    "method": "get",
    "summary": "Get train departures and arrivals",
    "description": "Returns upcoming train departures and arrivals from Trafikverket.",
    "category": "Transport & Infrastructure",
    "parameters": [
      {
        "name": "station",
        "in": "path",
        "required": true,
        "description": "Station signature (e.g. Cst for Stockholm Central)"
      }
    ]
  },
  {
    "path": "/v1/infrastructure/bridges",
    "method": "get",
    "summary": "Bridges",
    "description": "Returns bridge data from Trafikverket.",
    "category": "Transport & Infrastructure",
    "parameters": []
  },
  {
    "path": "/v1/infrastructure/cameras",
    "method": "get",
    "summary": "Traffic cameras",
    "description": "Returns traffic camera locations and info from Trafikverket.",
    "category": "Transport & Infrastructure",
    "parameters": []
  },
  {
    "path": "/v1/infrastructure/ev-chargers",
    "method": "get",
    "summary": "EV charging stations",
    "description": "Returns nearby EV charging stations from Trafikverket/Nobil.",
    "category": "Transport & Infrastructure",
    "parameters": [
      {
        "name": "lat",
        "in": "query",
        "required": true,
        "description": "Latitude"
      },
      {
        "name": "lon",
        "in": "query",
        "required": true,
        "description": "Longitude"
      }
    ]
  },
  {
    "path": "/v1/infrastructure/fuel-stations",
    "method": "get",
    "summary": "Fuel stations",
    "description": "Returns fuel station data from Trafikverket.",
    "category": "Transport & Infrastructure",
    "parameters": [
      {
        "name": "lat",
        "in": "query",
        "required": false,
        "description": "Latitude"
      },
      {
        "name": "lon",
        "in": "query",
        "required": false,
        "description": "Longitude"
      }
    ]
  },
  {
    "path": "/v1/infrastructure/parking",
    "method": "get",
    "summary": "Parking areas",
    "description": "Returns nearby parking areas from Trafikverket.",
    "category": "Transport & Infrastructure",
    "parameters": [
      {
        "name": "lat",
        "in": "query",
        "required": true,
        "description": "Latitude"
      },
      {
        "name": "lon",
        "in": "query",
        "required": true,
        "description": "Longitude"
      }
    ]
  },
  {
    "path": "/v1/infrastructure/rest-areas",
    "method": "get",
    "summary": "Rest areas",
    "description": "Returns rest area data from Trafikverket.",
    "category": "Transport & Infrastructure",
    "parameters": []
  },
  {
    "path": "/v1/infrastructure/traffic-flow",
    "method": "get",
    "summary": "Traffic flow data",
    "description": "Returns real-time traffic flow measurements from Trafikverket.",
    "category": "Transport & Infrastructure",
    "parameters": [
      {
        "name": "county",
        "in": "query",
        "required": false,
        "description": "Filter by county number"
      },
      {
        "name": "road",
        "in": "query",
        "required": false,
        "description": "Filter by road number (e.g. E4)"
      },
      {
        "name": "offset",
        "in": "query",
        "required": false,
        "description": "Pagination offset"
      },
      {
        "name": "limit",
        "in": "query",
        "required": false,
        "description": "Page size"
      }
    ]
  },
  {
    "path": "/v1/infrastructure/travel-times",
    "method": "get",
    "summary": "Travel time routes",
    "description": "Returns travel time data for monitored road segments from Trafikverket.",
    "category": "Transport & Infrastructure",
    "parameters": [
      {
        "name": "county",
        "in": "query",
        "required": false,
        "description": "Filter by county number"
      },
      {
        "name": "road",
        "in": "query",
        "required": false,
        "description": "Filter by road number (e.g. E4)"
      },
      {
        "name": "offset",
        "in": "query",
        "required": false,
        "description": "Pagination offset"
      },
      {
        "name": "limit",
        "in": "query",
        "required": false,
        "description": "Page size"
      },
      {
        "name": "q",
        "in": "query",
        "required": false,
        "description": "Route query"
      }
    ]
  },
  {
    "path": "/v1/transit/departures",
    "method": "get",
    "summary": "Get public transport departures",
    "description": "Returns upcoming departures from a public transport stop via ResRobot. Includes buses, trains, trams, and ferries.",
    "category": "Transport & Infrastructure",
    "parameters": [
      {
        "name": "stop",
        "in": "query",
        "required": true,
        "description": "Stop name or ID"
      },
      {
        "name": "limit",
        "in": "query",
        "required": false,
        "description": "Max results to return"
      }
    ]
  },
  {
    "path": "/v1/road-conditions",
    "method": "get",
    "summary": "Road condition reports",
    "description": "Returns road condition reports from Trafikverket.",
    "category": "Transport & Infrastructure",
    "parameters": [
      {
        "name": "region",
        "in": "query",
        "required": false,
        "description": "Filter by region"
      }
    ]
  },
  {
    "path": "/v1/weather/{city}",
    "method": "get",
    "summary": "Get current weather",
    "description": "Returns the latest weather observation from the nearest SMHI station for a Swedish city.",
    "category": "Weather & Climate",
    "parameters": [
      {
        "name": "city",
        "in": "path",
        "required": true,
        "description": "Swedish city name (e.g. stockholm, gothenburg, malmö)"
      }
    ]
  },
  {
    "path": "/v1/weather/{city}/forecast",
    "method": "get",
    "summary": "Get weather forecast for a city",
    "description": "Returns weather forecast for a Swedish city from SMHI.",
    "category": "Weather & Climate",
    "parameters": [
      {
        "name": "city",
        "in": "path",
        "required": true,
        "description": "Swedish city name"
      }
    ]
  },
  {
    "path": "/v1/weather/lightning",
    "method": "get",
    "summary": "Get lightning data",
    "description": "Returns recent lightning strike data.",
    "category": "Weather & Climate",
    "parameters": []
  },
  {
    "path": "/v1/weather/lightning/summary",
    "method": "get",
    "summary": "Get lightning statistics summary",
    "description": "Returns monthly lightning statistics for Sweden from SMHI.",
    "category": "Weather & Climate",
    "parameters": [
      {
        "name": "offset",
        "in": "query",
        "required": false,
        "description": "Pagination offset"
      },
      {
        "name": "limit",
        "in": "query",
        "required": false,
        "description": "Page size"
      }
    ]
  },
  {
    "path": "/v1/weather/warnings",
    "method": "get",
    "summary": "Get current weather warnings",
    "description": "Returns current weather warnings from SMHI.",
    "category": "Weather & Climate",
    "parameters": [
      {
        "name": "offset",
        "in": "query",
        "required": false,
        "description": "Pagination offset"
      },
      {
        "name": "limit",
        "in": "query",
        "required": false,
        "description": "Page size"
      }
    ]
  },
  {
    "path": "/v1/air-quality/current",
    "method": "get",
    "summary": "Get nearest station readings",
    "description": "Returns current air quality readings from the nearest monitoring station to the given coordinates.",
    "category": "Weather & Climate",
    "parameters": [
      {
        "name": "lat",
        "in": "query",
        "required": true,
        "description": "Latitude"
      },
      {
        "name": "lon",
        "in": "query",
        "required": true,
        "description": "Longitude"
      }
    ]
  },
  {
    "path": "/v1/air-quality/stations",
    "method": "get",
    "summary": "List air quality monitoring stations",
    "description": "Returns a list of air quality monitoring stations across Sweden.",
    "category": "Weather & Climate",
    "parameters": []
  },
  {
    "path": "/v1/pollen/forecast",
    "method": "get",
    "summary": "Get pollen forecast",
    "description": "Returns current pollen forecast for Sweden.",
    "category": "Weather & Climate",
    "parameters": []
  },
  {
    "path": "/v1/social-insurance",
    "method": "get",
    "summary": "Get social insurance overview",
    "description": "Returns general social insurance benefits overview from Försäkringskassan.",
    "category": "Social Insurance",
    "parameters": []
  },
  {
    "path": "/v1/social-insurance/child-allowance",
    "method": "get",
    "summary": "Child allowance statistics",
    "description": "Returns child allowance (barnbidrag) statistics from Försäkringskassan.",
    "category": "Social Insurance",
    "parameters": []
  },
  {
    "path": "/v1/social-insurance/disability",
    "method": "get",
    "summary": "Disability benefit statistics",
    "description": "Returns disability benefit (aktivitetsersättning/sjukersättning) statistics from Försäkringskassan.",
    "category": "Social Insurance",
    "parameters": []
  },
  {
    "path": "/v1/social-insurance/housing-allowance",
    "method": "get",
    "summary": "Housing allowance statistics",
    "description": "Returns housing allowance (bostadsbidrag) statistics from Försäkringskassan.",
    "category": "Social Insurance",
    "parameters": []
  },
  {
    "path": "/v1/social-insurance/pension",
    "method": "get",
    "summary": "Pension statistics",
    "description": "Returns pension statistics from Försäkringskassan.",
    "category": "Social Insurance",
    "parameters": []
  },
  {
    "path": "/v1/social-insurance/rehabilitation",
    "method": "get",
    "summary": "Rehabilitation statistics",
    "description": "Returns rehabilitation (rehabiliteringspenning) statistics from Försäkringskassan.",
    "category": "Social Insurance",
    "parameters": []
  },
  {
    "path": "/v1/social-insurance/work-injury",
    "method": "get",
    "summary": "Work injury statistics",
    "description": "Returns work injury (arbetsskadeförsäkring) statistics from Försäkringskassan.",
    "category": "Social Insurance",
    "parameters": []
  },
  {
    "path": "/v1/health/diagnoses/{code}",
    "method": "get",
    "summary": "Get diagnosis guidance by ICD-10 code",
    "description": "Returns Socialstyrelsen's recommended sick leave guidance for a given ICD-10 diagnosis code.",
    "category": "Health & Medicine",
    "parameters": [
      {
        "name": "code",
        "in": "path",
        "required": true,
        "description": "ICD-10 diagnosis code (e.g. M54, F32)"
      }
    ]
  },
  {
    "path": "/v1/health/mortality",
    "method": "get",
    "summary": "Mortality statistics",
    "description": "Returns mortality statistics from Socialstyrelsen.",
    "category": "Health & Medicine",
    "parameters": []
  },
  {
    "path": "/v1/health/sick-leave-full",
    "method": "get",
    "summary": "Full sick leave data by diagnosis",
    "description": "Returns comprehensive sick leave data broken down by diagnosis from Försäkringskassan.",
    "category": "Health & Medicine",
    "parameters": [
      {
        "name": "q",
        "in": "query",
        "required": false,
        "description": "Search query"
      },
      {
        "name": "limit",
        "in": "query",
        "required": false,
        "description": "Max results"
      }
    ]
  },
  {
    "path": "/v1/health/sick-leave/{code}",
    "method": "get",
    "summary": "Get sick leave recommendation by ICD-10 code",
    "description": "Returns Socialstyrelsen FMB's insurance medicine recommendation for a given ICD-10 code, including functional limitations, activity limitations, and prognosis.",
    "category": "Health & Medicine",
    "parameters": [
      {
        "name": "code",
        "in": "path",
        "required": true,
        "description": "ICD-10 diagnosis code (e.g. M54, F32, J06)"
      }
    ]
  },
  {
    "path": "/v1/healthcare/care-quality",
    "method": "get",
    "summary": "Care quality indicators",
    "description": "Returns care quality (öppna jämförelser) indicators.",
    "category": "Health & Medicine",
    "parameters": [
      {
        "name": "q",
        "in": "query",
        "required": false,
        "description": "Search query"
      }
    ]
  },
  {
    "path": "/v1/healthcare/wait-times",
    "method": "get",
    "summary": "Healthcare wait times",
    "description": "Returns healthcare wait times (vårdgaranti) data.",
    "category": "Health & Medicine",
    "parameters": [
      {
        "name": "region",
        "in": "query",
        "required": false,
        "description": "Region filter"
      }
    ]
  },
  {
    "path": "/v1/schools/{code}",
    "method": "get",
    "summary": "Get school details by code",
    "description": "Returns detailed information about a specific school unit identified by its Skolverket code.",
    "category": "Education",
    "parameters": [
      {
        "name": "code",
        "in": "path",
        "required": true,
        "description": "Skolverket school unit code"
      }
    ]
  },
  {
    "path": "/v1/schools/grades",
    "method": "get",
    "summary": "Get school grades by municipality",
    "description": "Returns school grade and merit data for a municipality.",
    "category": "Education",
    "parameters": [
      {
        "name": "municipality",
        "in": "query",
        "required": true,
        "description": "Municipality name (min 2 chars)"
      },
      {
        "name": "offset",
        "in": "query",
        "required": false,
        "description": "Pagination offset"
      },
      {
        "name": "limit",
        "in": "query",
        "required": false,
        "description": "Page size"
      }
    ]
  },
  {
    "path": "/v1/schools/search",
    "method": "get",
    "summary": "Search Swedish schools",
    "description": "Search schools by name via Skolverket. Returns school code, name, type, municipality, and principal.",
    "category": "Education",
    "parameters": [
      {
        "name": "q",
        "in": "query",
        "required": true,
        "description": "School name to search for (min 2 characters)"
      },
      {
        "name": "limit",
        "in": "query",
        "required": false,
        "description": "Max results to return"
      }
    ]
  },
  {
    "path": "/v1/education",
    "method": "get",
    "summary": "Education statistics",
    "description": "Returns education statistics from SCB.",
    "category": "Education",
    "parameters": []
  },
  {
    "path": "/v1/qualifications",
    "method": "get",
    "summary": "List professional qualifications",
    "description": "Lists Swedish professional qualifications and certifications from the MYH Kvalifikationsdatabasen. Includes vocational qualifications, industry certifications, and competence proofs.",
    "category": "Education",
    "parameters": [
      {
        "name": "q",
        "in": "query",
        "required": false,
        "description": "Text search filter (name, organization, type)"
      },
      {
        "name": "limit",
        "in": "query",
        "required": false,
        "description": "Max results"
      }
    ]
  },
  {
    "path": "/v1/qualifications/{id}",
    "method": "get",
    "summary": "Get qualification details",
    "description": "Returns detailed information about a specific qualification, including learning outcomes, EQF/SeQF levels, occupation codes, and validity period.",
    "category": "Education",
    "parameters": [
      {
        "name": "id",
        "in": "path",
        "required": true,
        "description": "Qualification UUID"
      }
    ]
  },
  {
    "path": "/v1/parliament/bills",
    "method": "get",
    "summary": "Legislative bills",
    "description": "Returns legislative bills (propositioner) from Riksdagen.",
    "category": "Government & Safety",
    "parameters": [
      {
        "name": "limit",
        "in": "query",
        "required": false,
        "description": "Max results"
      }
    ]
  },
  {
    "path": "/v1/parliament/calendar",
    "method": "get",
    "summary": "Get parliament calendar events",
    "description": "Returns parliament calendar events (debates, votes) from Riksdagen.",
    "category": "Government & Safety",
    "parameters": [
      {
        "name": "from",
        "in": "query",
        "required": false,
        "description": "Start date (YYYY-MM-DD)"
      },
      {
        "name": "to",
        "in": "query",
        "required": false,
        "description": "End date (YYYY-MM-DD)"
      },
      {
        "name": "offset",
        "in": "query",
        "required": false,
        "description": "Pagination offset"
      },
      {
        "name": "limit",
        "in": "query",
        "required": false,
        "description": "Page size"
      }
    ]
  },
  {
    "path": "/v1/parliament/committees",
    "method": "get",
    "summary": "Parliament committees",
    "description": "Returns a list of parliament committees from Riksdagen.",
    "category": "Government & Safety",
    "parameters": []
  },
  {
    "path": "/v1/parliament/documents",
    "method": "get",
    "summary": "Search parliament documents",
    "description": "Search Riksdag documents (motioner, propositioner, etc.) by type and session.",
    "category": "Government & Safety",
    "parameters": [
      {
        "name": "type",
        "in": "query",
        "required": false,
        "description": "Document type (e.g. mot = motion, prop = proposition)"
      },
      {
        "name": "session",
        "in": "query",
        "required": false,
        "description": "Parliamentary session (e.g. 2024/25)"
      },
      {
        "name": "limit",
        "in": "query",
        "required": false,
        "description": "Max results to return"
      }
    ]
  },
  {
    "path": "/v1/parliament/members",
    "method": "get",
    "summary": "Search parliament members",
    "description": "Returns current members of the Swedish Riksdag. Filter by political party.",
    "category": "Government & Safety",
    "parameters": [
      {
        "name": "party",
        "in": "query",
        "required": false,
        "description": "Party abbreviation (e.g. S, M, SD, C, V, KD, L, MP)"
      },
      {
        "name": "limit",
        "in": "query",
        "required": false,
        "description": "Max results to return"
      }
    ]
  },
  {
    "path": "/v1/parliament/members/{id}",
    "method": "get",
    "summary": "Member detail",
    "description": "Returns detailed info about a specific parliament member.",
    "category": "Government & Safety",
    "parameters": [
      {
        "name": "id",
        "in": "path",
        "required": true,
        "description": "Member ID"
      }
    ]
  },
  {
    "path": "/v1/parliament/sfs",
    "method": "get",
    "summary": "Swedish law gazette (SFS)",
    "description": "Returns laws from Svensk författningssamling (SFS).",
    "category": "Government & Safety",
    "parameters": [
      {
        "name": "limit",
        "in": "query",
        "required": false,
        "description": "Max results"
      }
    ]
  },
  {
    "path": "/v1/parliament/sou",
    "method": "get",
    "summary": "Government investigations (SOU)",
    "description": "Returns government investigations (Statens offentliga utredningar) from Riksdagen.",
    "category": "Government & Safety",
    "parameters": [
      {
        "name": "limit",
        "in": "query",
        "required": false,
        "description": "Max results"
      }
    ]
  },
  {
    "path": "/v1/parliament/voting-stats",
    "method": "get",
    "summary": "Voting statistics",
    "description": "Returns voting statistics from Riksdagen.",
    "category": "Government & Safety",
    "parameters": []
  },
  {
    "path": "/v1/police/events",
    "method": "get",
    "summary": "Get police events",
    "description": "Returns recent police events from Polisen.se. Filter by event type and location.",
    "category": "Government & Safety",
    "parameters": [
      {
        "name": "type",
        "in": "query",
        "required": false,
        "description": "Event type filter (e.g. Trafikolycka, Stöld, Misshandel)"
      },
      {
        "name": "location",
        "in": "query",
        "required": false,
        "description": "Location name filter (e.g. Stockholm, Göteborg)"
      },
      {
        "name": "limit",
        "in": "query",
        "required": false,
        "description": "Max results to return"
      }
    ]
  },
  {
    "path": "/v1/police/stations",
    "method": "get",
    "summary": "List police stations",
    "description": "Returns police stations from Polisen, optionally filtered by location.",
    "category": "Government & Safety",
    "parameters": [
      {
        "name": "location",
        "in": "query",
        "required": false,
        "description": "Filter by location (e.g. Stockholm)"
      },
      {
        "name": "offset",
        "in": "query",
        "required": false,
        "description": "Pagination offset"
      },
      {
        "name": "limit",
        "in": "query",
        "required": false,
        "description": "Page size"
      }
    ]
  },
  {
    "path": "/v1/police/wanted",
    "method": "get",
    "summary": "Wanted persons list",
    "description": "Returns the list of wanted persons from Polisen.",
    "category": "Government & Safety",
    "parameters": []
  },
  {
    "path": "/v1/crisis/news",
    "method": "get",
    "summary": "Get crisis news articles",
    "description": "Returns recent crisis-related news from Krisinformation.se (MSB). Filter by number of days to look back.",
    "category": "Government & Safety",
    "parameters": [
      {
        "name": "days",
        "in": "query",
        "required": false,
        "description": "Number of days to look back"
      },
      {
        "name": "limit",
        "in": "query",
        "required": false,
        "description": "Max results to return"
      }
    ]
  },
  {
    "path": "/v1/crisis/vmas",
    "method": "get",
    "summary": "Get active VMA emergency alerts",
    "description": "Returns currently active Important Public Announcements (Viktigt Meddelande till Allmänheten) from Krisinformation.se.",
    "category": "Government & Safety",
    "parameters": []
  },
  {
    "path": "/v1/elections",
    "method": "get",
    "summary": "Get election results",
    "description": "Returns Swedish election results and voting statistics.",
    "category": "Government & Safety",
    "parameters": []
  },
  {
    "path": "/v1/crime",
    "method": "get",
    "summary": "National crime summary",
    "description": "Returns national crime statistics summary from BRÅ.",
    "category": "Government & Safety",
    "parameters": []
  },
  {
    "path": "/v1/jobs/search",
    "method": "get",
    "summary": "Search job listings",
    "description": "Search the Swedish job market via JobTech (Arbetsförmedlingen). Returns matching job listings with employer, location, and description.",
    "category": "Jobs & Labor Market",
    "parameters": [
      {
        "name": "q",
        "in": "query",
        "required": true,
        "description": "Search query (min 2 characters)"
      },
      {
        "name": "limit",
        "in": "query",
        "required": false,
        "description": "Max results to return"
      },
      {
        "name": "municipality",
        "in": "query",
        "required": false,
        "description": "Municipality filter"
      }
    ]
  },
  {
    "path": "/v1/taxonomy/autocomplete",
    "method": "get",
    "summary": "Autocomplete taxonomy concepts",
    "description": "Typeahead search across all taxonomy concepts. Returns matching occupations, skills, and other concepts as you type. Useful for building search UIs, job boards, and CV tools.",
    "category": "Jobs & Labor Market",
    "parameters": [
      {
        "name": "q",
        "in": "query",
        "required": true,
        "description": "Text to autocomplete (minimum 1 character)"
      },
      {
        "name": "type",
        "in": "query",
        "required": false,
        "description": "Restrict to a concept type (e.g., occupation-name, skill)"
      },
      {
        "name": "limit",
        "in": "query",
        "required": false,
        "description": "Max suggestions"
      }
    ]
  },
  {
    "path": "/v1/taxonomy/concepts",
    "method": "get",
    "summary": "Search taxonomy concepts",
    "description": "Search concepts of a given type from the Swedish labour market taxonomy. Includes occupations, skills, SSYK codes, municipalities, regions, languages, and more.",
    "category": "Jobs & Labor Market",
    "parameters": [
      {
        "name": "type",
        "in": "query",
        "required": true,
        "description": "Concept type (e.g., occupation-name, skill)"
      },
      {
        "name": "q",
        "in": "query",
        "required": false,
        "description": "Text search query"
      },
      {
        "name": "limit",
        "in": "query",
        "required": false,
        "description": "Max results"
      },
      {
        "name": "offset",
        "in": "query",
        "required": false,
        "description": "Pagination offset"
      }
    ]
  },
  {
    "path": "/v1/taxonomy/types",
    "method": "get",
    "summary": "List taxonomy concept types",
    "description": "Returns all available concept types from the JobTech Taxonomy (e.g., occupation-name, skill, ssyk-level-4, municipality).",
    "category": "Jobs & Labor Market",
    "parameters": []
  },
  {
    "path": "/v1/library/search",
    "method": "get",
    "summary": "Search the national library catalog",
    "description": "Search LIBRIS, Sweden's national library catalog. Returns books with title, authors, ISBN, and publisher.",
    "category": "Culture & Media",
    "parameters": [
      {
        "name": "q",
        "in": "query",
        "required": true,
        "description": "Search query (min 2 characters)"
      },
      {
        "name": "limit",
        "in": "query",
        "required": false,
        "description": "Max results to return"
      }
    ]
  },
  {
    "path": "/v1/open-data",
    "method": "get",
    "summary": "Search open data catalog",
    "description": "Search Sweden's open data catalog (dataportal.se).",
    "category": "Telecom & Data",
    "parameters": [
      {
        "name": "q",
        "in": "query",
        "required": false,
        "description": "Search query"
      },
      {
        "name": "limit",
        "in": "query",
        "required": false,
        "description": "Max results"
      }
    ]
  },
  {
    "path": "/v1/tourism",
    "method": "get",
    "summary": "Tourism statistics",
    "description": "Returns tourism statistics — guest nights, visitors, etc.",
    "category": "Tourism",
    "parameters": [
      {
        "name": "year",
        "in": "query",
        "required": false,
        "description": "Filter by year"
      }
    ]
  },
  {
    "path": "/v1/destinations",
    "method": "get",
    "summary": "Search Swedish tourism destinations",
    "description": "Search hotels, events, restaurants, attractions, and tours from Visit Sweden. Free public API, no key required upstream.",
    "category": "Tourism",
    "parameters": [
      {
        "name": "type",
        "in": "query",
        "required": false,
        "description": "Schema.org type filter"
      },
      {
        "name": "q",
        "in": "query",
        "required": false,
        "description": "Text search query"
      },
      {
        "name": "limit",
        "in": "query",
        "required": false,
        "description": "Max results"
      },
      {
        "name": "offset",
        "in": "query",
        "required": false,
        "description": "Pagination offset"
      }
    ]
  },
  {
    "path": "/v1/destinations/types",
    "method": "get",
    "summary": "List available destination types",
    "description": "Returns the 5 available Schema.org destination types with labels.",
    "category": "Tourism",
    "parameters": []
  },
  {
    "path": "/v1/telecom/operator",
    "method": "get",
    "summary": "Look up telecom operator",
    "description": "Identifies the telecom operator for a Swedish phone number using PTS data. Provide an area code and subscriber number.",
    "category": "Telecom & Data",
    "parameters": [
      {
        "name": "area_code",
        "in": "query",
        "required": true,
        "description": "Area code (e.g., '8' for Stockholm)"
      },
      {
        "name": "number",
        "in": "query",
        "required": true,
        "description": "Subscriber number (e.g., '6785500')"
      }
    ]
  },
  {
    "path": "/v1/telecom/wireless",
    "method": "get",
    "summary": "Check wireless frequency availability",
    "description": "Checks wireless audio frequency availability at a given location in Sweden. Returns available frequency bands and channels.",
    "category": "Telecom & Data",
    "parameters": [
      {
        "name": "lat",
        "in": "query",
        "required": true,
        "description": "WGS84 latitude"
      },
      {
        "name": "lon",
        "in": "query",
        "required": true,
        "description": "WGS84 longitude"
      },
      {
        "name": "freq",
        "in": "query",
        "required": true,
        "description": "Frequency in MHz"
      },
      {
        "name": "indoor",
        "in": "query",
        "required": false,
        "description": "Indoor use"
      }
    ]
  },
  {
    "path": "/v1/energy",
    "method": "get",
    "summary": "Get energy statistics",
    "description": "Returns energy production, consumption, and mix data.",
    "category": "Economy & Finance",
    "parameters": []
  },
  {
    "path": "/v1/geology/boreholes",
    "method": "get",
    "summary": "Get borehole data",
    "description": "Returns geological borehole data from SGU.",
    "category": "Environment & Nature",
    "parameters": [
      {
        "name": "lat",
        "in": "query",
        "required": true,
        "description": "Latitude"
      },
      {
        "name": "lon",
        "in": "query",
        "required": true,
        "description": "Longitude"
      }
    ]
  },
  {
    "path": "/v1/bathing",
    "method": "get",
    "summary": "Get bathing sites",
    "description": "Returns bathing site locations and water quality classifications.",
    "category": "Environment & Nature",
    "parameters": [
      {
        "name": "lat",
        "in": "query",
        "required": false,
        "description": "Latitude"
      },
      {
        "name": "lon",
        "in": "query",
        "required": false,
        "description": "Longitude"
      },
      {
        "name": "limit",
        "in": "query",
        "required": false,
        "description": "Max results"
      }
    ]
  },
  {
    "path": "/v1/heritage/search",
    "method": "get",
    "summary": "Search cultural heritage objects",
    "description": "Searches 12M+ cultural heritage objects from 45+ Swedish institutions via K-samsök (SOCH).",
    "category": "Culture & Media",
    "parameters": [
      {
        "name": "q",
        "in": "query",
        "required": true,
        "description": "Search query"
      },
      {
        "name": "offset",
        "in": "query",
        "required": false,
        "description": "Pagination offset"
      },
      {
        "name": "limit",
        "in": "query",
        "required": false,
        "description": "Page size"
      }
    ]
  },
  {
    "path": "/v1/museum/search",
    "method": "get",
    "summary": "Search museum collections",
    "description": "Searches millions of digitized objects from Swedish museums via Digitalt Museum.",
    "category": "Culture & Media",
    "parameters": [
      {
        "name": "q",
        "in": "query",
        "required": true,
        "description": "Search query"
      },
      {
        "name": "offset",
        "in": "query",
        "required": false,
        "description": "Pagination offset"
      },
      {
        "name": "limit",
        "in": "query",
        "required": false,
        "description": "Page size"
      }
    ]
  },
  {
    "path": "/v1/nutrition/foods",
    "method": "get",
    "summary": "Search food nutritional data",
    "description": "Search the Swedish food composition database (Livsmedelsverket). Returns energy, macronutrients, and food group.",
    "category": "Health & Medicine",
    "parameters": [
      {
        "name": "q",
        "in": "query",
        "required": true,
        "description": "Food name to search for (min 2 characters)"
      },
      {
        "name": "limit",
        "in": "query",
        "required": false,
        "description": "Max results to return"
      }
    ]
  },
  {
    "path": "/v1/hydrology",
    "method": "get",
    "summary": "Get water levels and discharge",
    "description": "Returns water levels and discharge data from SMHI hydrological stations.",
    "category": "Environment & Nature",
    "parameters": [
      {
        "name": "lat",
        "in": "query",
        "required": false,
        "description": "Latitude"
      },
      {
        "name": "lon",
        "in": "query",
        "required": false,
        "description": "Longitude"
      }
    ]
  },
  {
    "path": "/v1/ocean",
    "method": "get",
    "summary": "Get ocean observations",
    "description": "Returns sea temperature, salinity, and wave data from SMHI.",
    "category": "Environment & Nature",
    "parameters": [
      {
        "name": "lat",
        "in": "query",
        "required": false,
        "description": "Latitude"
      },
      {
        "name": "lon",
        "in": "query",
        "required": false,
        "description": "Longitude"
      }
    ]
  },
  {
    "path": "/v1/power-grid",
    "method": "get",
    "summary": "Get power grid status",
    "description": "Returns electricity grid status, load, and frequency from Svenska Kraftnät.",
    "category": "Telecom & Data",
    "parameters": []
  },
  {
    "path": "/v1/contaminated-sites/search",
    "method": "get",
    "summary": "Search contaminated sites",
    "description": "Searches for contaminated sites, optionally filtered by municipality.",
    "category": "Environment & Nature",
    "parameters": [
      {
        "name": "municipality",
        "in": "query",
        "required": false,
        "description": "Filter by municipality name"
      },
      {
        "name": "q",
        "in": "query",
        "required": false,
        "description": "Search query"
      }
    ]
  },
  {
    "path": "/v1/agriculture",
    "method": "get",
    "summary": "Get agriculture and pest alerts",
    "description": "Returns pest alerts and agricultural forecasts from Jordbruksverket.",
    "category": "Environment & Nature",
    "parameters": []
  },
  {
    "path": "/v1/companies/{orgNumber}",
    "method": "get",
    "summary": "Get Swedish company details",
    "description": "Looks up a Swedish company by organisation number via Bolagsverket with SCB enrichment/fallback.",
    "category": "Business & Companies",
    "guidance": {
      "whenToUse": "Use lookup when you already have a Swedish organisation number and need company details or enrichment.",
      "workflow": [
        "If the user only has a company name, call /v1/companies/search once first.",
        "Cache the returned org_number and use this lookup endpoint for repeated enrichment."
      ],
      "constraints": [
        "orgNumber must be a real 10-digit Swedish organisation number; hyphens are accepted.",
        "Test keys return sandbox company records; live keys are required for real company data."
      ],
      "avoid": [
        "Do not guess board, officer, owner, UBO, or other company subresource paths; they are not exposed as Apiverket company endpoints.",
        "Do not use search repeatedly when an org_number is already known."
      ],
      "quotaNotes": [
        "Live organisation-number lookup has its own Free allowance of 100/day.",
        "Paid tiers use the regular daily API quota as the practical company lookup limit.",
        "Call govdata_account to inspect remaining company-lookup quota and reset time."
      ]
    },
    "parameters": [
      {
        "name": "orgNumber",
        "in": "path",
        "required": true,
        "description": "10-digit Swedish organisation number. Hyphenated format is accepted."
      }
    ]
  },
  {
    "path": "/v1/companies/search",
    "method": "get",
    "summary": "Search Swedish companies",
    "description": "Searches Swedish companies by name or organisation number via SCB Företagsregister.",
    "category": "Business & Companies",
    "guidance": {
      "whenToUse": "Use search only to discover a company when the user has a name or uncertain organisation number.",
      "workflow": [
        "Search once with a company name or partial name.",
        "Save the returned org_number.",
        "Use /v1/companies/{orgNumber} for repeated lookups, enrichment jobs, and automation."
      ],
      "constraints": [
        "q must be at least 2 characters.",
        "Test keys return sandbox company search data; live keys are required for real company results."
      ],
      "avoid": [
        "Do not retry company search in a loop after a 429; pause until reset_at.",
        "Do not use search as a bulk enrichment endpoint when org_number is already known."
      ],
      "quotaNotes": [
        "Company search has a separate daily quota: Free 20/day, Starter 100/day, Pro 500/day, Business 2000/day, Enterprise 10000/day.",
        "Call govdata_account to inspect the current key tier, remaining company-search quota, company-lookup quota, and reset time."
      ],
      "upgradeTrigger": "If the user needs more daily company discovery/search volume, suggest upgrading from Free to a paid tier."
    },
    "parameters": [
      {
        "name": "q",
        "in": "query",
        "required": true,
        "description": "Company name search term (min 2 characters, substring match)"
      },
      {
        "name": "limit",
        "in": "query",
        "required": false,
        "description": "Max results to return"
      },
      {
        "name": "offset",
        "in": "query",
        "required": false,
        "description": "Pagination offset"
      }
    ]
  },
  {
    "path": "/v1/environment/emissions",
    "method": "get",
    "summary": "CO2 emissions data",
    "description": "Returns environmental emissions data from SCB/Naturvårdsverket.",
    "category": "Environment & Nature",
    "parameters": []
  },
  {
    "path": "/v1/environment/flood-risk",
    "method": "get",
    "summary": "Get flood risk assessment",
    "description": "Returns flood risk assessment for a geographic location.",
    "category": "Environment & Nature",
    "parameters": [
      {
        "name": "lat",
        "in": "query",
        "required": true,
        "description": "Latitude"
      },
      {
        "name": "lon",
        "in": "query",
        "required": true,
        "description": "Longitude"
      }
    ]
  },
  {
    "path": "/v1/environment/protected-areas",
    "method": "get",
    "summary": "Search protected nature areas",
    "description": "Returns protected areas (nature reserves, national parks, etc.) from Naturvårdsverket. Filter by municipality or type.",
    "category": "Environment & Nature",
    "parameters": [
      {
        "name": "municipality",
        "in": "query",
        "required": false,
        "description": "Filter by municipality name"
      },
      {
        "name": "type",
        "in": "query",
        "required": false,
        "description": "Filter by area type (e.g. Naturreservat, Nationalpark)"
      },
      {
        "name": "limit",
        "in": "query",
        "required": false,
        "description": "Max results to return"
      }
    ]
  },
  {
    "path": "/v1/gdp",
    "method": "get",
    "summary": "GDP data",
    "description": "Returns GDP data from SCB.",
    "category": "Economy & Finance",
    "parameters": [
      {
        "name": "year",
        "in": "query",
        "required": false,
        "description": "Filter by year"
      }
    ]
  },
  {
    "path": "/v1/geo/elevation",
    "method": "get",
    "summary": "Get elevation data",
    "description": "Returns elevation in meters above sea level for a WGS84 coordinate from Lantmäteriet Markhöjd Direkt.",
    "category": "Geography",
    "parameters": [
      {
        "name": "lat",
        "in": "query",
        "required": true,
        "description": "WGS84 latitude within Sweden"
      },
      {
        "name": "lon",
        "in": "query",
        "required": true,
        "description": "WGS84 longitude within Sweden"
      }
    ]
  },
  {
    "path": "/v1/geo/place-names/search",
    "method": "get",
    "summary": "Search Swedish place names",
    "description": "Returns official Swedish place names from Lantmäteriet Ortnamn Direkt.",
    "category": "Geography",
    "parameters": [
      {
        "name": "q",
        "in": "query",
        "required": true,
        "description": "Place name query, at least 2 characters"
      },
      {
        "name": "limit",
        "in": "query",
        "required": false,
        "description": "Maximum number of place names to return, 1 to 50"
      },
      {
        "name": "municipality_code",
        "in": "query",
        "required": false,
        "description": "Four-digit municipality code"
      },
      {
        "name": "county_code",
        "in": "query",
        "required": false,
        "description": "Two-digit county code"
      },
      {
        "name": "type",
        "in": "query",
        "required": false,
        "description": "Lantmäteriet place-name type, for example Tätort or Bebyggelse"
      },
      {
        "name": "language",
        "in": "query",
        "required": false,
        "description": "Place-name language, for example Svenska"
      }
    ]
  },
  {
    "path": "/v1/geo/place-names/references",
    "method": "get",
    "summary": "Find Swedish place-name references",
    "description": "Returns place-name ids and names from Lantmäteriet Ortnamn Direkt.",
    "category": "Geography",
    "parameters": [
      {
        "name": "q",
        "in": "query",
        "required": true,
        "description": "Place name query, at least 2 characters"
      },
      {
        "name": "limit",
        "in": "query",
        "required": false,
        "description": "Maximum number of references to return, 1 to 50"
      }
    ]
  },
  {
    "path": "/v1/geo/place-names/{id}",
    "method": "get",
    "summary": "Get Swedish place name by id",
    "description": "Returns one official Swedish place name from Lantmäteriet Ortnamn Direkt.",
    "category": "Geography",
    "parameters": [
      {
        "name": "id",
        "in": "path",
        "required": true,
        "description": "Lantmäteriet place-name id"
      }
    ]
  },
  {
    "path": "/v1/geo/municipalities",
    "method": "get",
    "summary": "List Swedish municipalities",
    "description": "Returns Swedish municipalities from Lantmäteriet Kommun, Län och Rike Direkt.",
    "category": "Geography",
    "parameters": [
      {
        "name": "limit",
        "in": "query",
        "required": false,
        "description": "Maximum number of municipalities to return, 1 to 290"
      },
      {
        "name": "include_geometry",
        "in": "query",
        "required": false,
        "description": "Set to true to include raw GeoJSON geometry"
      }
    ]
  },
  {
    "path": "/v1/geo/municipalities/{code}",
    "method": "get",
    "summary": "Get Swedish municipality by code",
    "description": "Returns one Swedish municipality by four-digit municipality code from Lantmäteriet.",
    "category": "Geography",
    "parameters": [
      {
        "name": "code",
        "in": "path",
        "required": true,
        "description": "Four-digit municipality code"
      },
      {
        "name": "include_geometry",
        "in": "query",
        "required": false,
        "description": "Set to true to include raw GeoJSON geometry"
      }
    ]
  },
  {
    "path": "/v1/geo/counties",
    "method": "get",
    "summary": "List Swedish counties",
    "description": "Returns Swedish counties from Lantmäteriet Kommun, Län och Rike Direkt.",
    "category": "Geography",
    "parameters": [
      {
        "name": "limit",
        "in": "query",
        "required": false,
        "description": "Maximum number of counties to return, 1 to 21"
      },
      {
        "name": "include_geometry",
        "in": "query",
        "required": false,
        "description": "Set to true to include raw GeoJSON geometry"
      }
    ]
  },
  {
    "path": "/v1/geo/counties/{code}",
    "method": "get",
    "summary": "Get Swedish county by code",
    "description": "Returns one Swedish county by two-digit county code from Lantmäteriet.",
    "category": "Geography",
    "parameters": [
      {
        "name": "code",
        "in": "path",
        "required": true,
        "description": "Two-digit county code"
      },
      {
        "name": "include_geometry",
        "in": "query",
        "required": false,
        "description": "Set to true to include raw GeoJSON geometry"
      }
    ]
  },
  {
    "path": "/v1/geo/country",
    "method": "get",
    "summary": "Get Sweden country boundary metadata",
    "description": "Returns Sweden as an administrative country object from Lantmäteriet.",
    "category": "Geography",
    "parameters": [
      {
        "name": "include_geometry",
        "in": "query",
        "required": false,
        "description": "Set to true to include raw GeoJSON geometry"
      }
    ]
  },
  {
    "path": "/v1/names",
    "method": "get",
    "summary": "Search Swedish name statistics",
    "description": "Returns popularity and trends for given names in Sweden.",
    "category": "Demographics & Municipalities",
    "parameters": [
      {
        "name": "q",
        "in": "query",
        "required": true,
        "description": "Name to search"
      }
    ]
  },
  {
    "path": "/v1/parental-leave",
    "method": "get",
    "summary": "Parental leave statistics",
    "description": "Returns parental leave statistics from Försäkringskassan.",
    "category": "Social Insurance",
    "parameters": []
  },
  {
    "path": "/v1/public-health",
    "method": "get",
    "summary": "Get public health statistics",
    "description": "Returns public health surveillance data from Folkhälsomyndigheten.",
    "category": "Health & Medicine",
    "parameters": []
  },
  {
    "path": "/v1/radio/channels",
    "method": "get",
    "summary": "List Sveriges Radio channels",
    "description": "Returns Sveriges Radio channels.",
    "category": "Culture & Media",
    "parameters": [
      {
        "name": "limit",
        "in": "query",
        "required": false,
        "description": "Max results to return"
      }
    ]
  },
  {
    "path": "/v1/radio/programs",
    "method": "get",
    "summary": "Search Sveriges Radio programs",
    "description": "Searches Sveriges Radio programs by name.",
    "category": "Culture & Media",
    "parameters": [
      {
        "name": "q",
        "in": "query",
        "required": true,
        "description": "Program name to search for (min 2 characters)"
      },
      {
        "name": "limit",
        "in": "query",
        "required": false,
        "description": "Max results to return"
      }
    ]
  },
  {
    "path": "/v1/vat/validate/{vatNumber}",
    "method": "get",
    "summary": "Validate an EU VAT number",
    "description": "Checks whether a VAT number is valid using the EU VIES service.",
    "category": "Business & Companies",
    "parameters": [
      {
        "name": "vatNumber",
        "in": "path",
        "required": true,
        "description": "EU VAT number including country prefix (e.g. SE556703614301)"
      }
    ]
  },
  {
    "path": "/v1/water-quality/stations",
    "method": "get",
    "summary": "Water quality monitoring stations",
    "description": "Returns a list of water quality monitoring stations.",
    "category": "Environment & Nature",
    "parameters": [
      {
        "name": "lat",
        "in": "query",
        "required": false,
        "description": "Latitude"
      },
      {
        "name": "lon",
        "in": "query",
        "required": false,
        "description": "Longitude"
      }
    ]
  }
];

export function getCategories(): string[] {
  return [...new Set(ENDPOINTS.map((e) => e.category))].sort();
}

export function searchEndpoints(query: string): Endpoint[] {
  const lower = query.toLowerCase();
  const compact = lower.endsWith("y") ? lower.slice(0, -1) + "ies" : lower.replace(/s$/, "");
  return ENDPOINTS.filter((e) => {
    const haystack = [
      e.summary,
      e.description,
      e.path,
      e.category,
      ...e.parameters.flatMap((param) => [param.name, param.description]),
      e.guidance?.whenToUse,
      ...(e.guidance?.workflow ?? []),
      ...(e.guidance?.constraints ?? []),
      ...(e.guidance?.avoid ?? []),
      ...(e.guidance?.quotaNotes ?? []),
      ...(e.guidance?.examples ?? []),
      ...(e.guidance?.recovery ?? []),
      e.guidance?.upgradeTrigger,
    ].filter(Boolean).join(" ").toLowerCase();

    return haystack.includes(lower) || (compact !== lower && haystack.includes(compact));
  });
}

export function getEndpointsByCategory(category: string): Endpoint[] {
  const lower = category.toLowerCase();
  return ENDPOINTS.filter((e) => e.category.toLowerCase().includes(lower));
}
