"""Gemini relevance scoring and original summaries for Scout items."""

from __future__ import annotations

import json
import re
from typing import Any

from google import genai
from google.genai import types

from src.config import GEMINI_MODEL, GOOGLE_API_KEY

SCOUT_SYSTEM = """You curate AI development, agent tooling, game-dev tech, and industry news for AppStax Radar.

Rules:
- Write an ORIGINAL 2–4 sentence summary in your own words. Do NOT copy source text verbatim.
- Score relevance 0.0–1.0 for builders interested in AI software, agents, LLMs, dev tools, and game-tech.
- Downrank: crypto spam, SEO fluff, unrelated celebrity news, pure politics.
- category must be one of: ai, agents, gaming, research, devtools, events
- Output valid JSON only.

JSON schema:
{
  "summary": string,
  "relevance_score": number,
  "category": string
}
"""

VALID_CATEGORIES = frozenset({"ai", "agents", "gaming", "research", "devtools", "events"})


def gemini_configured() -> bool:
    return bool(GOOGLE_API_KEY)


def _client() -> genai.Client:
    if not GOOGLE_API_KEY:
        raise RuntimeError("GOOGLE_API_KEY is not configured")
    return genai.Client(api_key=GOOGLE_API_KEY)


def _parse_json(text: str) -> dict[str, Any]:
    text = text.strip()
    fence = re.search(r"```(?:json)?\s*([\s\S]*?)```", text)
    if fence:
        text = fence.group(1).strip()
    return json.loads(text)


def summarize_item(
    *,
    title: str,
    url: str,
    raw_snippet: str,
    source_name: str,
    default_category: str,
) -> dict[str, Any]:
    """Return summary, relevance_score, category."""
    if not gemini_configured():
        fallback = raw_snippet[:280] if raw_snippet else f"New from {source_name}."
        return {
            "summary": fallback or f"{title} — see source link.",
            "relevance_score": 0.5,
            "category": default_category if default_category in VALID_CATEGORIES else "ai",
        }

    prompt = (
        f"Source: {source_name}\n"
        f"Title: {title}\n"
        f"URL: {url}\n"
        f"Snippet (for context only, do not copy): {raw_snippet[:800]}\n"
        f"Default category hint: {default_category}\n"
    )

    client = _client()
    response = client.models.generate_content(
        model=GEMINI_MODEL,
        contents=prompt,
        config=types.GenerateContentConfig(
            system_instruction=SCOUT_SYSTEM,
            temperature=0.3,
            response_mime_type="application/json",
        ),
    )
    text = (response.text or "").strip()
    data = _parse_json(text)
    summary = str(data.get("summary", "")).strip()
    score = float(data.get("relevance_score", 0.5))
    category = str(data.get("category", default_category)).strip().lower()
    if category not in VALID_CATEGORIES:
        category = default_category if default_category in VALID_CATEGORIES else "ai"
    score = max(0.0, min(1.0, score))
    if not summary:
        summary = f"{title} — reported by {source_name}."
    return {"summary": summary, "relevance_score": score, "category": category}
