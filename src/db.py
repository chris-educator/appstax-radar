"""SQLite persistence for Scout items and runs."""

from __future__ import annotations

import json
import sqlite3
import uuid
from contextlib import contextmanager
from datetime import datetime, timezone
from pathlib import Path
from typing import Any, Iterator

from src import config


def _now() -> str:
    return datetime.now(timezone.utc).isoformat()


def _db_path(path: Path | None = None) -> Path:
    return path or config.RADAR_DATA_PATH


def init_db(path: Path | None = None) -> None:
    db_path = _db_path(path)
    db_path.parent.mkdir(parents=True, exist_ok=True)
    with _connect(db_path) as conn:
        conn.executescript(
            """
            CREATE TABLE IF NOT EXISTS scout_runs (
                id TEXT PRIMARY KEY,
                started_at TEXT NOT NULL,
                finished_at TEXT,
                fetched_count INTEGER DEFAULT 0,
                new_count INTEGER DEFAULT 0,
                summarized_count INTEGER DEFAULT 0,
                errors_json TEXT DEFAULT '[]'
            );

            CREATE TABLE IF NOT EXISTS items (
                id TEXT PRIMARY KEY,
                source_id TEXT NOT NULL,
                source_name TEXT NOT NULL,
                external_id TEXT NOT NULL,
                title TEXT NOT NULL,
                url TEXT NOT NULL UNIQUE,
                published_at TEXT,
                raw_snippet TEXT DEFAULT '',
                summary TEXT DEFAULT '',
                category TEXT DEFAULT 'ai',
                relevance_score REAL,
                status TEXT NOT NULL DEFAULT 'pending',
                created_at TEXT NOT NULL,
                reviewed_at TEXT,
                scout_run_id TEXT
            );

            CREATE INDEX IF NOT EXISTS idx_items_status ON items(status);
            CREATE INDEX IF NOT EXISTS idx_items_created ON items(created_at DESC);
            CREATE INDEX IF NOT EXISTS idx_items_category ON items(category);
            """
        )


@contextmanager
def _connect(path: Path | None = None) -> Iterator[sqlite3.Connection]:
    conn = sqlite3.connect(_db_path(path))
    conn.row_factory = sqlite3.Row
    try:
        yield conn
        conn.commit()
    finally:
        conn.close()


def _row_to_item(row: sqlite3.Row) -> dict[str, Any]:
    return dict(row)


def item_exists_by_url(url: str) -> bool:
    with _connect() as conn:
        row = conn.execute("SELECT 1 FROM items WHERE url = ?", (url,)).fetchone()
        return row is not None


def insert_item(
    *,
    source_id: str,
    source_name: str,
    external_id: str,
    title: str,
    url: str,
    published_at: str | None,
    raw_snippet: str,
    category: str,
    scout_run_id: str,
) -> str | None:
    if item_exists_by_url(url):
        return None
    item_id = str(uuid.uuid4())
    with _connect() as conn:
        conn.execute(
            """
            INSERT INTO items (
                id, source_id, source_name, external_id, title, url,
                published_at, raw_snippet, category, status, created_at, scout_run_id
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, 'pending', ?, ?)
            """,
            (
                item_id,
                source_id,
                source_name,
                external_id,
                title,
                url,
                published_at,
                raw_snippet,
                category,
                _now(),
                scout_run_id,
            ),
        )
    return item_id


def list_items(
    *,
    status: str | None = None,
    category: str | None = None,
    limit: int = 50,
    offset: int = 0,
) -> list[dict[str, Any]]:
    clauses: list[str] = []
    params: list[Any] = []
    if status:
        clauses.append("status = ?")
        params.append(status)
    if category:
        clauses.append("category = ?")
        params.append(category)
    where = f"WHERE {' AND '.join(clauses)}" if clauses else ""
    params.extend([limit, offset])
    with _connect() as conn:
        rows = conn.execute(
            f"""
            SELECT * FROM items {where}
            ORDER BY COALESCE(published_at, created_at) DESC
            LIMIT ? OFFSET ?
            """,
            params,
        ).fetchall()
    return [_row_to_item(r) for r in rows]


def count_items(*, status: str | None = None) -> int:
    with _connect() as conn:
        if status:
            row = conn.execute("SELECT COUNT(*) AS c FROM items WHERE status = ?", (status,)).fetchone()
        else:
            row = conn.execute("SELECT COUNT(*) AS c FROM items").fetchone()
    return int(row["c"]) if row else 0


def get_item(item_id: str) -> dict[str, Any] | None:
    with _connect() as conn:
        row = conn.execute("SELECT * FROM items WHERE id = ?", (item_id,)).fetchone()
    return _row_to_item(row) if row else None


def update_item_summary(
    item_id: str,
    *,
    summary: str,
    relevance_score: float,
    category: str,
) -> None:
    with _connect() as conn:
        conn.execute(
            """
            UPDATE items SET summary = ?, relevance_score = ?, category = ?
            WHERE id = ?
            """,
            (summary, relevance_score, category, item_id),
        )


def set_item_status(item_id: str, status: str) -> bool:
    with _connect() as conn:
        cur = conn.execute(
            "UPDATE items SET status = ?, reviewed_at = ? WHERE id = ?",
            (status, _now(), item_id),
        )
        return cur.rowcount > 0


def list_pending_without_summary(limit: int = 20) -> list[dict[str, Any]]:
    with _connect() as conn:
        rows = conn.execute(
            """
            SELECT * FROM items
            WHERE status = 'pending' AND (summary IS NULL OR summary = '')
            ORDER BY created_at ASC
            LIMIT ?
            """,
            (limit,),
        ).fetchall()
    return [_row_to_item(r) for r in rows]


def start_scout_run() -> str:
    run_id = str(uuid.uuid4())
    with _connect() as conn:
        conn.execute(
            "INSERT INTO scout_runs (id, started_at) VALUES (?, ?)",
            (run_id, _now()),
        )
    return run_id


def finish_scout_run(
    run_id: str,
    *,
    fetched_count: int,
    new_count: int,
    summarized_count: int,
    errors: list[str],
) -> None:
    with _connect() as conn:
        conn.execute(
            """
            UPDATE scout_runs SET
                finished_at = ?,
                fetched_count = ?,
                new_count = ?,
                summarized_count = ?,
                errors_json = ?
            WHERE id = ?
            """,
            (_now(), fetched_count, new_count, summarized_count, json.dumps(errors), run_id),
        )


def last_scout_run() -> dict[str, Any] | None:
    with _connect() as conn:
        row = conn.execute(
            "SELECT * FROM scout_runs ORDER BY started_at DESC LIMIT 1"
        ).fetchone()
    if not row:
        return None
    data = dict(row)
    data["errors"] = json.loads(data.get("errors_json") or "[]")
    return data
