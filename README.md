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

The session currently persists in this browser's `localStorage`, including across browser
restarts. This is temporary client-side continuity, **not authentication**. A later phase
will replace this implementation with a secure, backend-issued session without requiring
page components to access browser storage directly. Use **Leave guest** in the header or
**Continue as different guest** on the guest screen to erase the local guest session.

## Current scope limitations

- Browser-persisted guest identity is temporary and provides no authentication or security.
- Sign-in, backend rarity selection, card persistence, and the reveal animation are not
  implemented yet.
- All visible symbols and presentation are original interface elements; character artwork
  will be introduced with recorded provenance in a later phase.
