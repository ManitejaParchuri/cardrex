import type { PrismaClient } from '@prisma/client';
import type { GuestSessionRepository } from './guestSessions.js';
export const prismaGuestSessionRepository = (
  prisma: PrismaClient,
): GuestSessionRepository => ({
  create: (data) => prisma.guestSession.create({ data }),
  findByHash: (sessionTokenHash) =>
    prisma.guestSession.findUnique({ where: { sessionTokenHash } }),
  revoke: async (sessionTokenHash, revokedAt) => {
    await prisma.guestSession.updateMany({
      where: { sessionTokenHash, revokedAt: null },
      data: { revokedAt },
    });
  },
});
