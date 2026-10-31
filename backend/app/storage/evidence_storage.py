import os
import tempfile
import json
import threading
from datetime import datetime, timezone
from typing import Callable, Dict, List, Optional
from backend.app.schemas.evidence import Evidence, EvidenceStatus, EvidenceStatusHistory
from backend.app.utils.crypto import sha256_bytes

class EvidenceRepository:
    """Immutable evidence repository.

    CRITICAL INVARIANT:
    Exposes NO update() and NO delete() methods.
    Evidence items are immutable by construction.
    Supersession is achieved by adding a new evidence record and recording an append-only
    status history event.
    """

    def __init__(self, runtime_path: str, seed_path: Optional[str] = None):
        self.runtime_path = os.path.abspath(runtime_path)
        self.seed_path = os.path.abspath(seed_path) if seed_path else None
        self._lock = threading.Lock()
        self._data: Dict[str, Evidence] = {}
        self._initialize()

    def _initialize(self) -> None:
        with self._lock:
            os.makedirs(os.path.dirname(self.runtime_path), exist_ok=True)
            if os.path.exists(self.runtime_path):
                self._load_from_path(self.runtime_path)
            elif self.seed_path and os.path.exists(self.seed_path):
                self._load_from_path(self.seed_path)
                self._persist_unlocked()
            else:
                self._data = {}
                self._persist_unlocked()

    def _load_from_path(self, path: str) -> None:
        try:
            with open(path, "r", encoding="utf-8") as f:
                content = f.read().strip()
                if not content:
                    self._data = {}
                    return
                raw_list = json.loads(content)
                self._data = {}
                seed_files_dir = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "..", "data", "seed_files"))
                for item in raw_list:
                    parsed = Evidence.model_validate(item)
                    # Compute sha256 dynamically from actual file bytes if present in seed_files
                    if parsed.file_details and os.path.exists(seed_files_dir):
                        disk_candidate = os.path.join(seed_files_dir, parsed.file_details.name)
                        if os.path.exists(disk_candidate):
                            with open(disk_candidate, "rb") as bf:
                                computed = sha256_bytes(bf.read())
                            updated_prov = parsed.provenance.model_copy(update={"sha256": computed})
                            parsed = parsed.model_copy(update={"provenance": updated_prov})
                    self._data[parsed.id] = parsed
        except Exception as e:
            raise RuntimeError(f"Failed to load evidence records from {path}: {e}")

    def _persist_unlocked(self) -> None:
        dir_name = os.path.dirname(self.runtime_path)
        os.makedirs(dir_name, exist_ok=True)
        serialized = [item.model_dump(by_alias=True, mode="json") for item in self._data.values()]
        with tempfile.NamedTemporaryFile("w", dir=dir_name, delete=False, encoding="utf-8") as tmp:
            tmp_name = tmp.name
            json.dump(serialized, tmp, indent=2, ensure_ascii=False)
            tmp.flush()
            os.fsync(tmp.fileno())
        os.replace(tmp_name, self.runtime_path)

    def reset_to_seed(self) -> None:
        with self._lock:
            if self.seed_path and os.path.exists(self.seed_path):
                self._load_from_path(self.seed_path)
                self._persist_unlocked()
            else:
                self._data = {}
                self._persist_unlocked()

    def get(self, evidence_id: str) -> Optional[Evidence]:
        with self._lock:
            return self._data.get(evidence_id)

    def list(
        self,
        filter_fn: Optional[Callable[[Evidence], bool]] = None,
        offset: int = 0,
        limit: int = 50,
    ) -> tuple[List[Evidence], int]:
        with self._lock:
            all_items = list(self._data.values())
            if filter_fn:
                filtered = [item for item in all_items if filter_fn(item)]
            else:
                filtered = all_items
            total = len(filtered)
            paginated = filtered[offset : offset + limit]
            return paginated, total

    def create(self, entity: Evidence) -> Evidence:
        with self._lock:
            if entity.id in self._data:
                raise ValueError(f"Evidence record with id='{entity.id}' already exists.")
            self._data[entity.id] = entity
            self._persist_unlocked()
            return entity

    insert = create

    def find_all(self, predicate: Optional[Callable[[Evidence], bool]] = None) -> List[Evidence]:
        with self._lock:
            if predicate is None:
                return list(self._data.values())
            return [item for item in self._data.values() if predicate(item)]

    def record_status_transition(
        self,
        evidence_id: str,
        new_status: EvidenceStatus,
        actor_id: str,
        reason: Optional[str] = None,
    ) -> Evidence:
        """Appends a status transition event.

        This is the ONLY allowed status modification, maintaining an immutable audit history.
        """
        with self._lock:
            if evidence_id not in self._data:
                raise KeyError(f"Evidence with id='{evidence_id}' not found.")
            current = self._data[evidence_id]
            now_iso = datetime.now(timezone.utc).strftime("%Y-%m-%dT%H:%M:%SZ")
            event = EvidenceStatusHistory(
                timestamp=now_iso,
                previous_status=current.status,
                new_status=new_status,
                actor_id=actor_id,
                reason=reason,
            )
            # Create a new updated model instance preserving history
            updated = current.model_copy(
                update={
                    "status": new_status,
                    "status_history": [*current.status_history, event],
                }
            )
            self._data[evidence_id] = updated
            self._persist_unlocked()
            return updated

    def apply_auditor_waiver(
        self,
        evidence_id: str,
        waiver_reason: str,
        waiver_regulatory_rationale: str,
        actor_id: str,
        target_status: EvidenceStatus = EvidenceStatus.HASH_RECORDED,
    ) -> Evidence:
        """Records an authoritative lead auditor waiver on evidence while maintaining immutable audit history."""
        with self._lock:
            if evidence_id not in self._data:
                raise KeyError(f"Evidence with id='{evidence_id}' not found.")
            current = self._data[evidence_id]
            now_iso = datetime.now(timezone.utc).strftime("%Y-%m-%dT%H:%M:%SZ")
            event = EvidenceStatusHistory(
                timestamp=now_iso,
                previous_status=current.status,
                new_status=target_status,
                actor_id=actor_id,
                reason=f"Lead Auditor Waiver Granted: {waiver_reason}",
            )
            updated_prov = current.provenance.model_copy(
                update={
                    "review_status": f"Accepted with Formal Lead Auditor Waiver: {waiver_reason}",
                    "waiver_issued": True,
                    "waiver_reason": waiver_reason,
                    "waiver_regulatory_rationale": waiver_regulatory_rationale,
                    "waiver_authorized_by": actor_id,
                    "waiver_timestamp": now_iso,
                }
            )
            updated = current.model_copy(
                update={
                    "status": target_status,
                    "provenance": updated_prov,
                    "status_history": [*current.status_history, event],
                }
            )
            self._data[evidence_id] = updated
            self._persist_unlocked()
            return updated
