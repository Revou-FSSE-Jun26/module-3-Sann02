import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // create-next-app 16.4 enables Cache Components + Partial Prefetching by default.
  // This checkpoint follows the course's request-time model instead
  // (async Server Component fetch + loading.tsx / error.tsx per route),
  // documented in node_modules/next/dist/docs/01-app/02-guides/caching-without-cache-components.md.
  cacheComponents: false,
  experimental: {
    agentUpgrade: "security",
  },
  images: {
    // Product photos. Unsplash is the current stable source (hotlink-friendly,
    // non-expiring URLs). Tokopedia CDNs are kept for any legacy image_url rows.
    remotePatterns: [
      { protocol: "https", hostname: "images.unsplash.com" },
      { protocol: "https", hostname: "**.tokopedia-static.net" },
      { protocol: "https", hostname: "**.tokopedia.net" },
    ],
  },
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
};

export default nextConfig;
