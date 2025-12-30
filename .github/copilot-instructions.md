## Purpose

Short, actionable instructions for AI coding agents working on this repository.

## Big-picture architecture
- Frontend: Single-page React + TypeScript app in `frontend/` (build via `npm run build`). Uses `sql.js`/`sql-wasm` to process Signal SQLite files entirely in-browser. Key files: `frontend/package.json`, `frontend/src/` (components like `seo/Seo.tsx`).
- Backend (optional): Lightweight FastAPI app under `app/` for CSV-based analytics and development convenience. Key files: `app/main.py`, `app/analytics.py`.
- Decrypt helpers and binaries: `decrypt/` and `frontend/build/decrypt/` contain platform-specific `signal-decrypt` binaries; these are prebuilt artifacts, not source code.
- Schema and data artifacts: `schemas/decrypted_schema.sql` documents the expected SQLite schema.

Why this shape: primary UX is client-side privacy-first processing (README.md). The backend exists primarily for CSV-based server-side analytics in development.

## Developer workflows (discovered from repository)
- Frontend dev: `cd frontend && npm install && npm start` — hot-reloads on port 3000. Build for production: `npm run build`.
- Frontend deployment: uses `gh-pages` via `npm run deploy` (see `frontend/package.json` scripts). The repo also contains a prebuilt `frontend/build/` directory.
- Backend dev: create a venv, `pip install -r requirements.txt`, then `uvicorn app.main:app --reload` (serves on port 8000). Environment variables loaded via `python-dotenv`.
- Binary/decrypt artifacts: do not modify `frontend/build/decrypt` directly; replace or update binaries in `decrypt/` then rebuild frontend if needed.

## Project-specific patterns and conventions
- Privacy-first: avoid adding any server-side persistence or analytics that sends user data off-machine. The README and SETUP.md emphasize client-side processing.
- SQL handling: frontend relies on `sql.js`/`sql-wasm` for in-browser SQLite access; do not assume the backend accepts encrypted Signal sqlite files — the FastAPI endpoints accept CSV (see `app/main.py`).
- Webpack overrides: the project uses `react-app-rewired` with overrides in `frontend/config-overrides.js` and `frontend/config/webpack.config.override.js` — prefer modifying those when adjusting build behavior.
- Timestamp handling: `SignalAnalytics` in `app/analytics.py` expects a timestamp column (milliseconds numeric) and converts it to datetimes; mirror that shape when adding data transforms.

## Integration points and external dependencies
- Frontend packages (see `frontend/package.json`): React, Material UI, sql-wasm/sql.js, charting libs, `@xenova/transformers` (heavy ML bundle — be mindful of bundle size).
- Backend Python deps (see `requirements.txt`): `fastapi`, `uvicorn`, `pandas`, `pysqlcipher3` (encrypted DB support), `python-dotenv`.
- Decrypt tool: compiled `signal-decrypt` binaries are present under `decrypt/` and copied into `frontend/build/decrypt/` during build; treat these as platform-specific assets.

## How to make safe, high-impact changes
- For UI/UX: focus on `frontend/src/components/` and reuse existing layout components under `frontend/src/components/layout/`.
- For data transformations: prefer client-side changes using `sql.js` where possible; if server-side is needed for heavy compute, add CSV endpoints consistent with `app/main.py` patterns.
- For builds: update `frontend/package.json` scripts and `react-app-rewired` overrides rather than ejecting the CRA setup.

## Useful file references
- Frontend entry and components: `frontend/src/` (e.g., `frontend/src/components/seo/Seo.tsx`).
- Webpack overrides: `frontend/config-overrides.js`, `frontend/config/webpack.config.override.js`.
- Backend API: `app/main.py`, analytics logic: `app/analytics.py`.
- Dependency manifests: `frontend/package.json`, `package.json` (root), `requirements.txt`.
- Setup instructions: `SETUP.md`, `README.md`.

## Constraints & guardrails for AI agents
- Never add code that uploads user data to third-party services; the project is explicitly privacy-first.
- When modifying or adding binaries under `decrypt/` or `frontend/build/decrypt/`, explain required rebuild steps and platform impacts.
- When touching build config, preserve `react-app-rewired` approach; avoid recommending `eject` unless absolutely necessary and approved.

## Quick commands summary
- Frontend dev: `cd frontend && npm install && npm start`
- Frontend build: `cd frontend && npm run build`
- Backend dev: `python -m venv venv && venv\Scripts\activate && pip install -r requirements.txt && uvicorn app.main:app --reload`

If anything here is unclear or you'd like me to expand any section (for example, include examples for common PR changes), tell me which area to expand.
