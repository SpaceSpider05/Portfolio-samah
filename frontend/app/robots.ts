import type { MetadataRoute } from "next";
import { SEO } from "@/constants/seo";

/**
 * robots.txt for Google Search Console + crawlers.
 * Cloudflare may prepend managed AI bot rules in front of this file.
 */
export default function robots(): MetadataRoute.Robots {
  const sitemapUrl = `${SEO.siteUrl.replace(/\/$/, "")}/sitemap.xml`;

  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: [
          "/admin",
          "/admin/",
          "/api/",
          "/api/admin/",
        ],
      },
      {
        userAgent: "Googlebot",
        allow: "/",
        disallow: ["/admin", "/admin/", "/api/", "/api/admin/"],
      },
    ],
    sitemap: sitemapUrl,
    host: SEO.siteUrl.replace(/\/$/, ""),
  };
}
