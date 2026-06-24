"""Popularity scoring for feed ordering."""

from __future__ import annotations

import math
from datetime import datetime, timezone


def recency_boost(published_at: str | None) -> float:
    """0–1 score; fresh stories rank higher (48h half-life)."""
    if not published_at:
        return 0.25
    try:
        raw = published_at.replace("Z", "+00:00")
        published = datetime.fromisoformat(raw)
        if published.tzinfo is None:
            published = published.replace(tzinfo=timezone.utc)
        age_hours = max(0.0, (datetime.now(timezone.utc) - published).total_seconds() / 3600)
    except (TypeError, ValueError, OverflowError):
        return 0.25
    return max(0.08, math.exp(-age_hours / 48))


def normalize_engagement(raw: float | None) -> float:
    """Map raw engagement (HN score, etc.) to 0–1."""
    if raw is None or raw <= 0:
        return 0.15
    return min(1.0, math.log1p(raw) / math.log1p(600))


def compute_popularity(
    *,
    relevance_score: float | None,
    engagement_score: float | None,
    published_at: str | None,
) -> float:
    rel = max(0.0, min(1.0, relevance_score if relevance_score is not None else 0.5))
    eng = normalize_engagement(engagement_score)
    rec = recency_boost(published_at)
    return round(rel * 0.45 + eng * 0.35 + rec * 0.20, 4)
