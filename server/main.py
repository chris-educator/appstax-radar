"""FastAPI backend for AppStax Radar."""

from __future__ import annotations

import sys
from pathlib import Path
from typing import Annotated

from dotenv import load_dotenv
from fastapi import Depends, FastAPI, Header, HTTPException, Query
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import FileResponse
from fastapi.staticfiles import StaticFiles
from pydantic import BaseModel, Field

ROOT = Path(__file__).resolve().parent.parent
sys.path.insert(0, str(ROOT))
FRONTEND_DIST = ROOT / "client" / "dist"

load_dotenv(ROOT / ".env")

from src import db  # noqa: E402
from src.config import (  # noqa: E402
    GEMINI_MODEL,
    GOOGLE_API_KEY,
    RADAR_ADMIN_SECRET,
    RADAR_CRON_SECRET,
    RADAR_DATA_PATH,
)
from src.scout import run_scout  # noqa: E402
from src.summarize import gemini_configured  # noqa: E402

app = FastAPI(title="AppStax Radar API")

SERVE_FRONTEND = (FRONTEND_DIST / "index.html").is_file()

_NO_CACHE_FILES = frozenset({"sw.js"})

def _pwa_file_response(path: Path) -> FileResponse:
    headers: dict[str, str] = {}
    if path.name in _NO_CACHE_FILES:
        headers["Cache-Control"] = "no-cache"
    return FileResponse(path, headers=headers)


if not SERVE_FRONTEND:
    app.add_middleware(
        CORSMiddleware,
        allow_origins=[
            "http://localhost:5187",
            "http://127.0.0.1:5187",
            "http://localhost:5173",
            "http://127.0.0.1:5173",
        ],
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
    )


@app.on_event("startup")
def _startup() -> None:
    db.init_db()


def _require_admin(x_radar_admin_key: Annotated[str | None, Header()] = None) -> None:
    if not RADAR_ADMIN_SECRET:
        raise HTTPException(
            status_code=503,
            detail="RADAR_ADMIN_SECRET is not configured on the server.",
        )
    if not x_radar_admin_key or x_radar_admin_key != RADAR_ADMIN_SECRET:
        raise HTTPException(status_code=401, detail="Invalid or missing admin key.")


@app.get("/api/health")
def health() -> dict:
    return {
        "status": "ok",
        "app": "AppStax Radar",
        "gemini_configured": gemini_configured(),
        "model": GEMINI_MODEL,
        "admin_configured": bool(RADAR_ADMIN_SECRET),
        "cron_configured": bool(RADAR_CRON_SECRET),
        "database_path": str(RADAR_DATA_PATH),
        "frontend_built": SERVE_FRONTEND,
        "pending_count": db.count_items(status="pending"),
        "published_count": db.count_items(status="published"),
    }


@app.get("/api/items")
def list_items(
    status: str | None = Query(default="published", pattern="^(pending|published|rejected)$"),
    category: str | None = Query(default=None),
    limit: int = Query(default=30, ge=1, le=100),
    offset: int = Query(default=0, ge=0),
) -> dict:
    items = db.list_items(status=status, category=category, limit=limit, offset=offset)
    return {
        "items": items,
        "total": db.count_items(status=status),
        "limit": limit,
        "offset": offset,
    }


@app.get("/api/items/{item_id}")
def get_item(
    item_id: str,
    x_radar_admin_key: Annotated[str | None, Header()] = None,
) -> dict:
    item = db.get_item(item_id)
    if not item:
        raise HTTPException(status_code=404, detail="Item not found.")
    if item["status"] != "published":
        if not RADAR_ADMIN_SECRET or x_radar_admin_key != RADAR_ADMIN_SECRET:
            raise HTTPException(status_code=404, detail="Item not found.")
    return {"item": item}


@app.post("/api/items/{item_id}/approve")
def approve_item(item_id: str, _: Annotated[None, Depends(_require_admin)]) -> dict:
    if not db.set_item_status(item_id, "published"):
        raise HTTPException(status_code=404, detail="Item not found.")
    return {"ok": True, "status": "published"}


@app.post("/api/items/{item_id}/reject")
def reject_item(item_id: str, _: Annotated[None, Depends(_require_admin)]) -> dict:
    if not db.set_item_status(item_id, "rejected"):
        raise HTTPException(status_code=404, detail="Item not found.")
    return {"ok": True, "status": "rejected"}


class ScoutRunRequest(BaseModel):
    summarize: bool = True


@app.post("/api/scout/run")
def scout_run(
    body: ScoutRunRequest | None = None,
    x_radar_admin_key: Annotated[str | None, Header()] = None,
    x_radar_cron_secret: Annotated[str | None, Header()] = None,
) -> dict:
    allowed = False
    if RADAR_CRON_SECRET and x_radar_cron_secret == RADAR_CRON_SECRET:
        allowed = True
    elif RADAR_ADMIN_SECRET and x_radar_admin_key == RADAR_ADMIN_SECRET:
        allowed = True
    if not allowed:
        raise HTTPException(status_code=401, detail="Invalid scout trigger credentials.")

    summarize = body.summarize if body else True
    result = run_scout(summarize=summarize)
    return {"ok": True, **result}


@app.get("/api/scout/status")
def scout_status() -> dict:
    last = db.last_scout_run()
    return {
        "last_run": last,
        "pending_count": db.count_items(status="pending"),
        "published_count": db.count_items(status="published"),
    }


@app.get("/api/categories")
def categories() -> dict:
    return {
        "categories": [
            {"id": "ai", "label": "AI"},
            {"id": "agents", "label": "Agents"},
            {"id": "devtools", "label": "Dev Tools"},
            {"id": "gaming", "label": "Gaming"},
            {"id": "research", "label": "Research"},
            {"id": "events", "label": "Events"},
        ]
    }


if SERVE_FRONTEND:
    assets_dir = FRONTEND_DIST / "assets"
    if assets_dir.is_dir():
        app.mount("/assets", StaticFiles(directory=assets_dir), name="assets")

    @app.get("/{full_path:path}")
    def spa(full_path: str) -> FileResponse:
        if full_path.startswith("api/"):
            raise HTTPException(status_code=404)
        candidate = (FRONTEND_DIST / full_path).resolve()
        dist_root = FRONTEND_DIST.resolve()
        if full_path and candidate.is_file() and dist_root in candidate.parents:
            return _pwa_file_response(candidate)
        return FileResponse(FRONTEND_DIST / "index.html")
else:

    @app.get("/")
    def root() -> dict:
        return {
            "message": "AppStax Radar API — build client or open Vite dev server.",
            "health": "/api/health",
        }
