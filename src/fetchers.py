"""Fetch raw items from RSS and Hacker News API."""

from __future__ import annotations

import re
from dataclasses import dataclass
from datetime import datetime, timezone
from email.utils import parsedate_to_datetime
from typing import Any
from urllib.parse import urlparse

import feedparser
import httpx

from src.sources import Source

HN_AI_KEYWORDS = re.compile(
    r"\b(ai|llm|gpt|claude|gemini|agent|machine learning|neural|openai|anthropic|"
    r"transformer|diffusion|cuda|inference|rag|embedding|fine-?tun|model|deep learning)\b",
    re.I,
)

IMG_SRC_RE = re.compile(r"""<img[^>]+src=["']([^"']+)["']""", re.I)


@dataclass
class RawItem:
    external_id: str
    title: str
    url: str
    published_at: str | None
    raw_snippet: str
    image_url: str | None = None
    engagement_score: float | None = None


def _iso(dt: datetime | None) -> str | None:
    if dt is None:
        return None
    if dt.tzinfo is None:
        dt = dt.replace(tzinfo=timezone.utc)
    return dt.astimezone(timezone.utc).isoformat()


def _parse_published(entry: dict[str, Any]) -> str | None:
    for key in ("published_parsed", "updated_parsed"):
        parsed = entry.get(key)
        if parsed:
            try:
                return _iso(datetime(*parsed[:6], tzinfo=timezone.utc))
            except (TypeError, ValueError):
                pass
    for key in ("published", "updated"):
        raw = entry.get(key)
        if raw:
            try:
                return _iso(parsedate_to_datetime(raw))
            except (TypeError, ValueError, OverflowError):
                pass
    return None


def _clean_snippet(text: str, max_len: int = 500) -> str:
    cleaned = re.sub(r"<[^>]+>", " ", text or "")
    cleaned = re.sub(r"\s+", " ", cleaned).strip()
    if len(cleaned) > max_len:
        return cleaned[: max_len - 1] + "…"
    return cleaned


def _media_url(value: Any) -> str | None:
    if not value:
        return None
    if isinstance(value, list):
        for item in value:
            url = _media_url(item)
            if url:
                return url
        return None
    if isinstance(value, dict):
        return (value.get("url") or value.get("href") or "").strip() or None
    url = getattr(value, "url", None) or getattr(value, "href", None)
    return str(url).strip() if url else None


def _extract_image(entry: dict[str, Any]) -> str | None:
    for key in ("media_thumbnail", "media_content", "image"):
        url = _media_url(entry.get(key))
        if url:
            return url

    for enc in entry.get("enclosures") or []:
        enc_type = (enc.get("type") or enc.get("type") or "").lower()
        href = enc.get("href") or enc.get("url")
        if href and enc_type.startswith("image/"):
            return str(href).strip()

    for link in entry.get("links") or []:
        link_type = (link.get("type") or "").lower()
        href = link.get("href")
        if href and link_type.startswith("image/"):
            return str(href).strip()

    for field in ("summary", "description", "content"):
        raw = entry.get(field)
        if isinstance(raw, list) and raw:
            raw = raw[0].get("value", "")
        if isinstance(raw, str):
            match = IMG_SRC_RE.search(raw)
            if match:
                return match.group(1).strip()

    return None


def fetch_rss(source: Source, *, client: httpx.Client | None = None) -> list[RawItem]:
    if source.type != "rss":
        raise ValueError(f"Source {source.id} is not RSS")

    if client is not None:
        resp = client.get(source.url, timeout=30.0, follow_redirects=True)
        resp.raise_for_status()
        parsed = feedparser.parse(resp.content)
    else:
        parsed = feedparser.parse(source.url)

    items: list[RawItem] = []
    for entry in parsed.entries[:40]:
        title = (entry.get("title") or "").strip()
        link = (entry.get("link") or entry.get("id") or "").strip()
        if not title or not link:
            continue
        ext_id = (entry.get("id") or link).strip()
        snippet = _clean_snippet(
            entry.get("summary") or entry.get("description") or entry.get("content", [{}])[0].get("value", "")
        )
        items.append(
            RawItem(
                external_id=ext_id,
                title=title,
                url=link,
                published_at=_parse_published(entry),
                raw_snippet=snippet,
                image_url=_extract_image(entry),
                engagement_score=None,
            )
        )
    return items


def fetch_hn_top(*, client: httpx.Client | None = None) -> list[RawItem]:
    """Top HN stories filtered for AI/dev relevance."""
    own_client = client is None
    if own_client:
        client = httpx.Client(headers={"User-Agent": "AppStax-Radar/1.0"})

    assert client is not None
    try:
        top_ids = client.get(
            "https://hacker-news.firebaseio.com/v0/topstories.json", timeout=20.0
        ).json()
        items: list[RawItem] = []
        for story_id in top_ids[:100]:
            story = client.get(
                f"https://hacker-news.firebaseio.com/v0/item/{story_id}.json",
                timeout=15.0,
            ).json()
            if not story or story.get("type") != "story":
                continue
            title = (story.get("title") or "").strip()
            url = (story.get("url") or f"https://news.ycombinator.com/item?id={story_id}").strip()
            if not title:
                continue
            text_blob = f"{title} {story.get('text', '')}"
            if not HN_AI_KEYWORDS.search(text_blob):
                continue
            ts = story.get("time")
            published = _iso(datetime.fromtimestamp(ts, tz=timezone.utc)) if ts else None
            score = float(story.get("score") or 0)
            desc = story.get("descendants") or 0
            engagement = score + desc * 0.5
            items.append(
                RawItem(
                    external_id=str(story_id),
                    title=title,
                    url=url,
                    published_at=published,
                    raw_snippet=_clean_snippet(story.get("text") or ""),
                    image_url=None,
                    engagement_score=engagement,
                )
            )
            if len(items) >= 30:
                break
        return items
    finally:
        if own_client:
            client.close()


def fetch_source(source: Source, *, client: httpx.Client | None = None) -> list[RawItem]:
    if source.type == "rss":
        return fetch_rss(source, client=client)
    if source.type == "hn_api":
        return fetch_hn_top(client=client)
    raise ValueError(f"Unknown source type: {source.type}")


def favicon_for_url(url: str) -> str:
    """Google favicon service — fallback thumbnail when RSS has no image."""
    try:
        host = urlparse(url).netloc
        if host:
            return f"https://www.google.com/s2/favicons?domain={host}&sz=128"
    except Exception:  # noqa: BLE001
        pass
    return ""
