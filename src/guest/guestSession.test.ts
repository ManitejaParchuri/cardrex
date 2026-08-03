import { beforeEach, describe, expect, it, vi } from 'vitest';
import { GuestSessionApi, validateGuestDisplayName } from './guestSession';
describe('guest display-name validation', () => {
  it('accepts and trims supported names', () =>
    expect(validateGuestDisplayName(' Nova-7 ')).toBeNull());
  it.each(['ab', 'a'.repeat(21), 'Nova!'])('rejects invalid name %s', (name) =>
    expect(validateGuestDisplayName(name)).not.toBeNull(),
  );
});
describe('GuestSessionApi', () => {
  beforeEach(() => vi.restoreAllMocks());
  it('restores through credentialed API requests', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue(
        new Response(
          JSON.stringify({
            guest: {
              id: '1',
              displayName: 'Nova',
              createdAt: '2026-01-01',
              expiresAt: '2026-02-01',
            },
          }),
          { status: 200 },
        ),
      ),
    );
    expect((await new GuestSessionApi('/api').restore())?.displayName).toBe(
      'Nova',
    );
    expect(fetch).toHaveBeenCalledWith(
      '/api/guest-sessions/me',
      expect.objectContaining({ credentials: 'include' }),
    );
  });
  it('treats unauthorized restore as no session', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue(new Response(null, { status: 401 })),
    );
    expect(await new GuestSessionApi('/api').restore()).toBeNull();
  });
  it('reports API failures', async () => {
    vi.stubGlobal(
      'fetch',
      vi
        .fn()
        .mockResolvedValue(
          new Response(JSON.stringify({ error: 'Offline' }), { status: 503 }),
        ),
    );
    await expect(new GuestSessionApi('/api').create('Nova')).rejects.toThrow(
      'Offline',
    );
  });
});
