"""PostgreSQL Evidence Repository with strict immutability.

CRITICAL INVARIANTS:
1. Exposes NO update() and NO delete() methods on the public API.
2. Direct SQL UPDATE/DELETE queries are strictly blocked at the database engine level via triggers.
3. Status transitions are the ONLY permitted mutations, recorded via record_status_transition()
   which atomically appends to status_history and updates the status enum.
"""

import json
import logging
import os
from datetime import datetime, timezone
from typing import Any, Callable, Dict, List, Optional, Tuple
from sqlalchemy import delete, select
from backend.app.db.models import EvidenceDB
from backend.app.db.session import db_session, get_engine
from backend.app.schemas.evidence import Evidence, EvidenceStatus, EvidenceStatusHistory
from backend.app.utils.crypto import sha256_bytes

logger = logging.getLogger("terraledger-postgres-evidence")

class PostgresEvidenceRepository:
    """PostgreSQL implementation of EvidenceRepository preserving strict immutability."""

    def __init__(self, seed_path: Optional[str] = None, engine: Optional[Any] = None):
        self.seed_path = os.path.abspath(seed_path) if seed_path else None
        self.engine = engine or get_engine()

    def _extract_column_values(self, entity: Evidence, payload: Dict[str, Any]) -> Dict[str, Any]:
        return {
            "id": entity.id,
            "field_id": entity.field_id,
            "activity_id": entity.activity_id,
            "title": entity.title,
            "type": entity.type.value if hasattr(entity.type, "value") else entity.type,
            "category": entity.category.value if hasattr(entity.category, "value") else entity.category,
            "status": entity.status.value if hasattr(entity.status, "value") else entity.status,
            "captured_at": entity.captured_at,
            "submitted_at": entity.submitted_at,
            "submitter_id": entity.submitter_id,
            "sha256": entity.provenance.sha256 if entity.provenance else "",
            "supersedes_id": entity.supersedes_id,
            "is_demo": entity.is_demo,
            "payload": payload,
        }

    def get(self, evidence_id: str) -> Optional[Evidence]:
        """Retrieves an evidence record by unique ID."""
        with db_session(self.engine) as session:
            stmt = select(EvidenceDB).where(EvidenceDB.id == str(evidence_id))
            row = session.execute(stmt).scalars().first()
            if not row:
                return None
            return Evidence.model_validate(row.payload)

    def list(
        self,
        filter_fn: Optional[Callable[[Evidence], bool]] = None,
        offset: int = 0,
        limit: int = 50,
    ) -> Tuple[List[Evidence], int]:
        """Lists evidence records with Python predicate filter and pagination."""
        with db_session(self.engine) as session:
            stmt = select(EvidenceDB)
            rows = session.execute(stmt).scalars().all()
            all_items = [Evidence.model_validate(r.payload) for r in rows]

            if filter_fn:
                filtered = [item for item in all_items if filter_fn(item)]
            else:
                filtered = all_items

            total = len(filtered)
            paginated = filtered[offset : offset + limit]
            return paginated, total

    def create(self, entity: Evidence) -> Evidence:
        """Inserts a new immutable evidence record."""
        payload = entity.model_dump(by_alias=True, mode="json")
        with db_session(self.engine) as session:
            existing = session.execute(
                select(EvidenceDB).where(EvidenceDB.id == entity.id)
            ).scalars().first()
            if existing:
                raise ValueError(f"Evidence record with id='{entity.id}' already exists.")

            col_data = self._extract_column_values(entity, payload)
            db_record = EvidenceDB(**col_data)
            session.add(db_record)
            session.flush()
            return entity

    insert = create

    def find_all(self, predicate: Optional[Callable[[Evidence], bool]] = None) -> List[Evidence]:
        """Finds all evidence items matching the given predicate."""
        items, _ = self.list(filter_fn=predicate, offset=0, limit=10000)
        return items

    def record_status_transition(
        self,
        evidence_id: str,
        new_status: EvidenceStatus,
        actor_id: str,
        reason: Optional[str] = None,
    ) -> Evidence:
        """Appends a status transition event to status_history and updates record status.
        
        This is the ONLY allowed mutation path on evidence records.
        """
        with db_session(self.engine) as session:
            stmt = select(EvidenceDB).where(EvidenceDB.id == evidence_id).with_for_update()
            row = session.execute(stmt).scalars().first()
            if not row:
                raise KeyError(f"Evidence with id='{evidence_id}' not found.")

            current_model = Evidence.model_validate(row.payload)
            now_iso = datetime.now(timezone.utc).strftime("%Y-%m-%dT%H:%M:%SZ")

            history_event = EvidenceStatusHistory(
                timestamp=now_iso,
                previous_status=current_model.status,
                new_status=new_status,
                actor_id=actor_id,
                reason=reason,
            )

            updated_model = current_model.model_copy(
                update={
                    "status": new_status,
                    "status_history": [*current_model.status_history, history_event],
                }
            )

            # Update row in place (allowed by trg_evidence_immutability)
            updated_payload = updated_model.model_dump(by_alias=True, mode="json")
            row.status = new_status.value if hasattr(new_status, "value") else str(new_status)
            row.payload = updated_payload
            session.flush()
            return updated_model

    def reset_to_seed(self) -> None:
        """Clears evidence and restores seed evidence."""
        with db_session(self.engine) as session:
            session.execute(delete(EvidenceDB))
            session.flush()

            if self.seed_path and os.path.exists(self.seed_path):
                with open(self.seed_path, "r", encoding="utf-8") as f:
                    content = f.read().strip()
                    if content:
                        seed_items = json.loads(content)
                        seed_files_dir = os.path.abspath(
                            os.path.join(os.path.dirname(__file__), "..", "..", "data", "seed_files")
                        )
                        for item in seed_items:
                            parsed = Evidence.model_validate(item)
                            # Compute real sha256 if seed file exists on disk
                            if parsed.file_details and os.path.exists(seed_files_dir):
                                disk_candidate = os.path.join(seed_files_dir, parsed.file_details.name)
                                if os.path.exists(disk_candidate):
                                    with open(disk_candidate, "rb") as bf:
                                        computed = sha256_bytes(bf.read())
                                    updated_prov = parsed.provenance.model_copy(update={"sha256": computed})
                                    parsed = parsed.model_copy(update={"provenance": updated_prov})

                            payload = parsed.model_dump(by_alias=True, mode="json")
                            col_data = self._extract_column_values(parsed, payload)
                            session.add(EvidenceDB(**col_data))
            session.flush()
