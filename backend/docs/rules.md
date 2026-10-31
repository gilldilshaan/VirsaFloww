# TerraLedger AI — MRV Verification Rules

> **STATUS: PENDING TEAM CONFIRMATION**
>
> All rules described below are deterministic algorithmic checks implemented in Python.
> No large language models (LLMs) or non-deterministic heuristics are permitted in MRV validation.

---

## 1. Rule 1 (R1): Completeness of Evidence Package
- **Objective:** Ensures all required evidentiary artefacts exist before MRV assessment.
- **Required items for Kharif 2026 DSR:**
  1. Farmer Field Declaration (field parcel registered and verified).
  2. In-situ Practice Photograph (geotagged site photo of direct seeded rice).
  3. Field Management Activity Log (declared activity for sowing / irrigation).
  4. Local Weather / Rainfall record.
  5. Optical or Radar Satellite Observation.
- **Outcomes:**
  - `PASS`: All required evidence types are present.
  - `FAIL`: One or more items are missing. Reports exact list of missing items.

---

## 2. Rule 2 (R2): Date Window Compliance
- **Parameter:** `WINDOW_DAYS = 10` UTC days.
- **Objective:** Verifies that timestamped photo and sensor evidence corresponds temporally to the declared activity date.
- **Logic:**
  - `diff_days = abs((captured_at - declared_date).days)`
  - `diff_days <= 10`: `PASS`
  - `diff_days > 10`: `FAIL` (Boundary: 10 days passes, 11 days fails)

---

## 3. Rule 3 (R3): Spatial Point-in-Polygon & Proximity
- **Parameters:**
  - `PHOTO_BUFFER_M = 15.0` meters (GPS receiver drift tolerance).
  - `PHOTO_FAIL_M = 2000.0` meters (maximum plausibility distance).
- **Logic:**
  - If GPS coordinates missing: `WARN` ("Missing GPS metadata").
  - If point is inside field boundary polygon: `PASS` (`distance = 0.0m`).
  - If outside boundary:
    - `distance <= 15.0m`: `PASS` (within buffer tolerance).
    - `15.0m < distance <= 2000.0m`: `WARN` (requires human reviewer audit).
    - `distance > 2000.0m`: `FAIL` (rejected as spatially discordant).

---

## 4. Rule 4 (R4): Irrigation Practice & Spectral Water Signal
- **Parameters:**
  - `IRRIGATION_LAG_DAYS = 7` days.
  - `WATER_MIN_FRACTION = 0.30` (or NDWI water index threshold).
- **Logic:**
  - Pre-sowing irrigation must be documented within 7 days prior to sowing date.
  - If satellite observation is available within the window:
    - Water signal / NDWI $\ge 0.30$: `PASS` (confirms soil moisture / pre-sowing flooding).
    - Water signal $< 0.30$: `FAIL` (conflicting data: satellite indicates dry soil).
  - If satellite data missing: `WARN` ("Satellite moisture observation pending").

---

## 5. Rule 5 (R5): Satellite Coverage & Cloud Clearance
- **Parameter:** `CLOUD_COVER_MAX_PERCENT = 20.0%` (**STATUS: PENDING TEAM CONFIRMATION**)
- **Source:** `data/observations.json` (Copernicus Sentinel-2 L2A MSI).
- **Temporal Window:** `WINDOW_DAYS = 10` UTC days from declared activity date.
- **Logic:**
  - If `data/observations.json` does not exist: `FAIL` ("No satellite coverage available: observations file 'observations.json' not found").
  - If observations file exists but contains no records for the field: `FAIL` ("No satellite observations exist for field").
  - If observations exist for field but none fall within 10 days of declared activity: `FAIL` ("No satellite observations found within 10 days of target date").
  - If observation is found within 10 days:
    - Cloud cover $\le 20.0\%$: `PASS` (Valid observation with acceptable cloud clearance).
    - Cloud cover $> 20.0\%$: `WARN` (Advisory: high cloud cover occludes optical imagery; triggers human review, resulting in overall `NEEDS_REVIEW` status rather than `UNVERIFIED`).

---

## 6. Evaluation Matrix & Aggregation
| Condition | Overall Assessment Status | Wire Status | Status Label |
| :--- | :--- | :--- | :--- |
| Any Rule status == `FAIL` | Unverified | `UNVERIFIED` | Unverified |
| No `FAIL`, at least one `WARN` | Needs Review | `NEEDS_REVIEW` | Needs review |
| All Rules status == `PASS` | Ready for Verification | `READY_FOR_VERIFICATION` | Ready for verification |

> **IMPORTANT:** The status "VERIFIED" does NOT exist in TerraLedger AI. Only accredited independent Validation & Verification Bodies (VVBs) may issue verification statements following formal physical/remote audit.
