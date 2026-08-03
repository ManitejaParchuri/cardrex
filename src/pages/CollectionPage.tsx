import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { claimApi, rarityApi } from '../cards/api';
import type {
  CollectibleCard as CardData,
  RarityOverview,
} from '../cards/types';
import { PageIntro } from '../components/layout/PageIntro';
import { Card } from '../components/ui/Card';
import { CollectibleCard } from '../components/ui/CollectibleCard';
import { Loading } from '../components/ui/Loading';
export function CollectionPage() {
  const [overview, setOverview] = useState<RarityOverview | null>(null);
  const [overviewError, setOverviewError] = useState('');
  const [owned, setOwned] = useState<CardData[]>([]);
  const [ownedLoading, setOwnedLoading] = useState(true);
  const [ownedError, setOwnedError] = useState('');
  useEffect(() => {
    let current = true;
    claimApi
      .collection()
      .then(({ cards }) => {
        if (current) setOwned(cards.map((item) => item.card).filter(Boolean));
      })
      .catch((reason: unknown) => {
        if (current)
          setOwnedError(
            reason instanceof Error
              ? reason.message
              : 'Collection unavailable.',
          );
      })
      .finally(() => {
        if (current) setOwnedLoading(false);
      });
    return () => {
      current = false;
    };
  }, []);
  useEffect(() => {
    let current = true;
    rarityApi
      .rarityOverview()
      .then((result) => {
        if (current) setOverview(result);
      })
      .catch((reason: unknown) => {
        if (current)
          setOverviewError(
            reason instanceof Error
              ? reason.message
              : 'Rarity overview unavailable.',
          );
      });
    return () => {
      current = false;
    };
  }, []);
  return (
    <div className="w-full py-10 sm:py-16">
      <PageIntro
        eyebrow="The vault"
        title="Your collection"
        description="Cards secured by this guest appear here."
      />
      {ownedLoading ? (
        <Loading label="Loading your collection" />
      ) : ownedError ? (
        <div
          role="alert"
          className="mt-8 rounded-2xl border border-rose-300/25 bg-rose-400/10 p-6 text-rose-100"
        >
          {ownedError}
        </div>
      ) : owned.length ? (
        <section className="mt-8" aria-label="Owned cards">
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {owned.map((card) => (
              <Link key={card.slug} to={`/cards/${card.slug}`}>
                <CollectibleCard card={card} />
              </Link>
            ))}
          </div>
        </section>
      ) : (
        <Card className="relative mt-8 grid min-h-48 place-items-center overflow-hidden border-dashed text-center">
          <div className="relative max-w-sm">
            <div className="text-3xl" aria-hidden="true">
              ✧
            </div>
            <h2 className="mt-3 text-lg font-bold text-white">
              Your collection awaits
            </h2>
            <p className="mt-2 text-sm leading-6 text-violet-100/55">
              Open your mystery box to place your first card here.
            </p>
            <span className="mt-4 inline-flex rounded-xl border border-violet-300/15 bg-violet-300/[0.07] px-5 py-2 text-sm font-semibold text-violet-200/70">
              <a href="/claim">Open mystery box</a>
            </span>
          </div>
        </Card>
      )}
      <section className="mt-14" aria-labelledby="rarity-overview-title">
        <h2
          id="rarity-overview-title"
          className="text-3xl font-black text-white"
        >
          Rarity Overview
        </h2>
        <p className="mt-3 max-w-3xl text-sm leading-6 text-violet-100/60">
          Card identities remain hidden until claimed. Below you can see how
          many active cards exist in each rarity and the chance of receiving
          that rarity.
        </p>
        <div className="mt-7">
          {!overview && !overviewError ? (
            <Loading label="Loading rarity overview" />
          ) : overviewError ? (
            <div
              role="alert"
              className="rounded-2xl border border-rose-300/25 bg-rose-400/10 p-6 text-rose-100"
            >
              <p className="font-bold">Rarity overview unavailable</p>
              <p className="mt-1 text-sm">{overviewError}</p>
            </div>
          ) : overview ? (
            <Card>
              <p className="text-lg font-black text-white">
                Total active cards: {overview.totalActiveCards}
              </p>
              <dl className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
                {overview.rarities.map((item) => (
                  <div
                    key={item.rarity}
                    className="rounded-xl bg-violet-300/[.06] p-4"
                  >
                    <dt className="font-bold text-white">{item.displayName}</dt>
                    <dd className="mt-1 text-sm text-violet-100/65">
                      {item.activeCardCount} active · {item.probability}%
                    </dd>
                  </div>
                ))}
              </dl>
              <p className="mt-5 text-sm font-bold text-violet-200">
                Probability total: {overview.probabilityTotal}%
              </p>
            </Card>
          ) : null}
        </div>
      </section>
    </div>
  );
}
