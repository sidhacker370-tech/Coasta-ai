"""
Unit and Integration Tests for COAST-AI Machine Learning & Processing Pipeline.
"""

import numpy as np
import pytest

from ml.preprocessing.water_indices import WaterIndexEngine
from ml.preprocessing.raster_utils import RasterUtils
from ml.change_detection.shoreline_extractor import ShorelineExtractor
from ml.change_detection.transect_metrics import TransectMetricsEngine
from ml.change_detection.erosion_model import ShorelineErosionForecaster


def test_water_indices_computation():
    scene = RasterUtils.generate_synthetic_coastal_scene(height=60, width=80)
    green = scene["green"]
    nir = scene["nir"]
    swir = scene["swir1"]
    red = scene["red"]

    mndwi = WaterIndexEngine.calculate_mndwi(green, swir)
    assert mndwi.shape == (60, 80)
    assert np.all(mndwi >= -1.0) and np.all(mndwi <= 1.0)

    ndwi = WaterIndexEngine.calculate_ndwi(green, nir)
    assert ndwi.shape == (60, 80)

    ndvi = WaterIndexEngine.calculate_ndvi(nir, red)
    assert ndvi.shape == (60, 80)

    awei = WaterIndexEngine.calculate_awei_nsh(green, nir, swir, swir)
    assert awei.shape == (60, 80)


def test_otsu_threshold_and_water_mask():
    scene = RasterUtils.generate_synthetic_coastal_scene(height=50, width=70, shoreline_col=35)
    mndwi = WaterIndexEngine.calculate_mndwi(scene["green"], scene["swir1"])

    thresh = RasterUtils.otsu_threshold(mndwi)
    assert isinstance(thresh, float)

    mask, used_thresh = RasterUtils.create_water_mask(mndwi, use_otsu=True)
    assert mask.shape == (50, 70)
    # Check that mask has both land (0) and water (1)
    assert 0 in mask and 1 in mask


def test_shoreline_extractor_and_smoothing():
    # Synthetic water mask where columns > 25 are water (1)
    mask = np.zeros((40, 50), dtype=np.uint8)
    mask[:, 25:] = 1

    coords = ShorelineExtractor.extract_shoreline_from_mask(mask, pixel_size_meters=10.0)
    assert len(coords) == 40
    # Every extracted coordinate should have x = 250.0
    for x, y in coords:
        assert x == 245.0

    smoothed = ShorelineExtractor.smooth_shoreline_coordinates(coords, window_size=3)
    assert len(smoothed) == len(coords)

    # Tidal correction
    corrected = ShorelineExtractor.apply_tidal_correction(coords, observed_tide_m=1.2, datum_target_m=0.0)
    assert len(corrected) == len(coords)


def test_transect_dsas_metrics():
    # Simulated 10-year shoreline retreat
    years = [2016.0, 2018.0, 2020.0, 2022.0, 2024.0, 2026.0]
    # Shoreline moved landward by 30 meters over 10 years (rate = -3.0 m/yr)
    distances = [100.0, 94.0, 88.0, 82.0, 76.0, 70.0]

    nsm = TransectMetricsEngine.calculate_nsm(distances[0], distances[-1])
    assert nsm == -30.0

    epr = TransectMetricsEngine.calculate_epr(distances[0], distances[-1], years[0], years[-1])
    assert epr == -3.0

    lrr = TransectMetricsEngine.calculate_lrr(years, distances)
    assert lrr["lrr_m_per_year"] == -3.0
    assert lrr["r_squared"] > 0.99

    sce = TransectMetricsEngine.calculate_sce(distances)
    assert sce == 30.0

    summary = TransectMetricsEngine.summarize_transect_series("T-01", years, distances)
    assert summary["transect_id"] == "T-01"
    assert summary["classification"] == "Severe Erosion" or summary["classification"] == "Moderate Erosion"


def test_shoreline_erosion_forecaster():
    forecaster = ShorelineErosionForecaster(model_type="ridge")
    years = [2016.0, 2018.0, 2020.0, 2022.0, 2024.0, 2026.0]
    distances = [100.0, 95.0, 90.0, 85.0, 80.0, 75.0]

    res = forecaster.train_and_forecast_transect(years, distances, future_years=[2030.0, 2035.0])
    assert len(res["predictions"]) == 2
    # In 2030 (4 years after 2026), predicted position should be ~65m
    assert res["predictions"][0]["forecast_year"] == 2030
    assert res["predictions"][0]["predicted_position_m"] < 75.0
    assert "lower_bound_m" in res["predictions"][0]
    assert "upper_bound_m" in res["predictions"][0]

    zone_fc = ShorelineErosionForecaster.forecast_zone_summary(
        zone_id="ZONE-C",
        historical_change_rate=-5.6,
        vegetation_loss_pct=30.0,
        horizon_years=10
    )
    assert zone_fc["zone_id"] == "ZONE-C"
    assert zone_fc["projected_net_retreat_m"] < -50.0
    assert zone_fc["severity_classification"] == "High Risk"
