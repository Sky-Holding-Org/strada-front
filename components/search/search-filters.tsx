"use client";

import { useState, useEffect, useRef } from "react";
import { ChevronDown } from "lucide-react";
import { Slider } from "@/components/ui/slider";

interface FilterData {
  propertyTypes: string[];
  developers: string[];
  areas: string[];
  finishingTypes: string[];
  deliveryYears: number[];
}

interface SearchFiltersProps {
  filters: any;
  setFilters: (filters: any) => void;
}

export function SearchFilters({ filters, setFilters }: SearchFiltersProps) {
  const [filterData, setFilterData] = useState<FilterData>({
    propertyTypes: [],
    developers: [],
    areas: [],
    finishingTypes: [],
    deliveryYears: [],
  });

  useEffect(() => {
    fetch("/api/filters")
      .then((res) => res.json())
      .then((data) => setFilterData(data))
      .catch(console.error);
  }, []);

  const handleReset = () => {
    setFilters({
      developer: null,
      area: null,
      bedrooms: null,
      bathrooms: null,
      propertyType: null,
      finishing: null,
      deliveryIn: null,
      salesType: null,
      priceMin: null,
      priceMax: null,
      newLaunch: null,
    });
  };

  return (
    <div className="flex flex-col gap-3">
      <FilterSelect
        label="Developer"
        value={filters.developer}
        onChange={(v) => setFilters({ developer: v as string | null })}
        options={filterData.developers.map((d) => ({ value: d, label: d }))}
      />
      <FilterSelect
        label="Area"
        value={filters.area}
        onChange={(v) => setFilters({ area: v as string | null })}
        options={filterData.areas.map((a) => ({ value: a, label: a }))}
      />
      {filters.type === "property" && (
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
            onChange={(v) => setFilters({ propertyType: v as string | null })}
            options={filterData.propertyTypes.map((t) => ({
              value: t,
              label: t,
            }))}
          />
          <FilterSelect
            label="Finishing"
            value={filters.finishing}
            onChange={(v) => setFilters({ finishing: v as string | null })}
            options={filterData.finishingTypes.map((f) => ({
              value: f,
              label: f,
            }))}
          />
          <FilterSelect
            label="Delivery In"
            value={filters.deliveryIn}
            onChange={(v) => setFilters({ deliveryIn: v as number | null })}
            options={filterData.deliveryYears.map((y) => ({
              value: y,
              label: y.toString(),
            }))}
          />
          <FilterSelect
            label="Sales Type"
            value={filters.salesType}
            onChange={(v) => setFilters({ salesType: v as string | null })}
            options={[
              { value: "developer", label: "Developer Sale" },
              { value: "resale", label: "Resale" },
            ]}
          />
        </>
      )}
      <PriceRangeFilter
        min={filters.priceMin}
        max={filters.priceMax}
        onChange={(min, max) => setFilters({ priceMin: min, priceMax: max })}
      />
      {filters.type === "compound" && (
        <label className="flex items-center gap-2 px-3 py-2 bg-gray-50 rounded-lg border border-gray-200 cursor-pointer hover:bg-gray-100 transition-colors">
          <input
            type="checkbox"
            id="newLaunch"
            checked={filters.newLaunch === "true"}
            onChange={(e) =>
              setFilters({ newLaunch: e.target.checked ? "true" : null })
            }
            className="w-4 h-4 bg-[#05596B] accent-[#05596B]"
          />
          <span className="text-sm text-gray-700">New Launch Only</span>
        </label>
      )}
      <button
        onClick={handleReset}
        className="w-full px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 text-sm font-medium rounded-lg transition-colors"
      >
        Reset Filters
      </button>
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
        className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm text-gray-700 outline-none focus:border-[#003344] flex items-center justify-between hover:bg-gray-100 transition-colors"
      >
        <span className={value ? "text-gray-900 font-medium" : "text-gray-500"}>
          {value || label}
        </span>
        <ChevronDown
          className={`w-4 h-4 text-gray-400 transition-transform ${
            isOpen ? "rotate-180" : ""
          }`}
        />
      </button>
      {isOpen && (
        <div className="absolute top-full left-0 right-0 mt-1 bg-white rounded-lg shadow-xl border border-gray-200 z-50 max-h-60 overflow-y-auto">
          <button
            onClick={() => {
              onChange(null);
              setIsOpen(false);
            }}
            className="w-full text-left px-4 py-2 text-sm text-gray-500 hover:bg-gray-50 transition-colors"
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
              className={`w-full text-left px-4 py-2 text-sm transition-colors ${
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
        className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm text-gray-700 outline-none focus:border-[#003344] flex items-center justify-between hover:bg-gray-100 transition-colors"
      >
        <span
          className={min || max ? "text-gray-900 font-medium" : "text-gray-500"}
        >
          {min || max
            ? `${formatPrice(min || 0)} - ${formatPrice(max || 50000000)}`
            : "Price Range"}
        </span>
        <ChevronDown
          className={`w-4 h-4 text-gray-400 transition-transform ${
            isOpen ? "rotate-180" : ""
          }`}
        />
      </button>
      {isOpen && (
        <div className="absolute top-full left-0 right-0 mt-1 bg-white rounded-lg shadow-xl border border-gray-200 z-50 p-4 w-64">
          <div className="mb-3">
            <div className="text-sm font-medium text-gray-700 mb-2">
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
            className="w-full px-4 py-2 bg-[#003344] hover:bg-[#004455] text-white text-sm font-medium rounded-lg transition-colors"
          >
            Apply
          </button>
        </div>
      )}
    </div>
  );
}
