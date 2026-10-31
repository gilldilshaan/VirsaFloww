import re
from typing import Dict, Any, List, Set
from backend.app.schemas.assessment import Assessment
from backend.app.schemas.field import FieldModel
from backend.app.schemas.evidence import Evidence, EvidenceStatus
from backend.app.schemas.activity import Activity
from backend.app.schemas.satellite import SatelliteObservation

class ExplainerContext:
    def __init__(
        self,
        assessment: Assessment,
        field: FieldModel,
        activities: List[Activity],
        evidence_items: List[Evidence],
        observations: List[SatelliteObservation],
    ):
        self.assessment = assessment
        self.field = field
        self.activities = activities
        self.evidence_items = evidence_items
        self.observations = observations

        # Build ID index for citation validation
        self.valid_ids: Set[str] = set()
        self.valid_ids.add(assessment.id)
        self.valid_ids.add(field.id)
        for r in assessment.rule_results:
            self.valid_ids.add(r.rule_id)
            self.valid_ids.add(f"{assessment.id}:{r.rule_id}")
            # Shorthand alias (e.g. R1 for R1_COMPLETENESS)
            short_id = r.rule_id.split("_")[0]
            self.valid_ids.add(short_id)
            self.valid_ids.add(f"{assessment.id}:{short_id}")
        for a in activities:
            self.valid_ids.add(a.id)
        for e in evidence_items:
            self.valid_ids.add(e.id)
        for obs in observations:
            self.valid_ids.add(obs.id)
            self.valid_ids.add(f"OBS-{obs.id}")

        # Build Ground-Truth Numbers Set
        self.ground_truth_numbers: Set[float] = set()
        self._collect_ground_truth_numbers()

    def _collect_ground_truth_numbers(self):
        # Field numbers
        if self.field.area_ha is not None:
            self.ground_truth_numbers.add(float(self.field.area_ha))
        if self.field.area_acres is not None:
            self.ground_truth_numbers.add(float(self.field.area_acres))

        # Assessment & Rules numbers
        for r in self.assessment.rule_results:
            # Extract any numbers from explanation text
            for num in re.findall(r"-?\d+(?:\.\d+)?", r.explanation):
                try:
                    self.ground_truth_numbers.add(float(num))
                except ValueError:
                    pass

        # Evidence numbers
        for e in self.evidence_items:
            if e.provenance.spatial_distance_meters is not None:
                self.ground_truth_numbers.add(float(e.provenance.spatial_distance_meters))
            if e.provenance.gps_coordinates:
                self.ground_truth_numbers.add(round(float(e.provenance.gps_coordinates.lat), 4))
                self.ground_truth_numbers.add(round(float(e.provenance.gps_coordinates.lng), 4))
            # Date numbers (year, month, day)
            self._extract_date_numbers(e.captured_at)

        # Activity date numbers
        for a in self.activities:
            self._extract_date_numbers(a.declared_date)

        # Observation numbers
        for o in self.observations:
            self.ground_truth_numbers.add(float(o.cloud_cover_percent))
            if o.mean_ndvi is not None:
                self.ground_truth_numbers.add(round(float(o.mean_ndvi), 2))
                self.ground_truth_numbers.add(round(float(o.mean_ndvi), 4))
            if o.mean_ndwi is not None:
                self.ground_truth_numbers.add(round(float(o.mean_ndwi), 2))
                self.ground_truth_numbers.add(round(float(o.mean_ndwi), 4))
            self._extract_date_numbers(o.date)

        # Standard rule thresholds as permissible numbers
        for val in [1.0, 2.0, 3.0, 4.0, 5.0, 10.0, 14.0, 20.0, 50.0, 100.0]:
            self.ground_truth_numbers.add(val)

    def _extract_date_numbers(self, date_str: str):
        if not date_str:
            return
        m = re.match(r"^(\d{4})-(\d{2})-(\d{2})", date_str)
        if m:
            self.ground_truth_numbers.add(float(m.group(1))) # Year e.g. 2026
            self.ground_truth_numbers.add(float(int(m.group(2)))) # Month e.g. 6
            self.ground_truth_numbers.add(float(int(m.group(3)))) # Day e.g. 15

    def to_canonical_prompt_dict(self) -> Dict[str, Any]:
        """Produces a deterministic, prompt-injection safe dictionary of facts."""
        return {
            "assessment": {
                "id": self.assessment.id,
                "fieldId": self.assessment.field_id,
                "status": self.assessment.status.value,
                "rulesetVersion": self.assessment.ruleset_version,
                "rules": [
                    {
                        "ruleId": r.rule_id,
                        "result": r.result.value,
                        "explanation": r.explanation,
                        "sourceRecordIds": r.source_record_ids,
                    }
                    for r in sorted(self.assessment.rule_results, key=lambda x: x.rule_id)
                ],
            },
            "field": {
                "id": self.field.id,
                "name": self.field.name,
                "areaHa": self.field.area_ha,
                "practice": self.field.practice,
                "crop": self.field.crop,
                "district": self.field.district,
            },
            "evidence": [
                {
                    "id": e.id,
                    "type": e.type.value,
                    "category": e.category.value,
                    "status": e.status.value,
                    "capturedAt": e.captured_at,
                    # Sanitize / label user text strictly as DATA and truncate
                    "userDescription": f"DATA: {e.description[:100]}",
                }
                for e in sorted(self.evidence_items, key=lambda x: x.id)
            ],
            "observations": [
                {
                    "id": o.id,
                    "date": o.date,
                    "sensor": o.sensor,
                    "cloudCoverPercent": o.cloud_cover_percent,
                    "meanNdvi": o.mean_ndvi,
                }
                for o in sorted(self.observations, key=lambda x: x.id)
            ],
        }
