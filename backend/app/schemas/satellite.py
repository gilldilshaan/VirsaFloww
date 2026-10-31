from typing import Optional, List
from pydantic import Field
from backend.app.schemas.common import BaseSchema

class SatelliteObservation(BaseSchema):
    id: str
    date: str
    sensor: str = "Copernicus Sentinel-2 MSI"
    resolution_meters: float = Field(default=10.0, alias="resolutionMeters")
    cloud_cover_percent: float = Field(..., alias="cloudCoverPercent")
    sun_azimuth_deg: float = Field(..., alias="sunAzimuthDeg")
    mean_ndvi: Optional[float] = Field(default=None, alias="meanNdvi")
    mean_ndwi: Optional[float] = Field(default=None, alias="meanNdwi")
    quality_rating: str = Field(default="Standard", alias="qualityRating")
    surface_water_detected: Optional[bool] = Field(default=None, alias="surfaceWaterDetected")
    notes: str = ""
    is_demo: bool = Field(default=True, alias="isDemo")
    data_label: str = Field(default="Demo data", alias="dataLabel")

class SatelliteObservationsResponse(BaseSchema):
    items: List[SatelliteObservation]
    total: int
    metadata: dict = Field(default_factory=dict)
