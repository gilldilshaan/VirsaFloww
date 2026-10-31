import uuid
from datetime import datetime, timezone, timedelta
from typing import Optional
from fastapi import APIRouter, Depends, File, Form, HTTPException, Query, UploadFile, status

from backend.app.schemas.review import Review, ReviewSeverity, ReviewStatus

from backend.app.schemas.evidence import (
    Evidence,
    EvidenceType,
    EvidenceCategory,
    EvidenceStatus,
    FileDetails,
    Provenance,
    GpsCoordinates,
    EvidenceStatusHistory,
)
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
from backend.app.utils.crypto import sha256_bytes

router = APIRouter(prefix="/evidence", tags=["Evidence Engine"])

@router.post("", response_model=Evidence, status_code=status.HTTP_201_CREATED)
async def upload_evidence(
    file: UploadFile = File(...),
    field_id: str = Form(..., alias="fieldId"),
    title: str = Form(...),
    type: EvidenceType = Form(...),
    category: EvidenceCategory = Form(EvidenceCategory.SUPPORTING),
    activity_id: Optional[str] = Form(None, alias="activityId"),
    description: str = Form(""),
    captured_at: str = Form(..., alias="capturedAt"),
    author: str = Form(...),
    source: str = Form("mobile_app"),
    device: Optional[str] = Form(None),
    lat: Optional[float] = Form(None),
    lng: Optional[float] = Form(None),
    accuracy_meters: Optional[float] = Form(None, alias="accuracyMeters"),
    current_user: User = Depends(require_roles(
        UserRole.ADMIN, UserRole.PROJECT_DEVELOPER, UserRole.FIELD_OFFICER, UserRole.FARMER
    )),
    evidence_service: EvidenceService = Depends(get_evidence_service),
    audit_service: AuditService = Depends(get_audit_service),
    container: AppContainer = Depends(get_container),
):
    """Uploads a new piece of MRV evidence, verifies magic bytes, and records raw SHA-256."""
    evidence_service.check_field_access(current_user, field_id)

    raw_bytes = await file.read()
    detected_mime, safe_ext = evidence_service.validate_file_bytes(raw_bytes, file.filename or "upload.bin")
    storage_path, secure_name = evidence_service.save_file_safely(raw_bytes, safe_ext)
    computed_sha = sha256_bytes(raw_bytes)

    gps_coords = None
    if lat is not None and lng is not None:
        gps_coords = GpsCoordinates(lat=lat, lng=lng, accuracy_meters=accuracy_meters)

    now_iso = datetime.now(timezone.utc).strftime("%Y-%m-%dT%H:%M:%SZ")
    evidence_id = f"EV-{uuid.uuid4().hex[:8].upper()}"

    initial_history = [
        EvidenceStatusHistory(
            timestamp=now_iso,
            previous_status=EvidenceStatus.RECEIVED,
            new_status=EvidenceStatus.HASH_RECORDED,
            actor_id=current_user.id,
            reason="Cryptographic SHA-256 hash calculated and sealed upon upload.",
        )
    ]

    evidence_item = Evidence(
        id=evidence_id,
        field_id=field_id,
        activity_id=activity_id,
        title=title,
        type=type,
        category=category,
        status=EvidenceStatus.HASH_RECORDED,
        description=description,
        captured_at=captured_at,
        submitted_at=now_iso,
        submitter_id=current_user.id,
        provenance=Provenance(
            author=author,
            source=source,
            sha256=computed_sha,
            device=device,
            gps_coordinates=gps_coords,
            review_status="Pending Assessment",
        ),
        file_details=FileDetails(
            name=file.filename or secure_name,
            size_kb=round(len(raw_bytes) / 1024.0, 2),
            mime=detected_mime,
            storage_uri=storage_path,
        ),
        status_history=initial_history,
    )

    created = container.evidence_repo.create(evidence_item)

    # Auto-enqueue for Auditor Review
    try:
        review_id = f"REV-{evidence_id.replace('EV-', '')}"
        new_review = Review(
            id=review_id,
            parcel_id=field_id,
            field_id=field_id,
            title=f"Review Submission: {title}",
            description=description or f"Field evidence uploaded by {author}. Verify cryptographic SHA-256 seal and GPS coordinates.",
            severity=ReviewSeverity.MEDIUM,
            status=ReviewStatus.PENDING_REVIEW,
            reported_date=now_iso[:10],
            due_date=(datetime.now(timezone.utc) + timedelta(days=7)).strftime("%Y-%m-%d"),
            assigned_to="Auditor Review Queue",
            evidence_ref_id=evidence_id,
            is_demo=False,
            data_label="Live Farmer Submission",
        )
        container.review_repo.create(new_review)
    except Exception:
        pass

    audit_service.log_event(
        actor_id=current_user.id,
        action="EVIDENCE_UPLOADED",
        entity_type="EVIDENCE",
        entity_id=evidence_id,
        details={
            "fieldId": field_id,
            "type": type.value,
            "sha256": computed_sha,
            "fileSize": len(raw_bytes),
        },
    )

    return created

