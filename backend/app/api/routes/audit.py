from typing import Optional
from fastapi import APIRouter, Depends, Query
from backend.app.schemas.audit import AuditEvent
from backend.app.schemas.common import ListEnvelope
from backend.app.schemas.user import User, UserRole
from backend.app.services.audit_service import AuditService
from backend.app.api.deps import get_audit_service, require_roles

router = APIRouter(prefix="/audit", tags=["Audit Trail"])

@router.get("", response_model=ListEnvelope[AuditEvent])
def list_audit_events(
    entity_type: Optional[str] = Query(None, alias="entityType"),
    entity_id: Optional[str] = Query(None, alias="entityId"),
    actor_id: Optional[str] = Query(None, alias="actorId"),
    offset: int = Query(0, ge=0),
    limit: int = Query(50, ge=1, le=200),
    current_user: User = Depends(require_roles(UserRole.ADMIN, UserRole.REVIEWER)),
    audit_service: AuditService = Depends(get_audit_service),
):
    """Retrieves paginated append-only cryptographically linked audit events.

    Restricted to Administrator and Reviewer roles.
    """
    events, total = audit_service.list_events(
        entity_type=entity_type,
        entity_id=entity_id,
        actor_id=actor_id,
        offset=offset,
        limit=limit,
    )
    return ListEnvelope[AuditEvent](
        items=events,
        total=total,
        limit=limit,
        offset=offset,
    )

@router.get("/verify", tags=["Audit Trail"])
def verify_audit_integrity(
    current_user: User = Depends(require_roles(UserRole.ADMIN, UserRole.REVIEWER)),
    audit_service: AuditService = Depends(get_audit_service),
):
    """Verifies cryptographic hash-chain continuity from genesis."""
    is_valid, error = audit_service.verify_chain()
    return {
        "valid": is_valid,
        "error": error,
        "verifiedBy": current_user.id,
    }
