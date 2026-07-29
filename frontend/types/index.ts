export type TimelineItem = {
  id: string;
  year: string;
  title: string;
  description: string;
};

export type Achievement = {
  id: string;
  label: string;
  value: number;
  suffix: string;
};

export type AboutContent = {
  name: string;
  role: string;
  photoUrl: string;
  mission: string;
  bio: string;
  timeline: TimelineItem[];
  achievements: Achievement[];
};

export type Service = {
  id: string;
  slug: string;
  title: string;
  description: string;
  hoverDemo: "seo" | "social" | "ads";
  cta: string;
  isPublished?: boolean;
  sortOrder?: number;
};

export type ProjectGalleryImage = {
  path: string;
  description: string;
};

export type Project = {
  id: string;
  slug: string;
  title: string;
  client: string;
  category: string;
  summary: string;
  challenge: string;
  solution: string;
  results: string[];
  technologies: string[];
  coverImage: string;
  galleryImages?: ProjectGalleryImage[];
  videoPreview?: string | null;
  isPublished?: boolean;
  status?: "draft" | "in_progress" | "completed";
  sortOrder?: number;
  createdAt?: string;
};

export type StatMetric = {
  id: string;
  label: string;
  value: number;
  suffix: string;
  prefix?: string;
};

export type ChartPoint = {
  label: string;
  value: number;
};

export type StatsContent = {
  metrics: StatMetric[];
  chart: ChartPoint[];
};

export type SiteSettings = {
  contactEmail: string;
  contactPhone: string | null;
  bookingNotifyEmail: string;
  mailFromName: string | null;
};

export type AdminAccount = {
  id: number;
  name: string;
  email: string;
  isAdmin: boolean;
  message?: string;
};
