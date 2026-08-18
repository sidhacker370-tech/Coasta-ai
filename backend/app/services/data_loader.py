"""
Data Loader and Validator Service for COAST-AI.
Loads and validates GeoJSON study areas, multi-period coastlines, and zone indicators.
"""

import json
import os
from typing import Dict, Any, List, Optional
from shapely.geometry import shape

DATA_DIR = os.path.join(os.path.dirname(__file__), "..", "..", "..", "data", "demo")


class DataLoader:
    _study_area_cache: Optional[Dict[str, Any]] = None
    _coastlines_cache: Optional[Dict[str, Any]] = None
    _zone_factors_cache: Optional[Dict[str, Any]] = None

    @classmethod
    def get_study_area(cls) -> Dict[str, Any]:
        """Loads and validates the study area FeatureCollection."""
        if cls._study_area_cache is None:
            file_path = os.path.join(DATA_DIR, "study_area.geojson")
            if not os.path.exists(file_path):
                raise FileNotFoundError(f"Study area file not found at {file_path}")
            with open(file_path, "r", encoding="utf-8") as f:
                data = json.load(f)
            cls._validate_study_area(data)
            cls._study_area_cache = data
        return cls._study_area_cache

    @classmethod
    def get_coastlines(cls) -> Dict[str, Any]:
        """Loads and validates multi-temporal historical coastlines."""
        if cls._coastlines_cache is None:
            file_path = os.path.join(DATA_DIR, "coastlines.geojson")
            if not os.path.exists(file_path):
                raise FileNotFoundError(f"Coastlines file not found at {file_path}")
            with open(file_path, "r", encoding="utf-8") as f:
                data = json.load(f)
            cls._validate_coastlines(data)
            cls._coastlines_cache = data
        return cls._coastlines_cache

    @classmethod
    def get_zone_factors(cls) -> Dict[str, Any]:
        """Loads zone environmental factors and baseline indicators."""
        if cls._zone_factors_cache is None:
            file_path = os.path.join(DATA_DIR, "zone_factors.json")
            if not os.path.exists(file_path):
                raise FileNotFoundError(f"Zone factors file not found at {file_path}")
            with open(file_path, "r", encoding="utf-8") as f:
                cls._zone_factors_cache = json.load(f)
        return cls._zone_factors_cache

    @classmethod
    def get_timeline(cls) -> List[str]:
        """Returns available historical periods in chronological order."""
        study_area = cls.get_study_area()
        periods = study_area.get("metadata", {}).get("historical_periods", [])
        return sorted(periods)

    @classmethod
    def get_coastline_by_period(cls, period: str) -> Optional[Dict[str, Any]]:
        """Retrieves a single coastline Feature for a given year/period."""
        coastlines = cls.get_coastlines()
        for feat in coastlines.get("features", []):
            if str(feat.get("properties", {}).get("period")) == str(period):
                return feat
        return None

    @classmethod
    def _validate_study_area(cls, data: Dict[str, Any]) -> None:
        """Ensures study area has valid features, geometry, and properties."""
        assert data.get("type") == "FeatureCollection", "Study area must be a GeoJSON FeatureCollection"
        features = data.get("features", [])
        assert len(features) > 0, "Study area must contain at least one zone feature"
        for feat in features:
            geom = shape(feat["geometry"])
            assert geom.is_valid, f"Invalid geometry for zone {feat.get('id')}"
            assert "zone_id" in feat["properties"], "Zone missing zone_id property"

    @classmethod
    def _validate_coastlines(cls, data: Dict[str, Any]) -> None:
        """Ensures coastline features have valid LineString geometries and chronological periods."""
        assert data.get("type") == "FeatureCollection", "Coastlines must be a GeoJSON FeatureCollection"
        features = data.get("features", [])
        assert len(features) >= 2, "At least two coastline observation periods are required for change detection"
        for feat in features:
            geom = shape(feat["geometry"])
            assert geom.is_valid, f"Invalid geometry for coastline {feat.get('id')}"
            assert geom.geom_type in ["LineString", "MultiLineString"], "Coastline must be a LineString"
            assert "period" in feat["properties"], "Coastline missing period property"
