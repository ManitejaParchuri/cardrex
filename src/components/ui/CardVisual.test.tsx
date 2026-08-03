import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import cardStyles from '../../index.css?raw';
import { getRarityDesign } from '../../cards/rarityDesign';
import type { CollectibleCard, Rarity } from '../../cards/types';
import { CardVisual, type CardVisualVariant } from './CardVisual';

const makeCard = (
  rarity: Rarity,
  name = `${rarity} Sentinel`,
): CollectibleCard => ({
  name,
  slug: `${rarity.toLowerCase()}-sentinel`,
  rarity,
  description: 'A test sentinel.',
  lore: 'A long-lived guardian of the Cardrex vault.',
  attack: 72,
  defense: 64,
  abilityName: 'Vault Ward',
  abilityDescription: 'Raises a luminous ward around every allied card.',
  imageUrl: `/cards/${rarity.toLowerCase()}.webp`,
  collectionNumber: 7,
});

describe('rarity card design system', () => {
  it.each([
    ['COMMON', 'foundation'],
    ['UNCOMMON', 'foundation'],
    ['RARE', 'ascended'],
    ['EPIC', 'ascended'],
    ['LEGENDARY', 'sovereign'],
    ['MYTHIC', 'sovereign'],
    ['RAINBOW', 'celestial'],
    ['SECRET', 'celestial'],
  ] as const)('maps %s to the %s family', (rarity, family) => {
    expect(getRarityDesign(rarity).layoutFamily).toBe(family);
  });

  it.each([
    ['COMMON', 'foundation'],
    ['RARE', 'ascended'],
    ['LEGENDARY', 'sovereign'],
    ['RAINBOW', 'celestial'],
  ] as const)('renders the %s family', (rarity, family) => {
    const { container } = render(<CardVisual card={makeCard(rarity)} />);
    expect(container.querySelector('.card-visual')).toHaveAttribute(
      'data-family',
      family,
    );
  });

  it('gives Common and Legendary distinct frame identities', () => {
    const { container, rerender } = render(
      <CardVisual card={makeCard('COMMON')} />,
    );
    expect(container.querySelector('.card-visual')).toHaveAttribute(
      'data-family',
      'foundation',
    );
    rerender(<CardVisual card={makeCard('LEGENDARY')} />);
    expect(container.querySelector('.card-visual')).toHaveAttribute(
      'data-family',
      'sovereign',
    );
  });

  it.each(['RAINBOW', 'SECRET'] as const)(
    'uses celestial styling for %s',
    (rarity) => {
      const { container } = render(<CardVisual card={makeCard(rarity)} />);
      expect(container.querySelector('.card-visual')).toHaveAttribute(
        'data-family',
        'celestial',
      );
    },
  );

  it('changes artwork crop and position by rarity', () => {
    const { container, rerender } = render(
      <CardVisual card={makeCard('COMMON')} />,
    );
    const common = container.querySelector('[data-artwork-crop]');
    expect(common).toHaveAttribute('data-artwork-crop', 'full-body');
    rerender(<CardVisual card={makeCard('MYTHIC')} />);
    const mythic = container.querySelector('[data-artwork-crop]');
    expect(mythic).toHaveAttribute('data-artwork-crop', 'close-up');
    expect(mythic?.querySelector('img')).toHaveStyle({
      objectPosition: '50% 14%',
    });
  });

  it.each(['compact', 'reveal', 'detail'] as CardVisualVariant[])(
    'renders the %s variant',
    (variant) => {
      const { container } = render(
        <CardVisual card={makeCard('EPIC')} variant={variant} />,
      );
      expect(container.querySelector('.card-visual')).toHaveAttribute(
        'data-variant',
        variant,
      );
    },
  );

  it('keeps long names in a title-backed, truncation-safe heading', () => {
    const name =
      'The Incomprehensibly Long Sovereign of the Final Celestial Horizon';
    render(<CardVisual card={makeCard('LEGENDARY', name)} />);
    expect(screen.getByRole('heading', { name })).toHaveAttribute(
      'title',
      name,
    );
    expect(cardStyles).toContain('text-overflow: ellipsis');
  });

  it('disables nonessential card animation for reduced motion', () => {
    expect(cardStyles).toMatch(
      /prefers-reduced-motion: reduce[\s\S]*\.card-effect-orbit[\s\S]*animation: none !important/,
    );
  });
});
