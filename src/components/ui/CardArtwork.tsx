import { useEffect, useMemo, useState } from 'react';
import { rarityByName, type Rarity } from '../../cards/types';

const rarityThemes: Record<Rarity, string> = {
  COMMON: 'from-slate-900 via-indigo-950 to-slate-800 text-slate-100',
  UNCOMMON: 'from-emerald-950 via-teal-900 to-indigo-950 text-emerald-100',
  RARE: 'from-sky-950 via-blue-900 to-violet-950 text-sky-100',
  EPIC: 'from-violet-950 via-fuchsia-900 to-indigo-950 text-violet-100',
  LEGENDARY: 'from-amber-950 via-orange-900 to-violet-950 text-amber-100',
  MYTHIC: 'from-rose-950 via-purple-900 to-indigo-950 text-rose-100',
  RAINBOW: 'from-cyan-900 via-fuchsia-900 to-amber-800 text-white',
  SECRET: 'from-black via-violet-950 to-slate-900 text-white',
};

type CardArtworkProps = {
  name?: string | null;
  rarity: Rarity;
  imageUrl?: string | null;
  className?: string;
  objectPosition?: string;
  crop?: string;
};

const cardSymbol = (name?: string | null) =>
  name?.trim().charAt(0).toLocaleUpperCase() || '✦';

export function CardArtwork({
  name,
  rarity,
  imageUrl,
  className = '',
  objectPosition = '50% 50%',
  crop = 'default',
}: CardArtworkProps) {
  const source = imageUrl?.trim() || '';
  const [isLoading, setIsLoading] = useState(Boolean(source));
  const [hasError, setHasError] = useState(!source);
  useEffect(() => {
    setIsLoading(Boolean(source));
    setHasError(!source);
  }, [source]);
  const patternPosition = useMemo(() => {
    const seed = [...(name || '')].reduce(
      (sum, letter) => sum + letter.charCodeAt(0),
      0,
    );
    return `${20 + (seed % 61)}% ${15 + (seed % 47)}%`;
  }, [name]);
  const label = name?.trim() || 'Unnamed card';
  const rarityLabel = rarityByName[rarity]?.displayName || 'Card';
  const status = hasError ? 'failed' : isLoading ? 'loading' : 'loaded';

  return (
    <div
      className={`relative isolate h-full w-full overflow-hidden bg-gradient-to-br ${rarityThemes[rarity]} ${className}`}
      data-artwork-status={status}
      data-artwork-crop={crop}
    >
      {(isLoading || hasError) && (
        <div
          role="img"
          aria-label={`Artwork for ${label}`}
          className="absolute inset-0 grid place-items-center overflow-hidden"
        >
          <div
            className="absolute inset-0 opacity-50"
            style={{
              backgroundImage:
                'radial-gradient(circle, currentColor 0 1px, transparent 1.5px), repeating-radial-gradient(circle at center, transparent 0 24px, currentColor 25px 26px, transparent 27px 42px)',
              backgroundPosition: patternPosition,
              backgroundSize: '31px 31px, 180px 180px',
            }}
          />
          <div className="relative text-center">
            <span className="block text-6xl font-black drop-shadow-[0_0_20px_currentColor]">
              {cardSymbol(name)}
            </span>
            <span className="mt-3 block text-xs font-black tracking-[.25em] uppercase">
              {rarityLabel}
            </span>
          </div>
        </div>
      )}
      {source && !hasError && (
        <img
          src={source}
          alt={`Artwork for ${label}`}
          className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-300 ${isLoading ? 'opacity-0' : 'opacity-100'}`}
          style={{ objectPosition }}
          onLoad={() => {
            setIsLoading(false);
            setHasError(false);
          }}
          onError={() => {
            setIsLoading(false);
            setHasError(true);
          }}
        />
      )}
      {isLoading && (
        <div
          role="status"
          aria-label={`Loading artwork for ${label}`}
          className="absolute inset-x-0 bottom-4 flex justify-center"
        >
          <span className="h-5 w-5 animate-spin rounded-full border-2 border-white/30 border-t-white" />
        </div>
      )}
    </div>
  );
}
