"""PostgreSQL Audit Service with strict cryptographic hash chaining.

CRITICAL INVARIANTS:
1. Append-only cryptographic hash chaining using SHA-256 canonical JSON.
2. Row-level lock on audit_chain_head (SELECT ... FOR UPDATE) guarantees that
   concurrent append operations are strictly serialised with zero chain forks.
3. Database engine triggers prevent UPDATE and DELETE on audit_events at the SQL level.
4. Parity with file-based AuditService public interface:
   - log_event / append_event
   - list_events
   - verify_chain
"""

import logging
import uuid
from datetime import datetime, timezone
from typing import Any, Dict, List, Optional, Tuple
from sqlalchemy import desc, select, text
from backend.app.db.models import AuditChainHeadDB, AuditEventDB
from backend.app.db.session import db_session, get_engine
from backend.app.schemas.audit import AuditEvent
from backend.app.utils.crypto import sha256_canonical_json

logger = logging.getLogger("terraledger-postgres-audit")

GENESIS_PREVIOUS_HASH = "0" * 64

class PostgresAuditService:
    """Cryptographic, append-only, PostgreSQL-backed audit service."""

    def __init__(self, engine: Optional[Any] = None):
        self.engine = engine or get_engine()

    def log_event(
        self,
        actor_id: str,
        action: str,
        entity_type: str,
        entity_id: str,
        details: Optional[Dict[str, Any]] = None,
    ) -> AuditEvent:
        """Appends an event to the audit log with strict serialisation and SHA-256 hash chaining."""
        with db_session(self.engine) as session:
            # 1. Serialise concurrent writes using row-level lock on chain head
            stmt_head = (
                select(AuditChainHeadDB)
                .where(AuditChainHeadDB.id == 1)
                .with_for_update()
            )
            head = session.execute(stmt_head).scalars().first()
            if not head:
                # Initialize chain head if missing
                head = AuditChainHeadDB(
                    id=1,
                    last_sequence_num=0,
                    last_event_hash=GENESIS_PREVIOUS_HASH,
                )
                session.add(head)
                session.flush()

            prev_hash = head.last_event_hash or GENESIS_PREVIOUS_HASH
            event_id = f"EVT-{uuid.uuid4()}"
            now_iso = datetime.now(timezone.utc).strftime("%Y-%m-%dT%H:%M:%SZ")

            # 2. Canonical SHA-256 hash calculation
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

            # 3. Insert into audit_events table
            db_event = AuditEventDB(
                event_id=event_id,
                actor_id=actor_id,
                action=action,
                entity_type=entity_type,
                entity_id=entity_id,
                timestamp=now_iso,
                previous_hash=prev_hash,
                event_hash=computed_hash,
                details=details or {},
                payload=event.model_dump(by_alias=True, mode="json"),
            )
            session.add(db_event)
            session.flush()

            # 4. Update chain head
            head.last_sequence_num = db_event.sequence_num
            head.last_event_hash = computed_hash
            session.flush()

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
        """Lists audit events with pagination and filtering."""
        with db_session(self.engine) as session:
            stmt = select(AuditEventDB).order_by(AuditEventDB.sequence_num)

            if entity_type:
                stmt = stmt.where(AuditEventDB.entity_type == entity_type)
            if entity_id:
                stmt = stmt.where(AuditEventDB.entity_id == entity_id)
            if actor_id:
                stmt = stmt.where(AuditEventDB.actor_id == actor_id)

            rows = session.execute(stmt).scalars().all()
            all_events = [AuditEvent.model_validate(r.payload) for r in rows]

            total = len(all_events)
            paginated = all_events[offset : offset + limit]
            return paginated, total

    def verify_chain(self) -> Tuple[bool, Optional[str]]:
        """Verifies cryptographic hash continuity and payload integrity across all audit events.
        
        Returns (True, None) if valid, or (False, error_description) if tampered.
        """
        with db_session(self.engine) as session:
            stmt = select(AuditEventDB).order_by(AuditEventDB.sequence_num)
            rows = session.execute(stmt).scalars().all()

            if not rows:
                return True, None

            expected_prev_hash = GENESIS_PREVIOUS_HASH
            for idx, r in enumerate(rows, start=1):
                event = AuditEvent.model_validate(r.payload)

                # Check previous hash continuity
                if event.previous_hash != expected_prev_hash:
                    return False, (
                        f"Row {idx} (sequence {r.sequence_num}): Broken hash link. "
                        f"Expected previous_hash={expected_prev_hash}, got {event.previous_hash}"
                    )

                # Recalculate hash over canonical JSON payload
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
                        f"Row {idx} (sequence {r.sequence_num}): Tampered payload. "
                        f"Computed {recalculated}, stored {event.event_hash}"
                    )

                expected_prev_hash = event.event_hash

            return True, None
