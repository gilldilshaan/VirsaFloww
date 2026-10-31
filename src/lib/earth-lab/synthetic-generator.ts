/**
 * The Carbon Credit OS — TCC Earth Intelligence Lab
 * Synthetic Punjab Parcel Generator (Phase 1)
 *
 * Deterministic generation of 1,000 synthetic agricultural test geometries across Punjab
 * with exact WGS84 authalic ellipsoidal geodesics and Punjab Revenue Land System breakdown.
 */

import {
  Corner,
  wgs84EllipsoidalGeodesicAreaSqMeters,
  wgs84EllipsoidalGeodesicAcres,
  acresToPunjabLandBreakdown,
  hasSelfIntersection,
  validateBoundary,
} from "../geospatial/gis";
import {
  SyntheticParcel,
  PunjabDistrict,
  ScenarioCategory,
  ParcelShapeProfile,
  InvalidGeometryTestCase,
} from "./types";

/**
 * Fast, deterministic Pseudo-Random Number Generator (Mulberry32).
 */
export class Mulberry32PRNG {
  private state: number;

  constructor(seed: number) {
    this.state = seed >>> 0;
  }

  next(): number {
    let t = (this.state += 0x6d2b79f5);
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  }

  range(min: number, max: number): number {
    return min + (max - min) * this.next();
  }

  choice<T>(arr: T[]): T {
    const idx = Math.min(Math.floor(this.next() * arr.length), arr.length - 1);
    return arr[idx]!;
  }
}

/**
 * Realistic agricultural sampling centroids and boundaries across target Punjab districts.
 * Carefully centered on agricultural belts, avoiding urban cores.
 */
export const DISTRICT_AGRI_CENTROIDS: Record<
  PunjabDistrict,
  { center: Corner; deltaLat: number; deltaLon: number }
> = {
  Faridkot: { center: [74.756, 30.676], deltaLat: 0.12, deltaLon: 0.12 },
  Patiala: { center: [76.386, 30.339], deltaLat: 0.15, deltaLon: 0.15 },
  Sangrur: { center: [75.842, 30.245], deltaLat: 0.14, deltaLon: 0.14 },
  Bathinda: { center: [74.945, 30.211], deltaLat: 0.15, deltaLon: 0.15 },
  Ludhiana: { center: [75.857, 30.821], deltaLat: 0.12, deltaLon: 0.12 },
  Moga: { center: [75.171, 30.817], deltaLat: 0.11, deltaLon: 0.11 },
  Ferozepur: { center: [74.613, 30.880], deltaLat: 0.13, deltaLon: 0.13 },
};

export const SCENARIO_DISTRIBUTION: Record<ScenarioCategory, number> = {
  rice_season: 300,
  wheat_season: 250,
  fallow: 150,
  mixed_agriculture: 150,
  water_flooded: 100,
  other_land_cover: 50,
};

export const GENERATOR_VERSION = "1.0.0-punjab-authalic";
export const DEFAULT_SYNTHETIC_SEED = 42;
export const SYNTHETIC_DATASET_ID = "TCC-EARTH-LAB-SYN-PUNJAB-V1";

/**
 * Generates an agricultural polygon around a base centroid.
 * Simulates Killa rectangular fields, elongated plots, multi-vertex irregular fields,
 * and boundary configurations.
 */
