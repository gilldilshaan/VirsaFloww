"""Tests for the JSON-to-PostgreSQL Migration Engine & CLI."""

import os
import pytest
from sqlalchemy import create_engine, select, text

from backend.app.core.config import settings
from backend.app.db.models import (
    AuditChainHeadDB,
    AuditEventDB,
    EvidenceDB,
    FarmerDB,
    FieldDB,
    ProjectDB,
    ReviewDB,
    UserDB,
)
from backend.scripts.migrate_json_to_postgres import JsonToPostgresMigrator


@pytest.fixture(scope="module")
def db_engine():
    engine = create_engine(
        settings.TEST_DATABASE_URL,
        pool_pre_ping=True,
        connect_args={"options": "-c search_path=public,extensions"},
    )
    yield engine
    engine.dispose()


def test_production_guard_prevents_unauthorized_migration():
    """Safety Rail 4: Migration CLI must refuse to run against production without confirmation."""
    old_env = os.environ.get("CONFIRM_PRODUCTION_WRITE")
    if "CONFIRM_PRODUCTION_WRITE" in os.environ:
        del os.environ["CONFIRM_PRODUCTION_WRITE"]

    try:
        with pytest.raises(RuntimeError, match="SAFETY GUARD TRIGGERED: Refusing migration against PRODUCTION"):
            JsonToPostgresMigrator(target="production", apply=False)
    finally:
        if old_env is not None:
            os.environ["CONFIRM_PRODUCTION_WRITE"] = old_env


def test_migration_dry_run_leaves_database_unmodified(db_engine):
    """Dry-run mode reads records, reconciles relationships, verifies hashes, and rolls back."""
    # Count rows before dry run
    with db_engine.connect() as conn:
        users_before = conn.execute(select(UserDB.id)).scalars().all()

    migrator = JsonToPostgresMigrator(target="test", apply=False)
    summary = migrator.run()

    assert summary.success is True
    assert summary.mode == "DRY-RUN"
    assert summary.audit_chain_valid is True
    assert summary.entity_reports["users"].read_count == 6
    assert summary.entity_reports["users"].valid_count == 6
    assert summary.entity_reports["users"].invalid_count == 0

    # Verify no records were actually committed if it started empty
    with db_engine.connect() as conn:
        users_after = conn.execute(select(UserDB.id)).scalars().all()
    assert len(users_before) == len(users_after)


def test_migration_apply_and_idempotency(db_engine):
    """Applying migration inserts records, initializes audit_chain_head, and repeated apply is idempotent."""
    # Clean tables first to test from clean state
    with db_engine.connect() as conn:
        with conn.begin():
            conn.execute(text("TRUNCATE TABLE audit_events, audit_chain_head, reviews, evidence, fields, farmers, projects, users CASCADE"))

    # Pass 1: Apply migration
    migrator1 = JsonToPostgresMigrator(target="test", apply=True)
    summary1 = migrator1.run()

    assert summary1.success is True
    assert summary1.mode == "APPLY"
    assert summary1.audit_chain_valid is True
    assert summary1.entity_reports["users"].inserted_count == 6
    assert summary1.entity_reports["projects"].inserted_count == 1
    assert summary1.entity_reports["farmers"].inserted_count == 1
    assert summary1.entity_reports["fields"].inserted_count == 1
    assert summary1.entity_reports["evidence"].inserted_count == 1
    assert summary1.entity_reports["reviews"].inserted_count == 1
    assert summary1.entity_reports["audit_events"].inserted_count == 25

    # Check audit_chain_head in DB
    with db_engine.connect() as conn:
        row = conn.execute(
            select(AuditChainHeadDB.last_sequence_num, AuditChainHeadDB.last_event_hash).where(
                AuditChainHeadDB.id == 1
            )
        ).one()
        assert row.last_sequence_num == 25
        assert row.last_event_hash == "2df6686504a8acd6d93b3ee1978a1c8ba5529c1b2e0fd04060724878a924feed"

    # Pass 2: Re-apply to test idempotency
    migrator2 = JsonToPostgresMigrator(target="test", apply=True)
    summary2 = migrator2.run()

    assert summary2.success is True
    # All records should be reported as already_exist_count and 0 inserted
    assert summary2.entity_reports["users"].already_exist_count == 6
    assert summary2.entity_reports["users"].inserted_count == 0
    assert summary2.entity_reports["projects"].already_exist_count == 1
    assert summary2.entity_reports["projects"].inserted_count == 0
    assert summary2.entity_reports["farmers"].already_exist_count == 1
    assert summary2.entity_reports["farmers"].inserted_count == 0
    assert summary2.entity_reports["fields"].already_exist_count == 1
    assert summary2.entity_reports["fields"].inserted_count == 0
    assert summary2.entity_reports["evidence"].already_exist_count == 1
    assert summary2.entity_reports["evidence"].inserted_count == 0
    assert summary2.entity_reports["reviews"].already_exist_count == 1
    assert summary2.entity_reports["reviews"].inserted_count == 0
    assert summary2.entity_reports["audit_events"].already_exist_count == 25
    assert summary2.entity_reports["audit_events"].inserted_count == 0
