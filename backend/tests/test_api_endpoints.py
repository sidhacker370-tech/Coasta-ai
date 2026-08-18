"""
Integration Tests for All Required FastAPI Core Endpoints.
"""

import pytest
from fastapi.testclient import TestClient
from backend.app.main import app

client = TestClient(app)


def test_root_health():
    res = client.get("/")
    assert res.status_code == 200
    data = res.json()
    assert data["status"] == "healthy"


def test_get_study_area_endpoint():
    res = client.get("/api/study-area")
    assert res.status_code == 200
    data = res.json()
    assert data["type"] == "FeatureCollection"
    assert len(data["features"]) == 5


def test_get_timeline_endpoint():
    res = client.get("/api/timeline")
    assert res.status_code == 200
    data = res.json()
    assert "historical_periods" in data
    assert "2016" in data["historical_periods"]
    assert "2026" in data["historical_periods"]


def test_get_coastline_endpoints():
    # All coastlines
    res_all = client.get("/api/coastline")
    assert res_all.status_code == 200
    assert res_all.json()["type"] == "FeatureCollection"

    # Specific period
    res_single = client.get("/api/coastline?period=2024")
    assert res_single.status_code == 200
    assert res_single.json()["properties"]["period"] == "2024"

    # Non-existent period -> 404
    res_404 = client.get("/api/coastline?period=1900")
    assert res_404.status_code == 404


def test_get_change_endpoint():
    res = client.get("/api/change?baseline=2016&comparison=2026&transects=25")
    assert res.status_code == 200
    data = res.json()
    assert data["type"] == "FeatureCollection"
    assert len(data["features"]) > 0
    assert "zone_summary" in data


def test_get_risk_endpoint():
    res_all = client.get("/api/risk?baseline=2016&comparison=2026")
    assert res_all.status_code == 200
    assert "risk_assessment" in res_all.json()

    res_single = client.get("/api/risk?zone_id=ZONE-C")
    assert res_single.status_code == 200
    assert res_single.json()["zone_id"] == "ZONE-C"


def test_get_zones_endpoint():
    res = client.get("/api/zones")
    assert res.status_code == 200
    data = res.json()
    assert "priority_ranking" in data
    assert len(data["priority_ranking"]) == 5


def test_get_warnings_endpoint():
    res = client.get("/api/warnings")
    assert res.status_code == 200
    data = res.json()
    assert "warnings" in data
    assert "disclaimer" in data


def test_get_summary_endpoint():
    res = client.get("/api/summary")
    assert res.status_code == 200
    data = res.json()
    assert "study_area" in data
    assert "highest_risk_zone" in data
    assert "executive_summary" in data


def test_dashboard_endpoint():
    res = client.get("/dashboard")
    assert res.status_code == 200
    assert "COAST-AI" in res.text

