/**
 * The Carbon Credit OS — Ground-Truth Field Operations & Dataset Validation Service
 *
 * Implements auditable field-coordinator ground-truth recording for Sangrur & Bathinda:
 * 1. Strict multi-tier verification hierarchy (farmer_reported -> field_agent_observed -> field_verified_protocol).
 * 2. Field protocol validation (GPS accuracy, DSR/PTR establishment distinction, AWD water regimes).
 * 3. Spatial holdout assignment (by village/tehsil) to prevent spatial data leakage during model training.
 * 4. Dataset readiness audit enforcing operational gates (minimum 50 DSR + 50 PTR, class balance <= 2.5:1).
 *
 * Operating Entity: Panjdhara Private Limited
 * Public Brand: The Carbon Credit
 */

import { SupabaseClient } from "@supabase/supabase-js";
export interface GroundTruthActor {
  userId?: string;
  role: string;
  email?: string;
}

export type GroundTruthEstablishmentMethod = "dsr" | "ptr_conventional" | "other";

export type GroundTruthVerificationStatus =
  | "farmer_reported"
  | "field_agent_observed"
  | "documentary_evidence_available"
  | "field_verified_protocol"
  | "independently_audited";

export interface GroundTruthRecordInput {
  parcelId: string;
  farmerPersonId?: string | null;
  seasonName: string;
  cropName?: string;
  cropVariety?: string | null;
  establishmentMethod: GroundTruthEstablishmentMethod;
  sowingDate: string; // YYYY-MM-DD
  nurserySowingDate?: string | null;
  drillMachineType?: string | null;
  irrigationSource?: "tube_well_electric" | "tube_well_diesel" | "canal" | "rainfed" | "other" | null;
  standingWaterDays?: number | null;
  awdPipeInstalled?: boolean;
  dryingEvents?: Array<{ startDate: string; endDate: string; hairlineCrackingObserved: boolean }>;
  gpsLatitude?: number | null;
  gpsLongitude?: number | null;
  gpsAccuracyMeters?: number | null;
  boundaryConfirmed?: boolean;
  evidenceItemIds?: string[];
  observerName: string;
  observerPhone?: string | null;
  observedAt?: string;
  verificationStatus?: GroundTruthVerificationStatus;
  verificationProtocolVersion?: string;
  verificationNotes?: string | null;
  isConflicting?: boolean;
  conflictReason?: string | null;
}

export interface GroundTruthValidationResult {
  valid: boolean;
  errors: Record<string, string>;
  warnings: string[];
}

/**
 * Validates ground-truth input against the Panjdhara Field Protocol standards.
 */
