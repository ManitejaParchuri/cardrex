import { Link, Outlet } from 'react-router-dom';

export function AppLayout() {
  return (
    <div className="cosmic-shell relative isolate min-h-dvh overflow-hidden">
      <header className="mx-auto flex w-full max-w-5xl items-center justify-between px-5 py-5 sm:px-8">
        <Link
          to="/"
          className="inline-flex min-h-11 items-center gap-2 text-sm font-black tracking-[0.24em] text-white uppercase"
          aria-label="Cardrex home"
        >
          <span
            className="grid size-8 place-items-center rounded-xl border border-violet-300/30 bg-violet-500/15 text-violet-200 shadow-[0_0_24px_rgba(139,92,246,0.28)]"
            aria-hidden="true"
          >
            ✦
          </span>
          Cardrex
        </Link>
        <Link
          to="/collection"
          className="inline-flex min-h-11 items-center rounded-full border border-white/10 bg-white/5 px-4 text-sm font-semibold text-violet-100 transition hover:border-violet-300/30 hover:bg-white/10"
        >
          Collection
        </Link>
      </header>
      <main className="mx-auto flex w-full max-w-5xl flex-1 px-5 pb-10 sm:px-8">
        <Outlet />
      </main>
      <footer className="px-5 py-6 text-center text-xs text-violet-200/45">
        Original characters. Infinite stories.
      </footer>
    </div>
  );
}
