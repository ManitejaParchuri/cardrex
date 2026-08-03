import { render, screen } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { describe, expect, it, vi } from 'vitest';

import { AppLayout } from '../components/layout/AppLayout';
import { GuestSessionProvider } from '../guest/GuestSessionContext';
import type { GuestSessionApi } from '../guest/guestSession';
import { CardOpeningPage } from './CardOpeningPage';
import { CollectionPage } from './CollectionPage';

describe('phase three experience', () => {
  it('shows a polished empty state when the collection has no cards', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn((url: string) =>
        Promise.resolve({
          ok: true,
          json: async () =>
            url.includes('/collection')
              ? { cards: [] }
              : {
                  totalActiveCards: 0,
                  probabilityTotal: 100,
                  rarities: [],
                },
        }),
      ),
    );
    render(
      <MemoryRouter>
        <CollectionPage />
      </MemoryRouter>,
    );

    expect(
      await screen.findByRole('heading', { name: 'Your collection awaits' }),
    ).toBeInTheDocument();
    expect(screen.getByText(/Open your mystery box/)).toBeInTheDocument();
    expect(screen.queryByText(/null|undefined|\{\}/i)).not.toBeInTheDocument();
  });

  it('uses a safe identity fallback when guest profile data is missing', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn(() => new Promise(() => undefined)),
    );
    const api = {
      restore: vi.fn().mockResolvedValue({ id: 'guest', displayName: null }),
      create: vi.fn(),
      clear: vi.fn(),
    } as unknown as GuestSessionApi;

    render(
      <GuestSessionProvider api={api}>
        <MemoryRouter initialEntries={['/collection']}>
          <Routes>
            <Route element={<AppLayout />}>
              <Route path="collection" element={<CollectionPage />} />
            </Route>
          </Routes>
        </MemoryRouter>
      </GuestSessionProvider>,
    );

    expect(await screen.findByText('Cosmic guest')).toBeInTheDocument();
    expect(screen.queryByText(/null|undefined|\{\}/i)).not.toBeInTheDocument();
  });

  it('checks claim status before enabling the mystery vault', () => {
    vi.stubGlobal(
      'fetch',
      vi.fn(() => new Promise(() => undefined)),
    );
    render(
      <MemoryRouter>
        <CardOpeningPage />
      </MemoryRouter>,
    );

    expect(screen.getByRole('status')).toHaveTextContent('Checking your vault');
    expect(
      screen.queryByRole('button', { name: 'Open Mystery Box' }),
    ).not.toBeInTheDocument();
  });
});
