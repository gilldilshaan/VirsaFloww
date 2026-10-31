import os
from typing import Any, Callable, Optional
from fastapi import Depends, Header, HTTPException, Request, status
from backend.app.core.config import settings
from backend.app.schemas.user import User, UserInDB, UserRole
from backend.app.schemas.project import Project
from backend.app.schemas.farmer import FarmerProfile
from backend.app.schemas.field import FieldModel
from backend.app.schemas.season import Season
from backend.app.schemas.activity import Activity
from backend.app.schemas.assessment import Assessment
from backend.app.schemas.review import Review
from backend.app.schemas.buyer import BuyerEnquiry
from backend.app.schemas.notification import Notification
from backend.app.storage.json_storage import JsonFileRepository
from backend.app.storage.evidence_storage import EvidenceRepository
from backend.app.services.auth_service import AuthService
from backend.app.services.audit_service import AuditService
from backend.app.services.evidence_service import EvidenceService
from backend.app.services.graph_service import GraphService
from agent.explainer import TerraExplainer
from agent.cache import ExplainerCache

# Container singleton holder
class AppContainer:
    def __init__(self, runtime_dir: str = None, seed_dir: str = None, audit_path: str = None):
        self.runtime_dir = runtime_dir or settings.RUNTIME_DIR
        self.seed_dir = seed_dir or settings.SEED_DIR
        self.audit_path = audit_path or settings.AUDIT_LOG_PATH

        os.makedirs(self.runtime_dir, exist_ok=True)
        os.makedirs(os.path.dirname(self.audit_path), exist_ok=True)

        if settings.STORAGE_BACKEND == "postgres":
            # Lazy import DB dependencies only in postgres mode
            from sqlalchemy import text
            from backend.app.db.models import (
                UserDB,
                ProjectDB,
                FarmerDB,
                FieldDB,
                SeasonDB,
                ActivityDB,
                AssessmentDB,
                ReviewDB,
                BuyerEnquiryDB,
                NotificationDB,
            )
            from backend.app.db.session import get_engine
            from backend.app.storage.postgres_storage import PostgresRepository
            from backend.app.storage.postgres_evidence_storage import PostgresEvidenceRepository
            from backend.app.services.postgres_audit_service import PostgresAuditService

            try:
                engine = get_engine()
                with engine.connect() as conn:
                    conn.execute(text("SELECT 1;"))
            except Exception as exc:
                raise RuntimeError(
                    f"Failed to connect to Supabase PostgreSQL database: {exc}. "
                    "Please verify your connection settings and ensure your Supabase project is active "
                    "(free-tier projects may pause after inactivity)."
                ) from exc

            self.user_repo = PostgresRepository[UserInDB](
                UserInDB,
                UserDB,
                seed_path=os.path.join(self.seed_dir, "users.json") if self.seed_dir else None,
            )
            self.project_repo = PostgresRepository[Project](
                Project,
                ProjectDB,
                seed_path=os.path.join(self.seed_dir, "projects.json") if self.seed_dir else None,
            )
            self.farmer_repo = PostgresRepository[FarmerProfile](
                FarmerProfile,
                FarmerDB,
                seed_path=os.path.join(self.seed_dir, "farmers.json") if self.seed_dir else None,
            )
            self.field_repo = PostgresRepository[FieldModel](
                FieldModel,
                FieldDB,
                seed_path=os.path.join(self.seed_dir, "fields.json") if self.seed_dir else None,
            )
            self.season_repo = PostgresRepository[Season](
                Season,
                SeasonDB,
                seed_path=os.path.join(self.seed_dir, "seasons.json") if self.seed_dir else None,
            )
            self.activity_repo = PostgresRepository[Activity](
                Activity,
                ActivityDB,
                seed_path=os.path.join(self.seed_dir, "activities.json") if self.seed_dir else None,
            )
            self.evidence_repo = PostgresEvidenceRepository(
                seed_path=settings.ROOT_SEED_EVIDENCE_PATH,
            )
            self.assessment_repo = PostgresRepository[Assessment](
                Assessment,
                AssessmentDB,
            )
            self.review_repo = PostgresRepository[Review](
                Review,
                ReviewDB,
                seed_path=os.path.join(self.seed_dir, "reviews.json") if self.seed_dir else None,
            )
            self.buyer_enquiry_repo = PostgresRepository[BuyerEnquiry](
                BuyerEnquiry,
                BuyerEnquiryDB,
            )
            self.notification_repo = PostgresRepository[Notification](
                Notification,
                NotificationDB,
            )
            self.audit_service = PostgresAuditService()
        else:
            self.user_repo = JsonFileRepository[UserInDB](
                UserInDB,
                os.path.join(self.runtime_dir, "users.json"),
                os.path.join(self.seed_dir, "users.json") if self.seed_dir else None,
            )
            self.project_repo = JsonFileRepository[Project](
                Project,
                os.path.join(self.runtime_dir, "projects.json"),
                os.path.join(self.seed_dir, "projects.json") if self.seed_dir else None,
            )
            self.farmer_repo = JsonFileRepository[FarmerProfile](
                FarmerProfile,
                os.path.join(self.runtime_dir, "farmers.json"),
                os.path.join(self.seed_dir, "farmers.json") if self.seed_dir else None,
            )
            self.field_repo = JsonFileRepository[FieldModel](
                FieldModel,
                os.path.join(self.runtime_dir, "fields.json"),
                os.path.join(self.seed_dir, "fields.json") if self.seed_dir else None,
            )
            self.season_repo = JsonFileRepository[Season](
                Season,
                os.path.join(self.runtime_dir, "seasons.json"),
                os.path.join(self.seed_dir, "seasons.json") if self.seed_dir else None,
            )
            self.activity_repo = JsonFileRepository[Activity](
                Activity,
                os.path.join(self.runtime_dir, "activities.json"),
                os.path.join(self.seed_dir, "activities.json") if self.seed_dir else None,
            )
            self.evidence_repo = EvidenceRepository(
                os.path.join(self.runtime_dir, "evidence.json"),
                settings.ROOT_SEED_EVIDENCE_PATH,
            )
            self.assessment_repo = JsonFileRepository[Assessment](
                Assessment,
                os.path.join(self.runtime_dir, "assessments.json"),
            )
            self.review_repo = JsonFileRepository[Review](
                Review,
                os.path.join(self.runtime_dir, "reviews.json"),
                os.path.join(self.seed_dir, "reviews.json") if self.seed_dir else None,
            )
            self.buyer_enquiry_repo = JsonFileRepository[BuyerEnquiry](
                BuyerEnquiry,
                os.path.join(self.runtime_dir, "buyer_enquiries.json"),
            )
            self.notification_repo = JsonFileRepository[Notification](
                Notification,
                os.path.join(self.runtime_dir, "notifications.json"),
            )
            self.audit_service = AuditService(self.audit_path)

        # Services
        self.auth_service = AuthService(self.user_repo)
        self.evidence_service = EvidenceService(self.evidence_repo, self.audit_service)
        self.graph_service = GraphService(self)
        self.explainer = TerraExplainer(
            cache=ExplainerCache(os.path.join(self.runtime_dir, "explainer_cache.json"))
        )

    def reset_all_to_seeds(self) -> None:
        """Resets all runtime repositories to their initial seed state."""
        self.user_repo.reset_to_seed()
        self.project_repo.reset_to_seed()
        self.farmer_repo.reset_to_seed()
        self.field_repo.reset_to_seed()
        self.season_repo.reset_to_seed()
        self.activity_repo.reset_to_seed()
        self.evidence_repo.reset_to_seed()
        self.assessment_repo.reset_to_seed()
        self.review_repo.reset_to_seed()
        self.buyer_enquiry_repo.reset_to_seed()
        self.notification_repo.reset_to_seed()
        self.explainer.cache.clear()

