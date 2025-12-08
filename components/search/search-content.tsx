"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { useQueryStates, parseAsString, parseAsInteger } from "nuqs";
import { Search, X, SlidersHorizontal } from "lucide-react";
import { BreadcrumbCustom } from "@/components/shared/breadcrumb-custom";
import { SearchFilters } from "./search-filters";
import { SearchResults } from "./search-results";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import Image from "@/components/ui/NextImage";
import { Badge } from "@/components/ui/badge";

interface SearchResult {
  id: number;
  name: string;
  type: "compound" | "property" | "developer" | "area";
  slug: string;
  imageUrl?: string;
  startPrice?: string;
  isNewLaunch?: boolean;
  isTrendingProject?: boolean;
  developer?: string;
  area?: string;
}

export function SearchContent() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchResult[]>([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const [loading, setLoading] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const debounceTimerRef = useRef<NodeJS.Timeout | null>(null);

  const [filters, setFilters] = useQueryStates({
    q: parseAsString.withDefault(""),
    type: parseAsString.withDefault("compound"),
    bedrooms: parseAsInteger,
    bathrooms: parseAsInteger,
    propertyType: parseAsString,
    developer: parseAsString,
    area: parseAsString,
    priceMin: parseAsInteger,
    priceMax: parseAsInteger,
    newLaunch: parseAsString,
    finishing: parseAsString,
    deliveryIn: parseAsInteger,
    salesType: parseAsString,
  });

  useEffect(() => {
    setQuery(filters.q);
  }, [filters.q]);

  const fetchResults = useCallback(
    async (searchQuery: string) => {
      if (!searchQuery.trim()) {
        setResults([]);
        return;
      }

      setLoading(true);
      try {
        const params = new URLSearchParams({
          q: searchQuery,
          type: filters.type,
          limit: "5",
        });

        const res = await fetch(`/api/search?${params}`);
        if (!res.ok) throw new Error("Failed to fetch");

        const data = await res.json();
        setResults(data.results || []);
      } catch (error) {
        console.error("Search error:", error);
        setResults([]);
      } finally {
        setLoading(false);
      }
    },
    [filters.type]
  );

  useEffect(() => {
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
    }

    debounceTimerRef.current = setTimeout(() => {
      fetchResults(query);
    }, 300);

    return () => {
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }
    };
  }, [query, filters.type]);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target as Node)
      ) {
        setShowDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSearch = () => {
    setFilters({ q: query });
    setShowDropdown(false);
  };

  const handleResultClick = (result: SearchResult) => {
    const routes: Record<string, string> = {
      compound: "compounds",
      property: "properties",
      developer: "developers",
      area: "areas",
    };
    window.location.href = `/${routes[result.type]}/${result.slug}`;
  };

  const getBadgeColor = (type: string) => {
    const colors: Record<string, string> = {
      compound: "bg-[#003344]",
      property: "bg-purple-600",
      developer: "bg-orange-600",
      area: "bg-green-600",
    };
    return colors[type] || "bg-gray-600";
  };

  return (
    <main className="min-h-screen w-full bg-white/40 relative pt-20">
      <div className="max-w-7xl mx-auto px-4 py-6 relative z-10">
        <BreadcrumbCustom
          paths={[
            {
              title:
                filters.type === "property"
                  ? "Properties in Egypt"
                  : "Compounds in Egypt",
            },
          ]}
          className="mb-6"
        />

        <div className="bg-white rounded-xl shadow-md p-4 md:p-6 mb-6">
          <div className="flex flex-col md:flex-row gap-4 items-start md:items-center">
            <div className="flex gap-2">
              {["compound", "property"].map((type) => (
                <button
                  key={type}
                  onClick={() => setFilters({ type })}
                  className={`px-6 py-2.5 rounded-lg font-semibold transition-all text-sm ${
                    filters.type === type
                      ? "bg-[#05596B] text-white"
                      : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                  }`}
                >
                  {type.charAt(0).toUpperCase() + type.slice(1)}
                </button>
              ))}
            </div>

            <div className="flex-1 w-full relative" ref={dropdownRef}>
              <div className="flex items-center gap-3 px-4 py-3 bg-gray-50 rounded-xl border-2 border-gray-200 focus-within:border-[#003344] transition-colors">
                <Search className="w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  placeholder={`Search ${filters.type}s...`}
                  value={query}
                  onChange={(e) => {
                    setQuery(e.target.value);
                    setShowDropdown(true);
                  }}
                  onFocus={() => setShowDropdown(true)}
                  onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                  className="flex-1 bg-transparent outline-none text-gray-700 placeholder-gray-400"
                />
                {query && (
                  <button onClick={() => setQuery("")}>
                    <X className="w-4 h-4 text-gray-400 hover:text-gray-600" />
                  </button>
                )}
              </div>

              {showDropdown && query && (
                <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-xl shadow-2xl border z-20 max-h-96 overflow-y-auto">
                  {loading ? (
                    <div className="p-4 text-center text-gray-500">
                      Loading...
                    </div>
                  ) : results.length > 0 ? (
                    <div className="p-2">
                      {results.map((result) => (
                        <button
                          key={`${result.type}-${result.id}`}
                          onClick={() => handleResultClick(result)}
                          className="w-full flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors"
                        >
                          <div className="w-12 h-12 bg-gray-200 rounded-lg overflow-hidden shrink-0">
                            {result.imageUrl && (
                              <Image
                                src={result.imageUrl}
                                alt={result.name}
                                width={48}
                                height={48}
                                className="object-cover w-full h-full"
                              />
                            )}
                          </div>
                          <div className="flex-1 text-left min-w-0">
                            <p className="font-medium text-gray-900 text-sm truncate">
                              {result.name}
                            </p>
                            {(result.type === "compound" ||
                              result.type === "property") && (
                              <div className="flex gap-1 mt-1 flex-wrap items-center">
                                {result.developer && (
                                  <span className="text-xs text-gray-600">
                                    {result.developer}
                                  </span>
                                )}
                                {result.developer && result.area && (
                                  <span className="text-xs text-gray-400">
                                    •
                                  </span>
                                )}
                                {result.area && (
                                  <span className="text-xs text-gray-600">
                                    {result.area}
                                  </span>
                                )}
                              </div>
                            )}
                            {result.startPrice && (
                              <p className="text-xs text-gray-500 mt-1">
                                From EGP{" "}
                                {parseInt(result.startPrice).toLocaleString()}
                              </p>
                            )}
                          </div>
                          <div className="flex flex-col gap-1 items-end">
                            <Badge className="bg-[#E9E8E9] text-[#013344] text-xs">
                              {result.type}
                            </Badge>
                            {result.isNewLaunch && (
                              <Badge className="bg-[#E9E8E9] text-[#013344] text-xs">
                                New Launch
                              </Badge>
                            )}
                            {result.isTrendingProject && (
                              <Badge className="bg-[#E9E8E9] text-[#013344] text-xs">
                                Trending
                              </Badge>
                            )}
                          </div>
                        </button>
                      ))}
                    </div>
                  ) : (
                    <div className="p-4 text-center text-gray-500">
                      No results found
                    </div>
                  )}
                </div>
              )}
            </div>

            <Button
              onClick={handleSearch}
              className="bg-[#05596B] hover:bg-[#004455] text-white px-8 rounded-xl font-semibold"
              size="lg"
            >
              <Search className="size-5" />
              Search
            </Button>
          </div>
        </div>

        <div className="flex gap-6">
          <aside className="hidden lg:block w-64 shrink-0">
            <div className="bg-white rounded-xl shadow-md p-6 sticky top-24">
              <h3 className="font-bold text-lg mb-4">Filters</h3>
              <SearchFilters filters={filters} setFilters={setFilters} />
            </div>
          </aside>

          <Sheet>
            <SheetTrigger asChild>
              <Button
                variant="outline"
                size="lg"
                className="lg:hidden fixed bottom-6 right-6 z-50 rounded-full w-14 h-14 shadow-lg"
              >
                <SlidersHorizontal className="size-6" />
              </Button>
            </SheetTrigger>
            <SheetContent side="bottom" className="h-[80vh]">
              <SheetHeader>
                <SheetTitle>Filters</SheetTitle>
              </SheetHeader>
              <div className="mt-6 overflow-y-auto h-[calc(100%-4rem)]">
                <SearchFilters filters={filters} setFilters={setFilters} />
              </div>
            </SheetContent>
          </Sheet>

          <div className="flex-1">
            <SearchResults filters={filters} />
          </div>
        </div>
      </div>
    </main>
  );
}
