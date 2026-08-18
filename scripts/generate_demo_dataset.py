"""
COAST-AI Demonstration Dataset Generator for Puri Coastal Study Area
Generates realistic multi-temporal coastal vector layers for:
- Study area boundary and monitoring zones
- Multi-temporal historical shorelines (2016 - 2026)
- Zone-specific environmental and change parameters

All data is strictly labeled: DEMONSTRATION DATASET
"""

import json
import os
import numpy as np

OUTPUT_DIR = os.path.join(os.path.dirname(__file__), "..", "data", "demo")
os.makedirs(OUTPUT_DIR, exist_ok=True)

# 1. STUDY AREA & ZONES DEFINITION (Puri, Odisha, India)
# Center: ~19.80N, 85.83E
study_area_metadata = {
    "type": "FeatureCollection",
    "name": "Puri Coastal Study Area",
    "crs": {"type": "name", "properties": {"name": "urn:ogc:def:crs:OGC:1.3:CRS84"}},
    "metadata": {
        "study_area_id": "puri_odisha_in",
        "title": "Puri Coastal Monitoring Sector",
        "region": "Odisha, Bay of Bengal, India",
        "dataset_classification": "DEMONSTRATION DATASET",
        "reference_crs": "EPSG:4326",
        "projected_crs": "EPSG:32645 (UTM Zone 45N)",
        "bounding_box": [85.7700, 19.7500, 85.9500, 19.8600],
        "center": [19.8050, 85.8450],
        "default_zoom": 12,
        "historical_periods": ["2016", "2018", "2020", "2022", "2024", "2026"],
        "baseline_period": "2016",
        "latest_period": "2026",
        "num_monitoring_zones": 5
    },
    "features": [
        {
            "type": "Feature",
            "id": "ZONE-A",
            "properties": {
                "zone_id": "ZONE-A",
                "zone_name": "Balukhand Sanctuary Beach",
                "coastal_type": "Sandy Dune & Casuarina Forest",
                "vulnerability_profile": "High Wave Exposure & Cyclone Scour",
                "critical_infrastructure": "Eco-Retreat & Coastal Highway",
                "transect_count": 24,
                "length_km": 4.8
            },
            "geometry": {
                "type": "Polygon",
                "coordinates": [[
                    [85.8800, 19.8250],
                    [85.9350, 19.8550],
                    [85.9450, 19.8350],
                    [85.8900, 19.8080],
                    [85.8800, 19.8250]
                ]]
            }
        },
        {
            "type": "Feature",
            "id": "ZONE-B",
            "properties": {
                "zone_id": "ZONE-B",
                "zone_name": "Puri Main / Golden Beach",
                "coastal_type": "High-Density Urban Beach",
                "vulnerability_profile": "Tourism Pressure & Seasonal Beach Narrowing",
                "critical_infrastructure": "Marine Drive Promenade & Hotels",
                "transect_count": 20,
                "length_km": 3.6
            },
            "geometry": {
                "type": "Polygon",
                "coordinates": [[
                    [85.8300, 19.7950],
                    [85.8800, 19.8250],
                    [85.8900, 19.8080],
                    [85.8400, 19.7800],
                    [85.8300, 19.7950]
                ]]
            }
        },
        {
            "type": "Feature",
            "id": "ZONE-C",
            "properties": {
                "zone_id": "ZONE-C",
                "zone_name": "Swargadwar & Lighthouse Sector",
                "coastal_type": "Dense Settlement & Seawall Fringe",
                "vulnerability_profile": "Active High Erosion & Structural Undermining",
                "critical_infrastructure": "Lighthouse & Heritage Settlements",
                "transect_count": 18,
                "length_km": 2.9
            },
            "geometry": {
                "type": "Polygon",
                "coordinates": [[
                    [85.8000, 19.7800],
                    [85.8300, 19.7950],
                    [85.8400, 19.7800],
                    [85.8100, 19.7630],
                    [85.8000, 19.7800]
                ]]
            }
        },
        {
            "type": "Feature",
            "id": "ZONE-D",
            "properties": {
                "zone_id": "ZONE-D",
                "zone_name": "Sipasarubali Mangrove & Estuary",
                "coastal_type": "Tidal Inlet & Brackish Wetland",
                "vulnerability_profile": "Tidal Inundation & Channel Migration",
                "critical_infrastructure": "Aquaculture & Fishing Hamlet",
                "transect_count": 22,
                "length_km": 4.1
            },
            "geometry": {
                "type": "Polygon",
                "coordinates": [[
                    [85.7650, 19.7600],
                    [85.8000, 19.7800],
                    [85.8100, 19.7630],
                    [85.7750, 19.7420],
                    [85.7650, 19.7600]
                ]]
            }
        },
        {
            "type": "Feature",
            "id": "ZONE-E",
            "properties": {
                "zone_id": "ZONE-E",
                "zone_name": "Mangala River Mouth & Barrier Spit",
                "coastal_type": "Dynamic Sand Spit & Barrier Bar",
                "vulnerability_profile": "Sediment Accretion & Breaching Cycles",
                "critical_infrastructure": "Fisheries Landing & Buffer Lagoon",
                "transect_count": 16,
                "length_km": 3.2
            },
            "geometry": {
                "type": "Polygon",
                "coordinates": [[
                    [85.8450, 19.8050],
                    [85.8750, 19.8200],
                    [85.8850, 19.8020],
                    [85.8550, 19.7870],
                    [85.8450, 19.8050]
                ]]
            }
        }
    ]
}

