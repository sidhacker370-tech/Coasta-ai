"""
Tests for Data Loader and Geospatial Validation.
"""

import pytest
from backend.app.services.data_loader import DataLoader
from shapely.geometry import shape


def test_study_area_loading():
    study_area = DataLoader.get_study_area()
    assert study_area["type"] == "FeatureCollection"
    assert len(study_area["features"]) == 5
    assert study_area["metadata"]["study_area_id"] == "puri_odisha_in"
    for feat in study_area["features"]:
        geom = shape(feat["geometry"])
        assert geom.is_valid
        assert geom.geom_type == "Polygon"


def test_coastlines_loading_and_timeline():
    coastlines = DataLoader.get_coastlines()
    assert coastlines["type"] == "FeatureCollection"
    assert len(coastlines["features"]) >= 5
    timeline = DataLoader.get_timeline()
    assert timeline == ["2016", "2018", "2020", "2022", "2024", "2026"]


def test_single_coastline_retrieval():
    feat = DataLoader.get_coastline_by_period("2020")
    assert feat is not None
    assert feat["properties"]["period"] == "2020"
    geom = shape(feat["geometry"])
    assert geom.is_valid
    assert geom.geom_type in ["LineString", "MultiLineString"]
