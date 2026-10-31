import json
import pytest
from backend.app.schemas.common import Coordinates
from backend.app.schemas.field import FieldModel
from backend.app.schemas.activity import Activity, ActivityType
from backend.app.schemas.evidence import Evidence, EvidenceType, EvidenceCategory, EvidenceStatus, Provenance, GpsCoordinates
from backend.app.schemas.assessment import RuleEvaluationResult
from backend.app.rules.r1_completeness import evaluate_r1_completeness
from backend.app.rules.r5_satellite import evaluate_r5_satellite

@pytest.fixture
def base_field():
    return FieldModel(
        id="PB-FIELD-001",
        code="PB-FIELD-001",
        name="Ludhiana Test Parcel",
        farmer_id="USR-FAR-05",
        district="Ludhiana",
        area_ha=1.8,
        area_acres=4.448,
        coordinates=Coordinates(lat=30.9110, lng=75.8370),
        boundary_polygon=[
            [30.9135, 75.8345],
            [30.9142, 75.8388],
            [30.9085, 75.8395],
            [30.9078, 75.8352],
        ],
        geometry_source="demo-placeholder",
    )

@pytest.fixture
def base_activity():
    return Activity(
        id="ACT-SOW-01",
        field_id="PB-FIELD-001",
        season_id="KHARIF-2026",
        activity_type=ActivityType.DIRECT_SEEDING,
        declared_date="2026-06-15",
        created_by="USR-FLD-03",
        created_at="2026-06-15T10:00:00Z",
    )

@pytest.fixture
def base_photo():
    return Evidence(
        id="EV-PHOTO-01",
        field_id="PB-FIELD-001",
        title="Field Photo",
        type=EvidenceType.PHOTO,
        category=EvidenceCategory.SUPPORTING,
        status=EvidenceStatus.HASH_RECORDED,
        description="Site photo",
        captured_at="2026-06-15T11:00:00Z",
        submitted_at="2026-06-15T11:00:00Z",
        submitter_id="USR-FLD-03",
        provenance=Provenance(
            author="Harpreet Singh",
            source="mobile_app",
            sha256="abc123456789",
            gps_coordinates=GpsCoordinates(lat=30.9110, lng=75.8370),
        ),
    )

def test_r1_each_missing_item_reported_individually(base_field, base_activity, base_photo):
    """H4: R1 verifies that each missing item is reported individually."""
    # 1. Missing Declaration
    invalid_field = base_field.model_copy(update={"practice": ""})
    res_decl = evaluate_r1_completeness(
        invalid_field, [base_activity], [base_photo], has_satellite_data=True, has_weather_data=True
    )
    assert res_decl.result == RuleEvaluationResult.FAIL
    assert "Farmer Field Declaration" in res_decl.explanation

    # 2. Missing In-situ Photo
    res_photo = evaluate_r1_completeness(
        base_field, [base_activity], [], has_satellite_data=True, has_weather_data=True
    )
    assert res_photo.result == RuleEvaluationResult.FAIL
    assert "In-situ Practice Photograph" in res_photo.explanation

    # 3. Missing Activity Log
    res_act = evaluate_r1_completeness(
        base_field, [], [base_photo], has_satellite_data=True, has_weather_data=True
    )
    assert res_act.result == RuleEvaluationResult.FAIL
    assert "Field Activity Log" in res_act.explanation

    # 4. Missing Weather Record
    res_wx = evaluate_r1_completeness(
        base_field, [base_activity], [base_photo], has_satellite_data=True, has_weather_data=False
    )
    assert res_wx.result == RuleEvaluationResult.FAIL
    assert "Weather Record" in res_wx.explanation

    # 5. Missing Satellite Observation
    res_sat = evaluate_r1_completeness(
        base_field, [base_activity], [base_photo], has_satellite_data=False, has_weather_data=True
    )
    assert res_sat.result == RuleEvaluationResult.FAIL
    assert "Satellite Observation" in res_sat.explanation

    # All items present -> PASS
    res_all = evaluate_r1_completeness(
        base_field, [base_activity], [base_photo], has_satellite_data=True, has_weather_data=True
    )
    assert res_all.result == RuleEvaluationResult.PASS
    assert "All mandatory MRV evidence elements are present" in res_all.explanation

