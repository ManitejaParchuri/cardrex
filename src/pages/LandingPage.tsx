import { Link } from 'react-router-dom';

import { Card } from '../components/ui/Card';

export function LandingPage() {
  return (
    <div className="grid w-full items-center gap-12 py-8 md:grid-cols-[1.05fr_0.95fr] md:py-16 lg:gap-20">
      <section className="max-w-xl">
        <p className="text-xs font-bold tracking-[0.24em] text-violet-300 uppercase">
          Your story begins here
        </p>
        <h1 className="mt-4 text-[3.25rem] leading-[0.94] font-black tracking-[-0.055em] text-white sm:text-7xl">
          Unbox the
          <span className="shimmer block bg-gradient-to-r from-violet-300 via-fuchsia-200 via-50% to-sky-300 bg-clip-text text-transparent">
            extraordinary.
          </span>
        </h1>
        <p className="mt-5 max-w-lg text-base leading-7 text-violet-100/65 sm:text-lg">
          Open a cosmic mystery, meet an original hero, and begin a collection
          that is uniquely yours.
        </p>
        <div className="mt-8 grid gap-3 sm:flex">
          <Link
            to="/guest"
            className="inline-flex min-h-12 items-center justify-center rounded-2xl bg-gradient-to-r from-violet-600 to-violet-500 px-6 text-sm font-bold text-white shadow-[0_12px_35px_rgba(124,58,237,0.35)] transition hover:-translate-y-0.5 hover:shadow-[0_16px_42px_rgba(124,58,237,0.45)] hover:brightness-110 active:translate-y-0 active:scale-[0.98]"
          >
            Continue as guest
          </Link>
          <Link
            to="/sign-in"
            className="inline-flex min-h-12 items-center justify-center rounded-2xl border border-violet-300/25 bg-violet-300/10 px-6 text-sm font-bold text-violet-50 backdrop-blur-md transition hover:-translate-y-0.5 hover:border-violet-200/40 hover:bg-violet-300/15 active:translate-y-0 active:scale-[0.98]"
          >
            Sign in
          </Link>
        </div>
        <p className="mt-4 flex items-center gap-2 text-xs text-violet-200/45">
          <span aria-hidden="true">◇</span> No download required
        </p>
      </section>

      <div className="relative mx-auto w-full max-w-md py-5" aria-hidden="true">
        <div className="absolute inset-8 rounded-full bg-violet-500/30 blur-3xl" />
        <div className="vault-orbit absolute inset-[12%] rounded-full border border-dashed border-violet-300/20">
          <span className="absolute -top-1 left-1/2 size-2 rounded-full bg-sky-200 shadow-[0_0_16px_#7dd3fc]" />
        </div>
        <Card className="vault-float relative mx-auto aspect-[4/5] max-w-sm overflow-hidden border-violet-300/35 bg-gradient-to-br from-violet-500/15 via-[#141026] to-sky-500/10 p-3 shadow-[0_30px_90px_rgba(76,29,149,0.4)] sm:rotate-2">
          <div className="grid h-full place-items-center rounded-[1.25rem] border border-white/10 bg-[radial-gradient(circle_at_50%_35%,rgba(167,139,250,0.25),transparent_38%)]">
            <div className="text-center">
              <div className="relative mx-auto grid size-32 place-items-center rounded-[2.25rem] border border-violet-200/35 bg-gradient-to-br from-violet-300/20 to-sky-400/5 text-5xl shadow-[inset_0_0_30px_rgba(167,139,250,0.15),0_0_55px_rgba(167,139,250,0.35)]">
                <span className="absolute inset-3 rounded-[1.7rem] border border-white/10" />
                <span className="grid size-12 place-items-center rounded-full border border-violet-200/40 bg-[#100a20] text-2xl shadow-[0_0_25px_rgba(196,181,253,0.4)]">
                  ✦
                </span>
              </div>
              <p className="mt-5 text-xs font-black tracking-[0.35em] text-violet-200 uppercase">
                Mystery awaits
              </p>
              <p className="mt-2 text-[0.65rem] tracking-[0.18em] text-violet-100/40 uppercase">
                Cosmic vault · 001
              </p>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
