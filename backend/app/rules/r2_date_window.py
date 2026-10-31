from datetime import datetime
from typing import List
from backend.app.core.constants import WINDOW_DAYS
from backend.app.schemas.assessment import RuleResult, RuleEvaluationResult
from backend.app.schemas.evidence import Evidence, EvidenceType, EvidenceStatus
from backend.app.schemas.activity import Activity

def parse_date(date_str: str) -> datetime:
    """Parses ISO date string (YYYY-MM-DD or YYYY-MM-DDTHH:MM:SSZ)."""
    clean_str = date_str.replace("Z", "+00:00")
    if "T" in clean_str:
        return datetime.fromisoformat(clean_str).replace(tzinfo=None)
    return datetime.strptime(clean_str[:10], "%Y-%m-%d")

def evaluate_r2_date_window(
    activities: List[Activity],
    evidence_items: List[Evidence],
    window_days: int = WINDOW_DAYS,
) -> RuleResult:
    """R2: Verifies that evidence capture dates fall within window_days of the declared activity date."""
    active_evidence = [e for e in evidence_items if e.status != EvidenceStatus.SUPERSEDED]
    if not activities or not active_evidence:
        return RuleResult(
            rule_id="R2_DATE_WINDOW",
            result=RuleEvaluationResult.FAIL,
            explanation="Cannot evaluate date window: missing activity records or active evidence.",
            source_record_ids=[],
        )

    # Use first primary activity (e.g. direct seeding or irrigation)
    primary_act = activities[0]
    act_date = parse_date(primary_act.declared_date)

    exceeded_items = []
    source_ids = [primary_act.id]

    for item in active_evidence:
        source_ids.append(item.id)
        ev_date = parse_date(item.captured_at)
        delta_days = abs((ev_date - act_date).total_seconds()) / 86400.0

        # Boundary: delta_days <= window_days passes
        if delta_days > window_days:
            exceeded_items.append(f"{item.id} ({delta_days:.1f} days delta)")

    if exceeded_items:
        return RuleResult(
            rule_id="R2_DATE_WINDOW",
            result=RuleEvaluationResult.FAIL,
            explanation=(
                f"Evidence capture timestamp exceeds allowable window ({window_days} days): "
                f"{', '.join(exceeded_items)}."
            ),
            source_record_ids=source_ids,
        )

    return RuleResult(
        rule_id="R2_DATE_WINDOW",
        result=RuleEvaluationResult.PASS,
        explanation=f"All evidence capture timestamps are within the allowable {window_days}-day temporal window.",
        source_record_ids=source_ids,
    )
