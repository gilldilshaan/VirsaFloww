import os
import uuid
from datetime import datetime, timezone
from typing import List, Optional

from backend.app.schemas.assessment import (
    Assessment,
    AssessmentStatus,
    RuleResult,
    RuleEvaluationResult,
)
from backend.app.schemas.field import FieldModel
from backend.app.schemas.activity import Activity
from backend.app.schemas.evidence import Evidence
from backend.app.schemas.satellite import SatelliteObservation
from backend.app.rules.r1_completeness import evaluate_r1_completeness
from backend.app.rules.r2_date_window import evaluate_r2_date_window
from backend.app.rules.r3_photo_distance import evaluate_r3_photo_distance
from backend.app.rules.r4_irrigation import evaluate_r4_irrigation
from backend.app.rules.r5_satellite import evaluate_r5_satellite

from backend.app.core.config import settings
import json

def run_deterministic_ruleset(
    field: FieldModel,
    activities: List[Activity],
    evidence_items: List[Evidence],
    satellite_obs: Optional[List[SatelliteObservation]] = None,
    observations_path: Optional[str] = None,
) -> Assessment:
    """Executes the deterministic 5-rule MRV engine for a field parcel.

    AGGREGATION LOGIC:
    - Any rule == FAIL -> status: UNVERIFIED, label: "Unverified"
    - Any rule == WARN -> status: NEEDS_REVIEW, label: "Needs review"
    - All rules == PASS -> status: READY_FOR_VERIFICATION, label: "Ready for verification"
    """
    obs_path = observations_path or settings.LEAD_OBSERVATIONS_PATH

    # If satellite_obs was not provided directly, load from observations file if available
    if satellite_obs is None and obs_path and os.path.exists(obs_path):
        try:
            with open(obs_path, "r", encoding="utf-8") as f:
                content = f.read().strip()
                if content:
                    raw_items = json.loads(content)
                    satellite_obs = []
                    for item in raw_items:
                        try:
                            satellite_obs.append(SatelliteObservation.model_validate(item))
                        except Exception:
                            pass
        except Exception:
            satellite_obs = []

    has_sat_data = bool(satellite_obs)

    # 1. Evaluate R1: Completeness
    r1 = evaluate_r1_completeness(
        field=field,
        activities=activities,
        evidence_items=evidence_items,
        has_satellite_data=has_sat_data,
        has_weather_data=True,
    )

    # 2. Evaluate R2: Date Window
    r2 = evaluate_r2_date_window(
        activities=activities,
        evidence_items=evidence_items,
    )

    # 3. Evaluate R3: Photo Spatial Distance
    r3 = evaluate_r3_photo_distance(
        field=field,
        evidence_items=evidence_items,
    )

    # 4. Evaluate R4: Irrigation Practice
    r4 = evaluate_r4_irrigation(
        activities=activities,
        satellite_obs=satellite_obs,
    )

    # 5. Evaluate R5: Satellite Coverage
    target_date = activities[0].declared_date if activities else "2026-06-15"
    r5 = evaluate_r5_satellite(
        field_id=field.id,
        target_date_str=target_date,
        observations_path=obs_path,
    )

    all_results = [r1, r2, r3, r4, r5]

    # Deterministic Aggregation
    has_fail = any(r.result == RuleEvaluationResult.FAIL for r in all_results)
    has_warn = any(r.result == RuleEvaluationResult.WARN for r in all_results)

    if has_fail:
        final_status = AssessmentStatus.UNVERIFIED
        final_label = "Unverified"
    elif has_warn:
        final_status = AssessmentStatus.NEEDS_REVIEW
        final_label = "Needs review"
    else:
        final_status = AssessmentStatus.READY_FOR_VERIFICATION
        final_label = "Ready for verification"

    now_iso = datetime.now(timezone.utc).strftime("%Y-%m-%dT%H:%M:%SZ")
    assessment_id = f"ASM-{uuid.uuid4().hex[:8].upper()}"

    return Assessment(
        id=assessment_id,
        field_id=field.id,
        season_id=field.season or "Kharif 2026",
        assessed_at=now_iso,
        ruleset_version="1.0.0-deterministic",
        status=final_status,
        status_label=final_label,
        outstanding_verification=["Independent field visit", "Independent review"],
        rule_results=all_results,
    )
