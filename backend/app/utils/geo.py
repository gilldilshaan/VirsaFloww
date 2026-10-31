import math
from typing import List, Tuple

EARTH_RADIUS_METERS = 6371000.0

def haversine_distance_meters(lat1: float, lon1: float, lat2: float, lon2: float) -> float:
    """Calculates great-circle distance between two GPS coordinates in meters."""
    phi1 = math.radians(lat1)
    phi2 = math.radians(lat2)
    delta_phi = math.radians(lat2 - lat1)
    delta_lambda = math.radians(lon2 - lon1)

    a = (
        math.sin(delta_phi / 2.0) ** 2
        + math.cos(phi1) * math.cos(phi2) * math.sin(delta_lambda / 2.0) ** 2
    )
    c = 2.0 * math.atan2(math.sqrt(a), math.sqrt(1.0 - a))
    return EARTH_RADIUS_METERS * c

def point_in_polygon(lat: float, lon: float, polygon: List[List[float]]) -> bool:
    """Standard ray-casting algorithm to determine if (lat, lon) is inside a polygon.

    Polygon coordinates are assumed to be [lon, lat] or [lat, lon].
    We normalize coordinates to [lon, lat] where lon is polygon[i][0] and lat is polygon[i][1].
    """
    if not polygon or len(polygon) < 3:
        return False

    inside = False
    n = len(polygon)
    p1x, p1y = polygon[0][0], polygon[0][1]
    # Check if format is [lat, lon] vs [lon, lat]
    # In GeoJSON, polygon coordinates are [longitude, latitude]
    for i in range(1, n + 1):
        p2x, p2y = polygon[i % n][0], polygon[i % n][1]
        if min(p1y, p2y) < lat <= max(p1y, p2y):
            if lon <= max(p1x, p2x):
                if p1y != p2y:
                    xinters = (lat - p1y) * (p2x - p1x) / (p2y - p1y) + p1x
                if p1x == p2x or lon <= xinters:
                    inside = not inside
        p1x, p1y = p2x, p2y

    return inside

def distance_to_segment_meters(
    p_lat: float, p_lon: float,
    a_lat: float, a_lon: float,
    b_lat: float, b_lon: float,
) -> float:
    """Calculates perpendicular or endpoint distance in meters from point P to line segment AB."""
    # Convert lat/lon to planar approximation in meters relative to point A
    cos_lat = math.cos(math.radians(a_lat))
    dx = (b_lon - a_lon) * 111320.0 * cos_lat
    dy = (b_lat - a_lat) * 110540.0
    px = (p_lon - a_lon) * 111320.0 * cos_lat
    py = (p_lat - a_lat) * 110540.0

    line_len_sq = dx * dx + dy * dy
    if line_len_sq == 0.0:
        return math.hypot(px, py)

    # Project point P onto segment AB
    t = max(0.0, min(1.0, (px * dx + py * dy) / line_len_sq))
    proj_x = t * dx
    proj_y = t * dy

    return math.hypot(px - proj_x, py - proj_y)

def distance_point_to_polygon_meters(lat: float, lon: float, polygon: List[List[float]]) -> float:
    """Calculates shortest distance in meters from (lat, lon) to a polygon boundary.

    Returns 0.0 if the point is inside the polygon.
    """
    if not polygon or len(polygon) < 3:
        return 0.0

    # First check if inside
    # If polygon is GeoJSON [lon, lat]
    is_geojson = abs(polygon[0][0]) > abs(polygon[0][1])  # Punjab: Lon ~75, Lat ~30
    if is_geojson:
        poly_lon_lat = polygon
    else:
        poly_lon_lat = [[pt[1], pt[0]] for pt in polygon]

    if point_in_polygon(lat, lon, poly_lon_lat):
        return 0.0

    min_dist = float("inf")
    n = len(poly_lon_lat)
    for i in range(n):
        p1 = poly_lon_lat[i]
        p2 = poly_lon_lat[(i + 1) % n]
        dist = distance_to_segment_meters(lat, lon, p1[1], p1[0], p2[1], p2[0])
        if dist < min_dist:
            min_dist = dist

    return min_dist