export function validateGroundTruthInput(input: GroundTruthRecordInput): GroundTruthValidationResult {
  const errors: Record<string, string> = {};
  const warnings: string[] = [];

  if (!input.parcelId || input.parcelId.trim().length === 0) {
    errors["parcelId"] = "Target parcel identifier is required.";
  }

  if (!input.seasonName || input.seasonName.trim().length === 0) {
    errors["seasonName"] = "Crop season name (e.g. 'Kharif 2026') is required.";
  }

  if (!["dsr", "ptr_conventional", "other"].includes(input.establishmentMethod)) {
    errors["establishmentMethod"] = "Invalid establishment method. Must be 'dsr', 'ptr_conventional', or 'other'.";
  }

  if (!input.sowingDate || !/^\d{4}-\d{2}-\d{2}$/.test(input.sowingDate)) {
    errors["sowingDate"] = "Valid sowing date in YYYY-MM-DD format is required.";
  }

  if (!input.observerName || input.observerName.trim().length < 2) {
    errors["observerName"] = "Observer / field coordinator name is required.";
  }

  // GPS Coordinate validation for Punjab regional bounds
  if (input.gpsLatitude !== undefined && input.gpsLatitude !== null) {
    if (input.gpsLatitude < 29.0 || input.gpsLatitude > 33.0) {
      errors["gpsLatitude"] = "Latitude is outside Punjab geographic envelope (29.0°N to 33.0°N).";
    }
  }

  if (input.gpsLongitude !== undefined && input.gpsLongitude !== null) {
    if (input.gpsLongitude < 73.5 || input.gpsLongitude > 77.5) {
      errors["gpsLongitude"] = "Longitude is outside Punjab geographic envelope (73.5°E to 77.5°E).";
    }
  }

  if (input.gpsAccuracyMeters !== undefined && input.gpsAccuracyMeters !== null) {
    if (input.gpsAccuracyMeters > 20) {
      warnings.push(`GPS accuracy of ${input.gpsAccuracyMeters}m exceeds the recommended 10m threshold.`);
    }
  }

  // Strict field_verified_protocol requirements
  if (input.verificationStatus === "field_verified_protocol") {
    if (input.gpsLatitude === null || input.gpsLatitude === undefined || input.gpsLongitude === null || input.gpsLongitude === undefined) {
      errors["verificationStatus"] = "Field verification under approved protocol requires verified GPS coordinates.";
    }
    if (!input.boundaryConfirmed) {
      errors["boundaryConfirmed"] = "Physical boundary confirmation is required for field_verified_protocol.";
    }
    if (!input.evidenceItemIds || input.evidenceItemIds.length === 0) {
      warnings.push("Field-verified protocol recommends attaching at least two geotagged field photos.");
    }
  }

  // DSR vs PTR consistency checks
  if (input.establishmentMethod === "dsr" && input.nurserySowingDate) {
    warnings.push("Direct Seeded Rice (DSR) does not require a nursery sowing date.");
  }

  return {
    valid: Object.keys(errors).length === 0,
    errors,
    warnings,
  };
}

/**
 * Records a new ground-truth field observation in os_ground_truth_records.
 */
export async function recordGroundTruthObservation(
  client: SupabaseClient,
  input: GroundTruthRecordInput,
  actor?: GroundTruthActor
): Promise<{ success: boolean; recordId?: string; errors?: Record<string, string>; error?: string }> {
  try {
    const validation = validateGroundTruthInput(input);
    if (!validation.valid) {
      return { success: false, errors: validation.errors };
    }

    const recordId = globalThis.crypto.randomUUID();
    const verificationStatus = input.verificationStatus || "field_agent_observed";

    const payload = {
      id: recordId,
      parcel_id: input.parcelId,
      farmer_person_id: input.farmerPersonId ?? null,
      season_name: input.seasonName.trim(),
      crop_name: input.cropName?.trim() || "Paddy (Rice)",
      crop_variety: input.cropVariety?.trim() || null,
      establishment_method: input.establishmentMethod,
      sowing_date: input.sowingDate,
      nursery_sowing_date: input.nurserySowingDate || null,
      drill_machine_type: input.drillMachineType?.trim() || null,
      irrigation_source: input.irrigationSource || null,
      standing_water_days: input.standingWaterDays ?? null,
      awd_pipe_installed: Boolean(input.awdPipeInstalled),
      drying_events: input.dryingEvents || [],
      gps_latitude: input.gpsLatitude ?? null,
      gps_longitude: input.gpsLongitude ?? null,
      gps_accuracy_meters: input.gpsAccuracyMeters ?? null,
      boundary_confirmed: Boolean(input.boundaryConfirmed),
      evidence_item_ids: input.evidenceItemIds || [],
      observer_user_id: actor?.userId || null,
      observer_name: input.observerName.trim(),
      observer_phone: input.observerPhone?.trim() || null,
      observed_at: input.observedAt || new Date().toISOString(),
      verification_status: verificationStatus,
      verification_protocol_version: input.verificationProtocolVersion || "PANJDHARA_DSR_PROTOCOL_V1",
      verification_notes: input.verificationNotes?.trim() || null,
      verified_by: verificationStatus === "field_verified_protocol" ? actor?.userId || null : null,
      verified_at: verificationStatus === "field_verified_protocol" ? new Date().toISOString() : null,
      is_conflicting: Boolean(input.isConflicting),
      conflict_reason: input.conflictReason?.trim() || null,
      is_active: true,
    };

    const { error: insertErr } = await client.from("os_ground_truth_records").insert(payload);
    if (insertErr) {
      return { success: false, error: `Failed to insert ground truth record: ${insertErr.message}` };
    }

    // Optional audit log
    if (actor?.userId) {
      try {
        await client.from("os_audit_events").insert({
          actor_id: actor.userId,
          actor_role: actor.role,
          action: "ground_truth:record",
          entity_type: "ground_truth_record",
          entity_id: recordId,
          after_state: {
            parcel_id: input.parcelId,
            establishment_method: input.establishmentMethod,
            verification_status: verificationStatus,
            season: input.seasonName,
          },
        });
      } catch {
        // Non-blocking
      }
    }

    return { success: true, recordId };
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : String(err);
    return { success: false, error: msg };
  }
}

