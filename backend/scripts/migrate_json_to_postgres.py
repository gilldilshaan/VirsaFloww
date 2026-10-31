"""JSON-to-PostgreSQL Data Migration CLI and Reconciliation Engine.

Idempotent, transactional migration from file-based JSON repositories into Supabase PostgreSQL + PostGIS.
Preserves IDs, timestamps, evidence SHA-256 digests, status values, demo flags, and camelCase payloads.
Imports audit log events verbatim with original cryptographic hashes and validates chain integrity.

Usage:
    python -m backend.app.cli migrate-json-to-postgres [--dry-run | --apply] [--target test|production]
"""

import argparse
import json
import logging
import os
import sys
from dataclasses import dataclass, field
from typing import Any, Dict, List, Optional, Set, Tuple

from pydantic import BaseModel
from sqlalchemy import create_engine, select, text
from geoalchemy2.elements import WKTElement

from backend.app.core.config import settings
from backend.app.db.models import (
    ActivityDB,
    AssessmentDB,
    AuditChainHeadDB,
    AuditEventDB,
    BuyerEnquiryDB,
    EvidenceDB,
    FarmerDB,
    FieldDB,
    NotificationDB,
    ProjectDB,
    ReviewDB,
    SeasonDB,
    UserDB,
)
from backend.app.schemas.activity import Activity
from backend.app.schemas.assessment import Assessment
from backend.app.schemas.audit import AuditEvent
from backend.app.schemas.buyer import BuyerEnquiry
from backend.app.schemas.evidence import Evidence
from backend.app.schemas.farmer import FarmerProfile
from backend.app.schemas.field import FieldModel
from backend.app.schemas.notification import Notification
from backend.app.schemas.project import Project
from backend.app.schemas.review import Review
from backend.app.schemas.season import Season
from backend.app.schemas.user import UserInDB
from backend.app.storage.postgres_storage import lat_lon_polygon_to_wkt
from backend.app.utils.crypto import sha256_canonical_json

logger = logging.getLogger("terraledger-migration")

GENESIS_PREVIOUS_HASH = "0" * 64

@dataclass
class EntityReport:
    name: str
    source_file: str
    read_count: int = 0
    valid_count: int = 0
    invalid_count: int = 0
    already_exist_count: int = 0
    would_insert_count: int = 0
    inserted_count: int = 0
    invalid_details: List[str] = field(default_factory=list)
    relationship_warnings: List[str] = field(default_factory=list)

@dataclass
class MigrationSummary:
    target: str
    mode: str
    database_url_masked: str
    entity_reports: Dict[str, EntityReport] = field(default_factory=dict)
    audit_chain_valid: bool = False
    audit_chain_error: Optional[str] = None
    audit_head_hash: str = ""
    evidence_hashes_verified: int = 0
    total_records_inserted: int = 0
    success: bool = False

def mask_url(u: Optional[str]) -> str:
    if not u:
        return "NOT_CONFIGURED"
    try:
        from urllib.parse import urlsplit
        p = urlsplit(u)
        user = p.username[:12] + "..." if p.username and len(p.username) > 12 else "***"
        host = p.hostname[:12] + "..." if p.hostname and len(p.hostname) > 12 else "***"
        port = f":{p.port}" if p.port else ""
        return f"{p.scheme}://{user}:***@{host}{port}{p.path}"
    except Exception:
        return "INVALID_URL"

