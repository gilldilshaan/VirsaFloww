from typing import List
from backend.app.core.constants import PHOTO_BUFFER_M, PHOTO_FAIL_M
from backend.app.schemas.assessment import RuleResult, RuleEvaluationResult
from backend.app.schemas.evidence import Evidence, EvidenceType, EvidenceStatus
from backend.app.schemas.field import FieldModel
from backend.app.utils.geo import distance_point_to_polygon_meters

def evaluate_r3_photo_distance(
    field: FieldModel,
    evidence_items: List[Evidence],
    buffer_m: float = PHOTO_BUFFER_M,
    fail_m: float = PHOTO_FAIL_M,
) -> RuleResult:
    """R3: Verifies physical spatial proximity of geotagged practice photos to field boundaries."""
    photos = [
        e for e in evidence_items
        if e.type == EvidenceType.PHOTO and e.status != EvidenceStatus.SUPERSEDED
    ]

    if not photos:
        return RuleResult(
            rule_id="R3_PHOTO_DISTANCE",
            result=RuleEvaluationResult.FAIL,
            explanation="No active practice photograph available for spatial distance verification.",
            source_record_ids=[],
        )

    polygon = field.boundary_polygon
    # Fallback to field coordinates if polygon has fewer than 3 vertices
    if not polygon or len(polygon) < 3:
        # Create a small bounding box around field.coordinates (approx 100m)
        lat = field.coordinates.lat
        lng = field.coordinates.lng
        delta = 0.0005  # roughly 50m
        polygon = [
            [lng - delta, lat - delta],
            [lng + delta, lat - delta],
            [lng + delta, lat + delta],
            [lng - delta, lat + delta],
            [lng - delta, lat - delta],
        ]

    source_ids = []
    missing_coords = []
    warning_photos = []
    failed_photos = []

    for photo in photos:
        source_ids.append(photo.id)
        gps = photo.provenance.gps_coordinates
        if not gps or gps.lat is None or gps.lng is None:
            missing_coords.append(photo.id)
            continue

        dist = distance_point_to_polygon_meters(gps.lat, gps.lng, polygon)

        # Boundary checks
        if dist <= buffer_m:
            continue
        elif dist <= fail_m:
            warning_photos.append(f"{photo.id} ({dist:.1f}m from boundary)")
        else:
            failed_photos.append(f"{photo.id} ({dist:.1f}m from boundary)")

    if failed_photos:
        return RuleResult(
            rule_id="R3_PHOTO_DISTANCE",
            result=RuleEvaluationResult.FAIL,
            explanation=(
                f"Photographs located beyond maximum spatial threshold ({fail_m:.0f}m): "
                f"{', '.join(failed_photos)}."
            ),
            source_record_ids=source_ids,
        )

    if missing_coords or warning_photos:
        issues = []
        if missing_coords:
            issues.append(f"photos lacking GPS coordinates: {', '.join(missing_coords)}")
        if warning_photos:
            issues.append(f"photos outside {buffer_m:.0f}m buffer: {', '.join(warning_photos)}")

        return RuleResult(
            rule_id="R3_PHOTO_DISTANCE",
            result=RuleEvaluationResult.WARN,
            explanation=f"Spatial audit advisory — {'; '.join(issues)}. Requires manual reviewer review.",
            source_record_ids=source_ids,
        )

    return RuleResult(
        rule_id="R3_PHOTO_DISTANCE",
        result=RuleEvaluationResult.PASS,
        explanation=f"All practice photographs are within the field parcel boundary (or within {buffer_m:.0f}m tolerance).",
        source_record_ids=source_ids,
    )