def test_r5_comprehensive_cases(tmp_path):
    """H4: R5 comprehensive evaluation including missing file, date boundary, and cloud cover boundary."""
    # 1. Missing observations file -> FAIL
    nonexistent = str(tmp_path / "nonexistent_observations.json")
    res_missing_file = evaluate_r5_satellite(
        field_id="PB-FIELD-001",
        target_date_str="2026-06-15",
        observations_path=nonexistent,
    )
    assert res_missing_file.result == RuleEvaluationResult.FAIL
    assert "not found" in res_missing_file.explanation

    # 2. Observations file exists but no observations for field -> FAIL
    obs_file = tmp_path / "observations.json"
    obs_file.write_text(
        json.dumps([
            {
                "id": "SAT-OTHER-01",
                "date": "2026-06-15",
                "sensor": "Copernicus Sentinel-2 MSI",
                "cloudCoverPercent": 5.0,
                "sunAzimuthDeg": 120.0,
            }
        ]),
        encoding="utf-8",
    )
    # The file has observations, but none matching PB-FIELD-001 if observation has a field_id or global
    # Let's test with empty list
    obs_empty = tmp_path / "obs_empty.json"
    obs_empty.write_text("[]", encoding="utf-8")
    res_empty = evaluate_r5_satellite(
        field_id="PB-FIELD-001",
        target_date_str="2026-06-15",
        observations_path=str(obs_empty),
    )
    assert res_empty.result == RuleEvaluationResult.FAIL
    assert "No satellite observations" in res_empty.explanation

    # 3. Observation outside window: exactly 10 days -> PASS; 11 days -> FAIL
    obs_10d = tmp_path / "obs_10d.json"
    obs_10d.write_text(
        json.dumps([
            {
                "id": "SAT-10D",
                "date": "2026-06-25",  # 10 days after 2026-06-15
                "sensor": "Copernicus Sentinel-2 MSI",
                "cloudCoverPercent": 10.0,
                "sunAzimuthDeg": 120.0,
            }
        ]),
        encoding="utf-8",
    )
    res_10d = evaluate_r5_satellite(
        field_id="PB-FIELD-001",
        target_date_str="2026-06-15",
        observations_path=str(obs_10d),
        window_days=10,
    )
    assert res_10d.result == RuleEvaluationResult.PASS

    obs_11d = tmp_path / "obs_11d.json"
    obs_11d.write_text(
        json.dumps([
            {
                "id": "SAT-11D",
                "date": "2026-06-26",  # 11 days after 2026-06-15
                "sensor": "Copernicus Sentinel-2 MSI",
                "cloudCoverPercent": 10.0,
                "sunAzimuthDeg": 120.0,
            }
        ]),
        encoding="utf-8",
    )
    res_11d = evaluate_r5_satellite(
        field_id="PB-FIELD-001",
        target_date_str="2026-06-15",
        observations_path=str(obs_11d),
        window_days=10,
    )
    assert res_11d.result == RuleEvaluationResult.FAIL
    assert "within 10 days" in res_11d.explanation

    # 4. Cloud cover boundary: 20.0% -> PASS; 20.01% -> WARN
    obs_cloud_20 = tmp_path / "obs_cloud_20.json"
    obs_cloud_20.write_text(
        json.dumps([
            {
                "id": "SAT-CLOUD-20",
                "date": "2026-06-15",
                "sensor": "Copernicus Sentinel-2 MSI",
                "cloudCoverPercent": 20.0,  # Exactly 20.0%
                "sunAzimuthDeg": 120.0,
            }
        ]),
        encoding="utf-8",
    )
    res_c20 = evaluate_r5_satellite(
        field_id="PB-FIELD-001",
        target_date_str="2026-06-15",
        observations_path=str(obs_cloud_20),
        max_cloud_cover_percent=20.0,
    )
    assert res_c20.result == RuleEvaluationResult.PASS

    obs_cloud_20_01 = tmp_path / "obs_cloud_20_01.json"
    obs_cloud_20_01.write_text(
        json.dumps([
            {
                "id": "SAT-CLOUD-20-01",
                "date": "2026-06-15",
                "sensor": "Copernicus Sentinel-2 MSI",
                "cloudCoverPercent": 20.01,  # 20.01% -> exceeds threshold
                "sunAzimuthDeg": 120.0,
            }
        ]),
        encoding="utf-8",
    )
    res_c20_01 = evaluate_r5_satellite(
        field_id="PB-FIELD-001",
        target_date_str="2026-06-15",
        observations_path=str(obs_cloud_20_01),
        max_cloud_cover_percent=20.0,
    )
    assert res_c20_01.result == RuleEvaluationResult.WARN
    assert "cloud cover exceeds 20%" in res_c20_01.explanation
