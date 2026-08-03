import 'dotenv/config';
import { PrismaClient } from '@prisma/client';
import { cardSeedData } from './cardData.js';

export async function seedCards(prisma: Pick<PrismaClient, 'card'>) {
  await Promise.all(
    cardSeedData.map(({ slug, ...card }) =>
      prisma.card.upsert({
        where: { slug },
        create: { slug, ...card },
        update: card,
      }),
    ),
  );
}

if (process.env.NODE_ENV !== 'test') {
  const prisma = new PrismaClient();
  seedCards(prisma)
    .then(() => console.log(`Seeded ${cardSeedData.length} cards.`))
    .finally(() => prisma.$disconnect());
}
