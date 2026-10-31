from enum import Enum
from typing import Optional
from pydantic import Field
from backend.app.schemas.common import BaseSchema

class ActivityType(str, Enum):
    PRE_SOWING_IRRIGATION = "pre_sowing_irrigation"
    DIRECT_SEEDING = "direct_seeding"
    AWD_IRRIGATION = "awd_irrigation"
    FERTILIZER_APPLICATION = "fertilizer_application"
    HARVEST = "harvest"

class Activity(BaseSchema):
    id: str = Field(..., description="Unique activity record ID e.g. ACT-2026-001")
    field_id: str = Field(..., alias="fieldId")
    season_id: str = Field(..., alias="seasonId")
    activity_type: ActivityType = Field(..., alias="activityType")
    declared_date: str = Field(..., alias="declaredDate", description="Declared event date in ISO YYYY-MM-DD")
    notes: Optional[str] = None
    created_by: str = Field(..., alias="createdBy")
    created_at: str = Field(..., alias="createdAt")
    is_demo: bool = Field(default=True, alias="isDemo")
    data_label: str = Field(default="Demo data", alias="dataLabel")
