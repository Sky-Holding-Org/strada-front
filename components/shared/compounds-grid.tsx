"use client";

import * as React from "react";
import Link from "next/link";
import Image from "@/components/ui/NextImage";
import { Phone } from "lucide-react";
import type { Compound } from "@/app/api/types";
import { formatPrice } from "@/app/api/text";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { FaWhatsapp } from "react-icons/fa6";

interface AreaCompoundsGridProps {
  compounds: Compound[];
}

export function AreaCompoundsGrid({ compounds }: AreaCompoundsGridProps) {
  const [currentPage, setCurrentPage] = React.useState(1);
  const [favorites, setFavorites] = React.useState<Set<string>>(new Set());
  const [copied, setCopied] = React.useState<string | null>(null);
  const itemsPerPage = 9;
  const totalPages = Math.ceil(compounds.length / itemsPerPage);

  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentCompounds = compounds.slice(
    startIndex,
    startIndex + itemsPerPage
  );

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const toggleFavorite = (id: string) => {
    setFavorites((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const handleShare = async (compound: Compound) => {
    const url = `${window.location.origin}/compounds/${compound.slug}`;
    await navigator.clipboard.writeText(url);
    setCopied(compound.documentId);
    setTimeout(() => setCopied(null), 2000);
  };

  if (compounds.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">No compounds available.</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {currentCompounds.map((compound) => (
          <div
            key={compound.documentId}
            className="bg-white rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 flex flex-col"
          >
            <div className="relative">
              <Link href={`/compounds/${compound.slug}`}>
                <div className="relative aspect-4/3 overflow-hidden">
                  {compound.imageGallery?.[0] ? (
                    <Image
                      src={compound.imageGallery[0].url}
                      alt={compound.name}
                      fill
                      className="object-cover hover:scale-105 transition-transform duration-500"
                      sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    />
                  ) : (
                    <div className="h-full w-full bg-muted flex items-center justify-center">
                      <span className="text-muted-foreground">No image</span>
                    </div>
                  )}
                </div>
              </Link>
            </div>

            <div className="p-6 flex flex-col flex-1">
              <Link href={`/compounds/${compound.slug}`} className="flex-1">
                <div className="flex items-center gap-3 mb-4">
                  {compound.developer?.logo && (
                    <div className="relative w-12 h-12 rounded-full overflow-hidden shrink-0 border-2 border-gray-200">
                      <Image
                        src={compound.developer.logo.url}
                        alt={compound.developer.name}
                        fill
                        className="object-contain p-1.5"
                        loading="lazy"
                      />
                    </div>
                  )}
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-gray-900 truncate">
                      {compound.developer?.name || "Developer"}
                    </p>
                    <p className="text-xs text-muted-foreground truncate">
                      {compound.area?.name || "Area"}
                    </p>
                  </div>
                </div>

                <h3 className="text-lg font-bold line-clamp-2 mb-4">
                  {compound.name}
                </h3>

                {compound.properties && compound.properties.length > 0 && (
                  <div className="flex flex-wrap gap-2 mb-4">
                    {Array.from(
                      new Set(
                        compound.properties.map(
                          (p: { propertyType: string }) => p.propertyType
                        )
                      )
                    )
                      .slice(0, 3)
                      .map((type, i) => (
                        <span
                          key={i}
                          className="px-3 py-1.5 bg-primary/10 text-primary text-xs rounded-lg font-semibold"
                        >
                          {type as string}
                        </span>
                      ))}
                    {(() => {
                      const totalTypes = Array.from(
                        new Set(
                          compound.properties.map(
                            (p: { propertyType: string }) => p.propertyType
                          )
                        )
                      ).length;
                      return totalTypes > 3 ? (
                        <span className="px-3 py-1.5 bg-primary/10 text-primary text-xs rounded-lg font-semibold">
                          +{totalTypes - 3}
                        </span>
                      ) : null;
                    })()}
                  </div>
                )}

                {compound.Offers && compound.Offers.length > 0 && (
                  <div className="text-sm text-muted-foreground mb-4">
                    {compound.Offers[0].paymentPercentage}% down payment •{" "}
                    {compound.Offers[0].paymentDuration} years
                  </div>
                )}
              </Link>

              <div className="flex items-center justify-between">
                <p className="text-2xl font-bold text-primary">
                  {formatPrice(compound.startPrice)}
                </p>
                <div className="flex gap-2">
                  <a
                    href="tel:+201123960001"
                    onClick={(e) => e.stopPropagation()}
                    className="flex items-center justify-center w-10 h-10 rounded-full bg-[#E9E8E9] hover:bg-[#E9E8E9]/60 text-[#05596B]"
                  >
                    <Phone className="size-5" />
                  </a>
                  <a
                    href={`https://wa.me/201123960001?text=${encodeURIComponent(
                      `Hi, I'm interested in ${compound.name}`
                    )}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={(e) => e.stopPropagation()}
                    className="flex items-center justify-center w-10 h-10 rounded-full bg-green-400 hover:bg-green-700"
                  >
                    <FaWhatsapp className="size-5 text-white" />
                  </a>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {totalPages > 1 && (
        <Pagination>
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious
                href="#"
                onClick={(e) => {
                  e.preventDefault();
                  if (currentPage > 1) handlePageChange(currentPage - 1);
                }}
                className={
                  currentPage === 1 ? "pointer-events-none opacity-50" : ""
                }
              />
            </PaginationItem>

            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <PaginationItem key={page}>
                <PaginationLink
                  href="#"
                  onClick={(e) => {
                    e.preventDefault();
                    handlePageChange(page);
                  }}
                  isActive={currentPage === page}
                >
                  {page}
                </PaginationLink>
              </PaginationItem>
            ))}

            <PaginationItem>
              <PaginationNext
                href="#"
                onClick={(e) => {
                  e.preventDefault();
                  if (currentPage < totalPages)
                    handlePageChange(currentPage + 1);
                }}
                className={
                  currentPage === totalPages
                    ? "pointer-events-none opacity-50"
                    : ""
                }
              />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      )}
    </div>
  );
}
