import { Rarity } from '@prisma/client';
import { z } from 'zod';
export const cardListQuerySchema = z.object({
  rarity: z.enum(Rarity).optional(),
  page: z.coerce.number().int().min(1).default(1),
  pageSize: z.coerce.number().int().min(1).max(50).default(24),
});
export const cardSlugSchema = z
  .string()
  .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/)
  .max(100);
