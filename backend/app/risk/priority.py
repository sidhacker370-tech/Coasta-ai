"""
Priority Engine for COAST-AI.
Calculates backend-driven risk-zone ranking for decision support and mitigation prioritization.
"""

from typing import List, Dict, Any
from backend.app.risk.engine import RiskEngine, RiskConfig, DEFAULT_RISK_CONFIG


class PriorityEngine:
    @staticmethod
    def rank_zones(
        baseline_period: str = "2016",
        comparison_period: str = "2026",
        config: RiskConfig = DEFAULT_RISK_CONFIG
    ) -> List[Dict[str, Any]]:
        """
        Dynamically computes priority ranking of all coastal monitoring zones.
        Higher risk scores and higher erosion rates receive top priority.
        """
        all_risks = RiskEngine.calculate_all_zones_risk(baseline_period, comparison_period, config)

        # Sort descending by risk score, then by shoreline change contribution
        sorted_zones = sorted(
            all_risks,
            key=lambda z: (
                z["risk_score"],
                z["factors"]["shoreline_change"]["contribution"]
            ),
            reverse=True
        )

        ranked_results = []
        for rank, zone in enumerate(sorted_zones, start=1):
            ranked_results.append({
                "priority_rank": rank,
                "zone_id": zone["zone_id"],
                "zone_name": zone["zone_name"],
                "risk_score": zone["risk_score"],
                "risk_level": zone["risk_level"],
                "primary_factor": "Shoreline Erosion" if zone["factors"]["shoreline_change"]["normalized_score"] >= 50 else "Vegetation / Land Transition",
                "recommended_action": (
                    "Immediate coastal armor inspection & shoreline stabilization"
                    if zone["risk_level"] in ["HIGH", "CRITICAL"]
                    else (
                        "Seasonal monitoring & dune vegetation preservation"
                        if zone["risk_level"] == "MODERATE"
                        else "Routine satellite observation"
                    )
                )
            })

        return ranked_results
