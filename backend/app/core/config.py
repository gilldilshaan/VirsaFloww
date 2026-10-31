import os
import sys
from typing import List, Optional
from urllib.parse import urlparse

DEV_CORS_ORIGIN_REGEX = r"^http://(localhost|127\.0\.0\.1)(:\d+)?$"

_BACKEND_DIR = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", ".."))
_DEFAULT_ENV_PATH = os.path.join(_BACKEND_DIR, ".env")

def _load_dotenv(env_path: str) -> None:
    if os.path.exists(env_path):
        with open(env_path, "r", encoding="utf-8") as f:
            for line in f:
                line = line.strip()
                if not line or line.startswith("#") or "=" not in line:
                    continue
                k, v = line.split("=", 1)
                k = k.strip()
                v = v.strip()
                if (v.startswith('"') and v.endswith('"')) or (v.startswith("'") and v.endswith("'")):
                    v = v[1:-1]
                else:
                    if " #" in v:
                        v = v.split(" #", 1)[0].strip()
                if k and k not in os.environ:
                    os.environ[k] = v

# Auto-load backend/.env if present
_load_dotenv(_DEFAULT_ENV_PATH)

class Settings:
    APP_NAME: str = os.getenv("APP_NAME", "TerraLedger AI Backend")
    APP_VERSION: str = "1.0.0"
    APP_ENV: str = os.getenv("APP_ENV", "development").lower()
    APP_MODE: str = os.getenv("APP_MODE", "demo").lower()
    HOST: str = os.getenv("HOST", "0.0.0.0")
    PORT: int = int(os.getenv("PORT", "8000"))

    # Storage Backend: 'json' or 'postgres' (default: 'json')
    STORAGE_BACKEND: str = os.getenv("STORAGE_BACKEND", "json").strip().lower()
    if STORAGE_BACKEND not in ("json", "postgres"):
        raise ValueError(
            f"Invalid STORAGE_BACKEND '{STORAGE_BACKEND}'. Must be either 'json' or 'postgres'."
        )

    # Database URLs
    _raw_database_url: Optional[str] = os.getenv("DATABASE_URL")
    _raw_test_database_url: Optional[str] = os.getenv("TEST_DATABASE_URL")

    # CORS
    DEV_CORS_ORIGIN_REGEX: str = DEV_CORS_ORIGIN_REGEX
    raw_cors: str = os.getenv(
        "CORS_ORIGINS",
        "http://localhost:5173,http://localhost:3000,http://127.0.0.1:5173,http://127.0.0.1:3000"
    )
    CORS_ORIGINS: List[str] = [origin.strip() for origin in raw_cors.split(",") if origin.strip()]

    @property
    def CORS_ORIGIN_REGEX(self) -> Optional[str]:
        """In development, allows any port on localhost / 127.0.0.1 via regex.
        In production, returns None to strictly enforce explicit CORS_ORIGINS list."""
        if self.APP_ENV == "development":
            return self.DEV_CORS_ORIGIN_REGEX
        return None

    @classmethod
    def is_origin_allowed(cls, origin: Optional[str]) -> bool:
        if not origin:
            return False
        if origin in cls.CORS_ORIGINS:
            return True
        if cls.APP_ENV == "development":
            import re
            if re.match(cls.DEV_CORS_ORIGIN_REGEX, origin):
                return True
        return False

    # Auth
    JWT_SECRET: str = os.getenv("JWT_SECRET", "demo-insecure-secret-key-change-in-production")
    JWT_ALGORITHM: str = os.getenv("JWT_ALGORITHM", "HS256")
    JWT_EXPIRATION_MINUTES: int = int(os.getenv("JWT_EXPIRATION_MINUTES", "60"))
    PASSWORD_SALT: str = os.getenv("PASSWORD_SALT", os.getenv("DEMO_PASSWORD_SALT", "terraledger-demo-salt-2026"))
    DEMO_USER_PASSWORD: str = os.getenv("DEMO_USER_PASSWORD", "")

    # Storage Paths
    BASE_DIR: str = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", ".."))
    DATA_DIR: str = os.getenv("DATA_DIR", os.path.join(BASE_DIR, "data"))
    RUNTIME_DIR: str = os.getenv("RUNTIME_DIR", os.path.join(DATA_DIR, "runtime"))
    UPLOAD_DIR: str = os.getenv("UPLOAD_DIR", os.path.join(DATA_DIR, "uploads"))
    AUDIT_LOG_PATH: str = os.getenv("AUDIT_LOG_PATH", os.path.join(DATA_DIR, "audit", "audit.jsonl"))
    SEED_DIR: str = os.getenv("SEED_DIR", os.path.join(DATA_DIR, "seed"))
    SEED_FILES_DIR: str = os.getenv("SEED_FILES_DIR", os.path.join(DATA_DIR, "seed_files"))

    REPO_ROOT: str = os.path.abspath(os.path.join(BASE_DIR, ".."))
    ROOT_SEED_EVIDENCE_PATH: str = os.getenv(
        "ROOT_SEED_EVIDENCE_PATH", os.path.join(REPO_ROOT, "data", "seed_evidence.json")
    )
    ROOT_SEED_MARKETPLACE_PATH: str = os.getenv(
        "ROOT_SEED_MARKETPLACE_PATH", os.path.join(REPO_ROOT, "data", "marketplace_seed.json")
    )
    LEAD_OBSERVATIONS_PATH: str = os.getenv(
        "LEAD_OBSERVATIONS_PATH", os.path.join(REPO_ROOT, "data", "observations.json")
    )

    MAX_UPLOAD_SIZE_BYTES: int = int(os.getenv("MAX_UPLOAD_SIZE_BYTES", str(15 * 1024 * 1024)))

    @classmethod
    def normalize_url(cls, raw_url: Optional[str]) -> Optional[str]:
        """Normalizes pooler hostnames if placeholder region format is present."""
        if not raw_url:
            return None
        # Handle known placeholder region for test Supabase project
        if "aws-0-REGION.pooler.supabase.com" in raw_url and "vlsvyqmtuqgtfkeodbay" in raw_url:
            return raw_url.replace("aws-0-REGION.pooler.supabase.com", "aws-1-eu-west-3.pooler.supabase.com")
        return raw_url

    @property
    def DATABASE_URL(self) -> Optional[str]:
        return self.normalize_url(self._raw_database_url)

    @property
    def TEST_DATABASE_URL(self) -> Optional[str]:
        return self.normalize_url(self._raw_test_database_url)

    @classmethod
    def extract_project_ref(cls, url: Optional[str]) -> Optional[str]:
        """Extracts Supabase project reference from username or host."""
        if not url:
            return None
        try:
            from sqlalchemy.engine import make_url
            u = make_url(url)
            username = u.username or ""
            if "." in username:
                return username.split(".", 1)[1]
            host = u.host or ""
            if host.endswith(".supabase.co"):
                return host.split(".", 1)[0]
        except Exception:
            try:
                parsed = urlparse(url)
                username = parsed.username or ""
                if "." in username:
                    return username.split(".", 1)[1]
                host = parsed.hostname or ""
                if host.endswith(".supabase.co"):
                    return host.split(".", 1)[0]
            except Exception:
                pass
        return None

    @classmethod
    def validate_database_url(cls, url: Optional[str], label: str = "DATABASE_URL") -> None:
        """Validates database URL using SQLAlchemy URL parser and enforces safety rules."""
        if not url:
            raise ValueError(f"{label} is not configured.")

        from sqlalchemy.engine import make_url
        try:
            u = make_url(url)
        except Exception as exc:
            raise ValueError(f"Failed to parse {label}: {exc}") from exc

        # Disallow transaction pooler port 6543
        if u.port == 6543:
            raise ValueError(
                f"{label} is configured to use port 6543 (transaction pooler). "
                "The application requires the Session Pooler on port 5432 to support "
                "prepared statements and transactional locks."
            )

        ref = cls.extract_project_ref(url)
        if not ref:
            raise ValueError(f"{label} does not contain a recognizable Supabase project reference.")

    @classmethod
    def validate_isolation(cls) -> None:
        """Validates that production and test database references are strictly isolated."""
        prod_ref = cls.extract_project_ref(cls.normalize_url(cls._raw_database_url))
        test_ref = cls.extract_project_ref(cls.normalize_url(cls._raw_test_database_url))

        if prod_ref and test_ref and prod_ref == test_ref:
            raise RuntimeError(
                f"SAFETY VIOLATION: DATABASE_URL and TEST_DATABASE_URL point to the same "
                f"project reference ({prod_ref}). Test database must be completely isolated."
            )

    @classmethod
    def validate_production_safety(cls) -> None:
        if cls.APP_ENV == "production":
            if "demo" in cls.JWT_SECRET.lower() or "insecure" in cls.JWT_SECRET.lower() or len(cls.JWT_SECRET) < 32:
                raise RuntimeError("Refusing to start in production with insecure or default JWT_SECRET!")
            if cls.APP_MODE == "demo":
                raise RuntimeError("Refusing to start in production with APP_MODE=demo!")
            if not cls.CORS_ORIGINS:
                raise RuntimeError("Refusing to start in production: CORS_ORIGINS must not be empty!")
            if "*" in cls.CORS_ORIGINS:
                raise RuntimeError(
                    "Refusing to start in production: CORS_ORIGINS must not contain '*' when credentials are enabled!"
                )

settings = Settings()
