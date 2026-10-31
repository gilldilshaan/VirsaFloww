import os
import sys
from typing import List

class Settings:
    APP_NAME: str = os.getenv("APP_NAME", "TerraLedger AI Backend")
    APP_VERSION: str = "1.0.0"
    APP_ENV: str = os.getenv("APP_ENV", "development").lower()
    APP_MODE: str = os.getenv("APP_MODE", "demo").lower()
    HOST: str = os.getenv("HOST", "0.0.0.0")
    PORT: int = int(os.getenv("PORT", "8000"))

    # CORS
    raw_cors: str = os.getenv("CORS_ORIGINS", "http://localhost:5173,http://localhost:3000,http://127.0.0.1:5173,http://127.0.0.1:3000")
    CORS_ORIGINS: List[str] = [origin.strip() for origin in raw_cors.split(",") if origin.strip()]

    # Auth
    JWT_SECRET: str = os.getenv("JWT_SECRET", "demo-insecure-secret-key-change-in-production")
    JWT_ALGORITHM: str = os.getenv("JWT_ALGORITHM", "HS256")
    JWT_EXPIRATION_MINUTES: int = int(os.getenv("JWT_EXPIRATION_MINUTES", "60"))
    PASSWORD_SALT: str = os.getenv("PASSWORD_SALT", "terraledger-demo-salt-2026")
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
    def validate_production_safety(cls) -> None:
        if cls.APP_ENV == "production":
            if "demo" in cls.JWT_SECRET.lower() or "insecure" in cls.JWT_SECRET.lower() or len(cls.JWT_SECRET) < 32:
                raise RuntimeError("Refusing to start in production with insecure or default JWT_SECRET!")
            if cls.APP_MODE == "demo":
                raise RuntimeError("Refusing to start in production with APP_MODE=demo!")

settings = Settings()
