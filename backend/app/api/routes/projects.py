from typing import Optional
from fastapi import APIRouter, Depends, HTTPException, Query, status

from backend.app.schemas.project import Project
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

router = APIRouter(prefix="/projects", tags=["Internal Projects"])

@router.get("", response_model=ListEnvelope[Project])
def list_projects(
    offset: int = Query(0, ge=0),
    limit: int = Query(50, ge=1, le=100),
    current_user: User = Depends(require_roles(
        UserRole.ADMIN, UserRole.PROJECT_DEVELOPER, UserRole.FIELD_OFFICER, UserRole.REVIEWER
    )),
    container: AppContainer = Depends(get_container),
):
    """Lists operational projects in the internal workspace."""
    def filter_fn(item: Project) -> bool:
        if current_user.role == UserRole.PROJECT_DEVELOPER and current_user.assigned_project_ids:
            if item.id not in current_user.assigned_project_ids:
                return False
        return True

    items, total = container.project_repo.list(filter_fn=filter_fn, offset=offset, limit=limit)
    return ListEnvelope[Project](items=items, total=total, limit=limit, offset=offset)

@router.get("/{project_id}", response_model=Project)
def get_project(
    project_id: str,
    current_user: User = Depends(require_roles(
        UserRole.ADMIN, UserRole.PROJECT_DEVELOPER, UserRole.FIELD_OFFICER, UserRole.REVIEWER
    )),
    container: AppContainer = Depends(get_container),
):
    """Fetches full operational details of an internal project."""
    item = container.project_repo.get(project_id)
    if not item:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail={"code": "NOT_FOUND", "message": f"Project '{project_id}' not found."},
        )
    return item

@router.post("", response_model=Project, status_code=status.HTTP_201_CREATED)
def create_project(
    body: Project,
    current_user: User = Depends(require_roles(UserRole.ADMIN, UserRole.PROJECT_DEVELOPER)),
    container: AppContainer = Depends(get_container),
    audit_service: AuditService = Depends(get_audit_service),
):
    """Creates a new carbon MRV project in the internal workspace."""
    existing = container.project_repo.get(body.id)
    if existing:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail={"code": "ALREADY_EXISTS", "message": f"Project '{body.id}' already exists."},
        )

    created = container.project_repo.create(body)
    audit_service.log_event(
        actor_id=current_user.id,
        action="PROJECT_CREATED",
        entity_type="PROJECT",
        entity_id=body.id,
        details={"title": body.title, "developer": body.developer},
    )
    return created

@router.put("/{project_id}", response_model=Project)
def update_project(
    project_id: str,
    body: Project,
    current_user: User = Depends(require_roles(UserRole.ADMIN, UserRole.PROJECT_DEVELOPER)),
    container: AppContainer = Depends(get_container),
    audit_service: AuditService = Depends(get_audit_service),
):
    """Updates an existing project in the internal workspace."""
    existing = container.project_repo.get(project_id)
    if not existing:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail={"code": "NOT_FOUND", "message": f"Project '{project_id}' not found."},
        )

    updated = container.project_repo.update(body)
    audit_service.log_event(
        actor_id=current_user.id,
        action="PROJECT_UPDATED",
        entity_type="PROJECT",
        entity_id=project_id,
        details={"title": body.title},
    )
    return updated

@router.post("/{project_id}/publish", response_model=Project)
def publish_project(
    project_id: str,
    current_user: User = Depends(require_roles(UserRole.ADMIN)),
    container: AppContainer = Depends(get_container),
    audit_service: AuditService = Depends(get_audit_service),
):
    """Publishes a project to the buyer-facing marketplace. Admin only."""
    project = container.project_repo.get(project_id)
    if not project:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail={"code": "NOT_FOUND", "message": f"Project '{project_id}' not found."},
        )

    updated = project.model_copy(update={"is_published": True})
    container.project_repo.update(updated)

    audit_service.log_event(
        actor_id=current_user.id,
        action="PROJECT_PUBLISHED",
        entity_type="PROJECT",
        entity_id=project_id,
        details={"title": project.title, "assessmentStatus": project.assessment_status.value},
    )

    return updated
