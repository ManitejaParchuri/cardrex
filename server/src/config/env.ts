import 'dotenv/config';
import { z } from 'zod';
const schema = z.object({
  NODE_ENV: z
    .enum(['development', 'test', 'production'])
    .default('development'),
  PORT: z.coerce.number().int().positive().default(3001),
  DATABASE_URL: z.string().min(1),
  FRONTEND_ORIGIN: z.string().url().default('http://localhost:5173'),
  GUEST_SESSION_TTL_DAYS: z.coerce.number().int().positive().default(30),
  COOKIE_SAME_SITE: z.enum(['lax', 'strict', 'none']).default('lax'),
});
export type Environment = z.infer<typeof schema>;
export const readEnvironment = (
  source: NodeJS.ProcessEnv = process.env,
): Environment => schema.parse(source);
