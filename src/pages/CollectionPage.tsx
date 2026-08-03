import { CardProgress } from '../components/collection/CardProgress';
import { CardShelf } from '../components/collection/CardShelf';
import { PageIntro } from '../components/layout/PageIntro';
import { ActionLink } from '../components/ui/ActionLink';
import { Card } from '../components/ui/Card';

export function CollectionPage() {
  return (
    <div className="w-full py-10 sm:py-16">
      <PageIntro
        eyebrow="The vault"
        title="Your collection"
        description="Every original character you discover will appear here. Your first card is waiting to be claimed."
      />
      <div className="mt-9">
        <CardProgress collected={0} total={24} />
      </div>
      <div className="mt-4">
        <CardShelf />
      </div>
      <Card className="empty-vault mt-5 grid min-h-64 place-items-center border-dashed text-center">
        <div className="max-w-xs">
          <div
            className="breathing-sigil mx-auto grid size-16 place-items-center rounded-2xl bg-violet-400/10 text-3xl"
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
          <ActionLink to="/claim" className="mt-6">
            Go to claim
          </ActionLink>
        </div>
      </Card>
    </div>
  );
}
