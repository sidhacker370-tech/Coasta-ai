# COAST-AI

**AI-Powered Coastal Change Detection, Risk Mapping & Early-Warning Platform**

## Core Principle
`OBSERVE → COMPARE → DETECT → MEASURE → ASSESS RISK → WARN → PRIORITIZE`

## Project Overview
COAST-AI is an end-to-end geospatial intelligence and decision-support platform designed to monitor coastal erosion, analyze multi-temporal shoreline shifts over historical observation periods (2016–2026), calculate transparent multi-factor risk indices, and trigger data-backed early warnings for coastal resource prioritization.

## Project Structure
```
backend/
├── app/
│   ├── main.py                  # FastAPI Application & Dashboard Mount
│   ├── api/router.py            # Core REST & GeoJSON Analytics Endpoints
│   ├── geospatial/              # UTM/WGS84 Transformations & Shoreline Analysis
│   ├── risk/                    # Multi-factor Risk & Priority Ranking Engines
│   ├── warning/                 # Rule-based Early-Warning Engine
│   └── services/                # Data Loader & Decision Summary Services
├── tests/                       # Complete Pytest Test Suite (27 tests)
└── requirements.txt
frontend/
├── index.html                   # Interactive GIS Decision Dashboard
├── css/app.css                  # Modern Dark Theme Stylesheet
└── js/app.js                    # Leaflet & Chart.js Application Controller
ml/
├── preprocessing/               # Water Indices (MNDWI, NDWI, AWEI, NDVI) & Otsu
└── change_detection/            # Shoreline Extractor, DSAS Metrics, ML Forecasting
data/
└── demo/                        # Multi-Temporal Vector & Zone Factor Datasets
scripts/
└── generate_demo_dataset.py     # Reproducible Demo Data Generator
```

## Quick Start Guide

### 1. Activate Environment & Run Tests
```powershell
.\.venv\Scripts\pytest.exe
```

### 2. Launch the Platform Server
```powershell
.\.venv\Scripts\python.exe -m uvicorn backend.app.main:app --reload --port 8000
```

### 3. Open in Browser
- **Interactive Geospatial Dashboard**: [http://localhost:8000/dashboard](http://localhost:8000/dashboard)
- **Interactive Swagger API Documentation**: [http://localhost:8000/docs](http://localhost:8000/docs)
- **API Health Check**: [http://localhost:8000/](http://localhost:8000/)

## Core Endpoints
| Endpoint | Method | Description |
| :--- | :--- | :--- |
| `/api/study-area` | GET | Study area boundary and coastal monitoring zones (GeoJSON) |
| `/api/timeline` | GET | Available observation periods (2016 - 2026) |
| `/api/coastline` | GET | Multi-temporal extracted shoreline vectors (GeoJSON) |
| `/api/change` | GET | DSAS cross-shore transects and displacement metrics (GeoJSON) |
| `/api/risk` | GET | Multi-factor composite risk assessment per zone |
| `/api/zones` | GET | Dynamically ranked priority monitoring zones |
| `/api/warnings` | GET | Active early-warning alerts with trigger metrics |
| `/api/summary` | GET | Structured executive situation decision report |
| `/dashboard` | GET | Interactive Leaflet GIS decision-support web application |
