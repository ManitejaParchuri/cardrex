import cookieParser from 'cookie-parser';
import cors from 'cors';
import express from 'express';
import helmet from 'helmet';
import morgan from 'morgan';
import type { Environment } from './config/env.js';
import { errorHandler, notFound } from './middleware/errors.js';
import { guestSessionRouter } from './routes/guestSessions.js';
import { cardRouter, rarityRouter } from './routes/cards.js';
import type { CardService } from './services/cards.js';
import type { GuestSessionService } from './services/guestSessions.js';
export function createApp(
  env: Environment,
  service: GuestSessionService,
  cardService: CardService,
) {
  const app = express();
  app.disable('x-powered-by');
  app.use(helmet());
  app.use(cors({ origin: env.FRONTEND_ORIGIN, credentials: true }));
  if (env.NODE_ENV === 'development') app.use(morgan('dev'));
  app.use(express.json({ limit: '10kb' }));
  app.use(cookieParser());
  app.get('/api/health', (_req, res) => res.json({ status: 'ok' }));
  const cookie = {
    httpOnly: true,
    secure: env.NODE_ENV === 'production',
    sameSite: env.COOKIE_SAME_SITE,
    path: '/',
    maxAge: env.GUEST_SESSION_TTL_DAYS * 86400000,
  } as const;
  app.use('/api/guest-sessions', guestSessionRouter(service, cookie));
  app.use('/api/cards', cardRouter(cardService));
  app.use('/api/rarities', rarityRouter);
  app.use(notFound);
  app.use(errorHandler);
  return app;
}
