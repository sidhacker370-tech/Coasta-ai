"""
Tests for Early Warning Engine and Alert Rule Evaluation.
"""

import pytest
from backend.app.warning.engine import EarlyWarningEngine, WarningThresholds


def test_warning_generation_and_fields():
    report = EarlyWarningEngine.evaluate_warnings("2016", "2026")
    assert report["total_warnings"] > 0
    assert "disclaimer" in report
    assert "Prototype Coastal Early-Warning" in report["disclaimer"]

    # Check required fields on each warning object
    for w in report["warnings"]:
        assert "warning_id" in w
        assert "zone_id" in w
        assert "severity" in w
        assert w["severity"] in ["LOW", "MODERATE", "HIGH", "CRITICAL"]
        assert "indicator" in w
        assert "observed_value" in w
        assert "threshold" in w
        assert "period" in w
        assert "message" in w
        assert "generated_at" in w


def test_custom_threshold_triggers():
    # If we set thresholds unrealistically high, no warnings should fire
    high_thresholds = WarningThresholds(
        critical_risk_score=999.0,
        high_risk_score=999.0,
        critical_erosion_meters=-999.0,
        high_erosion_meters=-999.0,
        high_veg_loss_pct=999.0
    )
    report_none = EarlyWarningEngine.evaluate_warnings("2016", "2026", thresholds=high_thresholds)
    assert report_none["total_warnings"] == 0
