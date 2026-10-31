import pytest
from pydantic import ValidationError

from backend.app.schemas.common import Coordinates
from backend.app.schemas.user import UserRole, User
from backend.app.schemas.field import FieldModel
from backend.app.schemas.evidence import Evidence, EvidenceStatus, EvidenceCategory, EvidenceType
from backend.app.schemas.assessment import AssessmentStatus
from backend.app.schemas.project import Project, BuyerProjectSummary

def test_enums_validation():
    # Valid assessment status
    assert AssessmentStatus.UNVERIFIED.value == "UNVERIFIED"
    assert AssessmentStatus.NEEDS_REVIEW.value == "NEEDS_REVIEW"
    assert AssessmentStatus.READY_FOR_VERIFICATION.value == "READY_FOR_VERIFICATION"

    # "VERIFIED" or "verified" must NOT be valid in AssessmentStatus or EvidenceStatus
    with pytest.raises(ValueError):
        AssessmentStatus("VERIFIED")
    with pytest.raises(ValueError):
        AssessmentStatus("Verified")

    # Valid evidence status
    assert EvidenceStatus.RECEIVED.value == "received"
    assert EvidenceStatus.HASH_RECORDED.value == "hash_recorded"
    assert EvidenceStatus.SELF_REPORTED.value == "self_reported"
    assert EvidenceStatus.FLAGGED.value == "flagged"
    assert EvidenceStatus.SUPERSEDED.value == "superseded"

    with pytest.raises(ValueError):
        EvidenceStatus("verified")
    with pytest.raises(ValueError):
        EvidenceStatus("corroborated")

def test_buyer_project_summary_pii_omission():
    # Verify that BuyerProjectSummary model structurally lacks farmer PII and farmer count fields
    fields = BuyerProjectSummary.model_fields.keys()
    assert "farmer_id" not in fields
    assert "farmer_name" not in fields
    assert "farmerName" not in fields
    assert "farmer_count" not in fields
    assert "farmerCount" not in fields
    assert "phone" not in fields

def test_camel_case_wire_serialization():
    field = FieldModel(
        id="PB-FIELD-001",
        code="PB-FIELD-001",
        name="Plot 1 - North Ludhiana",
        farmer_id="farmer-001",
        farmer_name="Gurpreet Singh",
        district="Ludhiana",
        area_ha=1.8,
        area_acres=4.448,
        coordinates=Coordinates(lat=30.90, lng=75.85),
        boundary_polygon=[[75.85, 30.90], [75.86, 30.90], [75.86, 30.91], [75.85, 30.91], [75.85, 30.90]],
        geometry_source="demo-placeholder",
    )
    wire_dict = field.model_dump(by_alias=True)

    assert "farmerId" in wire_dict
    assert wire_dict["farmerId"] == "farmer-001"
    assert "geometrySource" in wire_dict
    assert wire_dict["geometrySource"] == "demo-placeholder"
    assert "areaHa" in wire_dict
    assert wire_dict["areaHa"] == 1.8
    assert "targetEmissionReductionTonnes" in wire_dict
    assert wire_dict["targetEmissionReductionTonnes"] is None
