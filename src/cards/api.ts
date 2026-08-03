import type { CardListResponse, Rarity, RarityMetadata } from './types';
const baseUrl = import.meta.env.VITE_API_URL ?? 'http://localhost:3001/api';
async function get<T>(path: string): Promise<T> {
  const response = await fetch(`${baseUrl}${path}`, { credentials: 'include' });
  if (!response.ok)
    throw new Error('The Card Archive could not be reached. Please try again.');
  return response.json() as Promise<T>;
}
export const cardArchiveApi = {
  list: (rarity?: Rarity) =>
    get<CardListResponse>(
      `/cards?pageSize=50${rarity ? `&rarity=${rarity}` : ''}`,
    ),
  rarities: async () =>
    (await get<{ rarities: RarityMetadata[] }>('/rarities')).rarities,
};
