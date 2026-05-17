import type { IntegrationTool } from "../../../worker/integrations/base";

function composioTool(
  partial: Omit<IntegrationTool, "integration" | "inputSchema" | "accessLevel" | "tags" | "whenToUse" | "askBefore" | "safeDefaults" | "examples" | "followups" | "requiresScopes" | "idempotent" | "supportsBatch" | "supportsDryRun" | "execution"> & {
    accessLevel?: IntegrationTool["accessLevel"];
    tags?: string[];
    whenToUse?: string[];
    askBefore?: string[];
    safeDefaults?: Record<string, unknown>;
    examples?: IntegrationTool["examples"];
    requiresScopes?: string[];
    idempotent?: boolean;
    supportsDryRun?: boolean;
    supportsBatch?: boolean;
    toolSlug: string;
  },
): IntegrationTool {
  return {
    integration: "google-maps",
    name: partial.name,
    description: partial.description,
    inputSchema: { type: "object", properties: {} },
    outputSchema: partial.outputSchema,
    accessLevel: partial.accessLevel ?? partial.mode,
    mode: partial.mode,
    risk: partial.risk,
    tags: partial.tags ?? [],
    whenToUse: partial.whenToUse ?? [],
    askBefore: partial.askBefore ?? [],
    safeDefaults: partial.safeDefaults ?? {},
    examples: partial.examples ?? [],
    followups: [],
    requiresScopes: partial.requiresScopes ?? [],
    idempotent: partial.idempotent ?? partial.mode === "read",
    supportsDryRun: partial.supportsDryRun ?? false,
    supportsBatch: partial.supportsBatch ?? false,
    execution: {
      kind: "composio_tool",
      toolkit: "google_maps",
      toolSlug: partial.toolSlug,
      version: "20260506_00",
    },
  };
}

