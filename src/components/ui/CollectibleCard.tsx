import type { CollectibleCard as CardData } from '../../cards/types';
import { CardVisual } from './CardVisual';

/** Backwards-compatible compact card; new views should use CardVisual directly. */
export function CollectibleCard({ card }: { card: CardData }) {
  return <CardVisual card={card} variant="compact" />;
}
