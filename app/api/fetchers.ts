// import { cache } from "react";
// import { apiConfig } from "./config";
// import { cachedFetch } from "./cache";
// import type { Area, Compound, Developer, Property, ApiResponse } from "./types";

// const REVALIDATE_TIME = 3600;

// // Core fetch functions
// export async function fetchAreas(): Promise<Area[]> {
//   return cachedFetch<Area>("/areas?populate=*");
// }

// export async function fetchCompounds(): Promise<Compound[]> {
//   return cachedFetch<Compound>("/compounds?populate=*");
// }

// export async function fetchDevelopers(): Promise<Developer[]> {
//   return cachedFetch<Developer>("/developers?populate=*");
// }

// export async function fetchProperties(): Promise<Property[]> {
//   return cachedFetch<Property>("/properties?populate=*");
// }

// // Filtered fetch functions - Using API filters for better performance
// async function fetchAllPages<T>(endpoint: string): Promise<T[]> {
//   const firstPageUrl = `${endpoint}&pagination[page]=1&pagination[pageSize]=100`;

//   const response = await fetch(`${apiConfig.baseUrl}${firstPageUrl}`, {
//     headers: apiConfig.headers,
//     next: { revalidate: REVALIDATE_TIME, tags: [endpoint] },
//   });

//   if (!response.ok) {
//     throw new Error(`Failed to fetch from ${endpoint}: ${response.statusText}`);
//   }

//   const result: ApiResponse<T> = await response.json();
//   const total = result.meta?.pagination?.total || 0;
//   const firstPage = result.data;

//   if (firstPage.length >= total) return firstPage;

//   const pageCount = Math.ceil(total / 100);
//   const remainingPages = Array.from({ length: pageCount - 1 }, (_, i) => i + 2);

//   const remainingData = await Promise.all(
//     remainingPages.map(async (page) => {
//       const pageUrl = `${endpoint}&pagination[page]=${page}&pagination[pageSize]=100`;
//       const res = await fetch(`${apiConfig.baseUrl}${pageUrl}`, {
//         headers: apiConfig.headers,
//         next: { revalidate: REVALIDATE_TIME, tags: [endpoint] },
//       });
//       if (!res.ok) return [];
//       const data: ApiResponse<T> = await res.json();
//       return data.data;
//     })
//   );

//   return [firstPage, ...remainingData].flat();
// }

// export async function fetchRecommendedAreas(): Promise<Area[]> {
//   return fetchAllPages<Area>("/areas?filters[isRecommended]=true&populate=*");
// }

// export async function fetchRecommendedCompounds(): Promise<Compound[]> {
//   return fetchAllPages<Compound>(
//     "/compounds?filters[isRecommended]=true&populate=*"
//   );
// }

// export async function fetchNewLaunchCompounds(): Promise<Compound[]> {
//   return fetchAllPages<Compound>(
//     "/compounds?filters[isNewLaunch]=true&populate=*"
//   );
// }

// export async function fetchNonNewLaunchCompounds(): Promise<Compound[]> {
//   return fetchAllPages<Compound>(
//     "/compounds?filters[isNewLaunch]=false&populate=*"
//   );
// }

// export async function fetchTrendingCompounds(): Promise<Compound[]> {
//   return fetchAllPages<Compound>(
//     "/compounds?filters[isTrendingProject]=true&populate=*"
//   );
// }

// export async function fetchAllTrendingCompounds(): Promise<Compound[]> {
//   return fetchAllPages<Compound>(
//     "/compounds?filters[isTrendingProject]=true&populate=*"
//   );
// }

// export async function fetchAllNewLaunchCompounds(): Promise<Compound[]> {
//   return fetchAllPages<Compound>(
//     "/compounds?filters[isNewLaunch]=true&populate=*"
//   );
// }

// export async function fetchRecommendedDevelopers(): Promise<Developer[]> {
//   return fetchAllPages<Developer>(
//     "/developers?filters[isRecommended]=true&populate=*"
//   );
// }

// export async function fetchRecommendedProperties(): Promise<Property[]> {
//   return fetchAllPages<Property>(
//     "/properties?filters[isRecommended]=true&populate=*"
//   );
// }

// export async function fetchResaleProperties(): Promise<Property[]> {
//   return cachedFetch<Property>("/properties?filters[isResale]=true&populate=*");
// }

