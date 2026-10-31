/**
 * The Carbon Credit OS — TCC Earth Intelligence Lab
 * Satellite Feature Extraction Engine (Phase 3)
 *
 * Reusable, browser-safe, and server-safe feature extraction layer for:
 * 1. Multispectral Indices: NDVI, NDMI, EVI, NDRE with categorical SCL masking.
 * 2. SAR Microwave Features: Calibrated VV, VH (linear & dB), cross-ratios, inundation.
 * 3. Temporal Series Summaries: min, max, mean, median, stdDev, percentiles, rate of change.
 *
 * Guarantees zero fabricated data and transparent quality tracking.
 */

import {
  OpticalSpectralIndices,
  SarRadarFeatures,
  ObservationQualityMetadata,
  TemporalFeatureSummary,
} from "./types";
import { sarLinearToDecibels, sarDecibelsToLinear } from "../satellite/sentinel-pipeline";

/**
 * Normalized Difference Vegetation Index (NDVI)
 * Formula: (NIR - Red) / (NIR + Red)
 * Surface reflectance inputs must be in [0.0, 1.0] or raw scaled values.
 * Output bounded in [-1.0, 1.0]. Returns 0 if denominator is 0.
 */
export function calculateNdvi(nir: number, red: number): number {
  if (!Number.isFinite(nir) || !Number.isFinite(red)) return 0;
  const denom = nir + red;
  if (Math.abs(denom) < 1e-6) return 0;
  const raw = (nir - red) / denom;
  return Math.max(-1.0, Math.min(1.0, Math.round(raw * 10000) / 10000));
}

/**
 * Normalized Difference Moisture Index (NDMI)
 * Formula: (NIR - SWIR) / (NIR + SWIR)
 * Typically Sentinel-2 Band 8 (NIR, 842nm) and Band 11 (SWIR1, 1610nm).
 * Output bounded in [-1.0, 1.0]. Returns 0 if denominator is 0.
 *
 * Note: NDMI indicates canopy water content, NOT direct deep subsurface soil moisture.
 */
export function calculateNdmi(nir: number, swir: number): number {
  if (!Number.isFinite(nir) || !Number.isFinite(swir)) return 0;
  const denom = nir + swir;
  if (Math.abs(denom) < 1e-6) return 0;
  const raw = (nir - swir) / denom;
  return Math.max(-1.0, Math.min(1.0, Math.round(raw * 10000) / 10000));
}

/**
 * Enhanced Vegetation Index (EVI)
 * Formula: 2.5 * (NIR - Red) / (NIR + 6.0 * Red - 7.5 * Blue + 1.0)
 * Uses Sentinel-2 Band 8 (NIR), Band 4 (Red), and Band 2 (Blue).
 * Inputs must be scaled surface reflectance in [0.0, 1.0].
 * If inputs are integer DN [0, 10000], they are normalized by 10000.
 */
export function calculateEvi(nir: number, red: number, blue: number): number {
  if (!Number.isFinite(nir) || !Number.isFinite(red) || !Number.isFinite(blue)) return 0;

  // Auto-normalize if provided as raw 10,000-scaled integers
  let n = nir;
  let r = red;
  let b = blue;
  if (n > 1.5 || r > 1.5 || b > 1.5) {
    n = n / 10000.0;
    r = r / 10000.0;
    b = b / 10000.0;
  }

  const denom = n + 6.0 * r - 7.5 * b + 1.0;
  if (Math.abs(denom) < 1e-6) return 0;
  const raw = (2.5 * (n - r)) / denom;
  return Math.max(-1.5, Math.min(1.5, Math.round(raw * 10000) / 10000));
}

/**
 * Normalized Difference Red Edge Index (NDRE)
 * Formula: (NIR - RedEdge) / (NIR + RedEdge)
 * Uses Sentinel-2 Band 8 (NIR, 842nm) and Band 5 (Red Edge 1, 705nm).
 * Highly sensitive to chlorophyll variations at late vegetative stages where NDVI saturates.
 */
export function calculateNdre(nir: number, redEdge: number): number {
  if (!Number.isFinite(nir) || !Number.isFinite(redEdge)) return 0;
  const denom = nir + redEdge;
  if (Math.abs(denom) < 1e-6) return 0;
  const raw = (nir - redEdge) / denom;
  return Math.max(-1.0, Math.min(1.0, Math.round(raw * 10000) / 10000));
}

