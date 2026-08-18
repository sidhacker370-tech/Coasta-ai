"""
Shoreline Change Detection & Transect Analysis Engine.
Computes cross-shore movement, transect displacements (m), annual change rates (m/yr),
and zone-level erosion/accretion classification.
"""

from typing import Dict, Any, List, Optional
import numpy as np
from shapely.geometry import LineString, Point, Polygon, shape, mapping
from shapely.ops import nearest_points

from backend.app.geospatial.crs import (
    transform_to_projected,
    transform_to_geographic,
    calculate_distance_meters
)
from backend.app.services.data_loader import DataLoader


class ShorelineAnalysisEngine:
    @staticmethod
    def compare_coastlines(
        baseline_period: str = "2016",
        comparison_period: str = "2026",
        num_transects: int = 40
    ) -> Dict[str, Any]:
        """
        Compares two historical coastlines and generates transect-based cross-shore change metrics.
        """
        base_feat = DataLoader.get_coastline_by_period(baseline_period)
        comp_feat = DataLoader.get_coastline_by_period(comparison_period)

        if not base_feat or not comp_feat:
            raise ValueError(f"One or both periods ({baseline_period}, {comparison_period}) not found.")

        base_geom_deg = shape(base_feat["geometry"])
        comp_geom_deg = shape(comp_geom_deg := comp_feat["geometry"])

        # Transform to projected CRS (meters)
        base_geom_m = transform_to_projected(base_geom_deg)
        comp_geom_m = transform_to_projected(comp_geom_deg)

        base_length_m = base_geom_m.length
        years_diff = max(1, int(comparison_period) - int(baseline_period))

        study_area = DataLoader.get_study_area()
        zones = study_area.get("features", [])

        transect_features = []
        zone_metrics: Dict[str, Dict[str, Any]] = {
            z["properties"]["zone_id"]: {
                "zone_id": z["properties"]["zone_id"],
                "zone_name": z["properties"]["zone_name"],
                "transect_count": 0,
                "displacements_m": [],
                "net_change_m": 0.0,
                "annual_rate_m_yr": 0.0,
                "max_erosion_m": 0.0,
                "max_accretion_m": 0.0,
                "status": "STABLE"
            }
            for z in zones
        }

        # Generate sample points along baseline
        distances = np.linspace(0, base_length_m, num_transects)

        for idx, dist in enumerate(distances):
            pt_base_m = base_geom_m.interpolate(dist)
            
            # Approximate normal tangent vector along coast
            delta = 10.0  # 10m forward/backward
            pt_prev = base_geom_m.interpolate(max(0, dist - delta))
            pt_next = base_geom_m.interpolate(min(base_length_m, dist + delta))
            
            dx = pt_next.x - pt_prev.x
            dy = pt_next.y - pt_prev.y
            norm_len = (dx**2 + dy**2)**0.5
            if norm_len == 0:
                continue

            # Unit normal pointing inland (North-West)
            # Coast trajectory is roughly SW -> NE (+dx, +dy)
            # Inward normal = (-dy/L, +dx/L)
            nx = -dy / norm_len
            ny = dx / norm_len

            # Find closest point on comparison coastline
            nearest_base_m, nearest_comp_m = nearest_points(pt_base_m, comp_geom_m)
            
            # Vector from baseline to comparison
            disp_vec_x = nearest_comp_m.x - pt_base_m.x
            disp_vec_y = nearest_comp_m.y - pt_base_m.y
            
            # Project displacement onto inland normal (positive = moved inland/eroded, negative = moved seaward/accreted)
            # We standardize: negative displacement = erosion (shoreline retreated inland), positive = accretion
            inland_projection = disp_vec_x * nx + disp_vec_y * ny
            displacement_m = -round(float(inland_projection), 2)  # Negative means erosion
            annual_rate = round(displacement_m / years_diff, 2)

            # Convert transect endpoints back to geographic degrees for GeoJSON output
            p_base_deg = transform_to_geographic(pt_base_m)
            p_comp_deg = transform_to_geographic(nearest_comp_m)

            # Determine which monitoring zone contains this point
            matched_zone_id = "ZONE-B"  # fallback
            for z in zones:
                z_poly = shape(z["geometry"])
                if z_poly.contains(p_base_deg) or z_poly.distance(p_base_deg) < 0.01:
                    matched_zone_id = z["properties"]["zone_id"]
                    break

            transect_feature = {
                "type": "Feature",
                "id": f"TRANSECT-{idx+1}",
                "properties": {
                    "transect_id": f"T-{idx+1:03d}",
                    "zone_id": matched_zone_id,
                    "distance_along_coast_m": round(float(dist), 1),
                    "displacement_m": displacement_m,
                    "annual_rate_m_yr": annual_rate,
                    "classification": "EROSION" if displacement_m < -2.0 else ("ACCRETION" if displacement_m > 2.0 else "STABLE"),
                    "baseline_year": baseline_period,
                    "comparison_year": comparison_period
                },
                "geometry": {
                    "type": "LineString",
                    "coordinates": [
                        [round(p_base_deg.x, 6), round(p_base_deg.y, 6)],
                        [round(p_comp_deg.x, 6), round(p_comp_deg.y, 6)]
                    ]
                }
            }
            transect_features.append(transect_feature)

            if matched_zone_id in zone_metrics:
                zm = zone_metrics[matched_zone_id]
                zm["transect_count"] += 1
                zm["displacements_m"].append(displacement_m)

        # Aggregate zone metrics
        all_displacements = []
        for zid, zm in zone_metrics.items():
            disps = zm.pop("displacements_m")
            if disps:
                zm["net_change_m"] = round(float(np.mean(disps)), 2)
                zm["annual_rate_m_yr"] = round(float(np.mean(disps)) / years_diff, 2)
                zm["max_erosion_m"] = round(float(min(disps)), 2)
                zm["max_accretion_m"] = round(float(max(disps)), 2)
                all_displacements.extend(disps)
            else:
                # Fallback to pre-calibrated baseline factors if no transect intersected
                zf = DataLoader.get_zone_factors().get("monitoring_zones", {}).get(zid, {})
                zm["net_change_m"] = zf.get("net_shoreline_shift_m", 0.0)
                zm["annual_rate_m_yr"] = zf.get("shoreline_change_rate_m_per_yr", 0.0)
                zm["max_erosion_m"] = zm["net_change_m"]
                zm["max_accretion_m"] = 0.0
                all_displacements.append(zm["net_change_m"])

            if zm["net_change_m"] < -5.0:
                zm["status"] = "HIGH EROSION"
            elif zm["net_change_m"] < -2.0:
                zm["status"] = "MODERATE EROSION"
            elif zm["net_change_m"] > 2.0:
                zm["status"] = "ACCRETION"
            else:
                zm["status"] = "STABLE"

        total_mean_disp = round(float(np.mean(all_displacements)), 2) if all_displacements else 0.0

        return {
            "type": "FeatureCollection",
            "name": f"Shoreline Change Analysis ({baseline_period} vs {comparison_period})",
            "metadata": {
                "dataset_classification": "DEMONSTRATION DATASET",
                "baseline_period": baseline_period,
                "comparison_period": comparison_period,
                "time_span_years": years_diff,
                "total_transects": len(transect_features),
                "mean_shoreline_shift_m": total_mean_disp,
                "overall_status": "NET EROSION" if total_mean_disp < -2.0 else "NET ACCRETION"
            },
            "features": transect_features,
            "zone_summary": list(zone_metrics.values())
        }
