"""
COAST-AI Early-Warning Engine.
Generates structured early-warning alerts for decision support based on configurable rule thresholds.

Note: Prototype Coastal Early-Warning / Decision-Support System.
      Not an official government disaster warning service.
"""

from typing import List, Dict, Any
from datetime import datetime, timezone
from pydantic import BaseModel, Field
from backend.app.risk.engine import RiskEngine, RiskConfig, DEFAULT_RISK_CONFIG
from backend.app.services.data_loader import DataLoader


class WarningThresholds(BaseModel):
    critical_risk_score: float = 80.0
    high_risk_score: float = 60.0
    critical_erosion_meters: float = -40.0
    high_erosion_meters: float = -20.0
    critical_erosion_rate_m_yr: float = -3.5
    high_veg_loss_pct: float = 20.0


DEFAULT_THRESHOLDS = WarningThresholds()


class EarlyWarningEngine:
    DISCLAIMER = "Prototype Coastal Early-Warning / Decision-Support System. Not an official disaster warning service."

    @classmethod
    def evaluate_warnings(
        cls,
        baseline_period: str = "2016",
        comparison_period: str = "2026",
        risk_config: RiskConfig = DEFAULT_RISK_CONFIG,
        thresholds: WarningThresholds = DEFAULT_THRESHOLDS
    ) -> Dict[str, Any]:
        """
        Evaluates coastal monitoring indicators against configured warning rules.
        """
        all_risks = RiskEngine.calculate_all_zones_risk(baseline_period, comparison_period, risk_config)
        zone_factors_data = DataLoader.get_zone_factors().get("monitoring_zones", {})
        
        warnings_list: List[Dict[str, Any]] = []
        warning_counter = 1
        now_iso = datetime.now(timezone.utc).isoformat()

        for risk_info in all_risks:
            zid = risk_info["zone_id"]
            zname = risk_info["zone_name"]
            score = risk_info["risk_score"]
            zf = zone_factors_data.get(zid, {})
            net_shift = zf.get("net_shoreline_shift_m", 0.0)
            veg_loss = zf.get("vegetation_loss_pct", 0.0)
            annual_rate = zf.get("shoreline_change_rate_m_per_yr", 0.0)

            # Rule 1: High/Critical Composite Risk Score
            if score >= thresholds.critical_risk_score:
                warnings_list.append({
                    "warning_id": f"WARN-{warning_counter:04d}",
                    "zone_id": zid,
                    "zone_name": zname,
                    "severity": "CRITICAL",
                    "indicator": "Composite Coastal Risk Score",
                    "observed_value": score,
                    "threshold": thresholds.critical_risk_score,
                    "unit": "Score (0-100)",
                    "period": f"{baseline_period}-{comparison_period}",
                    "message": f"CRITICAL coastal risk detected in {zname} (Score: {score}/100). Severe multi-factor vulnerability.",
                    "generated_at": now_iso
                })
                warning_counter += 1
            elif score >= thresholds.high_risk_score:
                warnings_list.append({
                    "warning_id": f"WARN-{warning_counter:04d}",
                    "zone_id": zid,
                    "zone_name": zname,
                    "severity": "HIGH",
                    "indicator": "Composite Coastal Risk Score",
                    "observed_value": score,
                    "threshold": thresholds.high_risk_score,
                    "unit": "Score (0-100)",
                    "period": f"{baseline_period}-{comparison_period}",
                    "message": f"HIGH coastal vulnerability in {zname} (Score: {score}/100). Accelerated change detected.",
                    "generated_at": now_iso
                })
                warning_counter += 1

            # Rule 2: Severe Shoreline Erosion Displacement
            if net_shift <= thresholds.critical_erosion_meters:
                warnings_list.append({
                    "warning_id": f"WARN-{warning_counter:04d}",
                    "zone_id": zid,
                    "zone_name": zname,
                    "severity": "CRITICAL",
                    "indicator": "Cumulative Shoreline Retreat",
                    "observed_value": net_shift,
                    "threshold": thresholds.critical_erosion_meters,
                    "unit": "meters",
                    "period": f"{baseline_period}-{comparison_period}",
                    "message": f"Extreme landward shoreline retreat of {abs(net_shift)}m exceeds critical threshold ({abs(thresholds.critical_erosion_meters)}m).",
                    "generated_at": now_iso
                })
                warning_counter += 1
            elif net_shift <= thresholds.high_erosion_meters:
                warnings_list.append({
                    "warning_id": f"WARN-{warning_counter:04d}",
                    "zone_id": zid,
                    "zone_name": zname,
                    "severity": "HIGH",
                    "indicator": "Cumulative Shoreline Retreat",
                    "observed_value": net_shift,
                    "threshold": thresholds.high_erosion_meters,
                    "unit": "meters",
                    "period": f"{baseline_period}-{comparison_period}",
                    "message": f"High shoreline retreat of {abs(net_shift)}m exceeds trigger threshold ({abs(thresholds.high_erosion_meters)}m).",
                    "generated_at": now_iso
                })
                warning_counter += 1

            # Rule 3: Rapid Dune/Coastal Vegetation Loss
            if veg_loss >= thresholds.high_veg_loss_pct:
                warnings_list.append({
                    "warning_id": f"WARN-{warning_counter:04d}",
                    "zone_id": zid,
                    "zone_name": zname,
                    "severity": "MODERATE" if score < thresholds.high_risk_score else "HIGH",
                    "indicator": "Coastal Vegetation Loss",
                    "observed_value": veg_loss,
                    "threshold": thresholds.high_veg_loss_pct,
                    "unit": "percent",
                    "period": f"{baseline_period}-{comparison_period}",
                    "message": f"Vegetation cover reduction of {veg_loss}% indicates degradation of natural coastal buffer.",
                    "generated_at": now_iso
                })
                warning_counter += 1

        return {
            "disclaimer": cls.DISCLAIMER,
            "period": f"{baseline_period}-{comparison_period}",
            "total_warnings": len(warnings_list),
            "critical_count": sum(1 for w in warnings_list if w["severity"] == "CRITICAL"),
            "high_count": sum(1 for w in warnings_list if w["severity"] == "HIGH"),
            "moderate_count": sum(1 for w in warnings_list if w["severity"] == "MODERATE"),
            "warnings": warnings_list
        }
