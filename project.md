# Project Overview

Living document for this project. Update this file as features, decisions, and architecture change.

**Last updated:** 2026-08-12  
**Status:** UI implementation in progress  
**Package name:** `cursor-final`  
**Product:** Kinetic Migrator (SAP Migration Smart Validator)

---

## Summary

Monorepo for **Kinetic Migrator / SAP Migration Smart Validator**:
- `frontend/` — Next.js App Router UI (Stitch Remix is source of truth)
- `backend/` — Node auth API (register/login)

Validation uses the **AI Closed** Stitch screen (assistant rail closed by default). Staging / preview / validation screens use mock data; auth forms call the backend API when available.

**Frontend routes:** `/register`, `/signin`, `/staging`, `/preview`, `/validation`, `/reports` (`/` redirects to `/register`).

---

## Goals

- [x] Bootstrap Next.js + TypeScript + Tailwind (App Router, no `src/`)
- [x] Connect Stitch MCP and use it as UI source of truth
- [x] Implement "Kinetic Migrator - Register (Perfect Sync)"
- [x] Implement "Kinetic Migrator - Sign In (Dark Mode)"
- [x] Implement "Data Staging Center (High Contrast)"
- [x] Implement "Data Preview - Horizontal Table View"
- [x] Implement "Data Validation Center - Cleaned Header"
- [x] Implement "Data Validation Center - AI Closed"
- [x] Implement "Migration Pipeline Results (High Contrast)"
- [x] Split repo into `frontend/` + `backend/`
- [ ] Implement remaining Stitch screens (Mapping Hub, Processing, Admin Rule Hub, etc.)
- [ ] Wire remaining workspace screens to backend
- [ ] Ship production-ready migration validator

---

## Tech Stack

| Area | Choice | Notes |
|------|--------|--------|
| Frontend | Next.js `16.3.0` | App Router + Turbopack (`npm run dev` in `frontend/`) |
| Language | TypeScript `^5` | Strict typing via `frontend/tsconfig.json` |
| UI | React `19.2.8` / `react-dom` `19.2.8` | |
| Styling | Tailwind CSS `^4` + `@tailwindcss/postcss` | Tokens in `frontend/app/globals.css` |
| Fonts | IBM Plex Sans, IBM Plex Mono | `next/font/google` in `frontend/app/layout.tsx` |
| Icons | Material Symbols Outlined | Loaded in root layout; `Icon` wrapper |
| Linting | ESLint `^9` + `eslint-config-next` `16.3.0` | |
| Package manager | npm | Per-package lockfiles |
| Project layout | Monorepo | `frontend/` (Next) + `backend/` (Node auth) |
| Design source | Stitch MCP | Remix of SAP Migration Smart Validator |
| Backend | Node (`backend/`) | Auth register/login; workspace screens still mock |

---

## Stitch Source of Truth

| Item | Value |
|------|--------|
| Project title | Remix of SAP Migration Smart Validator |
| Project ID | `1119174885132838804` |
| Design system | Kinetic Enterprise |
| Primary brand | `#008fd3` (brand blue) / UI primary `#90cdff` |
| Register | `1ccd50df681a476c869065b8a2231fb7` — Perfect Sync |
| Sign In | `3166d45c07c9428a98efe1e086f42967` — Dark Mode |
| Staging | `14324518032497741044` — High Contrast |
| Preview | `fed1d1f289a040c8970f0472bd3b4ae6` — Horizontal Table View |
| Validation | `6e7ea4a050254afab8f3a107f6d66d2d` — AI Closed (current) |
| Validation (prior) | `7c9bd36a84f044e19748431f90bd9fac` — Cleaned Header |
| Pipeline Results | `aa1559614bba47afb8fb4705fc95d2e7` — High Contrast |
| Typical canvas | Desktop ~2560×2048 |

### Design theme notes

- **Auth:** dark glass card, ambient primary/secondary blur orbs
- **Workspace:** fixed `260px` sidebar + `64px` top bar; validation AI rail is `400px` and **closed by default** (AI Closed)
- **Typography:** IBM Plex Sans (UI); IBM Plex Mono (data / status)
- **Register inputs:** underline glow `#008fd3` (`.glow-input`)
- **Sign In inputs:** underline glow `#90cdff` (`.glow-input-primary`)
- **Register CTA:** `brand-blue`; **Sign In CTA:** `primary-container` + arrow
- **CSS utilities:** `.glass-panel` (auth), `.workspace-glass`, `.upload-zone`, `.drop-zone`, `.assistant-panel`
- **Validation AI Closed:** main content uses full width beside sidebar; **Suggest via AI** opens the assistant rail

---

## Routes

| Path | Screen | Notes |
|------|--------|--------|
| `/` | Redirect | → `/register` |
| `/register` | Register | Auth glass card |
| `/signin` | Sign In | Auth glass card (no system-status strip) |
| `/staging` | Data Staging Center | Upload / preload–postload |
| `/preview` | Data Preview | Preload / postload table tabs |
| `/validation` | Data Validation Center | AI Closed; Suggest via AI opens rail |
| `/reports` | Migration Pipeline Results | High Contrast metrics + issues table |

