import {
  RARITIES,
  rarityByName,
  type Rarity,
  type RarityMetadata,
} from './types';

export type LayoutFamily =
  'foundation' | 'ascended' | 'sovereign' | 'celestial';
export type ArtworkCrop =
  | 'full-body'
  | 'three-quarter'
  | 'waist-up'
  | 'chest-up'
  | 'hero-portrait'
  | 'close-up'
  | 'cinematic-portrait'
  | 'mysterious-close-up';

export interface RarityDesignMetadata extends RarityMetadata {
  layoutFamily: LayoutFamily;
  artworkCrop: ArtworkCrop;
  artworkPosition: string;
  statStyle: string;
  emblemStyle: string;
  animationStyle: string;
}

const designs: Record<
  Rarity,
  Omit<RarityDesignMetadata, keyof RarityMetadata>
> = {
  COMMON: {
    layoutFamily: 'foundation',
    artworkCrop: 'full-body',
    artworkPosition: '50% 28%',
    statStyle: 'badge',
    emblemStyle: 'simple',
    animationStyle: 'restrained',
  },
  UNCOMMON: {
    layoutFamily: 'foundation',
    artworkCrop: 'three-quarter',
    artworkPosition: '50% 25%',
    statStyle: 'badge',
    emblemStyle: 'simple',
    animationStyle: 'particles',
  },
  RARE: {
    layoutFamily: 'ascended',
    artworkCrop: 'waist-up',
    artworkPosition: '50% 22%',
    statStyle: 'integrated',
    emblemStyle: 'facet',
    animationStyle: 'energy',
  },
  EPIC: {
    layoutFamily: 'ascended',
    artworkCrop: 'chest-up',
    artworkPosition: '50% 18%',
    statStyle: 'integrated',
    emblemStyle: 'arcane',
    animationStyle: 'pulse',
  },
  LEGENDARY: {
    layoutFamily: 'sovereign',
    artworkCrop: 'hero-portrait',
    artworkPosition: '50% 16%',
    statStyle: 'elevated',
    emblemStyle: 'crown',
    animationStyle: 'regal',
  },
  MYTHIC: {
    layoutFamily: 'sovereign',
    artworkCrop: 'close-up',
    artworkPosition: '50% 14%',
    statStyle: 'elevated',
    emblemStyle: 'fracture',
    animationStyle: 'fracture',
  },
  RAINBOW: {
    layoutFamily: 'celestial',
    artworkCrop: 'cinematic-portrait',
    artworkPosition: '50% 18%',
    statStyle: 'floating',
    emblemStyle: 'prism',
    animationStyle: 'aurora',
  },
  SECRET: {
    layoutFamily: 'celestial',
    artworkCrop: 'mysterious-close-up',
    artworkPosition: '54% 12%',
    statStyle: 'floating',
    emblemStyle: 'eclipse',
    animationStyle: 'glitch',
  },
};

export const rarityDesignByName = Object.fromEntries(
  RARITIES.map((name) => [name, { ...rarityByName[name], ...designs[name] }]),
) as Record<Rarity, RarityDesignMetadata>;

export const getRarityDesign = (rarity: Rarity) => rarityDesignByName[rarity];
