import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { claimApi } from '../cards/api';
import type { Claim } from '../cards/types';
import { PageIntro } from '../components/layout/PageIntro';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';
import { CollectibleCard } from '../components/ui/CollectibleCard';
import { Loading } from '../components/ui/Loading';

export function CardOpeningPage() {
  const [claim, setClaim] = useState<Claim | null>(null);
  const [loading, setLoading] = useState(true);
  const [opening, setOpening] = useState(false);
  const [revealing, setRevealing] = useState(false);
  const [error, setError] = useState('');
  const key = useRef<string | null>(null);

  useEffect(() => {
    let current = true;
    claimApi
      .status()
      .then((status) => {
        if (current && status.claimed) setClaim(status.claim);
      })
      .catch((reason: unknown) => {
        if (current)
          setError(
            reason instanceof Error
              ? reason.message
              : 'Claim status unavailable.',
          );
      })
      .finally(() => {
        if (current) setLoading(false);
      });
    return () => {
      current = false;
    };
  }, []);

  const open = async () => {
    if (opening || revealing || claim) return;
    key.current ??= crypto.randomUUID();
    setOpening(true);
    setError('');
    try {
      const result = await claimApi.create(key.current);
      setClaim(result.claim);
      setRevealing(true);
      window.setTimeout(() => setRevealing(false), 3200);
    } catch (reason) {
      setError(
        reason instanceof Error
          ? reason.message
          : 'The vault resisted. Try again.',
      );
    } finally {
      setOpening(false);
    }
  };

  if (loading) return <Loading label="Checking your vault" />;
  const owned = claim && !revealing;
  return (
    <div className="mx-auto w-full max-w-xl py-8 text-center sm:py-14">
      <PageIntro
        eyebrow="Secure mystery vault"
        title={
          owned
            ? 'Your card is safe in the vault'
            : 'One box. One cosmic destiny.'
        }
        description={
          owned
            ? 'Your initial guest claim has already been completed.'
            : 'Open the box to receive one server-selected card for this guest session.'
        }
      />
      {!claim ? (
        <Card
          className={`claim-vault relative mx-auto mt-10 aspect-square w-full max-w-sm overflow-hidden border-violet-300/30 ${opening ? 'is-opening' : ''}`}
        >
          <div className="vault-glow absolute inset-8 rounded-full border border-dashed border-violet-200/20" />
          <div className="grid h-full place-items-center">
            <div>
              <div className="mystery-box relative mx-auto grid size-32 place-items-center rounded-[2.25rem] border border-violet-200/35 bg-gradient-to-br from-violet-400/30 to-sky-500/10 text-6xl">
                ◈
              </div>
              <p className="mt-6 text-sm font-bold tracking-[0.2em] text-violet-200 uppercase">
                Mystery box sealed
              </p>
              <Button
                className="mt-7 touch-manipulation"
                disabled={opening}
                onClick={() => void open()}
              >
                {opening
                  ? 'Opening vault…'
                  : error
                    ? 'Retry opening'
                    : 'Open Mystery Box'}
              </Button>
            </div>
          </div>
        </Card>
      ) : (
        <div
          className={`reveal-stage rarity-${claim.rarity.toLowerCase()} mx-auto mt-10 max-w-sm ${revealing ? 'is-revealing' : 'is-complete'}`}
          aria-live="polite"
        >
          {revealing && <p className="sr-only">Revealing {claim.card.name}</p>}
          <div className="light-burst" aria-hidden="true" />
          <div className="revealed-card">
            <CollectibleCard card={claim.card} />
          </div>
        </div>
      )}
      {error && (
        <div
          role="alert"
          className="mt-5 rounded-xl border border-rose-300/30 bg-rose-400/10 p-4 text-sm text-rose-100"
        >
          {error}
        </div>
      )}
      {claim && !revealing && (
        <div className="mt-7 flex flex-col justify-center gap-3 sm:flex-row">
          <Link to="/collection">
            <Button>View collection</Button>
          </Link>
          <Link
            to={`/cards/${claim.card.slug}`}
            className="inline-flex min-h-11 items-center justify-center rounded-xl border border-violet-300/30 px-5 font-bold text-violet-100"
          >
            View card details
          </Link>
        </div>
      )}
    </div>
  );
}
