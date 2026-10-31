import os
import json
import pytest
from backend.app.services.audit_service import AuditService, GENESIS_PREVIOUS_HASH
from backend.app.schemas.user import UserRole

def test_audit_log_hash_chain(tmp_path):
    log_file = str(tmp_path / "audit.jsonl")
    audit = AuditService(log_file)

    # Empty log verification
    valid, err = audit.verify_chain()
    assert valid is True
    assert err is None

    # First event uses 64 zeros as prev_hash
    e1 = audit.log_event(
        actor_id="user-1",
        action="user.login",
        entity_type="auth",
        entity_id="session-1",
        details={"ip": "127.0.0.1"},
    )
    assert e1.previous_hash == GENESIS_PREVIOUS_HASH
    assert len(e1.event_hash) == 64

    # Second event chains from e1.event_hash
    e2 = audit.log_event(
        actor_id="user-2",
        action="evidence.upload",
        entity_type="evidence",
        entity_id="ev-123",
        details={"file_name": "photo.jpg"},
    )
    assert e2.previous_hash == e1.event_hash

    # Chain should be valid
    valid, err = audit.verify_chain()
    assert valid is True
    assert err is None

def test_audit_tamper_detection(tmp_path):
    log_file = str(tmp_path / "audit.jsonl")
    audit = AuditService(log_file)

    audit.log_event(
        actor_id="admin-1",
        action="test.event.1",
        entity_type="test",
        entity_id="1",
        details={},
    )
    audit.log_event(
        actor_id="admin-1",
        action="test.event.2",
        entity_type="test",
        entity_id="2",
        details={},
    )

    valid, err = audit.verify_chain()
    assert valid is True

    # Tamper with the first line
    with open(log_file, "r", encoding="utf-8") as f:
        lines = f.readlines()

    tampered_obj = json.loads(lines[0])
    tampered_obj["actorId"] = "hacker-999"
    lines[0] = json.dumps(tampered_obj) + "\n"

    with open(log_file, "w", encoding="utf-8") as f:
        f.writelines(lines)

    # Verify that tampering is immediately detected
    valid, err = audit.verify_chain()
    assert valid is False
    assert "Line 1" in err
