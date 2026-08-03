import rarityMetadata from '../../../shared/rarities.json' with { type: 'json' };
import type { Rarity } from '@prisma/client';
import { z } from 'zod';

const rarityNames = rarityMetadata.map(({ name }) => name) as [
  Rarity,
  ...Rarity[],
];
export const cardListQuerySchema = z.object({
  rarity: z.enum(rarityNames).optional(),
  page: z.coerce.number().int().min(1).default(1),
  pageSize: z.coerce.number().int().min(1).max(50).default(24),
});
export const cardSlugSchema = z
  .string()
  .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/)
  .max(100);
