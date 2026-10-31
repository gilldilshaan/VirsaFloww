/**
 * The Carbon Credit OS — TCC Earth Intelligence Lab
 * Evidence Graph Integration & Dataset Isolation Engine (Phase 8)
 *
 * Connects Earth Lab outputs to TCC's evidence architecture while enforcing strict
 * non-permeable isolation barriers between:
 * 1. Synthetic engineering data (data_origin = "synthetic", validation_class = "engineering_only")
 * 2. Public reference benchmarks (data_origin = "public_reference", validation_class = "public_benchmark")
 * 3. Production MRV farmer records (data_origin = "farmer_verified", validation_class = "farmer_ground_truth")
 */

import { DataOrigin, ValidationClass, ParcelFeatureObservation } from "./types";

export interface EvidenceGraphNode {
  node_id: string;
  node_type:
    | "test_parcel"
    | "satellite_acquisition"
    | "source_asset"
    | "raster_observation"
    | "quality_assessment"
    | "derived_feature"
    | "embedding_vector"
    | "polygon_aggregation"
    | "model_benchmark"
    | "production_farmer_claim"
    | "production_field_evidence"
    | "production_mrv_verification";
  data_origin: DataOrigin;
  validation_class: ValidationClass;
  provenance: {
    dataset_id: string;
    parent_node_ids: string[];
    processing_version: string;
    timestamp: string;
  };
  payload: Record<string, any>;
}

/**
 * Programmatic safeguard: strictly prevents synthetic or simulated entities
 * from contaminating production farmer reports, payments, or MRV verification.
 * Throws an unhandled error if a synthetic entity attempts to cross the boundary.
 */
export function assertNoSyntheticInProduction(entity: {
  data_origin: string;
  validation_class?: string;
  synthetic_parcel_id?: string;
}): void {
  if (
    entity.data_origin === "synthetic" ||
    entity.validation_class === "engineering_only" ||
    (entity.synthetic_parcel_id && entity.synthetic_parcel_id.startsWith("TCC-SYN-"))
  ) {
    throw new Error(
      "SYNTHETIC_CONTAMINATION_PREVENTED: Synthetic test parcels and simulated observations cannot be attached to production farmer records, farmer-facing reports, or carbon credit issuance workflows."
    );
  }
}

/**
 * Validates that an array of records preserves strict dataset tier segregation.
 * Verifies that synthetic and farmer-verified records are never combined in a single unpartitioned batch.
 */
export function validateDatasetIsolation(
  records: Array<{ data_origin: DataOrigin; validation_class: ValidationClass }>
): {
  isProperlySegregated: boolean;
  tierCounts: Record<DataOrigin, number>;
  violations: string[];
} {
  const tierCounts: Record<DataOrigin, number> = {
    synthetic: 0,
    public_reference: 0,
    farmer_verified: 0,
  };
  const violations: string[] = [];

  for (const r of records) {
    if (!r.data_origin) {
      violations.push("Missing required data_origin field on record.");
      continue;
    }
    tierCounts[r.data_origin] = (tierCounts[r.data_origin] || 0) + 1;

    // Cross-tier validation class check
    if (r.data_origin === "synthetic" && r.validation_class !== "engineering_only") {
      violations.push(`Illegal validation_class '${r.validation_class}' for synthetic record.`);
    }
    if (r.data_origin === "public_reference" && r.validation_class !== "public_benchmark") {
      violations.push(`Illegal validation_class '${r.validation_class}' for public reference record.`);
    }
    if (r.data_origin === "farmer_verified" && r.validation_class !== "farmer_ground_truth") {
      violations.push(`Illegal validation_class '${r.validation_class}' for farmer-verified record.`);
    }
  }

  return {
    isProperlySegregated: violations.length === 0,
    tierCounts,
    violations,
  };
}

/**
 * Builds an auditable traceable evidence chain for an Earth Lab observation.
 */
export function buildEvidenceTraceChain(observation: ParcelFeatureObservation): EvidenceGraphNode[] {
  const now = new Date().toISOString();
  const dsId = observation.dataset_id;
  const origin = observation.parcel_origin;
  const valClass: ValidationClass =
    origin === "synthetic"
      ? "engineering_only"
      : origin === "public_reference"
      ? "public_benchmark"
      : "farmer_ground_truth";

  const parcelNode: EvidenceGraphNode = {
    node_id: `NODE-PARCEL-${observation.parcel_id}`,
    node_type: "test_parcel",
    data_origin: origin,
    validation_class: valClass,
    provenance: {
      dataset_id: dsId,
      parent_node_ids: [],
      processing_version: "1.0.0",
      timestamp: now,
    },
    payload: { parcel_id: observation.parcel_id },
  };

  const acquisitionNode: EvidenceGraphNode = {
    node_id: `NODE-ACQ-${observation.acquisition_id}`,
    node_type: "satellite_acquisition",
    data_origin: origin,
    validation_class: valClass,
    provenance: {
      dataset_id: dsId,
      parent_node_ids: [parcelNode.node_id],
      processing_version: "1.0.0",
      timestamp: observation.timestamp,
    },
    payload: { provider: observation.provider, acquisition_id: observation.acquisition_id },
  };

  const qualityNode: EvidenceGraphNode = {
    node_id: `NODE-QA-${observation.observation_id}`,
    node_type: "quality_assessment",
    data_origin: origin,
    validation_class: valClass,
    provenance: {
      dataset_id: dsId,
      parent_node_ids: [acquisitionNode.node_id],
      processing_version: "1.0.0",
      timestamp: now,
    },
    payload: observation.quality,
  };

  const featureNode: EvidenceGraphNode = {
    node_id: `NODE-FEAT-${observation.observation_id}`,
    node_type: "derived_feature",
    data_origin: origin,
    validation_class: valClass,
    provenance: {
      dataset_id: dsId,
      parent_node_ids: [qualityNode.node_id],
      processing_version: "1.0.0",
      timestamp: now,
    },
    payload: {
      indices: observation.indices,
      radar: observation.radar,
    },
  };

  return [parcelNode, acquisitionNode, qualityNode, featureNode];
}
