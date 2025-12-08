"use client";

import Link from "next/link";
import Image from "@/components/ui/NextImage";
import { motion } from "framer-motion";
import type { Developer } from "@/app/api/types";

interface DevelopersGridProps {
  developers: Developer[];
}

export function DevelopersGrid({ developers }: DevelopersGridProps) {
  if (developers.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">No developers available.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      {developers.map((developer, index) => (
        <motion.div
          key={developer.documentId}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: index * 0.05 }}
        >
          <Link href={`/developers/${developer.slug}`}>
            <div className="group relative aspect-square overflow-hidden rounded-xl shadow-md hover:shadow-xl transition-all duration-300 bg-white">
              {developer.logo ? (
                <Image
                  src={developer.logo.url}
                  alt={developer.name}
                  fill
                  className="object-contain p-8 transition-transform duration-500 group-hover:scale-110"
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                  loading="lazy"
                />
              ) : (
                <div className="h-full w-full flex items-center justify-center bg-muted">
                  <span className="text-muted-foreground text-sm">No logo</span>
                </div>
              )}

              <div className="absolute inset-0 bg-linear-to-t from-black/80 via-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

              <div className="absolute inset-0 flex flex-col items-center justify-end text-white pb-12 text-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <h3 className="text-xl font-bold mb-2 transform transition-transform duration-300 group-hover:scale-105">
                  {developer.name}
                </h3>
                <div className="flex gap-4 text-sm opacity-90">
                  <span>{developer.compounds?.length || 0} Compounds</span>
                  <span>•</span>
                  <span>
                    {developer.compounds?.reduce(
                      (acc: number, c: any) =>
                        acc + (c.properties?.length || 0),
                      0
                    ) || 0}{" "}
                    Properties
                  </span>
                </div>
              </div>
            </div>
          </Link>
        </motion.div>
      ))}
    </div>
  );
}
