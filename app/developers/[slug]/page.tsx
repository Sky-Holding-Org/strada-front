import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "@/components/ui/NextImage";
import type { Metadata } from "next";
import {
  fetchDeveloperBySlug,
  fetchCompoundsByDeveloperSlug,
} from "@/app/api/fetchers";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { AreaNewLaunchesSlider } from "@/components/shared/new-launches-slider";
import { AreaCompoundsGrid } from "@/components/shared/compounds-grid";
import { ContactButtons } from "@/components/shared/contact-buttons";
import { generatePageMetadata } from "@/lib/metadata";
import { generateBreadcrumbSchema } from "@/lib/structured-data";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const developer = await fetchDeveloperBySlug(slug);
  if (!developer) return {};

  return generatePageMetadata({
    title: `${developer.name} - Real Estate Developer in Egypt`,
    description:
      developer.description ||
      `Explore projects by ${developer.name}, a leading real estate developer in Egypt. Browse compounds, properties, and new launches.`,
    keywords: [
      developer.name,
      "real estate developer",
      "property developer Egypt",
      "construction company",
    ],
    path: `/developers/${slug}`,
    images: developer.logo
      ? [
          {
            url: developer.logo.url,
            width: 1200,
            height: 630,
            alt: developer.name,
          },
        ]
      : undefined,
  });
}

export default async function DeveloperDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const developer = await fetchDeveloperBySlug(slug);
  if (!developer) notFound();

  const allCompounds = await fetchCompoundsByDeveloperSlug(slug);
  const newLaunches = allCompounds.filter((c) => c.isNewLaunch);
  const regularCompounds = allCompounds.filter((c) => !c.isNewLaunch);
  const totalProperties = allCompounds.reduce(
    (acc, c) => acc + (c.properties?.length || 0),
    0
  );

  const uniqueAreas = Array.from(
    new Map(
      allCompounds
        .filter((c) => c.area)
        .map((c) => [c.area!.documentId, c.area!])
    ).values()
  );

  const breadcrumbSchema = generateBreadcrumbSchema([
    { name: "Home", url: "https://www.strada-properties.com" },
    {
      name: developer.name,
      url: `https://www.strada-properties.com/developers/${slug}`,
    },
  ]);

  return (
    <main className="min-h-screen w-full bg-white relative pt-20">
      <div
        className="absolute inset-0 z-0"
        style={{
          background: "#ffffff",
          backgroundImage: `
        radial-gradient(
          circle at top right,
          rgba(56, 193, 182, 0.5),
          transparent 70%
        )
      `,
          filter: "blur(80px)",
          backgroundRepeat: "no-repeat",
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      <div className="max-w-7xl mx-auto px-4 pt-8 pb-6 relative z-10">
        <Breadcrumb className="mb-6">
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink asChild>
                <Link href="/">Home</Link>
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>{developer.name}</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>

        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6 mb-8">
          <div className="flex items-center gap-6">
            {developer.logo && (
              <div className="relative w-24 h-24 shrink-0">
                <Image
                  src={developer.logo.url}
                  alt={developer.name}
                  fill
                  className="object-contain rounded-full"
                  loading="lazy"
                  sizes="(max-width: 768px) 100vw, 400px"
                />
              </div>
            )}
            <div>
              <h1 className="text-4xl font-bold mb-2">{developer.name}</h1>
              <p className="text-muted-foreground">
                {allCompounds.length} Compounds • {totalProperties} Properties
              </p>
            </div>
          </div>
          <ContactButtons
            phoneNumber="+201123960001"
            compoundName={developer.name}
          />
        </div>

        {uniqueAreas.length > 0 && (
          <section className="mb-12 bg-white rounded-xl p-8 shadow-sm">
            <h2 className="text-2xl font-bold mb-6">Developer Areas</h2>
            <div className="flex flex-wrap gap-3">
              {uniqueAreas.map((area) => (
                <Link
                  key={area.documentId}
                  href={`/areas/${area.slug}`}
                  className="px-6 py-3 bg-primary/10 hover:bg-primary/20 text-primary rounded-full font-medium transition-colors"
                >
                  {area.name}
                </Link>
              ))}
            </div>
          </section>
        )}

        {newLaunches.length > 0 && (
          <section className="mb-12">
            <h2 className="text-2xl font-bold mb-6">New Launches</h2>
            <AreaNewLaunchesSlider compounds={newLaunches} />
          </section>
        )}

        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-6">All Compounds</h2>
          <AreaCompoundsGrid compounds={regularCompounds} />
        </section>

        <section className="bg-white rounded-xl p-8 shadow-sm">
          <h2 className="text-2xl font-bold mb-4">About {developer.name}</h2>
          <p className="text-muted-foreground leading-relaxed whitespace-pre-line">
            {developer.description}
          </p>
        </section>
      </div>
    </main>
  );
}