**Workspace nav wiring** (`frontend/lib/mock/workspace.ts`):

| Nav item | Href |
|----------|------|
| Upload | `/staging` |
| Display | `/preview` |
| Validate | `/validation` |
| Reports | `/reports` |
| Help / Logs | `#` (not implemented) |

---

## Project Structure

```
.
├── frontend/                       # Next.js App Router UI
│   ├── app/
│   │   ├── globals.css
│   │   ├── layout.tsx
│   │   ├── page.tsx                # Redirect → /register
│   │   ├── register/page.tsx
│   │   ├── signin/page.tsx
│   │   ├── staging/page.tsx
│   │   ├── preview/page.tsx
│   │   ├── validation/page.tsx
│   │   └── reports/page.tsx
│   ├── components/
│   │   ├── auth/
│   │   ├── layout/                 # SideNav, TopAppBar
│   │   ├── staging/
│   │   ├── preview/
│   │   ├── validation/
│   │   ├── pipeline/               # Migration Pipeline Results
│   │   └── ui/
│   ├── lib/
│   │   ├── api/auth.ts             # Backend auth client
│   │   └── mock/                   # Screen copy + table fixtures
│   ├── public/
│   └── package.json
├── backend/                        # Node auth API
│   ├── src/
│   └── package.json
├── project.md
├── README.md
├── AGENTS.md / CLAUDE.md
└── .cursor/mcp.json                # Stitch MCP (do not commit secrets)
```

---

## Scripts

