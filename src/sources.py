"""Curated Scout sources — RSS and API feeds for AI news."""

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


# AI-first sources — industry news, research, dev tools, agents
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
    Source(
        "reddit_artificial",
        "Reddit r/artificial",
        "rss",
        "https://www.reddit.com/r/artificial/.rss",
        "ai",
    ),
    Source("devto_ai", "Dev.to AI", "rss", "https://dev.to/feed/tag/ai", "devtools"),
    Source(
        "google_news_ai",
        "Google News — AI",
        "rss",
        "https://news.google.com/rss/search?q=artificial+intelligence+machine+learning&hl=en-US&gl=US&ceid=US:en",
        "ai",
    ),
    Source(
        "google_news_agents",
        "Google News — AI Agents",
        "rss",
        "https://news.google.com/rss/search?q=AI+agents+LLM+autonomous&hl=en-US&gl=US&ceid=US:en",
        "agents",
    ),
    Source(
        "verge_ai",
        "The Verge — AI",
        "rss",
        "https://www.theverge.com/rss/ai-artificial-intelligence/index.xml",
        "ai",
    ),
    Source(
        "techcrunch_ai",
        "TechCrunch — AI",
        "rss",
        "https://techcrunch.com/category/artificial-intelligence/feed/",
        "ai",
    ),
    Source(
        "venturebeat_ai",
        "VentureBeat — AI",
        "rss",
        "https://venturebeat.com/category/ai/feed/",
        "ai",
    ),
    Source(
        "ars_ai",
        "Ars Technica",
        "rss",
        "https://feeds.arstechnica.com/arstechnica/technology-lab",
        "ai",
    ),
    Source(
        "mit_tr",
        "MIT Technology Review",
        "rss",
        "https://www.technologyreview.com/topic/artificial-intelligence/feed/",
        "research",
    ),
    Source("openai_blog", "OpenAI", "rss", "https://openai.com/blog/rss.xml", "ai"),
    Source(
        "google_ai_blog",
        "Google AI",
        "rss",
        "https://blog.google/technology/ai/rss/",
        "ai",
    ),
    Source(
        "huggingface_blog",
        "Hugging Face",
        "rss",
        "https://huggingface.co/blog/feed.xml",
        "research",
    ),
    Source("github_blog", "GitHub Blog", "rss", "https://github.blog/feed/", "devtools"),
    Source(
        "nvidia_ai",
        "NVIDIA AI Blog",
        "rss",
        "https://blogs.nvidia.com/blog/category/deep-learning/feed/",
        "ai",
    ),
    Source("arxiv_cs_ai", "arXiv cs.AI", "rss", "https://rss.arxiv.org/rss/cs.AI", "research"),
    Source(
        "deeplearning_ai",
        "The Batch",
        "rss",
        "https://www.deeplearning.ai/the-batch/feed/",
        "research",
    ),
    Source(
        "ai_news",
        "AI News",
        "rss",
        "https://www.artificialintelligence-news.com/feed/",
        "ai",
    ),
)


def enabled_sources() -> list[Source]:
    return [s for s in SOURCES if s.enabled]


def source_by_id(source_id: str) -> Source | None:
    for s in SOURCES:
        if s.id == source_id:
            return s
    return None
