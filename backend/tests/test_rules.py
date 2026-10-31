import pytest
from backend.app.schemas.common import Coordinates
from backend.app.schemas.field import FieldModel
from backend.app.schemas.activity import Activity, ActivityType
from backend.app.schemas.evidence import Evidence, EvidenceType, EvidenceCategory, EvidenceStatus, Provenance, GpsCoordinates
from backend.app.schemas.satellite import SatelliteObservation
from backend.app.schemas.assessment import RuleEvaluationResult, AssessmentStatus
from backend.app.rules.r2_date_window import evaluate_r2_date_window
from backend.app.rules.r3_photo_distance import evaluate_r3_photo_distance
from backend.app.rules.r4_irrigation import evaluate_r4_irrigation
from backend.app.rules.evaluator import run_deterministic_ruleset

# Fixtures for rule tests
@pytest.fixture
def sample_field():
    # Roughly a 100m x 100m square in Ludhiana
    # Punjab: Lon ~75.85, Lat ~30.90
    return FieldModel(
        id="PB-FIELD-001",
        code="PB-FIELD-001",
        name="Ludhiana Demo Field",
        farmer_id="USR-FAR-05",
        district="Ludhiana",
        area_ha=1.8,
        area_acres=4.448,
        coordinates=Coordinates(lat=30.9000, lng=75.8500),
        boundary_polygon=[
            [75.8500, 30.9000],
            [75.8510, 30.9000],
            [75.8510, 30.9010],
            [75.8500, 30.9010],
            [75.8500, 30.9000],
        ],
        geometry_source="demo-placeholder",
    )

def test_r2_date_window_boundaries():
    activity = Activity(
        id="ACT-1",
        field_id="PB-FIELD-001",
        season_id="KHARIF-2026",
        activity_type=ActivityType.DIRECT_SEEDING,
        declared_date="2026-06-15",
        created_by="USR-FAR-05",
        created_at="2026-06-15T00:00:00Z",
    )

    # 10 days exact delta -> PASS
    ev_10d = Evidence(
        id="EV-10D",
        field_id="PB-FIELD-001",
        title="Photo",
        type=EvidenceType.PHOTO,
        category=EvidenceCategory.SUPPORTING,
        status=EvidenceStatus.HASH_RECORDED,
        description="test",
        captured_at="2026-06-25T00:00:00Z",  # Exactly 10 days
        submitted_at="2026-06-25T00:00:00Z",
        submitter_id="user-1",
        provenance=Provenance(author="Tester", source="test", sha256="abc"),
    )
    res_10d = evaluate_r2_date_window([activity], [ev_10d], window_days=10)
    assert res_10d.result == RuleEvaluationResult.PASS

    # 11 days delta -> FAIL
    ev_11d = Evidence(
        id="EV-11D",
        field_id="PB-FIELD-001",
        title="Photo",
        type=EvidenceType.PHOTO,
        category=EvidenceCategory.SUPPORTING,
        status=EvidenceStatus.HASH_RECORDED,
        description="test",
        captured_at="2026-06-26T00:00:00Z",  # 11 days
        submitted_at="2026-06-26T00:00:00Z",
        submitter_id="user-1",
        provenance=Provenance(author="Tester", source="test", sha256="abc"),
    )
    res_11d = evaluate_r2_date_window([activity], [ev_11d], window_days=10)
    assert res_11d.result == RuleEvaluationResult.FAIL

