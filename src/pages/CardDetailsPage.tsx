import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { claimApi } from '../cards/api';
import type { CollectibleCard } from '../cards/types';
import { Loading } from '../components/ui/Loading';
import { CardVisual } from '../components/ui/CardVisual';

export function CardDetailsPage() {
  const { slug = '' } = useParams();
  const [card, setCard] = useState<CollectibleCard | null>(null);
  const [owned, setOwned] = useState(false);
  const [error, setError] = useState('');
  useEffect(() => {
    let current = true;
    claimApi
      .card(slug)
      .then((detail) => {
        if (!current) return;
        setCard(detail.card);
        setOwned(true);
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
  return (
    <article className="mx-auto grid max-w-5xl gap-8 py-10 md:grid-cols-[minmax(0,26rem)_1fr] md:items-center md:py-16">
      <CardVisual card={card} variant="detail" owned interactive />
      <div>
        <p className="text-sm font-black tracking-[.2em] text-violet-300 uppercase">
          Vault record
        </p>
        <h1 className="mt-3 text-3xl font-black text-white">
          The story behind the card
        </h1>
        <p className="mt-4 leading-7 text-violet-100/70">{card.lore}</p>
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
