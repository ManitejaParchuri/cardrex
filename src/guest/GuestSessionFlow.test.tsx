import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { beforeEach, describe, expect, it } from 'vitest';

import { RequireGuest } from '../components/routing/RequireGuest';
import { GuestUsernamePage } from '../pages/GuestUsernamePage';
import { GuestSessionProvider } from './GuestSessionContext';
import { BrowserGuestSessionStorage, createGuestSession } from './guestSession';

function renderFlow(initialPath = '/guest') {
  return render(
    <GuestSessionProvider storage={new BrowserGuestSessionStorage()}>
      <MemoryRouter initialEntries={[initialPath]}>
        <Routes>
          <Route path="/guest" element={<GuestUsernamePage />} />
          <Route element={<RequireGuest />}>
            <Route path="/claim" element={<p>Claim screen</p>} />
            <Route path="/collection" element={<p>Collection screen</p>} />
          </Route>
        </Routes>
      </MemoryRouter>
    </GuestSessionProvider>,
  );
}

describe('guest session flow', () => {
  beforeEach(() => localStorage.clear());

  it('disables submission until a valid name is entered and shows errors', async () => {
    renderFlow();
    const input = await screen.findByLabelText('Guest username');
    const submit = screen.getByRole('button', { name: 'Enter the vault' });

    expect(submit).toBeDisabled();
    await userEvent.type(input, 'No!');
    await userEvent.tab();
    expect(screen.getByRole('alert')).toHaveTextContent('only letters');
    expect(submit).toBeDisabled();
  });

  it('creates a session and follows the preserved protected destination', async () => {
    renderFlow('/collection');
    const input = await screen.findByLabelText('Guest username');
    await userEvent.type(input, '  Nova Scout  ');
    await userEvent.click(
      screen.getByRole('button', { name: 'Enter the vault' }),
    );

    expect(await screen.findByText('Collection screen')).toBeInTheDocument();
    expect(localStorage.getItem('cardrex.guest-session')).toContain(
      'Nova Scout',
    );
  });

  it('redirects a visitor without a session from a protected route', async () => {
    renderFlow('/claim');
    expect(
      await screen.findByText('Choose your cosmic name'),
    ).toBeInTheDocument();
  });

  it('restores a persisted session before displaying a protected route', async () => {
    await new BrowserGuestSessionStorage().save(
      createGuestSession('Starlit Fox'),
    );
    renderFlow('/claim');

    expect(screen.getByRole('status')).toHaveTextContent(
      'Restoring guest session',
    );
    expect(await screen.findByText('Claim screen')).toBeInTheDocument();
  });

  it('resets an active session and allows a different guest', async () => {
    await new BrowserGuestSessionStorage().save(
      createGuestSession('First Guest'),
    );
    renderFlow('/guest');

    await userEvent.click(
      await screen.findByRole('button', {
        name: 'Continue as different guest',
      }),
    );

    await waitFor(() => expect(localStorage).toHaveLength(0));
    expect(screen.getByLabelText('Guest username')).toHaveValue('');
  });
});
