import { Router } from 'express';
import type { CookieOptions } from 'express';
import { createGuestSessionSchema } from '../validation/guestSession.js';
import type { GuestSessionService } from '../services/guestSessions.js';
export const COOKIE_NAME = 'cardrex_guest_session';
export function guestSessionRouter(
  service: GuestSessionService,
  cookie: CookieOptions,
) {
  const router = Router();
  router.post('/', async (req, res, next) => {
    try {
      const { displayName } = createGuestSessionSchema.parse(req.body);
      const result = await service.create(displayName);
      res
        .cookie(COOKIE_NAME, result.token, cookie)
        .status(201)
        .json({ guest: result.guest });
    } catch (e) {
      next(e);
    }
  });
  router.get('/me', async (req, res, next) => {
    try {
      const guest = await service.restore(req.cookies[COOKIE_NAME]);
      if (!guest) {
        res.status(401).json({ error: 'No valid guest session' });
        return;
      }
      res.json({ guest });
    } catch (e) {
      next(e);
    }
  });
  router.delete('/me', async (req, res, next) => {
    try {
      await service.revoke(req.cookies[COOKIE_NAME]);
      res.clearCookie(COOKIE_NAME, cookie).status(204).send();
    } catch (e) {
      next(e);
    }
  });
  return router;
}
