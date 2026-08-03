import { createHash, randomBytes } from 'node:crypto';
export interface Guest {
  id: string;
  displayName: string;
  createdAt: Date;
  expiresAt: Date;
  revokedAt: Date | null;
  sessionTokenHash: string;
}
export interface GuestSessionRepository {
  create(data: {
    displayName: string;
    sessionTokenHash: string;
    expiresAt: Date;
  }): Promise<Guest>;
  findByHash(hash: string): Promise<Guest | null>;
  revoke(hash: string, at: Date): Promise<void>;
}
export const hashToken = (token: string) =>
  createHash('sha256').update(token).digest('hex');
export const safeGuest = ({
  id,
  displayName,
  createdAt,
  expiresAt,
}: Guest) => ({
  id,
  displayName,
  createdAt: createdAt.toISOString(),
  expiresAt: expiresAt.toISOString(),
});
export class GuestSessionService {
  constructor(
    private repository: GuestSessionRepository,
    private ttlDays = 30,
  ) {}
  async create(displayName: string) {
    const token = randomBytes(32).toString('base64url');
    const guest = await this.repository.create({
      displayName,
      sessionTokenHash: hashToken(token),
      expiresAt: new Date(Date.now() + this.ttlDays * 86400000),
    });
    return { token, guest: safeGuest(guest) };
  }
  async restore(token: string | undefined) {
    if (!token) return null;
    const guest = await this.repository.findByHash(hashToken(token));
    if (!guest || guest.revokedAt || guest.expiresAt <= new Date()) return null;
    return safeGuest(guest);
  }
  async revoke(token: string | undefined) {
    if (token) await this.repository.revoke(hashToken(token), new Date());
  }
}
