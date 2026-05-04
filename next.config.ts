import type { NextConfig } from "next";
import { fa } from "zod/v4/locales";

const nextConfig: NextConfig = {
  compiler: {
    removeConsole: process.env.NODE_ENV === "production",
  },
  // reactStrictMode: true,
  reactCompiler: true,
  experimental: {
    // turbopackFileSystemCacheForDev: true,
    optimizePackageImports: [
      "lucide-react",
      "@radix-ui/react-icons",
      "framer-motion",
      "react-icons",
    ],
    optimizeCss: false,
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "strada-cms-bucket-eu.s3.eu-central-1.amazonaws.com",
        pathname: "**",
      },
    ],
    deviceSizes: [640, 1080, 1920],
    imageSizes: [32, 64, 96],
    formats: ["image/webp"],
    minimumCacheTTL: 31536000,
    dangerouslyAllowSVG: true,
    contentDispositionType: "inline",
  },
  compress: true,
  poweredByHeader: false,
  productionBrowserSourceMaps: false,
  generateEtags: true,
  httpAgentOptions: {
    keepAlive: true,
  },
};

export default nextConfig;
