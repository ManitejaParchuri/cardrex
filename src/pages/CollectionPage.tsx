import { useEffect, useState } from 'react';
import { cardArchiveApi } from '../cards/api';
import {
  rarityMetadata,
  type CollectibleCard as CardData,
  type Rarity,
} from '../cards/types';
import { PageIntro } from '../components/layout/PageIntro';
import { Card } from '../components/ui/Card';
import { CollectibleCard } from '../components/ui/CollectibleCard';
import { Loading } from '../components/ui/Loading';
export function CollectionPage() {
  const [cards, setCards] = useState<CardData[]>([]);
  const [rarity, setRarity] = useState<Rarity | ''>('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  useEffect(() => {
    let current = true;
    setLoading(true);
    setError('');
    cardArchiveApi
      .list(rarity || undefined)
      .then((result) => {
        if (current) setCards(result.cards);
      })
      .catch((reason: unknown) => {
        if (current)
          setError(
            reason instanceof Error ? reason.message : 'Archive unavailable.',
          );
      })
      .finally(() => {
        if (current) setLoading(false);
      });
    return () => {
      current = false;
    };
  }, [rarity]);
  return (
    <div className="w-full py-10 sm:py-16">
      <PageIntro
        eyebrow="The vault"
        title="Your collection"
        description="Cards you claim in a future phase will appear here. Browsing the archive does not add cards to your vault."
      />
      <Card className="relative mt-8 grid min-h-48 place-items-center overflow-hidden border-dashed text-center">
        <div className="relative max-w-sm">
          <div className="text-3xl" aria-hidden="true">
            ✧
          </div>
          <h2 className="mt-3 text-lg font-bold text-white">
            Your collection awaits
          </h2>
          <p className="mt-2 text-sm leading-6 text-violet-100/55">
            There are no cards in your vault yet. Card claiming is not
            implemented.
          </p>
          <span className="mt-4 inline-flex rounded-xl border border-violet-300/15 bg-violet-300/[0.07] px-5 py-2 text-sm font-semibold text-violet-200/70">
            Empty vault
          </span>
        </div>
      </Card>
      <section className="mt-14" aria-labelledby="archive-title">
        <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
          <div>
            <p className="text-xs font-bold tracking-[0.22em] text-violet-300 uppercase">
              Discoverable cards
            </p>
            <h2
              id="archive-title"
              className="mt-2 text-3xl font-black text-white"
            >
              Card Archive
            </h2>
            <p className="mt-2 text-sm text-violet-100/60">
              A read-only preview. These cards are not owned by your guest.
            </p>
          </div>
          <label className="text-sm font-bold text-violet-100">
            Filter by rarity{' '}
            <select
              aria-label="Filter by rarity"
              value={rarity}
              onChange={(event) => setRarity(event.target.value as Rarity | '')}
              className="ml-2 min-h-11 rounded-xl border border-violet-300/25 bg-[#17102d] px-3 text-white"
            >
              <option value="">All rarities</option>
              {rarityMetadata.map((item) => (
                <option key={item.name} value={item.name}>
                  {item.displayName}
                </option>
              ))}
            </select>
          </label>
        </div>
        <div className="mt-7">
          {loading ? (
            <Loading label="Loading Card Archive" />
          ) : error ? (
            <div
              role="alert"
              className="rounded-2xl border border-rose-300/25 bg-rose-400/10 p-6 text-rose-100"
            >
              <p className="font-bold">Archive signal lost</p>
              <p className="mt-1 text-sm">{error}</p>
            </div>
          ) : cards.length === 0 ? (
            <p className="rounded-2xl border border-dashed border-violet-300/20 p-8 text-center text-violet-100/60">
              No discoverable cards match this rarity.
            </p>
          ) : (
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {cards.map((card) => (
                <CollectibleCard key={card.slug} card={card} />
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
