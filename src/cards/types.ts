import rarityData from '../../shared/rarities.json';
export const RARITIES = [
  'COMMON',
  'UNCOMMON',
  'RARE',
  'EPIC',
  'LEGENDARY',
  'MYTHIC',
  'RAINBOW',
  'SECRET',
] as const;
export type Rarity = (typeof RARITIES)[number];
export interface RarityMetadata {
  name: Rarity;
  displayName: string;
  visualLabel: string;
  borderStyle: string;
  glowStyle: string;
  sortOrder: number;
}
export const rarityMetadata = rarityData as RarityMetadata[];
export const rarityByName = Object.fromEntries(
  rarityMetadata.map((item) => [item.name, item]),
) as Record<Rarity, RarityMetadata>;
export interface CollectibleCard {
  name: string;
  slug: string;
  rarity: Rarity;
  description: string;
  lore: string;
  attack: number;
  defense: number;
  abilityName: string;
  abilityDescription: string;
  imageUrl: string;
  collectionNumber: number;
}
export interface RarityOverview {
  totalActiveCards: number;
  probabilityTotal: number;
  rarities: Array<{
    rarity: Rarity;
    displayName: string;
    activeCardCount: number;
    probability: number;
    sortOrder: number;
  }>;
}
export interface Claim {
  id: string;
  rarity: Rarity;
  createdAt: string;
  card: CollectibleCard;
}
export interface ClaimStatus {
  claimed: boolean;
  claim: Claim | null;
  card: CollectibleCard | null;
}
export interface OwnedCard {
  obtainedAt: string;
  claimId: string;
  card: CollectibleCard;
}
