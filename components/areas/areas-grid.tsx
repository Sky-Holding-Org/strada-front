"use client";

import Link from "next/link";
import Image from "@/components/ui/NextImage";
import { motion } from "framer-motion";
import type { Area } from "@/app/api/types";

interface AreasGridProps {
  areas: Area[];
}

export function AreasGrid({ areas }: AreasGridProps) {
  if (areas.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">No areas available.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      {areas.map((area, index) => (
        <motion.div
          key={area.documentId}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: index * 0.05 }}
        >
          <Link href={`/areas/${area.slug}`}>
            <div className="group relative aspect-square overflow-hidden rounded-xl shadow-md hover:shadow-xl transition-all duration-300">
              {area.banner ? (
                <Image
                  src={area.banner.url}
                  alt={area.name}
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-110"
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                  loading="lazy"
                />
              ) : (
                <div className="h-full w-full flex items-center justify-center bg-muted">
                  <span className="text-muted-foreground text-sm">
                    No image
                  </span>
                </div>
              )}

              <div className="absolute inset-0 bg-linear-to-t from-black/80 via-black/40 to-transparent transition-opacity duration-300 group-hover:from-black/90" />

              <div className="absolute inset-0 flex flex-col items-center justify-end text-white pb-12 text-center">
                <h3 className="text-xl font-bold mb-2 transform transition-transform duration-300 group-hover:scale-105">
                  {area.name}
                </h3>
                <div className="flex gap-4 text-sm opacity-90">
                  <span>{area.compounds?.length || 0} Compounds</span>
                  <span>•</span>
                  <span>
                    {area.compounds?.reduce(
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
