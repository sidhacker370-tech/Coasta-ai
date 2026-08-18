"""
CRS (Coordinate Reference System) Management and Metric Transformations for COAST-AI.
Default Geographic CRS: EPSG:4326 (WGS84 Degrees)
Default Projected CRS: EPSG:32645 (UTM Zone 45N - Easting/Northing in Meters)
"""

from typing import Tuple, List
from pyproj import Transformer
from shapely.geometry import shape, mapping
from shapely.ops import transform

GEOGRAPHIC_CRS = "EPSG:4326"
PROJECTED_CRS = "EPSG:32645"

# Transformers
_to_meters = Transformer.from_crs(GEOGRAPHIC_CRS, PROJECTED_CRS, always_xy=True)
_to_degrees = Transformer.from_crs(PROJECTED_CRS, GEOGRAPHIC_CRS, always_xy=True)


def transform_to_projected(geom):
    """Transforms a Shapely geometry from EPSG:4326 to EPSG:32645 (Meters)."""
    return transform(_to_meters.transform, geom)


def transform_to_geographic(geom):
    """Transforms a Shapely geometry from EPSG:32645 to EPSG:4326 (Degrees)."""
    return transform(_to_degrees.transform, geom)


def calculate_distance_meters(lon1: float, lat1: float, lon2: float, lat2: float) -> float:
    """Calculates planar metric distance in meters between two WGS84 points using UTM 45N."""
    x1, y1 = _to_meters.transform(lon1, lat1)
    x2, y2 = _to_meters.transform(lon2, lat2)
    return float(((x2 - x1) ** 2 + (y2 - y1) ** 2) ** 0.5)
