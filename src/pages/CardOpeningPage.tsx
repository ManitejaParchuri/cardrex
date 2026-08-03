import { Link } from 'react-router-dom';

import { PageIntro } from '../components/layout/PageIntro';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';

export function CardOpeningPage() {
  return (
    <div className="mx-auto grid w-full max-w-xl content-center py-8 text-center sm:py-14">
      <PageIntro
        eyebrow="Mystery vault preview"
        title="The vault is not active yet"
        description="Card claiming unlocks in the next phase. For now, enjoy a preview of the secure card-opening experience."
      />
      <Card className="vault-float relative mx-auto mt-10 aspect-square w-full max-w-sm overflow-hidden border-violet-300/30 bg-[radial-gradient(circle_at_50%_45%,rgba(139,92,246,0.3),transparent_48%)] shadow-[0_25px_80px_rgba(76,29,149,0.3)]">
        <div className="vault-orbit absolute inset-8 rounded-full border border-dashed border-violet-200/20" />
        <div className="grid h-full place-items-center">
          <div>
            <div className="relative mx-auto grid size-32 place-items-center rounded-[2.25rem] border border-violet-200/35 bg-gradient-to-br from-violet-400/25 to-sky-500/10 text-6xl shadow-[inset_0_0_30px_rgba(167,139,250,0.15),0_0_60px_rgba(139,92,246,0.4)]">
              <span className="absolute inset-3 rounded-[1.6rem] border border-white/10" />
              ◈
            </div>
            <p className="mt-6 text-sm font-bold tracking-[0.2em] text-violet-200 uppercase">
              Mystery box sealed
            </p>
            <Button className="mt-7" disabled aria-describedby="claim-status">
              Open mystery vault
            </Button>
            <p
              id="claim-status"
              className="mt-3 text-xs font-medium text-violet-200/55"
            >
              Claiming is currently unavailable
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
