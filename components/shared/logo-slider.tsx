"use client";

import Image from "@/components/ui/NextImage";
import { InfiniteSlider } from "@/components/ui/infinite-slider";

const logos = [
  "/logo/logo1.svg",
  "/logo/logo2.svg",
  "/logo/logo3.svg",
  "/logo/logo4.svg",
  "/logo/logo5.svg",
  "/logo/logo6.svg",
  "/logo/logo7.svg",
  "/logo/logo8.svg",
  "/logo/logo9.svg",
  "/logo/logo10.svg",
  "/logo/logo11.svg",
  "/logo/logo12.svg",
];

export function LogoSlider() {
  return (
    <div className="w-full overflow-hidden py-6">
      <InfiniteSlider gap={48} speed={50} speedOnHover={0} className="py-4">
        {logos.map((logo, index) => (
          <div
            key={index}
            className="flex items-center justify-center p-4 h-[120px] w-[180px]"
          >
            <div className="relative h-20 w-[140px]">
              <Image
                src={logo || "no image"}
                alt={`Partner logo ${index + 1}`}
                fill
                className="object-contain"
                sizes="140px"
                loading="lazy"
              />
            </div>
          </div>
        ))}
      </InfiniteSlider>
    </div>
  );
}
