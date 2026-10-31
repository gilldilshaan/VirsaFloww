from enum import Enum
from typing import Optional
from pydantic import Field
from backend.app.schemas.common import BaseSchema

class EnquiryStage(str, Enum):
    INQUIRY = "Inquiry"
    DATA_ROOM_SHARED = "Data Room Shared"
    AUDIT_UNDERWAY = "Audit Underway"
    TERM_SHEET = "Term Sheet"

class EnquiryStatus(str, Enum):
    ACTIVE = "Active"
    REVIEW_REQUIRED = "Review Required"
    APPROVED = "Approved"

class BuyerEnquiry(BaseSchema):
    id: str = Field(..., description="Unique enquiry ID e.g. ENQ-2026-001")
    project_id: str = Field(..., alias="projectId")
    project_title: str = Field(..., alias="projectTitle")
    buyer_company_id: str = Field(..., alias="buyerCompanyId")
    buyer_name: str = Field(..., alias="buyerName")
    buyer_org: str = Field(..., alias="buyerOrg")
    owner_id: str = Field(..., alias="ownerId", description="User ID of the corporate buyer who owns this enquiry")
    inquiry_date: str = Field(..., alias="inquiryDate", description="ISO date string")
    stage: EnquiryStage = Field(default=EnquiryStage.INQUIRY)
    status: EnquiryStatus = Field(default=EnquiryStatus.ACTIVE)
    volume_requested_tons: float = Field(..., alias="volumeRequestedTons", ge=0.0)
    target_retirement_year: str = Field(..., alias="targetRetirementYear")
    message: Optional[str] = None
    is_demo: bool = Field(default=True, alias="isDemo")
    data_label: str = Field(default="Demo data", alias="dataLabel")

class BuyerEnquiryCreate(BaseSchema):
    project_id: str = Field(..., alias="projectId")
    volume_requested_tons: float = Field(..., alias="volumeRequestedTons", ge=0.0)
    target_retirement_year: str = Field(..., alias="targetRetirementYear")
    message: Optional[str] = None
