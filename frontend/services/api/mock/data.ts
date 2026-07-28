import type {
  AboutContent,
  Project,
  Service,
  StatsContent,
} from "@/types";

export const mockAbout: AboutContent = {
  name: "Samah",
  role: "Digital Marketing Strategist",
  photoUrl: "/images/about-portrait.jpg",
  bio: "A decade of crafting brand systems, performance campaigns, and immersive digital experiences for ambitious companies.",
  mission:
    "To prove marketing quality through the product itself — every scroll, every interaction, every detail.",
  timeline: [
    {
      id: "t1",
      year: "2016",
      title: "First agency role",
      description: "Cut teeth on multi-channel campaigns for lifestyle brands.",
    },
    {
      id: "t2",
      year: "2019",
      title: "Independent studio",
      description: "Launched a boutique practice focused on premium digital growth.",
    },
    {
      id: "t3",
      year: "2022",
      title: "Product-led marketing",
      description: "Merged design systems with performance media for SaaS and retail.",
    },
    {
      id: "t4",
      year: "2025",
      title: "Immersive experiences",
      description: "Building cinematic web products that sell the craft, not just the claim.",
    },
  ],
  achievements: [
    { id: "a1", label: "Awards", value: 18, suffix: "+" },
    { id: "a2", label: "Campaigns", value: 240, suffix: "+" },
    { id: "a3", label: "Markets", value: 12, suffix: "" },
  ],
};

export const mockServices: Service[] = [
  {
    id: "s1",
    slug: "seo",
    title: "SEO Strategy",
    description:
      "Technical foundations, content architecture, and ranking systems that compound.",
    hoverDemo: "seo",
    cta: "Climb the ranks",
  },
  {
    id: "s2",
    slug: "social-media",
    title: "Social Media",
    description:
      "Editorial calendars, creative systems, and community loops that feel native.",
    hoverDemo: "social",
    cta: "Grow the feed",
  },
  {
    id: "s3",
    slug: "paid-ads",
    title: "Paid Ads",
    description:
      "Precision acquisition across Meta, Google, and LinkedIn with creative that converts.",
    hoverDemo: "ads",
    cta: "Scale spend",
  },
];

export const mockProjects: Project[] = [
  {
    id: "p1",
    slug: "lumen-retail",
    title: "Lumen Retail Rebrand",
    client: "Lumen Co.",
    category: "Brand + Performance",
    summary: "A full-funnel relaunch that turned a regional retailer into a digital-first brand.",
    challenge: "Fragmented messaging and declining organic reach across three markets.",
    solution:
      "Unified brand system, SEO content hubs, and social commerce creative tested weekly.",
    results: ["+186% organic traffic", "3.2x ROAS", "41% lift in AOV"],
    technologies: ["Next.js", "GA4", "Meta Ads", "Contentful"],
    coverImage: "/images/project-lumen.svg",
  },
  {
    id: "p2",
    slug: "northline-saas",
    title: "Northline SaaS Growth",
    client: "Northline",
    category: "Demand Gen",
    summary: "Pipeline acceleration for a B2B analytics platform entering enterprise.",
    challenge: "High CAC and weak demo conversion from paid channels.",
    solution:
      "Account-based creative, LinkedIn experiments, and landing experiences tuned to ICP.",
    results: ["-38% CAC", "+92% demo bookings", "2.1x pipeline"],
    technologies: ["HubSpot", "LinkedIn Ads", "Framer", "Looker"],
    coverImage: "/images/project-northline.svg",
  },
  {
    id: "p3",
    slug: "atelier-social",
    title: "Atelier Social Engine",
    client: "Atelier Maison",
    category: "Social + Content",
    summary: "A content operating system that made a luxury label culturally fluent online.",
    challenge: "Beautiful product, quiet presence — no consistent narrative on social.",
    solution:
      "Editorial pillars, short-form production system, and creator micro-collaborations.",
    results: ["12M+ campaign reach", "+240% engagement", "Sold-out drop in 6 hours"],
    technologies: ["Instagram", "TikTok", "CapCut", "Notion"],
    coverImage: "/images/project-atelier.svg",
  },
];

export const mockStats: StatsContent = {
  metrics: [
    { id: "m1", label: "Projects Completed", value: 120, suffix: "+" },
    { id: "m2", label: "Clients", value: 84, suffix: "+" },
    { id: "m3", label: "Campaign Reach", value: 12, suffix: "M+" },
    {
      id: "m4",
      label: "Revenue Generated",
      value: 2.5,
      suffix: "M+",
      prefix: "$",
    },
  ],
  chart: [
    { label: "Q1", value: 42 },
    { label: "Q2", value: 58 },
    { label: "Q3", value: 71 },
    { label: "Q4", value: 88 },
    { label: "Q1+", value: 96 },
  ],
};
