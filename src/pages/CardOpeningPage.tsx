import { Link } from 'react-router-dom';

import { MagicalChest } from '../components/claim/MagicalChest';
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
      <Card className="chest-card relative mx-auto mt-10 aspect-square w-full max-w-sm overflow-hidden border-violet-300/20 bg-[radial-gradient(circle_at_50%_45%,rgba(139,92,246,0.24),transparent_48%)]">
        <div className="grid h-full place-items-center">
          <button
            type="button"
            className="chest-preview rounded-[2rem] px-1 pt-2 pb-3 focus-visible:outline-none"
            aria-describedby="chest-preview-hint"
          >
            <MagicalChest />
            <p className="mt-6 text-sm font-bold tracking-[0.2em] text-violet-200 uppercase">
              Mystery box sealed
            </p>
            <p
              id="chest-preview-hint"
              className="mt-2 text-xs text-violet-100/45"
            >
              Presentation preview · tap to make it shimmer
            </p>
          </button>
        </div>
      </Card>
      <Link
        to="/collection"
        className="quiet-link mx-auto mt-7 inline-flex min-h-11 items-center gap-2 px-4 text-sm font-semibold text-violet-200"
      >
        Preview your collection <span aria-hidden="true">→</span>
      </Link>
    </div>
  );
}
