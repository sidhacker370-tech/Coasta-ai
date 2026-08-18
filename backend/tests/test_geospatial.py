"""
Tests for Geospatial Processing and Shoreline Change Detection Engine.
"""

import pytest
from backend.app.geospatial.crs import (
    calculate_distance_meters,
    transform_to_projected,
    transform_to_geographic
)
from backend.app.geospatial.shoreline import ShorelineAnalysisEngine
from shapely.geometry import Point


def test_crs_metric_transformations():
    # Puri coast point: 85.83E, 19.80N
    pt_deg = Point(85.83, 19.80)
    pt_m = transform_to_projected(pt_deg)
    assert pt_m.x > 100000.0  # UTM Zone 45N easting
    assert pt_m.y > 2000000.0 # UTM Zone 45N northing

    pt_back_deg = transform_to_geographic(pt_m)
    assert pytest.approx(pt_back_deg.x, abs=1e-5) == 85.83
    assert pytest.approx(pt_back_deg.y, abs=1e-5) == 19.80


def test_distance_calculation():
    dist = calculate_distance_meters(85.8300, 19.8000, 85.8400, 19.8000)
    # Approx 1km displacement along longitude at ~20 deg latitude is ~1047 meters
    assert 900.0 < dist < 1200.0


def test_shoreline_comparison_engine():
    result = ShorelineAnalysisEngine.compare_coastlines(
        baseline_period="2016",
        comparison_period="2026",
        num_transects=30
    )
    assert result["type"] == "FeatureCollection"
    assert len(result["features"]) > 0
    assert "metadata" in result
    assert result["metadata"]["baseline_period"] == "2016"
    assert result["metadata"]["comparison_period"] == "2026"
    
    # Check transect attributes
    t0 = result["features"][0]
    assert "displacement_m" in t0["properties"]
    assert "annual_rate_m_yr" in t0["properties"]
    assert t0["properties"]["classification"] in ["EROSION", "ACCRETION", "STABLE"]

    # Check zone summary
    assert len(result["zone_summary"]) == 5
