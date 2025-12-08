"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { useQueryStates, parseAsString, parseAsInteger } from "nuqs";
import { Search, ChevronDown, X } from "lucide-react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Slider } from "@/components/ui/slider";
import Image from "@/components/ui/NextImage";

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

interface FilterData {
  propertyTypes: string[];
  developers: string[];
  areas: string[];
}

export default function SearchBar() {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchResult[]>([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [filterData, setFilterData] = useState<FilterData>({
    propertyTypes: [],
    developers: [],
    areas: [],
  });
  const dropdownRef = useRef<HTMLDivElement>(null);
  const abortControllerRef = useRef<AbortController | null>(null);
  const debounceTimerRef = useRef<NodeJS.Timeout | null>(null);

  const [filters, setFilters] = useQueryStates({
    type: parseAsString.withDefault("compound"),
    bedrooms: parseAsInteger,
    bathrooms: parseAsInteger,
    propertyType: parseAsString,
    developer: parseAsString,
    area: parseAsString,
    priceMin: parseAsInteger,
    priceMax: parseAsInteger,
    newLaunch: parseAsString,
  });

  useEffect(() => {
    fetch("/api/filters")
      .then((res) => res.json())
      .then((data) => setFilterData(data))
      .catch(console.error);
  }, []);

  const fetchResults = useCallback(
    async (searchQuery: string) => {
      if (!searchQuery.trim()) {
        setResults([]);
        return;
      }

      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }

      abortControllerRef.current = new AbortController();
      setLoading(true);

      try {
        const params = new URLSearchParams({
          q: searchQuery,
          type: filters.type,
          limit: "10",
        });

        const res = await fetch(`/api/search?${params}`, {
          signal: abortControllerRef.current.signal,
        });

        if (!res.ok) throw new Error("Failed to fetch");

        const data = await res.json();
        setResults(data.results || []);
      } catch (error: any) {
        if (error.name !== "AbortError") {
          console.error("Search error:", error);
          setResults([]);
        }
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
  }, [query, fetchResults]);

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
    const params = new URLSearchParams();
    if (query) params.set("q", query);
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== null && value !== undefined && value !== "") {
        params.set(key, String(value));
      }
    });
    router.push(`/search?${params.toString()}`);
  };

  const handleResultClick = (result: SearchResult) => {
    const routes: Record<string, string> = {
      compound: "compounds",
      property: "properties",
      developer: "developers",
      area: "areas",
    };
    router.push(`/${routes[result.type]}/${result.slug}`);
    setShowDropdown(false);
  };

  return (
    <div className="w-full max-w-5xl mx-auto px-4 sm:px-0">
      <div className="bg-white rounded-xl md:rounded-2xl shadow-2xl p-4 sm:p-6 space-y-3 sm:space-y-4">
        <div className="flex gap-2 border-b pb-3 sm:pb-4">
          {["compound", "property"].map((type) => (
            <button
              key={type}
              onClick={() => setFilters({ type })}
              className={`flex-1 sm:flex-none px-4 sm:px-6 py-2 rounded-lg font-semibold transition-all text-sm sm:text-base ${
                filters.type === type
                  ? "bg-[#05596B] text-white"
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              }`}
            >
              {type.charAt(0).toUpperCase() + type.slice(1)}
            </button>
          ))}
        </div>

        <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
          <div className="flex-1 relative" ref={dropdownRef}>
            <div className="flex items-center gap-2 sm:gap-3 px-3 sm:px-4 py-2.5 sm:py-3 bg-gray-50 rounded-xl border-2 border-gray-200 focus-within:border-[#003344] transition-colors">
              <Search className="w-4 h-4 sm:w-5 sm:h-5 text-gray-400" />
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
                className="flex-1 bg-transparent outline-none text-gray-700 placeholder-gray-400 text-sm sm:text-base"
                aria-label="Search input"
              />
              {query && (
                <button onClick={() => setQuery("")} aria-label="Clear">
                  <X className="w-4 h-4 sm:w-5 sm:h-5 text-gray-400 hover:text-gray-600" />
                </button>
              )}
            </div>

            {showDropdown && query && (
              <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-xl shadow-2xl border z-20 max-h-[60vh] sm:max-h-96 overflow-y-auto">
                {loading ? (
                  <div className="p-4 text-center text-gray-500 text-sm">
                    Loading...
                  </div>
                ) : results.length > 0 ? (
                  <div className="p-2">
                    {results.map((result) => (
                      <button
                        key={`${result.type}-${result.id}`}
                        onClick={() => handleResultClick(result)}
                        className="w-full flex items-center gap-2 sm:gap-3 p-2 sm:p-3 rounded-lg hover:bg-gray-50 transition-colors"
                      >
                        <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gray-200 rounded-lg overflow-hidden shrink-0">
                          {result.imageUrl && (
                            <Image
                              src={result.imageUrl}
                              alt={result.name}
                              width={48}
                              height={48}
                              sizes="(max-width: 640px) 40px, 48px"
                              className="object-cover w-full h-full"
                            />
                          )}
                        </div>
                        <div className="flex-1 text-left min-w-0">
                          <p className="font-medium text-gray-900 text-xs sm:text-sm truncate">
                            {result.name}
                          </p>
                          {(result.type === "compound" ||
                            result.type === "property") && (
                            <div className="flex gap-1 mt-1 flex-wrap items-center">
                              {result.developer && (
                                <span className="text-[10px] sm:text-xs text-gray-600">
                                  {result.developer}
                                </span>
                              )}
                              {result.developer && result.area && (
                                <span className="text-[10px] sm:text-xs text-gray-400">
                                  •
                                </span>
                              )}
                              {result.area && (
                                <span className="text-[10px] sm:text-xs text-gray-600">
                                  {result.area}
                                </span>
                              )}
                            </div>
                          )}
                          {result.startPrice && (
                            <p className="text-[10px] sm:text-xs text-gray-500 mt-1">
                              From EGP{" "}
                              {parseInt(result.startPrice).toLocaleString()}
                            </p>
                          )}
                        </div>
                        <div className="flex flex-col gap-1 items-end shrink-0">
                          <Badge className="bg-[#E9E8E9] text-[#013344] text-[10px] sm:text-xs px-1.5 sm:px-2 py-0.5">
                            {result.type}
                          </Badge>
                          {result.isNewLaunch && (
                            <Badge className="bg-[#E9E8E9] text-[#013344] text-[10px] sm:text-xs px-1.5 sm:px-2 py-0.5">
                              New Launch
                            </Badge>
                          )}
                          {result.isTrendingProject && (
                            <Badge className="bg-[#E9E8E9] text-[#013344] text-[10px] sm:text-xs px-1.5 sm:px-2 py-0.5">
                              Trending
                            </Badge>
                          )}
                        </div>
                      </button>
                    ))}
                  </div>
                ) : (
                  <div className="p-4 text-center text-gray-500 text-sm">
                    No results found
                  </div>
                )}
              </div>
            )}
          </div>

          <Button
            onClick={handleSearch}
            className="bg-[#05596B] hover:bg-[#004455] text-white px-6 sm:px-8 rounded-xl font-semibold text-sm sm:text-base w-full sm:w-auto"
            size="lg"
          >
            <Search className="w-4 h-4 sm:w-5 sm:h-5" />
            Search
          </Button>
        </div>

        <button
          onClick={() => setShowFilters(!showFilters)}
          className="flex items-center justify-center gap-2 text-sm text-gray-600 hover:text-gray-900 transition-colors md:hidden w-full py-2"
        >
          <ChevronDown
            className={`w-4 h-4 transition-transform ${
              showFilters ? "rotate-180" : ""
            }`}
          />
          {showFilters ? "Hide" : "Show"} Filters
        </button>

        <div
          className={`grid grid-cols-2 md:grid-cols-4 gap-2 sm:gap-3 ${
            showFilters ? "grid" : "hidden md:grid"
          }`}
        >
          {filters.type === "property" ? (
            <>
              <FilterSelect
                label="Bedrooms"
                value={filters.bedrooms}
                onChange={(v) => setFilters({ bedrooms: v as number | null })}
                options={[
                  { value: 1, label: "1" },
                  { value: 2, label: "2" },
                  { value: 3, label: "3" },
                  { value: 4, label: "+4" },
                ]}
              />
              <FilterSelect
                label="Bathrooms"
                value={filters.bathrooms}
                onChange={(v) => setFilters({ bathrooms: v as number | null })}
                options={[
                  { value: 1, label: "1" },
                  { value: 2, label: "2" },
                  { value: 3, label: "3" },
                  { value: 4, label: "+4" },
                ]}
              />
              <FilterSelect
                label="Property Type"
                value={filters.propertyType}
                onChange={(v) =>
                  setFilters({ propertyType: v as string | null })
                }
                options={filterData.propertyTypes.map((t) => ({
                  value: t,
                  label: t,
                }))}
              />
              <PriceRangeFilter
                min={filters.priceMin}
                max={filters.priceMax}
                onChange={(min, max) =>
                  setFilters({ priceMin: min, priceMax: max })
                }
              />
            </>
          ) : (
            <>
              <FilterSelect
                label="Developer"
                value={filters.developer}
                onChange={(v) => setFilters({ developer: v as string | null })}
                options={filterData.developers.map((d) => ({
                  value: d,
                  label: d,
                }))}
              />
              <FilterSelect
                label="Area"
                value={filters.area}
                onChange={(v) => setFilters({ area: v as string | null })}
                options={filterData.areas.map((a) => ({ value: a, label: a }))}
              />
              <PriceRangeFilter
                min={filters.priceMin}
                max={filters.priceMax}
                onChange={(min, max) =>
                  setFilters({ priceMin: min, priceMax: max })
                }
              />
              <div className="flex items-center gap-2 px-3 py-2 bg-gray-50 rounded-lg border border-gray-200">
                <input
                  type="checkbox"
                  id="newLaunch"
                  checked={filters.newLaunch === "true"}
                  onChange={(e) =>
                    setFilters({ newLaunch: e.target.checked ? "true" : null })
                  }
                  className="w-4 h-4 bg-[#05596B] accent-[#05596B]"
                />
                <label
                  htmlFor="newLaunch"
                  className="text-xs sm:text-sm text-gray-700 cursor-pointer"
                >
                  New Launch
                </label>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

interface FilterSelectProps {
  label: string;
  value: string | number | null;
  onChange: (value: string | number | null) => void;
  options: Array<{ value: string | number; label: string }>;
}

function FilterSelect({ label, value, onChange, options }: FilterSelectProps) {
  const [isOpen, setIsOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full px-2 sm:px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-xs sm:text-sm text-gray-700 outline-none focus:border-[#003344] flex items-center justify-between hover:bg-gray-100 transition-colors"
      >
        <span
          className={
            value
              ? "text-gray-900 font-medium truncate"
              : "text-gray-500 truncate"
          }
        >
          {value || label}
        </span>
        <ChevronDown
          className={`w-3 h-3 sm:w-4 sm:h-4 text-gray-400 transition-transform shrink-0 ml-1 ${
            isOpen ? "rotate-180" : ""
          }`}
        />
      </button>
      {isOpen && (
        <div className="absolute top-full left-0 right-0 mt-1 bg-white rounded-lg shadow-xl border border-gray-200 z-20 max-h-60 overflow-y-auto">
          <button
            onClick={() => {
              onChange(null);
              setIsOpen(false);
            }}
            className="w-full text-left px-3 sm:px-4 py-2 text-xs sm:text-sm text-gray-500 hover:bg-gray-50 transition-colors"
          >
            {label}
          </button>
          {options.map((opt) => (
            <button
              key={opt.value}
              onClick={() => {
                onChange(opt.value);
                setIsOpen(false);
              }}
              className={`w-full text-left px-3 sm:px-4 py-2 text-xs sm:text-sm transition-colors ${
                value === opt.value
                  ? "bg-[#003344] text-white font-medium"
                  : "text-gray-700 hover:bg-gray-50"
              }`}
            >
              {opt.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

interface PriceRangeFilterProps {
  min: number | null;
  max: number | null;
  onChange: (min: number | null, max: number | null) => void;
}

function PriceRangeFilter({ min, max, onChange }: PriceRangeFilterProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [range, setRange] = useState<[number, number]>([
    min || 0,
    max || 50000000,
  ]);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  const formatPrice = (val: number) => {
    if (val >= 1000000) return `${(val / 1000000).toFixed(1)}M`;
    if (val >= 1000) return `${(val / 1000).toFixed(0)}K`;
    return val.toString();
  };

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full px-2 sm:px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-xs sm:text-sm text-gray-700 outline-none focus:border-[#003344] flex items-center justify-between hover:bg-gray-100 transition-colors"
      >
        <span
          className={
            min || max
              ? "text-gray-900 font-medium truncate"
              : "text-gray-500 truncate"
          }
        >
          {min || max
            ? `${formatPrice(min || 0)} - ${formatPrice(max || 50000000)}`
            : "Price Range"}
        </span>
        <ChevronDown
          className={`w-3 h-3 sm:w-4 sm:h-4 text-gray-400 transition-transform shrink-0 ml-1 ${
            isOpen ? "rotate-180" : ""
          }`}
        />
      </button>
      {isOpen && (
        <div className="absolute top-full left-0 right-0 mt-1 bg-white rounded-lg shadow-xl border border-gray-200 z-20 p-3 sm:p-4 w-full sm:w-64">
          <div className="mb-3">
            <div className="text-xs sm:text-sm font-medium text-gray-700 mb-2">
              EGP {formatPrice(range[0])} - {formatPrice(range[1])}
            </div>
            <Slider
              min={0}
              max={50000000}
              step={100000}
              value={range}
              onValueChange={(val) => setRange(val as [number, number])}
              className="w-full"
            />
          </div>
          <button
            onClick={() => {
              onChange(range[0], range[1]);
              setIsOpen(false);
            }}
            className="w-full px-4 py-2 bg-[#05596B] hover:bg-[#004455] text-white text-xs sm:text-sm font-medium rounded-lg transition-colors"
          >
            Apply
          </button>
        </div>
      )}
    </div>
  );
}
