from datetime import datetime
from typing import List, Optional
from backend.app.core.constants import IRRIGATION_LAG_DAYS, WATER_MIN_FRACTION
from backend.app.schemas.assessment import RuleResult, RuleEvaluationResult
from backend.app.schemas.activity import Activity, ActivityType
from backend.app.schemas.satellite import SatelliteObservation

def parse_date(date_str: str) -> datetime:
    clean_str = date_str.replace("Z", "+00:00")
    if "T" in clean_str:
        return datetime.fromisoformat(clean_str).replace(tzinfo=None)
    return datetime.strptime(clean_str[:10], "%Y-%m-%d")

def evaluate_r4_irrigation(
    activities: List[Activity],
    satellite_obs: Optional[List[SatelliteObservation]] = None,
    max_lag_days: int = IRRIGATION_LAG_DAYS,
    min_water_fraction: float = WATER_MIN_FRACTION,
) -> RuleResult:
    """R4: Verifies pre-sowing irrigation log timing and corroborates with satellite moisture signal."""
    irrigation_acts = [
        a for a in activities
        if a.activity_type in (ActivityType.PRE_SOWING_IRRIGATION, ActivityType.AWD_IRRIGATION)
    ]
    sowing_acts = [
        a for a in activities
        if a.activity_type == ActivityType.DIRECT_SEEDING
    ]

    source_ids = [a.id for a in irrigation_acts + sowing_acts]

    if not irrigation_acts:
        return RuleResult(
            rule_id="R4_IRRIGATION_PRACTICE",
            result=RuleEvaluationResult.FAIL,
            explanation="Missing pre-sowing irrigation log. Pre-sowing irrigation is required for DSR practice confirmation.",
            source_record_ids=source_ids,
        )

    # Check lag relative to sowing date
    if sowing_acts:
        sow_date = parse_date(sowing_acts[0].declared_date)
        irr_date = parse_date(irrigation_acts[0].declared_date)
        lag_days = (sow_date - irr_date).total_seconds() / 86400.0

        if lag_days < 0:
            return RuleResult(
                rule_id="R4_IRRIGATION_PRACTICE",
                result=RuleEvaluationResult.FAIL,
                explanation=f"Irrigation date ({irrigation_acts[0].declared_date}) is after sowing date ({sowing_acts[0].declared_date}).",
                source_record_ids=source_ids,
            )

        if lag_days > max_lag_days:
            return RuleResult(
                rule_id="R4_IRRIGATION_PRACTICE",
                result=RuleEvaluationResult.FAIL,
                explanation=(
                    f"Pre-sowing irrigation occurred {lag_days:.1f} days before sowing, exceeding maximum allowable lag "
                    f"of {max_lag_days} days."
                ),
                source_record_ids=source_ids,
            )

    # Corroborate with satellite moisture if available
    if not satellite_obs:
        return RuleResult(
            rule_id="R4_IRRIGATION_PRACTICE",
            result=RuleEvaluationResult.WARN,
            explanation=(
                f"Pre-sowing irrigation log confirmed within {max_lag_days} days. "
                "Satellite moisture signal pending corroboration."
            ),
            source_record_ids=source_ids,
        )

    # Check water signal
    # mean_ndwi >= min_water_fraction
    best_water_signal = -1.0
    for obs in satellite_obs:
        water_val = obs.mean_ndwi if obs.mean_ndwi is not None else -1.0
        if water_val > best_water_signal:
            best_water_signal = water_val

    if best_water_signal >= min_water_fraction:
        return RuleResult(
            rule_id="R4_IRRIGATION_PRACTICE",
            result=RuleEvaluationResult.PASS,
            explanation=(
                f"Pre-sowing irrigation corroborated: log within {max_lag_days} days and "
                f"satellite moisture signal confirmed (NDWI={best_water_signal:.2f} >= {min_water_fraction:.2f})."
            ),
            source_record_ids=source_ids,
        )
    else:
        return RuleResult(
            rule_id="R4_IRRIGATION_PRACTICE",
            result=RuleEvaluationResult.FAIL,
            explanation=(
                f"Satellite moisture signal (NDWI={best_water_signal:.2f}) is below minimum threshold "
                f"({min_water_fraction:.2f}), contradicting reported pre-sowing irrigation."
            ),
            source_record_ids=source_ids,
        )
