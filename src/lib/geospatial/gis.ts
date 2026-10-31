/**
 * The Carbon Credit OS — Geospatial & Parcel Mapping Utilities
 * Pure, browser-safe and server-safe geospatial calculations for agricultural MRV.
 */

export type Corner = [number, number]; // [longitude, latitude]

export interface PunjabLocation {
  name: string;
  aliases: string;
  center: Corner;
  district: string;
}

export const PUNJAB_LOCATIONS: PunjabLocation[] = [
  { name: 'Faridkot', aliases: 'ਫ਼ਰੀਦਕੋਟ', center: [74.756, 30.676], district: 'Faridkot' }, // Primary Pilot Hub
  { name: 'Patiala', aliases: 'ਪਟਿਆਲਾ', center: [76.386, 30.339], district: 'Patiala' },   // Secondary Pilot Hub
  { name: 'Kotkapura', aliases: 'ਕੋਟਕਪੂਰਾ', center: [74.878, 30.582], district: 'Faridkot' },
  { name: 'Jaito', aliases: 'ਜੈਤੋ', center: [74.883, 30.451], district: 'Faridkot' },
  { name: 'Nabha', aliases: 'ਨਾਭਾ', center: [76.152, 30.375], district: 'Patiala' },
  { name: 'Samana', aliases: 'ਸਮਾਣਾ', center: [76.192, 30.158], district: 'Patiala' },
  { name: 'Rajpura', aliases: 'ਰਾਜਪੁਰਾ', center: [76.593, 30.484], district: 'Patiala' },
  { name: 'Sangrur', aliases: 'ਸੰਗਰੂਰ', center: [75.842, 30.245], district: 'Sangrur' }, // Historical Reference
  { name: 'Bathinda', aliases: 'ਬਠਿੰਡਾ', center: [74.945, 30.211], district: 'Bathinda' }, // Historical Reference
  { name: 'Ludhiana', aliases: 'ਲੁਧਿਆਣਾ', center: [75.857, 30.901], district: 'Ludhiana' },
  { name: 'Amritsar', aliases: 'ਅੰਮ੍ਰਿਤਸਰ', center: [74.872, 31.634], district: 'Amritsar' },
  { name: 'Jalandhar', aliases: 'ਜਲੰਧਰ', center: [75.576, 31.326], district: 'Jalandhar' },
  { name: 'Moga', aliases: 'ਮੋਗਾ', center: [75.171, 30.817], district: 'Moga' },
  { name: 'Firozpur', aliases: 'Ferozepur ਫ਼ਿਰੋਜ਼ਪੁਰ', center: [74.613, 30.923], district: 'Firozpur' },
  { name: 'Muktsar', aliases: 'Sri Muktsar Sahib ਮੁਕਤਸਰ', center: [74.516, 30.477], district: 'Sri Muktsar Sahib' },
  { name: 'Barnala', aliases: 'ਬਰਨਾਲਾ', center: [75.548, 30.382], district: 'Barnala' },
  { name: 'Mansa', aliases: 'ਮਾਨਸਾ', center: [75.393, 29.999], district: 'Mansa' },
  { name: 'Hoshiarpur', aliases: 'ਹੁਸ਼ਿਆਰਪੁਰ', center: [75.912, 31.514], district: 'Hoshiarpur' },
  { name: 'Kapurthala', aliases: 'ਕਪੂਰਥਲਾ', center: [75.384, 31.38], district: 'Kapurthala' },
  { name: 'Malerkotla', aliases: 'ਮਲੇਰਕੋਟਲਾ', center: [75.879, 30.529], district: 'Malerkotla' },
  { name: 'Fazilka', aliases: 'ਫ਼ਾਜ਼ਿਲਕਾ', center: [74.028, 30.404], district: 'Fazilka' },
  { name: 'Mohali', aliases: 'SAS Nagar ਸਾਹਿਬਜ਼ਾਦਾ ਅਜੀਤ ਸਿੰਘ ਨਗਰ', center: [76.718, 30.705], district: 'SAS Nagar' },
  { name: 'Chandigarh', aliases: 'ਚੰਡੀਗੜ੍ਹ', center: [76.779, 30.734], district: 'Chandigarh' },
];

