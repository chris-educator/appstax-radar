# Ship check (pre-deploy gate)

Run the **AppStax pre-ship harness** for the **current repo** before Railway/production deploy or merging release-ready work to `main`.

## Constraints

- You may run builds, tests, and read-only health checks.
- Do not deploy unless the user explicitly asks after a **SHIP** verdict.
- Never print secret values from `.env` or Railway.

## Workflow (execute in order)

### 1. Orient

- Read `../appstax-website/docs/studio-principles.md` (mission, legal, anti-rot, housekeeping).
- Read repo `AGENTS.md` and README for stack, ports, and health path.
- If this change removed files, confirm references were grepped and docs updated (no orphan links).

### 2. Automated checks

| Check | Command |
|-------|---------|
| Frontend build | `npm run build` |
| Python tests | `python3 -m pytest tests/` |
| Python compile | `python3 -m compileall src server` |

### 3. Pre-deploy reviewer

Read skill **`pre-deploy-reviewer`** → SHIP / BLOCKED report.

### 4. Production readiness

```bash
curl -sS https://radar.appstax.ai/api/health
```

**Do not recommend deploy while BLOCKED.**
