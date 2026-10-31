import os
import pytest
from sqlalchemy import text
from backend.app.core.config import settings
from backend.app.db.models import UserDB, ProjectDB, FarmerDB, FieldDB
from backend.app.db.session import get_engine, db_session
from backend.app.schemas.user import UserInDB, UserRole
from backend.app.schemas.project import Project
from backend.app.schemas.farmer import FarmerProfile
from backend.app.schemas.field import FieldModel
from backend.app.schemas.common import Coordinates
from backend.app.storage.postgres_storage import PostgresRepository, lat_lon_polygon_to_wkt

# Skip mark if TEST_DATABASE_URL is not configured
test_db_configured = bool(settings.TEST_DATABASE_URL)

def test_lat_lon_polygon_to_wkt_conversion():
    """Verifies that [lat, lon] polygon coordinates are correctly converted to PostGIS WKT (lon lat) with closed rings."""
    # Input: [latitude, longitude] pairs (e.g. Ludhiana, Punjab)
    coords = [
        [30.9135, 75.8345],
        [30.9142, 75.8388],
        [30.9085, 75.8395],
        [30.9078, 75.8352],
    ]
    wkt = lat_lon_polygon_to_wkt(coords)
    assert wkt is not None
    assert wkt.startswith("POLYGON((")
    assert wkt.endswith("))")

    # In WKT, lon comes first, lat second: "75.8345 30.9135"
    assert "75.8345 30.9135" in wkt
    assert "75.8388 30.9142" in wkt

    # Check ring closure: first point must equal last point
    points = wkt.replace("POLYGON((", "").replace("))", "").split(", ")
    assert points[0] == points[-1]
    assert len(points) == 5  # 4 original + 1 closing point

@pytest.mark.skipif(not test_db_configured, reason="TEST_DATABASE_URL is not configured")
def test_postgres_crud_and_jsonb_roundtrip():
    """Tests CRUD parity and JSONB camelCase round-trip fidelity in PostgresRepository."""
    settings.validate_isolation()
    engine = get_engine(settings.TEST_DATABASE_URL)

    repo = PostgresRepository[UserInDB](
        model_cls=UserInDB,
        db_model_cls=UserDB,
    )

    test_user_id = "test-crud-user-001"
    user_data = UserInDB(
        id=test_user_id,
        email="test_crud@terraledger.ai",
        name="Test CRUD User",
        role=UserRole.ADMIN,
        organization="Panjdhara",
        assigned_project_ids=["PRJ-001"],
        assigned_field_ids=["FIELD-001"],
        is_active=True,
        password_hash="scrypt$test$hash",
    )

    # 1. Cleanup any leftover record
    repo.delete(test_user_id)

    # 2. Create
    created = repo.create(user_data)
    assert created.id == test_user_id

    # 3. Read & Verify JSONB round-trip
    fetched = repo.get(test_user_id)
    assert fetched is not None
    assert fetched.id == test_user_id
    assert fetched.email == "test_crud@terraledger.ai"
    assert fetched.name == "Test CRUD User"
    assert fetched.role == UserRole.ADMIN
    assert fetched.assigned_project_ids == ["PRJ-001"]
    assert fetched.is_active is True

    # 4. Duplicate ID check
    with pytest.raises(ValueError):
        repo.create(user_data)

    # 5. Update
    updated_user = fetched.model_copy(update={"name": "Updated Test User"})
    repo.update(updated_user)
    re_fetched = repo.get(test_user_id)
    assert re_fetched is not None
    assert re_fetched.name == "Updated Test User"

    # 6. Delete
    deleted = repo.delete(test_user_id)
    assert deleted is True
    assert repo.get(test_user_id) is None

@pytest.mark.skipif(not test_db_configured, reason="TEST_DATABASE_URL is not configured")
def test_postgres_pagination_and_lambda_filter():
    """Tests pagination and Python lambda filtering in PostgresRepository."""
    settings.validate_isolation()
    repo = PostgresRepository[UserInDB](model_cls=UserInDB, db_model_cls=UserDB)

    # Insert test batch
    ids = [f"test-page-user-{i}" for i in range(5)]
    for i, uid in enumerate(ids):
        repo.delete(uid)
        repo.create(
            UserInDB(
                id=uid,
                email=f"page_user_{i}@terraledger.ai",
                name=f"Page User {i}",
                role=UserRole.FIELD_OFFICER if i % 2 == 0 else UserRole.REVIEWER,
                password_hash="scrypt$dummy",
            )
        )

    try:
        # Filter lambda: only FIELD_OFFICER
        officers, total = repo.list(filter_fn=lambda u: u.role == UserRole.FIELD_OFFICER)
        assert total >= 3
        for u in officers:
            assert u.role == UserRole.FIELD_OFFICER

        # Pagination slice: limit 2, offset 0
        paged_slice, _ = repo.list(
            filter_fn=lambda u: u.id.startswith("test-page-user-"),
            offset=0,
            limit=2,
        )
        assert len(paged_slice) == 2
    finally:
        for uid in ids:
            repo.delete(uid)

