import { fireEvent, render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { CardOpeningPage } from './CardOpeningPage';

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
const claim = {
  id: 'claim-1',
  rarity: 'RARE',
  createdAt: new Date().toISOString(),
  card,
};
afterEach(() => {
  vi.restoreAllMocks();
  vi.useRealTimers();
});
const renderPage = () =>
  render(
    <MemoryRouter>
      <CardOpeningPage />
    </MemoryRouter>,
  );

describe('CardOpeningPage', () => {
  it('shows loading then restores an owned card after refresh', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue({
        ok: true,
        json: async () => ({ claimed: true, claim, card }),
      }),
    );
    renderPage();
    expect(screen.getByRole('status')).toHaveTextContent('Checking your vault');
    expect(
      await screen.findByRole('article', { name: 'Iona Prismark, Rare' }),
    ).toBeInTheDocument();
    expect(screen.getByText('View collection')).toBeInTheDocument();
  });
  it('disables repeated clicks and retains one idempotency key', async () => {
    let resolveClaim: (value: unknown) => void = () => undefined;
    const pending = new Promise((resolve) => {
      resolveClaim = resolve;
    });
    const fetchMock = vi
      .fn()
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({ claimed: false, claim: null, card: null }),
      })
      .mockReturnValue(pending);
    vi.stubGlobal('fetch', fetchMock);
    renderPage();
    const button = await screen.findByRole('button', {
      name: 'Open Mystery Box',
    });
    fireEvent.click(button);
    fireEvent.click(button);
    expect(button).toBeDisabled();
    expect(fetchMock).toHaveBeenCalledTimes(2);
    resolveClaim({ ok: true, json: async () => ({ claim }) });
    expect(
      await screen.findByRole('article', { name: 'Iona Prismark, Rare' }),
    ).toBeInTheDocument();
    const body = JSON.parse(fetchMock.mock.calls[1]![1]!.body as string) as {
      idempotencyKey: string;
    };
    expect(body.idempotencyKey).toMatch(/^[0-9a-f-]{36}$/);
  });
  it('shows an error and retries with the same key', async () => {
    const fetchMock = vi
      .fn()
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({ claimed: false, claim: null, card: null }),
      })
      .mockResolvedValueOnce({
        ok: false,
        json: async () => ({ error: 'Vault offline' }),
      })
      .mockResolvedValueOnce({ ok: true, json: async () => ({ claim }) });
    vi.stubGlobal('fetch', fetchMock);
    renderPage();
    fireEvent.click(
      await screen.findByRole('button', { name: 'Open Mystery Box' }),
    );
    expect(await screen.findByRole('alert')).toHaveTextContent('Vault offline');
    fireEvent.click(screen.getByRole('button', { name: 'Retry opening' }));
    await screen.findByRole('article', { name: 'Iona Prismark, Rare' });
    const first = JSON.parse(fetchMock.mock.calls[1]![1]!.body as string);
    const second = JSON.parse(fetchMock.mock.calls[2]![1]!.body as string);
    expect(second.idempotencyKey).toBe(first.idempotencyKey);
  });
  it('includes a reduced-motion reveal fallback', async () => {
    vi.stubGlobal(
      'fetch',
      vi
        .fn()
        .mockResolvedValueOnce({
          ok: true,
          json: async () => ({ claimed: false, claim: null, card: null }),
        })
        .mockResolvedValueOnce({ ok: true, json: async () => ({ claim }) }),
    );
    renderPage();
    fireEvent.click(
      await screen.findByRole('button', { name: 'Open Mystery Box' }),
    );
    expect(
      await screen.findByText('Revealing Iona Prismark'),
    ).toBeInTheDocument();
    expect(document.querySelector('.reveal-stage')).toHaveClass('is-revealing');
  });
});
