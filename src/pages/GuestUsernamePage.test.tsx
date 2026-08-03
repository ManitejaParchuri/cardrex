import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { beforeEach, describe, expect, it } from 'vitest';

import { GuestUsernamePage } from './GuestUsernamePage';

describe('GuestUsernamePage', () => {
  beforeEach(() => sessionStorage.clear());

  it('validates a short username', async () => {
    render(
      <MemoryRouter initialEntries={['/guest']}>
        <Routes>
          <Route path="/guest" element={<GuestUsernamePage />} />
        </Routes>
      </MemoryRouter>,
    );

    const input = screen.getByLabelText('Guest username');
    await userEvent.clear(input);
    await userEvent.type(input, 'ab');
    await userEvent.click(screen.getByRole('button', { name: 'Enter the vault' }));

    expect(screen.getByRole('alert')).toHaveTextContent('between 3 and 24');
  });

  it('stores a valid username for the browser session and continues', async () => {
    render(
      <MemoryRouter initialEntries={['/guest']}>
        <Routes>
          <Route path="/guest" element={<GuestUsernamePage />} />
          <Route path="/claim" element={<p>Claim screen</p>} />
        </Routes>
      </MemoryRouter>,
    );

    const input = screen.getByLabelText('Guest username');
    await userEvent.clear(input);
    await userEvent.type(input, 'NovaScout');
    await userEvent.click(screen.getByRole('button', { name: 'Enter the vault' }));

    expect(sessionStorage.getItem('cardrex-guest-name')).toBe('NovaScout');
    expect(screen.getByText('Claim screen')).toBeInTheDocument();
  });
});
