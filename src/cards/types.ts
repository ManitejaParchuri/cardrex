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
export interface CardListResponse {
  cards: CollectibleCard[];
  pagination: {
    page: number;
    pageSize: number;
    total: number;
    totalPages: number;
  };
}
