"""
Automatic Data-Backed Situation Summary Service for COAST-AI.
Generates structured intelligence and decision-support summaries directly from backend analytical engines.
NO CHATBOT. Strictly deterministic, data-driven synthesis.
"""

from typing import Dict, Any
from backend.app.services.data_loader import DataLoader
from backend.app.risk.engine import RiskEngine, RiskConfig, DEFAULT_RISK_CONFIG
from backend.app.risk.priority import PriorityEngine
from backend.app.warning.engine import EarlyWarningEngine, WarningThresholds, DEFAULT_THRESHOLDS
from backend.app.geospatial.shoreline import ShorelineAnalysisEngine


class SituationSummaryService:
    @classmethod
    def generate_summary(
        cls,
        baseline_period: str = "2016",
        comparison_period: str = "2026",
        risk_config: RiskConfig = DEFAULT_RISK_CONFIG,
        thresholds: WarningThresholds = DEFAULT_THRESHOLDS
    ) -> Dict[str, Any]:
        """
        Synthesizes analytical observations, risk scores, priority zones, and warnings
        into an actionable, structured situation report.
        """
        study_area = DataLoader.get_study_area()
        sa_meta = study_area.get("metadata", {})
        
        # 1. Shoreline analysis
        shoreline_data = ShorelineAnalysisEngine.compare_coastlines(baseline_period, comparison_period)
        mean_shift = shoreline_data["metadata"]["mean_shoreline_shift_m"]
        
        # 2. Priority & Risk
        ranked_zones = PriorityEngine.rank_zones(baseline_period, comparison_period, risk_config)
        highest_priority = ranked_zones[0] if ranked_zones else {}

        # 3. Warnings
        warnings_report = EarlyWarningEngine.evaluate_warnings(
            baseline_period, comparison_period, risk_config, thresholds
        )

        critical_zone_names = [
            z["zone_name"] for z in ranked_zones if z["risk_level"] in ["CRITICAL", "HIGH"]
        ]

        summary_text = (
            f"Automated Coastal Assessment for {sa_meta.get('title', 'Puri Coastal Region')} ({baseline_period} to {comparison_period}). "
            f"Overall shoreline exhibits {shoreline_data['metadata']['overall_status'].lower()} with an average cross-shore displacement of {mean_shift}m. "
            f"Highest vulnerability identified in {highest_priority.get('zone_name', 'N/A')} "
            f"with a composite risk score of {highest_priority.get('risk_score', 'N/A')}/100 ({highest_priority.get('risk_level', 'N/A')}). "
            f"{warnings_report['total_warnings']} active early warnings triggered across {len(critical_zone_names)} priority sectors."
        )

        return {
            "study_area": sa_meta.get("title", "Puri Coastal Monitoring Sector"),
            "region": sa_meta.get("region", "Odisha, India"),
            "period": f"{baseline_period}–{comparison_period}",
            "time_span_years": int(comparison_period) - int(baseline_period),
            "highest_risk_zone": {
                "zone_id": highest_priority.get("zone_id"),
                "zone_name": highest_priority.get("zone_name"),
                "risk_score": highest_priority.get("risk_score"),
                "risk_level": highest_priority.get("risk_level"),
                "primary_factor": highest_priority.get("primary_factor"),
                "recommended_action": highest_priority.get("recommended_action")
            },
            "system_status": {
                "overall_trajectory": shoreline_data["metadata"]["overall_status"],
                "mean_shoreline_displacement_m": mean_shift,
                "active_warnings_count": warnings_report["total_warnings"],
                "critical_zones_count": warnings_report["critical_count"]
            },
            "priority_zones": ranked_zones,
            "key_warnings": warnings_report["warnings"][:3],  # Top 3 most critical warnings
            "executive_summary": summary_text,
            "classification_notice": "DEMONSTRATION DATASET - Prototype Decision Support System"
        }
