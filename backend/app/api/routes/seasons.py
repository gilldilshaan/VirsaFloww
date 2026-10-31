from typing import Optional
from fastapi import APIRouter, Depends, HTTPException, Query, status

from backend.app.schemas.season import Season
from backend.app.schemas.common import ListEnvelope
from backend.app.schemas.user import User, UserRole
from backend.app.api.deps import get_container, AppContainer, get_current_user, require_roles
from backend.app.services.audit_service import AuditService
from backend.app.api.deps import get_audit_service

router = APIRouter(prefix="/seasons", tags=["Seasons"])

@router.get("", response_model=ListEnvelope[Season])
def list_seasons(
    offset: int = Query(0, ge=0),
    limit: int = Query(50, ge=1, le=100),
    current_user: User = Depends(get_current_user),
    container: AppContainer = Depends(get_container),
):
    """Lists agricultural seasons."""
    if current_user.role == UserRole.BUYER:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail={"code": "NOT_FOUND", "message": "Resource not found."},
        )

    items, total = container.season_repo.list(offset=offset, limit=limit)
    return ListEnvelope[Season](items=items, total=total, limit=limit, offset=offset)

@router.post("", response_model=Season, status_code=status.HTTP_201_CREATED)
def create_season(
    body: Season,
    current_user: User = Depends(require_roles(UserRole.ADMIN, UserRole.PROJECT_DEVELOPER)),
    container: AppContainer = Depends(get_container),
    audit_service: AuditService = Depends(get_audit_service),
):
    """Creates a new agricultural season."""
    existing = container.season_repo.get(body.id)
    if existing:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail={"code": "ALREADY_EXISTS", "message": f"Season '{body.id}' already exists."},
        )

    created = container.season_repo.create(body)

    audit_service.log_event(
        actor_id=current_user.id,
        action="SEASON_CREATED",
        entity_type="SEASON",
        entity_id=body.id,
        details={"name": body.name, "year": body.year},
    )

    return created
