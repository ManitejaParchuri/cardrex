import { randomInt } from 'node:crypto';
import type { Rarity } from '@prisma/client';
import {
  PROBABILITY_SCALE,
  RARITY_PROBABILITIES,
} from '../config/claimProbabilities.js';

export function rarityForRoll(roll: number): Rarity {
  if (!Number.isInteger(roll) || roll < 0 || roll >= PROBABILITY_SCALE) {
    throw new RangeError('Rarity roll is outside the configured range');
  }
  let boundary = 0;
  for (const item of RARITY_PROBABILITIES) {
    boundary += item.weight;
    if (roll < boundary) return item.rarity;
  }
  throw new Error('Rarity table has an uncovered boundary');
}

export const selectRarity = () => rarityForRoll(randomInt(PROBABILITY_SCALE));

export function fallbackRarities(selected: Rarity): Rarity[] {
  const rarities = RARITY_PROBABILITIES.map(({ rarity }) => rarity);
  const index = rarities.indexOf(selected);
  return [
    selected,
    ...rarities.slice(0, index).reverse(),
    ...rarities.slice(index + 1),
  ];
}
