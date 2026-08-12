---
name: multitask
description: >-
  Splits a repo into frontend/ and backend/: moves existing UI into frontend/,
  then scaffolds a Node.js + Express + PostgreSQL auth API (register, login,
  JWT middleware, user model). Use when the user invokes /multitask or asks to
  restructure into frontend/backend with login and registration.
disable-model-invocation: true
---

# Multitask: Frontend Split + Backend Auth

When this skill is invoked, complete **both** tasks below in order. Do not stop after step 1.

## Task progress

```
Task Progress:
- [ ] 1. Create frontend/ and move existing frontend files
- [ ] 2. Fix broken import/require paths after the move
- [ ] 3. Create backend/ with login and registration (Express + PostgreSQL)
- [ ] 4. Verify both apps still start / document how to run them
```

---

## 1. Create a frontend/ folder and move all existing frontend files into it, preserving the current folder structure and relative import paths. Update any import/require paths that break as a result of the move.

### What to move

Treat as frontend and move into `frontend/` (preserve relative tree):

- `app/`
- `components/`
- `lib/`
- `public/`
- Frontend config and lockfiles that belong with the UI: `package.json`, `package-lock.json`, `tsconfig.json`, `next.config.ts`, `postcss.config.mjs`, `eslint.config.mjs`, `next-env.d.ts` (if present)
- UI-only assets/docs only if they are clearly frontend-scoped

### What to leave at repo root (do not bury in frontend/)

- `.git/`, `.gitignore`, `.cursor/`, `AGENTS.md`, `CLAUDE.md`, `README.md`, `project.md`
- Any existing or new `backend/` tree
- Root monorepo helpers only if you intentionally add them (optional root README updates are OK)

### Move rules

1. Create `frontend/` at the repository root.
2. Move files/folders with git-aware moves when the tree is tracked (`git mv`) so history is preserved; otherwise use normal filesystem moves.
3. Preserve the **internal** folder structure under `frontend/` so relative imports between moved files stay valid (e.g. `components/` still sits beside `app/` inside `frontend/`).
4. After the move, fix anything that **does** break:
   - Tooling paths that assumed repo root (`eslint` ignores, `tsconfig` paths, Next config)
   - Scripts/docs that reference old paths
   - Absolute/`@/` aliases: update `tsconfig` `paths` and any imports if the alias base changed
5. Confirm `frontend/package.json` scripts still run from `frontend/` (`npm run dev`, `build`, `lint`).

### Do not

- Flatten or rename UI folders unless required for the move
- Duplicate the frontend tree (one copy under `frontend/` only)
- Put Express/backend code inside `frontend/`

---

## 2. Create a backend/ folder and set up a new login and registration system inside it, including:

- **POST /api/auth/register** — create a new user (hash passwords with bcrypt, validate email/password, prevent duplicate accounts)
- **POST /api/auth/login** — authenticate a user and return a JWT (or session token)
- **Basic middleware** to protect authenticated routes
- **A simple user model/schema** (email, hashed password, created_at, etc.)

**Tech stack:** Use PostgreSQL as database and Node.js, Express JS as backend.

### Backend layout (create under `backend/`)

```
backend/
├── package.json
├── .env.example
├── src/
│   ├── index.js          # Express app entry (or .ts if project is TypeScript)
│   ├── db.js             # PostgreSQL pool / connection
│   ├── routes/
│   │   └── auth.js       # register + login routes
│   ├── middleware/
│   │   └── auth.js       # protect authenticated routes (JWT verify)
│   └── models/
│       └── user.js       # user schema helpers / queries
└── sql/
    └── schema.sql        # users table DDL
```

Prefer JavaScript unless the repo already standardizes on TypeScript for services; keep the stack simple and runnable.

### User model / schema

Minimum columns:

| Column | Notes |
|--------|--------|
| `id` | Primary key (UUID or serial) |
| `email` | Unique, required, normalized (lowercase/trim) |
| `password_hash` | bcrypt hash only — never store plaintext |
| `created_at` | Timestamp default now() |

Optional but useful: `updated_at`.

Provide `sql/schema.sql` (or a migration) that creates the `users` table with a unique constraint on `email`.

### POST /api/auth/register

1. Accept JSON body: `email`, `password` (and only other fields if clearly needed).
2. Validate:
   - email format
   - password minimum length (e.g. ≥ 8) and non-empty
3. Reject duplicate email with **409** (or **400** with a clear message) — never leak password hashes.
4. Hash password with **bcrypt** before insert.
5. Insert user; return **201** with public user fields (`id`, `email`, `created_at`) — **do not** return `password_hash`.

### POST /api/auth/login

1. Accept JSON body: `email`, `password`.
2. Look up user by email; use a constant-time-friendly failure path (same generic error if user missing or password wrong).
3. Compare password with bcrypt.
4. On success, return a **JWT** (or session token) plus basic user info (`id`, `email`).
5. Sign JWT with a secret from env (`JWT_SECRET`); include standard claims (`sub`/`userId`, `email`, expiry).

### Auth middleware

- Read `Authorization: Bearer <token>` (or documented alternative).
- Verify JWT; attach `req.user` (`id`, `email`).
- On failure, respond **401**.
- Mount at least one example protected route (e.g. `GET /api/auth/me`) that uses the middleware so protection is demonstrable.

### Express app requirements

- `express.json()` body parsing
- Auth routes mounted at `/api/auth`
- CORS enabled for the frontend origin (configurable via env)
- Centralized error handling; no stack traces with secrets in production responses
- Dependencies: `express`, `bcrypt` (or `bcryptjs`), `jsonwebtoken`, `pg`, `dotenv`, plus `cors`

### Environment

Ship `.env.example` (not real secrets) with:

```
PORT=4000
DATABASE_URL=postgresql://user:password@localhost:5432/dbname
JWT_SECRET=change-me-in-production
JWT_EXPIRES_IN=1d
CORS_ORIGIN=http://localhost:3000
```

Add `backend/.env` to `.gitignore` if not already covered.

### Scripts

In `backend/package.json`:

- `dev` — run with watch (e.g. `node --watch` or nodemon)
- `start` — production start
- Document in README or root README: how to create the DB, run `schema.sql`, set env, start backend, start frontend

---

## Execution order

1. Finish the **frontend/** move and path fixes first.
2. Scaffold **backend/** auth second so API paths and CORS can target the real frontend dev URL.
3. Optionally wire the existing Sign In / Register UI forms to the new API — only if straightforward and the user did not forbid it; otherwise leave mock UI working and document the API contract.
4. Update `project.md` tech-stack notes if the file exists (backend is Node/Express/PostgreSQL for this split).

## Done criteria

- [ ] All former UI app files live under `frontend/` with working relative structure
- [ ] Broken imports/config paths from the move are fixed
- [ ] `backend/` implements register, login, JWT (or session) auth middleware, and user schema on PostgreSQL
- [ ] Passwords hashed with bcrypt; duplicate emails rejected; `.env.example` present
- [ ] Clear run instructions for frontend + backend
