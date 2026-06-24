"""Source configuration tests."""

from src.sources import SOURCES, enabled_sources


def test_twenty_sources():
    assert len(SOURCES) == 20
    assert len(enabled_sources()) == 20


def test_source_ids_unique():
    ids = [s.id for s in SOURCES]
    assert len(ids) == len(set(ids))
