import { Link } from 'react-router-dom';

import { Card } from '../components/ui/Card';

export function LandingPage() {
  return (
    <div className="grid w-full items-center gap-10 py-8 md:grid-cols-[1.05fr_0.95fr] md:py-16">
      <section className="max-w-xl">
        <p className="text-xs font-bold tracking-[0.24em] text-violet-300 uppercase">
          Your story begins here
        </p>
        <h1 className="mt-4 text-5xl leading-[0.98] font-black tracking-[-0.045em] text-white sm:text-6xl">
          Unbox the
          <span className="block bg-gradient-to-r from-violet-300 via-fuchsia-300 to-sky-300 bg-clip-text text-transparent">
            extraordinary.
          </span>
        </h1>
        <p className="mt-5 max-w-lg text-base leading-7 text-violet-100/65 sm:text-lg">
          Open a cosmic mystery, meet an original hero, and begin a
          collection that is uniquely yours.
        </p>
        <div className="mt-8 grid gap-3 sm:flex">
          <Link
            to="/guest"
            className="inline-flex min-h-12 items-center justify-center rounded-2xl bg-violet-500 px-6 text-sm font-bold text-white shadow-[0_12px_35px_rgba(124,58,237,0.35)] transition hover:bg-violet-400"
          >
            Continue as guest
          </Link>
          <Link
            to="/sign-in"
            className="inline-flex min-h-12 items-center justify-center rounded-2xl border border-violet-300/25 bg-violet-300/10 px-6 text-sm font-bold text-violet-50 transition hover:bg-violet-300/15"
          >
            Sign in
          </Link>
        </div>
        <p className="mt-4 flex items-center gap-2 text-xs text-violet-200/45">
          <span aria-hidden="true">◇</span> No download required
        </p>
      </section>

      <div className="relative mx-auto w-full max-w-sm py-5" aria-hidden="true">
        <div className="absolute inset-8 rounded-full bg-violet-500/25 blur-3xl" />
        <Card className="relative aspect-[4/5.5] overflow-hidden border-violet-300/30 bg-gradient-to-br from-violet-500/15 via-[#141026] to-sky-500/10 p-3 shadow-[0_30px_80px_rgba(76,29,149,0.3)] sm:rotate-2">
          <div className="grid h-full place-items-center rounded-[1.25rem] border border-white/10 bg-[radial-gradient(circle_at_50%_35%,rgba(167,139,250,0.22),transparent_35%)]">
            <div className="text-center">
              <div className="mx-auto grid size-24 place-items-center rounded-[2rem] border border-violet-300/30 bg-violet-400/10 text-5xl shadow-[0_0_45px_rgba(167,139,250,0.28)]">
                ✦
              </div>
              <p className="mt-5 text-xs font-black tracking-[0.35em] text-violet-200 uppercase">
                Mystery awaits
              </p>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