@router.get("", response_model=ListEnvelope[Evidence])
def list_evidence(
    field_id: Optional[str] = Query(None, alias="fieldId"),
    activity_id: Optional[str] = Query(None, alias="activityId"),
    evidence_status: Optional[EvidenceStatus] = Query(None, alias="status"),
    include_superseded: bool = Query(False, alias="includeSuperseded"),
    offset: int = Query(0, ge=0),
    limit: int = Query(50, ge=1, le=100),
    current_user: User = Depends(get_current_user),
    container: AppContainer = Depends(get_container),
):
    """Lists evidence records with strict RBAC scoping."""
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

    def filter_fn(item: Evidence) -> bool:
        if current_user.role == UserRole.FARMER:
            if item.field_id not in current_user.assigned_field_ids:
                return False
        if current_user.role == UserRole.FIELD_OFFICER and current_user.assigned_field_ids:
            if item.field_id not in current_user.assigned_field_ids:
                return False

        if field_id and item.field_id != field_id:
            return False
        if activity_id and item.activity_id != activity_id:
            return False
        if evidence_status and item.status != evidence_status:
            return False
        if not include_superseded and item.status == EvidenceStatus.SUPERSEDED:
            return False
        return True

    items, total = container.evidence_repo.list(filter_fn=filter_fn, offset=offset, limit=limit)
    return ListEnvelope[Evidence](items=items, total=total, limit=limit, offset=offset)

@router.get("/{evidence_id}", response_model=Evidence)
def get_evidence_detail(
    evidence_id: str,
    current_user: User = Depends(get_current_user),
    evidence_service: EvidenceService = Depends(get_evidence_service),
    container: AppContainer = Depends(get_container),
):
    """Fetches details for a single evidence item with authorization check."""
    item = container.evidence_repo.get(evidence_id)
    if not item:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail={"code": "NOT_FOUND", "message": f"Evidence '{evidence_id}' not found."},
        )

    evidence_service.check_field_access(current_user, item.field_id)
    return item

@router.get("/{evidence_id}/history")
def get_evidence_history(
    evidence_id: str,
    current_user: User = Depends(get_current_user),
    evidence_service: EvidenceService = Depends(get_evidence_service),
    container: AppContainer = Depends(get_container),
):
    """Retrieves immutable append-only lifecycle audit trail of an evidence record."""
    item = container.evidence_repo.get(evidence_id)
    if not item:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail={"code": "NOT_FOUND", "message": f"Evidence '{evidence_id}' not found."},
        )

    evidence_service.check_field_access(current_user, item.field_id)
    return {
        "evidenceId": item.id,
        "currentStatus": item.status,
        "history": item.status_history,
    }