def test_r3_photo_distance_boundaries(sample_field):
    # Field polygon: lon 75.8500 to 75.8510, lat 30.9000 to 30.9010
    # Center point inside: lon 75.8505, lat 30.9005 -> distance 0.0m -> PASS
    ev_inside = Evidence(
        id="EV-INSIDE",
        field_id="PB-FIELD-001",
        title="Inside Photo",
        type=EvidenceType.PHOTO,
        category=EvidenceCategory.SUPPORTING,
        status=EvidenceStatus.HASH_RECORDED,
        description="test",
        captured_at="2026-06-15T00:00:00Z",
        submitted_at="2026-06-15T00:00:00Z",
        submitter_id="user-1",
        provenance=Provenance(
            author="Tester", source="test", sha256="abc",
            gps_coordinates=GpsCoordinates(lat=30.9005, lng=75.8505),
        ),
    )
    res_in = evaluate_r3_photo_distance(sample_field, [ev_inside])
    assert res_in.result == RuleEvaluationResult.PASS

    # Point ~10m outside east edge (lon 75.8510 + 0.0001 roughly 9-10m) -> <= 15m -> PASS
    ev_10m = Evidence(
        id="EV-10M",
        field_id="PB-FIELD-001",
        title="10m Outside Photo",
        type=EvidenceType.PHOTO,
        category=EvidenceCategory.SUPPORTING,
        status=EvidenceStatus.HASH_RECORDED,
        description="test",
        captured_at="2026-06-15T00:00:00Z",
        submitted_at="2026-06-15T00:00:00Z",
        submitter_id="user-1",
        provenance=Provenance(
            author="Tester", source="test", sha256="abc",
            gps_coordinates=GpsCoordinates(lat=30.9005, lng=75.8511),
        ),
    )
    res_10m = evaluate_r3_photo_distance(sample_field, [ev_10m])
    assert res_10m.result == RuleEvaluationResult.PASS

    # Point ~50m outside east edge -> 15m < dist <= 2000m -> WARN
    ev_50m = Evidence(
        id="EV-50M",
        field_id="PB-FIELD-001",
        title="50m Outside Photo",
        type=EvidenceType.PHOTO,
        category=EvidenceCategory.SUPPORTING,
        status=EvidenceStatus.HASH_RECORDED,
        description="test",
        captured_at="2026-06-15T00:00:00Z",
        submitted_at="2026-06-15T00:00:00Z",
        submitter_id="user-1",
        provenance=Provenance(
            author="Tester", source="test", sha256="abc",
            gps_coordinates=GpsCoordinates(lat=30.9005, lng=75.8515),
        ),
    )
    res_50m = evaluate_r3_photo_distance(sample_field, [ev_50m])
    assert res_50m.result == RuleEvaluationResult.WARN

    # Point ~3000m away (lat 30.9300) -> > 2000m -> FAIL
    ev_3km = Evidence(
        id="EV-3KM",
        field_id="PB-FIELD-001",
        title="3km Outside Photo",
        type=EvidenceType.PHOTO,
        category=EvidenceCategory.SUPPORTING,
        status=EvidenceStatus.HASH_RECORDED,
        description="test",
        captured_at="2026-06-15T00:00:00Z",
        submitted_at="2026-06-15T00:00:00Z",
        submitter_id="user-1",
        provenance=Provenance(
            author="Tester", source="test", sha256="abc",
            gps_coordinates=GpsCoordinates(lat=30.9300, lng=75.8505),
        ),
    )
    res_3km = evaluate_r3_photo_distance(sample_field, [ev_3km])
    assert res_3km.result == RuleEvaluationResult.FAIL

def test_r4_irrigation_boundaries():
    sow_act = Activity(
        id="ACT-SOW",
        field_id="PB-FIELD-001",
        season_id="KHARIF-2026",
        activity_type=ActivityType.DIRECT_SEEDING,
        declared_date="2026-06-15",
        created_by="user-1",
        created_at="2026-06-15T00:00:00Z",
    )
    # Pre-sowing irrigation 7 days prior -> PASS/WARN
    irr_7d = Activity(
        id="ACT-IRR-7D",
        field_id="PB-FIELD-001",
        season_id="KHARIF-2026",
        activity_type=ActivityType.PRE_SOWING_IRRIGATION,
        declared_date="2026-06-08",
        created_by="user-1",
        created_at="2026-06-08T00:00:00Z",
    )
    res_7d = evaluate_r4_irrigation([irr_7d, sow_act], satellite_obs=None, max_lag_days=7)
    # Without satellite data, returns WARN ("pending corroboration")
    assert res_7d.result == RuleEvaluationResult.WARN

    # Pre-sowing irrigation 8 days prior -> exceeds 7-day max lag -> FAIL
    irr_8d = Activity(
        id="ACT-IRR-8D",
        field_id="PB-FIELD-001",
        season_id="KHARIF-2026",
        activity_type=ActivityType.PRE_SOWING_IRRIGATION,
        declared_date="2026-06-07",
        created_by="user-1",
        created_at="2026-06-07T00:00:00Z",
    )
    res_8d = evaluate_r4_irrigation([irr_8d, sow_act], satellite_obs=None, max_lag_days=7)
    assert res_8d.result == RuleEvaluationResult.FAIL

    # Water signal: 0.30 -> PASS
    obs_30 = [SatelliteObservation(
        id="SAT-1",
        date="2026-06-10",
        cloud_cover_percent=5.0,
        sun_azimuth_deg=120.0,
        mean_ndwi=0.30,
    )]
    res_water_pass = evaluate_r4_irrigation([irr_7d, sow_act], satellite_obs=obs_30, min_water_fraction=0.30)
    assert res_water_pass.result == RuleEvaluationResult.PASS

    # Water signal: 0.29 -> FAIL
    obs_29 = [SatelliteObservation(
        id="SAT-2",
        date="2026-06-10",
        cloud_cover_percent=5.0,
        sun_azimuth_deg=120.0,
        mean_ndwi=0.29,
    )]
    res_water_fail = evaluate_r4_irrigation([irr_7d, sow_act], satellite_obs=obs_29, min_water_fraction=0.30)
    assert res_water_fail.result == RuleEvaluationResult.FAIL