/**
 * Scene Classification Layer (SCL) Categorical Mask Filter:
 * Returns true if pixel is clear agricultural land or vegetation.
 * Masks out:
 * - 0: No Data
 * - 1: Saturated or Defective
 * - 2: Dark Area Pixels / Cast Shadows
 * - 3: Cloud Shadows
 * - 8: Cloud Medium Probability
 * - 9: Cloud High Probability
 * - 10: Thin Cirrus
 * - 11: Snow or Ice
 */
export function isSclValidPixel(scl: number): boolean {
  // SCL classes: 4 (Vegetation), 5 (Not-vegetated/Bare soil), 6 (Water), 7 (Unclassified)
  return scl === 4 || scl === 5 || scl === 6 || scl === 7;
}

export function isSclCloudOrShadow(scl: number): boolean {
  return scl === 3 || scl === 8 || scl === 9 || scl === 10;
}

export interface PixelBandArrays {
  b02_blue: number[];
  b04_red: number[];
  b05_rededge: number[];
  b08_nir: number[];
  b11_swir: number[];
  scl?: number[];
}

/**
 * Computes aggregated parcel spectral indices from pixel arrays,
 * strictly applying categorical SCL filtering.
 */
export function extractMultispectralFeatures(
  bands: PixelBandArrays,
  sourceAssetId: string,
  acquisitionDate: string
): {
  indices: OpticalSpectralIndices;
  quality: ObservationQualityMetadata;
} {
  const totalPixels = bands.b08_nir.length;
  if (totalPixels === 0) {
    return {
      indices: { ndvi: 0, ndmi: 0, evi: 0, ndre: 0 },
      quality: {
        valid_pixel_count: 0,
        total_intersecting_pixels: 0,
        coverage_pct: 0,
        cloud_fraction: 0,
        nodata_fraction: 1.0,
        acquisition_date: acquisitionDate,
        source_asset_id: sourceAssetId,
        processing_version: "1.0.0-tcc-multispectral",
        units: { ndvi: "ratio [-1, 1]", ndmi: "ratio [-1, 1]", evi: "ratio [-1.5, 1.5]", ndre: "ratio [-1, 1]" },
        quality_status: "missing_data",
      },
    };
  }

  let cloudCount = 0;
  let nodataCount = 0;
  const validNdvi: number[] = [];
  const validNdmi: number[] = [];
  const validEvi: number[] = [];
  const validNdre: number[] = [];

  for (let i = 0; i < totalPixels; i++) {
    const nir = bands.b08_nir[i];
    const red = bands.b04_red[i];
    const blue = bands.b02_blue[i];
    const redEdge = bands.b05_rededge[i];
    const swir = bands.b11_swir[i];
    const scl = bands.scl ? bands.scl[i] : 4; // default to 4 (vegetation) if no SCL band

    if (nir === undefined || red === undefined || blue === undefined || redEdge === undefined || swir === undefined) {
      nodataCount++;
      continue;
    }

    if (scl !== undefined) {
      if (isSclCloudOrShadow(scl)) {
        cloudCount++;
        continue;
      }
      if (!isSclValidPixel(scl)) {
        nodataCount++;
        continue;
      }
    }

    // Surface reflectance validation
    if (nir <= 0 && red <= 0 && blue <= 0) {
      nodataCount++;
      continue;
    }

    validNdvi.push(calculateNdvi(nir, red));
    validNdmi.push(calculateNdmi(nir, swir));
    validEvi.push(calculateEvi(nir, red, blue));
    validNdre.push(calculateNdre(nir, redEdge));
  }

  const validCount = validNdvi.length;
  const coveragePct = Number(((validCount / totalPixels) * 100).toFixed(1));
  const cloudFraction = Number((cloudCount / totalPixels).toFixed(3));
  const nodataFraction = Number((nodataCount / totalPixels).toFixed(3));

  let qualityStatus: ObservationQualityMetadata["quality_status"] = "valid";
  if (validCount === 0) qualityStatus = "insufficient_coverage";
  else if (cloudFraction > 0.25) qualityStatus = "cloud_contaminated";
  else if (coveragePct < 70) qualityStatus = "partially_valid";

  const mean = (arr: number[]) => (arr.length > 0 ? arr.reduce((a, b) => a + b, 0) / arr.length : 0);

  return {
    indices: {
      ndvi: Number(mean(validNdvi).toFixed(4)),
      ndmi: Number(mean(validNdmi).toFixed(4)),
      evi: Number(mean(validEvi).toFixed(4)),
      ndre: Number(mean(validNdre).toFixed(4)),
    },
    quality: {
      valid_pixel_count: validCount,
      total_intersecting_pixels: totalPixels,
      coverage_pct: coveragePct,
      cloud_fraction: cloudFraction,
      nodata_fraction: nodataFraction,
      acquisition_date: acquisitionDate,
      source_asset_id: sourceAssetId,
      processing_version: "1.0.0-tcc-multispectral",
      units: { ndvi: "ratio [-1, 1]", ndmi: "ratio [-1, 1]", evi: "ratio [-1.5, 1.5]", ndre: "ratio [-1, 1]" },
      quality_status: qualityStatus,
    },
  };
}

