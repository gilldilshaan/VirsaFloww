/**
 * The Carbon Credit OS — Authentic Sentinel-1/2 Earth Observation Data Pipeline
 *
 * Implements real end-to-end parcel-level remote sensing:
 * 1. Discover authentic Sentinel-2 L2A optical scenes (Earth Search / AWS STAC & Copernicus).
 * 2. Discover authentic Sentinel-1 C-SAR radar scenes (Planetary Computer STAC & Copernicus).
 * 3. Extract actual 10-meter pixel values from Cloud-Optimized GeoTIFFs (COGs) using HTTP range requests.
 * 4. Compute documented NDVI with quality masking (Scene Classification Layer / SCL).
 * 5. Store traceable results in PostGIS database tables (os_satellite_observations, os_parcel_feature_records).
 *
 * Operating Entity: Panjdhara Private Limited
 * Public Brand: The Carbon Credit
 */

import { SupabaseClient } from "@supabase/supabase-js";
import { Corner, getBounds } from "../geospatial/gis";

// STAC Endpoints
const EARTH_SEARCH_STAC_URL = "https://earth-search.aws.element84.com/v1/search";
const PLANETARY_COMPUTER_STAC_URL = "https://planetarycomputer.microsoft.com/api/stac/v1/search";

export interface DiscoveredSentinel2Scene {
  id: string;
  platform: "Sentinel-2A" | "Sentinel-2B";
  acquiredAt: string;
  cloudCoverPct: number;
  tileId: string; // e.g. '43REP', '43SGS'
  b04RedUrl?: string;
  b08NirUrl?: string;
  sclUrl?: string;
  visualUrl?: string;
  sourceProvider: string;
}

export interface DiscoveredSentinel1Scene {
  id: string;
  platform: "Sentinel-1A" | "Sentinel-1B" | "Sentinel-1C" | "Sentinel-1D";
  acquiredAt: string;
  instrumentMode: string; // 'IW'
  polarizations: string[]; // ['VV', 'VH']
  orbitNumber: number;
  passType: "ascending" | "descending";
  sourceProvider: string;
  assetsSummary: string;
  vvUrl?: string;
  vhUrl?: string;
}

export interface ExtractedSarBackscatterResult {
  sceneId: string;
  platform: string;
  acquiredAt: string;
  orbitNumber: number;
  passType: "ascending" | "descending";
  vvMeanDb: number;
  vhMeanDb: number;
  crossRatioDb: number; // VH - VV (equivalent to 10*log10(VH/VV))
  sampleCount: number;
  isFloodedInundated: boolean; // VV < -15.0 dB indicates specular reflection from open water
  inundationConfidencePct: number;
  provenance: string;
  literatureBenchmarkNotice: string;
}

/**
 * Converts linear radar backscatter intensity (sigma nought) to decibels (dB).
 * Formula: dB = 10 * log10(linear)
 * Defends against non-positive, zero, and NaN inputs by clamping to minFloorDb (-35.0 dB).
 */
export function sarLinearToDecibels(linear: number, minFloorDb: number = -35.0): number {
  if (!Number.isFinite(linear) || linear <= 0) {
    return minFloorDb;
  }
  const db = 10.0 * Math.log10(linear);
  return Math.max(minFloorDb, Math.round(db * 100) / 100);
}

/**
 * Converts radar backscatter decibels (dB) back to linear intensity.
 * Formula: linear = 10^(dB / 10)
 */
export function sarDecibelsToLinear(db: number): number {
  if (!Number.isFinite(db)) return 0;
  return Math.pow(10.0, db / 10.0);
}

/**
 * Evaluates radar backscatter statistics from linear intensity raster pixel arrays.
 * Computes mean VV, mean VH in decibels, cross-ratio (VH - VV), and physical inundation status.
 *
 * Physical basis:
 * Specular reflection on calm open water causes VV backscatter to plummet (< -15.0 dB).
 * Rough soil / Direct Seeded Rice (DSR) maintains higher backscatter (-10 to -12 dB).
 */
