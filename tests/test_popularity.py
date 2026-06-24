"""Popularity scoring tests."""

from src.popularity import compute_popularity, recency_boost


def test_recency_boost_fresh():
    assert recency_boost("2099-01-01T00:00:00+00:00") > 0.9


def test_compute_popularity_range():
    score = compute_popularity(relevance_score=0.8, engagement_score=100, published_at="2099-01-01T00:00:00+00:00")
    assert 0 <= score <= 1
