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
    // Images already come pre-compressed from ImgBB (client-side, 800px/q0.75) —
    // Vercel's own re-optimization was pure added Fast Origin Transfer cost
    // and tipped the Hobby plan into DEPLOYMENT_DISABLED.
    unoptimized: true,
  },
  experimental: {
    optimizePackageImports: ["lucide-react", "@radix-ui/react-dialog", "@radix-ui/react-select"],
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
    ];
  },
};

export default nextConfig;