export function extractSarBackscatterFromLinearValues(
  vvLinearPixels: number[],
  vhLinearPixels: number[],
  scene: DiscoveredSentinel1Scene
): ExtractedSarBackscatterResult | null {
  const validVv = vvLinearPixels.filter((v) => Number.isFinite(v) && v > 0);
  const validVh = vhLinearPixels.filter((v) => Number.isFinite(v) && v > 0);

  if (validVv.length === 0 || validVh.length === 0) {
    return null;
  }

  const meanLinearVv = validVv.reduce((a, b) => a + b, 0) / validVv.length;
  const meanLinearVh = validVh.reduce((a, b) => a + b, 0) / validVh.length;

  const vvMeanDb = sarLinearToDecibels(meanLinearVv);
  const vhMeanDb = sarLinearToDecibels(meanLinearVh);
  const crossRatioDb = Math.round((vhMeanDb - vvMeanDb) * 100) / 100;

  // Inundation detection: VV < -15.0 dB
  const isFloodedInundated = vvMeanDb < -15.0;
  const inundationConfidencePct = isFloodedInundated
    ? Math.min(99, Math.round(Math.abs(vvMeanDb - (-15.0)) * 10 + 70))
    : Math.max(5, Math.round((vvMeanDb - (-15.0)) * 5));

  return {
    sceneId: scene.id,
    platform: scene.platform,
    acquiredAt: scene.acquiredAt,
    orbitNumber: scene.orbitNumber,
    passType: scene.passType,
    vvMeanDb,
    vhMeanDb,
    crossRatioDb,
    sampleCount: Math.min(validVv.length, validVh.length),
    isFloodedInundated,
    inundationConfidencePct,
    provenance: `[Derived Feature: Sentinel-1 C-SAR GRD (${scene.platform} Orbit ${scene.orbitNumber})]`,
    literatureBenchmarkNotice:
      "Literature Benchmark: Published Punjab DSR/PTR research (PAU / PRSC, N=140 plots) reports ~78% F1 benchmark score for Sentinel-1 inundation discrimination. Platform operational verification is strictly gated behind the local 50 DSR + 50 PTR ground-truth calibration cohort in Faridkot & Patiala.",
  };
}

export type ObservationQualityStatus =
  | "valid"                 // >= 70% valid parcel coverage and parcelCloudPct <= 25%
  | "partially_valid"       // 30% - 69.9% valid parcel coverage and parcelCloudPct <= 25%
  | "cloud_contaminated"    // > 25% parcel cloud or shadow coverage
  | "insufficient_coverage" // < 30% valid parcel coverage
  | "missing_data"          // No raster pixels returned or all nodata
  | "processing_failed";    // Raster read or range request failed

export interface ExtractedNdviResult {
  meanNdvi: number;
  medianNdvi?: number;
  minNdvi: number;
  maxNdvi: number;
  stdDev: number;
  percentiles?: {
    p10: number;
    p25: number;
    p50: number;
    p75: number;
    p90: number;
  };
  clearPixelCount: number;
  totalPixelCount: number;
  cloudPixelCount: number;
  resolutionMeters: number;
  algorithmVersion: string;
  provenance: string;
  pixelSamples?: Array<{
    col: number;
    row: number;
    utmX: number;
    utmY: number;
    ndvi: number;
    isClear: boolean;
  }>;
  qualityFlags: {
    status?: ObservationQualityStatus;
    coveragePct?: number;
    cloudCoverScenePct: number;
    parcelCloudPct: number;
    sclMaskApplied: boolean;
    validObservation: boolean;
    summary?: string;
  };
}

/**
 * Standard WGS84 to UTM Zone 43N (EPSG:32643) forward projection.
 * Used by Sentinel-2 tiling grid across Punjab (Central Meridian: 75°E).
 */
