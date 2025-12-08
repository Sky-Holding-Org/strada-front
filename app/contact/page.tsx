import Image from "@/components/ui/NextImage";
import ContactForm from "@/components/shared/contact-form";
import { Suspense } from "react";
import { ContactFormSkeleton } from "@/components/shared/loading/contact-form-skeleton";
import { fetchAllAreas } from "@/app/api/fetchers";
import { Phone, Mail, MapPin } from "lucide-react";

async function getAreas() {
  try {
    const areas = await fetchAllAreas();
    return areas.map((area) => ({
      id: area.id,
      name: area.name,
      slug: area.slug,
    }));
  } catch (error) {
    console.error("Failed to fetch areas", error);
    return [];
  }
}

export default async function ContactPage() {
  const areas = await getAreas();
  return (
    <section className="relative min-h-screen pt-12">
      <Image
        src="/contact-us.webp"
        alt="Contact Us"
        fill
        priority
        className="object-cover"
        sizes="(max-width: 768px) 100vw, 400px"
      />

      <div className=" relative z-10 mx-auto px-4 py-16 lg:py-24">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-start max-w-6xl mx-auto">
          <div className="space-y-8">
            <div className="space-y-4">
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white leading-tight">
                Let's Find Your
                <span className="block text-[#8DD3E5]">Dream Home</span>
              </h1>
              <p className="text-lg md:text-xl text-gray-100 leading-relaxed">
                Our expert team is ready to guide you through every step of your
                property journey.
              </p>
            </div>

            <div className="space-y-4">
              <a
                href="tel:+201123960001"
                className="flex items-center gap-4 p-4 bg-white/10 backdrop-blur-md rounded-xl hover:bg-white/20 transition-all duration-300 group"
              >
                <div className="p-3 bg-[#8DD3E5] rounded-lg group-hover:scale-110 transition-transform">
                  <Phone className="h-5 w-5 text-[#013344]" />
                </div>
                <div>
                  <p className="text-sm text-gray-300">Call us</p>
                  <p className="text-white font-semibold">+20 (112) 396-0001</p>
                </div>
              </a>

              <a
                href="mailto:sales@strada-properties.com"
                className="flex items-center gap-4 p-4 bg-white/10 backdrop-blur-md rounded-xl hover:bg-white/20 transition-all duration-300 group"
              >
                <div className="p-3 bg-[#8DD3E5] rounded-lg group-hover:scale-110 transition-transform">
                  <Mail className="h-5 w-5 text-[#013344]" />
                </div>
                <div>
                  <p className="text-sm text-gray-300">Email us</p>
                  <p className="text-white font-semibold">
                    sales@strada-properties.com
                  </p>
                </div>
              </a>

              <a
                href="https://maps.google.com/?q=One+Kattameya,+215,+Maadi+Kattameya+Ringroad,+Cairo,+Egypt"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-4 p-4 bg-white/10 backdrop-blur-md rounded-xl hover:bg-white/20 transition-all duration-300 group"
              >
                <div className="p-3 bg-[#8DD3E5] rounded-lg group-hover:scale-110 transition-transform">
                  <MapPin className="h-5 w-5 text-[#013344]" />
                </div>
                <div>
                  <p className="text-sm text-gray-300">Visit us</p>
                  <p className="text-white font-semibold">
                    One Kattameya, 215, Maadi Kattameya Ringroad
                  </p>
                </div>
              </a>
            </div>
          </div>

          <div className="lg:sticky lg:top-24">
            <Suspense fallback={<ContactFormSkeleton />}>
              <ContactForm initialAreas={areas} />
            </Suspense>
          </div>
        </div>
      </div>
    </section>
  );
}
