import { z } from 'zod';

export const createClaimSchema = z
  .object({ idempotencyKey: z.uuid() })
  .strict();
