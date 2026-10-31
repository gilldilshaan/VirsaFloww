from typing import Optional, Dict, Any
from pydantic import Field
from backend.app.schemas.common import BaseSchema

class AuditEvent(BaseSchema):
    event_id: str = Field(..., alias="eventId")
    actor_id: str = Field(..., alias="actorId")
    action: str
    entity_type: str = Field(..., alias="entityType")
    entity_id: str = Field(..., alias="entityId")
    timestamp: str = Field(..., description="ISO 8601 UTC timestamp ending in Z")
    details: Optional[Dict[str, Any]] = None
    previous_hash: str = Field(..., alias="previousHash")
    event_hash: str = Field(..., alias="eventHash")
