# Project Overview

Living document for this project. Update this file as features, decisions, and architecture change.

**Last updated:** 2026-08-12  
**Status:** Frontend/backend split + auth API scaffolded  
**Package name:** `cursor-final` (frontend) / `kinetic-migrator-backend`  
**Product:** Kinetic Migrator (SAP Migration Smart Validator)

---

## Summary

Monorepo for **Kinetic Migrator / SAP Migration Smart Validator**. UI lives in `frontend/` (Next.js, Stitch-driven). Auth API lives in `backend/` (Node.js + Express + PostgreSQL + JWT). Auth screens implemented: Register and Sign In (still mock-wired in the UI).

---

## Goals

- [x] Bootstrap Next.js + TypeScript + Tailwind (App Router, no `src/`)
- [x] Connect Stitch MCP and use it as UI source of truth
- [x] Implement "Kinetic Migrator - Register (Perfect Sync)" screen
- [x] Implement "Kinetic Migrator - Sign In (Dark Mode)" screen
- [x] Split repo into `frontend/` + `backend/`
- [x] Scaffold Express auth (register, login, JWT middleware, user schema)
- [ ] Wire frontend forms to Express auth API
- [ ] Implement remaining Stitch screens
- [ ] Ship production-ready migration validator

---

## Tech Stack

| Area | Choice | Notes |
|------|--------|--------|
| Framework | Next.js `16.3.0` | App Router under `frontend/` |
| Language | TypeScript `^5` | Strict typing via `frontend/tsconfig.json` |
| UI | React `19.2.8` | |
| Styling | Tailwind CSS `^4` | Design tokens from Stitch |
| Fonts | IBM Plex Sans, IBM Plex Mono | From Stitch screen + design system |
| Icons | Material Symbols Outlined | Matches Stitch HTML |
| Linting | ESLint `^9` + `eslint-config-next` | |
| Package manager | npm | Separate lockfiles in `frontend/` and `backend/` |
| Project layout | `frontend/` + `backend/` | UI under `frontend/` (no `src/`); API under `backend/src/` |
| Design source | Stitch MCP | Project: SAP Migration Smart Validator |
| Backend | Node.js + Express | PostgreSQL, bcryptjs, JWT |
| Database | PostgreSQL | Schema in `backend/sql/schema.sql` |

---

## Stitch Source of Truth

| Item | Value |
|------|--------|
| Project title | SAP Migration Smart Validator |
| Project ID | `9396736901768660635` |
| Design system | Kinetic Enterprise |
| Primary brand | `#008fd3` (SAP / brand blue) |
| Screen implemented | **Register (Perfect Sync)**, **Sign In (Dark Mode)** |
| Register screen ID | `1ccd50df681a476c869065b8a2231fb7` |
| Sign In screen ID | `3166d45c07c9428a98efe1e086f42967` |
| Screen size | Desktop instances; HTML canvas typically 2560×2048 |

### Design theme notes (from Stitch)

- Dark auth UI with glass panel card
- Background orbs: primary blue + secondary violet blurs
- Typography: IBM Plex Sans (labels, headlines, body); JetBrains/IBM Plex Mono for status
- Register inputs: underline glow focus `#008fd3`
- Sign In inputs: underline glow focus `#90cdff` (primary)
- Register CTA: brand blue; Sign In CTA: `primary-container` `#2098dd` + arrow icon

---

## Project Structure