# 2. GENERATE HISTORICAL COASTLINES (2016 -> 2026)
# Baseline coastline coordinates along Puri coast (SW to NE trajectory)
base_lons = np.linspace(85.770, 85.940, 75)
# General SW to NE coastline trend with coastal curvature
base_lats = 19.750 + (base_lons - 85.770) * 0.58 + np.sin((base_lons - 85.770) * 45) * 0.005

periods = ["2016", "2018", "2020", "2022", "2024", "2026"]

# Define realistic shift patterns per period:
# E.g., Zone C & Zone A experience landward retreat (erosion - negative lat/lon shift perpendicular to coast)
# Zone E experiences spit accretion
# 2019 Cyclone Fani shock modeled in 2020 timestep
coastlines_collection = {
    "type": "FeatureCollection",
    "name": "Puri Historical Coastline Vectors",
    "crs": {"type": "name", "properties": {"name": "urn:ogc:def:crs:OGC:1.3:CRS84"}},
    "metadata": {
        "dataset_classification": "DEMONSTRATION DATASET",
        "description": "Multi-temporal extracted shorelines from high-resolution satellite Earth observation",
        "units": "WGS84 Degrees (Coordinates), Meters (Derived Changes)"
    },
    "features": []
}

# Perpendicular unit vector to coastline (approx facing NW inland vs SE ocean)
# Coastline direction vector ~ [dx, dy] = [0.170, 0.100] -> length ~ 0.197
# Inward normal ~ [-0.100, 0.170] / 0.197 = [-0.507, 0.863]
norm_x = -0.507 * 0.0001
norm_y = 0.863 * 0.0001

for p_idx, period in enumerate(periods):
    year = int(period)
    coords = []
    
    for i, (lon, lat) in enumerate(zip(base_lons, base_lats)):
        # Calculate zone-based dynamic movement over time
        # ZONE A: Balukhand (lon 85.88 - 85.94) -> steady erosion + Fani surge in 2020
        if lon > 85.88:
            rate = 3.2  # meters/year inland
            fani_shock = 8.5 if year >= 2020 else 0.0
            shift_m = (year - 2016) * rate + fani_shock
        # ZONE B: Main Beach (lon 85.83 - 85.88) -> moderate seasonal fluctuations
        elif lon > 85.83:
            rate = 1.4
            fani_shock = 3.0 if year >= 2020 else 0.0
            shift_m = (year - 2016) * rate + fani_shock
        # ZONE C: Swargadwar (lon 85.80 - 85.83) -> severe persistent erosion hotspot
        elif lon > 85.80:
            rate = 4.8  # severe erosion
            fani_shock = 12.0 if year >= 2020 else 0.0
            shift_m = (year - 2016) * rate + fani_shock
        # ZONE D: Sipasarubali (lon 85.77 - 85.80) -> moderate erosion
        else:
            rate = 2.1
            fani_shock = 4.0 if year >= 2020 else 0.0
            shift_m = (year - 2016) * rate + fani_shock
        
        # Inward landward shift (Erosion moves shoreline inland: +norm_x, +norm_y)
        # Add small high-frequency realistic spatial noise
        spatial_noise = np.sin(i * 1.5 + p_idx) * 0.8
        total_shift_m = shift_m + spatial_noise
        
        pt_lon = float(lon + total_shift_m * norm_x)
        pt_lat = float(lat + total_shift_m * norm_y)
        coords.append([round(pt_lon, 6), round(pt_lat, 6)])
    
    coastlines_collection["features"].append({
        "type": "Feature",
        "id": f"SHORELINE-{period}",
        "properties": {
            "period": period,
            "year": year,
            "observation_date": f"{year}-03-15",
            "sensor": "Sentinel-2 MSI / Landsat-8 OLI",
            "extraction_method": "Modified Normalized Difference Water Index (MNDWI) + Otsu Thresholding",
            "quality_score": 0.96 if year >= 2020 else 0.92,
            "tidal_stage": "Mean High Water Spring (MHWS) Corrected",
            "dataset_classification": "DEMONSTRATION DATASET"
        },
        "geometry": {
            "type": "LineString",
            "coordinates": coords
        }
    })

