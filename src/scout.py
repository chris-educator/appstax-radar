"""Scout agent — fetch sources, dedupe, summarize, queue for review."""

from __future__ import annotations

import httpx

from src.config import SCOUT_SUMMARIZE_BATCH
from src import db
from src.fetchers import fetch_source
from src.sources import enabled_sources
from src.summarize import summarize_item


def run_scout(*, summarize: bool = True) -> dict:
    run_id = db.start_scout_run()
    fetched_count = 0
    new_count = 0
    summarized_count = 0
    errors: list[str] = []

    with httpx.Client(
        headers={"User-Agent": "AppStax-Radar/1.0 (+https://radar.appstax.ai)"},
        timeout=30.0,
        follow_redirects=True,
    ) as client:
        for source in enabled_sources():
            try:
                raw_items = fetch_source(source, client=client)
                fetched_count += len(raw_items)
                for raw in raw_items:
                    inserted = db.insert_item(
                        source_id=source.id,
                        source_name=source.name,
                        external_id=raw.external_id,
                        title=raw.title,
                        url=raw.url,
                        published_at=raw.published_at,
                        raw_snippet=raw.raw_snippet,
                        category=source.category,
                        scout_run_id=run_id,
                    )
                    if inserted:
                        new_count += 1
            except Exception as exc:  # noqa: BLE001 — log per-source failures, continue run
                errors.append(f"{source.id}: {exc}")

    if summarize:
        pending = db.list_pending_without_summary(limit=SCOUT_SUMMARIZE_BATCH)
        for item in pending:
            try:
                result = summarize_item(
                    title=item["title"],
                    url=item["url"],
                    raw_snippet=item.get("raw_snippet") or "",
                    source_name=item["source_name"],
                    default_category=item.get("category") or "ai",
                )
                db.update_item_summary(
                    item["id"],
                    summary=result["summary"],
                    relevance_score=result["relevance_score"],
                    category=result["category"],
                )
                summarized_count += 1
            except Exception as exc:  # noqa: BLE001
                errors.append(f"summarize:{item['id']}: {exc}")

    db.finish_scout_run(
        run_id,
        fetched_count=fetched_count,
        new_count=new_count,
        summarized_count=summarized_count,
        errors=errors,
    )

    return {
        "run_id": run_id,
        "fetched_count": fetched_count,
        "new_count": new_count,
        "summarized_count": summarized_count,
        "errors": errors,
    }
