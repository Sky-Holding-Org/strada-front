import { Montserrat } from "next/font/google";
import "./globals.css";
import Header from "@/components/shared/Header";
import Footer from "@/components/shared/Footer";
import { NuqsAdapter } from "nuqs/adapters/next/app";
import { FavoritesProvider } from "@/contexts/favorites-context";
import { baseMetadata } from "@/lib/metadata";
import { organizationSchema, websiteSchema } from "@/lib/structured-data";
import { Toaster } from "@/components/ui/sonner";
import { SpeedInsights } from "@vercel/speed-insights/next";

const montserrat = Montserrat({
  subsets: ["latin"],
  variable: "--font-montserrat",
  display: "swap",
  preload: true,
});

export const metadata = baseMetadata;

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(organizationSchema),
          }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(websiteSchema),
          }}
        />
        <link
          rel="preconnect"
          href="https://strada-cms-bucket.s3.me-south-1.amazonaws.com"
          crossOrigin="anonymous"
        />
        <link
          rel="dns-prefetch"
          href="https://strada-cms-bucket.s3.me-south-1.amazonaws.com"
        />
      </head>
      <body className={`${montserrat.variable} antialiased`}>
        <FavoritesProvider>
          <NuqsAdapter>
            <Header />
            <main className="flex-1 min-h-screen">{children}</main>
            <SpeedInsights />
            <Footer />
            <Toaster />
          </NuqsAdapter>
        </FavoritesProvider>
      </body>
    </html>
  );
}
