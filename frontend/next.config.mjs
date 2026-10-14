/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "**" },
      { protocol: "http",  hostname: "**" },
    ],
    formats: ["image/avif", "image/webp"],
    minimumCacheTTL: 86400, // 24 hours (was 1 hour)
    // Largest rendered image is a ~20vw product card; 2048/3840 variants
    // were never needed and inflated Fast Origin Transfer for nothing.
    deviceSizes: [640, 750, 828, 1080, 1200, 1920],
    // Re-enabled now that we're on fixed-cost Hostinger hosting instead of
    // Vercel's Hobby plan — there's no more per-request billing risk, and
    // resizing/AVIF-WebP conversion meaningfully shrinks image payload.
  },
  experimental: {
    optimizePackageImports: ["lucide-react", "@radix-ui/react-dialog", "@radix-ui/react-select"],
    optimizeCss: true,
  },
  compress: true,
  poweredByHeader: false,
  // Cache static assets for 1 year
  async headers() {
    return [
      {
        source: "/(.*)\\.(png|jpg|jpeg|gif|webp|avif|svg|ico|woff|woff2)",
        headers: [
          { key: "Cache-Control", value: "public, max-age=31536000, immutable" },
        ],
      },
      {
        // The optimizer endpoint has no file extension (?url=...&w=...) so the
        // rule above never matches it — give it the same long cache explicitly.
        source: "/_next/image(.*)",
        headers: [
          { key: "Cache-Control", value: "public, max-age=31536000, immutable" },
        ],
      },
      {
        source: "/_next/static/(.*)",
        headers: [
          { key: "Cache-Control", value: "public, max-age=31536000, immutable" },
        ],
      },
    ];
  },
};

export default nextConfig;