export const googleMapsComposioTools: IntegrationTool[] = [
  composioTool({
    name: "google_maps_autocomplete",
    description: "Returns place and query predictions for text input. Use when implementing as-you-type autocomplete functionality for place searches. Returns up to five predictions ordered by relevance.",
    toolSlug: "GOOGLE_MAPS_AUTOCOMPLETE",
    mode: "read",
    risk: "safe",
    tags: [
      "composio",
      "google-maps",
      "read",
      "places_search_details",
    ],
  }),
  composioTool({
    name: "google_maps_compute_route_matrix",
    description: "Calculates travel distance and duration matrix between multiple origins and destinations using the modern Routes API; supports OAuth2 authentication and various travel modes. Matrix is capped at 625 elements (e.g., 25×25); chunk larger sets to avoid RESOURCE_EXHAUSTED errors. Response elements may be returned out of input order — always use originIndex and destinationIndex to map results. Only use elements where condition='ROUTE_EXISTS'; the matrix may be incomplete.",
    toolSlug: "GOOGLE_MAPS_COMPUTE_ROUTE_MATRIX",
    mode: "read",
    risk: "safe",
    tags: [
      "composio",
      "google-maps",
      "read",
    ],
  }),
  composioTool({
    name: "google_maps_geocode_address_with_query",
    description: "Tool to map addresses to geographic coordinates with query parameter. Use when you need to convert a textual address into latitude/longitude coordinates using the modern v4beta API. Results may match multiple places — always verify `formattedAddress`, `region`, and `addressComponents` in the response before using returned coordinates.",
    toolSlug: "GOOGLE_MAPS_GEOCODE_ADDRESS_WITH_QUERY",
    mode: "read",
    risk: "safe",
    tags: [
      "composio",
      "google-maps",
      "read",
      "geocoding_geolocation",
    ],
  }),
  composioTool({
    name: "google_maps_geocode_destinations",
    description: "Tool to perform destination lookup and return detailed destination information including primary place, containing places, sub-destinations, landmarks, entrances, and navigation points. Use when you need comprehensive destination data for an address, place ID, or geographic coordinates.",
    toolSlug: "GOOGLE_MAPS_GEOCODE_DESTINATIONS",
    mode: "read",
    risk: "safe",
    tags: [
      "composio",
      "google-maps",
      "read",
      "geocoding_geolocation",
    ],
  }),
  composioTool({
    name: "google_maps_geocode_location",
    description: "Tool to convert geographic coordinates (latitude and longitude) to human-readable addresses using reverse geocoding. Use when you need to find the address or place name for a given set of coordinates. A single coordinate pair may return multiple results; verify formattedAddress, region, and addressComponents before committing to a result.",
    toolSlug: "GOOGLE_MAPS_GEOCODE_LOCATION",
    mode: "read",
    risk: "safe",
    tags: [
      "composio",
      "google-maps",
      "read",
      "geocoding_geolocation",
    ],
  }),
  composioTool({
    name: "google_maps_geocode_place",
    description: "Tool to perform geocode lookup using a place identifier to retrieve address and coordinates. Use when you need to get detailed geographic information for a specific Google Place ID.",
    toolSlug: "GOOGLE_MAPS_GEOCODE_PLACE",
    mode: "read",
    risk: "safe",
    tags: [
      "composio",
      "google-maps",
      "read",
      "geocoding_geolocation",
    ],
  }),
  composioTool({
    name: "google_maps_geocoding_api",
    description: "Convert addresses into geographic coordinates (latitude and longitude) and vice versa (reverse geocoding), or get an address for a Place ID. Uses the Geocoding API v4 (v4beta) which supports OAuth2 authentication. Exactly one of `address`, `latlng`, or `place_id` must be provided per request; omitting all three or mixing incompatible combinations yields no useful results.",
    toolSlug: "GOOGLE_MAPS_GEOCODING_API",
    mode: "read",
    risk: "safe",
    tags: [
      "composio",
      "google-maps",
      "read",
      "google_maps",
      "geocoding",
      "location",
    ],
  }),
  composioTool({
    name: "google_maps_geolocate",
    description: "Tool to determine location based on cell towers and WiFi access points. Use when you need to find the geographic location of a device using network infrastructure data.",
    toolSlug: "GOOGLE_MAPS_GEOLOCATE",
    mode: "read",
    risk: "safe",
    tags: [
      "composio",
      "google-maps",
      "read",
      "geocoding_geolocation",
    ],
  }),
  composioTool({
    name: "google_maps_get_place_details",
    description: "Retrieves comprehensive details for a place using its resource name (places/{place_id} format). Use when you need detailed information about a specific place.",
    toolSlug: "GOOGLE_MAPS_GET_PLACE_DETAILS",
    mode: "read",
    risk: "safe",
    tags: [
      "composio",
      "google-maps",
      "read",
      "places_search_details",
    ],
  }),
  composioTool({
    name: "google_maps_get_route",
    description: "Calculates one or more routes between two specified locations. Uses various travel modes and preferences; addresses must be resolvable by Google Maps. Response `duration` is a string with 's' suffix (e.g., `\"4557s\"`); parse before displaying.",
    toolSlug: "GOOGLE_MAPS_GET_ROUTE",
    mode: "read",
    risk: "safe",
    tags: [
      "composio",
      "google-maps",
      "read",
    ],
  }),
  composioTool({
    name: "google_maps_get2d_tile",
    description: "Tool to retrieve a 2D map tile image at specified coordinates for building custom map visualizations. Use when you need to download individual map tile images for roadmap, satellite, or terrain views. Requires a valid session token from the createSession endpoint.",
    toolSlug: "GOOGLE_MAPS_GET2D_TILE",
    mode: "read",
    risk: "safe",
    tags: [
      "composio",
      "google-maps",
      "read",
      "map_tiles_rendering",
    ],
  }),
  composioTool({
    name: "google_maps_get3d_tiles_root",
    description: "Tool to retrieve the 3D Tiles tileset root configuration for photorealistic 3D map rendering. Use when you need to initialize a 3D renderer with Google's photorealistic tiles following the OGC 3D Tiles specification. The Map Tiles API is billable per request; cache the root response client-side and avoid repeated calls.",
    toolSlug: "GOOGLE_MAPS_GET3D_TILES_ROOT",
    mode: "read",
    risk: "safe",
    tags: [
      "composio",
      "google-maps",
      "read",
      "map_tiles_rendering",
    ],
  }),
  composioTool({
    name: "google_maps_lookup_aerial_video",
    description: "Tool to look up an aerial view video by address or video ID. Returns video metadata including state and URIs for playback. Use when you need to retrieve a previously rendered aerial video or check the status of a video render request. Note that receiving a video is a billable event.",
    toolSlug: "GOOGLE_MAPS_LOOKUP_AERIAL_VIDEO",
    mode: "read",
    risk: "safe",
    tags: [
      "composio",
      "google-maps",
      "read",
      "aerial_imagery_videos",
    ],
  }),
  composioTool({
    name: "google_maps_maps_embed_api",
    description: "Tool to generate an embeddable Google Map URL and HTML iframe code. Use when you need to display a map (place, view, directions, street view, search) on a webpage without JavaScript. Note: This API only works with API keys (no OAuth2 support). It generates embed URLs and does not make direct API calls. Generated embed URLs are publicly accessible; avoid passing sensitive or internal location queries.",
    toolSlug: "GOOGLE_MAPS_MAPS_EMBED_API",
    mode: "read",
    risk: "safe",
    tags: [
      "composio",
      "google-maps",
      "read",
      "google_maps",
      "embed",
    ],
  }),
  composioTool({
    name: "google_maps_nearby_search",
    description: "Searches for places (e.g., restaurants, parks) within a specified circular area, with options to filter by place types and customize the returned fields and number of results.",
    toolSlug: "GOOGLE_MAPS_NEARBY_SEARCH",
    mode: "read",
    risk: "safe",
    tags: [
      "composio",
      "google-maps",
      "read",
    ],
  }),
  composioTool({
    name: "google_maps_place_photo",
    description: "Retrieves high quality photographic content from the Google Maps Places database. Use when you need to download a place photo using a photo_reference obtained from Place Details, Nearby Search, or Text Search requests. Images are scaled proportionally to fit within specified dimensions.",
    toolSlug: "GOOGLE_MAPS_PLACE_PHOTO",
    mode: "read",
    risk: "safe",
    tags: [
      "composio",
      "google-maps",
      "read",
      "places_search_details",
    ],
  }),
  composioTool({
    name: "google_maps_render_aerial_video",
    description: "Starts rendering an aerial view video for a US postal address. Returns a video ID that can be used with lookupVideo to retrieve the video once rendering completes. Rendering typically takes up to a few hours.",
    toolSlug: "GOOGLE_MAPS_RENDER_AERIAL_VIDEO",
    mode: "write",
    risk: "confirm",
    tags: [
      "composio",
      "google-maps",
      "write",
      "aerial_imagery_videos",
    ],
    askBefore: [
      "Confirm the parameters before executing Render Aerial Video.",
    ],
  }),
  composioTool({
    name: "google_maps_text_search",
    description: "Searches for places on Google Maps using a textual query (e.g., \"restaurants in London\", \"Eiffel Tower\"). Results may include CLOSED_PERMANENTLY or TEMPORARILY_CLOSED places — filter by businessStatus=OPERATIONAL. Include city/region and business type in textQuery to avoid empty or irrelevant results. Deduplicate using id or formattedAddress, not name alone. Throttle to ~1 req/s; OVER_QUERY_LIMIT (HTTP 429) requires exponential backoff.",
    toolSlug: "GOOGLE_MAPS_TEXT_SEARCH",
    mode: "read",
    risk: "safe",
    tags: [
      "composio",
      "google-maps",
      "read",
    ],
  }),
  composioTool({
    name: "google_maps_tiles_create_session",
    description: "Tool to create a session token required for accessing 2D Tiles and Street View imagery. Use when you need to initialize tile-based map rendering or street view display. The session token is valid for approximately two weeks and must be included in all subsequent tile requests. Each call consumes quota — cache and reuse the returned token across all tile requests within its validity window rather than creating a new session per request.",
    toolSlug: "GOOGLE_MAPS_TILES_CREATE_SESSION",
    mode: "write",
    risk: "confirm",
    tags: [
      "composio",
      "google-maps",
      "write",
      "map_tiles_rendering",
    ],
    askBefore: [
      "Confirm the parameters before executing Create Tiles Session.",
    ],
    idempotent: true,
  }),
];
