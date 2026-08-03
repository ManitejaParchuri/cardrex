import { render, screen, waitFor } from '@testing-library/react';
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
  imageUrl: '/missing.webp',
  collectionNumber: 15,
};
afterEach(() => vi.restoreAllMocks());
describe('CollectionPage archive', () => {
  it('shows loading for both personal collection and archive', () => {
    vi.stubGlobal(
      'fetch',
      vi.fn(() => new Promise(() => undefined)),
    );
    render(<CollectionPage />);
    expect(
      screen.getAllByRole('status').map((item) => item.textContent),
    ).toEqual(
      expect.arrayContaining([
        'Loading your collection',
        'Loading Card Archive',
      ]),
    );
  });
  it('shows an archive error state', async () => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue({ ok: false }));
    render(<CollectionPage />);
    expect(await screen.findByText('Archive signal lost')).toBeInTheDocument();
  });
  it('renders rarity metadata and card details', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn((url: string) =>
        Promise.resolve({
          ok: true,
          json: async () =>
            url.includes('/collection')
              ? { cards: [] }
              : {
                  cards: [card],
                  pagination: {
                    page: 1,
                    pageSize: 50,
                    total: 1,
                    totalPages: 1,
                  },
                },
        }),
      ),
    );
    render(<CollectionPage />);
    expect(
      await screen.findByRole('article', { name: 'Iona Prismark, Rare' }),
    ).toHaveTextContent('Azure');
    expect(screen.getByText('ATK 51')).toBeInTheDocument();
    await waitFor(() =>
      expect(screen.queryByRole('status')).not.toBeInTheDocument(),
    );
  });
});
