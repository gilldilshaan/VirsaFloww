import time
import threading
from typing import Dict, List
from fastapi import APIRouter, Depends, HTTPException, Request, status

from backend.app.schemas.user import User, UserRole
from backend.app.schemas.explainer import ExplainerRequest, ExplainerResponse
from backend.app.schemas.audit import AuditEvent
from backend.app.api.deps import (
    AppContainer,
    get_container,
    get_current_user,
    require_roles,
    get_explainer,
)
from agent.explainer import TerraExplainer
from agent.context import ExplainerContext

router = APIRouter(tags=["Terra Intelligence Explainer"])

EXPLAINER_RATE_LIMIT_MAX = 10
EXPLAINER_RATE_LIMIT_WINDOW = 60.0
_explainer_lock = threading.Lock()
_explainer_attempts: Dict[str, List[float]] = {}

def check_explainer_rate_limit(key: str) -> bool:
    now = time.time()
    with _explainer_lock:
        attempts = _explainer_attempts.get(key, [])
        recent = [t for t in attempts if now - t < EXPLAINER_RATE_LIMIT_WINDOW]
        if len(recent) >= EXPLAINER_RATE_LIMIT_MAX:
            return False
        recent.append(now)
        _explainer_attempts[key] = recent
        return True

def reset_explainer_rate_limits() -> None:
    with _explainer_lock:
        _explainer_attempts.clear()

@router.post("/explanations", response_model=ExplainerResponse)
def generate_explanation(
    body: ExplainerRequest,
    request: Request,
    current_user: User = Depends(require_roles(
        UserRole.ADMIN,
        UserRole.PROJECT_DEVELOPER,
        UserRole.FIELD_OFFICER,
        UserRole.REVIEWER,
    )),
    container: AppContainer = Depends(get_container),
    explainer: TerraExplainer = Depends(get_explainer),
) -> ExplainerResponse:
    """Generates a truthful, deterministic-first explanation for an assessment."""
    # 1. Rate-limiting check
    client_key = f"{current_user.id}:{request.client.host if request.client else 'unknown'}"
    if not check_explainer_rate_limit(client_key):
        raise HTTPException(
            status_code=status.HTTP_429_TOO_MANY_REQUESTS,
            detail={"code": "RATE_LIMITED", "message": "Explanation rate limit exceeded. Please wait a minute."},
        )

    # 2. Assessment lookup
    assessment = container.assessment_repo.get(body.assessment_id)
    if not assessment:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail={"code": "NOT_FOUND", "message": f"Assessment '{body.assessment_id}' not found."},
        )

    # 3. Field lookup & scoping checks
    field = container.field_repo.get(assessment.field_id)
    if not field:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail={"code": "NOT_FOUND", "message": f"Field '{assessment.field_id}' not found."},
        )

    if current_user.role == UserRole.PROJECT_DEVELOPER and current_user.assigned_project_ids:
        if field.project_id not in current_user.assigned_project_ids and field.id not in current_user.assigned_field_ids:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail={"code": "NOT_FOUND", "message": "Assessment access denied."},
            )

    if current_user.role == UserRole.FIELD_OFFICER and current_user.assigned_field_ids:
        if field.id not in current_user.assigned_field_ids:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail={"code": "NOT_FOUND", "message": "Assessment access denied."},
            )

    # 4. Context assembly
    activities, _ = container.activity_repo.list(filter_fn=lambda a: a.field_id == field.id)
    evidence_items, _ = container.evidence_repo.list(filter_fn=lambda e: e.field_id == field.id)
    observations = container.graph_service._read_observations(field.id)

    context = ExplainerContext(
        assessment=assessment,
        field=field,
        activities=activities,
        evidence_items=evidence_items,
        observations=observations,
    )

    # 5. Pipeline execution (CACHE -> LLM -> TEMPLATE)
    resp = explainer.explain(context, question=body.question or "Explain assessment findings.")

    # 6. Audit event recording (Never record full text prompt/response)
    container.audit_service.log_event(
        actor_id=current_user.id,
        action="explanation.generated",
        entity_type="assessment",
        entity_id=assessment.id,
        details={
            "mode": resp.mode.value,
            "citations": resp.citations,
            "rulesetVersion": assessment.ruleset_version,
            "actorRole": current_user.role.value,
        },
    )

    return resp
