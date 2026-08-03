import type { CollectibleCard } from '../../cards/types';
import { getRarityDesign } from '../../cards/rarityDesign';
import { CardArtwork } from './CardArtwork';

export type CardVisualVariant = 'compact' | 'reveal' | 'detail';

type CardVisualProps = {
  card: CollectibleCard;
  variant?: CardVisualVariant;
  owned?: boolean;
  interactive?: boolean;
};

export function CardVisual({
  card,
  variant = 'compact',
  owned = false,
  interactive = false,
}: CardVisualProps) {
  const design = getRarityDesign(card.rarity);
  const number = String(card.collectionNumber).padStart(3, '0');

  return (
    <article
      aria-label={`${card.name}, ${design.displayName}`}
      className="card-visual"
      data-family={design.layoutFamily}
      data-rarity={card.rarity.toLowerCase()}
      data-variant={variant}
      data-glow={design.glowStyle}
      data-animation={design.animationStyle}
      data-interactive={interactive || undefined}
    >
      <div className="card-frame" data-frame={design.borderStyle}>
        <div className="card-effects" aria-hidden="true">
          <i className="card-effect-orbit" />
          <i className="card-effect-shine" />
          <i className="card-effect-symbols">✦ ◇ △ ✧</i>
        </div>
        <div className="card-artwork">
          <CardArtwork
            name={card.name}
            rarity={card.rarity}
            imageUrl={card.imageUrl}
            crop={design.artworkCrop}
            objectPosition={design.artworkPosition}
          />
          <div className="card-artwork-vignette" aria-hidden="true" />
        </div>
        <header className="card-identity">
          <div className="card-name-row">
            <h2 title={card.name}>{card.name}</h2>
            <span className="card-number">#{number}</span>
          </div>
          <div className="card-rarity">
            <span
              className="card-emblem"
              data-emblem={design.emblemStyle}
              aria-hidden="true"
            >
              ✦
            </span>
            <span>
              {design.displayName} · {design.visualLabel}
            </span>
          </div>
        </header>
        <dl className="card-stats" data-stat-style={design.statStyle}>
          <div>
            <dt>ATK</dt>
            <dd>{card.attack}</dd>
          </div>
          <div>
            <dt>DEF</dt>
            <dd>{card.defense}</dd>
          </div>
        </dl>
        <section className="card-ability" aria-label="Card ability">
          <h3>{card.abilityName}</h3>
          <p>{card.abilityDescription}</p>
        </section>
        {variant === 'detail' && <p className="card-lore">{card.lore}</p>}
        {owned && <span className="card-owned">✓ Owned</span>}
      </div>
    </article>
  );
}
