"""
Predictive Coastal Erosion & Future Shoreline Forecasting Engine.
Uses statistical trend extrapolation and scikit-learn regression models to project
future cross-shore retreat and zone risk over 5-year, 10-year, and 20-year horizons.
"""

from typing import List, Dict, Any, Tuple, Optional
import numpy as np
from sklearn.linear_model import Ridge, LinearRegression
from sklearn.ensemble import RandomForestRegressor


class ShorelineErosionForecaster:
    """
    Projects future cross-shore displacements along coastal transects
    using historical observations and machine learning models.
    """

    def __init__(self, model_type: str = "ridge"):
        self.model_type = model_type
        if model_type == "rf":
            self.model = RandomForestRegressor(n_estimators=50, random_state=42)
        elif model_type == "ridge":
            self.model = Ridge(alpha=1.0)
        else:
            self.model = LinearRegression()

    def train_and_forecast_transect(
        self,
        historical_years: List[float],
        historical_distances_m: List[float],
        future_years: List[float] = [2028.0, 2030.0, 2035.0]
    ) -> Dict[str, Any]:
        """
        Trains model on historical transect positions and predicts positions
        at future target years with 95% projection bounds.
        """
        x_train = np.array(historical_years, dtype=np.float64).reshape(-1, 1)
        y_train = np.array(historical_distances_m, dtype=np.float64)

        if len(historical_years) < 2:
            return {
                "historical_years": historical_years,
                "historical_distances_m": historical_distances_m,
                "predictions": []
            }

        # Train regressor
        self.model.fit(x_train, y_train)

        # Compute empirical residual standard error for confidence cone
        y_pred_train = self.model.predict(x_train)
        residuals = y_train - y_pred_train
        std_err = float(np.std(residuals)) if len(residuals) > 1 else 1.5

        # Predict future years
        x_future = np.array(future_years, dtype=np.float64).reshape(-1, 1)
        y_future_pred = self.model.predict(x_future)

        predictions = []
        base_year = historical_years[-1]
        base_pos = historical_distances_m[-1]

        for yr, pred in zip(future_years, y_future_pred):
            years_ahead = yr - base_year
            # Growing uncertainty cone over time
            margin = 1.96 * std_err * np.sqrt(1 + (years_ahead / max(1.0, len(historical_years))))
            projected_shift = float(pred - base_pos)

            predictions.append({
                "forecast_year": int(yr),
                "predicted_position_m": round(float(pred), 2),
                "projected_shift_from_latest_m": round(projected_shift, 2),
                "lower_bound_m": round(float(pred - margin), 2),
                "upper_bound_m": round(float(pred + margin), 2),
                "expected_annual_rate_m_per_yr": round(float(projected_shift / max(0.1, years_ahead)), 3)
            })

        return {
            "model_type": self.model_type,
            "historical_baseline_year": int(historical_years[0]),
            "historical_latest_year": int(historical_years[-1]),
            "predictions": predictions
        }

    @staticmethod
    def forecast_zone_summary(
        zone_id: str,
        historical_change_rate: float,
        vegetation_loss_pct: float,
        horizon_years: int = 10
    ) -> Dict[str, Any]:
        """
        Fast heuristic/empirical forecast for a zone's cumulative retreat and vulnerability.
        """
        # Accelerate erosion slightly under high vegetation loss / climate forcing factor
        acceleration_factor = 1.0 + (vegetation_loss_pct / 100.0) * 0.25
        projected_retreat_m = historical_change_rate * horizon_years * acceleration_factor

        severity = "High Risk" if projected_retreat_m < -30 else (
            "Moderate Risk" if projected_retreat_m < -15 else "Low Risk / Stable"
        )

        return {
            "zone_id": zone_id,
            "forecast_horizon_years": horizon_years,
            "projected_net_retreat_m": round(float(projected_retreat_m), 2),
            "projected_annual_rate_m_per_yr": round(float(projected_retreat_m / horizon_years), 2),
            "severity_classification": severity,
            "recommended_buffer_setback_m": round(max(50.0, abs(projected_retreat_m) * 2.0), 1)
        }