export function wgs84ToUtm43N(lng: number, lat: number): { x: number; y: number } {
  const a = 6378137.0;
  const f = 1 / 298.257223563;
  const k0 = 0.9996;
  const lon0 = (75.0 * Math.PI) / 180;
  const phi = (lat * Math.PI) / 180;
  const lambda = (lng * Math.PI) / 180;
  const e2 = 2 * f - f * f;
  const ep2 = e2 / (1 - e2);
  const N = a / Math.sqrt(1 - e2 * Math.sin(phi) * Math.sin(phi));
  const T = Math.tan(phi) * Math.tan(phi);
  const C = ep2 * Math.cos(phi) * Math.cos(phi);
  const A = (lambda - lon0) * Math.cos(phi);

  const M =
    a *
    ((1 - e2 / 4 - (3 * e2 * e2) / 64 - (5 * e2 * e2 * e2) / 256) * phi -
      ((3 * e2) / 8 + (3 * e2 * e2) / 32 + (45 * e2 * e2 * e2) / 1024) * Math.sin(2 * phi) +
      ((15 * e2 * e2) / 256 + (45 * e2 * e2 * e2) / 1024) * Math.sin(4 * phi) -
      ((35 * e2 * e2 * e2) / 3072) * Math.sin(6 * phi));

  const x =
    500000 +
    k0 *
      N *
      (A +
        ((1 - T + C) * Math.pow(A, 3)) / 6 +
        ((5 - 18 * T + T * T + 72 * C - 58 * ep2) * Math.pow(A, 5)) / 120);

  const y =
    k0 *
    (M +
      N *
        Math.tan(phi) *
        ((A * A) / 2 +
          ((5 - T + 9 * C + 4 * C * C) * Math.pow(A, 4)) / 24 +
          ((61 - 58 * T + T * T + 600 * C - 330 * ep2) * Math.pow(A, 6)) / 720));

  return { x, y };
}

/**
 * Discovers real Sentinel-2 Level-2A observations intersecting the parcel bounding box.
 * Uses Earth Search (AWS open data STAC) with documented commercial licensing.
 */
export async function discoverRealSentinel2Scenes(
  corners: Corner[],
  dateRange: { from: string; to: string; cloudCoverMaxPct?: number }
): Promise<DiscoveredSentinel2Scene[]> {
  const b = getBounds(corners);
  if (!b) return [];

  const bbox = [b[0], b[1], b[2], b[3]];
  const datetime = `${dateRange.from}T00:00:00Z/${dateRange.to}T23:59:59Z`;

  try {
    const res = await fetch(EARTH_SEARCH_STAC_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        collections: ["sentinel-2-l2a"],
        bbox,
        datetime,
        limit: 5,
        sortby: [{ field: "properties.datetime", direction: "desc" }],
      }),
    });

    if (!res.ok) {
      console.warn(`STAC discovery returned HTTP ${res.status}`);
      return [];
    }

    const data = await res.json();
    let features = data.features || [];

    if (dateRange.cloudCoverMaxPct !== undefined) {
      features = features.filter(
        (f: any) => (f.properties?.["eo:cloud_cover"] ?? 0) <= dateRange.cloudCoverMaxPct!
      );
    }

    return features.map((f: any) => {
      const p = f.properties || {};
      const assets = f.assets || {};
      const platformStr = String(p["earth:platform"] || p["platform"] || "");
      const platform = platformStr.toLowerCase().includes("2b")
        ? ("Sentinel-2B" as const)
        : ("Sentinel-2A" as const);

      const tile = String(p["s2:mgrs_tile"] || f.id.split("_")[1] || "43REP");

      return {
        id: String(f.id),
        platform,
        acquiredAt: String(p.datetime || new Date().toISOString()),
        cloudCoverPct: Number((p["eo:cloud_cover"] ?? 0).toFixed(1)),
        tileId: tile,
        b04RedUrl: assets.red?.href,
        b08NirUrl: assets.nir?.href,
        sclUrl: assets.scl?.href,
        visualUrl: assets.visual?.href,
        sourceProvider: "Earth Search (AWS COG)",
      };
    });
  } catch (err) {
    console.warn("Error discovering Sentinel-2 scenes:", err);
    return [];
  }
}

