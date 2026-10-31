from typing import List, Optional
from backend.app.schemas.assessment import RuleResult, RuleEvaluationResult
from backend.app.schemas.evidence import Evidence, EvidenceType, EvidenceStatus
from backend.app.schemas.activity import Activity
from backend.app.schemas.field import FieldModel

REQUIRED_CATEGORIES = [
    "Farmer Field Declaration",
    "In-situ Practice Photograph",
    "Field Activity Log",
    "Weather Record",
    "Satellite Observation",
]

def evaluate_r1_completeness(
    field: FieldModel,
    activities: List[Activity],
    evidence_items: List[Evidence],
    has_satellite_data: bool = False,
    has_weather_data: bool = True,  # Weather stations seeded/simulated
) -> RuleResult:
    """R1: Verifies that all mandatory evidence elements are present in the dossier."""
    missing = []
    source_ids = []

    # 1. Field declaration
    if not field.id or not field.practice:
        missing.append("Farmer Field Declaration")
    else:
        source_ids.append(field.id)

    # 2. In-situ photo (non-superseded)
    photos = [
        e for e in evidence_items
        if e.type == EvidenceType.PHOTO and e.status != EvidenceStatus.SUPERSEDED
    ]
    if not photos:
        missing.append("In-situ Practice Photograph")
    else:
        source_ids.extend([p.id for p in photos])

    # 3. Field activity log
    if not activities:
        missing.append("Field Activity Log")
    else:
        source_ids.extend([a.id for a in activities])

    # 4. Weather record
    if not has_weather_data:
        missing.append("Weather Record")

    # 5. Satellite observation
    if not has_satellite_data:
        missing.append("Satellite Observation")

    if missing:
        return RuleResult(
            rule_id="R1_COMPLETENESS",
            result=RuleEvaluationResult.FAIL,
            explanation=f"Missing mandatory evidence elements: {', '.join(missing)}.",
            source_record_ids=source_ids,
        )

    return RuleResult(
        rule_id="R1_COMPLETENESS",
        result=RuleEvaluationResult.PASS,
        explanation="All mandatory MRV evidence elements are present in the field dossier.",
        source_record_ids=source_ids,
    )
