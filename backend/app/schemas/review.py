from enum import Enum
from typing import Optional
from pydantic import Field
from backend.app.schemas.common import BaseSchema

class ReviewSeverity(str, Enum):
    HIGH = "high"
    MEDIUM = "medium"
    LOW = "low"

class ReviewStatus(str, Enum):
    PENDING_REVIEW = "pending_review"
    IN_INVESTIGATION = "in_investigation"
    RESOLVED = "resolved"
    ESCALATED = "escalated"

class ReviewDecisionType(str, Enum):
    ACCEPTED = "accepted"
    REJECTED = "rejected"
    CLARIFICATION_REQUESTED = "clarification_requested"

class ReviewDecisionRequest(BaseSchema):
    decision: ReviewDecisionType
    comment: str = Field(..., min_length=1)
    correction_request: Optional[str] = Field(default=None, alias="correctionRequest")

class Review(BaseSchema):
    id: str = Field(..., description="Unique review task ID e.g. REV-2026-001")
    parcel_id: str = Field(..., alias="parcelId")
    field_id: str = Field(..., alias="fieldId")
    title: str
    description: str
    severity: ReviewSeverity
    status: ReviewStatus = Field(default=ReviewStatus.PENDING_REVIEW)
    reported_date: str = Field(..., alias="reportedDate")
    due_date: str = Field(..., alias="dueDate")
    assigned_to: str = Field(..., alias="assignedTo")
    evidence_ref_id: Optional[str] = Field(default=None, alias="evidenceRefId")
    decision: Optional[ReviewDecisionType] = None
    comment: Optional[str] = None
    resolved_at: Optional[str] = Field(default=None, alias="resolvedAt")
    resolved_by: Optional[str] = Field(default=None, alias="resolvedBy")
    is_demo: bool = Field(default=True, alias="isDemo")
    data_label: str = Field(default="Demo data", alias="dataLabel")
