import type {
  CardListResponse,
  Claim,
  ClaimStatus,
  CollectibleCard,
  OwnedCard,
  Rarity,
  RarityMetadata,
} from './types';
const baseUrl = import.meta.env.VITE_API_URL ?? 'http://localhost:3001/api';
async function get<T>(path: string): Promise<T> {
  const response = await fetch(`${baseUrl}${path}`, { credentials: 'include' });
  if (!response.ok)
    throw new Error('The Card Archive could not be reached. Please try again.');
  return response.json() as Promise<T>;
}
async function parse<T>(response: Response): Promise<T> {
  const body = (await response.json()) as T & { error?: string };
  if (!response.ok)
    throw new Error(
      body.error ?? 'The vault could not be reached. Please try again.',
    );
  return body;
}
export const cardArchiveApi = {
  list: (rarity?: Rarity) =>
    get<CardListResponse>(
      `/cards?pageSize=50${rarity ? `&rarity=${rarity}` : ''}`,
    ),
  rarities: async () =>
    (await get<{ rarities: RarityMetadata[] }>('/rarities')).rarities,
};
export const claimApi = {
  status: () => get<ClaimStatus>('/claims/me'),
  create: (idempotencyKey: string) =>
    fetch(`${baseUrl}/claims`, {
      method: 'POST',
      credentials: 'include',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ idempotencyKey }),
    }).then((response) => parse<{ claim: Claim }>(response)),
  collection: () => get<{ cards: OwnedCard[] }>('/collection'),
  card: (slug: string) =>
    get<{ card: CollectibleCard }>(`/cards/${encodeURIComponent(slug)}`),
};
