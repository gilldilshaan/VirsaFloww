from datetime import datetime, timezone
import uuid
from typing import Optional
from fastapi import APIRouter, Depends, HTTPException, Query, status

from backend.app.schemas.review import (
    Review,
    ReviewStatus,
    ReviewSeverity,
    ReviewDecisionRequest,
    ReviewDecisionType,
)
from backend.app.schemas.notification import Notification, NotificationType
from backend.app.schemas.common import ListEnvelope
from backend.app.schemas.user import User, UserRole
from backend.app.services.audit_service import AuditService
from backend.app.api.deps import (
    get_container,
    AppContainer,
    get_audit_service,
    get_current_user,
    require_roles,
)

router = APIRouter(prefix="/reviews", tags=["Auditor Reviews & Decisions"])

@router.get("", response_model=ListEnvelope[Review])
def list_reviews(
    project_id: Optional[str] = Query(None, alias="projectId"),
    review_status: Optional[ReviewStatus] = Query(None, alias="status"),
    severity: Optional[ReviewSeverity] = Query(None),
    offset: int = Query(0, ge=0),
    limit: int = Query(50, ge=1, le=100),
    current_user: User = Depends(get_current_user),
    container: AppContainer = Depends(get_container),
):
    """Lists verification reviews with role-based scoping."""
    if current_user.role == UserRole.BUYER:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail={"code": "NOT_FOUND", "message": "Resource not found."},
        )

    def filter_fn(item: Review) -> bool:
        if project_id and item.project_id != project_id:
            return False
        if review_status and item.status != review_status:
            return False
        if severity and item.severity != severity:
            return False
        return True

    items, total = container.review_repo.list(filter_fn=filter_fn, offset=offset, limit=limit)
    return ListEnvelope[Review](items=items, total=total, limit=limit, offset=offset)

@router.get("/{review_id}", response_model=Review)
def get_review(
    review_id: str,
    current_user: User = Depends(get_current_user),
    container: AppContainer = Depends(get_container),
):
    """Fetches details of a single review."""
    if current_user.role == UserRole.BUYER:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail={"code": "NOT_FOUND", "message": "Resource not found."},
        )

    item = container.review_repo.get(review_id)
    if not item:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail={"code": "NOT_FOUND", "message": f"Review '{review_id}' not found."},
        )
    return item

@router.post("/{review_id}/decision", response_model=Review)
def submit_review_decision(
    review_id: str,
    body: ReviewDecisionRequest,
    current_user: User = Depends(require_roles(UserRole.ADMIN, UserRole.REVIEWER)),
    container: AppContainer = Depends(get_container),
    audit_service: AuditService = Depends(get_audit_service),
):
    """Records an authoritative review decision (Accepted, Clarification Requested, Rejected)."""
    review = container.review_repo.get(review_id)
    if not review:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail={"code": "NOT_FOUND", "message": f"Review '{review_id}' not found."},
        )

    now_iso = datetime.now(timezone.utc).strftime("%Y-%m-%dT%H:%M:%SZ")

    if body.decision == ReviewDecisionType.ACCEPTED:
        new_status = ReviewStatus.RESOLVED
    elif body.decision == ReviewDecisionType.REJECTED:
        new_status = ReviewStatus.RESOLVED
    elif body.decision == ReviewDecisionType.CLARIFICATION_REQUESTED:
        new_status = ReviewStatus.IN_INVESTIGATION
    else:
        new_status = review.status

    updated_review = review.model_copy(
        update={
            "status": new_status,
            "decision": body.decision,
            "comment": body.comment,
            "resolved_at": now_iso,
            "resolved_by": current_user.id,
        }
    )
    container.review_repo.update(updated_review)

    # If clarification requested, dispatch notification
    if body.decision == ReviewDecisionType.CLARIFICATION_REQUESTED:
        notif_id = f"NOTIF-{uuid.uuid4().hex[:8].upper()}"
        notif = Notification(
            id=notif_id,
            recipient_id="USR-FLD-03",  # Assigned officer or farmer
            field_id=review.field_id,
            type=NotificationType.CORRECTION_REQUEST,
            title=f"Clarification Requested: {review.title}",
            message=body.correction_request or body.comment,
            created_at=now_iso,
        )
        container.notification_repo.create(notif)

    audit_service.log_event(
        actor_id=current_user.id,
        action="REVIEW_DECISION",
        entity_type="REVIEW",
        entity_id=review_id,
        details={
            "decision": body.decision.value,
            "newStatus": new_status.value,
        },
    )

    return updated_review