export function generateSyntheticParcelPolygon(
  prng: Mulberry32PRNG,
  center: Corner,
  profile: ParcelShapeProfile
): Corner[] {
  // Determine target area in acres
  let targetAcres = 2.5;
  if (profile === "small") targetAcres = prng.range(0.5, 2.0);
  else if (profile === "medium") targetAcres = prng.range(2.0, 10.0);
  else if (profile === "large") targetAcres = prng.range(10.0, 32.0);
  else if (profile === "elongated") targetAcres = prng.range(1.5, 8.0);
  else if (profile === "narrow") targetAcres = prng.range(0.8, 3.5);
  else if (profile === "irregular") targetAcres = prng.range(2.0, 15.0);
  else if (profile === "fragmented") targetAcres = prng.range(1.0, 6.0);

  // Target area in square meters (1 ac = 4046.8564224 m2)
  const targetAreaM2 = targetAcres * 4046.8564224;

  // Mid-latitude in Punjab: ~30.5 degrees N
  // 1 degree lat ~ 110,852 meters.
  // 1 degree lon ~ 111,320 * cos(lat) ~ 95,950 meters.
  const latMetersPerDeg = 110852;
  const lonMetersPerDeg = 95950;

  // Determine width & height in meters
  let aspect = 1.0;
  if (profile === "elongated") aspect = prng.range(2.5, 4.5);
  else if (profile === "narrow") aspect = prng.range(4.5, 7.5);
  else aspect = prng.range(0.8, 1.6);

  // targetAreaM2 = width * height = (height * aspect) * height = height^2 * aspect
  const hMeters = Math.sqrt(targetAreaM2 / aspect);
  const wMeters = hMeters * aspect;

  const halfWM = wMeters / 2;
  const halfHM = hMeters / 2;

  // Orientation angle in radians
  const angle = prng.range(0, Math.PI / 4);
  const cosA = Math.cos(angle);
  const sinA = Math.sin(angle);

  let rawPts: [number, number][] = [];

  if (profile === "irregular") {
    // 6 to 10 vertices generated in polar coordinates with angular monotonicity
    const vertexCount = Math.floor(prng.range(6, 11));
    const angleStep = (2 * Math.PI) / vertexCount;
    for (let i = 0; i < vertexCount; i++) {
      const a = i * angleStep + prng.range(-angleStep * 0.25, angleStep * 0.25);
      const rScale = prng.range(0.7, 1.25);
      const rx = (halfWM * Math.cos(a) * rScale);
      const ry = (halfHM * Math.sin(a) * rScale);
      rawPts.push([rx, ry]);
    }
  } else if (profile === "fragmented") {
    // 6-vertex L-shaped or stepped agricultural polygon
    const indentW = halfWM * prng.range(0.3, 0.6);
    const indentH = halfHM * prng.range(0.3, 0.6);
    rawPts = [
      [-halfWM, -halfHM],
      [halfWM, -halfHM],
      [halfWM, indentH],
      [indentW, indentH],
      [indentW, halfHM],
      [-halfWM, halfHM],
    ];
  } else {
    // Standard 4-corner rectangle with subtle corner jitter (< 5%)
    const jitter = () => prng.range(-0.04, 0.04);
    rawPts = [
      [-halfWM * (1 + jitter()), -halfHM * (1 + jitter())],
      [halfWM * (1 + jitter()), -halfHM * (1 + jitter())],
      [halfWM * (1 + jitter()), halfHM * (1 + jitter())],
      [-halfWM * (1 + jitter()), halfHM * (1 + jitter())],
    ];
  }

  // Rotate points and convert to geographic offsets from centroid
  const [cLon, cLat] = center;
  const corners: Corner[] = rawPts.map(([xm, ym]) => {
    const rx = xm * cosA - ym * sinA;
    const ry = xm * sinA + ym * cosA;
    const pLon = Number((cLon + rx / lonMetersPerDeg).toFixed(6));
    const pLat = Number((cLat + ry / latMetersPerDeg).toFixed(6));
    return [pLon, pLat];
  });

  // Verify non-self-intersecting
  if (hasSelfIntersection(corners)) {
    // Fallback to simple unjittered box if irregular jitter caused a crossing
    return [
      [Number((cLon - halfWM / lonMetersPerDeg).toFixed(6)), Number((cLat - halfHM / latMetersPerDeg).toFixed(6))],
      [Number((cLon + halfWM / lonMetersPerDeg).toFixed(6)), Number((cLat - halfHM / latMetersPerDeg).toFixed(6))],
      [Number((cLon + halfWM / lonMetersPerDeg).toFixed(6)), Number((cLat + halfHM / latMetersPerDeg).toFixed(6))],
      [Number((cLon - halfWM / lonMetersPerDeg).toFixed(6)), Number((cLat + halfHM / latMetersPerDeg).toFixed(6))],
    ];
  }

  return corners;
}

