from enum import Enum
from typing import Optional, List
from pydantic import Field
from backend.app.schemas.common import BaseSchema, Coordinates

class EvidenceType(str, Enum):
    PHOTO = "photo"
    SATELLITE = "satellite"
    DOCUMENT = "document"
    LOG = "log"
    SENSOR = "sensor"

class EvidenceCategory(str, Enum):
    SUPPORTING = "supporting"
    CONTRADICTING = "contradicting"
    MISSING = "missing"

class EvidenceStatus(str, Enum):
    RECEIVED = "received"
    HASH_RECORDED = "hash_recorded"
    SELF_REPORTED = "self_reported"
    FLAGGED = "flagged"
    SUPERSEDED = "superseded"

class GpsCoordinates(Coordinates):
    accuracy_meters: Optional[float] = Field(default=None, alias="accuracyMeters")

class Provenance(BaseSchema):
    author: str
    source: str
    sha256: str = Field(..., description="Server-computed SHA-256 hex digest of raw binary bytes")
    device: Optional[str] = None
    gps_coordinates: Optional[GpsCoordinates] = Field(default=None, alias="gpsCoordinates")
    spatial_distance_meters: Optional[float] = Field(default=None, alias="spatialDistanceMeters")
    review_status: str = Field(default="Pending Assessment", alias="reviewStatus")

class FileDetails(BaseSchema):
    name: str
    size_kb: float = Field(..., alias="sizeKb")
    mime: str
    storage_uri: Optional[str] = Field(default=None, alias="storageUri")

class EvidenceStatusHistory(BaseSchema):
    timestamp: str
    previous_status: EvidenceStatus = Field(..., alias="previousStatus")
    new_status: EvidenceStatus = Field(..., alias="newStatus")
    actor_id: str = Field(..., alias="actorId")
    reason: Optional[str] = None

class Evidence(BaseSchema):
    id: str = Field(..., description="Unique evidence identifier e.g. EV-2026-001")
    field_id: str = Field(..., alias="fieldId")
    activity_id: Optional[str] = Field(default=None, alias="activityId")
    title: str
    type: EvidenceType
    category: EvidenceCategory
    status: EvidenceStatus
    description: str
    captured_at: str = Field(..., alias="capturedAt", description="Client-declared capture timestamp (ISO UTC)")
    submitted_at: str = Field(..., alias="submittedAt", description="Server receipt timestamp (ISO UTC)")
    submitter_id: str = Field(..., alias="submitterId")
    provenance: Provenance
    file_details: Optional[FileDetails] = Field(default=None, alias="fileDetails")
    supersedes_id: Optional[str] = Field(default=None, alias="supersedesId")
    status_history: List[EvidenceStatusHistory] = Field(default_factory=list, alias="statusHistory")
    is_demo: bool = Field(default=True, alias="isDemo")
    data_label: str = Field(default="Demo data", alias="dataLabel")
