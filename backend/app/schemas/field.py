from typing import Optional, List
from pydantic import Field
from backend.app.schemas.common import BaseSchema, Coordinates

class FieldModel(BaseSchema):
    id: str = Field(..., description="Unique field identifier e.g. PB-FIELD-001")
    code: str = Field(..., description="Field code e.g. PB-FIELD-001")
    name: str = Field(..., description="Field display name")
    farmer_id: str = Field(..., alias="farmerId", description="Referenced farmer profile ID")
    farmer_name: Optional[str] = Field(default=None, alias="farmerName")
    farmer_name_local: Optional[str] = Field(default=None, alias="farmerNameLocal")
    district: str
    state: str = "Punjab"
    area_ha: float = Field(..., alias="areaHa", ge=0.0)
    area_acres: float = Field(..., alias="areaAcres", ge=0.0)
    practice: str = Field(default="Direct Seeded Rice (DSR)", description="Agricultural practice adopted")
    crop: str = Field(default="PR-126 Basmati / Paddy")
    season: str = Field(default="Kharif 2026")
    coordinates: Coordinates
    boundary_polygon: List[List[float]] = Field(default_factory=list, alias="boundaryPolygon")
    geometry_source: str = Field(default="demo-placeholder", alias="geometrySource")
    target_emission_reduction_tonnes: Optional[float] = Field(
        default=None, alias="targetEmissionReductionTonnes"
    )
    emission_reduction_note: str = Field(
        default="Preliminary estimate: not computed", alias="emissionReductionNote"
    )
    assigned_officer_id: Optional[str] = Field(default=None, alias="assignedOfficerId")
    project_id: Optional[str] = Field(default=None, alias="projectId")
    is_demo: bool = Field(default=True, alias="isDemo")
    data_label: str = Field(default="Demo data", alias="dataLabel")
