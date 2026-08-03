import { Router } from 'express';
import rarityMetadata from '../../../shared/rarities.json' with { type: 'json' };
import type { CardService } from '../services/cards.js';
import { cardListQuerySchema, cardSlugSchema } from '../validation/cards.js';
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
  router.get('/:slug', async (req, res, next) => {
    try {
      const slug = cardSlugSchema.parse(req.params.slug);
      const card = await service.findBySlug(slug);
      if (!card) {
        res.status(404).json({ error: 'Card not found' });
        return;
      }
      res.json({ card });
    } catch (error) {
      next(error);
    }
  });
  return router;
}
export const rarityRouter = Router().get('/', (_req, res) =>
  res.json({ rarities: rarityMetadata }),
);
