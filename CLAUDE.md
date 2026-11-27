# CLAUDE.md

ch-flow: a Next.js (App Router) web app that visualizes ClickHouse data flows (tables, views, materialized views) as a DAG with React Flow. Exports to PDF/SVG. Shipped as a multi-arch Docker image (`mikeamputer/ch-flow`). Unofficial tool, not affiliated with ClickHouse Inc.

## Stack

Next.js 15 (App Router, `output: 'standalone'`), React 19, TypeScript (strict), `@xyflow/react` + `@dagrejs/dagre` (graph/layout), MUI 7 + Tailwind 4, `@clickhouse/client`, `znv`/`zod` (env parsing), `jspdf`/`svg2pdf.js`/`dom-to-svg` (export), Jest 30 + Testing Library (jsdom).

## Commands

```bash
npm run dev           # dev server on :3000
npm run build         # production build (standalone)
npm test              # jest (tests live in __tests__/)
npm test -- <pattern> # single test file
npm run lint          # next lint (use lint:fix to autofix)
npm run typecheck     # tsc --noEmit
npm run format        # prettier --write . (format:check to verify)
```

Local ClickHouse for dev: `docker compose -f dev/docker-compose.yml up -d` — starts ClickHouse on `localhost:44123` (user/password `developer`, db `flow_test`) and applies `dev/migrations/*.up.sql` via ch-migrate. `app/config/dev-config.json` points at it. `.devcontainer/` is a separate Codespaces demo (bank_demo / shop_demo).

## Architecture

- `app/page.tsx` — single client page. Calls server actions, builds a `ChModel`, maps to node props, renders `ChFlowProvider`.
- `app/actions.ts` — `'use server'` actions: `getAvailableDatabases`, `getDatabaseInfo(configName)`, `getAppSettings`. Only place the client talks to ClickHouse (via server). Browser never sees connection settings.
- `app/db/` — ClickHouse client (`createClient`, `executeQuery`) and queries against `system.tables` / `system.columns` (`tables.ts`, `columns.ts`).
- `app/classes/ChModel.ts` — builds tables/columns map and **table-to-table transitions by regex-parsing `create_table_query`** (`TO`, `FROM`, optionally `JOIN` clauses; also `extractRefreshExpression` for refreshable MVs). Edge detection is regex-based, so changes here need tests.
- `app/components/` — `ChFlow` (React Flow canvas, dagre layout, export), `ChTableNode`/`ChTable*`/`ChEngine*`/`ChColumn` (node rendering), `DatabaseSelector`, `SqlTableInfo`.
- `app/nodes/index.ts` — React Flow custom `nodeTypes` (`ch-table`).
- `app/utils/ReactFlowExport.ts` — PDF/SVG export.
- `app/config/` — config loading. `env.ts` validates `CHF_*` env vars with zod; `index.ts` merges config file + env vars + defaults. Precedence: **env var > config file > default**. A single DB can be defined purely via `CHF_DB_*` env vars and is prepended to `databaseConfigs`. Config file path: `app/config/dev-config.json` when `NODE_ENV !== 'production'`, else `CHF_CONFIG_PATH` (default `/app/config/config.json`). Config is cached unless `CHF_CACHE_CONFIG=false`.

## Conventions

- Imports use the `@/` alias (maps to repo root), e.g. `@/app/db`.
- **Tabs** for indentation in ts/tsx/js/mjs; 2 spaces for json/yml. LF line endings. Prettier: single quotes, semicolons, trailing commas, printWidth 120.
- ESLint: `no-unused-vars` and `no-explicit-any` are off.
- Adding a new setting: add the type + default + env substitution in `app/config/index.ts`, the env var in `app/config/env.ts`, and expose it through `AppSettings` in `app/actions.ts`. Env vars are documented in the project wiki, so note user-facing additions in the PR.
- Server-only code (config, db, ENV) must stay out of client components; reach it through server actions.

## Release

Version lives in `package.json` (`version`). `.github/workflows/release.yml` is a manual (`workflow_dispatch`) workflow: runs `npm test`, reads the version from package.json, refuses if the version tag already exists, builds multi-arch images to Docker Hub and GHCR. Bump the version with `npm version <patch|minor|major> --no-git-tag-version`, then commit.
