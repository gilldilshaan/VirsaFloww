from typing import Optional
from fastapi import APIRouter, Depends, HTTPException, Query, status

from backend.app.schemas.field import FieldModel
from backend.app.schemas.common import ListEnvelope
from backend.app.schemas.user import User, UserRole
from backend.app.services.evidence_service import EvidenceService
from backend.app.api.deps import (
    get_container,
    AppContainer,
    get_evidence_service,
    get_current_user,
    require_roles,
)

router = APIRouter(prefix="/fields", tags=["Field Parcels"])

@router.get("", response_model=ListEnvelope[FieldModel])
def list_fields(
    project_id: Optional[str] = Query(None, alias="projectId"),
    offset: int = Query(0, ge=0),
    limit: int = Query(50, ge=1, le=100),
    current_user: User = Depends(get_current_user),
    container: AppContainer = Depends(get_container),
):
    """Lists field parcels with RBAC filtering."""
    if current_user.role == UserRole.BUYER:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail={"code": "NOT_FOUND", "message": "Resource not found."},
        )

    def filter_fn(item: FieldModel) -> bool:
        if current_user.role == UserRole.FARMER:
            if item.id not in current_user.assigned_field_ids:
                return False
        if current_user.role == UserRole.FIELD_OFFICER and current_user.assigned_field_ids:
            if item.id not in current_user.assigned_field_ids:
                return False
        if project_id and item.project_id != project_id:
            return False
        return True

    items, total = container.field_repo.list(filter_fn=filter_fn, offset=offset, limit=limit)
    return ListEnvelope[FieldModel](items=items, total=total, limit=limit, offset=offset)

@router.get("/{field_id}", response_model=FieldModel)
def get_field(
    field_id: str,
    current_user: User = Depends(get_current_user),
    evidence_service: EvidenceService = Depends(get_evidence_service),
    container: AppContainer = Depends(get_container),
):
    """Fetches details of a single field parcel with role checks."""
    evidence_service.check_field_access(current_user, field_id)

    item = container.field_repo.get(field_id)
    if not item:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail={"code": "NOT_FOUND", "message": f"Field '{field_id}' not found."},
        )
    return item
