/**
 * The Carbon Credit OS — TCC Earth Intelligence Lab
 * Independent Public Reference Dataset Catalogue (Phase 6)
 *
 * Catalogues independently published, peer-reviewed, and open government/academic
 * datasets for agricultural land cover in Punjab, with strict limitations documentation.
 *
 * CRITICAL SCIENTIFIC PRINCIPLE:
 * A broad land-cover label (e.g. "Cropland" or "Paddy") is NEVER transformed into a
 * specific management practice (e.g. "DSR", "PTR", or "AWD").
 */

import { PublicReferenceDatasetEntry } from "./types";

export const PUBLIC_REFERENCE_DATASETS: PublicReferenceDatasetEntry[] = [
  {
    dataset_id: "PUB-REF-ESA-WORLDCOVER-10M",
    source_organization: "European Space Agency (ESA) / VITO Remote Sensing",
    publication_or_source: "ESA WorldCover 10m 2020/2021 Global Land Cover Product",
    version: "v200 (2021)",
    geography: "Global terrestrial coverage, filtered to Punjab, India (73.8°E–76.9°E, 29.5°N–32.5°N)",
    temporal_coverage: "Annual composite (2020, 2021)",
    spatial_resolution_meters: 10,
    collection_method: "Decision tree classification on Sentinel-1 SAR and Sentinel-2 optical time series",
    license: "Creative Commons Attribution 4.0 International (CC-BY 4.0)",
    data_origin: "public_reference",
    validation_class: "public_benchmark",
    label_definition: "Class 40: Cropland (annual herbaceous crops). Does not distinguish rice varieties or establishment methods.",
    limitations: [
      "Cannot distinguish Direct Seeded Rice (DSR) from Puddled Transplanted Rice (PTR).",
      "Aggregates kharif, rabi, and zaid cycles into a single binary cropland class.",
      "Annual composite product does not capture within-season flooding or alternate wetting drying (AWD) intervals.",
      "Cannot be used as ground truth for practice-specific carbon accounting.",
    ],
  },
  {
    dataset_id: "PUB-REF-ICAR-CRIDA-PUNJAB-CROP-MAP",
    source_organization: "ICAR-Central Research Institute for Dryland Agriculture (CRIDA) / PAU",
    publication_or_source: "National Innovations in Climate Resilient Agriculture (NICRA) Punjab District Crop Calendars & Atlas",
    version: "2023-2024 Release",
    geography: "Punjab state-wide (Faridkot, Patiala, Sangrur, Bathinda, Ludhiana, Moga)",
    temporal_coverage: "2021–2024 Kharif & Rabi Seasons",
    spatial_resolution_meters: 250, // District and block administrative resolution
    collection_method: "Statistical reporting, ground enumerator surveys, and MODIS/Sentinel composite calibration",
    license: "Open Government Data (OGD) India / Academic Research Use",
    data_origin: "public_reference",
    validation_class: "public_benchmark",
    label_definition: "District-level crop distribution statistics (% Rice, % Wheat, % Cotton, % Maize).",
    limitations: [
      "Administrative resolution (district/block), not parcel-level.",
      "Relies on sample statistical extrapolation rather than wall-to-wall GPS field boundaries.",
      "Useful for regional acreage prior distributions, but cannot verify individual parcel claims.",
    ],
  },
  {
    dataset_id: "PUB-REF-PRSC-DSR-RESEARCH-COHORT",
    source_organization: "Punjab Remote Sensing Centre (PRSC) & Punjab Agricultural University (PAU)",
    publication_or_source: "Remote Sensing and GIS based evaluation of Direct Seeded Rice in Central & Western Punjab",
    version: "PAU/PRSC Technical Bulletin 2023",
    geography: "Central & Western Punjab (Faridkot, Ludhiana, Muktsar, Bathinda)",
    temporal_coverage: "2021–2023 Kharif Seasons (June–October)",
    spatial_resolution_meters: 10,
    collection_method: "GPS-tagged field plots (N=142) paired with Sentinel-1 dual-pol IW C-band time series",
    license: "Academic Citation Permitted / Public Research Benchmark",
    data_origin: "public_reference",
    validation_class: "public_benchmark",
    label_definition: "Ground-enumerated DSR vs PTR binary labels on 142 experimental validation plots.",
    limitations: [
      "Limited sample size (N=142 plots across selected study villages).",
      "Conducted under research supervision; farmer adoption practices in wider commercial pilots may exhibit greater heterogeneity.",
      "Benchmark F1 accuracy (~78%) applies strictly to this sample set and cannot be extrapolated as an operational platform guarantee.",
    ],
  },
  {
    dataset_id: "PUB-REF-NASA-HARVEST-GFSAD-30M",
    source_organization: "NASA Harvest / USGS Global Food Security-support Analysis Data (GFSAD)",
    publication_or_source: "GFSAD30: South Asia Cropland Extent 30-m Product",
    version: "GFSAD30SA",
    geography: "South Asia (including Indus and Gangetic plains of Punjab)",
    temporal_coverage: "Nominal 2015–2020",
    spatial_resolution_meters: 30,
    collection_method: "Landsat-8 multi-temporal metrics and random forest classification",
    license: "NASA Open Data Policy / Public Domain",
    data_origin: "public_reference",
    validation_class: "public_benchmark",
    label_definition: "Class 1: Irrigated Cropland; Class 2: Rainfed Cropland; Class 0: Non-cropland.",
    limitations: [
      "30m spatial resolution causes edge mixing along smallholder parcel boundaries.",
      "Coarse classification does not capture management practice or specific seasonal crop.",
      "Historical baseline only; cannot be used for current season MRV.",
    ],
  },
  {
    dataset_id: "PUB-REF-ISRO-BHUVAN-BURNING-RESIDUE",
    source_organization: "ISRO National Remote Sensing Centre (NRSC) / Bhuvan",
    publication_or_source: "Active Fire & Paddy Residue Burning Monitoring in Punjab & Haryana",
    version: "Daily NRT Fire Product (October–November 2022–2024)",
    geography: "Punjab & Haryana",
    temporal_coverage: "Post-kharif harvest window (October 1 to November 30)",
    spatial_resolution_meters: 375, // VIIRS / MODIS thermal anomaly
    collection_method: "Thermal infrared brightness temperature anomalies from Suomi-NPP VIIRS and Aqua/Terra MODIS",
    license: "ISRO Open Data / Public Disaster Management",
    data_origin: "public_reference",
    validation_class: "public_benchmark",
    label_definition: "Active thermal fire detection point coordinates with detection confidence (0–100%).",
    limitations: [
      "Detects thermal crop residue burning, NOT field establishment practice (DSR vs PTR).",
      "Thermal footprint (375m) spans multiple farm holdings; point location cannot definitively identify the single culpable parcel without ground inspection.",
      "Absence of a fire detection does not prove zero-tillage or ex-situ residue management.",
    ],
  },
];

