import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { describe, expect, it, vi } from 'vitest';

import { AppLayout } from '../components/layout/AppLayout';
import { GuestSessionProvider } from '../guest/GuestSessionContext';
import type { GuestSessionApi } from '../guest/guestSession';
import { CardOpeningPage } from './CardOpeningPage';
import { CollectionPage } from './CollectionPage';

describe('phase three experience', () => {
  it('shows a polished empty state when the collection has no cards', () => {
    render(
      <MemoryRouter>
        <CollectionPage />
      </MemoryRouter>,
    );

    expect(
      screen.getByRole('heading', { name: 'Your collection awaits' }),
    ).toBeInTheDocument();
    expect(
      screen.getByText(/There are no cards in your vault yet/),
    ).toBeInTheDocument();
    expect(screen.queryByText(/null|undefined|\{\}/i)).not.toBeInTheDocument();
  });

  it('uses a safe identity fallback when guest profile data is missing', async () => {
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

  it('keeps the mystery vault interaction disabled', async () => {
    const user = userEvent.setup();
    render(
      <MemoryRouter>
        <CardOpeningPage />
      </MemoryRouter>,
    );

    const openButton = screen.getByRole('button', {
      name: 'Open mystery vault',
    });
    expect(openButton).toBeDisabled();
    await user.click(openButton);
    expect(openButton).toBeDisabled();
    expect(
      screen.getByText('Card claiming unlocks in the next phase', {
        exact: false,
      }),
    ).toBeInTheDocument();
  });
});
