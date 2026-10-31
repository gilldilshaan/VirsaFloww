from typing import Optional
from pydantic import BaseModel, Field
from fastapi import APIRouter, Depends, HTTPException, Query, status

from backend.app.schemas.assessment import Assessment, AssessmentStatus
from backend.app.schemas.common import ListEnvelope
from backend.app.schemas.user import User, UserRole
from backend.app.services.evidence_service import EvidenceService
from backend.app.services.audit_service import AuditService
from backend.app.rules.evaluator import run_deterministic_ruleset
from backend.app.api.deps import (
    get_container,
    AppContainer,
    get_evidence_service,
    get_audit_service,
    get_current_user,
    require_roles,
)

router = APIRouter(prefix="/assessments", tags=["Assessments & MRV Engine"])

class RunAssessmentRequest(BaseModel):
    field_id: str = Field(..., alias="fieldId")
    season_id: Optional[str] = Field(default=None, alias="seasonId")
    trigger_reason: str = Field(default="manual", alias="triggerReason")

@router.post("/run", response_model=Assessment, status_code=status.HTTP_201_CREATED)
def trigger_assessment_run(
    body: RunAssessmentRequest,
    current_user: User = Depends(require_roles(
        UserRole.ADMIN, UserRole.PROJECT_DEVELOPER, UserRole.FIELD_OFFICER, UserRole.REVIEWER
    )),
    evidence_service: EvidenceService = Depends(get_evidence_service),
    audit_service: AuditService = Depends(get_audit_service),
    container: AppContainer = Depends(get_container),
):
    """Executes the deterministic 5-rule MRV engine for a specified field parcel."""
    evidence_service.check_field_access(current_user, body.field_id)

    field = container.field_repo.get(body.field_id)
    if not field:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail={"code": "FIELD_NOT_FOUND", "message": f"Field '{body.field_id}' not found."},
        )

    # Collect activities and evidence
    activities, _ = container.activity_repo.list(filter_fn=lambda a: a.field_id == body.field_id)
    evidence_items, _ = container.evidence_repo.list(filter_fn=lambda e: e.field_id == body.field_id)

    # Run deterministic ruleset
    assessment = run_deterministic_ruleset(
        field=field,
        activities=activities,
        evidence_items=evidence_items,
    )

    created = container.assessment_repo.create(assessment)

    audit_service.log_event(
        actor_id=current_user.id,
        action="ASSESSMENT_RUN",
        entity_type="ASSESSMENT",
        entity_id=assessment.id,
        details={
            "fieldId": body.field_id,
            "status": assessment.status.value,
            "statusLabel": assessment.status_label,
            "triggerReason": body.trigger_reason,
        },
    )

    return created

@router.get("", response_model=ListEnvelope[Assessment])
def list_assessments(
    field_id: Optional[str] = Query(None, alias="fieldId"),
    status: Optional[AssessmentStatus] = Query(None),
    offset: int = Query(0, ge=0),
    limit: int = Query(50, ge=1, le=100),
    current_user: User = Depends(get_current_user),
    container: AppContainer = Depends(get_container),
):
    """Lists MRV assessments with RBAC scoping."""
    if current_user.role == UserRole.BUYER:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail={"code": "NOT_FOUND", "message": "Resource not found."},
        )

    if current_user.role == UserRole.FARMER:
        if field_id and field_id not in current_user.assigned_field_ids:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail={"code": "NOT_FOUND", "message": "Field not found or access denied."},
            )

    def filter_fn(item: Assessment) -> bool:
        if current_user.role == UserRole.FARMER:
            if item.field_id not in current_user.assigned_field_ids:
                return False
        if current_user.role == UserRole.FIELD_OFFICER and current_user.assigned_field_ids:
            if item.field_id not in current_user.assigned_field_ids:
                return False

        if field_id and item.field_id != field_id:
            return False
        if status and item.status != status:
            return False
        return True

    items, total = container.assessment_repo.list(filter_fn=filter_fn, offset=offset, limit=limit)
    return ListEnvelope[Assessment](items=items, total=total, limit=limit, offset=offset)

@router.get("/{assessment_id}", response_model=Assessment)
def get_assessment(
    assessment_id: str,
    current_user: User = Depends(get_current_user),
    evidence_service: EvidenceService = Depends(get_evidence_service),
    container: AppContainer = Depends(get_container),
):
    """Fetches details and rule breakdown of a single MRV assessment."""
    item = container.assessment_repo.get(assessment_id)
    if not item:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail={"code": "NOT_FOUND", "message": f"Assessment '{assessment_id}' not found."},
        )

    evidence_service.check_field_access(current_user, item.field_id)
    return item
