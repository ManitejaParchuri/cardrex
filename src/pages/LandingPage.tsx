import { Card } from '../components/ui/Card';
import { ActionLink } from '../components/ui/ActionLink';

export function LandingPage() {
  return (
    <div className="grid w-full items-center gap-12 py-10 md:grid-cols-[1.05fr_0.95fr] md:py-20">
      <section className="max-w-xl">
        <p className="eyebrow text-xs font-bold tracking-[0.24em] text-violet-300 uppercase">
          Your story begins here
        </p>
        <h1 className="font-display mt-5 text-5xl leading-[0.94] font-black tracking-[-0.055em] text-white sm:text-7xl">
          Unbox the
          <span className="block bg-gradient-to-r from-violet-300 via-fuchsia-300 to-sky-300 bg-clip-text text-transparent">
            extraordinary.
          </span>
        </h1>
        <p className="mt-6 max-w-lg text-base leading-7 text-violet-100/65 sm:text-lg">
          Open a cosmic mystery, meet an original hero, and begin a
          collection that is uniquely yours.
        </p>
        <div className="mt-8 grid gap-3 sm:flex">
          <ActionLink to="/guest">Continue as guest <span aria-hidden="true">→</span></ActionLink>
          <ActionLink to="/sign-in" variant="secondary">Sign in</ActionLink>
        </div>
        <p className="mt-4 flex items-center gap-2 text-xs text-violet-200/45">
          <span aria-hidden="true">◇</span> No download required
        </p>
      </section>

      <div className="hero-card-wrap relative mx-auto w-full max-w-sm py-5" aria-hidden="true">
        <div className="absolute inset-8 rounded-full bg-violet-500/25 blur-3xl" />
        <Card className="hero-card relative aspect-[4/5.5] overflow-hidden border-violet-300/30 bg-gradient-to-br from-violet-500/15 via-[#141026] to-sky-500/10 p-3 shadow-[0_30px_80px_rgba(76,29,149,0.3)] sm:rotate-2">
          <div className="grid h-full place-items-center rounded-[1.25rem] border border-white/10 bg-[radial-gradient(circle_at_50%_35%,rgba(167,139,250,0.22),transparent_35%)]">
            <div className="text-center">
              <div className="breathing-sigil mx-auto grid size-24 place-items-center rounded-[2rem] border border-violet-300/30 bg-violet-400/10 text-5xl shadow-[0_0_45px_rgba(167,139,250,0.28)]">
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
