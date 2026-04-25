import type { NextConfig } from "next";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseHost = supabaseUrl ? new URL(supabaseUrl).hostname : null;

const nextConfig: NextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,

  // Partial Pre-Rendering is canary-only as of Next 15.5.15. Re-enable
  // (with `ppr: "incremental"`) once it lands in stable or once we move
  // the Vercel project to the canary release channel.
  experimental: {
    optimizePackageImports: [
      "lucide-react",
      "date-fns",
      "@dnd-kit/core",
      "@dnd-kit/sortable",
    ],
  },

  images: {
    formats: ["image/avif", "image/webp"],
    remotePatterns: [
      ...(supabaseHost
        ? [
            {
              protocol: "https" as const,
              hostname: supabaseHost,
              pathname: "/storage/v1/object/public/**",
            },
          ]
        : []),
      // Allegro hosts CDN-served product images
      { protocol: "https", hostname: "*.allegro.com" },
      { protocol: "https", hostname: "a.allegroimg.com" },
    ],
  },

  async headers() {
    return [
      {
        source: "/admin/:path*",
        headers: [{ key: "X-Robots-Tag", value: "noindex, nofollow" }],
      },
    ];
  },
};

export default nextConfig;