@router.post("/{evidence_id}/supersede", response_model=Evidence, status_code=status.HTTP_201_CREATED)
async def supersede_evidence(
    evidence_id: str,
    file: UploadFile = File(...),
    reason: str = Form(...),
    title: Optional[str] = Form(None),
    description: Optional[str] = Form(None),
    captured_at: Optional[str] = Form(None, alias="capturedAt"),
    lat: Optional[float] = Form(None),
    lng: Optional[float] = Form(None),
    accuracy_meters: Optional[float] = Form(None, alias="accuracyMeters"),
    current_user: User = Depends(require_roles(
        UserRole.ADMIN, UserRole.PROJECT_DEVELOPER, UserRole.FIELD_OFFICER, UserRole.FARMER
    )),
    evidence_service: EvidenceService = Depends(get_evidence_service),
    audit_service: AuditService = Depends(get_audit_service),
    container: AppContainer = Depends(get_container),
):
    """Atomically supersedes an existing evidence record with an updated file."""
    prev_item = container.evidence_repo.get(evidence_id)
    if not prev_item:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail={"code": "NOT_FOUND", "message": f"Evidence '{evidence_id}' not found."},
        )

    evidence_service.check_field_access(current_user, prev_item.field_id)

    if prev_item.status == EvidenceStatus.SUPERSEDED:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail={"code": "ALREADY_SUPERSEDED", "message": f"Evidence '{evidence_id}' has already been superseded."},
        )

    raw_bytes = await file.read()
    detected_mime, safe_ext = evidence_service.validate_file_bytes(raw_bytes, file.filename or "upload.bin")
    storage_path, secure_name = evidence_service.save_file_safely(raw_bytes, safe_ext)
    computed_sha = sha256_bytes(raw_bytes)

    # Transition previous evidence to superseded
    container.evidence_repo.record_status_transition(
        evidence_id=evidence_id,
        new_status=EvidenceStatus.SUPERSEDED,
        actor_id=current_user.id,
        reason=f"Superseded by replacement evidence: {reason}",
    )

    now_iso = datetime.now(timezone.utc).strftime("%Y-%m-%dT%H:%M:%SZ")
    new_evidence_id = f"EV-{uuid.uuid4().hex[:8].upper()}"

    gps_coords = prev_item.provenance.gps_coordinates
    if lat is not None and lng is not None:
        gps_coords = GpsCoordinates(lat=lat, lng=lng, accuracy_meters=accuracy_meters)

    new_history = [
        EvidenceStatusHistory(
            timestamp=now_iso,
            previous_status=EvidenceStatus.RECEIVED,
            new_status=EvidenceStatus.HASH_RECORDED,
            actor_id=current_user.id,
            reason=f"Replacement uploaded; supersedes {evidence_id}. Reason: {reason}",
        )
    ]

    new_evidence_item = Evidence(
        id=new_evidence_id,
        field_id=prev_item.field_id,
        activity_id=prev_item.activity_id,
        title=title or f"Correction: {prev_item.title}",
        type=prev_item.type,
        category=prev_item.category,
        status=EvidenceStatus.HASH_RECORDED,
        description=description or prev_item.description,
        captured_at=captured_at or prev_item.captured_at,
        submitted_at=now_iso,
        submitter_id=current_user.id,
        provenance=Provenance(
            author=current_user.name,
            source="mobile_app_correction",
            sha256=computed_sha,
            gps_coordinates=gps_coords,
            review_status="Pending Assessment",
        ),
        file_details=FileDetails(
            name=file.filename or secure_name,
            size_kb=round(len(raw_bytes) / 1024.0, 2),
            mime=detected_mime,
            storage_uri=storage_path,
        ),
        supersedes_id=evidence_id,
        status_history=new_history,
    )

    created = container.evidence_repo.create(new_evidence_item)

    audit_service.log_event(
        actor_id=current_user.id,
        action="EVIDENCE_SUPERSEDED",
        entity_type="EVIDENCE",
        entity_id=new_evidence_id,
        details={
            "supersedesId": evidence_id,
            "fieldId": prev_item.field_id,
            "reason": reason,
            "newSha256": computed_sha,
        },
    )

    return created
