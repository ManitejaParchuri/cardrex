import { Router } from 'express';
import { claimRateLimit } from '../middleware/claimRateLimit.js';
import type { ClaimService } from '../services/claims.js';
import { safeClaim } from '../services/claims.js';
import type { GuestSessionService } from '../services/guestSessions.js';
import { createClaimSchema } from '../validation/claims.js';
import { COOKIE_NAME } from './guestSessions.js';

export function claimRouter(guests: GuestSessionService, claims: ClaimService) {
  const router = Router();
  const authenticate = async (
    req: { cookies: Record<string, string> },
    res: { status: (code: number) => { json: (body: unknown) => void } },
  ) => {
    const guest = await guests.authenticate(req.cookies[COOKIE_NAME]);
    if (!guest)
      res.status(401).json({ error: 'A valid guest session is required' });
    return guest;
  };

  router.get('/me', async (req, res, next) => {
    try {
      const guest = await authenticate(req, res);
      if (guest) res.json(await claims.status(guest.id));
    } catch (error) {
      next(error);
    }
  });
  router.post('/', claimRateLimit(), async (req, res, next) => {
    try {
      const guest = await authenticate(req, res);
      if (!guest) return;
      const { idempotencyKey } = createClaimSchema.parse(req.body);
      const result = await claims.create(guest.id, idempotencyKey);
      if (result.kind === 'key-conflict') {
        res.status(409).json({ error: 'Idempotency key is already in use' });
      } else if (result.kind === 'already-claimed') {
        res.status(409).json({
          error: 'This guest has already claimed a card',
          claim: safeClaim(result.claim),
        });
      } else if (result.kind === 'no-active-cards') {
        res.status(503).json({ error: 'No active cards are available' });
      } else {
        res
          .status(result.kind === 'created' ? 201 : 200)
          .json({ claim: safeClaim(result.claim) });
      }
    } catch (error) {
      next(error);
    }
  });
  return router;
}

export function collectionRouter(
  guests: GuestSessionService,
  claims: ClaimService,
) {
  return Router().get('/', async (req, res, next) => {
    try {
      const guest = await guests.authenticate(req.cookies[COOKIE_NAME]);
      if (!guest) {
        res.status(401).json({ error: 'A valid guest session is required' });
        return;
      }
      res.json(await claims.collection(guest.id));
    } catch (error) {
      next(error);
    }
  });
}
