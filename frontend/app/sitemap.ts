import type { MetadataRoute } from "next";
import { getProjects } from "@/services/api";
import { SEO, absoluteUrl } from "@/constants/seo";

/** Refresh at least hourly so new portfolio projects appear for Search Console. */
export const revalidate = 3600;

function toDate(value?: string | null): Date {
  if (!value) {
    return new Date();
  }
  const parsed = new Date(value);
  return Number.isNaN(parsed.getTime()) ? new Date() : parsed;
}

function uniqueImages(urls: Array<string | null | undefined>): string[] {
  const seen = new Set<string>();
  const out: string[] = [];
  for (const url of urls) {
    if (!url || !/^https?:\/\//i.test(url) || seen.has(url)) {
      continue;
    }
    seen.add(url);
    out.push(url);
  }
  return out;
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const projects = (await getProjects().catch(() => [])).filter(
    (project) => project.isPublished !== false && Boolean(project.slug),
  );

  const staticPages: MetadataRoute.Sitemap = [
    {
      url: absoluteUrl("/"),
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 1,
    },
    {
      url: absoluteUrl(SEO.pages.portfolio.path),
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.9,
    },
    {
      url: absoluteUrl(SEO.pages.book.path),
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.85,
    },
    {
      url: absoluteUrl(SEO.pages.privacy.path),
      lastModified: new Date(),
      changeFrequency: "yearly",
      priority: 0.2,
    },
  ];

  const projectPages: MetadataRoute.Sitemap = projects.map((project) => {
    const gallery = (project.galleryImages ?? []).map((image) => image.path);
    return {
      url: absoluteUrl(`/portfolio/${project.slug}`),
      lastModified: toDate(project.createdAt),
      changeFrequency: "monthly",
      priority: 0.75,
      images: uniqueImages([project.coverImage, ...gallery]),
    };
  });

  return [...staticPages, ...projectPages];
}