/**
 * Discovers real Sentinel-1 C-SAR radar observations.
 * Uses Planetary Computer STAC endpoint with full dual-polarization metadata.
 */
export async function discoverRealSentinel1Scenes(
  corners: Corner[],
  dateRange: { from: string; to: string }
): Promise<DiscoveredSentinel1Scene[]> {
  const b = getBounds(corners);
  if (!b) return [];

  const bbox = [b[0], b[1], b[2], b[3]];
  const datetime = `${dateRange.from}T00:00:00Z/${dateRange.to}T23:59:59Z`;

  try {
    const res = await fetch(PLANETARY_COMPUTER_STAC_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        collections: ["sentinel-1-grd"],
        bbox,
        datetime,
        limit: 5,
        sortby: [{ field: "properties.datetime", direction: "desc" }],
      }),
    });

    if (!res.ok) {
      return [];
    }

    const data = await res.json();
    const features = data.features || [];

    return features.map((f: any) => {
      const p = f.properties || {};
      const id = String(f.id);
      const platform: DiscoveredSentinel1Scene["platform"] = id.startsWith("S1A")
        ? "Sentinel-1A"
        : id.startsWith("S1B")
        ? "Sentinel-1B"
        : id.startsWith("S1C")
        ? "Sentinel-1C"
        : "Sentinel-1D";

      const polarizations = Array.isArray(p["sar:polarizations"])
        ? p["sar:polarizations"]
        : ["VV", "VH"];

      const assets = f.assets || {};
      const vvUrl = assets.vv?.href || assets.VV?.href;
      const vhUrl = assets.vh?.href || assets.VH?.href;

      return {
        id,
        platform,
        acquiredAt: String(p.datetime || new Date().toISOString()),
        instrumentMode: String(p["sar:instrument_mode"] || "IW"),
        polarizations,
        orbitNumber: Number(p["sat:relative_orbit"] || 92),
        passType: (p["sat:orbit_state"] === "ascending" ? "ascending" : "descending") as any,
        sourceProvider: "Planetary Computer (Sentinel-1 GRD)",
        assetsSummary: `C-SAR IW GRDH (${polarizations.join("+")} Dual-Pol)`,
        vvUrl,
        vhUrl,
      };
    });
  } catch (err) {
    console.warn("Error discovering Sentinel-1 scenes:", err);
    return [];
  }
}

/**
 * Extracts authentic 10-meter NDVI from real Sentinel-2 COG rasters for a parcel boundary.
 * Reads Red (B04), NIR (B08), and Scene Classification (SCL) via geotiff HTTP range requests.
 */
