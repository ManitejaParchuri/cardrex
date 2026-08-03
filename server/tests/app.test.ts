import request from 'supertest';
import { describe, expect, it } from 'vitest';
import { createApp } from '../src/app.js';
import {
  CardService,
  type CardRepository,
  type PublicCard,
} from '../src/services/cards.js';
import {
  GuestSessionService,
  hashToken,
  type Guest,
  type GuestSessionRepository,
} from '../src/services/guestSessions.js';
import {
  ClaimService,
  type ClaimRepository,
  type ClaimView,
  type CreateClaimResult,
  type OwnedCardView,
} from '../src/services/claims.js';
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
  const cards = new MemoryCardRepo();
  const claims = new MemoryClaimRepo();
  return {
    repo,
    cards,
    app: createApp(
      env,
      new GuestSessionService(repo, ttl),
      new CardService(cards),
      new ClaimService(claims, () => 'COMMON'),
    ),
    claims,
  };
};
const sample = (overrides: Partial<PublicCard> = {}): PublicCard => ({
  name: 'Ari Vale',
  slug: 'ari-vale',
  rarity: 'COMMON',
  description: 'Courier',
  lore: 'Maps stars.',
  attack: 18,
  defense: 22,
  abilityName: 'Comet Dash',
  abilityDescription: 'Moves quickly.',
  imageUrl: '/card-art/ari.webp',
  collectionNumber: 1,
  ...overrides,
});
class MemoryCardRepo implements CardRepository {
  rows = [
    sample(),
    sample({
      name: 'Iona Prismark',
      slug: 'iona-prismark',
      rarity: 'RARE',
      collectionNumber: 2,
    }),
    sample({ name: 'Hidden', slug: 'hidden', collectionNumber: 3 }),
  ];
  inactive = new Set(['hidden']);
  visible(rarity?: PublicCard['rarity']) {
    return this.rows.filter(
      (card) =>
        !this.inactive.has(card.slug) && (!rarity || card.rarity === rarity),
    );
  }
  async list({
    rarity,
    skip,
    take,
  }: {
    rarity?: PublicCard['rarity'];
    skip: number;
    take: number;
  }) {
    return this.visible(rarity).slice(skip, skip + take);
  }
  async count(rarity?: PublicCard['rarity']) {
    return this.visible(rarity).length;
  }
  async findBySlug(slug: string) {
    return this.visible().find((card) => card.slug === slug) ?? null;
  }
}
class MemoryClaimRepo implements ClaimRepository {
  rows: Array<ClaimView & { guestSessionId: string; idempotencyKey: string }> =
    [];
  owned: Array<OwnedCardView & { guestSessionId: string }> = [];
  async createInitial({
    guestSessionId,
    idempotencyKey,
    rarityOrder,
  }: {
    guestSessionId: string;
    idempotencyKey: string;
    rarityOrder: PublicCard['rarity'][];
  }): Promise<CreateClaimResult> {
    const keyed = this.rows.find(
      (row) => row.idempotencyKey === idempotencyKey,
    );
    if (keyed)
      return keyed.guestSessionId === guestSessionId
        ? { kind: 'replayed', claim: keyed }
        : { kind: 'key-conflict' };
    const existing = this.rows.find(
      (row) => row.guestSessionId === guestSessionId,
    );
    if (existing) return { kind: 'already-claimed', claim: existing };
    const card = sample({ rarity: rarityOrder[0] });
    const claim = {
      id: crypto.randomUUID(),
      guestSessionId,
      idempotencyKey,
      rarity: card.rarity,
      createdAt: new Date(),
      card,
    };
    this.rows.push(claim);
    this.owned.push({
      guestSessionId,
      obtainedAt: claim.createdAt,
      claimId: claim.id,
      card,
    });
    return { kind: 'created', claim };
  }
  async findClaim(guestSessionId: string) {
    return (
      this.rows.find((row) => row.guestSessionId === guestSessionId) ?? null
    );
  }
  async listOwned(guestSessionId: string) {
    return this.owned.filter((row) => row.guestSessionId === guestSessionId);
  }
}
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
  it('lists active cards without internal fields', async () => {
    const response = await request(setup().app).get('/api/cards').expect(200);
    expect(response.body.cards).toHaveLength(2);
    expect(response.body.cards[0]).not.toHaveProperty('id');
    expect(
      response.body.cards.map((card: PublicCard) => card.slug),
    ).not.toContain('hidden');
  });
  it('filters cards by rarity', async () => {
    const response = await request(setup().app)
      .get('/api/cards?rarity=RARE')
      .expect(200);
    expect(response.body.cards.map((card: PublicCard) => card.rarity)).toEqual([
      'RARE',
    ]);
  });
  it('paginates cards and caps page size', async () => {
    const response = await request(setup().app)
      .get('/api/cards?page=2&pageSize=1')
      .expect(200);
    expect(response.body.cards[0].slug).toBe('iona-prismark');
    expect(response.body.pagination).toEqual({
      page: 2,
      pageSize: 1,
      total: 2,
      totalPages: 2,
    });
    await request(setup().app).get('/api/cards?pageSize=51').expect(400);
  });
  it('does not publicly expose direct card details', async () => {
    await request(setup().app).get('/api/cards/ari-vale').expect(404);
    await request(setup().app).get('/api/cards/hidden').expect(404);
    await request(setup().app).get('/api/cards/missing').expect(404);
  });
  it('rejects invalid rarity values', async () => {
    await request(setup().app).get('/api/cards?rarity=ULTRA').expect(400);
  });
  it('publishes active-only rarity statistics without card information', async () => {
    const response = await request(setup().app)
      .get('/api/rarities')
      .expect(200);
    expect(response.body).toMatchObject({
      totalActiveCards: 2,
      probabilityTotal: 100,
    });
    expect(response.body.rarities).toHaveLength(8);
    expect(response.body.rarities[7]).toMatchObject({
      rarity: 'SECRET',
      displayName: 'Secret',
      activeCardCount: 0,
      probability: 0.5,
      sortOrder: 8,
    });
    expect(response.body.rarities[0]).toMatchObject({
      rarity: 'COMMON',
      activeCardCount: 1,
      probability: 45,
    });
    const body = JSON.stringify(response.body);
    for (const secret of [
      'Ari Vale',
      'ari-vale',
      'imageUrl',
      'description',
      'lore',
      'attack',
      'defense',
      'Hidden',
    ]) {
      expect(body).not.toContain(secret);
    }
  });
  it('rejects unauthenticated and malformed claims', async () => {
    await request(setup().app)
      .post('/api/claims')
      .send({ idempotencyKey: crypto.randomUUID() })
      .expect(401);
    const agent = request.agent(setup().app);
    await agent.post('/api/guest-sessions').send({ displayName: 'Nova' });
    await agent.post('/api/claims').send({}).expect(400);
    await agent
      .post('/api/claims')
      .send({ idempotencyKey: 'bad', rarity: 'SECRET' })
      .expect(400);
  });
  it('creates one transactional ownership and replays the same key', async () => {
    const { app, claims } = setup();
    const agent = request.agent(app);
    await agent.post('/api/guest-sessions').send({ displayName: 'Nova' });
    const key = crypto.randomUUID();
    const first = await agent
      .post('/api/claims')
      .send({ idempotencyKey: key })
      .expect(201);
    const replay = await agent
      .post('/api/claims')
      .send({ idempotencyKey: key })
      .expect(200);
    expect(replay.body.claim.id).toBe(first.body.claim.id);
    expect(claims.rows).toHaveLength(1);
    expect(claims.owned).toHaveLength(1);
  });
  it('rejects a second initial claim and returns status and collection', async () => {
    const { app } = setup();
    const agent = request.agent(app);
    await agent.post('/api/guest-sessions').send({ displayName: 'Nova' });
    expect((await agent.get('/api/claims/me').expect(200)).body.claimed).toBe(
      false,
    );
    await agent
      .post('/api/claims')
      .send({ idempotencyKey: crypto.randomUUID() })
      .expect(201);
    await agent
      .post('/api/claims')
      .send({ idempotencyKey: crypto.randomUUID() })
      .expect(409);
    const status = await agent.get('/api/claims/me').expect(200);
    expect(status.body.claimed).toBe(true);
    const collection = await agent.get('/api/collection').expect(200);
    expect(collection.body.cards[0].card.slug).toBe('ari-vale');
    expect(collection.body.cards[0].card).not.toHaveProperty('id');
    expect(
      (await agent.get('/api/collection/ari-vale').expect(200)).body.card.name,
    ).toBe('Ari Vale');
    await agent.get('/api/collection/iona-prismark').expect(404);
  });

  it('does not expose card details through collection routes to other guests', async () => {
    const { app } = setup();
    await request(app).get('/api/collection/ari-vale').expect(401);
    const agent = request.agent(app);
    await agent.post('/api/guest-sessions').send({ displayName: 'Nova' });
    await agent.get('/api/collection/ari-vale').expect(404);
  });
});