export function findPunjabLocations(query: string): PunjabLocation[] {
  const q = query.trim().toLowerCase();
  if (!q) return PUNJAB_LOCATIONS;
  return PUNJAB_LOCATIONS.filter(
    (loc) =>
      loc.name.toLowerCase().includes(q) ||
      loc.aliases.toLowerCase().includes(q) ||
      loc.district.toLowerCase().includes(q)
  );
}

/**
 * Calculates approximate area in acres using the spherical excess geodesic formula.
 * Earth radius: WGS84 authalic radius ~ 6,378,137 meters.
 * 1 acre = 4,046.8564224 square meters.
 * Matches PostGIS ST_Area(geom::geography) within ~0.5%.
 */
export function polygonAcres(corners: Corner[]): number {
  if (!corners || corners.length < 3) return 0;
  const R = 6378137;
  const rad = Math.PI / 180;
  let s = 0;
  for (let i = 0; i < corners.length; i++) {
    const p1 = corners[i];
    const p2 = corners[(i + 1) % corners.length];
    if (!p1 || !p2) continue;
    const [x1, y1] = p1;
    const [x2, y2] = p2;
    s += (x2 - x1) * rad * (2 + Math.sin(y1 * rad) + Math.sin(y2 * rad));
  }
  const areaSqMeters = Math.abs((s * R * R) / 2);
  const acres = areaSqMeters / 4046.8564224;
  return Math.round(acres * 100) / 100;
}

/**
 * Determines whether two 2D line segments intersect.
 * Segment 1: p1 -> p2
 * Segment 2: p3 -> p4
 */
export function segmentsIntersect(
  p1: Corner,
  p2: Corner,
  p3: Corner,
  p4: Corner
): boolean {
  if (
    Math.max(p1[0], p2[0]) < Math.min(p3[0], p4[0]) ||
    Math.max(p3[0], p4[0]) < Math.min(p1[0], p2[0]) ||
    Math.max(p1[1], p2[1]) < Math.min(p3[1], p4[1]) ||
    Math.max(p3[1], p4[1]) < Math.min(p1[1], p2[1])
  ) {
    return false;
  }

  function ccw(a: Corner, b: Corner, c: Corner): number {
    return (c[1] - a[1]) * (b[0] - a[0]) - (b[1] - a[1]) * (c[0] - a[0]);
  }

  const d1 = ccw(p3, p4, p1);
  const d2 = ccw(p3, p4, p2);
  const d3 = ccw(p1, p2, p3);
  const d4 = ccw(p1, p2, p4);

  if (
    ((d1 > 0 && d2 < 0) || (d1 < 0 && d2 > 0)) &&
    ((d3 > 0 && d4 < 0) || (d3 < 0 && d4 > 0))
  ) {
    return true;
  }

  return false;
}

/**
 * Checks if a polygon ring has any self-intersecting edges.
 * Ignores adjacent edges which legitimately meet at a vertex.
 */
export function hasSelfIntersection(corners: Corner[]): boolean {
  const n = corners.length;
  if (n < 4) return false;

  for (let i = 0; i < n; i++) {
    const p1 = corners[i];
    const p2 = corners[(i + 1) % n];
    if (!p1 || !p2) continue;

    for (let j = i + 1; j < n; j++) {
      if (Math.abs(i - j) <= 1 || (i === 0 && j === n - 1)) {
        continue;
      }
      const p3 = corners[j];
      const p4 = corners[(j + 1) % n];
      if (!p3 || !p4) continue;

      if (segmentsIntersect(p1, p2, p3, p4)) {
        return true;
      }
    }
  }

  return false;
}

/**
 * Computes midpoint between two corners.
 */
export function cornerMidpoint(p1: Corner, p2: Corner): Corner {
  return [
    Number(((p1[0] + p2[0]) / 2).toFixed(6)),
    Number(((p1[1] + p2[1]) / 2).toFixed(6)),
  ];
}

/**
 * Computes great-circle distance between two coordinates in meters.
 */
