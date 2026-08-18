"""
DSAS (Digital Shoreline Analysis System) Compatible Metrics & Transect Statistics Engine.
Calculates NSM, EPR, LRR, SCE, and statistical confidence intervals for coastal change analysis.
"""

from typing import List, Dict, Any, Tuple, Optional
import numpy as np


class TransectMetricsEngine:
    """
    Computes rigorous cross-shore statistical metrics across multi-temporal shorelines.
    """

    @staticmethod
    def calculate_nsm(baseline_dist_m: float, comparison_dist_m: float) -> float:
        """
        Net Shoreline Movement (NSM): Distance between oldest and youngest shoreline.
        Negative = landward retreat (erosion), Positive = seaward advance (accretion).
        """
        return round(float(comparison_dist_m - baseline_dist_m), 3)

    @staticmethod
    def calculate_epr(
        baseline_dist_m: float,
        comparison_dist_m: float,
        baseline_year: float,
        comparison_year: float
    ) -> float:
        """
        End Point Rate (EPR): Rate of shoreline change in meters per year.
        EPR = (Shoreline_Latest - Shoreline_Baseline) / (Year_Latest - Year_Baseline)
        """
        year_diff = comparison_year - baseline_year
        if year_diff == 0:
            return 0.0
        nsm = comparison_dist_m - baseline_dist_m
        return round(float(nsm / year_diff), 4)

    @staticmethod
    def calculate_lrr(years: List[float], distances_m: List[float]) -> Dict[str, float]:
        """
        Linear Regression Rate (LRR): Fits a least-squares linear regression line
        to all multi-temporal shoreline positions along a transect.
        Returns:
            - lrr_m_per_year: slope of the regression line
            - r_squared: goodness-of-fit coefficient of determination
            - std_err: standard error of the estimate
            - intercept_m: regression intercept
        """
        if len(years) < 2 or len(years) != len(distances_m):
            return {
                "lrr_m_per_year": 0.0,
                "r_squared": 0.0,
                "std_err": 0.0,
                "intercept_m": 0.0
            }

        x = np.array(years, dtype=np.float64)
        y = np.array(distances_m, dtype=np.float64)

        n = len(x)
        x_mean = np.mean(x)
        y_mean = np.mean(y)

        ss_xx = np.sum((x - x_mean) ** 2)
        ss_yy = np.sum((y - y_mean) ** 2)
        ss_xy = np.sum((x - x_mean) * (y - y_mean))

        if ss_xx == 0:
            return {
                "lrr_m_per_year": 0.0,
                "r_squared": 0.0,
                "std_err": 0.0,
                "intercept_m": float(y_mean)
            }

        slope = ss_xy / ss_xx
        intercept = y_mean - slope * x_mean

        y_pred = slope * x + intercept
        ss_res = np.sum((y - y_pred) ** 2)

        r_squared = 1.0 - (ss_res / ss_yy) if ss_yy > 0 else 1.0
        r_squared = max(0.0, min(1.0, float(r_squared)))

        std_err = np.sqrt(ss_res / max(1, (n - 2))) if n > 2 else 0.0

        return {
            "lrr_m_per_year": round(float(slope), 4),
            "r_squared": round(float(r_squared), 4),
            "std_err": round(float(std_err), 4),
            "intercept_m": round(float(intercept), 3)
        }

    @staticmethod
    def calculate_sce(distances_m: List[float]) -> float:
        """
        Shoreline Change Envelope (SCE): Total distance between the shoreline
        farthest seaward and farthest landward (maximum envelope width).
        Always positive or zero.
        """
        if not distances_m:
            return 0.0
        return round(float(np.max(distances_m) - np.min(distances_m)), 3)

    @staticmethod
    def summarize_transect_series(
        transect_id: str,
        years: List[float],
        distances_m: List[float]
    ) -> Dict[str, Any]:
        """Calculates comprehensive DSAS metrics for a single transect over time."""
        if len(years) < 2:
            return {"transect_id": transect_id, "error": "Insufficient temporal points"}

        nsm = TransectMetricsEngine.calculate_nsm(distances_m[0], distances_m[-1])
        epr = TransectMetricsEngine.calculate_epr(distances_m[0], distances_m[-1], years[0], years[-1])
        lrr_stats = TransectMetricsEngine.calculate_lrr(years, distances_m)
        sce = TransectMetricsEngine.calculate_sce(distances_m)

        status = "Severe Erosion" if epr < -3.0 else (
            "Moderate Erosion" if epr < -1.0 else (
                "Stable" if abs(epr) <= 1.0 else "Accretion"
            )
        )

        return {
            "transect_id": transect_id,
            "baseline_year": years[0],
            "latest_year": years[-1],
            "nsm_m": nsm,
            "epr_m_per_yr": epr,
            "lrr_m_per_yr": lrr_stats["lrr_m_per_year"],
            "lrr_r_squared": lrr_stats["r_squared"],
            "lrr_std_err": lrr_stats["std_err"],
            "sce_m": sce,
            "classification": status
        }
