from fastapi import APIRouter, Depends
from backend.app.schemas.user import User
from backend.app.schemas.graph import EvidenceGraphResponse
from backend.app.services.graph_service import GraphService
from backend.app.api.deps import get_current_user, get_graph_service

router = APIRouter(tags=["Evidence Graph"])

@router.get("/fields/{field_id}/graph", response_model=EvidenceGraphResponse)
def get_field_evidence_graph(
    field_id: str,
    current_user: User = Depends(get_current_user),
    graph_service: GraphService = Depends(get_graph_service),
) -> EvidenceGraphResponse:
    return graph_service.build_field_graph(field_id, current_user)

@router.get("/projects/{project_id}/graph", response_model=EvidenceGraphResponse)
def get_project_evidence_graph(
    project_id: str,
    current_user: User = Depends(get_current_user),
    graph_service: GraphService = Depends(get_graph_service),
) -> EvidenceGraphResponse:
    return graph_service.build_project_graph(project_id, current_user)
