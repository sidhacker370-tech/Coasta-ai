"""
Shoreline Extraction Engine from Multi-Spectral Satellite Data.
Segments water masks and extracts vectorized sub-pixel or vector boundary shorelines.
"""

from typing import List, Tuple, Dict, Any, Optional
import numpy as np
from shapely.geometry import LineString, MultiLineString, mapping


class ShorelineExtractor:
    """Extracts vector coastline boundaries from binary water classification grids."""

    @staticmethod
    def extract_shoreline_from_mask(
        water_mask: np.ndarray,
        pixel_size_meters: float = 10.0,
        origin_x: float = 0.0,
        origin_y: float = 0.0,
        min_length_pixels: int = 10
    ) -> List[Tuple[float, float]]:
        """
        Extracts the 1D shoreline interface line from a 2D water mask grid.
        For each row (along-shore y-slice), finds the column index where water transition occurs.
        """
        rows, cols = water_mask.shape
        shoreline_coords: List[Tuple[float, float]] = []

        for r in range(rows):
            row_data = water_mask[r, :]
            # Find boundary where mask transitions from 0 (land) to 1 (water)
            diffs = np.diff(row_data)
            transitions = np.where(diffs != 0)[0]
            if len(transitions) > 0:
                # Use primary interface transition
                c = transitions[0] + 0.5
                x_geo = origin_x + c * pixel_size_meters
                y_geo = origin_y + r * pixel_size_meters
                shoreline_coords.append((float(x_geo), float(y_geo)))

        return shoreline_coords

    @staticmethod
    def smooth_shoreline_coordinates(
        coords: List[Tuple[float, float]],
        window_size: int = 5
    ) -> List[Tuple[float, float]]:
        """
        Applies a moving average filter to smooth high-frequency extraction noise
        along the shoreline vector.
        """
        if len(coords) < window_size:
            return coords

        arr = np.array(coords)
        smoothed_x = np.convolve(arr[:, 0], np.ones(window_size) / window_size, mode='same')
        smoothed_y = np.convolve(arr[:, 1], np.ones(window_size) / window_size, mode='same')

        # Preserve endpoints
        smoothed_x[0] = arr[0, 0]
        smoothed_x[-1] = arr[-1, 0]
        smoothed_y[0] = arr[0, 1]
        smoothed_y[-1] = arr[-1, 1]

        return [(float(x), float(y)) for x, y in zip(smoothed_x, smoothed_y)]

    @staticmethod
    def apply_tidal_correction(
        coords: List[Tuple[float, float]],
        observed_tide_m: float,
        datum_target_m: float = 0.0,
        beach_slope_deg: float = 4.0
    ) -> List[Tuple[float, float]]:
        """
        Corrects instantaneous satellite shoreline to a standardized tidal datum
        (e.g., Mean High Water Spring) using equilibrium beach slope:
        Horizontal correction = (Target Datum - Observed Tide) / tan(slope)
        """
        slope_rad = np.radians(max(0.5, beach_slope_deg))
        tide_diff = datum_target_m - observed_tide_m
        horiz_shift_m = tide_diff / np.tan(slope_rad)

        # Shift coordinates perpendicular to general shoreline direction
        if len(coords) < 2:
            return coords

        arr = np.array(coords)
        dx = arr[-1, 0] - arr[0, 0]
        dy = arr[-1, 1] - arr[0, 1]
        length = np.hypot(dx, dy)
        if length == 0:
            return coords

        # Inward normal
        nx = -dy / length
        ny = dx / length

        corrected = []
        for x, y in coords:
            cx = x + horiz_shift_m * nx
            cy = y + horiz_shift_m * ny
            corrected.append((float(cx), float(cy)))

        return corrected
