"""AppStax Radar configuration."""

from __future__ import annotations

import os
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent

GEMINI_MODEL = os.getenv("GEMINI_MODEL", "gemini-3.5-flash").strip()
GOOGLE_API_KEY = os.getenv("GOOGLE_API_KEY", "").strip()

_data_default = ROOT / "data" / "radar.db"
RADAR_DATA_PATH = Path(os.getenv("RADAR_DATA_PATH", str(_data_default))).expanduser()

RADAR_ADMIN_SECRET = os.getenv("RADAR_ADMIN_SECRET", "").strip()
RADAR_CRON_SECRET = os.getenv("RADAR_CRON_SECRET", RADAR_ADMIN_SECRET).strip()

SCOUT_SUMMARIZE_BATCH = max(1, min(50, int(os.getenv("SCOUT_SUMMARIZE_BATCH", "20"))))

AUTO_PUBLISH_THRESHOLD = float(os.getenv("AUTO_PUBLISH_THRESHOLD", "0.5"))  # 0 = manual only
