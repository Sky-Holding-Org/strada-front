"use client";

import * as React from "react";
import Link from "next/link";
import { NewLaunchCard } from "./card/launches-card";
import type { Compound } from "@/app/api/types";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

interface AllLaunchesSectionProps {
  compounds: Compound[];
}

export function AllLaunchesSection({ compounds }: AllLaunchesSectionProps) {
  const [currentPage, setCurrentPage] = React.useState(1);
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

  if (compounds.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">
          No new launches available at the moment.
        </p>
      </div>
    );
  }

  return (
    <div className=" space-y-8">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
        {currentCompounds.map((compound) => (
          <Link key={compound.documentId} href={`/compounds/${compound.slug}`}>
            <NewLaunchCard compound={compound} />
          </Link>
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