// // Combined filters for multiple conditions
// export async function fetchNewLaunchAndTrendingCompounds(): Promise<
//   Compound[]
// > {
//   return cachedFetch<Compound>(
//     "/compounds?filters[isNewLaunch]=true&filters[isTrendingProject]=true&populate=*"
//   );
// }

// export async function fetchRecommendedNewLaunchCompounds(): Promise<
//   Compound[]
// > {
//   return fetchAllPages<Compound>(
//     "/compounds?filters[isRecommended]=true&filters[isNewLaunch]=true&populate=*"
//   );
// }

// export async function fetchRecommendedTrendingCompounds(): Promise<Compound[]> {
//   return fetchAllPages<Compound>(
//     "/compounds?filters[isRecommended]=true&filters[isTrendingProject]=true&populate=*"
//   );
// }
// // Fetch by slug with revalidation
// export const fetchAreaBySlug = cache(
//   async (slug: string): Promise<Area | null> => {
//     const areas = await cachedFetch<Area>(
//       `/areas?filters[slug][$eq]=${slug}&populate=*`
//     );
//     return areas[0] || null;
//   }
// );

// export const fetchCompoundBySlug = cache(
//   async (slug: string): Promise<Compound | null> => {
//     const compounds = await cachedFetch<Compound>(
//       `/compounds?filters[slug][$eq]=${slug}&populate=*`
//     );
//     return compounds[0] || null;
//   }
// );

// export const fetchDeveloperBySlug = cache(
//   async (slug: string): Promise<Developer | null> => {
//     const developers = await cachedFetch<Developer>(
//       `/developers?filters[slug][$eq]=${slug}&populate=*`
//     );
//     return developers[0] || null;
//   }
// );

// export const fetchPropertyBySlug = cache(
//   async (slug: string): Promise<Property | null> => {
//     const properties = await cachedFetch<Property>(
//       `/properties?filters[slug][$eq]=${slug}&populate=*`
//     );
//     return properties[0] || null;
//   }
// );

// //offers

// export async function fetchAllCompoundsWithOffers(): Promise<Compound[]> {
//   // Use the generic pagination helper to fetch all pages in parallel after first page
//   const endpoint = `/compounds?filters[Offers][$notNull]=true&populate=Offers`;
//   const compounds = await fetchAllPages<Compound>(`${endpoint}`);
//   return compounds;
// }

// // Paginated fetch for client-side lazy loading
// export async function fetchCompoundsPaginated(
//   page: number = 1,
//   pageSize: number = 12
// ): Promise<{ data: Compound[]; total: number; pageCount: number }> {
//   const response = await fetch(
//     `${apiConfig.baseUrl}/compounds?pagination[page]=${page}&pagination[pageSize]=${pageSize}&populate=*`,
//     {
//       headers: apiConfig.headers,
//       next: { revalidate: 3600, tags: ["compounds-paginated"] },
//     }
//   );

//   if (!response.ok) {
//     throw new Error(`Failed to fetch compounds: ${response.statusText}`);
//   }

//   const result: ApiResponse<Compound> = await response.json();
//   return {
//     data: result.data,
//     total: result.meta?.pagination?.total || 0,
//     pageCount: result.meta?.pagination?.pageCount || 0,
//   };
// }

// export async function fetchDevelopersPaginated(
//   page: number = 1,
//   pageSize: number = 12
// ): Promise<{ data: Developer[]; total: number; pageCount: number }> {
//   const response = await fetch(
//     `${apiConfig.baseUrl}/developers?pagination[page]=${page}&pagination[pageSize]=${pageSize}&populate=*`,
//     {
//       headers: apiConfig.headers,
//       next: { revalidate: 3600, tags: ["developers-paginated"] },
//     }
//   );

//   if (!response.ok) {
//     throw new Error(`Failed to fetch developers: ${response.statusText}`);
//   }

//   const result: ApiResponse<Developer> = await response.json();

//   // Batch fetch compounds for the current page of developers to avoid N+1 requests.
//   const developerIds = result.data.map((d) => d.documentId).filter(Boolean);
//   let compoundsByDeveloper: Record<string, Compound[]> = {};
//   if (developerIds.length) {
//     // Use fetchAllPages to ensure we get all pages of compounds for these developers
//     const idsQuery = developerIds.join(",");
//     const compounds = await fetchAllPages<Compound>(
//       `/compounds?filters[developer][documentId][$in]=${idsQuery}&populate=properties`
//     );
//     compoundsByDeveloper = compounds.reduce((acc, c) => {
//       const key = c.developer?.documentId as string | undefined;
//       if (!key) return acc;
//       if (!acc[key]) acc[key] = [];
//       acc[key].push(c);
//       return acc;
//     }, {} as Record<string, Compound[]>);
//   }

