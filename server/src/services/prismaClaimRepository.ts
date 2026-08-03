import { randomInt } from 'node:crypto';
import { Prisma, type PrismaClient, type Rarity } from '@prisma/client';
import { publicCardSelect } from './cards.js';
import type {
  ClaimRepository,
  ClaimView,
  CreateClaimResult,
} from './claims.js';

const claimInclude = { card: { select: publicCardSelect } } as const;
const toView = (
  claim: Awaited<ReturnType<PrismaClient['cardClaim']['findFirst']>> & {
    card?: ClaimView['card'];
  },
): ClaimView => {
  if (!claim || !claim.card) throw new Error('Claim is missing its card');
  return {
    id: claim.id,
    rarity: claim.rarity,
    createdAt: claim.createdAt,
    card: claim.card,
  };
};

export const prismaClaimRepository = (
  prisma: PrismaClient,
): ClaimRepository => ({
  async createInitial({ guestSessionId, idempotencyKey, rarityOrder }) {
    const run = () =>
      prisma.$transaction(
        async (tx): Promise<CreateClaimResult> => {
          const keyed = await tx.cardClaim.findUnique({
            where: { idempotencyKey },
            include: claimInclude,
          });
          if (keyed)
            return keyed.guestSessionId === guestSessionId
              ? { kind: 'replayed', claim: toView(keyed) }
              : { kind: 'key-conflict' };

          const existing = await tx.cardClaim.findUnique({
            where: { guestSessionId },
            include: claimInclude,
          });
          if (existing)
            return { kind: 'already-claimed', claim: toView(existing) };

          let selectedRarity: Rarity | undefined;
          let cardId: string | undefined;
          for (const rarity of rarityOrder) {
            const count = await tx.card.count({
              where: { active: true, rarity },
            });
            if (!count) continue;
            const card = await tx.card.findFirst({
              where: { active: true, rarity },
              orderBy: { collectionNumber: 'asc' },
              skip: randomInt(count),
              select: { id: true },
            });
            if (card) {
              selectedRarity = rarity;
              cardId = card.id;
              break;
            }
          }
          if (!cardId || !selectedRarity) return { kind: 'no-active-cards' };

          const claim = await tx.cardClaim.create({
            data: {
              guestSessionId,
              cardId,
              rarity: selectedRarity,
              idempotencyKey,
              ownership: { create: { guestSessionId, cardId } },
            },
            include: claimInclude,
          });
          return { kind: 'created', claim: toView(claim) };
        },
        { isolationLevel: Prisma.TransactionIsolationLevel.Serializable },
      );

    try {
      return await run();
    } catch (error) {
      if (
        !(error instanceof Prisma.PrismaClientKnownRequestError) ||
        !['P2002', 'P2034'].includes(error.code)
      )
        throw error;
      const keyed = await prisma.cardClaim.findUnique({
        where: { idempotencyKey },
        include: claimInclude,
      });
      if (keyed)
        return keyed.guestSessionId === guestSessionId
          ? { kind: 'replayed', claim: toView(keyed) }
          : { kind: 'key-conflict' };
      const existing = await prisma.cardClaim.findUnique({
        where: { guestSessionId },
        include: claimInclude,
      });
      if (existing) return { kind: 'already-claimed', claim: toView(existing) };
      if (error.code === 'P2034') return run();
      throw error;
    }
  },
  async findClaim(guestSessionId) {
    const claim = await prisma.cardClaim.findUnique({
      where: { guestSessionId },
      include: claimInclude,
    });
    return claim ? toView(claim) : null;
  },
  async listOwned(guestSessionId) {
    const rows = await prisma.guestCard.findMany({
      where: { guestSessionId, card: { active: true } },
      orderBy: { obtainedAt: 'desc' },
      select: {
        obtainedAt: true,
        claimId: true,
        card: { select: publicCardSelect },
      },
    });
    return rows;
  },
});
