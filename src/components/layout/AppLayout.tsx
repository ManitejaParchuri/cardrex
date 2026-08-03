import { Link, Outlet } from 'react-router-dom';

import { CosmicBackground } from '../cosmic/CosmicBackground';

export function AppLayout() {
  return (
    <div className="cosmic-shell relative isolate min-h-dvh overflow-hidden">
      <CosmicBackground />
      <header className="mx-auto flex w-full max-w-5xl items-center justify-between px-5 py-5 sm:px-8">
        <Link
          to="/"
          className="brand-mark inline-flex min-h-11 items-center gap-2.5 text-sm font-black tracking-[0.24em] text-white uppercase"
          aria-label="Cardrex home"
        >
          <span
            className="brand-sigil grid size-9 place-items-center rounded-xl border border-violet-300/30 bg-violet-500/15 text-violet-100"
            aria-hidden="true"
          >
            ✦
          </span>
          Cardrex
        </Link>
        <Link
          to="/collection"
          className="nav-pill inline-flex min-h-11 items-center rounded-full px-4 text-sm font-semibold text-violet-50"
        >
          Collection
        </Link>
      </header>
      <main className="relative z-10 mx-auto flex w-full max-w-5xl flex-1 px-5 pb-10 sm:px-8">
        <Outlet />
      </main>
      <footer className="px-5 py-6 text-center text-xs text-violet-200/45">
        Original characters. Infinite stories.
      </footer>
    </div>
  );
}
