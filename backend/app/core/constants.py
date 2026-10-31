"""Core physical, temporal, and spatial thresholds for MRV evaluation.

These constants are frozen according to the TerraLedger AI specification.
Do not modify these values without explicit architectural review.
"""

WINDOW_DAYS = 10
PHOTO_BUFFER_M = 15
PHOTO_FAIL_M = 2000
WATER_MIN_FRACTION = 0.30
IRRIGATION_LAG_DAYS = 7
