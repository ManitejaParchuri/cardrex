import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { CollectionPage } from './CollectionPage';

const card = {
  name: 'Iona Prismark',
  slug: 'iona-prismark',
  rarity: 'RARE',
  description: 'Archer',
  lore: 'Lore',
  attack: 51,
  defense: 38,
  abilityName: 'Sevenfold Volley',
  abilityDescription: 'Seven precise streaks.',
  imageUrl: '/cards/iona-prismark.svg',
  collectionNumber: 15,
};
const names = [
  'Common',
  'Uncommon',
  'Rare',
  'Epic',
  'Legendary',
  'Mythic',
  'Rainbow',
  'Secret',
];
const overview = {
  totalActiveCards: 32,
  probabilityTotal: 100,
  rarities: names.map((displayName, index) => ({
    rarity: displayName.toUpperCase(),
    displayName,
    activeCardCount: index + 1,
    probability: [45, 25, 14, 8, 4.5, 2, 1, 0.5][index],
    sortOrder: index + 1,
  })),
};

afterEach(() => vi.restoreAllMocks());

describe('CollectionPage', () => {
  it('replaces the unowned archive with the complete rarity overview', async () => {
    const fetch = vi.fn((url: string) =>
      Promise.resolve({
        ok: true,
        json: async () =>
          url.includes('/collection') ? { cards: [] } : overview,
      }),
    );
    vi.stubGlobal('fetch', fetch);
    render(
      <MemoryRouter>
        <CollectionPage />
      </MemoryRouter>,
    );

    expect(await screen.findByText('Rarity Overview')).toBeInTheDocument();
    names.forEach((name) => expect(screen.getByText(name)).toBeInTheDocument());
    expect(screen.getByText('Probability total: 100%')).toBeInTheDocument();
    expect(screen.getByText('Total active cards: 32')).toBeInTheDocument();
    expect(screen.queryByText('Card Archive')).not.toBeInTheDocument();
    expect(screen.queryByText('Discoverable cards')).not.toBeInTheDocument();
    expect(screen.queryByLabelText('Filter by rarity')).not.toBeInTheDocument();
    expect(screen.queryByRole('article')).not.toBeInTheDocument();
    expect(fetch).not.toHaveBeenCalledWith(
      expect.stringContaining('/cards'),
      expect.anything(),
    );
  });

  it('keeps owned cards and their detail links', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn((url: string) =>
        Promise.resolve({
          ok: true,
          json: async () =>
            url.includes('/collection')
              ? { cards: [{ card, claimId: 'claim', obtainedAt: '' }] }
              : overview,
        }),
      ),
    );
    render(
      <MemoryRouter>
        <CollectionPage />
      </MemoryRouter>,
    );
    expect(
      await screen.findByRole('article', { name: 'Iona Prismark, Rare' }),
    ).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /Iona Prismark/ })).toHaveAttribute(
      'href',
      '/cards/iona-prismark',
    );
  });
});
