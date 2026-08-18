"""
Tests for Risk Engine and Priority Ranking.
"""

import pytest
from backend.app.risk.engine import RiskEngine, RiskConfig
from backend.app.risk.priority import PriorityEngine


def test_normalization_bounds():
    assert RiskEngine.normalize_value(50, 0, 100) == 50.0
    assert RiskEngine.normalize_value(150, 0, 100) == 100.0  # clipped upper
    assert RiskEngine.normalize_value(-20, 0, 100) == 0.0    # clipped lower


def test_risk_classification():
    assert RiskEngine.classify_score(25.0) == "LOW"
    assert RiskEngine.classify_score(45.0) == "MODERATE"
    assert RiskEngine.classify_score(72.0) == "HIGH"
    assert RiskEngine.classify_score(92.0) == "CRITICAL"


def test_zone_risk_reproducibility():
    res1 = RiskEngine.calculate_zone_risk("ZONE-C")
    res2 = RiskEngine.calculate_zone_risk("ZONE-C")
    assert res1["risk_score"] == res2["risk_score"]
    assert res1["risk_level"] in ["HIGH", "CRITICAL"]
    assert "shoreline_change" in res1["factors"]
    assert res1["factors"]["shoreline_change"]["weight"] == 0.50


def test_priority_ranking_order():
    ranking = PriorityEngine.rank_zones()
    assert len(ranking) == 5
    # Must be ordered monotonically descending by score
    scores = [z["risk_score"] for z in ranking]
    assert scores == sorted(scores, reverse=True)
    assert ranking[0]["priority_rank"] == 1
