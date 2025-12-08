"use client";

import { useState, useEffect, useCallback } from "react";
import { fetchPropertiesPaginated } from "@/app/api/fetchers";
import type { Property } from "@/app/api/types";

export function useInfiniteProperties(initialPageSize: number = 12) {
  const [properties, setProperties] = useState<Property[]>([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [total, setTotal] = useState(0);

  const loadMore = useCallback(async () => {
    if (loading || !hasMore) return;

    setLoading(true);
    try {
      const result = await fetchPropertiesPaginated(page, initialPageSize);
      setProperties((prev) => {
        const existingIds = new Set(prev.map((p) => p.documentId));
        const newProperties = result.data.filter(
          (p) => !existingIds.has(p.documentId)
        );
        return [...prev, ...newProperties];
      });
      setTotal(result.total);
      setHasMore(properties.length + result.data.length < result.total);
      setPage((prev) => prev + 1);
    } catch (error) {
      console.error("Failed to load properties:", error);
    } finally {
      setLoading(false);
    }
  }, [page, loading, hasMore, properties.length, initialPageSize]);

  useEffect(() => {
    loadMore();
  }, []);

  return { properties, loading, hasMore, loadMore, total };
}