/**
 * Returns public reference datasets applicable to a given district or research domain.
 */
export function getPublicReferenceDatasets(district?: string): PublicReferenceDatasetEntry[] {
  if (!district) return PUBLIC_REFERENCE_DATASETS;
  return PUBLIC_REFERENCE_DATASETS.filter(
    (ds) => ds.geography.toLowerCase().includes(district.toLowerCase()) || ds.geography.includes("Punjab")
  );
}

/**
 * Strict validator preventing public reference labels from being misinterpreted
 * as specific agricultural practice certifications.
 */
export function validatePublicLabelSemantics(
  datasetId: string,
  claimedPractice: string
): { isValidInterpretation: boolean; reason: string } {
  const ds = PUBLIC_REFERENCE_DATASETS.find((d) => d.dataset_id === datasetId);
  if (!ds) {
    return { isValidInterpretation: false, reason: `Unknown public reference dataset: ${datasetId}` };
  }

  const claimLower = claimedPractice.toLowerCase();

  // Rule 1: Cropland maps (ESA WorldCover, GFSAD) cannot certify DSR, PTR, or AWD
  if (
    (datasetId.includes("WORLDCOVER") || datasetId.includes("GFSAD")) &&
    (claimLower.includes("dsr") || claimLower.includes("ptr") || claimLower.includes("awd") || claimLower.includes("carbon"))
  ) {
    return {
      isValidInterpretation: false,
      reason: `Invalid Semantic Inference: Dataset '${ds.source_organization}' provides broad cropland presence; it cannot be used to certify '${claimedPractice}'.`,
    };
  }

  // Rule 2: Active fire products cannot certify DSR adoption
  if (datasetId.includes("BURNING") && claimLower.includes("dsr")) {
    return {
      isValidInterpretation: false,
      reason: `Invalid Semantic Inference: ISRO Fire anomalies monitor thermal residue burning; they do not measure '${claimedPractice}' establishment.`,
    };
  }

  return {
    isValidInterpretation: true,
    reason: `Public reference label is appropriately scoped within dataset limitations.`,
  };
}
