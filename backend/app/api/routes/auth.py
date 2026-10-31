import uuid
from typing import Optional
from fastapi import APIRouter, Depends, HTTPException, Request, Query, status
from backend.app.schemas.user import LoginRequest, RegisterRequest, SessionResponse, User, UserInDB, UserRole
from backend.app.schemas.common import ListEnvelope
from backend.app.services.auth_service import AuthService
from backend.app.services.audit_service import AuditService
from backend.app.api.deps import (
    get_auth_service,
    get_audit_service,
    get_current_user,
    get_container,
    AppContainer,
    require_roles,
)
from backend.app.utils.crypto import hash_password

router = APIRouter(prefix="/auth", tags=["Authentication"])

ROLE_CODE_MAP = {
    UserRole.ADMIN: "ADMIN",
    UserRole.PROJECT_DEVELOPER: "DEV",
    UserRole.FIELD_OFFICER: "FLD",
    UserRole.REVIEWER: "REV",
    UserRole.FARMER: "FAR",
    UserRole.BUYER: "BUY",
}

@router.post("/register", response_model=SessionResponse, status_code=status.HTTP_201_CREATED)
def register(
    body: RegisterRequest,
    request: Request,
    auth_service: AuthService = Depends(get_auth_service),
    audit_service: AuditService = Depends(get_audit_service),
):
    """Registers a new user, hashes password with scrypt, persists user, and returns a signed JWT."""
    norm_email = body.email.strip().lower()

    # Check for existing user with identical email
    existing_users, _ = auth_service.user_repo.list(
        filter_fn=lambda u: u.email.lower() == norm_email,
        limit=1,
    )
    if existing_users:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail={"code": "EMAIL_ALREADY_EXISTS", "message": "An account with this email address already exists."},
        )

    role_code = ROLE_CODE_MAP.get(body.role, "USR")
    short_suffix = uuid.uuid4().hex[:8].upper()
    user_id = f"USR-{role_code}-{short_suffix}"

    pw_hash = hash_password(body.password)

    user_in_db = UserInDB(
        id=user_id,
        email=norm_email,
        name=body.name.strip(),
        role=body.role,
        organization=body.organization.strip() if body.organization else None,
        buyer_company_id=body.buyer_company_id.strip() if body.buyer_company_id else None,
        assigned_project_ids=[],
        assigned_field_ids=[],
        is_active=True,
        password_hash=pw_hash,
    )

    auth_service.user_repo.create(user_in_db)
    user = User.model_validate(user_in_db.model_dump())

    token, expires_in = auth_service.create_access_token(user)

    audit_service.log_event(
        actor_id=user.id,
        action="USER_REGISTER",
        entity_type="USER",
        entity_id=user.id,
        details={"email": user.email, "role": user.role, "organization": user.organization},
    )

    return SessionResponse(
        access_token=token,
        token_type="Bearer",
        expires_in_seconds=expires_in,
        user=user,
    )

@router.post("/session", response_model=SessionResponse)
@router.post("/login", response_model=SessionResponse)
def create_session(
    body: LoginRequest,
    request: Request,
    auth_service: AuthService = Depends(get_auth_service),
    audit_service: AuditService = Depends(get_audit_service),
):
    """Exchanges email and password for a signed short-lived JWT session token."""
    client_ip = request.client.host if request.client else "unknown"
    try:
        user = auth_service.authenticate_user(body.email, body.password, client_ip=client_ip)
    except ValueError as e:
        if "RATE_LIMITED" in str(e):
            raise HTTPException(
                status_code=status.HTTP_429_TOO_MANY_REQUESTS,
                detail={"code": "RATE_LIMITED", "message": "Too many failed attempts. Try again later."},
            )
        raise

    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail={"code": "UNAUTHENTICATED", "message": "Invalid email or password."},
        )

    token, expires_in = auth_service.create_access_token(user)

    audit_service.log_event(
        actor_id=user.id,
        action="USER_LOGIN",
        entity_type="USER",
        entity_id=user.id,
        details={"email": user.email, "role": user.role},
    )

    return SessionResponse(
        access_token=token,
        token_type="Bearer",
        expires_in_seconds=expires_in,
        user=user,
    )

@router.get("/me", response_model=User, tags=["Authentication"])
def get_me(current_user: User = Depends(get_current_user)):
    """Returns the authenticated user profile and roles."""
    return current_user

@router.get("/users", response_model=ListEnvelope[User])
def list_users(
    role: Optional[UserRole] = Query(None),
    offset: int = Query(0, ge=0),
    limit: int = Query(50, ge=1, le=100),
    current_user: User = Depends(require_roles(UserRole.ADMIN)),
    container: AppContainer = Depends(get_container),
):
    """Lists registered users for platform administration. Admin only."""
    def filter_fn(item: User) -> bool:
        if role and item.role != role:
            return False
        return True

    items, total = container.user_repo.list(filter_fn=filter_fn, offset=offset, limit=limit)
    return ListEnvelope[User](items=items, total=total, limit=limit, offset=offset)