```
.
├── frontend/
│   ├── app/
│   │   ├── globals.css
│   │   ├── layout.tsx
│   │   ├── page.tsx                 # Redirects to /register
│   │   ├── register/page.tsx
│   │   └── signin/page.tsx
│   ├── components/
│   │   ├── auth/                    # Register + Sign In screens
│   │   └── ui/                      # Button, Checkbox, GlassPanel, Icon, TextField
│   ├── lib/mock/
│   ├── public/
│   ├── package.json
│   └── tsconfig.json                # `@/*` → frontend root
├── backend/
│   ├── src/
│   │   ├── index.js
│   │   ├── db.js
│   │   ├── routes/auth.js           # register, login, me
│   │   ├── middleware/auth.js       # JWT Bearer guard
│   │   └── models/user.js
│   ├── sql/schema.sql
│   ├── .env.example
│   └── package.json
├── .cursor/skills/multitask/
├── project.md
└── README.md
```

---

## Scripts

### Frontend (`cd frontend`)

| Command | Description |
|---------|-------------|
| `npm run dev` | Start Next.js (http://localhost:3000) |
| `npm run build` | Production build |
| `npm run start` | Run production server |
| `npm run lint` | Run ESLint |

### Backend (`cd backend`)

| Command | Description |
|---------|-------------|
| `npm run dev` | Express with `--watch` (http://localhost:4000) |
| `npm start` | Production start |

---

## Architecture & Conventions

- **Routing:** Next.js App Router (`frontend/app/`)
- **Path alias:** `@/*` → `frontend/` root
- **No `src` directory** in the frontend
- **UI source of truth:** Stitch screens via MCP — match layout, typography, colors, spacing, and dimensions; do not invent extra UI
- **Page shells stay thin:** compose screens from `components/`; avoid putting full UI in `page.tsx`
- **Auth API:** Express under `backend/`; UI forms still use `lib/mock/` until wired
- Prefer updating this file when adding screens, dependencies, or structural changes

---

## Features

| Feature | Status | Notes |
|---------|--------|--------|
| Next.js + TS + Tailwind scaffold | Done | Created 2026-08-12 |
| Stitch MCP as UI source | Done | Project linked |
| Register screen (`/register`) | Done | Perfect Sync screen from Stitch |
| Sign In screen (`/signin`) | Done | Dark Mode screen from Stitch |
| `frontend/` + `backend/` split | Done | Via `/multitask` |
| Express auth API | Done | register, login, JWT `/me`, PostgreSQL users |
| Wire UI forms to auth API | Planned | Mock submit handlers remain |
| Other Stitch screens | Planned | Not invented yet |

---

## Register screen — component map

```
RegisterScreen
├── AuthBackground
└── RegisterCard (GlassPanel)
    ├── RegisterHeader (logo, title, subtitle)
    ├── RegisterForm
    │   ├── TextField × 4 (name, email, password, confirm)
    │   ├── Checkbox (terms)
    │   └── Button (Create Account)
    └── RegisterFooter (→ /signin)
```

Mock data: `frontend/lib/mock/register.ts`. Submit handler is local-only (API exists under `backend/`).

---

## Sign In screen — component map

```
SignInScreen
├── AuthBackground
└── container
    ├── SignInCard (GlassPanel)
    │   ├── SignInHeader (logo + subtitle only)
    │   ├── SignInForm
    │   │   ├── TextField (email)
    │   │   ├── TextField (password + visibility + forgot link)
    │   │   └── Button primary (Sign In + arrow)
    │   └── SignInFooter (→ /register)
    └── SystemStatus
```

Mock data: `frontend/lib/mock/signin.ts`. Submit handler is local-only (API exists under `backend/`).

---

## Environment & Tooling

### Cursor / MCP

- Stitch MCP server configured in `.cursor/mcp.json`
- Do **not** commit or paste API keys into this document

### Local notes

- Frontend uses port **3000**; backend uses port **4000**
- `/` redirects to `/register`
- Copy `backend/.env.example` → `backend/.env` and apply `backend/sql/schema.sql` before starting the API

---

## Decisions Log

| Date | Decision | Reason |
|------|----------|--------|
| 2026-08-12 | Next.js App Router, TypeScript, Tailwind | Initial stack |
| 2026-08-12 | No `src` directory | Keep layout flat under `app/` |
| 2026-08-12 | Maintain `project.md` as living project doc | Ongoing project context |
| 2026-08-12 | Stitch is UI source of truth | Match generated designs closely |
| 2026-08-12 | Reusable `components/ui` + `components/auth` | Keep `page.tsx` thin; enable reuse |
| 2026-08-12 | Mock data only; no FastAPI yet | Per product requirements |
| 2026-08-12 | Use Stitch dark tokens for Register (not light design.md defaults) | Screen HTML is dark-mode Perfect Sync |
| 2026-08-12 | Extend shared Button/TextField instead of duplicating | Sign In needs variants; Register stays compatible |
| 2026-08-12 | Sign In glow uses primary `#90cdff` via `glow-input-primary` | Matches Sign In Stitch HTML without changing Register glow |
| 2026-08-12 | Split into `frontend/` + Express/PostgreSQL `backend/` | `/multitask` skill; Node auth instead of FastAPI |

---

## Changelog

### 2026-08-12

- Scaffolded empty Next.js app with TypeScript and Tailwind CSS
- App Router enabled; no `src` directory
- Added `project.md` as the ongoing project documentation file
- Inspected Stitch project **SAP Migration Smart Validator** and screen **Kinetic Migrator - Register (Perfect Sync)**
- Implemented Register UI with reusable components, design tokens, mock data, and `/register` route
- Inspected and implemented **Kinetic Migrator - Sign In (Dark Mode)** at `/signin`
- Extended shared `Button` (variants) and `TextField` (labelEnd, endAdornment, glowVariant)
- Linked Register ↔ Sign In footers
- Moved UI into `frontend/`; added Express + PostgreSQL auth API under `backend/` (register, login, JWT middleware)

---

## Open Questions / TODO

- [ ] Implement next Stitch screens (dashboard, staging, mapping, etc.) as needed
- [ ] Wire Register / Sign In forms to `POST /api/auth/*`
- [ ] Deployment target (e.g. Vercel + separate API host)?

---

## How to update this file

When making meaningful progress, add a short entry under **Changelog**, update **Features** / **Decisions Log**, and bump **Last updated**. Keep secrets out of this file.
