"use client";

import { useState, useEffect, useCallback } from "react";
import { fetchAreasPaginated } from "@/app/api/fetchers";
import type { Area } from "@/app/api/types";

export function useInfiniteAreas(initialPageSize: number = 12) {
  const [areas, setAreas] = useState<Area[]>([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [total, setTotal] = useState(0);

  const loadMore = useCallback(async () => {
    if (loading || !hasMore) return;

    setLoading(true);
    try {
      const result = await fetchAreasPaginated(page, initialPageSize);
      setAreas((prev) => {
        const existingIds = new Set(prev.map((a) => a.documentId));
        const newAreas = result.data.filter(
          (a) => !existingIds.has(a.documentId)
        );
        return [...prev, ...newAreas];
      });
      setTotal(result.total);
      setHasMore(areas.length + result.data.length < result.total);
      setPage((prev) => prev + 1);
    } catch (error) {
      console.error("Failed to load areas:", error);
    } finally {
      setLoading(false);
    }
  }, [page, loading, hasMore, areas.length, initialPageSize]);

  useEffect(() => {
    loadMore();
  }, []);

  return { areas, loading, hasMore, loadMore, total };
}
