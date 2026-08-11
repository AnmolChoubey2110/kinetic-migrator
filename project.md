# Project Overview

Living document for this project. Update this file as features, decisions, and architecture change.

**Last updated:** 2026-08-12  
**Status:** UI implementation in progress  
**Package name:** `cursor-final`  
**Product:** Kinetic Migrator (SAP Migration Smart Validator)

---

## Summary

Next.js application for **Kinetic Migrator / SAP Migration Smart Validator**. UI is driven by the Stitch project as the source of truth. Auth screens implemented: Register and Sign In.

---

## Goals

- [x] Bootstrap Next.js + TypeScript + Tailwind (App Router, no `src/`)
- [x] Connect Stitch MCP and use it as UI source of truth
- [x] Implement "Kinetic Migrator - Register (Perfect Sync)" screen
- [x] Implement "Kinetic Migrator - Sign In (Dark Mode)" screen
- [ ] Implement remaining Stitch screens
- [ ] Wire FastAPI backend (not yet)
- [ ] Ship production-ready migration validator

---

## Tech Stack

| Area | Choice | Notes |
|------|--------|--------|
| Framework | Next.js `16.3.0` | App Router |
| Language | TypeScript `^5` | Strict typing via `tsconfig.json` |
| UI | React `19.2.8` | |
| Styling | Tailwind CSS `^4` | Design tokens from Stitch |
| Fonts | IBM Plex Sans, IBM Plex Mono | From Stitch screen + design system |
| Icons | Material Symbols Outlined | Matches Stitch HTML |
| Linting | ESLint `^9` + `eslint-config-next` | |
| Package manager | npm | `package-lock.json` present |
| Project layout | No `src/` | Routes under `app/`, UI under `components/` |
| Design source | Stitch MCP | Project: SAP Migration Smart Validator |
| Backend | FastAPI | **Not connected yet** — mock data only |

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
├── app/
│   ├── globals.css              # Stitch design tokens + glass utilities
│   ├── layout.tsx               # IBM Plex fonts + Material Symbols
│   ├── page.tsx                 # Redirects to /register
│   ├── register/
│   │   └── page.tsx             # Register route (thin page shell)
│   └── signin/
│       └── page.tsx             # Sign In route (thin page shell)
├── components/
│   ├── auth/
│   │   ├── AuthBackground.tsx   # Ambient blur orbs (shared)
│   │   ├── RegisterCard.tsx
│   │   ├── RegisterFooter.tsx
│   │   ├── RegisterForm.tsx
│   │   ├── RegisterHeader.tsx
│   │   ├── RegisterScreen.tsx
│   │   ├── SignInCard.tsx
│   │   ├── SignInFooter.tsx
│   │   ├── SignInForm.tsx
│   │   ├── SignInHeader.tsx
│   │   ├── SignInScreen.tsx
│   │   └── SystemStatus.tsx     # Online status under Sign In card
│   └── ui/
│       ├── Button.tsx           # variants: brand | primary
│       ├── Checkbox.tsx
│       ├── GlassPanel.tsx
│       ├── Icon.tsx
│       └── TextField.tsx        # labelEnd, endAdornment, glowVariant
├── lib/
│   └── mock/
│       ├── register.ts
│       └── signin.ts
├── public/
│   └── kinetic-logo.png
├── .cursor/
│   └── mcp.json
├── package.json
├── project.md
└── README.md
```

---

## Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start local dev server (http://localhost:3000) |
| `npm run build` | Production build |
| `npm run start` | Run production server |
| `npm run lint` | Run ESLint |

---

## Architecture & Conventions

- **Routing:** Next.js App Router (`app/`)
- **Path alias:** `@/*` → project root
- **No `src` directory**
- **UI source of truth:** Stitch screens via MCP — match layout, typography, colors, spacing, and dimensions; do not invent extra UI
- **Page shells stay thin:** compose screens from `components/`; avoid putting full UI in `page.tsx`
- **Data:** mock modules under `lib/mock/` until FastAPI is connected
- Prefer updating this file when adding screens, dependencies, or structural changes

---

## Features

| Feature | Status | Notes |
|---------|--------|--------|
| Next.js + TS + Tailwind scaffold | Done | Created 2026-08-12 |
| Stitch MCP as UI source | Done | Project linked |
| Register screen (`/register`) | Done | Perfect Sync screen from Stitch |
| Sign In screen (`/signin`) | Done | Dark Mode screen from Stitch |
| Other Stitch screens | Planned | Not invented yet |
| FastAPI integration | Blocked | Explicitly deferred |

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

Mock data: `lib/mock/register.ts`. Submit handler is local-only (no API).

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

Mock data: `lib/mock/signin.ts`. Submit handler is local-only (no API).

---

## Environment & Tooling

### Cursor / MCP

- Stitch MCP server configured in `.cursor/mcp.json`
- Do **not** commit or paste API keys into this document

### Local notes

- Dev server uses port **3000** by default
- `/` redirects to `/register`

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

---

## Open Questions / TODO

- [ ] Implement next Stitch screens (dashboard, staging, mapping, etc.) as needed
- [ ] FastAPI contracts for auth
- [ ] Deployment target (e.g. Vercel)?

---

## How to update this file

When making meaningful progress, add a short entry under **Changelog**, update **Features** / **Decisions Log**, and bump **Last updated**. Keep secrets out of this file.
