from typing import Optional
from pydantic import Field
from backend.app.schemas.common import BaseSchema

class Season(BaseSchema):
    id: str = Field(..., description="Unique season ID e.g. SEASON-KHARIF-2026")
    name: str = Field(..., description="Season name e.g. Kharif 2026")
    year: int = 2026
    start_date: str = Field(..., alias="startDate")
    end_date: str = Field(..., alias="endDate")
    is_active: bool = Field(default=True, alias="isActive")
    is_demo: bool = Field(default=True, alias="isDemo")
    data_label: str = Field(default="Demo data", alias="dataLabel")
