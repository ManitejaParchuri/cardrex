import { Link } from 'react-router-dom';

import { PageIntro } from '../components/layout/PageIntro';
import { Card } from '../components/ui/Card';

export function CardOpeningPage() {
  return (
    <div className="mx-auto grid w-full max-w-xl content-center py-8 text-center sm:py-14">
      <PageIntro
        eyebrow="One discovery awaits"
        title="Claim your card"
        description="The secure card-opening experience will be connected in the next phase."
      />
      <Card className="relative mx-auto mt-8 aspect-square w-full max-w-sm overflow-hidden border-violet-300/20 bg-[radial-gradient(circle_at_50%_45%,rgba(139,92,246,0.26),transparent_45%)]">
        <div className="grid h-full place-items-center">
          <div>
            <div className="mx-auto grid size-28 place-items-center rounded-[2rem] border border-violet-200/25 bg-gradient-to-br from-violet-400/20 to-fuchsia-500/10 text-6xl shadow-[0_0_60px_rgba(139,92,246,0.35)]">
              ◈
            </div>
            <p className="mt-6 text-sm font-bold tracking-[0.2em] text-violet-200 uppercase">
              Mystery box sealed
            </p>
          </div>
        </div>
      </Card>
      <Link
        to="/collection"
        className="mx-auto mt-6 inline-flex min-h-11 items-center px-4 text-sm font-semibold text-violet-300 underline decoration-violet-400/40 underline-offset-4"
      >
        Preview your collection
      </Link>
    </div>
  );
}
