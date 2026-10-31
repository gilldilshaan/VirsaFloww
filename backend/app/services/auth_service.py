import time
import threading
from datetime import datetime, timezone, timedelta
from typing import Dict, Optional, Tuple
import jwt
from backend.app.core.config import settings
from backend.app.schemas.user import UserInDB, User, UserRole
from backend.app.storage.json_storage import JsonFileRepository
from backend.app.utils.crypto import verify_password

# Login rate limiting: 5 attempts per 60 seconds per key (email or IP)
RATE_LIMIT_MAX_ATTEMPTS = 5
RATE_LIMIT_WINDOW_SECONDS = 60

class AuthService:
    """Sprint-grade server-side JWT authentication and role resolution service.

    NOTE: THIS AUTHENTICATION SYSTEM IS A SPRINT-GRADE DEMO IMPLEMENTATION.
    IT IS NOT PRODUCTION-READY.
    """

    def __init__(self, user_repo: JsonFileRepository[UserInDB]):
        self.user_repo = user_repo
        self._login_attempts: Dict[str, list[float]] = {}
        self._lock = threading.Lock()

    def _check_rate_limit(self, key: str) -> bool:
        now = time.time()
        with self._lock:
            attempts = self._login_attempts.get(key, [])
            # Filter attempts within the window
            recent = [t for t in attempts if now - t < RATE_LIMIT_WINDOW_SECONDS]
            if len(recent) >= RATE_LIMIT_MAX_ATTEMPTS:
                return False
            recent.append(now)
            self._login_attempts[key] = recent
            return True

    def authenticate_user(self, email: str, password: str, client_ip: str = "unknown") -> Optional[User]:
        throttle_key = f"{email}:{client_ip}"
        if not self._check_rate_limit(throttle_key):
            raise ValueError("RATE_LIMITED: Too many login attempts. Please wait 60 seconds.")

        # Lookup user in repository
        users, _ = self.user_repo.list(filter_fn=lambda u: u.email.lower() == email.lower(), limit=1)
        if not users:
            return None

        user_in_db = users[0]
        if not user_in_db.is_active:
            return None

        if not verify_password(password, user_in_db.password_hash):
            return None

        return User.model_validate(user_in_db.model_dump())

    def create_access_token(self, user: User) -> Tuple[str, int]:
        """Creates a signed short-lived JWT.

        NOTE: The role is NOT trusted from client token claims; on every request,
        the role is refreshed and validated against the user store.
        """
        now = datetime.now(timezone.utc)
        expires_delta = timedelta(minutes=settings.JWT_EXPIRATION_MINUTES)
        expire = now + expires_delta

        payload = {
            "sub": user.id,
            "email": user.email,
            "iat": int(now.timestamp()),
            "exp": int(expire.timestamp()),
            "iss": "TerraLedger-AI-Backend",
        }

        token = jwt.encode(payload, settings.JWT_SECRET, algorithm=settings.JWT_ALGORITHM)
        expires_in_seconds = int(expires_delta.total_seconds())
        return token, expires_in_seconds

    def decode_and_resolve_user(self, token: str) -> Optional[User]:
        """Validates JWT and resolves the user and role directly from the user store.

        Client claims cannot alter user roles.
        """
        try:
            payload = jwt.decode(
                token,
                settings.JWT_SECRET,
                algorithms=[settings.JWT_ALGORITHM],
                issuer="TerraLedger-AI-Backend",
            )
            user_id = payload.get("sub")
            if not user_id:
                return None

            user_in_db = self.user_repo.get(str(user_id))
            if not user_in_db or not user_in_db.is_active:
                return None

            return User.model_validate(user_in_db.model_dump())
        except (jwt.PyJWTError, Exception):
            return None
