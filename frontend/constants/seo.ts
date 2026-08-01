import { BRAND } from "@/constants/brand";
import { LANDING } from "@/constants/landing";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

export const SEO = {
  siteUrl,
  siteName: BRAND.name,
  titleDefault: `${BRAND.name} — Digital Marketing Strategist | SEO, Content & Ads`,
  titleTemplate: `%s · ${BRAND.name}`,
  description:
    "Samah helps brands grow with SEO, content marketing, Meta & Google ads, and performance-driven digital strategy. Book a free consultation.",
  keywords: [
    "Samah",
    "Grow with Samah",
    "digital marketing strategist",
    "SEO specialist",
    "content marketing",
    "social media marketing",
    "Meta ads",
    "Google Ads",
    "marketing consultant",
    "book consultation",
  ],
  ogImageAlt: `${BRAND.name} — digital marketing strategist`,
  pages: {
    home: {
      title: `${BRAND.name} — Digital Marketing Strategist | SEO, Content & Ads`,
      description:
        "Helping brands grow with strategic digital marketing that delivers measurable results — SEO, content, paid ads, and performance systems.",
      path: "/",
    },
    portfolio: {
      title: "Portfolio",
      description: `Selected digital marketing case studies by ${BRAND.name} — brand, content, and acquisition work with measurable growth.`,
      path: "/portfolio",
    },
    book: {
      title: "Book a free consultation",
      description: `Book a free consultation with ${BRAND.name}. Share your goals and get a clear next step for SEO, content, or paid growth.`,
      path: "/book",
    },
    privacy: {
      title: "Privacy Policy",
      description: `How ${BRAND.name} collects, uses, and protects personal data from bookings, contact forms, and Samah AI conversations.`,
      path: "/privacy",
    },
  },
  locale: "en_US",
  faq: LANDING.faq,
} as const;

export function absoluteUrl(path = "/"): string {
  if (path === "/" || path === "") {
    return SEO.siteUrl;
  }

  return `${SEO.siteUrl}${path.startsWith("/") ? path : `/${path}`}`;
}

export function pageMetadata(input: {
  title: string;
  description: string;
  path: string;
  noIndex?: boolean;
}) {
  const url = absoluteUrl(input.path);

  return {
    title: input.title,
    description: input.description,
    alternates: { canonical: input.path },
    openGraph: {
      title: input.title,
      description: input.description,
      url,
      siteName: SEO.siteName,
      locale: SEO.locale,
      type: "website" as const,
    },
    twitter: {
      card: "summary_large_image" as const,
      title: input.title,
      description: input.description,
    },
    ...(input.noIndex
      ? {
          robots: {
            index: false,
            follow: false,
          },
        }
      : {}),
  };
}