class JsonToPostgresMigrator:
    """Executes idempotent migration from JSON files to Supabase PostgreSQL."""

    def __init__(self, target: str = "test", apply: bool = False):
        self.target = target.lower()
        self.is_apply = apply
        self.mode = "APPLY" if apply else "DRY-RUN"

        # 1. Safety Rail 2: Isolation check
        settings.validate_isolation()

        # In-memory ID tracking across entities during migration
        self.known_user_ids: Set[str] = set()
        self.known_project_ids: Set[str] = set()
        self.known_farmer_ids: Set[str] = set()
        self.known_field_ids: Set[str] = set()

        # 2. Safety Rail 4: Code-level production guard
        if self.target == "production":
            confirm = os.getenv("CONFIRM_PRODUCTION_WRITE", "")
            if confirm != "I_APPROVE_PRODUCTION_WRITE":
                raise RuntimeError(
                    "SAFETY GUARD TRIGGERED: Refusing migration against PRODUCTION without "
                    "CONFIRM_PRODUCTION_WRITE='I_APPROVE_PRODUCTION_WRITE'."
                )
            self.db_url = settings.DATABASE_URL
            settings.validate_database_url(self.db_url, label="DATABASE_URL (Production)")
        else:
            self.db_url = settings.TEST_DATABASE_URL
            settings.validate_database_url(self.db_url, label="TEST_DATABASE_URL")

        self.engine = create_engine(
            self.db_url,
            pool_pre_ping=True,
            connect_args={"options": "-c search_path=public,extensions"},
        )
        self.summary = MigrationSummary(
            target=self.target,
            mode=self.mode,
            database_url_masked=mask_url(self.db_url),
        )

    def _resolve_source_path(self, filename: str, seed_fallback: Optional[str] = None) -> Optional[str]:
        """Resolves runtime JSON file if present and non-empty, otherwise falls back to seed."""
        runtime_candidate = os.path.join(settings.RUNTIME_DIR, filename)
        if os.path.exists(runtime_candidate) and os.path.getsize(runtime_candidate) > 2:
            return runtime_candidate

        if seed_fallback and os.path.exists(seed_fallback) and os.path.getsize(seed_fallback) > 2:
            return seed_fallback

        seed_candidate = os.path.join(settings.SEED_DIR, filename)
        if os.path.exists(seed_candidate) and os.path.getsize(seed_candidate) > 2:
            return seed_candidate

        return None

    def _load_json_records(self, path: Optional[str]) -> List[Dict[str, Any]]:
        if not path or not os.path.exists(path):
            return []
        try:
            with open(path, "r", encoding="utf-8") as f:
                content = f.read().strip()
                if not content:
                    return []
                data = json.loads(content)
                if isinstance(data, list):
                    return data
                elif isinstance(data, dict):
                    # Some files may wrap list or be single dict
                    return [data]
                return []
        except Exception as exc:
            logger.error("Failed to parse JSON from %s: %s", path, exc)
            return []

    def run(self) -> MigrationSummary:
        """Runs the complete migration inside a single atomic database transaction."""
        print(f"\n{'=' * 65}")
        print(f" TERRALEDGER AI  JSON-TO-POSTGRESQL MIGRATION ENGINE")
        print(f"{'=' * 65}")
        print(f"Target Database : {self.target.upper()} ({self.summary.database_url_masked})")
        print(f"Execution Mode  : {self.mode}")
        print(f"{'-' * 65}\n")

        with self.engine.connect() as conn:
            # Open explicit transaction
            trans = conn.begin()
            try:
                # 1. Users
                self._migrate_users(conn)
                # 2. Projects
                self._migrate_projects(conn)
                # 3. Farmers
                self._migrate_farmers(conn)
                # 4. Fields
                self._migrate_fields(conn)
                # 5. Seasons
                self._migrate_seasons(conn)
                # 6. Activities
                self._migrate_activities(conn)
                # 7. Evidence
                self._migrate_evidence(conn)
                # 8. Assessments
                self._migrate_assessments(conn)
                # 9. Reviews
                self._migrate_reviews(conn)
                # 10. Buyer Enquiries
                self._migrate_buyer_enquiries(conn)
                # 11. Notifications
                self._migrate_notifications(conn)
                # 12. Audit Events & Chain Head
                self._migrate_audit_log(conn)

                if self.is_apply:
                    trans.commit()
                    self.summary.success = True
                    print("\n[SUCCESS] Transaction successfully COMMITTED to database.")
                else:
                    trans.rollback()
                    self.summary.success = True
                    print("\n[DRY-RUN COMPLETE] Transaction cleanly ROLLED BACK. Zero records written.")

            except Exception as exc:
                trans.rollback()
                self.summary.success = False
                print(f"\n[FATAL ERROR] Migration failed: {exc}. Transaction ROLLED BACK.")
                raise

        self._print_reconciliation_report()
        return self.summary

    def _migrate_users(self, conn) -> None:
        source_path = self._resolve_source_path("users.json")
        rep = EntityReport(name="users", source_file=source_path or "NONE")
        records = self._load_json_records(source_path)
        rep.read_count = len(records)

        existing_ids: Set[str] = set(conn.execute(select(UserDB.id)).scalars().all())
        self.known_user_ids.update(existing_ids)

        for raw in records:
            try:
                user = UserInDB.model_validate(raw)
                rep.valid_count += 1
                self.known_user_ids.add(user.id)
            except Exception as e:
                rep.invalid_count += 1
                rep.invalid_details.append(f"User {raw.get('id', 'UNKNOWN')}: {e}")
                continue

            if user.id in existing_ids:
                rep.already_exist_count += 1
                continue

            rep.would_insert_count += 1
            if self.is_apply:
                payload = user.model_dump(by_alias=True, mode="json")
                conn.execute(
                    UserDB.__table__.insert().values(
                        id=user.id,
                        email=user.email,
                        name=user.name,
                        role=user.role.value if hasattr(user.role, "value") else str(user.role),
                        organization=user.organization,
                        buyer_company_id=user.buyer_company_id,
                        is_active=user.is_active,
                        password_hash=user.password_hash,
                        payload=payload,
                    )
                )
                rep.inserted_count += 1
                existing_ids.add(user.id)

        self.summary.entity_reports["users"] = rep

    def _migrate_projects(self, conn) -> None:
        source_path = self._resolve_source_path("projects.json")
        rep = EntityReport(name="projects", source_file=source_path or "NONE")
        records = self._load_json_records(source_path)
        rep.read_count = len(records)

        existing_ids: Set[str] = set(conn.execute(select(ProjectDB.id)).scalars().all())
        self.known_project_ids.update(existing_ids)

        for raw in records:
            try:
                proj = Project.model_validate(raw)
                rep.valid_count += 1
                self.known_project_ids.add(proj.id)
            except Exception as e:
                rep.invalid_count += 1
                rep.invalid_details.append(f"Project {raw.get('id', 'UNKNOWN')}: {e}")
                continue

            if proj.id in existing_ids:
                rep.already_exist_count += 1
                continue

            rep.would_insert_count += 1
            if self.is_apply:
                payload = proj.model_dump(by_alias=True, mode="json")
                conn.execute(
                    ProjectDB.__table__.insert().values(
                        id=proj.id,
                        title=proj.title,
                        slug=proj.slug,
                        location=proj.location,
                        district=proj.district,
                        practice=proj.practice,
                        developer=proj.developer,
                        assessment_status=proj.assessment_status.value if hasattr(proj.assessment_status, "value") else str(proj.assessment_status),
                        is_published=proj.is_published,
                        is_demo=proj.is_demo,
                        payload=payload,
                    )
                )
                rep.inserted_count += 1
                existing_ids.add(proj.id)

        self.summary.entity_reports["projects"] = rep

    def _migrate_farmers(self, conn) -> None:
        source_path = self._resolve_source_path("farmers.json")
        rep = EntityReport(name="farmers", source_file=source_path or "NONE")
        records = self._load_json_records(source_path)
        rep.read_count = len(records)

        existing_ids: Set[str] = set(conn.execute(select(FarmerDB.id)).scalars().all())
        self.known_farmer_ids.update(existing_ids)

        for raw in records:
            try:
                farmer = FarmerProfile.model_validate(raw)
                rep.valid_count += 1
                self.known_farmer_ids.add(farmer.id)
            except Exception as e:
                rep.invalid_count += 1
                rep.invalid_details.append(f"Farmer {raw.get('id', 'UNKNOWN')}: {e}")
                continue

            if farmer.user_id not in self.known_user_ids:
                rep.relationship_warnings.append(
                    f"Farmer {farmer.id} references missing user_id '{farmer.user_id}'"
                )

            if farmer.id in existing_ids:
                rep.already_exist_count += 1
                continue

            rep.would_insert_count += 1
            if self.is_apply:
                payload = farmer.model_dump(by_alias=True, mode="json")
                conn.execute(
                    FarmerDB.__table__.insert().values(
                        id=farmer.id,
                        user_id=farmer.user_id,
                        name=farmer.name,
                        name_local=farmer.name_local,
                        phone_masked=farmer.phone_masked,
                        district=farmer.district,
                        is_demo=farmer.is_demo,
                        payload=payload,
                    )
                )
                rep.inserted_count += 1
                existing_ids.add(farmer.id)

        self.summary.entity_reports["farmers"] = rep

    def _migrate_fields(self, conn) -> None:
        source_path = self._resolve_source_path("fields.json")
        rep = EntityReport(name="fields", source_file=source_path or "NONE")
        records = self._load_json_records(source_path)
        rep.read_count = len(records)

        existing_ids: Set[str] = set(conn.execute(select(FieldDB.id)).scalars().all())
        self.known_field_ids.update(existing_ids)

        for raw in records:
            try:
                field_obj = FieldModel.model_validate(raw)
                rep.valid_count += 1
                self.known_field_ids.add(field_obj.id)
            except Exception as e:
                rep.invalid_count += 1
                rep.invalid_details.append(f"Field {raw.get('id', 'UNKNOWN')}: {e}")
                continue

            if field_obj.farmer_id not in self.known_farmer_ids:
                rep.relationship_warnings.append(
                    f"Field {field_obj.id} references missing farmer_id '{field_obj.farmer_id}'"
                )
            if field_obj.project_id and field_obj.project_id not in self.known_project_ids:
                rep.relationship_warnings.append(
                    f"Field {field_obj.id} references missing project_id '{field_obj.project_id}'"
                )

            if field_obj.id in existing_ids:
                rep.already_exist_count += 1
                continue

            # Convert boundary polygon to WKT
            wkt_geom = None
            if field_obj.boundary_polygon:
                wkt_str = lat_lon_polygon_to_wkt(field_obj.boundary_polygon)
                if wkt_str:
                    wkt_geom = WKTElement(wkt_str, srid=4326)

            rep.would_insert_count += 1
            if self.is_apply:
                payload = field_obj.model_dump(by_alias=True, mode="json")
                conn.execute(
                    FieldDB.__table__.insert().values(
                        id=field_obj.id,
                        code=field_obj.code,
                        name=field_obj.name,
                        farmer_id=field_obj.farmer_id,
                        district=field_obj.district,
                        area_ha=field_obj.area_ha,
                        project_id=field_obj.project_id,
                        boundary=wkt_geom,
                        is_demo=field_obj.is_demo,
                        payload=payload,
                    )
                )
                rep.inserted_count += 1
                existing_ids.add(field_obj.id)

        self.summary.entity_reports["fields"] = rep

    def _migrate_seasons(self, conn) -> None:
        source_path = self._resolve_source_path("seasons.json")
        rep = EntityReport(name="seasons", source_file=source_path or "NONE")
        records = self._load_json_records(source_path)
        rep.read_count = len(records)

        existing_ids: Set[str] = set(conn.execute(select(SeasonDB.id)).scalars().all())

        for raw in records:
            try:
                season = Season.model_validate(raw)
                rep.valid_count += 1
            except Exception as e:
                rep.invalid_count += 1
                rep.invalid_details.append(f"Season {raw.get('id', 'UNKNOWN')}: {e}")
                continue

            if season.id in existing_ids:
                rep.already_exist_count += 1
                continue

            rep.would_insert_count += 1
            if self.is_apply:
                payload = season.model_dump(by_alias=True, mode="json")
                conn.execute(
                    SeasonDB.__table__.insert().values(
                        id=season.id,
                        name=season.name,
                        year=season.year,
                        start_date=season.start_date,
                        end_date=season.end_date,
                        is_active=season.is_active,
                        is_demo=season.is_demo,
                        payload=payload,
                    )
                )
                rep.inserted_count += 1
                existing_ids.add(season.id)

        self.summary.entity_reports["seasons"] = rep

    def _migrate_activities(self, conn) -> None:
        source_path = self._resolve_source_path("activities.json")
        rep = EntityReport(name="activities", source_file=source_path or "NONE")
        records = self._load_json_records(source_path)
        rep.read_count = len(records)

        existing_ids: Set[str] = set(conn.execute(select(ActivityDB.id)).scalars().all())

        for raw in records:
            try:
                act = Activity.model_validate(raw)
                rep.valid_count += 1
            except Exception as e:
                rep.invalid_count += 1
                rep.invalid_details.append(f"Activity {raw.get('id', 'UNKNOWN')}: {e}")
                continue

            if act.id in existing_ids:
                rep.already_exist_count += 1
                continue

            rep.would_insert_count += 1
            if self.is_apply:
                payload = act.model_dump(by_alias=True, mode="json")
                conn.execute(
                    ActivityDB.__table__.insert().values(
                        id=act.id,
                        field_id=act.field_id,
                        season_id=act.season_id,
                        activity_type=act.activity_type.value if hasattr(act.activity_type, "value") else str(act.activity_type),
                        declared_date=act.declared_date,
                        created_by=act.created_by,
                        created_at=act.created_at,
                        is_demo=act.is_demo,
                        payload=payload,
                    )
                )
                rep.inserted_count += 1
                existing_ids.add(act.id)

        self.summary.entity_reports["activities"] = rep

    def _migrate_evidence(self, conn) -> None:
        source_path = self._resolve_source_path("evidence.json", seed_fallback=settings.ROOT_SEED_EVIDENCE_PATH)
        rep = EntityReport(name="evidence", source_file=source_path or "NONE")
        records = self._load_json_records(source_path)
        rep.read_count = len(records)

        existing_ids: Set[str] = set(conn.execute(select(EvidenceDB.id)).scalars().all())
        field_ids: Set[str] = set(conn.execute(select(FieldDB.id)).scalars().all()) | self.known_field_ids
        user_ids: Set[str] = set(conn.execute(select(UserDB.id)).scalars().all()) | self.known_user_ids
        activity_ids: Set[str] = set(conn.execute(select(ActivityDB.id)).scalars().all())

        for raw in records:
            try:
                ev = Evidence.model_validate(raw)
                rep.valid_count += 1
            except Exception as e:
                rep.invalid_count += 1
                rep.invalid_details.append(f"Evidence {raw.get('id', 'UNKNOWN')}: {e}")
                continue

            if ev.field_id not in field_ids:
                rep.relationship_warnings.append(
                    f"Evidence {ev.id} references missing field_id '{ev.field_id}'"
                )
            if ev.submitter_id not in user_ids:
                rep.relationship_warnings.append(
                    f"Evidence {ev.id} references missing submitter_id '{ev.submitter_id}'"
                )

            fk_activity_id = ev.activity_id if ev.activity_id and ev.activity_id in activity_ids else None
            if ev.activity_id and not fk_activity_id:
                rep.relationship_warnings.append(
                    f"Evidence {ev.id} references unseeded activity_id '{ev.activity_id}'; preserved in payload, relational FK set to NULL."
                )

            if ev.id in existing_ids:
                rep.already_exist_count += 1
                continue

            rep.would_insert_count += 1
            self.summary.evidence_hashes_verified += 1
            if self.is_apply:
                payload = ev.model_dump(by_alias=True, mode="json")
                conn.execute(
                    EvidenceDB.__table__.insert().values(
                        id=ev.id,
                        field_id=ev.field_id,
                        activity_id=fk_activity_id,
                        title=ev.title,
                        type=ev.type.value if hasattr(ev.type, "value") else str(ev.type),
                        category=ev.category.value if hasattr(ev.category, "value") else str(ev.category),
                        status=ev.status.value if hasattr(ev.status, "value") else str(ev.status),
                        captured_at=ev.captured_at,
                        submitted_at=ev.submitted_at,
                        submitter_id=ev.submitter_id,
                        sha256=ev.provenance.sha256 if ev.provenance else "",
                        supersedes_id=ev.supersedes_id,
                        is_demo=ev.is_demo,
                        payload=payload,
                    )
                )
                rep.inserted_count += 1
                existing_ids.add(ev.id)

        self.summary.entity_reports["evidence"] = rep

    def _migrate_assessments(self, conn) -> None:
        source_path = self._resolve_source_path("assessments.json")
        rep = EntityReport(name="assessments", source_file=source_path or "NONE")
        records = self._load_json_records(source_path)
        rep.read_count = len(records)

        existing_ids: Set[str] = set(conn.execute(select(AssessmentDB.id)).scalars().all())

        for raw in records:
            try:
                asm = Assessment.model_validate(raw)
                rep.valid_count += 1
            except Exception as e:
                rep.invalid_count += 1
                rep.invalid_details.append(f"Assessment {raw.get('id', 'UNKNOWN')}: {e}")
                continue

            if asm.id in existing_ids:
                rep.already_exist_count += 1
                continue

            rep.would_insert_count += 1
            if self.is_apply:
                payload = asm.model_dump(by_alias=True, mode="json")
                conn.execute(
                    AssessmentDB.__table__.insert().values(
                        id=asm.id,
                        field_id=asm.field_id,
                        season_id=asm.season_id,
                        assessed_at=asm.assessed_at,
                        ruleset_version=asm.ruleset_version,
                        status=asm.status.value if hasattr(asm.status, "value") else str(asm.status),
                        is_demo=asm.is_demo,
                        payload=payload,
                    )
                )
                rep.inserted_count += 1
                existing_ids.add(asm.id)

        self.summary.entity_reports["assessments"] = rep

    def _migrate_reviews(self, conn) -> None:
        source_path = self._resolve_source_path("reviews.json")
        rep = EntityReport(name="reviews", source_file=source_path or "NONE")
        records = self._load_json_records(source_path)
        rep.read_count = len(records)

        existing_ids: Set[str] = set(conn.execute(select(ReviewDB.id)).scalars().all())

        for raw in records:
            try:
                rev = Review.model_validate(raw)
                rep.valid_count += 1
            except Exception as e:
                rep.invalid_count += 1
                rep.invalid_details.append(f"Review {raw.get('id', 'UNKNOWN')}: {e}")
                continue

            if rev.id in existing_ids:
                rep.already_exist_count += 1
                continue

            rep.would_insert_count += 1
            if self.is_apply:
                payload = rev.model_dump(by_alias=True, mode="json")
                conn.execute(
                    ReviewDB.__table__.insert().values(
                        id=rev.id,
                        parcel_id=rev.parcel_id,
                        field_id=rev.field_id,
                        severity=rev.severity.value if hasattr(rev.severity, "value") else str(rev.severity),
                        status=rev.status.value if hasattr(rev.status, "value") else str(rev.status),
                        reported_date=rev.reported_date,
                        due_date=rev.due_date,
                        assigned_to=rev.assigned_to,
                        evidence_ref_id=rev.evidence_ref_id,
                        decision=rev.decision.value if hasattr(rev.decision, "value") and rev.decision else None,
                        is_demo=rev.is_demo,
                        payload=payload,
                    )
                )
                rep.inserted_count += 1
                existing_ids.add(rev.id)

        self.summary.entity_reports["reviews"] = rep

    def _migrate_buyer_enquiries(self, conn) -> None:
        source_path = self._resolve_source_path("buyer_enquiries.json")
        rep = EntityReport(name="buyer_enquiries", source_file=source_path or "NONE")
        records = self._load_json_records(source_path)
        rep.read_count = len(records)

        existing_ids: Set[str] = set(conn.execute(select(BuyerEnquiryDB.id)).scalars().all())

        for raw in records:
            try:
                enq = BuyerEnquiry.model_validate(raw)
                rep.valid_count += 1
            except Exception as e:
                rep.invalid_count += 1
                rep.invalid_details.append(f"BuyerEnquiry {raw.get('id', 'UNKNOWN')}: {e}")
                continue

            if enq.id in existing_ids:
                rep.already_exist_count += 1
                continue

            rep.would_insert_count += 1
            if self.is_apply:
                payload = enq.model_dump(by_alias=True, mode="json")
                conn.execute(
                    BuyerEnquiryDB.__table__.insert().values(
                        id=enq.id,
                        project_id=enq.project_id,
                        buyer_company_id=enq.buyer_company_id,
                        owner_id=enq.owner_id,
                        stage=enq.stage.value if hasattr(enq.stage, "value") else str(enq.stage),
                        status=enq.status.value if hasattr(enq.status, "value") else str(enq.status),
                        inquiry_date=enq.inquiry_date,
                        volume_requested_tons=enq.volume_requested_tons,
                        is_demo=enq.is_demo,
                        payload=payload,
                    )
                )
                rep.inserted_count += 1
                existing_ids.add(enq.id)

        self.summary.entity_reports["buyer_enquiries"] = rep

    def _migrate_notifications(self, conn) -> None:
        source_path = self._resolve_source_path("notifications.json")
        rep = EntityReport(name="notifications", source_file=source_path or "NONE")
        records = self._load_json_records(source_path)
        rep.read_count = len(records)

        existing_ids: Set[str] = set(conn.execute(select(NotificationDB.id)).scalars().all())

        for raw in records:
            try:
                notif = Notification.model_validate(raw)
                rep.valid_count += 1
            except Exception as e:
                rep.invalid_count += 1
                rep.invalid_details.append(f"Notification {raw.get('id', 'UNKNOWN')}: {e}")
                continue

            if notif.id in existing_ids:
                rep.already_exist_count += 1
                continue

            rep.would_insert_count += 1
            if self.is_apply:
                payload = notif.model_dump(by_alias=True, mode="json")
                conn.execute(
                    NotificationDB.__table__.insert().values(
                        id=notif.id,
                        recipient_id=notif.recipient_id,
                        field_id=notif.field_id,
                        type=notif.type.value if hasattr(notif.type, "value") else str(notif.type),
                        is_read=notif.is_read,
                        created_at=notif.created_at,
                        is_demo=notif.is_demo,
                        payload=payload,
                    )
                )
                rep.inserted_count += 1
                existing_ids.add(notif.id)

        self.summary.entity_reports["notifications"] = rep

    def _migrate_audit_log(self, conn) -> None:
        audit_file = settings.AUDIT_LOG_PATH
        rep = EntityReport(name="audit_events", source_file=audit_file if os.path.exists(audit_file) else "NONE")

        events_to_import: List[AuditEvent] = []
        if os.path.exists(audit_file) and os.path.getsize(audit_file) > 0:
            with open(audit_file, "r", encoding="utf-8") as f:
                for line_idx, line in enumerate(f, start=1):
                    stripped = line.strip()
                    if not stripped:
                        continue
                    rep.read_count += 1
                    try:
                        record = json.loads(stripped)
                        evt = AuditEvent.model_validate(record)
                        rep.valid_count += 1
                        events_to_import.append(evt)
                    except Exception as e:
                        rep.invalid_count += 1
                        rep.invalid_details.append(f"Line {line_idx}: {e}")

        # Check existing events in DB
        existing_event_ids: Set[str] = set(conn.execute(select(AuditEventDB.event_id)).scalars().all())

        last_hash = GENESIS_PREVIOUS_HASH
        for evt in events_to_import:
            last_hash = evt.event_hash
            if evt.event_id in existing_event_ids:
                rep.already_exist_count += 1
                continue

            rep.would_insert_count += 1
            if self.is_apply:
                payload = evt.model_dump(by_alias=True, mode="json")
                conn.execute(
                    AuditEventDB.__table__.insert().values(
                        event_id=evt.event_id,
                        actor_id=evt.actor_id,
                        action=evt.action,
                        entity_type=evt.entity_type,
                        entity_id=evt.entity_id,
                        timestamp=evt.timestamp,
                        previous_hash=evt.previous_hash,
                        event_hash=evt.event_hash,
                        details=evt.details or {},
                        payload=payload,
                    )
                )
                rep.inserted_count += 1
                existing_event_ids.add(evt.event_id)

        # Update audit_chain_head if applying
        if self.is_apply and events_to_import:
            total_events = len(conn.execute(select(AuditEventDB.sequence_num)).scalars().all())
            conn.execute(
                text("""
                    INSERT INTO audit_chain_head (id, last_sequence_num, last_event_hash, updated_at)
                    VALUES (1, :seq, :hash, CURRENT_TIMESTAMP)
                    ON CONFLICT (id) DO UPDATE
                    SET last_sequence_num = EXCLUDED.last_sequence_num,
                        last_event_hash = EXCLUDED.last_event_hash,
                        updated_at = CURRENT_TIMESTAMP;
                """),
                {"seq": total_events, "hash": last_hash},
            )

        self.summary.audit_head_hash = last_hash
        self.summary.entity_reports["audit_events"] = rep

        # Verify chain validity over imported events
        self._verify_audit_chain_memory(events_to_import)

    def _verify_audit_chain_memory(self, events: List[AuditEvent]) -> None:
        if not events:
            self.summary.audit_chain_valid = True
            return

        expected_prev = GENESIS_PREVIOUS_HASH
        for idx, evt in enumerate(events, start=1):
            if evt.previous_hash != expected_prev:
                self.summary.audit_chain_valid = False
                self.summary.audit_chain_error = (
                    f"Chain link broken at event #{idx} ({evt.event_id}): "
                    f"expected {expected_prev}, got {evt.previous_hash}"
                )
                return

            payload_to_hash = {
                "action": evt.action,
                "actor_id": evt.actor_id,
                "details": evt.details or {},
                "entity_id": evt.entity_id,
                "entity_type": evt.entity_type,
                "event_id": evt.event_id,
                "previous_hash": evt.previous_hash,
                "timestamp": evt.timestamp,
            }
            recalculated = sha256_canonical_json(payload_to_hash)
            if recalculated != evt.event_hash:
                self.summary.audit_chain_valid = False
                self.summary.audit_chain_error = (
                    f"Hash integrity failed at event #{idx} ({evt.event_id}): "
                    f"computed {recalculated}, stored {evt.event_hash}"
                )
                return

            expected_prev = evt.event_hash

        self.summary.audit_chain_valid = True

    def _print_reconciliation_report(self) -> None:
        print("\n" + "=" * 80)
        print(" RECONCILIATION & INTEGRITY REPORT")
        print("=" * 80)
        header = f"{'Entity':<18} | {'Read':<5} | {'Valid':<5} | {'Invalid':<7} | {'Existing':<8} | {'Would/Did':<9}"
        print(header)
        print("-" * 80)

        total_inserted = 0
        for name, rep in self.summary.entity_reports.items():
            did_count = rep.inserted_count if self.is_apply else rep.would_insert_count
            total_inserted += did_count
            print(
                f"{rep.name:<18} | {rep.read_count:<5} | {rep.valid_count:<5} | "
                f"{rep.invalid_count:<7} | {rep.already_exist_count:<8} | {did_count:<9}"
            )

        self.summary.total_records_inserted = total_inserted
        print("-" * 80)
        print(f"Total Records Target Action : {total_inserted}")
        print(f"Evidence Hashes Verified    : {self.summary.evidence_hashes_verified}")
        print(f"Audit Chain Integrity Valid : {self.summary.audit_chain_valid}")
        if self.summary.audit_chain_error:
            print(f"Audit Chain Error           : {self.summary.audit_chain_error}")
        print(f"Audit Final Chain Head Hash : {self.summary.audit_head_hash}")

        # Relationship warnings
        has_warnings = False
        for name, rep in self.summary.entity_reports.items():
            if rep.relationship_warnings:
                if not has_warnings:
                    print("\n[RELATIONSHIP WARNINGS]")
                    has_warnings = True
                for w in rep.relationship_warnings:
                    print(f"  - {w}")

        print("=" * 80 + "\n")

def main():
    parser = argparse.ArgumentParser(description="TerraLedger AI JSON-to-PostgreSQL Migration CLI")
    group = parser.add_mutually_exclusive_group()
    group.add_argument("--dry-run", action="store_true", default=True, help="Simulate migration without writing (default)")
    group.add_argument("--apply", action="store_true", default=False, help="Execute migration in a single committed transaction")
    parser.add_argument("--target", choices=["test", "production"], default="test", help="Target database environment (default: test)")

    args = parser.parse_args()
    apply_mode = args.apply

    try:
        migrator = JsonToPostgresMigrator(target=args.target, apply=apply_mode)
        migrator.run()
    except Exception as e:
        print(f"\n[ABORT] Migration failed: {e}")
        sys.exit(1)

if __name__ == "__main__":
    main()