//   const developersWithCounts = result.data.map((dev) => ({
//     ...dev,
//     compounds: compoundsByDeveloper[dev.documentId] || [],
//   }));

//   return {
//     data: developersWithCounts,
//     total: result.meta?.pagination?.total || 0,
//     pageCount: result.meta?.pagination?.pageCount || 0,
//   };
// }

// export async function fetchPropertiesPaginated(
//   page: number = 1,
//   pageSize: number = 12
// ): Promise<{ data: Property[]; total: number; pageCount: number }> {
//   const response = await fetch(
//     `${apiConfig.baseUrl}/properties?pagination[page]=${page}&pagination[pageSize]=${pageSize}&populate=*`,
//     {
//       headers: apiConfig.headers,
//       next: { revalidate: 3600, tags: ["properties-paginated"] },
//     }
//   );

//   if (!response.ok) {
//     throw new Error(`Failed to fetch properties: ${response.statusText}`);
//   }

//   const result: ApiResponse<Property> = await response.json();
//   return {
//     data: result.data,
//     total: result.meta?.pagination?.total || 0,
//     pageCount: result.meta?.pagination?.pageCount || 0,
//   };
// }

// export async function fetchAreasPaginated(
//   page: number = 1,
//   pageSize: number = 12
// ): Promise<{ data: Area[]; total: number; pageCount: number }> {
//   const response = await fetch(
//     `${apiConfig.baseUrl}/areas?pagination[page]=${page}&pagination[pageSize]=${pageSize}&populate=*`,
//     {
//       headers: apiConfig.headers,
//       next: { revalidate: 3600, tags: ["areas-paginated"] },
//     }
//   );

//   if (!response.ok) {
//     throw new Error(`Failed to fetch areas: ${response.statusText}`);
//   }

//   const result: ApiResponse<Area> = await response.json();

//   // Batch fetch compounds for all areas returned to avoid N+1 requests
//   const areaIds = result.data.map((a) => a.documentId).filter(Boolean);
//   let compoundsByArea: Record<string, Compound[]> = {};
//   if (areaIds.length) {
//     const idsQuery = areaIds.join(",");
//     const compounds = await fetchAllPages<Compound>(
//       `/compounds?filters[area][documentId][$in]=${idsQuery}&populate=properties`
//     );
//     compoundsByArea = compounds.reduce((acc, c) => {
//       const key = c.area?.documentId as string | undefined;
//       if (!key) return acc;
//       if (!acc[key]) acc[key] = [];
//       acc[key].push(c);
//       return acc;
//     }, {} as Record<string, Compound[]>);
//   }

//   const areasWithCounts = result.data.map((area) => ({
//     ...area,
//     compounds: compoundsByArea[area.documentId] || [],
//   }));

//   return {
//     data: areasWithCounts,
//     total: result.meta?.pagination?.total || 0,
//     pageCount: result.meta?.pagination?.pageCount || 0,
//   };
// }

// export async function fetchPropertiesByCompoundSlug(
//   compoundSlug: string
// ): Promise<Property[]> {
//   const response = await fetch(
//     `${apiConfig.baseUrl}/properties?filters[compound][slug][$eq]=${compoundSlug}&populate=*`,
//     {
//       headers: apiConfig.headers,
//       next: { revalidate: REVALIDATE_TIME },
//     }
//   );

//   if (!response.ok) {
//     throw new Error(`Failed to fetch properties: ${response.statusText}`);
//   }

//   const result: ApiResponse<Property> = await response.json();
//   return result.data;
// }

// export async function fetchCompoundsByAreaSlug(
//   areaSlug: string
// ): Promise<Compound[]> {
//   return fetchAllPages<Compound>(
//     `/compounds?filters[area][slug][$eq]=${areaSlug}&populate=*`
//   );
// }

// export async function fetchCompoundsByDeveloperSlug(
//   developerSlug: string
// ): Promise<Compound[]> {
//   return fetchAllPages<Compound>(
//     `/compounds?filters[developer][slug][$eq]=${developerSlug}&populate=*`
//   );
// }

