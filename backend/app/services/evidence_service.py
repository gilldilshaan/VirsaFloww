import os
import uuid
import csv
import io
from typing import Optional, Tuple
from fastapi import UploadFile, HTTPException, status

from backend.app.core.config import settings
from backend.app.schemas.evidence import (
    Evidence,
    EvidenceType,
    EvidenceCategory,
    EvidenceStatus,
    FileDetails,
    Provenance,
    GpsCoordinates,
)
from backend.app.schemas.user import User, UserRole
from backend.app.storage.evidence_storage import EvidenceRepository
from backend.app.services.audit_service import AuditService
from backend.app.utils.crypto import sha256_bytes

# Magic bytes definitions
JPEG_MAGIC = b"\xff\xd8\xff"
PNG_MAGIC = b"\x89PNG\r\n\x1a\n"
PDF_MAGIC = b"%PDF"

ALLOWED_EXTENSIONS = {
    "image/jpeg": [".jpg", ".jpeg"],
    "image/png": [".png"],
    "application/pdf": [".pdf"],
    "text/csv": [".csv"],
}

class EvidenceService:
    def __init__(
        self,
        evidence_repo: EvidenceRepository,
        audit_service: AuditService,
        upload_dir: Optional[str] = None,
    ):
        self.evidence_repo = evidence_repo
        self.audit_service = audit_service
        self.upload_dir = upload_dir or settings.UPLOAD_DIR
        os.makedirs(self.upload_dir, exist_ok=True)

    def validate_file_bytes(self, raw_bytes: bytes, original_filename: str) -> Tuple[str, str]:
        """Validates file bytes for size, magic bytes signature, and MIME type.

        Returns (detected_mime, safe_extension).
        """
        size_bytes = len(raw_bytes)
        if size_bytes == 0:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail={"code": "EMPTY_FILE", "message": "Uploaded file is 0 bytes."},
            )

        if size_bytes > settings.MAX_UPLOAD_SIZE_BYTES:
            raise HTTPException(
                status_code=status.HTTP_413_REQUEST_ENTITY_TOO_LARGE,
                detail={
                    "code": "FILE_TOO_LARGE",
                    "message": f"File exceeds maximum allowed size of {settings.MAX_UPLOAD_SIZE_BYTES} bytes.",
                },
            )

        # Magic byte detection
        detected_mime = None
        safe_ext = ".bin"

        if raw_bytes.startswith(JPEG_MAGIC):
            detected_mime = "image/jpeg"
            safe_ext = ".jpg"
        elif raw_bytes.startswith(PNG_MAGIC):
            detected_mime = "image/png"
            safe_ext = ".png"
        elif raw_bytes.startswith(PDF_MAGIC):
            detected_mime = "application/pdf"
            safe_ext = ".pdf"
        else:
            # Check if valid CSV / text
            try:
                text_content = raw_bytes.decode("utf-8")
                # Ensure it's parseable as CSV
                sample = text_content[:2048]
                sniffer = csv.Sniffer()
                sniffer.sniff(sample)
                detected_mime = "text/csv"
                safe_ext = ".csv"
            except Exception:
                pass

        if not detected_mime:
            raise HTTPException(
                status_code=status.HTTP_415_UNSUPPORTED_MEDIA_TYPE,
                detail={
                    "code": "UNSUPPORTED_MEDIA_TYPE",
                    "message": "Unsupported file format. Only JPEG, PNG, PDF, and CSV are permitted.",
                },
            )

        return detected_mime, safe_ext

    def save_file_safely(self, raw_bytes: bytes, safe_ext: str) -> Tuple[str, str]:
        """Generates a collision-resistant UUID filename and saves binary bytes safely to disk.

        Prevents path traversal vulnerabilities.
        """
        secure_name = f"{uuid.uuid4()}{safe_ext}"
        storage_path = os.path.join(self.upload_dir, secure_name)

        with open(storage_path, "wb") as f:
            f.write(raw_bytes)
            f.flush()
            os.fsync(f.fileno())

        return storage_path, secure_name

    def check_field_access(self, user: User, field_id: str) -> None:
        """Enforces field authorization based on user role and assignment."""
        if user.role in (UserRole.ADMIN, UserRole.REVIEWER, UserRole.PROJECT_DEVELOPER):
            return

        if user.role == UserRole.FARMER:
            if field_id not in user.assigned_field_ids:
                raise HTTPException(
                    status_code=status.HTTP_404_NOT_FOUND,
                    detail={"code": "NOT_FOUND", "message": "Field not found or access denied."},
                )

        elif user.role == UserRole.FIELD_OFFICER:
            if user.assigned_field_ids and field_id not in user.assigned_field_ids:
                raise HTTPException(
                    status_code=status.HTTP_404_NOT_FOUND,
                    detail={"code": "NOT_FOUND", "message": "Field not found or access denied."},
                )

        elif user.role == UserRole.BUYER:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail={"code": "NOT_FOUND", "message": "Resource not found."},
            )
