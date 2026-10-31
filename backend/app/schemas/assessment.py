from enum import Enum
from typing import Optional, List
from pydantic import Field
from backend.app.schemas.common import BaseSchema

class AssessmentStatus(str, Enum):
    UNVERIFIED = "UNVERIFIED"
    NEEDS_REVIEW = "NEEDS_REVIEW"
    READY_FOR_VERIFICATION = "READY_FOR_VERIFICATION"

class RuleEvaluationResult(str, Enum):
    PASS = "pass"
    WARN = "warn"
    FAIL = "fail"

class RuleResult(BaseSchema):
    rule_id: str = Field(..., alias="ruleId")
    result: RuleEvaluationResult
    explanation: str
    source_record_ids: List[str] = Field(default_factory=list, alias="sourceRecordIds")

class Assessment(BaseSchema):
    id: str = Field(..., description="Unique assessment evaluation ID e.g. ASM-2026-001")
    field_id: str = Field(..., alias="fieldId")
    season_id: str = Field(..., alias="seasonId")
    assessed_at: str = Field(..., alias="assessedAt", description="ISO 8601 UTC timestamp")
    ruleset_version: str = Field(default="1.0.0-deterministic", alias="rulesetVersion")
    status: AssessmentStatus
    status_label: str = Field(..., alias="statusLabel")
    outstanding_verification: List[str] = Field(
        default_factory=lambda: ["Independent field visit", "Independent review"],
        alias="outstandingVerification",
    )
    rule_results: List[RuleResult] = Field(default_factory=list, alias="ruleResults")
    is_demo: bool = Field(default=True, alias="isDemo")
    data_label: str = Field(default="Demo data", alias="dataLabel")
