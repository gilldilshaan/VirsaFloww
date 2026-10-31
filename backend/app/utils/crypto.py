import hashlib
import json
import secrets
from typing import Any, Dict
from backend.app.core.config import settings

def sha256_bytes(raw: bytes) -> str:
    """Computes standard SHA-256 hex digest of raw binary bytes."""
    return hashlib.sha256(raw).hexdigest()

def sha256_canonical_json(data: Dict[str, Any]) -> str:
    """Computes SHA-256 of canonical JSON (sorted keys, compact separators, UTF-8)."""
    canonical_bytes = json.dumps(
        data,
        sort_keys=True,
        separators=(",", ":"),
        ensure_ascii=False,
    ).encode("utf-8")
    return hashlib.sha256(canonical_bytes).hexdigest()

def hash_password(password: str, salt: str = None) -> str:
    """Hashes password using stdlib hashlib.scrypt with salt."""
    if salt is None:
        salt = settings.PASSWORD_SALT
    derived = hashlib.scrypt(
        password.encode("utf-8"),
        salt=salt.encode("utf-8"),
        n=16384,
        r=8,
        p=1,
        maxmem=64 * 1024 * 1024,
    )
    return derived.hex()

def verify_password(plain_password: str, hashed_hex: str, salt: str = None) -> bool:
    """Verifies password using scrypt and constant-time comparison."""
    computed_hex = hash_password(plain_password, salt=salt)
    return secrets.compare_digest(computed_hex, hashed_hex)
