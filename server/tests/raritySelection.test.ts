import { describe, expect, it } from 'vitest';
import {
  PROBABILITY_SCALE,
  RARITY_PROBABILITIES,
} from '../src/config/claimProbabilities.js';
import {
  fallbackRarities,
  rarityForRoll,
} from '../src/services/raritySelection.js';

describe('server rarity selection', () => {
  it('totals exactly 100 percent', () => {
    expect(
      RARITY_PROBABILITIES.reduce((sum, item) => sum + item.weight, 0),
    ).toBe(PROBABILITY_SCALE);
  });
  it.each([
    [0, 'COMMON'],
    [4499, 'COMMON'],
    [4500, 'UNCOMMON'],
    [6999, 'UNCOMMON'],
    [7000, 'RARE'],
    [8399, 'RARE'],
    [8400, 'EPIC'],
    [9199, 'EPIC'],
    [9200, 'LEGENDARY'],
    [9649, 'LEGENDARY'],
    [9650, 'MYTHIC'],
    [9849, 'MYTHIC'],
    [9850, 'RAINBOW'],
    [9949, 'RAINBOW'],
    [9950, 'SECRET'],
    [9999, 'SECRET'],
  ])('maps boundary roll %i to %s', (roll, rarity) =>
    expect(rarityForRoll(roll)).toBe(rarity),
  );
  it('falls back from a missing rarity without repeating it', () => {
    expect(fallbackRarities('SECRET')).toEqual([
      'SECRET',
      'RAINBOW',
      'MYTHIC',
      'LEGENDARY',
      'EPIC',
      'RARE',
      'UNCOMMON',
      'COMMON',
    ]);
  });
});
