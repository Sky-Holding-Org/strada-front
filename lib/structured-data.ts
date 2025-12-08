export const organizationSchema = {
  "@context": "https://schema.org",
  "@type": "RealEstateAgent",
  name: "Strada Properties",
  description:
    "Luxury real estate brokerage in Egypt. From residential spaces to commercial hubs, Strada redefines the real estate journey.",
  url: "https://www.strada-properties.com",
  logo: "https://www.strada-properties.com/logo.svg",
  image: "https://www.strada-properties.com/Home.webp",
  telephone: "+201123960001",
  email: "sales@strada-properties.com",
  address: {
    "@type": "PostalAddress",
    addressCountry: "EG",
  },
  sameAs: [
    "https://www.facebook.com/p/Strada-properties-61565371004923/",
    "https://www.instagram.com/strada.properties",
    "https://eg.linkedin.com/company/strada-properties-egypt",
  ],
  areaServed: {
    "@type": "Country",
    name: "Egypt",
  },
};

export const websiteSchema = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: "Strada Properties",
  url: "https://www.strada-properties.com",
  potentialAction: {
    "@type": "SearchAction",
    target: {
      "@type": "EntryPoint",
      urlTemplate:
        "https://www.strada-properties.com/search?query={search_term_string}",
    },
    "query-input": "required name=search_term_string",
  },
};

export function generatePropertySchema(property: {
  name: string;
  description: string;
  price?: number;
  currency?: string;
  image?: string;
  url: string;
  address?: string;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "Product",
    name: property.name,
    description: property.description,
    image: property.image || "https://www.strada-properties.com/Home.webp",
    url: property.url,
    ...(property.price && {
      offers: {
        "@type": "Offer",
        price: property.price,
        priceCurrency: property.currency || "EGP",
        availability: "https://schema.org/InStock",
      },
    }),
  };
}

export function generateBreadcrumbSchema(items: { name: string; url: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: item.url,
    })),
  };
}
