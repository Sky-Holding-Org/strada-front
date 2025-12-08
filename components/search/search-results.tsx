"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import InfiniteScroll from "react-infinite-scroll-component";
import { Loader2 } from "lucide-react";
import { SearchCompoundCard } from "./search-compound-card";
import { SearchPropertyCard } from "./search-property-card";
import { SearchSkeleton } from "./search-skeleton";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { Compound, Property } from "@/app/api/types";

interface SearchResultsProps {
  filters: any;
}

export function SearchResults({ filters }: SearchResultsProps) {
  const [items, setItems] = useState<(Compound | Property)[]>([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(true);
  const [sortBy, setSortBy] = useState("newest");

  const sortedItems = useMemo(() => {
    const sorted = [...items];
    if (sortBy === "price-asc") {
      sorted.sort((a, b) => {
        const priceA =
          typeof a.startPrice === "string"
            ? parseFloat(a.startPrice)
            : a.startPrice;
        const priceB =
          typeof b.startPrice === "string"
            ? parseFloat(b.startPrice)
            : b.startPrice;
        return priceA - priceB;
      });
    } else if (sortBy === "price-desc") {
      sorted.sort((a, b) => {
        const priceA =
          typeof a.startPrice === "string"
            ? parseFloat(a.startPrice)
            : a.startPrice;
        const priceB =
          typeof b.startPrice === "string"
            ? parseFloat(b.startPrice)
            : b.startPrice;
        return priceB - priceA;
      });
    }
    return sorted;
  }, [items, sortBy]);

  // Memoize filter string to avoid re-renders when filters object reference changes
  const filterString = useMemo(() => {
    return JSON.stringify({
      type: filters.type,
      q: filters.q,
      developer: filters.developer,
      area: filters.area,
      priceMin: filters.priceMin,
      priceMax: filters.priceMax,
      newLaunch: filters.newLaunch,
      bedrooms: filters.bedrooms,
      bathrooms: filters.bathrooms,
      propertyType: filters.propertyType,
      finishing: filters.finishing,
      deliveryIn: filters.deliveryIn,
      salesType: filters.salesType,
    });
  }, [
    filters.type,
    filters.q,
    filters.developer,
    filters.area,
    filters.priceMin,
    filters.priceMax,
    filters.newLaunch,
    filters.bedrooms,
    filters.bathrooms,
    filters.propertyType,
    filters.finishing,
    filters.deliveryIn,
    filters.salesType,
  ]);

  const fetchResults = useCallback(
    async (pageNum: number, isInitial = false) => {
      try {
        const params = new URLSearchParams();
        params.set("page", pageNum.toString());
        params.set("type", filters.type);

        if (filters.q) params.set("q", filters.q);
        if (filters.developer) params.set("developer", filters.developer);
        if (filters.area) params.set("area", filters.area);
        if (filters.priceMin)
          params.set("priceMin", filters.priceMin.toString());
        if (filters.priceMax)
          params.set("priceMax", filters.priceMax.toString());
        if (filters.newLaunch === "true") params.set("newLaunch", "true");

        if (filters.type === "property") {
          if (filters.bedrooms)
            params.set("bedrooms", filters.bedrooms.toString());
          if (filters.bathrooms)
            params.set("bathrooms", filters.bathrooms.toString());
          if (filters.propertyType)
            params.set("propertyType", filters.propertyType);
          if (filters.finishing) params.set("finishing", filters.finishing);
          if (filters.deliveryIn)
            params.set("deliveryIn", filters.deliveryIn.toString());
          if (filters.salesType) params.set("salesType", filters.salesType);
        }

        const res = await fetch(`/api/search-results?${params.toString()}`);

        if (!res.ok) throw new Error("Failed to fetch");

        const data = await res.json();

        if (isInitial) {
          setItems(data.data);
        } else {
          setItems((prev) => [...prev, ...data.data]);
        }

        setHasMore(data.meta.pagination.page < data.meta.pagination.pageCount);
        setLoading(false);
      } catch (error) {
        console.error("Fetch error:", error);
        setLoading(false);
        setHasMore(false);
      }
    },
    [filterString]
  );

  useEffect(() => {
    setLoading(true);
    setPage(1);
    setItems([]);
    fetchResults(1, true);
  }, [filterString]);

  const loadMore = () => {
    const nextPage = page + 1;
    setPage(nextPage);
    fetchResults(nextPage);
  };

  if (loading) {
    return <SearchSkeleton />;
  }

  if (items.length === 0) {
    return (
      <div className="text-center py-20 w-full">
        <p className="text-xl text-muted-foreground">No results found</p>
        <p className="text-sm text-muted-foreground mt-2">
          Try adjusting your filters
        </p>
      </div>
    );
  }

  return (
    <div className="w-full">
      <div className="mb-6 flex items-center justify-between">
        <p className="text-sm text-muted-foreground">
          Found {items.length}{" "}
          {filters.type === "compound" ? "compounds" : "properties"}
        </p>
        <Select value={sortBy} onValueChange={setSortBy}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Sort by" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="newest">Newest</SelectItem>
            <SelectItem value="price-asc">Price: Low to High</SelectItem>
            <SelectItem value="price-desc">Price: High to Low</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <InfiniteScroll
        dataLength={items.length}
        next={loadMore}
        hasMore={hasMore}
        loader={
          <div className="flex justify-center py-8">
            <Loader2 className="w-6 h-6 animate-spin text-primary" />
          </div>
        }
        endMessage={
          <p className="text-center py-8 text-sm text-muted-foreground">
            You've reached the end
          </p>
        }
      >
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {sortedItems.map((item) =>
            filters.type === "compound" ? (
              <SearchCompoundCard
                key={item.documentId}
                compound={item as Compound}
              />
            ) : (
              <SearchPropertyCard
                key={item.documentId}
                property={item as Property}
              />
            )
          )}
        </div>
      </InfiniteScroll>
    </div>
  );
}
