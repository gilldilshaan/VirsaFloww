import os
import pytest
from backend.app.storage.json_storage import JsonFileRepository
from backend.app.storage.evidence_storage import EvidenceRepository
from backend.app.schemas.user import UserInDB, UserRole
from backend.app.schemas.evidence import Evidence, EvidenceType, EvidenceCategory, EvidenceStatus, FileDetails, Provenance

def test_json_file_repository_crud(tmp_path):
    file_path = str(tmp_path / "test_users.json")
    repo = JsonFileRepository[UserInDB](UserInDB, file_path)

    # Initial state empty
    assert len(repo.find_all()) == 0
    assert repo.get("user-1") is None

    # Insert
    user = UserInDB(
        id="user-1",
        email="test@example.com",
        name="Test User",
        role=UserRole.ADMIN,
        password_hash="scrypt$test",
    )
    repo.insert(user)
    assert len(repo.find_all()) == 1
    assert repo.get("user-1").email == "test@example.com"

    # Restart survival
    repo2 = JsonFileRepository[UserInDB](UserInDB, file_path)
    assert len(repo2.find_all()) == 1
    assert repo2.get("user-1").name == "Test User"

    # Update
    updated = user.model_copy(update={"name": "Updated User"})
    repo2.update(updated)
    assert repo2.get("user-1").name == "Updated User"

    # Delete
    assert repo2.delete("user-1") is True
    assert len(repo2.find_all()) == 0
    assert repo2.get("user-1") is None

def test_evidence_storage_immutability(tmp_path):
    file_path = str(tmp_path / "evidence.json")
    repo = EvidenceRepository(file_path)

    # Verify that update and delete methods do not exist
    assert not hasattr(repo, "update")
    assert not hasattr(repo, "delete")

    # Insert evidence
    item = Evidence(
        id="ev-100",
        field_id="PB-FIELD-001",
        activity_id="act-1",
        title="Field Boundary Inspection",
        type=EvidenceType.PHOTO,
        category=EvidenceCategory.SUPPORTING,
        status=EvidenceStatus.RECEIVED,
        description="Geotagged site photograph",
        captured_at="2026-06-15T10:00:00Z",
        submitted_at="2026-06-15T10:05:00Z",
        submitter_id="user-fld-1",
        provenance=Provenance(
            author="Harpreet Singh Gill",
            source="mobile_app",
            sha256="ba7816bf8f01cfea414140de5dae2223b00361a396177a9cb410ff61f20015ad",
        ),
        file_details=FileDetails(
            name="photo.jpg",
            size_kb=102.4,
            mime="image/jpeg",
            storage_uri="uploads/ev-100.jpg",
        ),
    )
    repo.insert(item)

    # Record status transition
    updated_item = repo.record_status_transition(
        evidence_id="ev-100",
        new_status=EvidenceStatus.HASH_RECORDED,
        actor_id="admin-1",
        reason="Cryptographic hash calculated and recorded on ledger",
    )
    assert updated_item.status == EvidenceStatus.HASH_RECORDED
    assert len(updated_item.status_history) == 1
    assert updated_item.status_history[0].new_status == EvidenceStatus.HASH_RECORDED

    # Restart survival
    repo2 = EvidenceRepository(file_path)
    fetched = repo2.get("ev-100")
    assert fetched.status == EvidenceStatus.HASH_RECORDED
    assert len(fetched.status_history) == 1
