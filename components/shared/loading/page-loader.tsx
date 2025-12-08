"use client";

import Image from "@/components/ui/NextImage";

export function PageLoader() {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-white">
      <div className="flex flex-col items-center gap-4">
        <div className="relative w-64 h-20 animate-pulse">
          <Image
            src="/LogoD.svg"
            alt="Strada Logo"
            fill
            sizes="256px"
            className="object-contain"
          />
        </div>
        <div className="flex gap-2">
          <div className="w-2 h-2 bg-primary rounded-full animate-bounce [animation-delay:-0.3s]" />
          <div className="w-2 h-2 bg-primary rounded-full animate-bounce [animation-delay:-0.15s]" />
          <div className="w-2 h-2 bg-primary rounded-full animate-bounce" />
        </div>
      </div>
    </div>
  );
}
