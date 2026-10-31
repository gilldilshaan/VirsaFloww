from enum import Enum
from typing import Optional, List, Dict, Any
from pydantic import Field
from backend.app.schemas.common import BaseSchema

class ExplainerMode(str, Enum):
    LLM = "LLM"
    CACHED = "Cached"
    TEMPLATE = "Template"

class RuleExplanationItem(BaseSchema):
    rule_id: str = Field(..., alias="ruleId")
    status: str
    explanation: str
    source_record_ids: List[str] = Field(default_factory=list, alias="sourceRecordIds")

class ExplainerRequest(BaseSchema):
    assessment_id: str = Field(..., alias="assessmentId")
    question: Optional[str] = Field(
        default="Explain the assessment status and rule evaluation results.",
        alias="question"
    )
    language: Optional[str] = Field(default="en", alias="language")

class ExplainerResponse(BaseSchema):
    assessment_id: str = Field(..., alias="assessmentId")
    field_id: str = Field(..., alias="fieldId")
    status: str
    mode: ExplainerMode
    summary: str
    rule_breakdowns: List[RuleExplanationItem] = Field(default_factory=list, alias="ruleBreakdowns")
    citations: List[str] = Field(default_factory=list)
    generated_at: str = Field(..., alias="generatedAt")
    confidence: Optional[str] = Field(default="Deterministic Grounded", alias="confidence")
