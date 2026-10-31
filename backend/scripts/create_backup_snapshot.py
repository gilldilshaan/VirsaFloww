"""Creates an immutable pre-production backup snapshot of JSON data and SHA-256 manifest."""

import hashlib
import json
import os
import shutil
from datetime import datetime, timezone

from backend.app.core.config import settings


def sha256_file(path: str) -> str:
    h = hashlib.sha256()
    with open(path, "rb") as f:
        while chunk := f.read(65536):
            h.update(chunk)
    return h.hexdigest()


def create_snapshot() -> str:
    timestamp = datetime.now(timezone.utc).strftime("%Y%m%d_%H%M%S")
    backup_root = os.path.join(settings.REPO_ROOT, "backend", "data", "backups", timestamp)
    os.makedirs(backup_root, exist_ok=True)

    manifest = {
        "timestamp": timestamp,
        "backup_dir": backup_root,
        "files": {},
    }

    # Sources to back up
    sources = [
        ("runtime", settings.RUNTIME_DIR),
        ("seed", settings.SEED_DIR),
        ("audit", os.path.dirname(settings.AUDIT_LOG_PATH)),
    ]

    for label, src_dir in sources:
        if os.path.exists(src_dir):
            dest_dir = os.path.join(backup_root, label)
            os.makedirs(dest_dir, exist_ok=True)
            for fname in os.listdir(src_dir):
                src_path = os.path.join(src_dir, fname)
                if os.path.isfile(src_path):
                    dest_path = os.path.join(dest_dir, fname)
                    shutil.copy2(src_path, dest_path)
                    rel_name = f"{label}/{fname}"
                    manifest["files"][rel_name] = {
                        "sha256": sha256_file(dest_path),
                        "size_bytes": os.path.getsize(dest_path),
                    }

    manifest_path = os.path.join(backup_root, "manifest.json")
    with open(manifest_path, "w", encoding="utf-8") as f:
        json.dump(manifest, f, indent=2, sort_keys=True)

    print(f"[SNAPSHOT CREATED] {backup_root}")
    print(f"[FILES BACKED UP] {len(manifest['files'])}")
    print(f"[MANIFEST] {manifest_path}")
    return backup_root


if __name__ == "__main__":
    create_snapshot()