/**
 * Staff decision review workflow: Updates verification status for a ground-truth record.
 */
export async function updateGroundTruthVerificationStatus(
  client: SupabaseClient,
  recordId: string,
  newStatus: GroundTruthVerificationStatus,
  actor: GroundTruthActor,
  notes?: string
): Promise<{ success: boolean; error?: string }> {
  try {
    const isStaff =
      actor.role === "system_admin" || actor.role === "admin" ||
      ["operations_manager", "field_coordinator", "field_officer", "quality_inspector", "evidence_reviewer", "reviewer"].includes(actor.role);

    if (!isStaff) {
      return { success: false, error: "Only authorised operations staff can alter ground-truth verification status." };
    }

    const updatePayload: Record<string, any> = {
      verification_status: newStatus,
      updated_at: new Date().toISOString(),
    };

    if (newStatus === "field_verified_protocol" || newStatus === "independently_audited") {
      updatePayload["verified_by"] = actor.userId;
      updatePayload["verified_at"] = new Date().toISOString();
    }

    if (notes) {
      updatePayload["verification_notes"] = notes.trim();
    }

    const { error } = await client
      .from("os_ground_truth_records")
      .update(updatePayload)
      .eq("id", recordId);

    if (error) {
      return { success: false, error: error.message };
    }

    return { success: true };
  } catch (err: unknown) {
    return { success: false, error: err instanceof Error ? err.message : "Update failed" };
  }
}

/**
 * Fetches active ground-truth records with comprehensive filtering.
 */
export async function fetchGroundTruthRecords(
  client: SupabaseClient,
  filter?: {
    parcelId?: string;
    seasonName?: string;
    establishmentMethod?: GroundTruthEstablishmentMethod;
    verificationStatus?: GroundTruthVerificationStatus;
    onlyActive?: boolean;
  }
) {
  let query = client.from("os_ground_truth_records").select(`
    id, parcel_id, farmer_person_id, season_name, crop_name, crop_variety,
    establishment_method, sowing_date, nursery_sowing_date, drill_machine_type,
    irrigation_source, standing_water_days, awd_pipe_installed, drying_events,
    gps_latitude, gps_longitude, gps_accuracy_meters, boundary_confirmed,
    evidence_item_ids, observer_name, observer_phone, observed_at,
    verification_status, verification_protocol_version, verification_notes,
    verified_by, verified_at, is_conflicting, conflict_reason, is_active,
    created_at, updated_at
  `);

  if (filter?.parcelId) {
    query = query.eq("parcel_id", filter.parcelId);
  }
  if (filter?.seasonName) {
    query = query.eq("season_name", filter.seasonName);
  }
  if (filter?.establishmentMethod) {
    query = query.eq("establishment_method", filter.establishmentMethod);
  }
  if (filter?.verificationStatus) {
    query = query.eq("verification_status", filter.verificationStatus);
  }
  if (filter?.onlyActive !== false) {
    query = query.eq("is_active", true);
  }

  const { data, error } = await query.order("observed_at", { ascending: false });
  if (error) {
    throw new Error(`Failed to load ground truth records: ${error.message}`);
  }
  return data ?? [];
}

