import type { NextConfig } from "next";
import path from "path";

const nextConfig: NextConfig = {
  images: {
    dangerouslyAllowSVG: true,
    contentDispositionType: "attachment",
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
    remotePatterns: [
      {
        protocol: "http",
        hostname: "127.0.0.1",
        port: "8000",
        pathname: "/storage/**",
      },
      {
        protocol: "http",
        hostname: "localhost",
        port: "8000",
        pathname: "/storage/**",
      },
      {
        protocol: "https",
        hostname: "api.growwithsamah.com",
        pathname: "/storage/**",
      },
    ],
  },
  experimental: {
    optimizePackageImports: ["lucide-react", "gsap", "framer-motion"],
  },
  turbopack: {
    root: path.join(__dirname),
  },
};

export default nextConfig;
