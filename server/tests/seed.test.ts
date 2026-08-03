import { describe, expect, it, vi } from 'vitest';
import { existsSync } from 'node:fs';
import { resolve } from 'node:path';
import { cardSeedData } from '../prisma/cardData.js';
import { seedCards } from '../prisma/seed.js';
describe('card seed', () => {
  it('contains 32 unique cards in the planned distribution', () => {
    expect(cardSeedData).toHaveLength(32);
    expect(new Set(cardSeedData.map((card) => card.name)).size).toBe(32);
    expect(new Set(cardSeedData.map((card) => card.slug)).size).toBe(32);
    expect(
      new Set(cardSeedData.map((card) => card.collectionNumber)).size,
    ).toBe(32);
    expect(
      Object.fromEntries(
        [
          'COMMON',
          'UNCOMMON',
          'RARE',
          'EPIC',
          'LEGENDARY',
          'MYTHIC',
          'RAINBOW',
          'SECRET',
        ].map((rarity) => [
          rarity,
          cardSeedData.filter((card) => card.rarity === rarity).length,
        ]),
      ),
    ).toEqual({
      COMMON: 8,
      UNCOMMON: 6,
      RARE: 5,
      EPIC: 4,
      LEGENDARY: 3,
      MYTHIC: 3,
      RAINBOW: 2,
      SECRET: 1,
    });
    expect(
      cardSeedData.every((card) => card.attack >= 0 && card.defense >= 0),
    ).toBe(true);
    expect(
      cardSeedData.every(
        (card) =>
          card.description.length > 0 &&
          card.lore.length > 0 &&
          card.abilityName.length > 0 &&
          card.abilityDescription.length > 0 &&
          card.imageUrl.length > 0 &&
          card.active,
      ),
    ).toBe(true);
  });
  it('uses duplicate-safe upserts on every run', async () => {
    const upsert = vi.fn().mockResolvedValue({});
    const prisma = { card: { upsert } };
    await seedCards(prisma as never);
    await seedCards(prisma as never);
    expect(upsert).toHaveBeenCalledTimes(64);
    expect(upsert.mock.calls[0]?.[0]).toMatchObject({
      where: { slug: 'ari-vale' },
    });
  });
  it('maps every card to a local artwork file', () => {
    for (const card of cardSeedData) {
      expect(card.imageUrl).toBe(`/cards/${card.slug}.svg`);
      expect(
        existsSync(
          resolve(process.cwd(), '..', 'public', card.imageUrl.slice(1)),
        ),
        `Missing artwork for ${card.name}`,
      ).toBe(true);
    }
  });
});