# 3. ZONE-LEVEL ENVIRONMENTAL & RISK FACTOR DATA
zone_factors = {
    "dataset_classification": "DEMONSTRATION DATASET",
    "baseline_year": 2016,
    "monitoring_zones": {
        "ZONE-A": {
            "zone_id": "ZONE-A",
            "zone_name": "Balukhand Sanctuary Beach",
            "shoreline_change_rate_m_per_yr": -3.85,
            "net_shoreline_shift_m": -38.5,
            "vegetation_loss_pct": 22.4,
            "land_water_transition_ha": 14.8,
            "historical_erosion_trend": 0.82,
            "wave_energy_exposure": "High",
            "coastal_slope_deg": 3.2
        },
        "ZONE-B": {
            "zone_id": "ZONE-B",
            "zone_name": "Puri Main / Golden Beach",
            "shoreline_change_rate_m_per_yr": -1.65,
            "net_shoreline_shift_m": -16.5,
            "vegetation_loss_pct": 8.1,
            "land_water_transition_ha": 5.2,
            "historical_erosion_trend": 0.44,
            "wave_energy_exposure": "Moderate",
            "coastal_slope_deg": 4.5
        },
        "ZONE-C": {
            "zone_id": "ZONE-C",
            "zone_name": "Swargadwar & Lighthouse Sector",
            "shoreline_change_rate_m_per_yr": -5.60,
            "net_shoreline_shift_m": -56.0,
            "vegetation_loss_pct": 31.5,
            "land_water_transition_ha": 21.4,
            "historical_erosion_trend": 0.94,
            "wave_energy_exposure": "Very High",
            "coastal_slope_deg": 2.8
        },
        "ZONE-D": {
            "zone_id": "ZONE-D",
            "zone_name": "Sipasarubali Mangrove & Estuary",
            "shoreline_change_rate_m_per_yr": -2.45,
            "net_shoreline_shift_m": -24.5,
            "vegetation_loss_pct": 14.2,
            "land_water_transition_ha": 9.6,
            "historical_erosion_trend": 0.58,
            "wave_energy_exposure": "Moderate",
            "coastal_slope_deg": 3.8
        },
        "ZONE-E": {
            "zone_id": "ZONE-E",
            "zone_name": "Mangala River Mouth & Barrier Spit",
            "shoreline_change_rate_m_per_yr": +1.80,
            "net_shoreline_shift_m": +18.0,
            "vegetation_loss_pct": 4.5,
            "land_water_transition_ha": 3.1,
            "historical_erosion_trend": 0.25,
            "wave_energy_exposure": "Variable / Sheltered",
            "coastal_slope_deg": 5.1
        }
    }
}

# Write files
with open(os.path.join(OUTPUT_DIR, "study_area.geojson"), "w", encoding="utf-8") as f:
    json.dump(study_area_metadata, f, indent=2)

with open(os.path.join(OUTPUT_DIR, "coastlines.geojson"), "w", encoding="utf-8") as f:
    json.dump(coastlines_collection, f, indent=2)

with open(os.path.join(OUTPUT_DIR, "zone_factors.json"), "w", encoding="utf-8") as f:
    json.dump(zone_factors, f, indent=2)

print("Demo dataset generated successfully in data/demo/")
