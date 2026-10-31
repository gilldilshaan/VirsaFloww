from datetime import datetime, timezone
import uuid
from typing import Optional
from fastapi import APIRouter, Depends, HTTPException, Query, status

from backend.app.schemas.buyer import (
    BuyerEnquiry,
    BuyerEnquiryCreate,
    EnquiryStage,
    EnquiryStatus,
)
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

router = APIRouter(prefix="", tags=["Buyer Enquiries"])

@router.post("/buyer/enquiries", response_model=BuyerEnquiry, status_code=status.HTTP_201_CREATED)
def create_buyer_enquiry(
    body: BuyerEnquiryCreate,
    current_user: User = Depends(require_roles(UserRole.BUYER, UserRole.ADMIN)),
    container: AppContainer = Depends(get_container),
    audit_service: AuditService = Depends(get_audit_service),
):
    """Submits a commercial credit enquiry from an authenticated buyer."""
    # Lookup project to attach title
    project = container.project_repo.get(body.project_id)
    project_title = project.title if project else "Basmati DSR Kharif 2026 Programme"

    now_iso = datetime.now(timezone.utc).strftime("%Y-%m-%d")
    enquiry_id = f"ENQ-{uuid.uuid4().hex[:8].upper()}"

    enquiry = BuyerEnquiry(
        id=enquiry_id,
        project_id=body.project_id,
        project_title=project_title,
        buyer_company_id=current_user.buyer_company_id or "COMP-BUYER-01",
        buyer_name=current_user.name,
        buyer_org=current_user.organization or "Corporate Buyer Ltd.",
        owner_id=current_user.id,
        inquiry_date=now_iso,
        stage=EnquiryStage.INQUIRY,
        status=EnquiryStatus.ACTIVE,
        volume_requested_tons=body.volume_requested_tons,
        target_retirement_year=body.target_retirement_year,
        message=body.message,
    )

    created = container.buyer_enquiry_repo.create(enquiry)

    audit_service.log_event(
        actor_id=current_user.id,
        action="BUYER_ENQUIRY_CREATED",
        entity_type="BUYER_ENQUIRY",
        entity_id=enquiry_id,
        details={
            "projectId": body.project_id,
            "volumeTons": body.volume_requested_tons,
            "companyId": enquiry.buyer_company_id,
        },
    )

    return created

@router.get("/buyer/enquiries", response_model=ListEnvelope[BuyerEnquiry])
def list_buyer_own_enquiries(
    offset: int = Query(0, ge=0),
    limit: int = Query(50, ge=1, le=100),
    current_user: User = Depends(require_roles(UserRole.BUYER, UserRole.ADMIN)),
    container: AppContainer = Depends(get_container),
):
    """Lists enquiries submitted by the authenticated buyer's organisation."""
    def filter_fn(item: BuyerEnquiry) -> bool:
        if current_user.role == UserRole.BUYER:
            if current_user.buyer_company_id and item.buyer_company_id != current_user.buyer_company_id:
                return False
            if not current_user.buyer_company_id and item.owner_id != current_user.id:
                return False
        return True

    items, total = container.buyer_enquiry_repo.list(filter_fn=filter_fn, offset=offset, limit=limit)
    return ListEnvelope[BuyerEnquiry](items=items, total=total, limit=limit, offset=offset)

@router.get("/enquiries", response_model=ListEnvelope[BuyerEnquiry])
def list_all_enquiries_internal(
    project_id: Optional[str] = Query(None, alias="projectId"),
    offset: int = Query(0, ge=0),
    limit: int = Query(50, ge=1, le=100),
    current_user: User = Depends(require_roles(UserRole.ADMIN, UserRole.PROJECT_DEVELOPER)),
    container: AppContainer = Depends(get_container),
):
    """Internal view of all incoming buyer enquiries across projects."""
    def filter_fn(item: BuyerEnquiry) -> bool:
        if project_id and item.project_id != project_id:
            return False
        return True

    items, total = container.buyer_enquiry_repo.list(filter_fn=filter_fn, offset=offset, limit=limit)
    return ListEnvelope[BuyerEnquiry](items=items, total=total, limit=limit, offset=offset)
