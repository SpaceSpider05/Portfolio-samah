import { BRAND } from "@/constants/brand";
import { LANDING } from "@/constants/landing";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

export const SEO = {
  siteUrl,
  siteName: BRAND.name,
  titleDefault: `${BRAND.name} | Digital Marketing Strategist & SEO Expert`,
  titleTemplate: `%s · ${BRAND.name}`,
  description:
    "Freelance Digital Marketing Strategist helping brands grow with SEO, content marketing, Google Ads, and performance strategy. Book a free consultation.",
  keywords: [
    "Digital Marketing Strategist",
    "Digital Marketing Expert",
    "Freelance Digital Marketer",
    "Marketing Consultant",
    "SEO Expert",
    "SEO Consultant",
    "SEO Services",
    "Content Marketing",
    "Google Ads Specialist",
    "Performance Marketing",
    "Social Media Marketing",
    "Conversion Rate Optimization",
    "Lead Generation",
    "Growth Marketing",
    "Samah",
    "Grow with Samah",
  ],
  knowsAbout: [
    "Digital Marketing Strategy",
    "Search Engine Optimization",
    "Content Marketing",
    "Google Ads",
    "Meta Ads",
    "Performance Marketing",
    "Social Media Marketing",
    "Email Marketing",
    "Conversion Rate Optimization",
    "Marketing Analytics",
    "Lead Generation",
    "Brand Strategy",
  ],
  ogImageAlt: `${BRAND.name} — Digital Marketing Strategist`,
  pages: {
    home: {
      title: `${BRAND.name} | Digital Marketing Strategist & SEO Expert`,
      description:
        "Hire Digital Marketing Strategist Samah for SEO, content strategy, Google Ads, and social growth. Clear strategy, measurable results. Book a free consultation.",
      path: "/",
    },
    portfolio: {
      title: "Digital Marketing Portfolio",
      description: `Explore digital marketing case studies by ${BRAND.name} — SEO, content, social, and acquisition work built for measurable business growth.`,
      path: "/portfolio",
    },
    book: {
      title: "Book a Digital Marketing Consultation",
      description: `Book a free consultation with Digital Marketing Strategist ${BRAND.name}. Share your goals and get a clear next step for SEO, content, or paid growth.`,
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

/** Prefer real contact numbers over obvious CMS placeholders. */
export function resolveSeoPhone(raw?: string | null): string | undefined {
  const fallback = BRAND.phone?.trim() || undefined;
  const phone = (raw ?? "").trim() || fallback;
  if (!phone) {
    return undefined;
  }

  const digits = phone.replace(/\D/g, "");
  if (/^(212)?6{6,}/.test(digits) || /0{6,}/.test(digits)) {
    return fallback;
  }

  return phone;
}

export function pageMetadata(input: {
  title: string;
  description: string;
  path: string;
  noIndex?: boolean;
  image?: string;
}) {
  const url = absoluteUrl(input.path);
  const image = input.image ?? absoluteUrl("/opengraph-image");

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
      images: [
        {
          url: image,
          alt: SEO.ogImageAlt,
        },
      ],
    },
    twitter: {
      card: "summary_large_image" as const,
      title: input.title,
      description: input.description,
      images: [image],
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
