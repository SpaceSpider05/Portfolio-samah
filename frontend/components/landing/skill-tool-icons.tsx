import type { ComponentType, ReactNode } from "react";
import {
  AhrefsIcon,
  CanvaIcon,
  HubSpotIcon,
  MetaIcon,
  SemrushIcon,
  WordPressIcon,
} from "@/components/landing/trust-brand-icons";

type BrandIconProps = {
  className?: string;
};

function IconShell({
  className,
  children,
}: {
  className?: string;
  children: ReactNode;
}) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden
      className={className}
    >
      {children}
    </svg>
  );
}

function GoogleAnalyticsIcon({ className }: BrandIconProps) {
  return (
    <IconShell className={className}>
      <path d="M18.5 3.2h-1.8c-.7 0-1.2.5-1.2 1.2v15.2c0 .7.5 1.2 1.2 1.2h1.8c.7 0 1.2-.5 1.2-1.2V4.4c0-.7-.5-1.2-1.2-1.2ZM12.9 9.5h-1.8c-.7 0-1.2.5-1.2 1.2v8.9c0 .7.5 1.2 1.2 1.2h1.8c.7 0 1.2-.5 1.2-1.2v-8.9c0-.7-.5-1.2-1.2-1.2ZM7.3 14.2H5.5c-.7 0-1.2.5-1.2 1.2v4.2c0 .7.5 1.2 1.2 1.2h1.8c.7 0 1.2-.5 1.2-1.2v-4.2c0-.7-.5-1.2-1.2-1.2Z" />
    </IconShell>
  );
}

function GA4Icon({ className }: BrandIconProps) {
  return (
    <IconShell className={className}>
      <circle cx="6.2" cy="17.2" r="2.4" />
      <path d="M11.2 4.2c-1.4 0-2.5 3.4-2.5 7.6s1.1 7.6 2.5 7.6 2.5-3.4 2.5-7.6-1.1-7.6-2.5-7.6Z" />
      <path d="M17.8 8.4c-1.1 0-2 2.7-2 6s.9 6 2 6 2-2.7 2-6-.9-6-2-6Z" />
    </IconShell>
  );
}

function GoogleAdsIcon({ className }: BrandIconProps) {
  return (
    <IconShell className={className}>
      <path d="M4.2 17.6 10.8 4.8c.5-1 1.7-1.4 2.7-.9.4.2.7.5.9.9l2.2 4.3-3.4 6.6H4.2Zm8.8-1.1 3.5-6.8 3.3 6.5c.5 1-.1 2.3-1.2 2.6-.3.1-.6.1-.9 0l-4.7-2.3Z" />
      <circle cx="6.2" cy="17.8" r="2.4" />
    </IconShell>
  );
}

function NotionIcon({ className }: BrandIconProps) {
  return (
    <IconShell className={className}>
      <path d="M5.2 4.2h11.3l2.3 1.5v14.1l-2.6 1.7H6.8L4.2 19.6V5.8l1-.1Zm1.5 1.8v11.8l1.3.8h8.4l1.4-.9V6.6l-1.2-.6H6.7Zm2.2 2.2h1.5l3.8 9.1h-1.7l-.8-2H8.9l-.7 2H6.7l2.2-9.1Zm1.3 5.4h2.1l-1-2.9-1.1 2.9Z" />
    </IconShell>
  );
}

function MailchimpIcon({ className }: BrandIconProps) {
  return (
    <IconShell className={className}>
      <path d="M19.2 9.1c-.3-2.4-2.1-4.2-4.5-4.5-.4-1.5-1.7-2.6-3.3-2.6S8.5 3.1 8.1 4.6C5.7 4.9 3.9 6.7 3.6 9.1c-1.5.4-2.6 1.7-2.6 3.3 0 1.7 1.2 3.1 2.8 3.4v1.5c0 2.2 1.8 4 4 4h7.2c2.2 0 4-1.8 4-4v-1.5c1.6-.3 2.8-1.7 2.8-3.4 0-1.6-1.1-2.9-2.6-3.3ZM12 4.2c.7 0 1.3.4 1.6 1h-3.2c.3-.6.9-1 1.6-1Zm6.2 11.6c0 1.3-1.1 2.4-2.4 2.4H8.6c-1.3 0-2.4-1.1-2.4-2.4v-1.2h12v1.2Zm1.4-3.4H4.8c-.8 0-1.4-.6-1.4-1.4 0-.7.5-1.2 1.1-1.4l.6-.1.1-.6c.2-1.7 1.6-3 3.3-3h6.4c1.7 0 3.1 1.3 3.3 3l.1.6.6.1c.6.2 1.1.7 1.1 1.4 0 .8-.6 1.4-1.4 1.4Z" />
    </IconShell>
  );
}

