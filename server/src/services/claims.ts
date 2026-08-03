import type { Rarity } from '@prisma/client';
import type { PublicCard } from './cards.js';
import { canMakeInitialClaim } from './claimLimits.js';
import { fallbackRarities, selectRarity } from './raritySelection.js';

export interface ClaimView {
  id: string;
  rarity: Rarity;
  createdAt: Date;
  card: PublicCard;
}

export interface OwnedCardView {
  obtainedAt: Date;
  claimId: string;
  card: PublicCard;
}

export type CreateClaimResult =
  | { kind: 'created' | 'replayed'; claim: ClaimView }
  | { kind: 'already-claimed'; claim: ClaimView }
  | { kind: 'key-conflict' }
  | { kind: 'no-active-cards' };

export interface ClaimRepository {
  createInitial(input: {
    guestSessionId: string;
    idempotencyKey: string;
    rarityOrder: Rarity[];
  }): Promise<CreateClaimResult>;
  findClaim(guestSessionId: string): Promise<ClaimView | null>;
  listOwned(guestSessionId: string): Promise<OwnedCardView[]>;
}

export const safeClaim = (claim: ClaimView) => ({
  id: claim.id,
  rarity: claim.rarity,
  createdAt: claim.createdAt.toISOString(),
  card: claim.card,
});

export const safeOwnedCard = (owned: OwnedCardView) => ({
  obtainedAt: owned.obtainedAt.toISOString(),
  claimId: owned.claimId,
  card: owned.card,
});

export class ClaimService {
  constructor(
    private repository: ClaimRepository,
    private raritySelector: () => Rarity = selectRarity,
  ) {}

  create(guestSessionId: string, idempotencyKey: string) {
    const rarity = this.raritySelector();
    return this.repository.createInitial({
      guestSessionId,
      idempotencyKey,
      rarityOrder: fallbackRarities(rarity),
    });
  }

  async status(guestSessionId: string) {
    const claim = await this.repository.findClaim(guestSessionId);
    return claim
      ? { claimed: true as const, claim: safeClaim(claim), card: claim.card }
      : { claimed: false as const, claim: null, card: null };
  }

  async collection(guestSessionId: string) {
    const owned = await this.repository.listOwned(guestSessionId);
    return { cards: owned.map(safeOwnedCard) };
  }
}

// Kept exported so the Phase 5 policy has a single replaceable decision point.
export { canMakeInitialClaim };
