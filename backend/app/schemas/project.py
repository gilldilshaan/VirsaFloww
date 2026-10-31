from typing import Optional, List
from pydantic import Field
from backend.app.schemas.common import BaseSchema
from backend.app.schemas.assessment import AssessmentStatus

class EvidenceDepth(BaseSchema):
    satellite_passes: int = Field(default=0, alias="satellitePasses")
    ground_photos: int = Field(default=0, alias="groundPhotos")
    water_logs: int = Field(default=0, alias="waterLogs")

class Project(BaseSchema):
    id: str = Field(..., description="Unique project ID e.g. PRJ-PB-DSR-001")
    title: str
    slug: str
    location: str
    district: str
    practice: str = "Direct Seeded Rice (DSR) + AWD"
    methodology: str = "Methodology: pending confirmation"
    developer: str
    total_hectares: float = Field(..., alias="totalHectares")
    enrolled_parcels: int = Field(..., alias="enrolledParcels")
    farmer_count: int = Field(..., alias="farmerCount")
    estimated_tons_co2e_per_year: Optional[float] = Field(default=None, alias="estimatedTonsCo2ePerYear")
    carbon_estimate_note: str = Field(default="Preliminary estimate: not computed", alias="carbonEstimateNote")
    readiness_score_percent: Optional[float] = Field(default=None, alias="readinessScorePercent")
    assessment_status: AssessmentStatus = Field(default=AssessmentStatus.UNVERIFIED, alias="assessmentStatus")
    status_label: str = Field(default="Unverified", alias="statusLabel")
    outstanding_verification: List[str] = Field(
        default_factory=lambda: ["Independent field visit", "Independent review"],
        alias="outstandingVerification",
    )
    indicative_price_per_ton_usd: Optional[float] = Field(default=None, alias="indicativePricePerTonUsd")
    price_note: str = Field(default="Preliminary estimate: not computed", alias="priceNote")
    vintage: str = "Kharif 2026"
    description: str
    highlights: List[str] = Field(default_factory=list)
    evidence_depth: EvidenceDepth = Field(default_factory=EvidenceDepth, alias="evidenceDepth")
    is_published: bool = Field(default=False, alias="isPublished")
    is_demo: bool = Field(default=True, alias="isDemo")
    data_label: str = Field(default="Demo data", alias="dataLabel")

class BuyerProjectSummary(BaseSchema):
    """Buyer-safe projection strictly omitting all farmer PII, IDs, and phone numbers."""
    id: str
    title: str
    slug: str
    location: str
    district: str
    practice: str
    methodology: str
    developer: str
    enrolled_hectares: Optional[float] = Field(default=None, alias="enrolledHectares")
    eligible_hectares: Optional[float] = Field(default=None, alias="eligibleHectares")
    enrolled_parcels: int = Field(..., alias="enrolledParcels")
    assessment_status: AssessmentStatus = Field(..., alias="assessmentStatus")
    status_label: str = Field(..., alias="statusLabel")
    outstanding_verification: List[str] = Field(default_factory=list, alias="outstandingVerification")
    vintage: str
    description: str
    highlights: List[str] = Field(default_factory=list)
    evidence_depth: EvidenceDepth = Field(default_factory=EvidenceDepth, alias="evidenceDepth")
    is_demo: bool = Field(default=True, alias="isDemo")
    data_label: str = Field(default="Demo data", alias="dataLabel")
