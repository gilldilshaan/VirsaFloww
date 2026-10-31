/**
 * The Carbon Credit OS — TCC Earth Intelligence Lab Types
 * Authoritative types enforcing strict data isolation between Synthetic,
 * Public Reference, and Farmer-Verified tiers.
 */

import { Corner } from "../geospatial/gis";

export type DataOrigin = "synthetic" | "public_reference" | "farmer_verified";

export type ValidationClass =
  | "engineering_only"
  | "public_benchmark"
  | "farmer_ground_truth";

export type LabelOrigin =
  | "simulated"
  | "public_literature"
  | "ground_truth_enumerator"
  | "unlabelled";

export type ScenarioCategory =
  | "rice_season"
  | "wheat_season"
  | "fallow"
  | "mixed_agriculture"
  | "water_flooded"
  | "other_land_cover";

export type PunjabDistrict =
  | "Faridkot"
  | "Patiala"
  | "Sangrur"
  | "Bathinda"
  | "Ludhiana"
  | "Moga"
  | "Ferozepur";

export type ParcelShapeProfile =
  | "small"
  | "medium"
  | "large"
  | "elongated"
  | "irregular"
  | "narrow"
  | "fragmented";

export interface GeoJsonPolygon {
  type: "Polygon";
  coordinates: Corner[][];
}

export interface SyntheticParcel {
  synthetic_parcel_id: string; // e.g. "TCC-SYN-PB-000001"
  dataset_id: string; // "TCC-EARTH-LAB-SYN-PUNJAB-V1"
  geometry: GeoJsonPolygon;
  district: PunjabDistrict;
  scenario_category: ScenarioCategory;
  shape_profile: ParcelShapeProfile;
  vertex_count: number;
  area_sq_meters: number;
  area_acres: number;
  area_kanal: number;
  area_marla: number;
  area_hectares: number;
  is_valid: boolean;
  generation_seed: number;
  generation_timestamp: string;
  data_origin: "synthetic";
  validation_class: "engineering_only";
}

export interface InvalidGeometryTestCase {
  case_id: string;
  error_type:
    | "self_intersection"
    | "duplicate_vertices"
    | "degenerate_polygon"
    | "wrong_ring_order"
    | "out_of_range_coords"
    | "empty_geometry"
    | "unclosed_ring";
  description: string;
  raw_coordinates: any;
  expected_failure_reason: string;
}

export interface OpticalSpectralIndices {
  ndvi: number; // Normalized Difference Vegetation Index: (B08 - B04)/(B08 + B04)
  ndmi: number; // Normalized Difference Moisture Index: (B08 - B11)/(B08 + B11)
  evi: number;  // Enhanced Vegetation Index: 2.5*(B08 - B04)/(B08 + 6*B04 - 7.5*B02 + 1)
  ndre: number; // Normalized Difference Red Edge: (B08 - B05)/(B08 + B05)
}

export interface SarRadarFeatures {
  vv_linear: number;
  vh_linear: number;
  vv_db: number;
  vh_db: number;
  vv_vh_ratio_linear: number;
  vv_minus_vh_db: number;
  cross_pol_ratio: number;
}

export interface ObservationQualityMetadata {
  valid_pixel_count: number;
  total_intersecting_pixels: number;
  coverage_pct: number;
  cloud_fraction: number;
  nodata_fraction: number;
  acquisition_date: string;
  source_asset_id: string;
  processing_version: string;
  units: Record<string, string>;
  quality_status:
    | "valid"
    | "partially_valid"
    | "cloud_contaminated"
    | "insufficient_coverage"
    | "missing_data"
    | "processing_failed";
}

export interface ParcelFeatureObservation {
  observation_id: string;
  dataset_id: string;
  parcel_id: string;
  parcel_origin: DataOrigin;
  acquisition_id: string;
  provider: string;
  timestamp: string;
  indices: OpticalSpectralIndices;
  radar?: SarRadarFeatures;
  quality: ObservationQualityMetadata;
  derived_from: string[];
}

export interface TemporalFeatureSummary {
  feature_name: string;
  count: number;
  min: number;
  max: number;
  mean: number;
  median: number;
  std_dev: number;
  p10: number;
  p25: number;
  p50: number;
  p75: number;
  p90: number;
  temporal_rate_of_change: number;
  is_interpolated: boolean;
  interpolation_method?: string;
}

export interface SyntheticScenarioTrajectory {
  scenario_id: string;
  scenario_category: ScenarioCategory;
  practice_type?: "DSR" | "PTR" | "AWD" | "Wheat_Conventional" | "Fallow" | "Flooded";
  data_origin: "synthetic";
  label_origin: "simulated";
  validation_class: "engineering_only";
  seed: number;
  observations: Array<{
    date: string;
    day_of_season: number;
    ndvi: number;
    ndmi: number;
    evi: number;
    ndre: number;
    vv_db: number;
    vh_db: number;
    is_cloud_contaminated: boolean;
    is_missing: boolean;
  }>;
  description: string;
  ambiguity_notes?: string;
}

export interface PublicReferenceDatasetEntry {
  dataset_id: string;
  source_organization: string;
  publication_or_source: string;
  version: string;
  geography: string;
  temporal_coverage: string;
  spatial_resolution_meters: number;
  collection_method: string;
  license: string;
  data_origin: "public_reference";
  validation_class: "public_benchmark";
  label_definition: string;
  limitations: string[];
}

export interface ModelBenchmarkResult {
  benchmark_id: string;
  dataset_id: string;
  dataset_category: DataOrigin;
  pipeline_type: "sentinel_only" | "olmoearth_only" | "fused_multimodal";
  feature_dimension: number;
  training_split: string;
  testing_split: string;
  evaluation_timestamp: string;
  label_source: LabelOrigin;
  evaluation_status: "EVALUATED" | "NOT_EVALUATED";
  metrics?: {
    accuracy: number;
    precision: number;
    recall: number;
    f1_score: number;
    confusion_matrix: number[][];
    class_report: Record<string, { precision: number; recall: number; f1: number; support: number }>;
  };
  contract_checks: {
    input_contract_valid: boolean;
    embedding_dimension_exact: boolean;
    nodata_properly_handled: boolean;
    inference_latency_ms: number;
    memory_delta_mb: number;
  };
  limitations: string[];
}
