// import { cache } from "react";
// import { apiConfig } from "./config";
// import type { ApiResponse } from "./types";

// const REVALIDATE_TIME = 3600; // 1 hour

// /**
//  * cachedFetch
//  * - Caches responses per endpoint (server-side React cache)
//  * - Uses Next.js fetch `next.revalidate` for edge/CDN caching
//  * - Does not set request Cache-Control headers (those belong to responses from origin)
//  */
// export const cachedFetch = cache(async <T>(endpoint: string): Promise<T[]> => {
//   const url = `${apiConfig.baseUrl}${endpoint}`;

//   console.log(`[FETCH] ${endpoint} at ${new Date().toISOString()}`);

//   const response = await fetch(url, {
//     headers: apiConfig.headers,
//     next: { revalidate: REVALIDATE_TIME, tags: [endpoint] },
//   });

//   if (!response.ok) {
//     const text = await response.text().catch(() => response.statusText || "");
//     throw new Error(
//       `Failed to fetch from ${endpoint}: ${response.status} ${text}`
//     );
//   }

//   const result: ApiResponse<T> = await response.json();
//   return result.data;
// });

import { cache } from "react";
import { apiConfig } from "./config";
import type { ApiResponse } from "./types";

const REVALIDATE_TIME = 3600; // 1 hour for images

export const cachedFetch = cache(async <T>(endpoint: string): Promise<T[]> => {
  // Add pagination parameters if not already present
  const separator = endpoint.includes('?') ? '&' : '?';
  const firstPageUrl = `${apiConfig.baseUrl}${endpoint}${separator}pagination[page]=1&pagination[pageSize]=100`;

  console.log(`[FETCH] ${endpoint} at ${new Date().toISOString()}`);

  const response = await fetch(firstPageUrl, {
    headers: {
      ...apiConfig.headers,
      "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=86400",
    },
    next: { revalidate: REVALIDATE_TIME, tags: [endpoint] },
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch from ${endpoint}: ${response.statusText}`);
  }

  const result: ApiResponse<T> = await response.json();
  const total = result.meta?.pagination?.total || 0;
  const firstPage = result.data;

  // If all data fits in first page, return it
  if (firstPage.length >= total || total <= 100) {
    return firstPage;
  }

  // Fetch remaining pages in parallel
  const pageCount = Math.ceil(total / 100);
  const remainingPages = Array.from({ length: pageCount - 1 }, (_, i) => i + 2);

  const remainingData = await Promise.all(
    remainingPages.map(async (page) => {
      const pageUrl = `${apiConfig.baseUrl}${endpoint}${separator}pagination[page]=${page}&pagination[pageSize]=100`;
      const res = await fetch(pageUrl, {
        headers: {
          ...apiConfig.headers,
          "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=86400",
        },
        next: { revalidate: REVALIDATE_TIME, tags: [endpoint] },
      });
      if (!res.ok) return [];
      const data: ApiResponse<T> = await res.json();
      return data.data;
    })
  );

  return [firstPage, ...remainingData].flat();
});
