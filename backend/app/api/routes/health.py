from fastapi import APIRouter

router = APIRouter(tags=["Health"])

@router.get("/health")
def get_health():
    """Health check endpoint confirming service status and operational integrity."""
    return {
        "status": "ok",
        "service": "TerraLedger AI Backend",
        "version": "1.0.0",
    }
