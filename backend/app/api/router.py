from fastapi import APIRouter
from backend.app.api.routes import (
    health,
    auth,
    audit,
    evidence,
    seasons,
    activities,
    assessments,
    reviews,
    notifications,
    projects,
    fields,
    marketplace,
    enquiries,
    satellite,
    graphs,
    explanations,
)

api_router = APIRouter(prefix="/api")

api_router.include_router(health.router)
api_router.include_router(auth.router)
api_router.include_router(audit.router)
api_router.include_router(evidence.router)
api_router.include_router(seasons.router)
api_router.include_router(activities.router)
api_router.include_router(assessments.router)
api_router.include_router(reviews.router)
api_router.include_router(notifications.router)
api_router.include_router(projects.router)
api_router.include_router(fields.router)
api_router.include_router(marketplace.router)
api_router.include_router(enquiries.router)
api_router.include_router(satellite.router)
api_router.include_router(graphs.router)
api_router.include_router(explanations.router)

# Mount /api/me alias directly on /api
@api_router.get("/me", tags=["Authentication"], response_model=auth.User)
def get_me_top_level(current_user: auth.User = auth.Depends(auth.get_current_user)):
    return current_user
