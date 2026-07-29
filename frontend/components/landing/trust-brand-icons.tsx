import type { ReactNode } from "react";

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

export function ShopifyIcon({ className }: BrandIconProps) {
  return (
    <IconShell className={className}>
      <path d="M16.5 5.2c-.1-.7-.5-1-1-1-.3 0-.7.1-1.1.3-.1-.7-.4-1.4-.9-1.9C12.8 1.8 11.8 1.5 10.8 1.8c-.8.2-1.4.8-1.8 1.5-.7-.2-1.3.1-1.5.7L5.3 14.8c-.1.4.1.8.5.9l2.1.5 1.1 3.4c.1.4.5.6.9.5l2.2-.6 1.8.4c.4.1.8-.2.9-.6l3.5-13.4c.1-.3 0-.6-.3-.7Zm-5.7-1.5c.5-.1 1 0 1.3.4.3.3.4.8.5 1.3-1.1.3-2.1.7-2.9 1 .2-.9.6-1.6 1.1-1.7Zm1.1 4.4c.6-.1 1.1-.3 1.7-.5l-.5 1.9c-.5.1-1 .3-1.5.4l.3-1.8Zm-.8 3.1c.5-.1 1-.3 1.5-.4l-.5 1.9c-.5.1-1 .3-1.5.4l.5-1.9Zm4.3-4.8.5-1.8c.4-.1.7-.1.9 0 .2.1.3.3.3.6l-.4 1.5c-.4-.1-.8-.2-1.3-.3Z" />
    </IconShell>
  );
}

export function WordPressIcon({ className }: BrandIconProps) {
  return (
    <IconShell className={className}>
      <path d="M12 2a10 10 0 1 0 .001 20.001A10 10 0 0 0 12 2Zm-1.1 16.5c-2.8-.4-5-2.4-5.7-5l3.6 9.9c1.2.5 2.4.7 3.6.7l-1.5-5.6Zm7.5-1.6c0 .3 0 .5-.1.8l-2.8 8.2A8.5 8.5 0 0 0 20 12c0-1.1-.2-2.1-.6-3.1l-1 2.9Zm-3.1-8.7c.5 0 1 .1 1 .5 0 .2-.1.5-.2.8l-3.3 9.8-1.2-4.1.7-2c.2-.5.3-.9.3-1.2 0-.4-.2-.6-.5-.6-.4 0-.8.3-1.2.3-.9 0-1.5-.6-1.5-1.4 0-.9.8-1.7 2-1.7.7 0 1.3.2 1.9.6Zm-7.8.9c0-.3.2-.5.5-.5.2 0 .3.1.5.2l4.8 14.3c-1.1.1-2.2 0-3.3-.3L4.7 11c-.3-.8-.5-1.6-.5-2.4 0-.8.3-1.5.8-1.5Z" />
    </IconShell>
  );
}

export function MetaIcon({ className }: BrandIconProps) {
  return (
    <IconShell className={className}>
      <path d="M12.1 7.2c-1.1-1.5-2.5-2.3-4-2.3-2.8 0-5 2.9-5 6.6 0 2.6 1.2 4.5 3.1 4.5 1.1 0 2-.6 2.9-1.8l.4-.6.4.6c.9 1.2 1.8 1.8 2.9 1.8 1.9 0 3.1-1.9 3.1-4.5 0-3.7-2.2-6.6-5-6.6-1.4 0-2.7.8-3.8 2.3Zm-3.4 7.5c-.7 1-1.3 1.4-1.9 1.4-.9 0-1.5-1.1-1.5-2.9 0-2.6 1.4-4.8 3.1-4.8.7 0 1.4.4 2.1 1.2l-1.8 5.1Zm5.2 0-1.8-5.1c.7-.8 1.4-1.2 2.1-1.2 1.7 0 3.1 2.2 3.1 4.8 0 1.8-.6 2.9-1.5 2.9-.6 0-1.2-.4-1.9-1.4Z" />
    </IconShell>
  );
}

