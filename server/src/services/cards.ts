import type { Rarity } from '@prisma/client';
import rarityMetadata from '../../../shared/rarities.json' with { type: 'json' };
import {
  PROBABILITY_SCALE,
  RARITY_PROBABILITIES,
} from '../config/claimProbabilities.js';

export const publicCardSelect = {
  name: true,
  slug: true,
  rarity: true,
  description: true,
  lore: true,
  attack: true,
  defense: true,
  abilityName: true,
  abilityDescription: true,
  imageUrl: true,
  collectionNumber: true,
} as const;
export type PublicCard = {
  name: string;
  slug: string;
  rarity: Rarity;
  description: string;
  lore: string;
  attack: number;
  defense: number;
  abilityName: string;
  abilityDescription: string;
  imageUrl: string;
  collectionNumber: number;
};
export interface CardRepository {
  list(input: {
    rarity?: Rarity;
    skip: number;
    take: number;
  }): Promise<PublicCard[]>;
  count(rarity?: Rarity): Promise<number>;
  findBySlug(slug: string): Promise<PublicCard | null>;
}
export class CardService {
  constructor(private repository: CardRepository) {}
  async list(rarity: Rarity | undefined, page: number, pageSize: number) {
    const [cards, total] = await Promise.all([
      this.repository.list({
        rarity,
        skip: (page - 1) * pageSize,
        take: pageSize,
      }),
      this.repository.count(rarity),
    ]);
    return {
      cards,
      pagination: {
        page,
        pageSize,
        total,
        totalPages: Math.ceil(total / pageSize),
      },
    };
  }
  findBySlug(slug: string) {
    return this.repository.findBySlug(slug);
  }

  async rarityOverview() {
    const counts = await Promise.all([
      this.repository.count(),
      ...RARITY_PROBABILITIES.map(({ rarity }) =>
        this.repository.count(rarity),
      ),
    ]);
    const displayNames = new Map(
      rarityMetadata.map(({ name, displayName, sortOrder }) => [
        name,
        { displayName, sortOrder },
      ]),
    );

    return {
      totalActiveCards: counts[0],
      probabilityTotal: 100,
      rarities: RARITY_PROBABILITIES.map(({ rarity, weight }, index) => ({
        rarity,
        displayName: displayNames.get(rarity)?.displayName ?? rarity,
        activeCardCount: counts[index + 1],
        probability: (weight / PROBABILITY_SCALE) * 100,
        sortOrder: displayNames.get(rarity)?.sortOrder ?? index + 1,
      })),
    };
  }
}
