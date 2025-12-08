import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Strada Properties - Luxury Real Estate in Egypt",
    short_name: "Strada Properties",
    description:
      "Discover luxury properties in Egypt. From residential spaces to commercial hubs, Strada Properties redefines your real estate journey.",
    start_url: "/",
    display: "standalone",
    background_color: "#F7F8F8",
    theme_color: "#013344",
    icons: [
      {
        src: "/logo.svg",
        sizes: "any",
        type: "image/svg+xml",
      },
    ],
  };
}