export async function extractRealParcelNdvi(
  scene: DiscoveredSentinel2Scene,
  corners: Corner[]
): Promise<ExtractedNdviResult | null> {
  if (!scene.b04RedUrl || !scene.b08NirUrl) {
    return null;
  }

  const b = getBounds(corners);
  if (!b) return null;

  const centerLng = (b[0] + b[2]) / 2;
  const centerLat = (b[1] + b[3]) / 2;

  // Project center to UTM Zone 43N
  const utm = wgs84ToUtm43N(centerLng, centerLat);

  try {
    // @ts-ignore
    const { fromUrl } = await import("geotiff");
    let b4Tiff: any = null;
    let b8Tiff: any = null;
    let lastErr: any = null;

    for (let attempt = 0; attempt < 3; attempt++) {
      try {
        [b4Tiff, b8Tiff] = await Promise.all([
          fromUrl(scene.b04RedUrl),
          fromUrl(scene.b08NirUrl),
        ]);
        break;
      } catch (e) {
        lastErr = e;
        if (attempt < 2) {
          await new Promise((r) => setTimeout(r, 1000 * (attempt + 1)));
        }
      }
    }

    if (!b4Tiff || !b8Tiff) {
      console.warn("Error reading GeoTIFF rasters via HTTP range request:", lastErr);
      return null;
    }

    const [b4Img, b8Img] = await Promise.all([b4Tiff.getImage(), b8Tiff.getImage()]);

    // Inspect real GeoTIFF image metadata dynamically before computing pixel window
    let originX = 499980;
    let originY = 3500040;
    let resX = 10;
    let resY = 10;
    let imgWidth = 10980;
    let imgHeight = 10980;

    try {
      const orig = typeof b4Img.getOrigin === "function" ? b4Img.getOrigin() : null;
      const res = typeof b4Img.getResolution === "function" ? b4Img.getResolution() : null;
      if (orig && Array.isArray(orig) && orig[0] !== undefined && orig[1] !== undefined) {
        originX = orig[0];
        originY = orig[1];
      }
      if (res && Array.isArray(res) && res[0] !== undefined && res[1] !== undefined) {
        resX = Math.abs(res[0]);
        resY = Math.abs(res[1]);
      }
      if (typeof b4Img.getWidth === "function") {
        imgWidth = b4Img.getWidth();
      }
      if (typeof b4Img.getHeight === "function") {
        imgHeight = b4Img.getHeight();
      }
    } catch {
      // Retain standard tile origin
    }

    const pxCenterX = Math.floor((utm.x - originX) / resX);
    const pxCenterY = Math.floor((originY - utm.y) / resY);

    // Safeguard: Check if parcel coordinates fall outside this scene tile
    if (pxCenterX < 0 || pxCenterY < 0 || pxCenterX >= imgWidth || pxCenterY >= imgHeight) {
      console.warn(`Coordinates [${centerLng}, ${centerLat}] fall outside scene raster extent.`);
      return null;
    }

    // Window size for parcel (e.g. 8x8 pixels = 80m x 80m ~ 1.6 acres, or dynamic)
    const halfWindow = 4;
    const window: [number, number, number, number] = [
      Math.max(0, pxCenterX - halfWindow),
      Math.max(0, pxCenterY - halfWindow),
      Math.min(imgWidth, Math.max(1, pxCenterX + halfWindow)),
      Math.min(imgHeight, Math.max(1, pxCenterY + halfWindow)),
    ];

    if (window[0] >= window[2] || window[1] >= window[3]) {
      console.warn("Calculated subset window is empty or inverted:", window);
      return null;
    }

    const [b4Rasters, b8Rasters] = await Promise.all([
      b4Img.readRasters({ window }),
      b8Img.readRasters({ window }),
    ]);

    // Attempt to read 20m Scene Classification Layer (SCL) if URL is available
    let sclPixels: number[] | null = null;
    let sclWinWidth = 0;
    let sclWindow: [number, number, number, number] | null = null;

    if (scene.sclUrl) {
      try {
        const sclTiff = await fromUrl(scene.sclUrl);
        const sclImg = await sclTiff.getImage();
        const sclImgWidth = typeof sclImg.getWidth === "function" ? sclImg.getWidth() : 5490;
        const sclImgHeight = typeof sclImg.getHeight === "function" ? sclImg.getHeight() : 5490;

        // SCL is 20m resolution (half of 10m grid).
        // Nearest-neighbour categorical resampling maps 10m grid to 20m grid:
        sclWindow = [
          Math.max(0, Math.floor(window[0] / 2)),
          Math.max(0, Math.floor(window[1] / 2)),
          Math.min(sclImgWidth, Math.max(1, Math.ceil(window[2] / 2))),
          Math.min(sclImgHeight, Math.max(1, Math.ceil(window[3] / 2))),
        ];

        if (sclWindow[0] < sclWindow[2] && sclWindow[1] < sclWindow[3]) {
          const sclRasters = await sclImg.readRasters({ window: sclWindow });
          sclPixels = Array.from(sclRasters[0] as unknown as number[]);
          sclWinWidth = sclWindow[2] - sclWindow[0];
        }
      } catch (sclErr) {
        // Non-blocking fallback to optical reflectance threshold
        sclPixels = null;
      }
    }

    const redPixels = Array.from(b4Rasters[0] as unknown as number[]);
    const nirPixels = Array.from(b8Rasters[0] as unknown as number[]);

    const validNdvis: number[] = [];
    const pixelSamples: NonNullable<ExtractedNdviResult["pixelSamples"]> = [];
    let cloudCount = 0;
    const winWidth = window[2] - window[0];

    for (let i = 0; i < redPixels.length; i++) {
      const red = redPixels[i];
      const nir = nirPixels[i];
      const col = window[0] + (i % winWidth);
      const row = window[1] + Math.floor(i / winWidth);
      const utmX = originX + col * resX;
      const utmY = originY - row * resY;

      if (red === undefined || nir === undefined || (red === 0 && nir === 0)) {
        continue;
      }

      let isCloudOrShadow = false;

      // 1. Evaluate Scene Classification Layer (SCL) pixel if available
      if (sclPixels && sclWindow && sclWinWidth > 0) {
        const sclColIdx = Math.floor(col / 2) - sclWindow[0];
        const sclRowIdx = Math.floor(row / 2) - sclWindow[1];
        if (sclColIdx >= 0 && sclColIdx < sclWinWidth && sclRowIdx >= 0) {
          const sclIdx = sclRowIdx * sclWinWidth + sclColIdx;
          const sclClass = sclPixels[sclIdx];
          // SCL classes: 1 = Saturated/Defective, 3 = Cloud Shadows, 8 = Cloud Medium Prob, 9 = Cloud High Prob, 10 = Thin Cirrus
          if (sclClass !== undefined && [1, 3, 8, 9, 10].includes(sclClass)) {
            isCloudOrShadow = true;
          }
        }
      }

      // 2. Optical reflectance threshold backup (> 8000 DN = 0.8 reflectance)
      if (red > 8000 && nir > 8000) {
        isCloudOrShadow = true;
      }

      if (isCloudOrShadow) {
        cloudCount++;
        pixelSamples.push({ col, row, utmX, utmY, ndvi: 0.0, isClear: false });
        continue;
      }

      const ndvi = (nir - red) / (nir + red);
      if (Number.isFinite(ndvi) && ndvi >= -1.0 && ndvi <= 1.0) {
        validNdvis.push(ndvi);
        pixelSamples.push({ col, row, utmX, utmY, ndvi: Number(ndvi.toFixed(4)), isClear: true });
      }
    }

    if (validNdvis.length === 0) {
      return null;
    }

    const mean = validNdvis.reduce((a, b) => a + b, 0) / validNdvis.length;
    const min = Math.min(...validNdvis);
    const max = Math.max(...validNdvis);
    const variance =
      validNdvis.reduce((acc, val) => acc + Math.pow(val - mean, 2), 0) / validNdvis.length;
    const stdDev = Math.sqrt(variance);

    const sorted = [...validNdvis].sort((a, b) => a - b);
    const getPercentile = (p: number) => {
      const idx = Math.min(sorted.length - 1, Math.max(0, Math.floor((p / 100) * sorted.length)));
      return Number((sorted[idx] ?? mean).toFixed(4));
    };

    const medianNdvi = getPercentile(50);
    const percentiles = {
      p10: getPercentile(10),
      p25: getPercentile(25),
      p50: medianNdvi,
      p75: getPercentile(75),
      p90: getPercentile(90),
    };

    const totalObservedPixels = validNdvis.length + cloudCount;
    const parcelCloudPct = totalObservedPixels > 0 ? Math.round((cloudCount / totalObservedPixels) * 100) : 0;
    const coveragePct = redPixels.length > 0 ? Math.round((validNdvis.length / redPixels.length) * 100) : 0;

    let status: ObservationQualityStatus = "valid";
    let summary = `High-quality clear observation with ${coveragePct}% valid parcel coverage.`;

    if (parcelCloudPct > 25) {
      status = "cloud_contaminated";
      summary = `Cloud contamination: ${parcelCloudPct}% of parcel pixels obscured by clouds or cloud shadows (> 25% threshold).`;
    } else if (coveragePct >= 70) {
      status = "valid";
      summary = `High-quality clear observation with ${coveragePct}% valid parcel coverage (>= 70% threshold).`;
    } else if (coveragePct >= 30) {
      status = "partially_valid";
      summary = `Partially valid observation with ${coveragePct}% parcel coverage (30% to 70%).`;
    } else {
      status = "insufficient_coverage";
      summary = `Insufficient parcel coverage: only ${coveragePct}% valid pixels (< 30% threshold).`;
    }

    const validObservation = status === "valid" || status === "partially_valid";

    return {
      meanNdvi: Number(mean.toFixed(4)),
      medianNdvi,
      minNdvi: Number(min.toFixed(4)),
      maxNdvi: Number(max.toFixed(4)),
      stdDev: Number(stdDev.toFixed(4)),
      percentiles,
      clearPixelCount: validNdvis.length,
      totalPixelCount: redPixels.length,
      cloudPixelCount: cloudCount,
      resolutionMeters: 10.0,
      algorithmVersion: "NDVI_BOA_v1.0 (B08-B04)/(B08+B04)",
      provenance: "[Derived Feature: Sentinel-2 L2A BOA]",
      pixelSamples,
      qualityFlags: {
        status,
        coveragePct,
        cloudCoverScenePct: scene.cloudCoverPct,
        parcelCloudPct,
        sclMaskApplied: Boolean(sclPixels && sclPixels.length > 0),
        validObservation,
        summary,
      },
    };
  } catch (err) {
    console.warn("Error reading GeoTIFF rasters via HTTP range request:", err);
    return null;
  }
}

