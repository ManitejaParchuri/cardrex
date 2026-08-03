import request from 'supertest';
import { describe, expect, it } from 'vitest';
import { createApp } from '../src/app.js';
import {
  GuestSessionService,
  hashToken,
  type Guest,
  type GuestSessionRepository,
} from '../src/services/guestSessions.js';
class MemoryRepo implements GuestSessionRepository {
  rows: Guest[] = [];
  async create(data: Omit<Guest, 'id' | 'createdAt' | 'revokedAt'>) {
    const row = {
      ...data,
      id: crypto.randomUUID(),
      createdAt: new Date(),
      revokedAt: null,
    };
    this.rows.push(row);
    return row;
  }
  async findByHash(hash: string) {
    return this.rows.find((x) => x.sessionTokenHash === hash) ?? null;
  }
  async revoke(hash: string, at: Date) {
    const row = await this.findByHash(hash);
    if (row) row.revokedAt = at;
  }
}
const env = {
  NODE_ENV: 'test',
  PORT: 3001,
  DATABASE_URL: 'postgres://test',
  FRONTEND_ORIGIN: 'http://localhost:5173',
  GUEST_SESSION_TTL_DAYS: 30,
  COOKIE_SAME_SITE: 'lax',
} as const;
const setup = (ttl = 30) => {
  const repo = new MemoryRepo();
  return { repo, app: createApp(env, new GuestSessionService(repo, ttl)) };
};
describe('API', () => {
  it('reports health', async () =>
    expect((await request(setup().app).get('/api/health')).body).toEqual({
      status: 'ok',
    }));
  it('creates and restores a guest without exposing token hash', async () => {
    const { app } = setup();
    const agent = request.agent(app);
    const created = await agent
      .post('/api/guest-sessions')
      .send({ displayName: ' Nova ' })
      .expect(201);
    expect(created.body.guest.displayName).toBe('Nova');
    expect(created.body.guest.sessionTokenHash).toBeUndefined();
    expect(created.headers['set-cookie'][0]).toContain('HttpOnly');
    await agent.get('/api/guest-sessions/me').expect(200);
  });
  it.each(['ab', 'x'.repeat(21), 'Nova!'])(
    'rejects invalid display name %s',
    async (name) => {
      await request(setup().app)
        .post('/api/guest-sessions')
        .send({ displayName: name })
        .expect(400);
    },
  );
  it('rejects expired sessions', async () => {
    const { app } = setup(-1);
    const agent = request.agent(app);
    await agent.post('/api/guest-sessions').send({ displayName: 'Nova' });
    await agent.get('/api/guest-sessions/me').expect(401);
  });
  it('rejects revoked sessions and deletion clears cookie', async () => {
    const { app, repo } = setup();
    const agent = request.agent(app);
    const response = await agent
      .post('/api/guest-sessions')
      .send({ displayName: 'Nova' });
    const raw =
      /cardrex_guest_session=([^;]+)/.exec(
        response.headers['set-cookie'][0],
      )?.[1] ?? '';
    await agent.delete('/api/guest-sessions/me').expect(204);
    expect((await repo.findByHash(hashToken(raw)))?.revokedAt).not.toBeNull();
    await agent.get('/api/guest-sessions/me').expect(401);
  });
});
