import { beforeEach, describe, expect, it } from 'vitest';

import {
  BrowserGuestSessionStorage,
  createGuestSession,
  GUEST_SESSION_STORAGE_KEY,
  validateGuestDisplayName,
} from './guestSession';

describe('guest display-name validation', () => {
  it.each([
    ['', 'at least 3'],
    ['ab', 'at least 3'],
    ['abcdefghijklmnopqrstu', 'no more than 20'],
    ['Nova!', 'only letters'],
  ])('rejects %j', (value, message) => {
    expect(validateGuestDisplayName(value)).toContain(message);
  });

  it.each(['Nova Scout', 'nova_scout', 'Nova-42', '  Nova  '])(
    'accepts %j',
    (value) => expect(validateGuestDisplayName(value)).toBeNull(),
  );
});

describe('guest session service', () => {
  beforeEach(() => localStorage.clear());

  it('creates an opaque identity and trims the display name', () => {
    const first = createGuestSession('  Nova Scout  ');
    const second = createGuestSession('Nova Scout');

    expect(first.displayName).toBe('Nova Scout');
    expect(first.id).toMatch(/^guest_/);
    expect(first.id).not.toContain('Nova');
    expect(second.id).not.toBe(first.id);
  });

  it('persists and restores a session across storage instances', async () => {
    const session = createGuestSession('Nova Scout');
    await new BrowserGuestSessionStorage().save(session);

    await expect(new BrowserGuestSessionStorage().load()).resolves.toEqual(
      session,
    );
  });

  it('discards invalid stored session data', async () => {
    localStorage.setItem(
      GUEST_SESSION_STORAGE_KEY,
      JSON.stringify({
        version: 1,
        id: 'Nova Scout',
        displayName: 'Nova Scout',
      }),
    );

    await expect(new BrowserGuestSessionStorage().load()).resolves.toBeNull();
    expect(localStorage.getItem(GUEST_SESSION_STORAGE_KEY)).toBeNull();
  });
});
