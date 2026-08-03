import type { PrismaClient } from '@prisma/client';
import { publicCardSelect, type CardRepository } from './cards.js';
export const prismaCardRepository = (prisma: PrismaClient): CardRepository => ({
  list: ({ rarity, skip, take }) =>
    prisma.card.findMany({
      where: { active: true, ...(rarity ? { rarity } : {}) },
      select: publicCardSelect,
      orderBy: { collectionNumber: 'asc' },
      skip,
      take,
    }),
  count: (rarity) =>
    prisma.card.count({
      where: { active: true, ...(rarity ? { rarity } : {}) },
    }),
  findBySlug: (slug) =>
    prisma.card.findFirst({
      where: { slug, active: true },
      select: publicCardSelect,
    }),
});