@pytest.mark.skipif(not test_db_configured, reason="TEST_DATABASE_URL is not configured")
def test_geometry_insert_and_st_isvalid():
    """Verifies PostGIS geometry column insertion and ST_IsValid evaluation on TEST database."""
    settings.validate_isolation()
    user_repo = PostgresRepository[UserInDB](model_cls=UserInDB, db_model_cls=UserDB)
    farmer_repo = PostgresRepository[FarmerProfile](model_cls=FarmerProfile, db_model_cls=FarmerDB)
    field_repo = PostgresRepository[FieldModel](model_cls=FieldModel, db_model_cls=FieldDB)

    user_id = "test-geom-user-01"
    farmer_id = "test-geom-farmer-01"
    field_id = "test-geom-field-01"

    # Cleanup
    field_repo.delete(field_id)
    farmer_repo.delete(farmer_id)
    user_repo.delete(user_id)

    # 1. Setup prerequisite parent user & farmer
    user_repo.create(
        UserInDB(
            id=user_id,
            email="geom_test@terraledger.ai",
            name="Geom Test Farmer",
            role=UserRole.FARMER,
            password_hash="scrypt$dummy",
        )
    )
    farmer_repo.create(
        FarmerProfile(
            id=farmer_id,
            user_id=user_id,
            name="Geom Farmer",
            name_local="Geom Local",
            phone_masked="+91 98765 00000",
            district="Ludhiana",
        )
    )

    # 2. Create Field with boundary polygon
    field = FieldModel(
        id=field_id,
        code="TEST-GEOM-CODE-01",
        name="Ludhiana Test Parcel",
        farmer_id=farmer_id,
        district="Ludhiana",
        area_ha=2.5,
        area_acres=6.18,
        coordinates=Coordinates(lat=30.9135, lng=75.8345),
        boundary_polygon=[
            [30.9135, 75.8345],
            [30.9142, 75.8388],
            [30.9085, 75.8395],
            [30.9078, 75.8352],
        ],
    )
    field_repo.create(field)

    try:
        # 3. Query PostgreSQL PostGIS directly to check ST_IsValid
        with db_session(field_repo.engine) as session:
            res = session.execute(
                text("SELECT extensions.ST_IsValid(boundary) FROM fields WHERE id = :id"),
                {"id": field_id},
            ).scalar()
            assert res is True, "PostGIS ST_IsValid must return True for inserted field boundary"
    finally:
        field_repo.delete(field_id)
        farmer_repo.delete(farmer_id)
        user_repo.delete(user_id)

@pytest.mark.skipif(not test_db_configured, reason="TEST_DATABASE_URL is not configured")
def test_gist_index_and_fk_constraint():
    """Verifies that GiST spatial index is present on fields.boundary and FK constraints are enforced."""
    settings.validate_isolation()
    farmer_repo = PostgresRepository[FarmerProfile](model_cls=FarmerProfile, db_model_cls=FarmerDB)

    # 1. Verify GiST index exists
    with db_session(farmer_repo.engine) as session:
        idx_res = session.execute(
            text("""
                SELECT indexname, indexdef
                FROM pg_indexes
                WHERE tablename = 'fields' AND indexdef LIKE '%gist%';
            """)
        ).fetchall()
        assert len(idx_res) > 0, "Expected at least one GiST index on fields table"

    # 2. Verify Foreign Key constraint is enforced on DELETE RESTRICT
    with pytest.raises(Exception):
        # Attempting to insert a farmer referencing a non-existent user_id
        invalid_farmer = FarmerProfile(
            id="invalid-farmer-fk-test",
            user_id="non-existent-user-id-9999",
            name="Invalid Farmer",
            name_local="Invalid Local",
            phone_masked="+91 00000 00000",
            district="Ludhiana",
        )
        farmer_repo.create(invalid_farmer)
