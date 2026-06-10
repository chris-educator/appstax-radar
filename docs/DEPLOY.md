# Deploy AppStax Radar

## Railway

1. Create GitHub repo `appstax-radar` and push this project.
2. New Railway service → deploy from repo (Dockerfile).
3. **Variables:**
   - `GOOGLE_API_KEY`
   - `GEMINI_MODEL` (optional, default `gemini-2.0-flash`)
   - `RADAR_ADMIN_SECRET` (long random string)
   - `RADAR_CRON_SECRET` (optional; defaults to admin secret)
   - `RADAR_DATA_PATH=/app/data/radar.db`
4. **Volume:** mount `/app/data` for SQLite persistence.
5. Custom domain: `radar.appstax.ai` → Railway CNAME.

## DNS

Add CNAME `radar` → Railway target host. Verify HTTPS.

## Post-deploy smoke

```bash
curl https://radar.appstax.ai/api/health
```

1. Open `/review` with admin key
2. Run Scout
3. Publish 1+ items
4. Confirm `/` feed shows stories

## Projects page

When live, update `appstax-website`:

- `client/src/constants/productUrls.ts` → `radar: 'https://radar.appstax.ai'`
- `client/src/data/apps.ts` → status `beta` or `live`
- Run `docs/projects-page-ship-checklist.md`

## Cron

Use Railway cron or external scheduler to `POST /api/scout/run` with `X-Radar-Cron-Secret`.
