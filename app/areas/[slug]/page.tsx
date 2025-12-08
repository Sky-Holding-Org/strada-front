import { notFound } from "next/navigation";
import Link from "next/link";
import type { Metadata } from "next";
import { fetchAreaBySlug, fetchCompoundsByAreaSlug } from "@/app/api/fetchers";
import { ContactButtons } from "@/components/shared/contact-buttons";
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
import { generatePageMetadata } from "@/lib/metadata";
import { generateBreadcrumbSchema } from "@/lib/structured-data";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const area = await fetchAreaBySlug(slug);
  if (!area) return {};

  return generatePageMetadata({
    title: `${area.name} - Properties & Compounds`,
    description:
      area.description ||
      `Explore luxury properties and compounds in ${area.name}, Egypt. Find your dream home with Strada Properties.`,
    keywords: [
      area.name,
      `properties in ${area.name}`,
      `compounds in ${area.name}`,
      `real estate ${area.name}`,
    ],
    path: `/areas/${slug}`,
  });
}

export default async function AreaDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const area = await fetchAreaBySlug(slug);
  if (!area) notFound();

  const allCompounds = await fetchCompoundsByAreaSlug(slug);
  const newLaunches = allCompounds.filter((c) => c.isNewLaunch);
  const regularCompounds = allCompounds.filter((c) => !c.isNewLaunch);
  const totalProperties = allCompounds.reduce(
    (acc, c) => acc + (c.properties?.length || 0),
    0
  );

  const breadcrumbSchema = generateBreadcrumbSchema([
    { name: "Home", url: "https://www.strada-properties.com" },
    { name: area.name, url: `https://www.strada-properties.com/areas/${slug}` },
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
              <BreadcrumbPage>{area.name}</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>

        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
          <div>
            <h1 className="text-4xl font-bold mb-2">{area.name}</h1>
            <p className="text-muted-foreground">
              {allCompounds.length} Compounds • {totalProperties} Properties
            </p>
          </div>
          <ContactButtons
            phoneNumber="+201123960001"
            compoundName={area.name}
          />
        </div>

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
          <h2 className="text-2xl font-bold mb-4">About {area.name}</h2>
          <p className="text-muted-foreground leading-relaxed whitespace-pre-line">
            {area.description}
          </p>
        </section>
      </div>
    </main>
  );
}
