import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { describe, expect, it, vi } from 'vitest';
import { RequireGuest } from '../components/routing/RequireGuest';
import { GuestUsernamePage } from '../pages/GuestUsernamePage';
import { GuestSessionProvider } from './GuestSessionContext';
import type { GuestSessionApi } from './guestSession';
const guest = {
  id: '1',
  displayName: 'Nova Scout',
  createdAt: new Date().toISOString(),
  expiresAt: new Date(Date.now() + 1000).toISOString(),
};
function renderFlow(path: string, api: GuestSessionApi) {
  render(
    <GuestSessionProvider api={api}>
      <MemoryRouter initialEntries={[path]}>
        <Routes>
          <Route path="/guest" element={<GuestUsernamePage />} />
          <Route element={<RequireGuest />}>
            <Route path="/claim" element={<div>Protected vault</div>} />
          </Route>
        </Routes>
      </MemoryRouter>
    </GuestSessionProvider>,
  );
}
describe('guest session flow', () => {
  it('protects routes and creates a server session', async () => {
    const api = {
      restore: vi.fn().mockResolvedValue(null),
      create: vi.fn().mockResolvedValue(guest),
      clear: vi.fn(),
    } as unknown as GuestSessionApi;
    renderFlow('/claim', api);
    expect(
      await screen.findByText('Choose your cosmic name'),
    ).toBeInTheDocument();
    await userEvent.type(screen.getByLabelText('Guest username'), 'Nova Scout');
    await userEvent.click(
      screen.getByRole('button', { name: 'Enter the vault' }),
    );
    expect(await screen.findByText('Protected vault')).toBeInTheDocument();
    expect(api.create).toHaveBeenCalledWith('Nova Scout');
  });
  it('restores before showing protected content', async () => {
    const api = {
      restore: vi.fn().mockResolvedValue(guest),
      create: vi.fn(),
      clear: vi.fn(),
    } as unknown as GuestSessionApi;
    renderFlow('/claim', api);
    expect(screen.getByText('Restoring guest session')).toBeInTheDocument();
    expect(await screen.findByText('Protected vault')).toBeInTheDocument();
  });
  it('shows restore failures', async () => {
    const api = {
      restore: vi.fn().mockRejectedValue(new Error('offline')),
      create: vi.fn(),
      clear: vi.fn(),
    } as unknown as GuestSessionApi;
    renderFlow('/guest', api);
    expect(
      await screen.findByText('Unable to restore your guest session.'),
    ).toBeInTheDocument();
  });
  it('deletes an active session', async () => {
    const api = {
      restore: vi.fn().mockResolvedValue(guest),
      create: vi.fn(),
      clear: vi.fn().mockResolvedValue(undefined),
    } as unknown as GuestSessionApi;
    renderFlow('/guest', api);
    await userEvent.click(
      await screen.findByRole('button', {
        name: 'Continue as different guest',
      }),
    );
    await waitFor(() => expect(api.clear).toHaveBeenCalled());
    expect(
      await screen.findByText('Choose your cosmic name'),
    ).toBeInTheDocument();
  });
});
