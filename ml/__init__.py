"""COAST-AI Machine Learning & Geospatial Processing Package."""

from ml.preprocessing.water_indices import WaterIndexEngine
from ml.preprocessing.raster_utils import RasterUtils
from ml.change_detection.shoreline_extractor import ShorelineExtractor
from ml.change_detection.transect_metrics import TransectMetricsEngine
from ml.change_detection.erosion_model import ShorelineErosionForecaster

__all__ = [
    "WaterIndexEngine",
    "RasterUtils",
    "ShorelineExtractor",
    "TransectMetricsEngine",
    "ShorelineErosionForecaster",
]