// export async function fetchUniquePropertyTypes(): Promise<string[]> {
//   const properties = await cachedFetch<Property>(
//     "/properties?fields[0]=propertyType"
//   );
//   const types = [
//     ...new Set(properties.map((p) => p.propertyType).filter(Boolean)),
//   ];
//   return types.sort();
// }

// export async function fetchAllDeveloperNames(): Promise<string[]> {
//   const developers = await cachedFetch<Developer>("/developers?fields[0]=name");
//   return developers.map((d) => d.name).sort();
// }

// export async function fetchAllAreaNames(): Promise<string[]> {
//   const areas = await cachedFetch<Area>("/areas?fields[0]=name");
//   return areas.map((a) => a.name).sort();
// }

// export async function fetchAllAreas(): Promise<Area[]> {
//   return fetchAllPages<Area>("/areas?populate=*");
// }

import { cache } from "react";
import { apiConfig } from "./config";
import { cachedFetch } from "./cache";
import type { Area, Compound, Developer, Property, ApiResponse } from "./types";

const REVALIDATE_TIME = 60;

// Core fetch functions
export async function fetchAreas(): Promise<Area[]> {
  return cachedFetch<Area>("/areas?populate=*");
}

export async function fetchCompounds(): Promise<Compound[]> {
  return cachedFetch<Compound>("/compounds?populate=*");
}

export async function fetchDevelopers(): Promise<Developer[]> {
  return cachedFetch<Developer>("/developers?populate=*");
}

export async function fetchProperties(): Promise<Property[]> {
  return cachedFetch<Property>("/properties?populate=*");
}