| Command | Description |
|---------|-------------|
| `cd frontend && npm run dev` | Frontend dev server (http://localhost:3000) |
| `cd frontend && npm run build` | Frontend production build |
| `cd frontend && npm run lint` | Frontend ESLint |
| `cd backend && npm start` | Backend auth API (see backend README / package scripts) |

---

## Architecture & Conventions

- **Routing:** Next.js App Router; thin `page.tsx` shells compose screen components
- **Path alias:** `@/*` → project root
- **No `src/` directory**
- **Stitch is UI source of truth** — match layout, typography, colors, spacing, dimensions; do not invent extra UI
- **Shared workspace chrome:** one `SideNav`; `TopAppBar` variants per screen
- **Mock workspace data:** `frontend/lib/mock/*` for staging/preview/validation/pipeline
- **Auth API client:** `frontend/lib/api/auth.ts` → `backend` register/login
- **Auth vs workspace surfaces:** `.glass-panel` for auth; `.workspace-glass` / `.drop-zone` / `.assistant-panel` for validation workspace
- Keep this file current when adding screens or structural changes

---

## Features

| Feature | Status | Notes |
|---------|--------|--------|
| Next.js + TS + Tailwind scaffold | Done | |
| Stitch MCP as UI source | Done | Project `1119174885132838804` |
| Register (`/register`) | Done | Perfect Sync; logo `h-36` |
| Sign In (`/signin`) | Done | Dark Mode; logo `h-48`; no SystemStatus |
| Staging (`/staging`) | Done | High Contrast upload hub |
| Preview (`/preview`) | Done | Preload/postload horizontal tables |
| Validation (`/validation`) | Done | AI Closed; assistant closed by default + Suggest via AI |
| Pipeline Results (`/reports`) | Done | High Contrast metrics + issues table |
| Mapping / Processing / Admin Rule Hub | Planned | Stitch screens exist; not built |
| Auth API (`frontend` ↔ `backend`) | Done | Register/login wired |
| Workspace API integration | Planned | Staging/preview/validation/reports still mock |

---

## Screen component maps

### Register

```
RegisterScreen
├── AuthBackground
└── RegisterCard (GlassPanel)
    ├── RegisterHeader
    ├── RegisterForm (TextField ×4, Checkbox, Button brand)
    └── RegisterFooter → /signin
```

Mock: `lib/mock/register.ts`

### Sign In

```
SignInScreen
├── AuthBackground
└── SignInCard (GlassPanel)
    ├── SignInHeader
    ├── SignInForm (email, password + visibility + forgot, Button primary)
    └── SignInFooter → /register
```

Mock: `lib/mock/signin.ts`

### Staging

```
StagingScreen
├── SideNav (active: upload)
├── TopAppBar (variant: staging, pageTitle)
└── main
    ├── StagingPageHeader
    ├── UploadZoneCard × 2
    ├── ValidationPipeline
    └── TransformationDocuments
```

Mock: `lib/mock/staging.ts`

### Preview

```
PreviewScreen (client tabs)
├── SideNav (active: display)
├── TopAppBar (variant: preview)
└── main
    ├── PreviewActionBar
    ├── PreviewControls
    └── PreviewTablePane × 2
```

Mock: `lib/mock/preview.ts`

### Validation

```
ValidationScreen (client: assistantOpen, default false)
├── SideNav (active: validate — shared chrome)
├── TopAppBar (variant: validation; assistantOpen shrinks right edge when open)
├── AiAssistantPanel (closed by default; opens via Suggest via AI)
└── main (pl-sidebar; xl:pr-assistant only when open)
    ├── ValidationPageHeader ("Data Cleaning Results")
    ├── SourceDataUpload
    ├── ActiveRulesetCard + ExecuteCleaningButton
    └── CleaningReport (Suggest via AI + Download)
```

Mock: `lib/mock/validation.ts`  
Stitch: **Data Validation Center - AI Closed** (`6e7ea4a050254afab8f3a107f6d66d2d`)

### Pipeline Results (Reports)

```
PipelineResultsScreen
├── SideNav (active: reports)
├── TopAppBar (variant: reports — logo + mono status + notif/settings)
└── main (md:ml-sidebar; max-w 1600)
    ├── PipelineResultsHeader
    ├── PipelineMetricsRow (4 metric cards + health gauge)
    └── PipelineIssuesTable (filters + table + pagination)
```

Mock: `frontend/lib/mock/pipeline.ts`  
Stitch: **Migration Pipeline Results (High Contrast)** (`aa1559614bba47afb8fb4705fc95d2e7`)

---

## Environment & Tooling

### Cursor / MCP

- Stitch MCP configured in `.cursor/mcp.json`
- Do **not** commit or paste API keys into this document
- Local Stitch HTML exports may live under ignored paths (e.g. `/stitch-assets`)

### Local notes

- Dev server: port **3000**
- `/` → `/register`
- Prefer absolute imports via `@/`

---

## Decisions Log

| Date | Decision | Reason |
|------|----------|--------|
| 2026-08-12 | Next.js App Router, TypeScript, Tailwind 4 | Initial stack |
| 2026-08-12 | No `src/` directory | Flat `app/` + `components/` |
| 2026-08-12 | Maintain `project.md` as living doc | Project context |
| 2026-08-12 | Stitch is UI source of truth | Match generated designs |
| 2026-08-12 | Thin pages + feature folders + `components/ui` | Reuse without bloating `page.tsx` |
| 2026-08-12 | Auth forms call Node backend; workspace screens stay mock | Backend exists for auth only |
| 2026-08-12 | Dark Stitch tokens for auth | Screen HTML is dark |
| 2026-08-12 | Shared `SideNav` / `TopAppBar` | Avoid chrome duplication |
| 2026-08-12 | Button/TextField variants | Sign In needs primary glow/CTA without breaking Register |
| 2026-08-12 | Auth `.glass-panel` ≠ `.workspace-glass` | Different Stitch glass recipes |
| 2026-08-12 | Preview tabs = client state | Matches Stitch preload/postload switcher |
| 2026-08-12 | Validation shell uses padding, not `flex-1`+`ml-*` | Fixed sidebar caused overflow / “magnified” feel |
| 2026-08-12 | Validation Cleaned Header uses default SideNav | Stitch removed K badge, New Migration, search, notif/settings |
| 2026-08-12 | Validation AI Closed is default UI | Stitch screen `6e7ea4a050254afab8f3a107f6d66d2d`; assistant hidden until Suggest via AI |
| 2026-08-12 | Validation top bar / main pad follow assistantOpen | Avoid empty 400px gutter when rail is closed |
| 2026-08-12 | Repo split into `frontend/` + `backend/` | Monorepo layout on `master` |
| 2026-08-12 | Pipeline Results at `/reports` | Matches SideNav Reports active state in Stitch |
| 2026-08-12 | Reports TopAppBar uses logo + mono status (no avatar) | Match Pipeline Results Stitch chrome |

---

## Changelog

### 2026-08-12

- Scaffolded Next.js + TypeScript + Tailwind; added living `project.md`
- Implemented Register + Sign In from Stitch (auth glass, mock forms, linked footers)
- Implemented Staging (`/staging`), Preview (`/preview`), Validation (`/validation`)
- Extracted `lib/mock/workspace.ts` + shared `SideNav` / `TopAppBar`
- Wired Upload → staging, Display → preview, Validate → validation
- Fixed validation layout overflow vs staging/preview
- Synced Validation **Cleaned Header** (shared nav; minimal top bar)
- Removed Sign In SystemStatus (not in current Sign In Stitch HTML)
- Synced Validation to **AI Closed**: closed assistant rail, **Suggest via AI**, title/subtitle "Data Cleaning Results"
- Moved workspace UI into monorepo `frontend/` (staging / preview / validation + shared chrome); preserved `frontend/lib/api/auth.ts`
- Implemented **Migration Pipeline Results** at `/reports` from Stitch High Contrast (metrics bento + issues table)
- Wired SideNav Reports → `/reports`
- Refreshed this document to match the current codebase tree and routes

---

## Open Questions / TODO

- [ ] Remaining Stitch screens: AI Analysis & Mapping Hub, Processing Data, Admin Rule & Validation Hub
- [ ] Backend contracts for staging/preview/validation/reports
- [ ] Deployment target (e.g. Vercel + API host)?

---

## How to update this file

When making meaningful progress: bump **Last updated**, adjust **Features** / **Routes** / **Structure**, add a **Changelog** line and any **Decisions Log** entries. Keep secrets out of this file.