export function GoogleIcon({ className }: BrandIconProps) {
  return (
    <IconShell className={className}>
      <path d="M21.6 12.3c0-.7-.1-1.4-.2-2H12v3.8h5.4a4.6 4.6 0 0 1-2 3v2.5h3.2c1.9-1.7 3-4.3 3-7.3Z" />
      <path d="M12 22c2.7 0 5-0.9 6.6-2.4l-3.2-2.5c-.9.6-2 1-3.4 1-2.6 0-4.8-1.8-5.6-4.1H3.1v2.6A10 10 0 0 0 12 22Z" />
      <path d="M6.4 13.9A6 6 0 0 1 6 12c0-.7.1-1.3.3-1.9V7.5H3.1A10 10 0 0 0 2 12c0 1.6.4 3.1 1.1 4.5l3.3-2.6Z" />
      <path d="M12 5.9c1.5 0 2.8.5 3.8 1.5l2.8-2.8A9.7 9.7 0 0 0 12 2 10 10 0 0 0 3.1 7.5l3.3 2.6C7.2 7.7 9.4 5.9 12 5.9Z" />
    </IconShell>
  );
}

export function HubSpotIcon({ className }: BrandIconProps) {
  return (
    <IconShell className={className}>
      <path d="M18.1 9.2V7.1a2.1 2.1 0 1 0-1.5 0v2.1a4.1 4.1 0 0 0-2.4 1.5l-3.2-2.5V4.6a2.4 2.4 0 1 0-1.5 0v3.7L6.2 11a4.1 4.1 0 1 0 .9 1.3l3.1-2.4 3.2 2.5a4.1 4.1 0 1 0 4.7-3.2Z" />
    </IconShell>
  );
}

export function CanvaIcon({ className }: BrandIconProps) {
  return (
    <IconShell className={className}>
      <path d="M12 2C7.2 2 3.4 5.5 3.4 10.3c0 4.4 3.1 7.8 6.8 7.8 1.5 0 2.6-.6 3.2-1.6.2.9.9 1.5 2 1.5 2.3 0 3.9-2.3 3.9-5.4C19.3 7.2 16.3 2 12 2Zm1.5 12.4c-.4.7-1.1 1.1-1.9 1.1-1.8 0-3.1-1.8-3.1-4.2 0-3.1 1.8-5.5 4.1-5.5 1 0 1.8.4 2.2 1.2l-.9 3.5c-.3 1.2-.4 1.8-.4 2.3 0 .7.2 1.2.5 1.6h-.5Z" />
    </IconShell>
  );
}

export function SemrushIcon({ className }: BrandIconProps) {
  return (
    <IconShell className={className}>
      <path d="M4 17.5 8.2 7h3.1l2.1 5.4L15.4 7H18l-4.3 10.5h-3.1L8.6 12l-1.9 5.5H4Zm12.6 0V14h3.5c1.5 0 2.4.7 2.4 1.8 0 1.1-.9 1.7-2.3 1.7H16.6Zm0-5.2V9.2h3.1c1.3 0 2.1.6 2.1 1.6s-.9 1.5-2.2 1.5h-3Z" />
    </IconShell>
  );
}

export function AhrefsIcon({ className }: BrandIconProps) {
  return (
    <IconShell className={className}>
      <path d="M4.2 18 9.4 5.2h3.3L18 18h-3.1l-1-2.8H8.3L7.3 18H4.2Zm4.9-5.2h4L11.1 8.4 9.1 12.8ZM18.8 18l1.4-3.6h2.1L21 18h-2.2Z" />
    </IconShell>
  );
}

export const TRUST_BRAND_ICONS = {
  Shopify: ShopifyIcon,
  WordPress: WordPressIcon,
  Meta: MetaIcon,
  Google: GoogleIcon,
  HubSpot: HubSpotIcon,
  Canva: CanvaIcon,
  Semrush: SemrushIcon,
  Ahrefs: AhrefsIcon,
} as const;
