from datetime import datetime, timezone
import uuid
from typing import Optional
from fastapi import APIRouter, Depends, HTTPException, Query, status

from backend.app.schemas.activity import Activity, ActivityType
from backend.app.schemas.common import ListEnvelope
from backend.app.schemas.user import User, UserRole
from backend.app.services.evidence_service import EvidenceService
from backend.app.services.audit_service import AuditService
from backend.app.api.deps import (
    get_container,
    AppContainer,
    get_evidence_service,
    get_audit_service,
    get_current_user,
    require_roles,
)

router = APIRouter(prefix="/activities", tags=["Activities"])

@router.get("", response_model=ListEnvelope[Activity])
def list_activities(
    field_id: Optional[str] = Query(None, alias="fieldId"),
    season_id: Optional[str] = Query(None, alias="seasonId"),
    activity_type: Optional[ActivityType] = Query(None, alias="activityType"),
    offset: int = Query(0, ge=0),
    limit: int = Query(50, ge=1, le=100),
    current_user: User = Depends(get_current_user),
    container: AppContainer = Depends(get_container),
):
    """Lists farming activity records."""
    if current_user.role == UserRole.BUYER:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail={"code": "NOT_FOUND", "message": "Resource not found."},
        )

    def filter_fn(item: Activity) -> bool:
        if current_user.role == UserRole.FARMER:
            if item.field_id not in current_user.assigned_field_ids:
                return False
        if current_user.role == UserRole.FIELD_OFFICER and current_user.assigned_field_ids:
            if item.field_id not in current_user.assigned_field_ids:
                return False

        if field_id and item.field_id != field_id:
            return False
        if season_id and item.season_id != season_id:
            return False
        if activity_type and item.activity_type != activity_type:
            return False
        return True

    items, total = container.activity_repo.list(filter_fn=filter_fn, offset=offset, limit=limit)
    return ListEnvelope[Activity](items=items, total=total, limit=limit, offset=offset)

@router.post("", response_model=Activity, status_code=status.HTTP_201_CREATED)
def create_activity(
    body: Activity,
    current_user: User = Depends(require_roles(
        UserRole.ADMIN, UserRole.PROJECT_DEVELOPER, UserRole.FIELD_OFFICER, UserRole.FARMER
    )),
    evidence_service: EvidenceService = Depends(get_evidence_service),
    audit_service: AuditService = Depends(get_audit_service),
    container: AppContainer = Depends(get_container),
):
    """Creates a farming practice activity record (e.g. pre-sowing irrigation, direct seeding)."""
    evidence_service.check_field_access(current_user, body.field_id)

    # Validate referenced field exists
    field = container.field_repo.get(body.field_id)
    if not field:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail={"code": "FIELD_NOT_FOUND", "message": f"Field '{body.field_id}' not found."},
        )

    existing = container.activity_repo.get(body.id)
    if existing:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail={"code": "ALREADY_EXISTS", "message": f"Activity '{body.id}' already exists."},
        )

    created = container.activity_repo.create(body)

    audit_service.log_event(
        actor_id=current_user.id,
        action="ACTIVITY_CREATED",
        entity_type="ACTIVITY",
        entity_id=body.id,
        details={"fieldId": body.field_id, "activityType": body.activity_type.value, "date": body.declared_date},
    )

    return created
