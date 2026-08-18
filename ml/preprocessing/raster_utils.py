"""
Geospatial Raster Preprocessing Utilities for Earth Observation Data.
Includes Otsu dynamic thresholding, min-max normalization, cloud mask heuristics,
and synthetic raster scene generation for testing.
"""

from typing import Tuple, Dict, Any, Optional
import numpy as np


class RasterUtils:
    """Utilities for processing optical satellite raster grids."""

    @staticmethod
    def normalize_band(band: np.ndarray) -> np.ndarray:
        """Normalizes a raw band array to [0.0, 1.0] range."""
        b_min = np.nanmin(band)
        b_max = np.nanmax(band)
        if b_max - b_min == 0:
            return np.zeros_like(band, dtype=np.float64)
        return (band - b_min) / (b_max - b_min)

    @staticmethod
    def otsu_threshold(image: np.ndarray, num_bins: int = 256) -> float:
        """
        Calculates optimal threshold using Otsu's method (Otsu, 1979)
        to separate bimodal distributions (e.g. water vs land in MNDWI).
        """
        valid_pixels = image[~np.isnan(image)]
        if len(valid_pixels) == 0:
            return 0.0

        hist, bin_edges = np.histogram(valid_pixels, bins=num_bins, density=True)
        bin_centers = (bin_edges[:-1] + bin_edges[1:]) / 2.0

        weight1 = np.cumsum(hist)
        weight2 = np.cumsum(hist[::-1])[::-1]

        mean1 = np.cumsum(hist * bin_centers) / np.maximum(weight1, 1e-10)
        mean2 = (np.cumsum((hist * bin_centers)[::-1]) / np.maximum(weight2[::-1], 1e-10))[::-1]

        variance = weight1[:-1] * weight2[1:] * (mean1[:-1] - mean2[1:]) ** 2
        idx_max = np.argmax(variance)
        return float(bin_centers[idx_max])

    @staticmethod
    def create_water_mask(
        index_grid: np.ndarray,
        threshold: Optional[float] = None,
        use_otsu: bool = True
    ) -> Tuple[np.ndarray, float]:
        """
        Generates a binary water mask (1 = water, 0 = land/vegetation).
        If threshold is not provided, Otsu dynamic thresholding is applied.
        """
        if threshold is None:
            if use_otsu:
                threshold = RasterUtils.otsu_threshold(index_grid)
            else:
                threshold = 0.0  # Standard MNDWI default zero-cutoff

        water_mask = (index_grid > threshold).astype(np.uint8)
        return water_mask, threshold

    @staticmethod
    def generate_synthetic_coastal_scene(
        height: int = 120,
        width: int = 180,
        shoreline_col: int = 90,
        noise_level: float = 0.05
    ) -> Dict[str, np.ndarray]:
        """
        Generates synthetic multi-band optical Earth observation data
        (Green, NIR, SWIR1, Red) with a realistic land/sea interface for unit tests & demo.
        """
        x = np.arange(width)
        y = np.arange(height)
        xx, yy = np.meshgrid(x, y)

        # Non-linear shoreline curvature
        shore_curve = shoreline_col + np.sin(yy / 12.0) * 8.0
        is_water = xx > shore_curve

        np.random.seed(42)
        noise = np.random.normal(0, noise_level, (height, width))

        # Optical band spectral characteristics:
        # Water: High Green, Very Low NIR, Very Low SWIR
        # Land: Moderate Green, High NIR (vegetation), Moderate SWIR
        green = np.where(is_water, 0.45, 0.25) + noise
        nir = np.where(is_water, 0.05, 0.65) + noise
        swir1 = np.where(is_water, 0.02, 0.40) + noise
        red = np.where(is_water, 0.15, 0.35) + noise

        return {
            "green": np.clip(green, 0.0, 1.0),
            "nir": np.clip(nir, 0.0, 1.0),
            "swir1": np.clip(swir1, 0.0, 1.0),
            "red": np.clip(red, 0.0, 1.0),
            "is_water_groundtruth": is_water.astype(np.uint8)
        }
