import {
  rarityByName,
  type CollectibleCard as CardData,
} from '../../cards/types';
import { CardArtwork } from './CardArtwork';
const treatments = {
  slate: 'border-slate-300/40 shadow-slate-300/10',
  emerald: 'border-emerald-300/55 shadow-emerald-400/20',
  sky: 'border-sky-300/60 shadow-sky-400/25',
  violet: 'border-violet-300/65 shadow-violet-400/30',
  amber: 'border-amber-300/70 shadow-amber-400/30',
  rose: 'border-rose-300/70 shadow-rose-400/30',
  rainbow: 'border-fuchsia-300/80 shadow-cyan-300/35',
  obsidian: 'border-white/80 shadow-violet-200/40',
} as const;
export function CollectibleCard({ card }: { card: CardData }) {
  const rarity = rarityByName[card.rarity];
  return (
    <article
      aria-label={`${card.name}, ${rarity.displayName}`}
      className={`overflow-hidden rounded-2xl border bg-[#100b20] shadow-[0_15px_45px_var(--tw-shadow-color)] ${treatments[rarity.borderStyle as keyof typeof treatments] ?? treatments.slate}`}
    >
      <div className="relative aspect-[4/3] overflow-hidden bg-[radial-gradient(circle_at_50%_35%,rgba(167,139,250,.3),transparent_45%),linear-gradient(145deg,#20143e,#0b0915)]">
        <CardArtwork
          name={card.name}
          rarity={card.rarity}
          imageUrl={card.imageUrl}
        />
        <span className="absolute top-2 right-2 rounded-full border border-white/20 bg-black/70 px-2 py-1 text-[10px] font-black tracking-wider text-white uppercase">
          {rarity.visualLabel}
        </span>
      </div>
      <div className="p-4">
        <div className="flex items-start justify-between gap-2">
          <h3 className="font-black text-white">{card.name}</h3>
          <span className="text-xs font-bold text-violet-100/65">
            #{String(card.collectionNumber).padStart(3, '0')}
          </span>
        </div>
        <p className="mt-1 text-xs font-semibold text-violet-200">
          {rarity.displayName}
        </p>
        <div className="mt-3 flex gap-2 text-xs font-black">
          <span className="rounded-lg bg-rose-400/15 px-2 py-1 text-rose-100">
            ATK {card.attack}
          </span>
          <span className="rounded-lg bg-sky-400/15 px-2 py-1 text-sky-100">
            DEF {card.defense}
          </span>
        </div>
        <p className="mt-3 text-sm font-bold text-white">{card.abilityName}</p>
        <p className="mt-1 line-clamp-2 text-xs leading-5 text-violet-100/60">
          {card.abilityDescription}
        </p>
      </div>
    </article>
  );
}
