import type { Rarity } from '@prisma/client';

export const PROBABILITY_SCALE = 10_000;
export const RARITY_PROBABILITIES: ReadonlyArray<{
  rarity: Rarity;
  weight: number;
}> = [
  { rarity: 'COMMON', weight: 4500 },
  { rarity: 'UNCOMMON', weight: 2500 },
  { rarity: 'RARE', weight: 1400 },
  { rarity: 'EPIC', weight: 800 },
  { rarity: 'LEGENDARY', weight: 450 },
  { rarity: 'MYTHIC', weight: 200 },
  { rarity: 'RAINBOW', weight: 100 },
  { rarity: 'SECRET', weight: 50 },
];

if (
  RARITY_PROBABILITIES.reduce((sum, item) => sum + item.weight, 0) !==
  PROBABILITY_SCALE
) {
  throw new Error('Claim rarity probabilities must total 100%');
}
