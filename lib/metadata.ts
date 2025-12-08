import type { Metadata } from "next";

export const baseMetadata = {
  metadataBase: new URL("https://www.strada-properties.com"),
  title: {
    default: "Strada Properties - Luxury Real Estate in Egypt",
    template: "%s | Strada Properties",
  },
  description:
    "Discover luxury properties in Egypt with Strada Properties. From residential spaces to commercial hubs, we redefine your real estate journey with exceptional quality and strategic locations.",
  keywords: [
    "real estate",
    "Strada Properties",
    "property listings",
    "luxury homes",
    "investment properties",
    "real estate agents",
    "compounds",
    "developers",
    "real estate Egypt",
    "luxury real estate Egypt",
    "properties for sale Egypt",
    "New Capital",
    "North Coast",
    "6th of October",
    "New Cairo",
    "Alexandria",
  ],
  authors: [{ name: "Strada Properties" }],
  creator: "Strada Properties",
  publisher: "Strada Properties",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  openGraph: {
    type: "website",
    locale: "en_EG",
    url: "https://www.strada-properties.com",
    siteName: "Strada Properties",
    title: "Strada Properties - Luxury Real Estate in Egypt",
    description:
      "Discover luxury properties in Egypt with Strada Properties. From residential spaces to commercial hubs, we redefine your real estate journey.",
    images: [
      {
        url: "/Home.webp",
        width: 1200,
        height: 630,
        alt: "Strada Properties - Luxury Real Estate",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Strada Properties - Luxury Real Estate in Egypt",
    description:
      "Discover luxury properties in Egypt with Strada Properties. From residential spaces to commercial hubs, we redefine your real estate journey.",
    images: ["/Home.webp"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  alternates: {
    canonical: "https://www.strada-properties.com",
  },
  verification: {
    google: "",
    yandex: "",
    yahoo: "",
  },
} satisfies Metadata;

export function generatePageMetadata({
  title,
  description,
  keywords = [],
  path = "",
  images,
}: {
  title: string;
  description: string;
  keywords?: string[];
  path?: string;
  images?: { url: string; width?: number; height?: number; alt: string }[];
}): Metadata {
  const url = `https://www.strada-properties.com${path}`;
  const defaultImage = images?.[0] || {
    url: "/Home.webp",
    width: 1200,
    height: 630,
    alt: title,
  };

  return {
    title,
    description,
    keywords: [...baseMetadata.keywords, ...keywords],
    openGraph: {
      ...baseMetadata.openGraph,
      title,
      description,
      url,
      images: images || [defaultImage],
    },
    twitter: {
      ...baseMetadata.twitter,
      title,
      description,
      images: images?.map((img) => img.url) || [defaultImage.url],
    },
    alternates: {
      canonical: url,
    },
  };
}
