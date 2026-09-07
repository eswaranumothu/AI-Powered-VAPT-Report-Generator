from pathlib import Path

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles

# IMPORTANT:
# Importing Base from base_model also imports/registers
# all SQLAlchemy models and their relationships.
from app.database.base_model import Base

from app.api.v1.auth import router as auth_router
from app.api.v1.users import router as users_router
from app.api.v1.projects import router as project_router
from app.api.v1.master_vulnerabilities import (
    router as master_vulnerability_router,
)
from app.api.v1.project_findings import (
    router as project_finding_router,
)
from app.api.v1.finding_evidence import (
    router as finding_evidence_router,
)
from app.api.v1.ai import (
    router as ai_router,
)
from app.api.v1.report import (
    router as report_router,
)

app = FastAPI(
    title="VAPT Report Generator API"
)

# --------------------------------------------------
# CORS
# --------------------------------------------------

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://127.0.0.1:5173",
    ],
    allow_origin_regex=r"^https://.*\.trycloudflare\.com$",
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# --------------------------------------------------
# Uploads
# --------------------------------------------------

PROJECT_ROOT = Path(__file__).resolve().parents[2]

UPLOADS_FOLDER = PROJECT_ROOT / "uploads"

UPLOADS_FOLDER.mkdir(
    parents=True,
    exist_ok=True,
)

app.mount(
    "/uploads",
    StaticFiles(directory=str(UPLOADS_FOLDER)),
    name="uploads",
)

# --------------------------------------------------
# Routers
# --------------------------------------------------

app.include_router(auth_router)
app.include_router(users_router)
app.include_router(project_router)
app.include_router(master_vulnerability_router)
app.include_router(project_finding_router)
app.include_router(finding_evidence_router)
app.include_router(ai_router)
app.include_router(report_router)


# --------------------------------------------------
# Root
# --------------------------------------------------

@app.get("/")
def root():
    return {
        "message": "VAPT Report Generator API"
    }