_container: Optional[AppContainer] = None

def get_container() -> AppContainer:
    global _container
    if _container is None:
        _container = AppContainer()
    return _container

def set_container(container: AppContainer) -> None:
    global _container
    _container = container

# Dependency Providers
def get_auth_service(container: AppContainer = Depends(get_container)) -> AuthService:
    return container.auth_service

def get_audit_service(container: AppContainer = Depends(get_container)) -> Any:
    return container.audit_service

def get_evidence_service(container: AppContainer = Depends(get_container)) -> EvidenceService:
    return container.evidence_service

def get_graph_service(container: AppContainer = Depends(get_container)) -> GraphService:
    return container.graph_service

def get_explainer(container: AppContainer = Depends(get_container)) -> TerraExplainer:
    return container.explainer

def get_current_user(
    authorization: Optional[str] = Header(None),
    auth_service: AuthService = Depends(get_auth_service),
) -> User:
    """Authenticates caller and resolves their real role from the user repository.

    Client-provided role claims are ignored.
    """
    if not authorization or not authorization.startswith("Bearer "):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail={"code": "UNAUTHENTICATED", "message": "Missing or malformed Authorization header."},
        )

    token = authorization.split(" ", 1)[1].strip()
    user = auth_service.decode_and_resolve_user(token)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail={"code": "UNAUTHENTICATED", "message": "Invalid, expired, or revoked session token."},
        )
    return user

def require_roles(*allowed_roles: UserRole) -> Callable[[User], User]:
    """Dependency enforcing role-based access control.

    Returns HTTP 404 (NOT_FOUND) when unauthorized to avoid leaking endpoint existence.
    """
    def _role_checker(user: User = Depends(get_current_user)) -> User:
        if user.role not in allowed_roles:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail={"code": "NOT_FOUND", "message": "Resource or endpoint not found."},
            )
        return user
    return _role_checker
