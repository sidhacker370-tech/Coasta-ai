"""
COAST-AI Minimal Core API Router.
Exposes strictly required endpoints according to the API contract:
- GET /api/study-area
- GET /api/timeline
- GET /api/coastline
- GET /api/change
- GET /api/risk
- GET /api/zones
- GET /api/warnings
- GET /api/summary
"""

from typing import Optional
from fastapi import APIRouter, Query, HTTPException
from fastapi.responses import JSONResponse

from backend.app.services.data_loader import DataLoader
from backend.app.geospatial.shoreline import ShorelineAnalysisEngine
from backend.app.risk.engine import RiskEngine, RiskConfig
from backend.app.risk.priority import PriorityEngine
from backend.app.warning.engine import EarlyWarningEngine, WarningThresholds
from backend.app.services.summary import SituationSummaryService

router = APIRouter(prefix="/api", tags=["COAST-AI Core Analytics"])


@router.get("/study-area", summary="Get Study Area Boundary and Monitored Coastal Zones")
def get_study_area():
    """Returns the study area GeoJSON FeatureCollection with monitoring zones."""
    try:
        return DataLoader.get_study_area()
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/timeline", summary="Get Available Historical Timelines")
def get_timeline():
    """Returns available historical observation periods."""
    try:
        periods = DataLoader.get_timeline()
        return {
            "historical_periods": periods,
            "baseline_default": periods[0] if periods else "2016",
            "latest_default": periods[-1] if periods else "2026",
            "count": len(periods)
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/coastline", summary="Get Coastline Geometry for a Specific Period or All Periods")
def get_coastline(period: Optional[str] = Query(None, description="Specific observation year (e.g. 2016, 2026)")):
    """Returns GeoJSON coastline vector for a specific period or all periods."""
    try:
        if period:
            feat = DataLoader.get_coastline_by_period(period)
            if not feat:
                raise HTTPException(status_code=404, detail=f"Coastline period '{period}' not found.")
            return feat
        return DataLoader.get_coastlines()
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/change", summary="Get Shoreline Change Detection and Cross-Shore Transects")
def get_shoreline_change(
    baseline: str = Query("2016", description="Baseline period"),
    comparison: str = Query("2026", description="Comparison period"),
    transects: int = Query(40, ge=10, le=100, description="Number of measurement transects")
):
    """Computes cross-shore movement, transect displacements (m), and zone erosion/accretion."""
    try:
        return ShorelineAnalysisEngine.compare_coastlines(
            baseline_period=baseline,
            comparison_period=comparison,
            num_transects=transects
        )
    except ValueError as ve:
        raise HTTPException(status_code=400, detail=str(ve))
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/risk", summary="Get Multi-Factor Risk Assessment")
def get_risk_assessment(
    baseline: str = Query("2016", description="Baseline period"),
    comparison: str = Query("2026", description="Comparison period"),
    zone_id: Optional[str] = Query(None, description="Optional specific zone ID (e.g., ZONE-A)")
):
    """Returns transparent multi-factor risk scores and classification for zones."""
    try:
        if zone_id:
            return RiskEngine.calculate_zone_risk(zone_id, baseline, comparison)
        all_risks = RiskEngine.calculate_all_zones_risk(baseline, comparison)
        return {
            "period": f"{baseline}-{comparison}",
            "zones_count": len(all_risks),
            "risk_assessment": all_risks
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/zones", summary="Get Ranked Priority Zones and Geometries")
def get_priority_zones(
    baseline: str = Query("2016", description="Baseline period"),
    comparison: str = Query("2026", description="Comparison period")
):
    """Returns dynamically ranked coastal monitoring zones."""
    try:
        ranking = PriorityEngine.rank_zones(baseline, comparison)
        return {
            "period": f"{baseline}-{comparison}",
            "priority_ranking": ranking
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/warnings", summary="Get Active Coastal Early Warnings")
def get_early_warnings(
    baseline: str = Query("2016", description="Baseline period"),
    comparison: str = Query("2026", description="Comparison period")
):
    """Evaluates early-warning rules against indicators and returns active alerts."""
    try:
        return EarlyWarningEngine.evaluate_warnings(baseline, comparison)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/summary", summary="Get Automatic Data-Backed Situation Summary")
def get_situation_summary(
    baseline: str = Query("2016", description="Baseline period"),
    comparison: str = Query("2026", description="Comparison period")
):
    """Generates structured decision-support situation report."""
    try:
        return SituationSummaryService.generate_summary(baseline, comparison)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
