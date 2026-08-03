import { Router } from 'express';
import type { CardService } from '../services/cards.js';
import { cardListQuerySchema } from '../validation/cards.js';
export function cardRouter(service: CardService) {
  const router = Router();
  router.get('/', async (req, res, next) => {
    try {
      const { rarity, page, pageSize } = cardListQuerySchema.parse(req.query);
      res.json(await service.list(rarity, page, pageSize));
    } catch (error) {
      next(error);
    }
  });
  return router;
}
export const rarityRouter = (service: CardService) =>
  Router().get('/', async (_req, res, next) => {
    try {
      res.json(await service.rarityOverview());
    } catch (error) {
      next(error);
    }
  });
