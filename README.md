# Cardrex

Cardrex is a mobile-first digital collectible card experience. This repository currently
contains the Phase 1 web foundation: a dark cosmic React interface, route placeholders,
reusable UI primitives, linting, formatting, and tests. Secure claims and persistence are
intentionally reserved for later phases.

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

| Route         | Screen                      |
| ------------- | --------------------------- |
| `/`           | Landing page                |
| `/guest`      | Temporary guest username    |
| `/sign-in`    | Account sign-in placeholder |
| `/claim`      | Card-opening placeholder    |
| `/collection` | Collection placeholder      |

## Project layout

```text
src/
├── components/
│   ├── layout/       # Shared shell and page headings
│   └── ui/           # Button, card, loading, and modal primitives
├── pages/            # Route-level screens
├── test/             # Shared test configuration
├── index.css         # Tailwind import, theme tokens, and global styles
├── main.tsx          # React entry point
└── router.tsx        # React Router route map
```

Architecture and future-phase decisions are recorded in
[`docs/mvp-architecture.md`](docs/mvp-architecture.md).

## Current scope limitations

- Guest names use `sessionStorage` only as a Phase 1 interface preview. A secure opaque,
  server-backed guest session will replace it in the identity phase.
- Sign-in, backend rarity selection, card persistence, and the reveal animation are not
  implemented yet.
- All visible symbols and presentation are original interface elements; character artwork
  will be introduced with recorded provenance in a later phase.