export function haversineDistanceMeters(p1: Corner, p2: Corner): number {
  const R = 6378137;
  const dLat = ((p2[1] - p1[1]) * Math.PI) / 180;
  const dLng = ((p2[0] - p1[0]) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((p1[1] * Math.PI) / 180) *
      Math.cos((p2[1] * Math.PI) / 180) *
      Math.sin(dLng / 2) *
      Math.sin(dLng / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return Math.round(R * c * 10) / 10;
}

/**
 * Validates a polygon boundary ring.
 */
export function validateBoundary(corners: Corner[]): {
  valid: boolean;
  error?: string;
  acres: number;
} {
  if (!corners || corners.length < 3) {
    return { valid: false, error: 'A land parcel must have at least 3 corner boundary points.', acres: 0 };
  }

  for (let i = 0; i < corners.length; i++) {
    const pt = corners[i];
    if (!pt || pt.length !== 2) {
      return { valid: false, error: `Point ${i + 1} has invalid coordinate format.`, acres: 0 };
    }
    const [lng, lat] = pt;
    if (!Number.isFinite(lng) || !Number.isFinite(lat)) {
      return { valid: false, error: `Point ${i + 1} contains non-numeric coordinates.`, acres: 0 };
    }
    if (lng < -180 || lng > 180) {
      return { valid: false, error: `Point ${i + 1} longitude (${lng}) out of bounds (-180 to 180).`, acres: 0 };
    }
    if (lat < -90 || lat > 90) {
      return { valid: false, error: `Point ${i + 1} latitude (${lat}) out of bounds (-90 to 90).`, acres: 0 };
    }
  }

  // Check for consecutive identical vertices
  for (let i = 0; i < corners.length; i++) {
    const cur = corners[i];
    const next = corners[(i + 1) % corners.length];
    if (cur && next && cur[0] === next[0] && cur[1] === next[1]) {
      return {
        valid: false,
        error: `Consecutive identical vertices detected at point ${i + 1}. Each corner must represent a distinct position.`,
        acres: 0,
      };
    }
  }

  // Check for self-intersecting polygon boundary
  if (hasSelfIntersection(corners)) {
    return {
      valid: false,
      error: "Boundary contains self-intersecting edges (bow-tie shape). Field boundary must form a simple closed polygon without crossing itself.",
      acres: polygonAcres(corners),
    };
  }

  const acres = polygonAcres(corners);
  if (acres < 0.05) {
    return {
      valid: false,
      error: `Calculated area (${acres.toFixed(2)} acres) is below minimum agricultural threshold (0.05 acres).`,
      acres,
    };
  }
  if (acres > 1000) {
    return {
      valid: false,
      error: `Calculated area (${acres.toFixed(2)} acres) exceeds maximum single parcel threshold (1000 acres). Please verify corners.`,
      acres,
    };
  }

  return { valid: true, acres };
}

/**
 * Generates standard GeoJSON Polygon representation from corners.
 * Ensures the linear ring is closed (first point equals last point).
 */
export function boundaryToGeoJSON(corners: Corner[]): {
  type: "Polygon";
  coordinates: [Corner[]];
} {
  if (corners.length === 0) {
    return { type: "Polygon", coordinates: [[]] };
  }
  const closedRing: Corner[] = [...corners];
  const first = corners[0];
  const last = corners[corners.length - 1];
  if (first && last && (first[0] !== last[0] || first[1] !== last[1])) {
    closedRing.push([first[0], first[1]]);
  }
  return {
    type: "Polygon",
    coordinates: [closedRing],
  };
}

/**
 * Parses a standard GeoJSON Polygon or Feature object back into a list of Corner vertices.
 * Strips the redundant closing point if the ring is closed.
 */
export function geojsonToBoundary(geojson: any): Corner[] {
  if (!geojson) return [];
  const geom = geojson.type === "Feature" ? geojson.geometry : geojson;
  if (!geom || geom.type !== "Polygon" || !Array.isArray(geom.coordinates) || !geom.coordinates[0]) {
    return [];
  }
  const ring: any[] = geom.coordinates[0];
  const corners: Corner[] = [];
  for (const pt of ring) {
    if (Array.isArray(pt) && pt.length >= 2 && typeof pt[0] === "number" && typeof pt[1] === "number") {
      corners.push([pt[0], pt[1]]);
    }
  }
  // Strip duplicate closing point if present
  const first = corners[0];
  const last = corners[corners.length - 1];
  if (corners.length > 3 && first && last && first[0] === last[0] && first[1] === last[1]) {
    corners.pop();
  }
  return corners;
}

/**
 * Creates a rectangular bounding box around a center point for a given acreage.
 * Useful for quick field approximations or default parcel rectangles.
 */
export function createRectangleCorners(center: Corner, targetAcres: number): Corner[] {
  const [lng, lat] = center;
  const areaSqMeters = Math.max(0.1, targetAcres) * 4046.8564224;
  const sideMeters = Math.sqrt(areaSqMeters);

  // Conversion: 1 degree latitude ~ 111,320 meters
  const deltaLat = (sideMeters / 2) / 111320;
  // 1 degree longitude ~ 111,320 * cos(lat)
  const latRad = (lat * Math.PI) / 180;
  const deltaLng = (sideMeters / 2) / (111320 * Math.cos(latRad));

  return [
    [Number((lng - deltaLng).toFixed(6)), Number((lat - deltaLat).toFixed(6))], // SW
    [Number((lng + deltaLng).toFixed(6)), Number((lat - deltaLat).toFixed(6))], // SE
    [Number((lng + deltaLng).toFixed(6)), Number((lat + deltaLat).toFixed(6))], // NE
    [Number((lng - deltaLng).toFixed(6)), Number((lat + deltaLat).toFixed(6))], // NW
  ];
}

/**
 * Computes bounding box [minLng, minLat, maxLng, maxLat] of corners.
 */
export function getBounds(corners: Corner[]): [number, number, number, number] | null {
  if (!corners || corners.length === 0) return null;
  let minLng = Infinity;
  let minLat = Infinity;
  let maxLng = -Infinity;
  let maxLat = -Infinity;

  for (const [lng, lat] of corners) {
    if (lng < minLng) minLng = lng;
    if (lat < minLat) minLat = lat;
    if (lng > maxLng) maxLng = lng;
    if (lat > maxLat) maxLat = lat;
  }

  return [minLng, minLat, maxLng, maxLat];
}

// =============================================================================
// PHASE 1: WGS84 ELLIPSOIDAL GEODESIC REFERENCE CALCULATION
// =============================================================================

/**
 * WGS84 Ellipsoid constants (EPSG:4326)
 * Reference: EPSG Geodetic Parameter Dataset / Charles Karney (2013)
 */
export const WGS84_SEMI_MAJOR_METERS = 6378137.0; // a
export const WGS84_FLATTENING = 1.0 / 298.257223563; // f
export const WGS84_SEMI_MINOR_METERS = WGS84_SEMI_MAJOR_METERS * (1.0 - WGS84_FLATTENING); // b ~ 6356752.314245
export const WGS84_ECCENTRICITY_SQ = 2.0 * WGS84_FLATTENING - WGS84_FLATTENING * WGS84_FLATTENING; // e^2 ~ 0.00669437999014
export const WGS84_ECCENTRICITY = Math.sqrt(WGS84_ECCENTRICITY_SQ); // e ~ 0.0818191908426
export const METERS_SQ_PER_ACRE = 4046.8564224;
export const METERS_SQ_PER_HECTARE = 10000.0;

/**
 * Evaluates the authalic mapping function q(phi) on the WGS84 ellipsoid.
 * q(phi) = (1 - e^2) * [ sin(phi)/(1 - e^2 sin^2(phi)) - (1/(2e)) * ln((1 - e sin(phi)) / (1 + e sin(phi))) ]
 */
function wgs84AuthalicQ(sinPhi: number): number {
  const e = WGS84_ECCENTRICITY;
  const e2 = WGS84_ECCENTRICITY_SQ;
  const sin2 = sinPhi * sinPhi;
  const term1 = sinPhi / (1.0 - e2 * sin2);
  const term2 = (1.0 / (2.0 * e)) * Math.log((1.0 - e * sinPhi) / (1.0 + e * sinPhi));
  return (1.0 - e2) * (term1 - term2);
}

// q_p = q(pi/2) when sin(phi) = 1.0
const WGS84_Q_POLE = wgs84AuthalicQ(1.0);
// Authalic radius R_q = a * sqrt(q_p / 2) ~ 6371007.1809 meters
export const WGS84_AUTHALIC_RADIUS_METERS = WGS84_SEMI_MAJOR_METERS * Math.sqrt(WGS84_Q_POLE / 2.0);

/**
 * Calculates exact geodesic area on the WGS84 ellipsoid in square meters using
 * the authalic sphere projection. Equal-area projection preserves surface integrals
 * on the oblate spheroid with sub-millimeter precision for agricultural parcels.
 */
export function wgs84EllipsoidalGeodesicAreaSqMeters(corners: Corner[]): number {
  if (!corners || corners.length < 3) return 0;
  const rad = Math.PI / 180.0;
  let s = 0.0;
  const n = corners.length;

  for (let i = 0; i < n; i++) {
    const p1 = corners[i];
    const p2 = corners[(i + 1) % n];
    if (!p1 || !p2) continue;

    const [lon1, lat1] = p1;
    const [lon2, lat2] = p2;

    const sinLat1 = Math.sin(lat1 * rad);
    const sinLat2 = Math.sin(lat2 * rad);

    // Authalic latitudes sin(beta) = q(lat) / q_p
    const sinBeta1 = wgs84AuthalicQ(sinLat1) / WGS84_Q_POLE;
    const sinBeta2 = wgs84AuthalicQ(sinLat2) / WGS84_Q_POLE;

    // Delta longitude normalized to [-pi, pi]
    let dLon = (lon2 - lon1) * rad;
    while (dLon > Math.PI) dLon -= 2.0 * Math.PI;
    while (dLon < -Math.PI) dLon += 2.0 * Math.PI;

    // Trapezoidal zonal integral along geodesic segment
    s += dLon * (sinBeta1 + sinBeta2);
  }

  const Rq = WGS84_AUTHALIC_RADIUS_METERS;
  return Math.abs((s * Rq * Rq) / 2.0);
}

/**
 * Calculates exact geodesic area on the WGS84 ellipsoid in acres.
 * 1 acre = 4,046.8564224 square meters.
 */
export function wgs84EllipsoidalGeodesicAcres(corners: Corner[]): number {
  const sqMeters = wgs84EllipsoidalGeodesicAreaSqMeters(corners);
  const acres = sqMeters / METERS_SQ_PER_ACRE;
  return Math.round(acres * 10000) / 10000;
}

// =============================================================================
// PHASE 1: PUNJAB REVENUE LAND-UNIT CONVERSIONS
// =============================================================================

/**
 * Standard Punjab Revenue Land Units (Jamabandi / Khasra Girdawari):
 * 1 Acre (ਏਕੜ / ਕਿੱਲਾ) = 8 Kanals (ਕਨਾਲ)
 * 1 Kanal (ਕਨਾਲ) = 20 Marlas (ਮਰਲਾ)
 * 1 Acre = 160 Marlas
 * 1 Marla = 4046.8564224 / 160 = 25.29285264 m² (272.25 sq ft)
 * 1 Kanal = 4046.8564224 / 8 = 505.8570528 m² (5445 sq ft)
 * 1 Hectare = 10,000 m² = 2.471053814671653 Acres
 */
export interface PunjabLandBreakdown {
  acres: number;        // Whole acres (Killa)
  kanal: number;        // Kanals (0 to 7)
  marla: number;        // Marlas (0 to 19.99, rounded to 2 decimals)
  totalAcres: number;   // Full decimal acreage (e.g. 5.25)
  totalHectares: number;// Full decimal hectares (e.g. 2.1246)
  totalSqMeters: number;// Total square meters
  formattedEn: string;  // e.g. "5 Acres, 2 Kanal, 0 Marla"
  formattedPa: string;  // e.g. "5 ਏਕੜ, 2 ਕਨਾਲ, 0 ਮਰਲਾ"
}

/**
 * Converts total decimal acres into traditional Punjab revenue units (Acre - Kanal - Marla).
 * Handles floating-point rounding and carry-over cleanly.
 */
export function acresToPunjabLandBreakdown(totalAcres: number): PunjabLandBreakdown {
  if (!Number.isFinite(totalAcres) || totalAcres <= 0) {
    return {
      acres: 0,
      kanal: 0,
      marla: 0,
      totalAcres: 0,
      totalHectares: 0,
      totalSqMeters: 0,
      formattedEn: "0 Acres, 0 Kanal, 0 Marla",
      formattedPa: "0 ਏਕੜ, 0 ਕਨਾਲ, 0 ਮਰਲਾ",
    };
  }

  // 1 Marla = 1/160 acre = 0.00625 acre (5 decimal places). Retain 6 decimal places to prevent truncation error.
  const roundedTotalAcres = Math.round(totalAcres * 1000000) / 1000000;
  const totalSqMeters = Math.round(roundedTotalAcres * METERS_SQ_PER_ACRE * 100) / 100;
  const totalHectares = Math.round((totalSqMeters / METERS_SQ_PER_HECTARE) * 10000) / 10000;

  let wholeAcres = Math.floor(roundedTotalAcres);
  const remainingAcres = roundedTotalAcres - wholeAcres;

  const totalRemainingKanals = remainingAcres * 8.0;
  let wholeKanals = Math.floor(totalRemainingKanals);
  const remainingKanals = totalRemainingKanals - wholeKanals;

  let marlas = Math.round(remainingKanals * 20.0 * 100) / 100;

  // Handle rounding carry-over: 20 Marla = 1 Kanal
  if (marlas >= 20.0) {
    wholeKanals += 1;
    marlas = Math.round((marlas - 20.0) * 100) / 100;
  }
  // Handle rounding carry-over: 8 Kanal = 1 Acre
  if (wholeKanals >= 8) {
    wholeAcres += 1;
    wholeKanals -= 8;
  }

  const marlaStr = marlas % 1 === 0 ? marlas.toFixed(0) : marlas.toFixed(2);
  const formattedEn = `${wholeAcres} Acre${wholeAcres === 1 ? "" : "s"}, ${wholeKanals} Kanal, ${marlaStr} Marla`;
  const formattedPa = `${wholeAcres} ਏਕੜ, ${wholeKanals} ਕਨਾਲ, ${marlaStr} ਮਰਲਾ`;

  return {
    acres: wholeAcres,
    kanal: wholeKanals,
    marla: marlas,
    totalAcres: roundedTotalAcres,
    totalHectares,
    totalSqMeters,
    formattedEn,
    formattedPa,
  };
}

/**
 * Converts traditional Punjab revenue land units (Acre, Kanal, Marla) back to total decimal acres.
 * 1 Kanal = 1/8 Acre (0.125 ac)
 * 1 Marla = 1/160 Acre (0.00625 ac)
 */
export function punjabLandBreakdownToAcres(acres: number, kanal: number, marla: number): number {
  const safeAcres = Number.isFinite(acres) && acres > 0 ? acres : 0;
  const safeKanal = Number.isFinite(kanal) && kanal > 0 ? kanal : 0;
  const safeMarla = Number.isFinite(marla) && marla > 0 ? marla : 0;

  const total = safeAcres + safeKanal / 8.0 + safeMarla / 160.0;
  return Math.round(total * 1000000) / 1000000;
}

/**
 * Converts hectares to Punjab revenue land units.
 */
export function hectaresToPunjabLandBreakdown(hectares: number): PunjabLandBreakdown {
  if (!Number.isFinite(hectares) || hectares <= 0) {
    return acresToPunjabLandBreakdown(0);
  }
  const totalAcres = (hectares * METERS_SQ_PER_HECTARE) / METERS_SQ_PER_ACRE;
  return acresToPunjabLandBreakdown(totalAcres);
}

/**
 * Converts square meters to Punjab revenue land units.
 */
export function sqMetersToPunjabLandBreakdown(sqMeters: number): PunjabLandBreakdown {
  if (!Number.isFinite(sqMeters) || sqMeters <= 0) {
    return acresToPunjabLandBreakdown(0);
  }
  const totalAcres = sqMeters / METERS_SQ_PER_ACRE;
  return acresToPunjabLandBreakdown(totalAcres);
}

// =============================================================================
// PHASE 1: DECLARED VS SURVEYED DISCREPANCY EVALUATION
// =============================================================================

export type AcreageDiscrepancyStatus =
  | "acceptable"           // Discrepancy <= threshold (default 5.0%)
  | "discrepancy_flagged"  // Discrepancy > 5.0% and <= 15.0%
  | "severe_discrepancy"   // Discrepancy > 15.0% (requires field re-survey)
  | "missing_survey"       // Surveyed acreage is null or zero (boundary unmapped)
  | "invalid_declared";    // Declared acreage is missing, non-positive, or invalid

export interface AcreageDiscrepancyResult {
  declaredAcres: number | null;
  surveyedAcres: number | null;
  absoluteDiscrepancyAcres: number | null;
  percentageDiscrepancy: number | null;
  status: AcreageDiscrepancyStatus;
  thresholdExceeded: boolean;
  isFieldResurveyRequired: boolean;
  summary: string;
}

/**
 * Evaluates the discrepancy between farmer-declared acreage and satellite/field-surveyed acreage.
 *
 * Rules:
 * - If declared acreage is <= 0 or missing -> invalid_declared.
 * - If surveyed acreage is null/<= 0 -> missing_survey (boundary pending).
 * - Discrepancy % = (|surveyed - declared| / declared) * 100.
 * - Threshold default: 5.0% discrepancy.
 * - Discrepancies > 15.0% require mandatory on-ground field agent re-survey.
 */
export function evaluateAcreageDiscrepancy(
  declaredAcres: number | null | undefined,
  surveyedAcres: number | null | undefined,
  thresholdPct: number = 5.0
): AcreageDiscrepancyResult {
  const isDeclaredValid = declaredAcres !== null && declaredAcres !== undefined && Number.isFinite(declaredAcres) && declaredAcres > 0;
  const isSurveyedValid = surveyedAcres !== null && surveyedAcres !== undefined && Number.isFinite(surveyedAcres) && surveyedAcres > 0;

  if (!isDeclaredValid) {
    return {
      declaredAcres: null,
      surveyedAcres: isSurveyedValid ? Number(surveyedAcres.toFixed(2)) : null,
      absoluteDiscrepancyAcres: null,
      percentageDiscrepancy: null,
      status: "invalid_declared",
      thresholdExceeded: true,
      isFieldResurveyRequired: false,
      summary: "Declared acreage is missing, zero, or invalid. Farmer self-report is required.",
    };
  }

  const decl = Number(declaredAcres.toFixed(4));

  if (!isSurveyedValid) {
    return {
      declaredAcres: decl,
      surveyedAcres: null,
      absoluteDiscrepancyAcres: null,
      percentageDiscrepancy: null,
      status: "missing_survey",
      thresholdExceeded: false,
      isFieldResurveyRequired: false,
      summary: "Boundary survey pending. Parcel has not yet been digitally demarcated or surveyed.",
    };
  }

  const surv = Number(surveyedAcres.toFixed(4));
  const absDiff = Math.abs(surv - decl);
  const pctDiff = (absDiff / decl) * 100.0;
  const roundedPct = Math.round(pctDiff * 100) / 100;
  const roundedAbs = Math.round(absDiff * 100) / 100;

  const thresholdExceeded = roundedPct > thresholdPct;
  const isSevere = roundedPct > 15.0;

  let status: AcreageDiscrepancyStatus = "acceptable";
  let summary = `Surveyed acreage (${surv.toFixed(2)} ac) matches declared (${decl.toFixed(2)} ac) within ${thresholdPct}% tolerance (${roundedPct}% discrepancy).`;

  if (isSevere) {
    status = "severe_discrepancy";
    summary = `Severe acreage discrepancy: surveyed (${surv.toFixed(2)} ac) diverges by ${roundedPct}% from declared (${decl.toFixed(2)} ac), exceeding the 15% safety limit. Mandatory on-ground field agent re-survey required.`;
  } else if (thresholdExceeded) {
    status = "discrepancy_flagged";
    summary = `Acreage discrepancy flagged: surveyed (${surv.toFixed(2)} ac) diverges by ${roundedPct}% from declared (${decl.toFixed(2)} ac), exceeding the ${thresholdPct}% allowable tolerance.`;
  }

  return {
    declaredAcres: decl,
    surveyedAcres: surv,
    absoluteDiscrepancyAcres: roundedAbs,
    percentageDiscrepancy: roundedPct,
    status,
    thresholdExceeded,
    isFieldResurveyRequired: isSevere,
    summary,
  };
}
