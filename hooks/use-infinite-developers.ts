"use client";

import { useState, useEffect, useCallback } from "react";
import { fetchDevelopersPaginated } from "@/app/api/fetchers";
import type { Developer } from "@/app/api/types";

export function useInfiniteDevelopers(initialPageSize: number = 12) {
  const [developers, setDevelopers] = useState<Developer[]>([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [total, setTotal] = useState(0);

  const loadMore = useCallback(async () => {
    if (loading || !hasMore) return;

    setLoading(true);
    try {
      const result = await fetchDevelopersPaginated(page, initialPageSize);
      setDevelopers((prev) => {
        const existingIds = new Set(prev.map((d) => d.documentId));
        const newDevelopers = result.data.filter(
          (d) => !existingIds.has(d.documentId)
        );
        return [...prev, ...newDevelopers];
      });
      setTotal(result.total);
      setHasMore(developers.length + result.data.length < result.total);
      setPage((prev) => prev + 1);
    } catch (error) {
      console.error("Failed to load developers:", error);
    } finally {
      setLoading(false);
    }
  }, [page, loading, hasMore, developers.length, initialPageSize]);

  useEffect(() => {
    loadMore();
  }, []);

  return { developers, loading, hasMore, loadMore, total };
}
