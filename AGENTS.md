# AGENTS — AppStax Radar

Curated AI/dev/gaming news hub. Scout agent + founder review queue.

## Purpose

Fetch fresh stories from 15 sources, summarize with Gemini, publish after human approval. Link-out model — original summaries only.

## Stack

- `client/` — Vite, React 19, Tailwind v4
- `server/` — FastAPI
- `src/` — Scout, fetchers, SQLite, Gemini summarize

## Key paths

| Path | Role |
|------|------|
| `src/scout.py` | Scout agent orchestration |
| `src/sources.py` | 15 curated sources |
| `src/summarize.py` | Gemini relevance + summary |
| `src/db.py` | SQLite items + scout_runs |
| `docs/DEPLOY.md` | Railway + DNS |

## Local dev

```bash
npm run dev:api    # :8005
npm run dev:client # :5187
```

## Production

- **Host:** https://radar.appstax.ai
- **Health:** `GET /api/health`
- **Admin:** `X-Radar-Admin-Key` header (= `RADAR_ADMIN_SECRET`)
- **Cron:** `POST /api/scout/run` with `X-Radar-Cron-Secret`

## Gold standard

**FBG** chrome (header/footer, theme A/L/D). News-specific feed + review UI.

## Product rules

- Original summaries only — no full article republish
- RSS/API sources with attribution links
- Review queue required in Phase 1 (no auto-publish by default)

## Agent commands

`/explore` · `/ship-check`

## Harness

`../appstax-website/docs/studio-principles.md` · `../appstax-website/docs/harness-engineering.md` · `../appstax-website/docs/aios-knowledge.md`