/**
 * Extracts comprehensive Sentinel-1 SAR microwave features.
 * Preserves strict separation between linear power and decibels.
 */
export function extractSarFeatures(
  vvLinearPixels: number[],
  vhLinearPixels: number[]
): SarRadarFeatures | null {
  const validVv = vvLinearPixels.filter((v) => Number.isFinite(v) && v > 0);
  const validVh = vhLinearPixels.filter((v) => Number.isFinite(v) && v > 0);

  if (validVv.length === 0 || validVh.length === 0) {
    return null;
  }

  const meanLinVv = validVv.reduce((a, b) => a + b, 0) / validVv.length;
  const meanLinVh = validVh.reduce((a, b) => a + b, 0) / validVh.length;

  const vvDb = sarLinearToDecibels(meanLinVv);
  const vhDb = sarLinearToDecibels(meanLinVh);

  // Linear ratio: VV / VH
  const vvVhRatioLinear = meanLinVh > 0 ? Number((meanLinVv / meanLinVh).toFixed(4)) : 0;

  // Logarithmic difference: VV_dB - VH_dB (equivalent to 10 * log10(VV_lin / VH_lin))
  const vvMinusVhDb = Number((vvDb - vhDb).toFixed(2));

  // Cross-polarization ratio: VH_dB - VV_dB (frequently used for canopy volume scattering)
  const crossPolRatio = Number((vhDb - vvDb).toFixed(2));

  return {
    vv_linear: Number(meanLinVv.toFixed(6)),
    vh_linear: Number(meanLinVh.toFixed(6)),
    vv_db: vvDb,
    vh_db: vhDb,
    vv_vh_ratio_linear: vvVhRatioLinear,
    vv_minus_vh_db: vvMinusVhDb,
    cross_pol_ratio: crossPolRatio,
  };
}

/**
 * Computes temporal feature summary over an array of numeric observations.
 * Supports exact quantiles, rate of change, and handles missing/empty data.
 */
export function computeTemporalFeatureSummary(
  values: number[],
  featureName: string,
  daysBetweenFirstAndLast: number = 30,
  isInterpolated: boolean = false
): TemporalFeatureSummary {
  const clean = values.filter((v) => Number.isFinite(v)).sort((a, b) => a - b);
  const count = clean.length;

  if (count === 0) {
    return {
      feature_name: featureName,
      count: 0,
      min: 0,
      max: 0,
      mean: 0,
      median: 0,
      std_dev: 0,
      p10: 0,
      p25: 0,
      p50: 0,
      p75: 0,
      p90: 0,
      temporal_rate_of_change: 0,
      is_interpolated: isInterpolated,
    };
  }

  const min = clean[0]!;
  const max = clean[count - 1]!;
  const sum = clean.reduce((a, b) => a + b, 0);
  const mean = Number((sum / count).toFixed(4));

  const percentile = (p: number) => {
    const idx = (p / 100) * (count - 1);
    const low = Math.floor(idx);
    const high = Math.ceil(idx);
    const weight = idx - low;
    return Number((clean[low]! * (1 - weight) + clean[high]! * weight).toFixed(4));
  };

  const median = percentile(50);
  const p10 = percentile(10);
  const p25 = percentile(25);
  const p50 = median;
  const p75 = percentile(75);
  const p90 = percentile(90);

  // Standard deviation
  const variance = clean.reduce((acc, v) => acc + Math.pow(v - mean, 2), 0) / count;
  const stdDev = Number(Math.sqrt(variance).toFixed(4));

  // Rate of change per day: (last - first) / days
  const rateOfChange =
    daysBetweenFirstAndLast > 0 ? Number(((max - min) / daysBetweenFirstAndLast).toFixed(5)) : 0;

  return {
    feature_name: featureName,
    count,
    min,
    max,
    mean,
    median,
    std_dev: stdDev,
    p10,
    p25,
    p50,
    p75,
    p90,
    temporal_rate_of_change: rateOfChange,
    is_interpolated: isInterpolated,
  };
}
