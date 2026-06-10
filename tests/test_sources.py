"""Source configuration tests."""

from src.sources import SOURCES, enabled_sources


def test_fifteen_sources():
    assert len(SOURCES) == 15
    assert len(enabled_sources()) == 15


def test_source_ids_unique():
    ids = [s.id for s in SOURCES]
    assert len(ids) == len(set(ids))
