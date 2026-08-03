import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { claimApi } from '../cards/api';
import { rarityByName, type CollectibleCard } from '../cards/types';
import { Loading } from '../components/ui/Loading';
import { CardArtwork } from '../components/ui/CardArtwork';

export function CardDetailsPage() {
  const { slug = '' } = useParams();
  const [card, setCard] = useState<CollectibleCard | null>(null);
  const [owned, setOwned] = useState(false);
  const [error, setError] = useState('');
  useEffect(() => {
    let current = true;
    Promise.all([claimApi.card(slug), claimApi.collection()])
      .then(([detail, collection]) => {
        if (!current) return;
        setCard(detail.card);
        setOwned(
          collection.cards.some((item) => item.card.slug === detail.card.slug),
        );
      })
      .catch((reason: unknown) => {
        if (current)
          setError(
            reason instanceof Error ? reason.message : 'Card unavailable.',
          );
      });
    return () => {
      current = false;
    };
  }, [slug]);
  if (error)
    return (
      <div role="alert" className="py-16 text-center text-rose-200">
        {error}
      </div>
    );
  if (!card) return <Loading label="Loading card details" />;
  const rarity = rarityByName[card.rarity];
  return (
    <article className="mx-auto grid max-w-5xl gap-8 py-10 md:grid-cols-2 md:py-16">
      <div className="bg-nebula aspect-[4/3] overflow-hidden rounded-3xl border border-violet-300/30">
        <CardArtwork
          name={card.name}
          rarity={card.rarity}
          imageUrl={card.imageUrl}
        />
      </div>
      <div className="self-center">
        <p className="text-sm font-black tracking-[.2em] text-violet-300 uppercase">
          {rarity.displayName} · #
          {String(card.collectionNumber).padStart(3, '0')}
        </p>
        <h1 className="mt-3 text-4xl font-black text-white">{card.name}</h1>
        <p className="mt-4 leading-7 text-violet-100/70">{card.lore}</p>
        <div className="mt-6 flex gap-3 font-black">
          <span className="rounded-xl bg-rose-400/15 px-4 py-2">
            ATK {card.attack}
          </span>
          <span className="rounded-xl bg-sky-400/15 px-4 py-2">
            DEF {card.defense}
          </span>
        </div>
        <section className="mt-7 rounded-2xl border border-violet-300/20 bg-violet-300/[.06] p-5">
          <h2 className="font-black text-white">{card.abilityName}</h2>
          <p className="mt-2 text-sm leading-6 text-violet-100/65">
            {card.abilityDescription}
          </p>
        </section>
        <p className="mt-6 font-bold text-violet-200">
          {owned ? '✓ Owned by this guest' : 'Not owned by this guest'}
        </p>
        <Link
          to="/collection"
          className="mt-6 inline-block text-violet-300 underline underline-offset-4"
        >
          Back to collection
        </Link>
      </div>
    </article>
  );
}