/**
 * Generates the collection of 1,000 valid synthetic parcels across Punjab.
 */
export function generateSyntheticPunjabDataset(seed: number = DEFAULT_SYNTHETIC_SEED): {
  parcels: SyntheticParcel[];
  metadata: {
    total_count: number;
    seed: number;
    version: string;
    dataset_id: string;
    generated_at: string;
    district_counts: Record<string, number>;
    scenario_counts: Record<string, number>;
    shape_counts: Record<string, number>;
    total_area_acres: number;
  };
} {
  const prng = new Mulberry32PRNG(seed);
  const parcels: SyntheticParcel[] = [];
  const districts: PunjabDistrict[] = [
    "Faridkot",
    "Patiala",
    "Sangrur",
    "Bathinda",
    "Ludhiana",
    "Moga",
    "Ferozepur",
  ];

  const profiles: ParcelShapeProfile[] = [
    "small",
    "medium",
    "large",
    "elongated",
    "irregular",
    "narrow",
    "fragmented",
  ];

  const districtCounts: Record<string, number> = {};
  const scenarioCounts: Record<string, number> = {};
  const shapeCounts: Record<string, number> = {};
  let totalAreaAcres = 0;

  let parcelIndex = 1;

  for (const [scenario, targetCount] of Object.entries(SCENARIO_DISTRIBUTION) as [ScenarioCategory, number][]) {
    for (let i = 0; i < targetCount; i++) {
      const syntheticId = `TCC-SYN-PB-${String(parcelIndex).padStart(6, "0")}`;
      parcelIndex++;

      // Weighted district sampling prioritizing Faridkot & Patiala
      let district: PunjabDistrict;
      const dRoll = prng.next();
      if (dRoll < 0.28) district = "Faridkot";
      else if (dRoll < 0.52) district = "Patiala";
      else if (dRoll < 0.66) district = "Sangrur";
      else if (dRoll < 0.78) district = "Bathinda";
      else if (dRoll < 0.88) district = "Ludhiana";
      else if (dRoll < 0.94) district = "Moga";
      else district = "Ferozepur";

      const shapeProfile = prng.choice(profiles);
      const districtConfig = DISTRICT_AGRI_CENTROIDS[district];

      // Jitter centroid within agricultural zone
      const centerLon = Number(
        (districtConfig.center[0] + prng.range(-districtConfig.deltaLon, districtConfig.deltaLon)).toFixed(6)
      );
      const centerLat = Number(
        (districtConfig.center[1] + prng.range(-districtConfig.deltaLat, districtConfig.deltaLat)).toFixed(6)
      );

      const ringCorners = generateSyntheticParcelPolygon(prng, [centerLon, centerLat], shapeProfile);

      // Verify closed ring for GeoJSON standard (first equals last)
      const firstCorner = ringCorners[0]!;
      const closedCoordinates: Corner[] = [...ringCorners, [firstCorner[0], firstCorner[1]]];

      // High-precision WGS84 authalic ellipsoidal calculation
      const areaSqMeters = wgs84EllipsoidalGeodesicAreaSqMeters(ringCorners);
      const areaAcres = wgs84EllipsoidalGeodesicAcres(ringCorners);
      const landBreakdown = acresToPunjabLandBreakdown(areaAcres);
      const areaHectares = Number((areaAcres / 2.47105).toFixed(4));

      // Validate topology
      const boundaryCheck = validateBoundary(ringCorners);

      const parcel: SyntheticParcel = {
        synthetic_parcel_id: syntheticId,
        dataset_id: SYNTHETIC_DATASET_ID,
        geometry: {
          type: "Polygon",
          coordinates: [closedCoordinates],
        },
        district,
        scenario_category: scenario,
        shape_profile: shapeProfile,
        vertex_count: ringCorners.length,
        area_sq_meters: Math.round(areaSqMeters * 100) / 100,
        area_acres: areaAcres,
        area_kanal: landBreakdown.kanal,
        area_marla: landBreakdown.marla,
        area_hectares: areaHectares,
        is_valid: boundaryCheck.valid,
        generation_seed: seed,
        generation_timestamp: "2026-10-30T12:00:00.000Z",
        data_origin: "synthetic",
        validation_class: "engineering_only",
      };

      parcels.push(parcel);

      districtCounts[district] = (districtCounts[district] || 0) + 1;
      scenarioCounts[scenario] = (scenarioCounts[scenario] || 0) + 1;
      shapeCounts[shapeProfile] = (shapeCounts[shapeProfile] || 0) + 1;
      totalAreaAcres += areaAcres;
    }
  }

  return {
    parcels,
    metadata: {
      total_count: parcels.length,
      seed,
      version: GENERATOR_VERSION,
      dataset_id: SYNTHETIC_DATASET_ID,
      generated_at: "2026-10-30T12:00:00.000Z",
      district_counts: districtCounts,
      scenario_counts: scenarioCounts,
      shape_counts: shapeCounts,
      total_area_acres: Number(totalAreaAcres.toFixed(2)),
    },
  };
}

