import type { NextConfig } from "next";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseHost = supabaseUrl ? new URL(supabaseUrl).hostname : null;

const nextConfig: NextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,

  // Partial Pre-Rendering is still flagged in Next 16 stable; toggle
  // experimental.ppr to "incremental" once we benchmark it on the live
  // site. Cache-components / cacheLife is the new caching surface — see
  // https://nextjs.org/docs/app/building-your-application/caching .
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
