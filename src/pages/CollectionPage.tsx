import { Link } from 'react-router-dom';

import { PageIntro } from '../components/layout/PageIntro';
import { Card } from '../components/ui/Card';

export function CollectionPage() {
  return (
    <div className="w-full py-10 sm:py-16">
      <PageIntro
        eyebrow="The vault"
        title="Your collection"
        description="Every original character you discover will appear here. Your first card is waiting to be claimed."
      />
      <div className="mt-8 grid grid-cols-3 gap-3 sm:gap-5" aria-hidden="true">
        {[0, 1, 2].map((slot) => (
          <div
            key={slot}
            className={`aspect-[3/4] rounded-2xl border border-white/10 bg-gradient-to-br from-white/[0.07] to-violet-400/[0.03] p-2 shadow-xl ${slot === 1 ? 'translate-y-3' : ''}`}
          >
            <div className="grid h-full place-items-center rounded-xl border border-dashed border-violet-200/15 text-2xl text-violet-200/20 sm:text-4xl">
              ?
            </div>
          </div>
        ))}
      </div>
      <Card className="relative mt-6 grid min-h-64 place-items-center overflow-hidden border-dashed text-center">
        <div
          className="absolute inset-0 bg-[radial-gradient(circle_at_50%_100%,rgba(139,92,246,0.14),transparent_55%)]"
          aria-hidden="true"
        />
        <div className="relative max-w-xs">
          <div
            className="mx-auto grid size-16 place-items-center rounded-2xl bg-violet-400/10 text-3xl"
            aria-hidden="true"
          >
            ✧
          </div>
          <h2 className="mt-5 text-lg font-bold text-white">
            The vault is quiet
          </h2>
          <p className="mt-2 text-sm leading-6 text-violet-100/55">
            Claim a mystery card to begin your cosmic collection.
          </p>
          <Link
            to="/claim"
            className="mt-5 inline-flex min-h-11 items-center rounded-xl bg-gradient-to-r from-violet-600 to-violet-500 px-5 text-sm font-bold text-white shadow-lg shadow-violet-950/30 transition hover:-translate-y-0.5 hover:brightness-110 active:translate-y-0 active:scale-[0.98]"
          >
            Go to claim
          </Link>
        </div>
      </Card>
    </div>
  );
}
