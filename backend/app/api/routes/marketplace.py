import json
import os
from typing import Optional, List
from fastapi import APIRouter, Depends, HTTPException, Query, status

from backend.app.schemas.project import Project, BuyerProjectSummary
from backend.app.schemas.common import ListEnvelope
from backend.app.api.deps import get_container, AppContainer
from backend.app.core.config import settings

router = APIRouter(prefix="", tags=["Buyer Marketplace"])

def project_to_buyer_summary(p: Project) -> BuyerProjectSummary:
    return BuyerProjectSummary(
        id=p.id,
        title=p.title,
        slug=p.slug,
        location=p.location,
        district=p.district,
        practice=p.practice,
        methodology=p.methodology,
        developer=p.developer,
        enrolled_hectares=p.total_hectares,
        eligible_hectares=None,
        enrolled_parcels=p.enrolled_parcels,
        assessment_status=p.assessment_status,
        status_label=p.status_label,
        outstanding_verification=p.outstanding_verification,
        vintage=p.vintage,
        description=p.description,
        highlights=p.highlights,
        evidence_depth=p.evidence_depth,
        is_demo=p.is_demo,
        data_label=p.data_label,
    )

@router.get("/marketplace", response_model=ListEnvelope[BuyerProjectSummary])
def list_marketplace_projects(
    offset: int = Query(0, ge=0),
    limit: int = Query(50, ge=1, le=100),
    container: AppContainer = Depends(get_container),
):
    """Lists published, buyer-safe projects in the carbon marketplace.

    GUARANTEES: Omits all farmer personal identifiable information, phone numbers, and IDs.
    """
    # 1. Projects published from internal repository
    published_projects = container.project_repo.find_all(lambda p: p.is_published is True)
    summaries = [project_to_buyer_summary(p) for p in published_projects]

    # 2. Check root seed marketplace if available and not duplicated
    seed_marketplace_path = settings.ROOT_SEED_MARKETPLACE_PATH
    if os.path.exists(seed_marketplace_path):
        try:
            with open(seed_marketplace_path, "r", encoding="utf-8") as f:
                content = f.read().strip()
                if content:
                    raw_seed = json.loads(content)
                    existing_ids = {s.id for s in summaries}
                    for item in raw_seed:
                        try:
                            summary = BuyerProjectSummary.model_validate(item)
                            if summary.id not in existing_ids:
                                summaries.append(summary)
                                existing_ids.add(summary.id)
                        except Exception:
                            continue
        except Exception:
            pass

    total = len(summaries)
    paginated = summaries[offset : offset + limit]
    return ListEnvelope[BuyerProjectSummary](items=paginated, total=total, limit=limit, offset=offset)

@router.get("/buyer/projects/{project_id}", response_model=BuyerProjectSummary)
def get_buyer_project_detail(
    project_id: str,
    container: AppContainer = Depends(get_container),
):
    """Fetches buyer-safe project detail for a published project."""
    project = container.project_repo.get(project_id)
    if project and project.is_published:
        return project_to_buyer_summary(project)

    # Check root seed marketplace
    seed_marketplace_path = settings.ROOT_SEED_MARKETPLACE_PATH
    if os.path.exists(seed_marketplace_path):
        try:
            with open(seed_marketplace_path, "r", encoding="utf-8") as f:
                content = f.read().strip()
                if content:
                    raw_seed = json.loads(content)
                    for item in raw_seed:
                        if item.get("id") == project_id:
                            return BuyerProjectSummary.model_validate(item)
        except Exception:
            pass

    raise HTTPException(
        status_code=status.HTTP_404_NOT_FOUND,
        detail={"code": "NOT_FOUND", "message": f"Published project '{project_id}' not found."},
    )
