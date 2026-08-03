export const GUEST_SESSION_STORAGE_KEY = 'cardrex.guest-session';

export interface GuestSession {
  id: string;
  displayName: string;
  createdAt: string;
}

export interface GuestSessionStorage {
  load(): Promise<GuestSession | null>;
  save(session: GuestSession): Promise<void>;
  clear(): Promise<void>;
}

interface StoredGuestSession extends GuestSession {
  version: 1;
}

const GUEST_ID_PATTERN =
  /^guest_[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
const DISPLAY_NAME_PATTERN = /^[A-Za-z0-9 _-]+$/;

export function validateGuestDisplayName(value: string): string | null {
  const trimmed = value.trim();

  if (trimmed.length < 3) return 'Use at least 3 characters.';
  if (trimmed.length > 20) return 'Use no more than 20 characters.';
  if (!DISPLAY_NAME_PATTERN.test(trimmed)) {
    return 'Use only letters, numbers, spaces, underscores, and hyphens.';
  }

  return null;
}

export function isGuestSession(value: unknown): value is GuestSession {
  if (!value || typeof value !== 'object') return false;

  const session = value as Partial<StoredGuestSession>;
  return (
    session.version === 1 &&
    typeof session.id === 'string' &&
    GUEST_ID_PATTERN.test(session.id) &&
    typeof session.displayName === 'string' &&
    validateGuestDisplayName(session.displayName) === null &&
    session.displayName === session.displayName.trim() &&
    typeof session.createdAt === 'string' &&
    !Number.isNaN(Date.parse(session.createdAt))
  );
}

export function createGuestSession(displayName: string): GuestSession {
  const trimmed = displayName.trim();
  const error = validateGuestDisplayName(trimmed);
  if (error) throw new Error(error);

  return {
    id: `guest_${crypto.randomUUID()}`,
    displayName: trimmed,
    createdAt: new Date().toISOString(),
  };
}

export class BrowserGuestSessionStorage implements GuestSessionStorage {
  async load(): Promise<GuestSession | null> {
    const serialized = localStorage.getItem(GUEST_SESSION_STORAGE_KEY);
    if (!serialized) return null;

    try {
      const parsed: unknown = JSON.parse(serialized);
      if (isGuestSession(parsed)) {
        const { id, displayName, createdAt } = parsed;
        return { id, displayName, createdAt };
      }
    } catch {
      // Invalid browser data is discarded below.
    }

    localStorage.removeItem(GUEST_SESSION_STORAGE_KEY);
    return null;
  }

  async save(session: GuestSession): Promise<void> {
    localStorage.setItem(
      GUEST_SESSION_STORAGE_KEY,
      JSON.stringify({ version: 1, ...session } satisfies StoredGuestSession),
    );
  }

  async clear(): Promise<void> {
    localStorage.removeItem(GUEST_SESSION_STORAGE_KEY);
  }
}
