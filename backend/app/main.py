"""
COAST-AI Backend Application Entry Point.
FastAPI geospatial intelligence and decision-support service.
"""

import os
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse
from backend.app.api.router import router as api_router

app = FastAPI(
    title="COAST-AI Geospatial Intelligence API",
    description="AI-Powered Coastal Change Detection, Risk Mapping & Early-Warning Platform",
    version="1.0.0"
)

# Enable CORS for local development and frontend integration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include Core Analytics API Router
app.include_router(api_router)

# Mount Frontend Static Assets
FRONTEND_DIR = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "..", "frontend"))
if os.path.exists(FRONTEND_DIR):
    css_dir = os.path.join(FRONTEND_DIR, "css")
    js_dir = os.path.join(FRONTEND_DIR, "js")
    if os.path.exists(css_dir):
        app.mount("/css", StaticFiles(directory=css_dir), name="css")
    if os.path.exists(js_dir):
        app.mount("/js", StaticFiles(directory=js_dir), name="js")

    @app.get("/app", include_in_schema=False)
    @app.get("/dashboard", include_in_schema=False)
    def serve_dashboard():
        return FileResponse(os.path.join(FRONTEND_DIR, "index.html"))


@app.get("/", tags=["Health"])
def root():
    return {
        "status": "healthy",
        "system": "COAST-AI Backend",
        "version": "1.0.0",
        "docs": "/docs",
        "dashboard": "/dashboard",
        "endpoints": [
            "/api/study-area",
            "/api/timeline",
            "/api/coastline",
            "/api/change",
            "/api/risk",
            "/api/zones",
            "/api/warnings",
            "/api/summary"
        ]
    }


if __name__ == "__main__":
    import uvicorn
    uvicorn.run("backend.app.main:app", host="0.0.0.0", port=8000, reload=True)

