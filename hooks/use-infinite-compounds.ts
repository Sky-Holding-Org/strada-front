"use client";

import { useState, useEffect, useCallback } from "react";
import { fetchCompoundsPaginated } from "@/app/api/fetchers";
import type { Compound } from "@/app/api/types";

export function useInfiniteCompounds(initialPageSize: number = 12) {
  const [compounds, setCompounds] = useState<Compound[]>([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [total, setTotal] = useState(0);

  const loadMore = useCallback(async () => {
    if (loading || !hasMore) return;

    setLoading(true);
    try {
      const result = await fetchCompoundsPaginated(page, initialPageSize);
      setCompounds((prev) => {
        const existingIds = new Set(prev.map((c) => c.documentId));
        const newCompounds = result.data.filter(
          (c) => !existingIds.has(c.documentId)
        );
        return [...prev, ...newCompounds];
      });
      setTotal(result.total);
      setHasMore(compounds.length + result.data.length < result.total);
      setPage((prev) => prev + 1);
    } catch (error) {
      console.error("Failed to load compounds:", error);
    } finally {
      setLoading(false);
    }
  }, [page, loading, hasMore, compounds.length, initialPageSize]);

  useEffect(() => {
    loadMore();
  }, []);

  return { compounds, loading, hasMore, loadMore, total };
}
