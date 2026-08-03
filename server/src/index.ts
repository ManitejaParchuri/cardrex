import { createApp } from './app.js';
import { prisma } from './config/database.js';
import { readEnvironment } from './config/env.js';
import { GuestSessionService } from './services/guestSessions.js';
import { prismaGuestSessionRepository } from './services/prismaGuestSessionRepository.js';
const env = readEnvironment();
const app = createApp(
  env,
  new GuestSessionService(
    prismaGuestSessionRepository(prisma),
    env.GUEST_SESSION_TTL_DAYS,
  ),
);
const server = app.listen(env.PORT, () =>
  console.log(`Cardrex API listening on ${env.PORT}`),
);
const shutdown = () => server.close(() => void prisma.$disconnect());
process.on('SIGTERM', shutdown);
process.on('SIGINT', shutdown);