// Filtered fetch functions - Using API filters for better performance
async function fetchAllPages<T>(endpoint: string): Promise<T[]> {
  const firstPageUrl = `${endpoint}&pagination[page]=1&pagination[pageSize]=100`;

  const response = await fetch(`${apiConfig.baseUrl}${firstPageUrl}`, {
    headers: apiConfig.headers,
    next: { revalidate: REVALIDATE_TIME, tags: [endpoint] },
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch from ${endpoint}: ${response.statusText}`);
  }

  const result: ApiResponse<T> = await response.json();
  const total = result.meta?.pagination?.total || 0;
  const firstPage = result.data;

  if (firstPage.length >= total) return firstPage;

  const pageCount = Math.ceil(total / 100);
  const remainingPages = Array.from({ length: pageCount - 1 }, (_, i) => i + 2);

  const remainingData = await Promise.all(
    remainingPages.map(async (page) => {
      const pageUrl = `${endpoint}&pagination[page]=${page}&pagination[pageSize]=100`;
      const res = await fetch(`${apiConfig.baseUrl}${pageUrl}`, {
        headers: apiConfig.headers,
        next: { revalidate: REVALIDATE_TIME, tags: [endpoint] },
      });
      if (!res.ok) return [];
      const data: ApiResponse<T> = await res.json();
      return data.data;
    })
  );

  return [firstPage, ...remainingData].flat();
}

export async function fetchRecommendedAreas(): Promise<Area[]> {
  return fetchAllPages<Area>("/areas?filters[isRecommended]=true&populate=*");
}

export async function fetchRecommendedCompounds(): Promise<Compound[]> {
  return fetchAllPages<Compound>(
    "/compounds?filters[isRecommended]=true&populate=*"
  );
}

export async function fetchNewLaunchCompounds(): Promise<Compound[]> {
  return fetchAllPages<Compound>(
    "/compounds?filters[isNewLaunch]=true&populate=*"
  );
}

export async function fetchNonNewLaunchCompounds(): Promise<Compound[]> {
  return fetchAllPages<Compound>(
    "/compounds?filters[isNewLaunch]=false&populate=*"
  );
}

export async function fetchTrendingCompounds(): Promise<Compound[]> {
  return fetchAllPages<Compound>(
    "/compounds?filters[isTrendingProject]=true&populate=*"
  );
}

export async function fetchAllTrendingCompounds(): Promise<Compound[]> {
  return fetchAllPages<Compound>(
    "/compounds?filters[isTrendingProject]=true&populate=*"
  );
}

export async function fetchAllNewLaunchCompounds(): Promise<Compound[]> {
  return fetchAllPages<Compound>(
    "/compounds?filters[isNewLaunch]=true&populate=*"
  );
}

export async function fetchRecommendedDevelopers(): Promise<Developer[]> {
  return fetchAllPages<Developer>(
    "/developers?filters[isRecommended]=true&populate=*"
  );
}

export async function fetchRecommendedProperties(): Promise<Property[]> {
  return fetchAllPages<Property>(
    "/properties?filters[isRecommended]=true&populate=*"
  );
}

export async function fetchResaleProperties(): Promise<Property[]> {
  return cachedFetch<Property>("/properties?filters[isResale]=true&populate=*");
}

// Combined filters for multiple conditions
export async function fetchNewLaunchAndTrendingCompounds(): Promise<
  Compound[]
> {
  return cachedFetch<Compound>(
    "/compounds?filters[isNewLaunch]=true&filters[isTrendingProject]=true&populate=*"
  );
}

export async function fetchRecommendedNewLaunchCompounds(): Promise<
  Compound[]
> {
  return fetchAllPages<Compound>(
    "/compounds?filters[isRecommended]=true&filters[isNewLaunch]=true&populate=*"
  );
}

export async function fetchRecommendedTrendingCompounds(): Promise<Compound[]> {
  return fetchAllPages<Compound>(
    "/compounds?filters[isRecommended]=true&filters[isTrendingProject]=true&populate=*"
  );
}
// Fetch by slug with revalidation
export const fetchAreaBySlug = cache(
  async (slug: string): Promise<Area | null> => {
    const areas = await cachedFetch<Area>(
      `/areas?filters[slug][$eq]=${slug}&populate=*`
    );
    return areas[0] || null;
  }
);

export const fetchCompoundBySlug = cache(
  async (slug: string): Promise<Compound | null> => {
    const compounds = await cachedFetch<Compound>(
      `/compounds?filters[slug][$eq]=${slug}&populate=*`
    );
    return compounds[0] || null;
  }
);

export const fetchDeveloperBySlug = cache(
  async (slug: string): Promise<Developer | null> => {
    const developers = await cachedFetch<Developer>(
      `/developers?filters[slug][$eq]=${slug}&populate=*`
    );
    return developers[0] || null;
  }
);

export const fetchPropertyBySlug = cache(
  async (slug: string): Promise<Property | null> => {
    const properties = await cachedFetch<Property>(
      `/properties?filters[slug][$eq]=${slug}&populate=*`
    );
    return properties[0] || null;
  }
);

//offers

export async function fetchAllCompoundsWithOffers(): Promise<Compound[]> {
  let allCompounds: Compound[] = [];
  let page = 1;
  const pageSize = 100; // Use your Strapi maxLimit here
  let total = 0;

  do {
    const response = await fetch(
      `${apiConfig.baseUrl}/compounds?filters[Offers][$notNull]=true&populate=Offers&pagination[page]=${page}&pagination[pageSize]=${pageSize}`,
      { headers: apiConfig.headers }
    );
    const result: ApiResponse<Compound> = await response.json();
    allCompounds = allCompounds.concat(result.data);
    total = result.meta?.pagination?.total || 0;
    page++;
  } while (allCompounds.length < total);

  return allCompounds;
}

// Paginated fetch for client-side lazy loading
export async function fetchCompoundsPaginated(
  page: number = 1,
  pageSize: number = 12
): Promise<{ data: Compound[]; total: number; pageCount: number }> {
  const response = await fetch(
    `${apiConfig.baseUrl}/compounds?pagination[page]=${page}&pagination[pageSize]=${pageSize}&populate=*`,
    {
      headers: apiConfig.headers,
      next: { revalidate: 3600, tags: ["compounds-paginated"] },
    }
  );

  if (!response.ok) {
    throw new Error(`Failed to fetch compounds: ${response.statusText}`);
  }

  const result: ApiResponse<Compound> = await response.json();
  return {
    data: result.data,
    total: result.meta?.pagination?.total || 0,
    pageCount: result.meta?.pagination?.pageCount || 0,
  };
}

export async function fetchDevelopersPaginated(
  page: number = 1,
  pageSize: number = 12
): Promise<{ data: Developer[]; total: number; pageCount: number }> {
  const response = await fetch(
    `${apiConfig.baseUrl}/developers?pagination[page]=${page}&pagination[pageSize]=${pageSize}&populate=*`,
    {
      headers: apiConfig.headers,
      next: { revalidate: 3600, tags: ["developers-paginated"] },
    }
  );

  if (!response.ok) {
    throw new Error(`Failed to fetch developers: ${response.statusText}`);
  }

  const result: ApiResponse<Developer> = await response.json();

  const developersWithCounts = await Promise.all(
    result.data.map(async (developer) => {
      const compoundsRes = await fetch(
        `${apiConfig.baseUrl}/compounds?filters[developer][documentId][$eq]=${developer.documentId}&populate=properties`,
        { headers: apiConfig.headers, next: { revalidate: 3600 } }
      );
      const compoundsData: ApiResponse<Compound> = await compoundsRes.json();
      return { ...developer, compounds: compoundsData.data };
    })
  );

  return {
    data: developersWithCounts,
    total: result.meta?.pagination?.total || 0,
    pageCount: result.meta?.pagination?.pageCount || 0,
  };
}

export async function fetchPropertiesPaginated(
  page: number = 1,
  pageSize: number = 12
): Promise<{ data: Property[]; total: number; pageCount: number }> {
  const response = await fetch(
    `${apiConfig.baseUrl}/properties?pagination[page]=${page}&pagination[pageSize]=${pageSize}&populate=*`,
    {
      headers: apiConfig.headers,
      next: { revalidate: 3600, tags: ["properties-paginated"] },
    }
  );

  if (!response.ok) {
    throw new Error(`Failed to fetch properties: ${response.statusText}`);
  }

  const result: ApiResponse<Property> = await response.json();
  return {
    data: result.data,
    total: result.meta?.pagination?.total || 0,
    pageCount: result.meta?.pagination?.pageCount || 0,
  };
}

export async function fetchAreasPaginated(
  page: number = 1,
  pageSize: number = 12
): Promise<{ data: Area[]; total: number; pageCount: number }> {
  const response = await fetch(
    `${apiConfig.baseUrl}/areas?pagination[page]=${page}&pagination[pageSize]=${pageSize}&populate=*`,
    {
      headers: apiConfig.headers,
      next: { revalidate: 3600, tags: ["areas-paginated"] },
    }
  );

  if (!response.ok) {
    throw new Error(`Failed to fetch areas: ${response.statusText}`);
  }

  const result: ApiResponse<Area> = await response.json();

  const areasWithCounts = await Promise.all(
    result.data.map(async (area) => {
      const compoundsRes = await fetch(
        `${apiConfig.baseUrl}/compounds?filters[area][documentId][$eq]=${area.documentId}&populate=properties`,
        { headers: apiConfig.headers, next: { revalidate: 3600 } }
      );
      const compoundsData: ApiResponse<Compound> = await compoundsRes.json();
      return { ...area, compounds: compoundsData.data };
    })
  );

  return {
    data: areasWithCounts,
    total: result.meta?.pagination?.total || 0,
    pageCount: result.meta?.pagination?.pageCount || 0,
  };
}

export async function fetchPropertiesByCompoundSlug(
  compoundSlug: string
): Promise<Property[]> {
  const response = await fetch(
    `${apiConfig.baseUrl}/properties?filters[compound][slug][$eq]=${compoundSlug}&populate=*`,
    {
      headers: apiConfig.headers,
      next: { revalidate: REVALIDATE_TIME },
    }
  );

  if (!response.ok) {
    throw new Error(`Failed to fetch properties: ${response.statusText}`);
  }

  const result: ApiResponse<Property> = await response.json();
  return result.data;
}

export async function fetchCompoundsByAreaSlug(
  areaSlug: string
): Promise<Compound[]> {
  return fetchAllPages<Compound>(
    `/compounds?filters[area][slug][$eq]=${areaSlug}&populate=*`
  );
}

export async function fetchCompoundsByDeveloperSlug(
  developerSlug: string
): Promise<Compound[]> {
  return fetchAllPages<Compound>(
    `/compounds?filters[developer][slug][$eq]=${developerSlug}&populate=*`
  );
}

export async function fetchUniquePropertyTypes(): Promise<string[]> {
  const properties = await cachedFetch<Property>(
    "/properties?fields[0]=propertyType"
  );
  const types = [
    ...new Set(properties.map((p) => p.propertyType).filter(Boolean)),
  ];
  return types.sort();
}

export async function fetchAllDeveloperNames(): Promise<string[]> {
  const developers = await cachedFetch<Developer>("/developers?fields[0]=name");
  return developers.map((d) => d.name).sort();
}

export async function fetchAllAreaNames(): Promise<string[]> {
  const areas = await cachedFetch<Area>("/areas?fields[0]=name");
  return areas.map((a) => a.name).sort();
}

export async function fetchAllAreas(): Promise<Area[]> {
  return fetchAllPages<Area>("/areas?populate=*");
}
