# Cardrex

Cardrex is a mobile-first digital collectible card experience. This repository currently
contains the Phase 1 web foundation and Phase 1.5 cosmic interface polish. Phase 2 adds a
validated guest identity and temporary, browser-persisted session flow while preserving the
existing route placeholders and reusable UI primitives. Secure claims remain reserved for
later phases.

## Prerequisites

- Node.js 22 or newer
- npm 10 or newer

## Local setup

```bash
git clone <repository-url>
cd cardrex
npm install
cp .env.example .env.local
npm run dev
```

Open the URL printed by Vite (normally `http://localhost:5173`). Vite reloads the browser
as source files change.

Environment values prefixed with `VITE_` are included in the browser bundle. Never place
secrets in a `VITE_` variable. The included values are placeholders for future API work.

## Available commands

| Command                | Purpose                                              |
| ---------------------- | ---------------------------------------------------- |
| `npm run dev`          | Start the Vite development server.                   |
| `npm run build`        | Type-check and create a production build in `dist/`. |
| `npm run preview`      | Serve the production build locally.                  |
| `npm run lint`         | Run ESLint.                                          |
| `npm run format`       | Format supported files with Prettier.                |
| `npm run format:check` | Check formatting without changing files.             |
| `npm test`             | Run the Vitest suite once.                           |

## Routes

| Route         | Screen                             |
| ------------- | ---------------------------------- |
| `/`           | Landing page                       |
| `/guest`      | Temporary guest username           |
| `/sign-in`    | Account sign-in placeholder        |
| `/claim`      | Protected card-opening placeholder |
| `/collection` | Protected collection placeholder   |

## Project layout

```text
src/
├── components/
│   ├── layout/       # Shared shell and page headings
│   ├── routing/      # Guest route protection
│   └── ui/           # Button, card, loading, and modal primitives
├── guest/            # Guest-session service, provider, validation, and tests
├── pages/            # Route-level screens
├── test/             # Shared test configuration
├── index.css         # Tailwind import, theme tokens, and global styles
├── main.tsx          # React entry point
└── router.tsx        # React Router route map
```

Architecture and future-phase decisions are recorded in
[`docs/mvp-architecture.md`](docs/mvp-architecture.md).

## Phase 2: temporary guest sessions

A guest chooses a 3–20 character display name. Cardrex creates a separate opaque ID, so the
display name is never treated as identity and duplicate display names are allowed. The
session service validates data before restoring it, and the provider keeps storage details
out of pages and components. Protected routes preserve `/claim` or `/collection` as the
intended destination when they redirect a visitor to `/guest`.

Phase 3 replaces browser persistence with a backend-issued, HTTP-only cookie. Use **Leave guest** in the header or **Continue as different guest** on the guest screen to revoke the server session and clear the cookie.

## Current scope limitations

- Guest sessions provide temporary pseudonymous access, not registered accounts.
- Sign-in, rarity selection, card persistence, and the reveal animation are not implemented yet.
- All visible symbols and presentation are original interface elements; character artwork
  will be introduced with recorded provenance in a later phase.

## Phase 3 development

### Prerequisites and setup

Cardrex now uses the existing React/Vite frontend, an Express/TypeScript API, and PostgreSQL through Prisma. Start PostgreSQL with `npm run db:up`. Copy `.env.example` to `.env.local`, copy `server/.env.example` to `server/.env`, then install backend dependencies with `npm install --prefix server`. The example database credentials are local-development values only.

Apply the initial schema with `npm run prisma:migrate` (or `npm --prefix server run prisma:migrate -- --name init` when creating a new migration) and validate it with `npm run prisma:validate`.

Run the frontend with `npm run dev:frontend` and the API with `npm run dev:backend` in separate terminals. Use `npm run db:down` to stop PostgreSQL. Frontend tests use `npm test`; backend tests use `npm run test:backend`; both use `npm run test:all`.

### API

| Method   | Endpoint                 | Purpose                                                               |
| -------- | ------------------------ | --------------------------------------------------------------------- |
| `GET`    | `/api/health`            | API readiness response                                                |
| `POST`   | `/api/guest-sessions`    | Validate a display name, create a guest session, and issue its cookie |
| `GET`    | `/api/guest-sessions/me` | Restore the valid guest represented by the cookie                     |
| `DELETE` | `/api/guest-sessions/me` | Revoke the current guest session and clear its cookie                 |

Requests from the frontend include credentials. Set `FRONTEND_ORIGIN` to the exact permitted browser origin. `COOKIE_SAME_SITE=lax` is appropriate for same-site deployments; use `none` only for a genuinely cross-site HTTPS deployment (production cookies are always `Secure`).

### Guest-session security model

The API creates a cryptographically random 256-bit token. Only its SHA-256 hash is persisted in PostgreSQL; the raw token exists solely in an HTTP-only cookie and is never returned in JSON or stored in browser storage. Session lookup authenticates by token hash and rejects missing, expired, or revoked rows. Logging out revokes the database row before clearing the cookie. Display names are trimmed and validated (3–20 letters, numbers, spaces, underscores, or hyphens), may be duplicated, and are presentation data—not authentication.
