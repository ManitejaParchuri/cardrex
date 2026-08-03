export interface GuestSession {
  id: string;
  displayName: string;
  createdAt: string;
  expiresAt: string;
}
export const validateGuestDisplayName = (value: string): string | null => {
  const trimmed = value.trim();
  if (trimmed.length < 3) return 'Use at least 3 characters.';
  if (trimmed.length > 20) return 'Use no more than 20 characters.';
  if (!/^[A-Za-z0-9 _-]+$/.test(trimmed))
    return 'Use only letters, numbers, spaces, underscores, and hyphens.';
  return null;
};
export class GuestSessionApi {
  constructor(
    private baseUrl = import.meta.env.VITE_API_URL ??
      'http://localhost:3001/api',
  ) {}
  private async request(path: string, init?: RequestInit) {
    const response = await fetch(`${this.baseUrl}${path}`, {
      ...init,
      credentials: 'include',
      headers: init?.body
        ? { 'Content-Type': 'application/json', ...init.headers }
        : init?.headers,
    });
    if (response.status === 401) return null;
    if (!response.ok) {
      const body = (await response.json().catch(() => null)) as {
        error?: string;
      } | null;
      throw new Error(
        body?.error ?? 'The guest service is unavailable. Please try again.',
      );
    }
    return response.status === 204 ? null : response.json();
  }
  async restore(): Promise<GuestSession | null> {
    const data = (await this.request('/guest-sessions/me')) as {
      guest: GuestSession;
    } | null;
    return data?.guest ?? null;
  }
  async create(displayName: string): Promise<GuestSession> {
    const data = (await this.request('/guest-sessions', {
      method: 'POST',
      body: JSON.stringify({ displayName: displayName.trim() }),
    })) as { guest: GuestSession };
    return data.guest;
  }
  async clear(): Promise<void> {
    await this.request('/guest-sessions/me', { method: 'DELETE' });
  }
}
