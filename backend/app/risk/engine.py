"""
COAST-AI Risk Engine.
Transparent, reproducible multi-criteria coastal vulnerability scoring.

Formula:
  Risk Score = (w_shoreline * Shoreline Change Score)
             + (w_vegetation * Vegetation Loss Score)
             + (w_land_water * Land/Water Transition Score)
             + (w_trend * Historical Trend Score)

Classification:
  0 - 30   : LOW
  31 - 60  : MODERATE
  61 - 80  : HIGH
  81 - 100 : CRITICAL
"""

from typing import Dict, Any, List
from pydantic import BaseModel, Field
from backend.app.services.data_loader import DataLoader
from backend.app.geospatial.shoreline import ShorelineAnalysisEngine


class RiskConfig(BaseModel):
    # Demonstration Weights (Must sum to 1.0)
    weight_shoreline_change: float = Field(default=0.50, ge=0.0, le=1.0)
    weight_vegetation_loss: float = Field(default=0.20, ge=0.0, le=1.0)
    weight_land_water_transition: float = Field(default=0.15, ge=0.0, le=1.0)
    weight_historical_trend: float = Field(default=0.15, ge=0.0, le=1.0)

    # Classification Thresholds
    threshold_low: float = 30.0
    threshold_moderate: float = 60.0
    threshold_high: float = 80.0


# Global configurable risk configuration instance
DEFAULT_RISK_CONFIG = RiskConfig()


class RiskEngine:
    @staticmethod
    def classify_score(score: float, config: RiskConfig = DEFAULT_RISK_CONFIG) -> str:
        """Classifies a normalized 0-100 risk score into standard severity tiers."""
        if score <= config.threshold_low:
            return "LOW"
        elif score <= config.threshold_moderate:
            return "MODERATE"
        elif score <= config.threshold_high:
            return "HIGH"
        else:
            return "CRITICAL"

    @staticmethod
    def normalize_value(val: float, min_val: float, max_val: float) -> float:
        """Min-max normalization to 0.0 - 100.0 scale, clipped."""
        if max_val == min_val:
            return 0.0
        norm = ((val - min_val) / (max_val - min_val)) * 100.0
        return max(0.0, min(100.0, norm))

    @classmethod
    def calculate_zone_risk(
        cls,
        zone_id: str,
        baseline_period: str = "2016",
        comparison_period: str = "2026",
        config: RiskConfig = DEFAULT_RISK_CONFIG
    ) -> Dict[str, Any]:
        """Calculates reproducible, factor-level risk assessment for a specific coastal zone."""
        zone_factors_data = DataLoader.get_zone_factors().get("monitoring_zones", {})
        study_area = DataLoader.get_study_area()

        zone_feature = next((z for z in study_area.get("features", []) if z["properties"]["zone_id"] == zone_id), None)
        zone_name = zone_feature["properties"]["zone_name"] if zone_feature else zone_id
        zf = zone_factors_data.get(zone_id, {})

        # Shoreline change factor (more negative erosion -> higher risk)
        # Shift range: +20m (accretion) to -60m (severe erosion)
        net_shift_m = zf.get("net_shoreline_shift_m", 0.0)
        # Invert: -60m -> 100 risk, +20m -> 0 risk
        shoreline_risk_factor = cls.normalize_value(-net_shift_m, min_val=-20.0, max_val=60.0)

        # Vegetation loss factor: 0% to 35% loss
        veg_loss = zf.get("vegetation_loss_pct", 0.0)
        vegetation_risk_factor = cls.normalize_value(veg_loss, min_val=0.0, max_val=35.0)

        # Land/Water transition area: 0 ha to 25 ha
        transition_ha = zf.get("land_water_transition_ha", 0.0)
        transition_risk_factor = cls.normalize_value(transition_ha, min_val=0.0, max_val=25.0)

        # Historical erosion trend: 0.0 to 1.0
        hist_trend = zf.get("historical_erosion_trend", 0.0)
        trend_risk_factor = cls.normalize_value(hist_trend, min_val=0.0, max_val=1.0)

        # Composite score
        raw_score = (
            config.weight_shoreline_change * shoreline_risk_factor
            + config.weight_vegetation_loss * vegetation_risk_factor
            + config.weight_land_water_transition * transition_risk_factor
            + config.weight_historical_trend * trend_risk_factor
        )
        final_score = round(max(0.0, min(100.0, raw_score)), 1)
        classification = cls.classify_score(final_score, config)

        return {
            "zone_id": zone_id,
            "zone_name": zone_name,
            "period_range": f"{baseline_period}-{comparison_period}",
            "risk_score": final_score,
            "risk_level": classification,
            "factors": {
                "shoreline_change": {
                    "observed_value": net_shift_m,
                    "unit": "meters",
                    "normalized_score": round(shoreline_risk_factor, 1),
                    "weight": config.weight_shoreline_change,
                    "contribution": round(config.weight_shoreline_change * shoreline_risk_factor, 1)
                },
                "vegetation_loss": {
                    "observed_value": veg_loss,
                    "unit": "percent",
                    "normalized_score": round(vegetation_risk_factor, 1),
                    "weight": config.weight_vegetation_loss,
                    "contribution": round(config.weight_vegetation_loss * vegetation_risk_factor, 1)
                },
                "land_water_transition": {
                    "observed_value": transition_ha,
                    "unit": "hectares",
                    "normalized_score": round(transition_risk_factor, 1),
                    "weight": config.weight_land_water_transition,
                    "contribution": round(config.weight_land_water_transition * transition_risk_factor, 1)
                },
                "historical_trend": {
                    "observed_value": hist_trend,
                    "unit": "index (0-1)",
                    "normalized_score": round(trend_risk_factor, 1),
                    "weight": config.weight_historical_trend,
                    "contribution": round(config.weight_historical_trend * trend_risk_factor, 1)
                }
            }
        }

    @classmethod
    def calculate_all_zones_risk(
        cls,
        baseline_period: str = "2016",
        comparison_period: str = "2026",
        config: RiskConfig = DEFAULT_RISK_CONFIG
    ) -> List[Dict[str, Any]]:
        """Computes risk analysis across all monitoring zones in the study area."""
        study_area = DataLoader.get_study_area()
        results = []
        for feat in study_area.get("features", []):
            zid = feat["properties"]["zone_id"]
            results.append(cls.calculate_zone_risk(zid, baseline_period, comparison_period, config))
        return results
