from fastapi import APIRouter, Depends, HTTPException, Request, status
from backend.app.schemas.user import LoginRequest, SessionResponse, User
from backend.app.services.auth_service import AuthService
from backend.app.services.audit_service import AuditService
from backend.app.api.deps import get_auth_service, get_audit_service, get_current_user

router = APIRouter(prefix="/auth", tags=["Authentication"])

@router.post("/session", response_model=SessionResponse)
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
