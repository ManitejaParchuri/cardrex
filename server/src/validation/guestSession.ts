import { z } from 'zod';
export const displayNameSchema = z
  .string()
  .trim()
  .min(3)
  .max(20)
  .regex(
    /^[A-Za-z0-9 _-]+$/,
    'Use only letters, numbers, spaces, underscores, and hyphens.',
  );
export const createGuestSessionSchema = z.object({
  displayName: displayNameSchema,
});
