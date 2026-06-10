"""Database tests."""

from __future__ import annotations

import tempfile
from pathlib import Path

from src import config, db


def test_init_and_insert_item():
    with tempfile.TemporaryDirectory() as tmp:
        path = Path(tmp) / "test.db"
        config.RADAR_DATA_PATH = path
        db.init_db(path)

        run_id = db.start_scout_run()
        item_id = db.insert_item(
            source_id="test",
            source_name="Test Source",
            external_id="ext-1",
            title="Test Story",
            url="https://example.com/story-1",
            published_at="2026-01-01T00:00:00+00:00",
            raw_snippet="Snippet",
            category="ai",
            scout_run_id=run_id,
        )
        assert item_id
        assert db.item_exists_by_url("https://example.com/story-1")
        assert db.insert_item(
            source_id="test",
            source_name="Test Source",
            external_id="ext-1-dup",
            title="Dup",
            url="https://example.com/story-1",
            published_at=None,
            raw_snippet="",
            category="ai",
            scout_run_id=run_id,
        ) is None

        pending = db.list_items(status="pending")
        assert len(pending) == 1
        db.update_item_summary(item_id, summary="Summary.", relevance_score=0.8, category="agents")
        db.set_item_status(item_id, "published")
        published = db.list_items(status="published")
        assert published[0]["summary"] == "Summary."
