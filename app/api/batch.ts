import { cache } from 'react';
import { cachedFetch } from './cache';

export const batchFetch = cache(async <T>(endpoints: string[]): Promise<T[][]> => {
  return Promise.all(endpoints.map(endpoint => cachedFetch<T>(endpoint)));
});