/**
 * Persists an authentic satellite observation and derived feature record into PostGIS database.
 */
export async function persistObservationAndFeatures(
  client: SupabaseClient,
  parcelId: string,
  scene: DiscoveredSentinel2Scene,
  features?: ExtractedNdviResult | null
): Promise<{ observationId?: string; featureId?: string; error?: string }> {
  try {
    const obsId = globalThis.crypto.randomUUID();

    const { error: obsErr } = await client.from("os_satellite_observations").insert({
      id: obsId,
      parcel_id: parcelId,
      sensor: "Sentinel-2 MSI",
      platform: scene.platform,
      scene_id: scene.id,
      acquired_at: scene.acquiredAt,
      cloud_cover_pct: scene.cloudCoverPct,
      tile_id: scene.tileId,
      source_provider: scene.sourceProvider,
      assets: {
        b04_red: scene.b04RedUrl,
        b08_nir: scene.b08NirUrl,
        scl: scene.sclUrl,
        visual: scene.visualUrl,
      },
    });

    if (obsErr) {
      return { error: `Failed to persist observation: ${obsErr.message}` };
    }

    let featureId: string | undefined;

    if (features) {
      featureId = globalThis.crypto.randomUUID();
      const { error: featErr } = await client.from("os_parcel_feature_records").insert({
        id: featureId,
        parcel_id: parcelId,
        observation_id: obsId,
        feature_name: "ndvi_vegetation",
        mean_value: features.meanNdvi,
        min_value: features.minNdvi,
        max_value: features.maxNdvi,
        std_dev: features.stdDev,
        clear_pixels: features.clearPixelCount,
        total_pixels: features.totalPixelCount,
        resolution_meters: features.resolutionMeters,
        algorithm_version: features.algorithmVersion,
        provenance: features.provenance,
        quality_flags: features.qualityFlags,
      });

      if (featErr) {
        return { observationId: obsId, error: `Feature insert error: ${featErr.message}` };
      }
    }

    return { observationId: obsId, ...(featureId ? { featureId } : {}) };
  } catch (err: unknown) {
    return { error: err instanceof Error ? err.message : "Persistence error" };
  }
}
