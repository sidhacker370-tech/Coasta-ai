"""
Multi-spectral satellite spectral index computation for coastal Earth observation.
Supports MNDWI, NDWI, AWEI (nsh/sh), and NDVI.
"""

from typing import Union
import numpy as np


class WaterIndexEngine:
    """
    Computes standard remote sensing spectral indices from optical satellite bands
    (Sentinel-2 MSI / Landsat-8/9 OLI).
    """

    @staticmethod
    def calculate_mndwi(green: np.ndarray, swir: np.ndarray, eps: float = 1e-7) -> np.ndarray:
        """
        Modified Normalized Difference Water Index (Xu, 2006).
        MNDWI = (Green - SWIR) / (Green + SWIR)
        Superior for water extraction in coastal zones with built-up noise.
        """
        green_f = green.astype(np.float64)
        swir_f = swir.astype(np.float64)
        denom = green_f + swir_f
        denom[denom == 0] = eps
        mndwi = (green_f - swir_f) / denom
        return np.clip(mndwi, -1.0, 1.0)

    @staticmethod
    def calculate_ndwi(green: np.ndarray, nir: np.ndarray, eps: float = 1e-7) -> np.ndarray:
        """
        Normalized Difference Water Index (McFeeters, 1996).
        NDWI = (Green - NIR) / (Green + NIR)
        """
        green_f = green.astype(np.float64)
        nir_f = nir.astype(np.float64)
        denom = green_f + nir_f
        denom[denom == 0] = eps
        ndwi = (green_f - nir_f) / denom
        return np.clip(ndwi, -1.0, 1.0)

    @staticmethod
    def calculate_awei_nsh(
        green: np.ndarray,
        nir: np.ndarray,
        swir1: np.ndarray,
        swir2: np.ndarray
    ) -> np.ndarray:
        """
        Automated Water Extraction Index for non-shadow conditions (Feyisa et al., 2014).
        AWEI_nsh = 4 * (Green - SWIR1) - (0.25 * NIR + 2.75 * SWIR2)
        """
        g = green.astype(np.float64)
        n = nir.astype(np.float64)
        s1 = swir1.astype(np.float64)
        s2 = swir2.astype(np.float64)
        return 4.0 * (g - s1) - (0.25 * n + 2.75 * s2)

    @staticmethod
    def calculate_ndvi(nir: np.ndarray, red: np.ndarray, eps: float = 1e-7) -> np.ndarray:
        """
        Normalized Difference Vegetation Index for coastal buffer vegetation & mangrove monitoring.
        NDVI = (NIR - Red) / (NIR + Red)
        """
        nir_f = nir.astype(np.float64)
        red_f = red.astype(np.float64)
        denom = nir_f + red_f
        denom[denom == 0] = eps
        ndvi = (nir_f - red_f) / denom
        return np.clip(ndvi, -1.0, 1.0)