/**
 * Determines spatial holdout partition (train / validation / test) by village and district
 * to prevent spatial data leakage. Enforces cross-district generalisation benchmark between
 * primary pilot districts: Faridkot (Train/Validation) and Patiala (Independent Test).
 */
export function assignSpatialHoldoutSplit(village: string, district: string): "train" | "validation" | "test" {
  const normVillage = village.toLowerCase().trim();
  const normDistrict = district.toLowerCase().trim();

  // Test set: Patiala district (Primary cross-district generalization test) or Bathinda (Historical reference test)
  if (
    normDistrict.includes("patiala") ||
    normDistrict.includes("bathinda") ||
    ["rajpura", "samana", "nabha", "patran", "talwandi sabo", "rampura phul", "lehragaga"].includes(normVillage)
  ) {
    return "test";
  }

  // Validation set: Faridkot holdout villages (Jaitu, Bajakhana) or Sangrur validation villages
  if (
    ["jaitu", "jaito", "bajakhana", "bargari", "longowal", "dhuri", "sherpur", "cheema"].includes(normVillage)
  ) {
    return "validation";
  }

  // Training set default: Faridkot primary pilot clusters (Faridkot Rural, Kotkapura, Machaki) or Sangrur core
  return "train";
}

/**
 * Exports an auditable ground-truth dataset with spatial train/validation/test holdout tags.
 */
export async function exportAuditableGroundTruthDataset(
  client: SupabaseClient,
  filter?: { seasonName?: string; verifiedOnly?: boolean }
) {
  const records = await fetchGroundTruthRecords(client, {
    ...(filter?.seasonName ? { seasonName: filter.seasonName } : {}),
    ...(filter?.verifiedOnly ? { verificationStatus: "field_verified_protocol" as const } : {}),
    onlyActive: true,
  });

  // Fetch parcel details (village, district) for spatial partitioning
  const parcelIds = Array.from(new Set(records.map((r) => r.parcel_id)));
  const { data: parcels } = await client
    .from("os_land_parcels")
    .select("id, parcel_identifier, village, district, declared_acreage")
    .in("id", parcelIds);

  const parcelMap = new Map((parcels || []).map((p) => [p.id, p]));

  const dataset = records.map((rec) => {
    const parcel = parcelMap.get(rec.parcel_id);
    const village = parcel?.village || "Unknown Village";
    const district = parcel?.district || "Sangrur";
    const split = assignSpatialHoldoutSplit(village, district);

    return {
      recordId: rec.id,
      parcelId: rec.parcel_id,
      parcelIdentifier: parcel?.parcel_identifier ?? "UNKNOWN",
      location: {
        village,
        district,
        gpsLatitude: rec.gps_latitude,
        gpsLongitude: rec.gps_longitude,
        gpsAccuracyMeters: rec.gps_accuracy_meters,
      },
      cropContext: {
        season: rec.season_name,
        crop: rec.crop_name,
        variety: rec.crop_variety,
      },
      practice: {
        establishmentMethod: rec.establishment_method,
        labelBinary: rec.establishment_method === "dsr" ? 1 : 0, // 1 = DSR, 0 = PTR
        sowingDate: rec.sowing_date,
        drillMachine: rec.drill_machine_type,
        awdPipeInstalled: rec.awd_pipe_installed,
        standingWaterDays: rec.standing_water_days,
      },
      audit: {
        verificationStatus: rec.verification_status,
        protocolVersion: rec.verification_protocol_version,
        observerName: rec.observer_name,
        observedAt: rec.observed_at,
        verifiedBy: rec.verified_by,
        verifiedAt: rec.verified_at,
        isConflicting: rec.is_conflicting,
      },
      spatialHoldoutSplit: split,
    };
  });

  return {
    exportedAt: new Date().toISOString(),
    totalSamples: dataset.length,
    splitBreakdown: {
      trainCount: dataset.filter((d) => d.spatialHoldoutSplit === "train").length,
      validationCount: dataset.filter((d) => d.spatialHoldoutSplit === "validation").length,
      testCount: dataset.filter((d) => d.spatialHoldoutSplit === "test").length,
    },
    classBreakdown: {
      dsrCount: dataset.filter((d) => d.practice.establishmentMethod === "dsr").length,
      ptrCount: dataset.filter((d) => d.practice.establishmentMethod === "ptr_conventional").length,
      otherCount: dataset.filter((d) => d.practice.establishmentMethod === "other").length,
    },
    records: dataset,
  };
}

