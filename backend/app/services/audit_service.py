import json
import os
import threading
import uuid
from datetime import datetime, timezone
from typing import Any, Dict, List, Optional, Tuple
from backend.app.schemas.audit import AuditEvent
from backend.app.utils.crypto import sha256_canonical_json

GENESIS_PREVIOUS_HASH = "0" * 64

class AuditService:
    """Cryptographic, append-only, hash-chained audit service."""

    def __init__(self, log_path: str):
        self.log_path = os.path.abspath(log_path)
        self._lock = threading.Lock()
        os.makedirs(os.path.dirname(self.log_path), exist_ok=True)
        # Touch file if it does not exist
        if not os.path.exists(self.log_path):
            with open(self.log_path, "a", encoding="utf-8"):
                pass

    def _get_last_event_hash_unlocked(self) -> str:
        """Reads the last line of the audit log to get the previous event_hash."""
        if not os.path.exists(self.log_path) or os.path.getsize(self.log_path) == 0:
            return GENESIS_PREVIOUS_HASH

        last_line = ""
        with open(self.log_path, "r", encoding="utf-8") as f:
            for line in f:
                stripped = line.strip()
                if stripped:
                    last_line = stripped

        if not last_line:
            return GENESIS_PREVIOUS_HASH

        try:
            data = json.loads(last_line)
            return data.get("eventHash", data.get("event_hash", GENESIS_PREVIOUS_HASH))
        except Exception:
            return GENESIS_PREVIOUS_HASH

    def log_event(
        self,
        actor_id: str,
        action: str,
        entity_type: str,
        entity_id: str,
        details: Optional[Dict[str, Any]] = None,
    ) -> AuditEvent:
        """Appends an event to the audit log with strict cryptographic hash chaining."""
        with self._lock:
            prev_hash = self._get_last_event_hash_unlocked()
            event_id = f"EVT-{uuid.uuid4()}"
            now_iso = datetime.now(timezone.utc).strftime("%Y-%m-%dT%H:%M:%SZ")

            payload_to_hash = {
                "action": action,
                "actor_id": actor_id,
                "details": details or {},
                "entity_id": entity_id,
                "entity_type": entity_type,
                "event_id": event_id,
                "previous_hash": prev_hash,
                "timestamp": now_iso,
            }
            computed_hash = sha256_canonical_json(payload_to_hash)

            event = AuditEvent(
                event_id=event_id,
                actor_id=actor_id,
                action=action,
                entity_type=entity_type,
                entity_id=entity_id,
                timestamp=now_iso,
                details=details,
                previous_hash=prev_hash,
                event_hash=computed_hash,
            )

            serialized_line = json.dumps(event.model_dump(by_alias=True, mode="json"), ensure_ascii=False)

            with open(self.log_path, "a", encoding="utf-8") as f:
                f.write(serialized_line + "\n")
                f.flush()
                os.fsync(f.fileno())

            return event

    append_event = log_event

    def list_events(
        self,
        entity_type: Optional[str] = None,
        entity_id: Optional[str] = None,
        actor_id: Optional[str] = None,
        offset: int = 0,
        limit: int = 50,
    ) -> Tuple[List[AuditEvent], int]:
        """Lists events from the audit log with pagination and filtering."""
        with self._lock:
            if not os.path.exists(self.log_path):
                return [], 0

            events: List[AuditEvent] = []
            with open(self.log_path, "r", encoding="utf-8") as f:
                for line in f:
                    stripped = line.strip()
                    if not stripped:
                        continue
                    try:
                        record = json.loads(stripped)
                        event = AuditEvent.model_validate(record)
                        if entity_type and event.entity_type != entity_type:
                            continue
                        if entity_id and event.entity_id != entity_id:
                            continue
                        if actor_id and event.actor_id != actor_id:
                            continue
                        events.append(event)
                    except Exception:
                        continue

            total = len(events)
            paginated = events[offset : offset + limit]
            return paginated, total

    def verify_chain(self) -> Tuple[bool, Optional[str]]:
        """Verifies the integrity of the entire audit chain.

        Returns (True, None) if valid, or (False, error_description) if tampered.
        """
        with self._lock:
            if not os.path.exists(self.log_path) or os.path.getsize(self.log_path) == 0:
                return True, None

            expected_prev_hash = GENESIS_PREVIOUS_HASH
            line_num = 0

            with open(self.log_path, "r", encoding="utf-8") as f:
                for line in f:
                    line_num += 1
                    stripped = line.strip()
                    if not stripped:
                        continue
                    try:
                        record = json.loads(stripped)
                        event = AuditEvent.model_validate(record)
                    except Exception as e:
                        return False, f"Line {line_num}: JSON parsing/validation error: {e}"

                    # 1. Check previous hash continuity
                    if event.previous_hash != expected_prev_hash:
                        return False, (
                            f"Line {line_num}: Broken hash link. "
                            f"Expected previous_hash={expected_prev_hash}, got {event.previous_hash}"
                        )

                    # 2. Check event hash integrity
                    payload_to_hash = {
                        "action": event.action,
                        "actor_id": event.actor_id,
                        "details": event.details or {},
                        "entity_id": event.entity_id,
                        "entity_type": event.entity_type,
                        "event_id": event.event_id,
                        "previous_hash": event.previous_hash,
                        "timestamp": event.timestamp,
                    }
                    recalculated = sha256_canonical_json(payload_to_hash)
                    if recalculated != event.event_hash:
                        return False, (
                            f"Line {line_num}: Tampered payload. "
                            f"Computed {recalculated}, stored {event.event_hash}"
                        )

                    expected_prev_hash = event.event_hash

            return True, None
