import os
import json
from datetime import datetime
from typing import List, Optional
from backend.app.core.config import settings
from backend.app.core.constants import CLOUD_COVER_MAX_PERCENT
from backend.app.schemas.assessment import RuleResult, RuleEvaluationResult
from backend.app.schemas.satellite import SatelliteObservation

def parse_date(date_str: str) -> datetime:
    clean_str = date_str.replace("Z", "+00:00")
    if "T" in clean_str:
        return datetime.fromisoformat(clean_str).replace(tzinfo=None)
    return datetime.strptime(clean_str[:10], "%Y-%m-%d")

def evaluate_r5_satellite(
    field_id: str,
    target_date_str: str,
    observations_path: Optional[str] = None,
    max_cloud_cover_percent: float = CLOUD_COVER_MAX_PERCENT,
    window_days: int = 10,
) -> RuleResult:
    """R5: Verifies Sentinel-2 satellite observation availability and cloud clearance."""
    obs_file = observations_path or settings.LEAD_OBSERVATIONS_PATH

    if not os.path.exists(obs_file):
        return RuleResult(
            rule_id="R5_SATELLITE_COVERAGE",
            result=RuleEvaluationResult.FAIL,
            explanation=f"No satellite coverage available: observations file '{os.path.basename(obs_file)}' not found.",
            source_record_ids=[],
        )

    try:
        with open(obs_file, "r", encoding="utf-8") as f:
            content = f.read().strip()
            if not content:
                raw_data = []
            else:
                raw_data = json.loads(content)
    except Exception as e:
        return RuleResult(
            rule_id="R5_SATELLITE_COVERAGE",
            result=RuleEvaluationResult.FAIL,
            explanation=f"Failed to read satellite observations dataset: {e}",
            source_record_ids=[],
        )

    # Filter observations for field_id or global observations list
    field_obs: List[SatelliteObservation] = []
    for item in raw_data:
        try:
            obs = SatelliteObservation.model_validate(item)
            field_obs.append(obs)
        except Exception:
            continue

    if not field_obs:
        return RuleResult(
            rule_id="R5_SATELLITE_COVERAGE",
            result=RuleEvaluationResult.FAIL,
            explanation=f"No satellite observations exist in '{os.path.basename(obs_file)}'.",
            source_record_ids=[],
        )

    target_date = parse_date(target_date_str)
    matching_obs = []
    for obs in field_obs:
        obs_dt = parse_date(obs.date)
        delta_days = abs((obs_dt - target_date).total_seconds()) / 86400.0
        if delta_days <= window_days:
            matching_obs.append(obs)

    if not matching_obs:
        return RuleResult(
            rule_id="R5_SATELLITE_COVERAGE",
            result=RuleEvaluationResult.FAIL,
            explanation=f"No satellite observations found within {window_days} days of {target_date_str}.",
            source_record_ids=[o.id for o in field_obs],
        )

    # Check cloud cover of matching observations
    clear_obs = [o for o in matching_obs if o.cloud_cover_percent <= max_cloud_cover_percent]
    if not clear_obs:
        return RuleResult(
            rule_id="R5_SATELLITE_COVERAGE",
            result=RuleEvaluationResult.WARN,
            explanation=(
                f"Satellite observations available within window, but cloud cover exceeds {max_cloud_cover_percent:.0f}%: "
                f"{', '.join([f'{o.id} ({o.cloud_cover_percent:.1f}%)' for o in matching_obs])}."
            ),
            source_record_ids=[o.id for o in matching_obs],
        )

    return RuleResult(
        rule_id="R5_SATELLITE_COVERAGE",
        result=RuleEvaluationResult.PASS,
        explanation=(
            f"Valid Sentinel-2 satellite observation acquired within {window_days} days with "
            f"acceptable cloud clearance ({clear_obs[0].cloud_cover_percent:.1f}% <= {max_cloud_cover_percent:.0f}%)."
        ),
        source_record_ids=[o.id for o in clear_obs],
    )