/**
 * Separate collection of invalid geometry test cases for stress-testing GIS engines.
 * Contains explicit topological, numerical, and structural violations.
 */
export function generateInvalidGeometryTestCases(): InvalidGeometryTestCase[] {
  return [
    {
      case_id: "TCC-INV-GEO-001",
      error_type: "self_intersection",
      description: "Bowtie / self-intersecting polygon boundary crossing itself",
      raw_coordinates: [
        [74.75, 30.67],
        [74.77, 30.69],
        [74.77, 30.67],
        [74.75, 30.69],
        [74.75, 30.67],
      ],
      expected_failure_reason: "Boundary contains self-intersecting edges (bow-tie shape).",
    },
    {
      case_id: "TCC-INV-GEO-002",
      error_type: "duplicate_vertices",
      description: "Consecutive identical vertices forming a zero-length edge",
      raw_coordinates: [
        [74.75, 30.67],
        [74.75, 30.67],
        [74.76, 30.67],
        [74.76, 30.68],
        [74.75, 30.68],
        [74.75, 30.67],
      ],
      expected_failure_reason: "Consecutive identical vertices detected.",
    },
    {
      case_id: "TCC-INV-GEO-003",
      error_type: "degenerate_polygon",
      description: "Degenerate collinear vertices with fewer than 3 non-collinear points",
      raw_coordinates: [
        [74.75, 30.67],
        [74.76, 30.67],
      ],
      expected_failure_reason: "A land parcel must have at least 3 corner boundary points.",
    },
    {
      case_id: "TCC-INV-GEO-004",
      error_type: "out_of_range_coords",
      description: "Latitude exceeding geodetic limit (lat > 90)",
      raw_coordinates: [
        [74.75, 95.0],
        [74.76, 95.0],
        [74.76, 95.01],
        [74.75, 95.01],
        [74.75, 95.0],
      ],
      expected_failure_reason: "latitude out of bounds (-90 to 90).",
    },
    {
      case_id: "TCC-INV-GEO-005",
      error_type: "empty_geometry",
      description: "Empty coordinate array",
      raw_coordinates: [],
      expected_failure_reason: "A land parcel must have at least 3 corner boundary points.",
    },
    {
      case_id: "TCC-INV-GEO-006",
      error_type: "unclosed_ring",
      description: "GeoJSON linear ring where first vertex does not equal last vertex",
      raw_coordinates: [
        [74.75, 30.67],
        [74.76, 30.67],
        [74.76, 30.68],
        [74.75, 30.68],
      ],
      expected_failure_reason: "Unclosed linear ring.",
    },
    {
      case_id: "TCC-INV-GEO-007",
      error_type: "wrong_ring_order",
      description: "Degenerate area below agricultural threshold (< 0.05 acres)",
      raw_coordinates: [
        [74.750000, 30.670000],
        [74.750010, 30.670000],
        [74.750010, 30.670010],
        [74.750000, 30.670010],
        [74.750000, 30.670000],
      ],
      expected_failure_reason: "Calculated area is below minimum agricultural threshold (0.05 acres).",
    },
  ];
}
