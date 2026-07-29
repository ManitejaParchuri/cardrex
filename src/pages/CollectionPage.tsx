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
      <Card className="mt-8 grid min-h-64 place-items-center border-dashed text-center">
        <div className="max-w-xs">
          <div className="mx-auto grid size-16 place-items-center rounded-2xl bg-violet-400/10 text-3xl" aria-hidden="true">
            ✧
          </div>
          <h2 className="mt-5 text-lg font-bold text-white">The vault is quiet</h2>
          <p className="mt-2 text-sm leading-6 text-violet-100/55">
            Claim a mystery card to begin your cosmic collection.
          </p>
          <Link
            to="/claim"
            className="mt-5 inline-flex min-h-11 items-center rounded-xl bg-violet-500 px-5 text-sm font-bold text-white hover:bg-violet-400"
          >
            Go to claim
          </Link>
        </div>
      </Card>
    </div>
  );
}
