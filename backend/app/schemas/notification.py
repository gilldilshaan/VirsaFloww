from enum import Enum
from typing import Optional
from pydantic import Field
from backend.app.schemas.common import BaseSchema

class NotificationType(str, Enum):
    CORRECTION_REQUEST = "correction_request"
    STATUS_UPDATE = "status_update"
    EVIDENCE_FLAGGED = "evidence_flagged"

class Notification(BaseSchema):
    id: str = Field(..., description="Unique notification ID e.g. NOTIF-2026-001")
    recipient_id: str = Field(..., alias="recipientId")
    field_id: Optional[str] = Field(default=None, alias="fieldId")
    type: NotificationType
    title: str
    message: str
    is_read: bool = Field(default=False, alias="isRead")
    created_at: str = Field(..., alias="createdAt")
    is_demo: bool = Field(default=True, alias="isDemo")
    data_label: str = Field(default="Demo data", alias="dataLabel")
