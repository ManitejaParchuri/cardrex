import type { RequestHandler } from 'express';

export function claimRateLimit(limit = 8, windowMs = 60_000): RequestHandler {
  const attempts = new Map<string, { count: number; resetAt: number }>();
  return (req, res, next) => {
    const now = Date.now();
    const key = req.ip ?? 'unknown';
    const current = attempts.get(key);
    const entry =
      !current || current.resetAt <= now
        ? { count: 1, resetAt: now + windowMs }
        : { ...current, count: current.count + 1 };
    attempts.set(key, entry);
    res.setHeader('RateLimit-Limit', String(limit));
    res.setHeader(
      'RateLimit-Remaining',
      String(Math.max(0, limit - entry.count)),
    );
    if (entry.count > limit) {
      res
        .status(429)
        .json({ error: 'Too many claim attempts. Please wait and try again.' });
      return;
    }
    next();
  };
}
