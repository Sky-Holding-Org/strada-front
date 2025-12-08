import Image from "@/components/ui/NextImage";
import Link from "next/link";
import type { Metadata } from "next";
import { generatePageMetadata } from "@/lib/metadata";

export const metadata: Metadata = generatePageMetadata({
  title: "About Us - Strada Properties",
  description:
    "Learn about Strada Properties, a luxury real estate brokerage in Egypt under Sky Holding Group. Discover our mission, vision, and values in redefining the Egyptian real estate market.",
  keywords: [
    "about Strada Properties",
    "real estate brokerage Egypt",
    "Sky Holding Group",
    "luxury real estate consultancy",
  ],
  path: "/about-us",
  images: [
    {
      url: "/about-us.webp",
      width: 1200,
      height: 630,
      alt: "Strada Properties - About Us",
    },
  ],
});

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="relative h-[65vh] bg-[#013344]">
        <Image
          src="/about-us.webp"
          alt="Strada Properties Professionals"
          fill
          className="object-cover opacity-40"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-linear-to-b from-[#013344]/70 to-[#013344]/90">
          <div className="h-full flex flex-col justify-center items-center text-white px-4 max-w-7xl mx-auto">
            <h1 className="text-4xl md:text-6xl font-bold text-center mb-6">
              More About Strada Properties
            </h1>
            <p className="text-xl md:text-2xl text-center max-w-3xl">
              Commitment to redefining luxury real estate.
            </p>
          </div>
        </div>
      </section>

      {/* Company Overview */}
      <section className="bg-[#028180] text-white py-16 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="space-y-6">
            <h2 className="text-3xl font-bold">Company Overview</h2>
            <p className="text-lg leading-relaxed max-w-4xl text-justify">
              From luxurious residential spaces to dynamic commercial hubs,
              Strada redefines the real estate journey for our clients, whilst
              Strada is not just real estate; but a community builder committed
              to exceptional quality and strategic locations. As a consultancy
              and brokerage firm under Sky Holding Group, we focus on the
              Egyptian luxury real estate market. We blend modern design,
              superior amenities, and sustainable practices.
            </p>
          </div>
        </div>
      </section>

      {/* Our Values */}
      <section className="py-20 px-4 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row gap-12 items-center">
            <div className="md:w-1/2">
              <h2 className="text-3xl font-bold text-[#013344] mb-6">
                Our Values
              </h2>
              <p className="text-lg text-gray-700 mb-8">
                At Strada, we stand by values that guide our journey and shape
                every project we undertake:
              </p>

              <ul className="space-y-6">
                <li className="flex items-start gap-4">
                  <div className="bg-[#028180] text-white rounded-full w-8 h-8 flex items-center justify-center shrink-0 mt-1">
                    1
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-[#013344]">
                      Integrity
                    </h3>
                    <p className="text-gray-600">
                      Honesty and transparency in every interaction.
                    </p>
                  </div>
                </li>
                <li className="flex items-start gap-4">
                  <div className="bg-[#028180] text-white rounded-full w-8 h-8 flex items-center justify-center shrink-0 mt-1">
                    2
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-[#013344]">
                      Innovation
                    </h3>
                    <p className="text-gray-600">
                      Pioneering modern solutions to redefine real estate.
                    </p>
                  </div>
                </li>
                <li className="flex items-start gap-4">
                  <div className="bg-[#028180] text-white rounded-full w-8 h-8 flex items-center justify-center shrink-0 mt-1">
                    3
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-[#013344]">
                      Sustainability
                    </h3>
                    <p className="text-gray-600">
                      Prioritizing eco-friendly practices for a better future.
                    </p>
                  </div>
                </li>
                <li className="flex items-start gap-4">
                  <div className="bg-[#028180] text-white rounded-full w-8 h-8 flex items-center justify-center shrink-0 mt-1">
                    4
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-[#013344]">
                      Community
                    </h3>
                    <p className="text-gray-600">
                      Building spaces that foster connection and well-being.
                    </p>
                  </div>
                </li>
              </ul>
            </div>

            <div className="md:w-1/2 relative h-[400px] rounded-lg overflow-hidden shadow-xl hidden md:block">
              <Image
                src="/Values.webp"
                alt="Strada Properties Values"
                fill
                className="object-cover"
                loading="lazy"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Our Mission */}
      <section className="py-20 px-4 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col-reverse md:flex-row gap-12 items-center">
            <div className="md:w-1/2 relative h-[400px] rounded-lg overflow-hidden shadow-xl hidden md:block">
              <Image
                src="/Mission.webp"
                alt="Strada Properties Mission"
                fill
                loading="lazy"
                className="object-cover"
              />
            </div>

            <div className="md:w-1/2">
              <h2 className="text-3xl font-bold text-[#013344] mb-6">
                Our Mission
              </h2>
              <p className="text-lg text-gray-700 leading-relaxed">
                To assist clients in making informed property decisions by
                offering data-backed insights, personalized services, and access
                to exclusive high-value properties. The firm&apos;s approach
                combines technology and industry expertise to provide a unique
                experience in the real estate market.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Our Vision */}
      <section className="py-20 px-4 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row gap-12 items-center">
            <div className="md:w-1/2">
              <h2 className="text-3xl font-bold text-[#013344] mb-6">
                Our Vision
              </h2>
              <p className="text-lg text-gray-700 leading-relaxed">
                To transform the Egyptian real estate market through innovative
                technology and premium, client-focused services, making Strada
                Properties the go-to consultancy for luxury real estate.
              </p>
            </div>

            <div className="md:w-1/2 relative h-[400px] rounded-lg overflow-hidden shadow-xl hidden md:block">
              <Image
                src="/Vision.webp"
                alt="Strada Properties Vision"
                fill
                loading="lazy"
                className="object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 px-4 bg-[#028180] text-white">
        <div className="max-w-7xl mx-auto text-center">
          <div>
            <h2 className="text-3xl font-bold mb-6">
              Ready to Find Your Dream Property?
            </h2>
            <p className="text-xl mb-8 max-w-3xl mx-auto">
              Let Strada Properties guide you through the luxury real estate
              market with expertise and personalized service.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/search"
                className="bg-white text-[#028180] font-semibold py-3 px-8 rounded-md hover:bg-gray-100 transition-all duration-300"
              >
                Browse Properties
              </Link>
              <Link
                href="/contact"
                className="bg-transparent border-2 border-white text-white font-semibold py-3 px-8 rounded-md hover:bg-white/10 transition-all duration-300"
              >
                Contact Us
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
