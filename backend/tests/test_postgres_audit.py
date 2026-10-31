import concurrent.futures
import os
import pytest
from sqlalchemy import text
from backend.app.core.config import settings
from backend.app.db.models import UserDB, FarmerDB, FieldDB, EvidenceDB
from backend.app.db.session import get_engine, db_session
from backend.app.schemas.user import UserInDB, UserRole
from backend.app.schemas.farmer import FarmerProfile
from backend.app.schemas.field import FieldModel
from backend.app.schemas.common import Coordinates
from backend.app.schemas.evidence import (
    Evidence,
    EvidenceCategory,
    EvidenceStatus,
    EvidenceType,
    Provenance,
)
from backend.app.storage.postgres_storage import PostgresRepository
from backend.app.storage.postgres_evidence_storage import PostgresEvidenceRepository
from backend.app.services.postgres_audit_service import PostgresAuditService

test_db_configured = bool(settings.TEST_DATABASE_URL)

@pytest.mark.skipif(not test_db_configured, reason="TEST_DATABASE_URL is not configured")
def test_evidence_sql_triggers_immutability():
    """Verifies that database triggers prevent SQL-level UPDATE and DELETE mutations on evidence."""
    settings.validate_isolation()
    engine = get_engine(settings.TEST_DATABASE_URL)

    user_repo = PostgresRepository[UserInDB](UserInDB, UserDB, engine=engine)
    farmer_repo = PostgresRepository[FarmerProfile](FarmerProfile, FarmerDB, engine=engine)
    field_repo = PostgresRepository[FieldModel](FieldModel, FieldDB, engine=engine)
    evidence_repo = PostgresEvidenceRepository(engine=engine)

    uid = "test-ev-imm-user-01"
    fid = "test-ev-imm-farmer-01"
    fld_id = "test-ev-imm-field-01"
    ev_id = "test-ev-imm-record-01"

    # Setup parent records
    user_repo.create(
        UserInDB(
            id=uid,
            email="ev_imm@terraledger.ai",
            name="Immutability Officer",
            role=UserRole.FIELD_OFFICER,
            password_hash="scrypt$dummy",
        )
    )
    farmer_repo.create(
        FarmerProfile(
            id=fid,
            user_id=uid,
            name="Farmer Imm",
            name_local="Local Imm",
            phone_masked="+91 98765 11111",
            district="Ludhiana",
        )
    )
    field_repo.create(
        FieldModel(
            id=fld_id,
            code="FLD-IMM-001",
            name="Immutability Parcel",
            farmer_id=fid,
            district="Ludhiana",
            area_ha=1.0,
            area_acres=2.47,
            coordinates=Coordinates(lat=30.9, lng=75.8),
        )
    )

    ev = Evidence(
        id=ev_id,
        field_id=fld_id,
        title="Original Sowing Evidence",
        type=EvidenceType.PHOTO,
        category=EvidenceCategory.SUPPORTING,
        status=EvidenceStatus.RECEIVED,
        description="Original upload",
        captured_at="2026-06-15T10:00:00Z",
        submitted_at="2026-06-15T10:05:00Z",
        submitter_id=uid,
        provenance=Provenance(
            author="Field Officer",
            source="mobile-camera",
            sha256="e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855",
        ),
    )
    evidence_repo.create(ev)

    try:
        with db_session(engine) as session:
            # 1. Direct SQL DELETE MUST be rejected by trigger
            with pytest.raises(Exception) as excinfo:
                session.execute(text("DELETE FROM evidence WHERE id = :id"), {"id": ev_id})
                session.flush()
            assert "strictly immutable and cannot be deleted" in str(excinfo.value)
            session.rollback()

        with db_session(engine) as session:
            # 2. Direct SQL UPDATE of title / sha256 MUST be rejected by trigger
            with pytest.raises(Exception) as excinfo:
                session.execute(
                    text("UPDATE evidence SET title = 'Tampered Title' WHERE id = :id"),
                    {"id": ev_id},
                )
                session.flush()
            assert "immutable" in str(excinfo.value).lower()
            session.rollback()

        # 3. Valid status transition via record_status_transition MUST succeed
        updated = evidence_repo.record_status_transition(
            evidence_id=ev_id,
            new_status=EvidenceStatus.HASH_RECORDED,
            actor_id=uid,
            reason="Computed and recorded cryptographic hash.",
        )
        assert updated.status == EvidenceStatus.HASH_RECORDED
        assert len(updated.status_history) == 1
        assert updated.status_history[0].new_status == EvidenceStatus.HASH_RECORDED

    finally:
        # Cleanup in raw SQL disabling trigger temporarily only for test cleanup
        with engine.connect() as conn:
            conn.execute(text("ALTER TABLE evidence DISABLE TRIGGER trg_evidence_immutability;"))
            conn.execute(text("DELETE FROM evidence WHERE id = :id;"), {"id": ev_id})
            conn.execute(text("ALTER TABLE evidence ENABLE TRIGGER trg_evidence_immutability;"))
            conn.commit()
        field_repo.delete(fld_id)
        farmer_repo.delete(fid)
        user_repo.delete(uid)

