import type { ErrorRequestHandler, RequestHandler } from 'express';
import { ZodError } from 'zod';
export const notFound: RequestHandler = (_req, res) => {
  res.status(404).json({ error: 'Not found' });
};
export const errorHandler: ErrorRequestHandler = (error, _req, res, next) => {
  void next;
  if (error instanceof ZodError) {
    res.status(400).json({ error: 'Invalid request', details: error.issues });
    return;
  }
  console.error(error);
  res.status(500).json({ error: 'Internal server error' });
};
