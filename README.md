# AppStax Radar

Curated AI development, agents, dev tools, and game-tech news for builders.

**Production:** https://radar.appstax.ai

## What it does

- **Scout** agent fetches 15 RSS/API sources on demand or via cron
- **Gemini** writes original summaries and relevance scores
- **Review queue** — founder approves items before they hit the public feed
- **Feed** — published stories with category filters

## Local dev

```bash
cp .env.example .env
# Set GOOGLE_API_KEY and RADAR_ADMIN_SECRET

pip install -r requirements.txt
npm install --prefix client

# Terminal 1 — API :8005
npm run dev:api

# Terminal 2 — UI :5187
npm run dev:client
```

Open http://localhost:5187 → **Review** → unlock with `RADAR_ADMIN_SECRET` → **Run Scout** → publish items → **Feed**.

## Tests

```bash
python3 -m pytest tests/
```

## Production build

```bash
npm run build
uvicorn server.main:app --host 0.0.0.0 --port 8000
```

## Deploy

See `docs/DEPLOY.md` for Railway + `radar.appstax.ai` DNS.

## Scout cron (Railway)

Schedule an HTTP POST every 2–4 hours:

```bash
curl -X POST https://radar.appstax.ai/api/scout/run \
  -H "X-Radar-Cron-Secret: YOUR_RADAR_CRON_SECRET" \
  -H "Content-Type: application/json" \
  -d '{"summarize": true}'
```

## Harness

`AGENTS.md` · `../appstax-website/docs/studio-principles.md`