function FigmaIcon({ className }: BrandIconProps) {
  return (
    <IconShell className={className}>
      <path d="M8.5 2h3.2v4.8H8.5A2.4 2.4 0 0 1 6.1 4.4 2.4 2.4 0 0 1 8.5 2Zm0 6.4h3.2v4.8H8.5a2.4 2.4 0 1 1 0-4.8Zm0 6.4h3.2V22H8.5A2.4 2.4 0 1 1 8.5 15Zm4.8-12.8H16a2.4 2.4 0 1 1 0 4.8h-2.7V2.2Zm0 6.4H16a2.4 2.4 0 1 1 0 4.8h-2.7V8.6Zm0 6.4a2.4 2.4 0 1 1 4.8 0 2.4 2.4 0 0 1-4.8 0Z" />
    </IconShell>
  );
}

function LookerIcon({ className }: BrandIconProps) {
  return (
    <IconShell className={className}>
      <path d="M12 2a10 10 0 1 0 .001 20.001A10 10 0 0 0 12 2Zm0 3.2a2.2 2.2 0 1 1 0 4.4 2.2 2.2 0 0 1 0-4.4Zm0 5.6a4.6 4.6 0 0 1 4.6 4.5H7.4A4.6 4.6 0 0 1 12 10.8Z" />
    </IconShell>
  );
}

function CapCutIcon({ className }: BrandIconProps) {
  return (
    <IconShell className={className}>
      <path d="M4.2 6.2h15.6v2.2H4.2V6.2Zm0 4.7h15.6v2.2H4.2v-2.2Zm0 4.7h15.6v2.2H4.2v-2.2ZM8 4.5l2.2 2.2L8 8.9 5.8 6.7 8 4.5Zm8 0 2.2 2.2L16 8.9l-2.2-2.2L16 4.5ZM8 15.1l2.2 2.2L8 19.5l-2.2-2.2L8 15.1Zm8 0 2.2 2.2-2.2 2.2-2.2-2.2 2.2-2.2Z" />
    </IconShell>
  );
}

function ChatGPTIcon({ className }: BrandIconProps) {
  return (
    <IconShell className={className}>
      <path d="M13.8 3.4a4.3 4.3 0 0 0-4.4 0L6.2 5.1A4.3 4.3 0 0 0 4.1 8.8v2.4a4.3 4.3 0 0 0 0 1.6v2.4a4.3 4.3 0 0 0 2.1 3.7l3.2 1.7a4.3 4.3 0 0 0 4.4 0l3.2-1.7a4.3 4.3 0 0 0 2.1-3.7v-2.4a4.3 4.3 0 0 0 0-1.6V8.8a4.3 4.3 0 0 0-2.1-3.7l-3.2-1.7Zm-1.6 2.1a2.1 2.1 0 0 1 2.1 0l3.2 1.7c.6.4 1 1 1 1.8v2.2l-5.3 3v3.6l-1.1.6-1.1-.6v-3.6l-5.3-3V9c0-.8.4-1.4 1-1.8l3.2-1.7a2.1 2.1 0 0 1 2.1 0Z" />
    </IconShell>
  );
}

export const SKILL_ICONS = {
  GoogleAnalytics: GoogleAnalyticsIcon,
  GA4: GA4Icon,
  GoogleAds: GoogleAdsIcon,
  Meta: MetaIcon,
  Semrush: SemrushIcon,
  Ahrefs: AhrefsIcon,
  WordPress: WordPressIcon,
  Canva: CanvaIcon,
  Notion: NotionIcon,
  HubSpot: HubSpotIcon,
  Mailchimp: MailchimpIcon,
  Figma: FigmaIcon,
  Looker: LookerIcon,
  CapCut: CapCutIcon,
  ChatGPT: ChatGPTIcon,
} as const;

export type SkillIconKey = keyof typeof SKILL_ICONS;

export function getSkillIcon(
  key: string,
): ComponentType<BrandIconProps> | null {
  return SKILL_ICONS[key as SkillIconKey] ?? null;
}
