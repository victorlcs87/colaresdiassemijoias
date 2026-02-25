import type { NextConfig } from "next";
import withSerwistInit from "@serwist/next";

const withSerwist = withSerwistInit({
  // Desativar em dev mode para não poluir o cache local
  disable: process.env.NODE_ENV === "development",
  swSrc: "src/app/sw.ts",
  swDest: "public/sw.js",
  // Injeta automaticamente o manifest injetando o roteamento default
});

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
      {
        protocol: "https",
        hostname: "**.supabase.co",
      }
    ]
  }
};

export default withSerwist(nextConfig);
