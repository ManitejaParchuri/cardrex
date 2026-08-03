import type { Rarity } from '@prisma/client';

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
}
