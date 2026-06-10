"""Curated Scout sources — RSS and API feeds (Phase 1)."""

from __future__ import annotations

from dataclasses import dataclass
from typing import Literal

SourceType = Literal["rss", "hn_api"]


@dataclass(frozen=True)
class Source:
    id: str
    name: str
    type: SourceType
    url: str
    category: str
    enabled: bool = True


# 15 sources: AI dev, agents, gaming, research, events-ish industry news
SOURCES: tuple[Source, ...] = (
    Source("hn_top", "Hacker News", "hn_api", "https://hacker-news.firebaseio.com/v0", "devtools"),
    Source(
        "reddit_ml",
        "Reddit r/MachineLearning",
        "rss",
        "https://www.reddit.com/r/MachineLearning/.rss",
        "ai",
    ),
    Source(
        "reddit_localllama",
        "Reddit r/LocalLLaMA",
        "rss",
        "https://www.reddit.com/r/LocalLLaMA/.rss",
        "agents",
    ),
    Source("devto_ai", "Dev.to AI", "rss", "https://dev.to/feed/tag/ai", "devtools"),
    Source(
        "google_news_ai",
        "Google News — AI development",
        "rss",
        "https://news.google.com/rss/search?q=AI+software+development&hl=en-US&gl=US&ceid=US:en",
        "ai",
    ),
    Source(
        "google_news_agents",
        "Google News — AI agents",
        "rss",
        "https://news.google.com/rss/search?q=AI+agents+LLM&hl=en-US&gl=US&ceid=US:en",
        "agents",
    ),
    Source("verge_ai", "The Verge — AI", "rss", "https://www.theverge.com/rss/ai-artificial-intelligence/index.xml", "ai"),
    Source("ars_ai", "Ars Technica — AI", "rss", "https://feeds.arstechnica.com/arstechnica/technology-lab", "ai"),
    Source(
        "mit_tr",
        "MIT Technology Review",
        "rss",
        "https://www.technologyreview.com/feed/",
        "ai",
    ),
    Source("openai_blog", "OpenAI Blog", "rss", "https://openai.com/blog/rss.xml", "ai"),
    Source("google_ai_blog", "Google AI Blog", "rss", "https://blog.google/technology/ai/rss/", "ai"),
    Source("github_blog", "GitHub Blog", "rss", "https://github.blog/feed/", "devtools"),
    Source("unity_blog", "Unity Blog", "rss", "https://blog.unity.com/feed", "gaming"),
    Source(
        "gamedeveloper",
        "Game Developer",
        "rss",
        "https://www.gamedeveloper.com/rss.xml",
        "gaming",
    ),
    Source("arxiv_cs_ai", "arXiv cs.AI", "rss", "https://rss.arxiv.org/rss/cs.AI", "research"),
)


def enabled_sources() -> list[Source]:
    return [s for s in SOURCES if s.enabled]


def source_by_id(source_id: str) -> Source | None:
    for s in SOURCES:
        if s.id == source_id:
            return s
    return None
