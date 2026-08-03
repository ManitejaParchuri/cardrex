import type { CSSProperties } from 'react';
import { Link, Outlet, useNavigate } from 'react-router-dom';

import { useGuestSession } from '../../guest/GuestSessionContext';

export function AppLayout() {
  const navigate = useNavigate();
  const { session, isLoading, resetSession } = useGuestSession();
  const stars = [
    ['8%', '18%', '2px', '4.6s', '-1s'],
    ['18%', '72%', '3px', '5.2s', '-3s'],
    ['31%', '34%', '2px', '3.8s', '-2s'],
    ['44%', '9%', '4px', '6s', '-4s'],
    ['57%', '81%', '2px', '4.2s', '-1.5s'],
    ['67%', '25%', '3px', '5.6s', '-3.5s'],
    ['79%', '64%', '2px', '3.6s', '-.5s'],
    ['91%', '15%', '3px', '4.8s', '-2.5s'],
    ['95%', '88%', '2px', '5.4s', '-4.5s'],
    ['24%', '91%', '2px', '4s', '-2s'],
  ];

  return (
    <div className="cosmic-shell relative isolate min-h-dvh overflow-hidden">
      <div className="star-field" aria-hidden="true">
        {stars.map(([left, top, size, speed, delay]) => (
          <span
            key={`${left}-${top}`}
            className="star"
            style={
              {
                left,
                top,
                '--star-size': size,
                '--star-speed': speed,
                '--star-delay': delay,
              } as CSSProperties
            }
          />
        ))}
      </div>
      <header className="mx-auto flex w-full max-w-6xl items-center justify-between px-5 py-5 sm:px-8 sm:py-6">
        <Link
          to="/"
          className="group inline-flex min-h-11 items-center gap-2 text-sm font-black tracking-[0.24em] text-white uppercase transition active:scale-[0.98]"
          aria-label="Cardrex home"
        >
          <span
            className="grid size-8 place-items-center rounded-xl border border-violet-300/30 bg-violet-500/15 text-violet-200 shadow-[0_0_24px_rgba(139,92,246,0.28)] transition group-hover:border-violet-200/60 group-hover:shadow-[0_0_30px_rgba(167,139,250,0.45)]"
            aria-hidden="true"
          >
            ✦
          </span>
          Cardrex
        </Link>
        <div className="flex items-center gap-2">
          {!isLoading && session ? (
            <>
              <span className="hidden text-sm text-violet-100/70 sm:inline">
                Guest:{' '}
                <strong className="text-violet-100">
                  {session.displayName}
                </strong>
              </span>
              <button
                type="button"
                className="inline-flex min-h-11 items-center px-2 text-xs font-semibold text-violet-300 underline underline-offset-4"
                onClick={async () => {
                  await resetSession();
                  navigate('/guest');
                }}
              >
                Leave guest
              </button>
            </>
          ) : null}
          <Link
            to="/collection"
            className="inline-flex min-h-11 items-center rounded-full border border-white/10 bg-white/5 px-4 text-sm font-semibold text-violet-100 backdrop-blur-md transition hover:-translate-y-0.5 hover:border-violet-300/40 hover:bg-white/10 active:translate-y-0 active:scale-[0.98]"
          >
            Collection
          </Link>
        </div>
      </header>
      <main className="mx-auto flex w-full max-w-6xl flex-1 px-5 pb-10 sm:px-8">
        <Outlet />
      </main>
      <footer className="px-5 py-6 text-center text-xs text-violet-200/45">
        Original characters. Infinite stories.
      </footer>
    </div>
  );
}
