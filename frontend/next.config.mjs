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
    // sharp isn't usable in this Hostinger Node runtime (confirmed: the
    // optimizer returns the source file byte-for-byte unchanged no matter
    // what w=/q= is requested), so every /_next/image request was pure
    // proxy overhead with zero compression — measured as a 3+ second LCP
    // "resource load delay" on the hero image alone. Images are already
    // optimized at the source instead (hero-bg pre-compressed to WebP,
    // product photos compressed client-side before upload to ImgBB).
    unoptimized: true,
  },
  experimental: {
    optimizePackageImports: ["lucide-react", "@radix-ui/react-dialog", "@radix-ui/react-select"],
    // Tried optimizeCss (critters) to inline critical CSS — confirmed via
    // build output it's a no-op with App Router's streaming CSS here (0
    // <style> tags produced either way), so dropped rather than keep paying
    // the build-time cost for nothing.
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