@pytest.mark.skipif(not test_db_configured, reason="TEST_DATABASE_URL is not configured")
def test_audit_triggers_and_verification():
    """Verifies that audit events cannot be modified/deleted and hash chain verification works."""
    settings.validate_isolation()
    engine = get_engine(settings.TEST_DATABASE_URL)
    audit_service = PostgresAuditService(engine=engine)

    # 1. Log sequential events
    ev1 = audit_service.log_event(
        actor_id="usr-test-01",
        action="TEST_ACTION_1",
        entity_type="field",
        entity_id="fld-001",
        details={"note": "First event"},
    )
    ev2 = audit_service.log_event(
        actor_id="usr-test-01",
        action="TEST_ACTION_2",
        entity_type="field",
        entity_id="fld-001",
        details={"note": "Second event"},
    )

    assert ev2.previous_hash == ev1.event_hash

    # 2. Verify chain passes
    is_valid, err = audit_service.verify_chain()
    assert is_valid is True
    assert err is None

    # 3. Verify triggers block SQL UPDATE on audit_events
    with db_session(engine) as session:
        with pytest.raises(Exception) as excinfo:
            session.execute(
                text("UPDATE audit_events SET action = 'TAMPERED' WHERE event_id = :eid"),
                {"eid": ev1.event_id},
            )
            session.flush()
        assert "immutable" in str(excinfo.value).lower()
        session.rollback()

    # 4. Verify triggers block SQL DELETE on audit_events
    with db_session(engine) as session:
        with pytest.raises(Exception) as excinfo:
            session.execute(
                text("DELETE FROM audit_events WHERE event_id = :eid"),
                {"eid": ev1.event_id},
            )
            session.flush()
        assert "append-only" in str(excinfo.value).lower()
        session.rollback()

@pytest.mark.skipif(not test_db_configured, reason="TEST_DATABASE_URL is not configured")
def test_audit_concurrent_append_20_threads():
    """Stress test: 20 concurrent threads append audit events simultaneously.
    
    Verifies that SELECT ... FOR UPDATE on audit_chain_head prevents forks, guarantees
    strictly monotonic sequence numbers, and leaves a 100% cryptographically valid chain.
    """
    settings.validate_isolation()
    engine = get_engine(settings.TEST_DATABASE_URL)
    audit_service = PostgresAuditService(engine=engine)

    # Record initial count
    initial_events, initial_count = audit_service.list_events(limit=10000)

    num_threads = 20
    actor_id = "test-concurrent-actor"

    def worker(worker_idx: int):
        # Create an isolated service instance per thread sharing the engine connection pool
        svc = PostgresAuditService(engine=engine)
        return svc.log_event(
            actor_id=actor_id,
            action=f"CONCURRENT_WRITE_{worker_idx}",
            entity_type="benchmark",
            entity_id=f"bench-{worker_idx}",
            details={"worker_id": worker_idx},
        )

    # Execute with 20 parallel threads
    with concurrent.futures.ThreadPoolExecutor(max_workers=num_threads) as executor:
        futures = [executor.submit(worker, i) for i in range(num_threads)]
        results = [f.result() for f in futures]

    assert len(results) == num_threads

    # Verify all 20 events recorded
    _, final_count = audit_service.list_events(limit=10000)
    assert final_count == initial_count + num_threads

    # Verify chain integrity across all events
    is_valid, err = audit_service.verify_chain()
    assert is_valid is True, f"Audit chain verification failed after concurrent writes: {err}"
