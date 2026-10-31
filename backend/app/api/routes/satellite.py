import json
import os
from typing import Optional, List
from fastapi import APIRouter, Depends, Query, status

from backend.app.schemas.satellite import SatelliteObservation, SatelliteObservationsResponse
from backend.app.core.config import settings
from backend.app.schemas.user import User, UserRole
from backend.app.api.deps import get_current_user

router = APIRouter(prefix="/satellite", tags=["Satellite Intelligence"])

@router.get("/observations", response_model=SatelliteObservationsResponse)
def list_satellite_observations(
    field_id: Optional[str] = Query(None, alias="fieldId"),
    offset: int = Query(0, ge=0),
    limit: int = Query(50, ge=1, le=100),
    current_user: User = Depends(get_current_user),
):
    """Retrieves real Sentinel-2 satellite observation records.

    Gracefully handles absence of Lead's observations file without crashing.
    """
    obs_file = settings.LEAD_OBSERVATIONS_PATH
    if not os.path.exists(obs_file):
        return SatelliteObservationsResponse(
            items=[],
            total=0,
            metadata={"status": "no_data_available", "reason": "Observations dataset not yet supplied by Lead."},
        )

    try:
        with open(obs_file, "r", encoding="utf-8") as f:
            content = f.read().strip()
            if not content:
                raw_items = []
            else:
                raw_items = json.loads(content)
    except Exception as e:
        return SatelliteObservationsResponse(
            items=[],
            total=0,
            metadata={"status": "error_reading_file", "error": str(e)},
        )

    observations: List[SatelliteObservation] = []
    for item in raw_items:
        try:
            obs = SatelliteObservation.model_validate(item)
            observations.append(obs)
        except Exception:
            continue

    total = len(observations)
    paginated = observations[offset : offset + limit]
    return SatelliteObservationsResponse(
        items=paginated,
        total=total,
        metadata={"source": "Copernicus Sentinel-2 MSI", "file": os.path.basename(obs_file)},
    )

@router.get("/fields/{field_id}", response_model=SatelliteObservationsResponse)
def get_field_satellite_observations(
    field_id: str,
    offset: int = Query(0, ge=0),
    limit: int = Query(50, ge=1, le=100),
    current_user: User = Depends(get_current_user),
):
    """Retrieves satellite observations specific to a field parcel."""
    return list_satellite_observations(
        field_id=field_id,
        offset=offset,
        limit=limit,
        current_user=current_user,
    )