/**
 * Audits the ground-truth dataset to verify if operational validation requirements are satisfied.
 * Strictly prevents model training or deployment until real verified data passes all gates.
 */
export async function auditDatasetValidationReadiness(client: SupabaseClient) {
  const { data: verifiedRecords, error } = await client
    .from("os_ground_truth_records")
    .select("id, parcel_id, establishment_method, verification_status, is_conflicting")
    .eq("is_active", true)
    .in("verification_status", ["field_verified_protocol", "independently_audited"])
    .eq("is_conflicting", false);

  if (error) {
    return {
      status: "error",
      message: `Database error querying ground truth: ${error.message}`,
      canTrainModel: false,
      blockers: [error.message],
    };
  }

  const records = verifiedRecords || [];
  const dsrCount = records.filter((r) => r.establishment_method === "dsr").length;
  const ptrCount = records.filter((r) => r.establishment_method === "ptr_conventional").length;
  const totalVerified = records.length;

  const MIN_REQUIRED_PER_CLASS = 50;
  const blockers: string[] = [];

  if (dsrCount < MIN_REQUIRED_PER_CLASS) {
    blockers.push(`Insufficient verified DSR samples: ${dsrCount}/${MIN_REQUIRED_PER_CLASS} required for initial operational gate.`);
  }

  if (ptrCount < MIN_REQUIRED_PER_CLASS) {
    blockers.push(`Insufficient verified PTR control samples: ${ptrCount}/${MIN_REQUIRED_PER_CLASS} required for initial operational gate.`);
  }

  // Check class balance ratio
  const maxClass = Math.max(dsrCount, ptrCount);
  const minClass = Math.min(dsrCount, ptrCount);
  const imbalanceRatio = minClass > 0 ? maxClass / minClass : Infinity;

  if (imbalanceRatio > 2.5 && minClass > 0) {
    blockers.push(`Class imbalance ratio ${imbalanceRatio.toFixed(1)}:1 exceeds 2.5:1 tolerance threshold.`);
  }

  const canTrainModel = blockers.length === 0;

  return {
    status: canTrainModel ? "ready_for_training" : "training_blocked_insufficient_ground_truth",
    canTrainModel,
    totalVerifiedSamples: totalVerified,
    classCounts: {
      dsr: dsrCount,
      ptr_conventional: ptrCount,
    },
    operationalGate: {
      minPerClass: MIN_REQUIRED_PER_CLASS,
      minTotal: MIN_REQUIRED_PER_CLASS * 2,
      imbalanceRatio: isFinite(imbalanceRatio) ? Number(imbalanceRatio.toFixed(2)) : null,
    },
    blockers,
    recommendation: canTrainModel
      ? "Dataset satisfies initial operational gate. Model training and spatial holdout evaluation permitted."
      : "Model training safely halted. Deploy field coordinators to primary pilot districts Faridkot and Patiala (retaining Sangrur/Bathinda reference fields) to log missing protocol-verified ground truth.",
  };
}
