import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/api/", "/error-pages/"],
    },
    sitemap: "https://www.strada-properties.com/sitemap.xml",
  };
}
