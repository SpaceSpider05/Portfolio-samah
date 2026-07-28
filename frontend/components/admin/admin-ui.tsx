import type { ReactNode } from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";

type AdminPageHeaderProps = {
  title: string;
  description?: string;
  action?: ReactNode;
};

export function AdminPageHeader({ title, description, action }: AdminPageHeaderProps) {
  return (
    <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
      <div>
        <h1 className="font-display text-3xl text-heading md:text-4xl">{title}</h1>
        {description ? <p className="mt-2 max-w-2xl text-sm text-muted">{description}</p> : null}
      </div>
      {action}
    </div>
  );
}

type AdminCardProps = {
  children: ReactNode;
  className?: string;
};

export function AdminCard({ children, className }: AdminCardProps) {
  return (
    <div
      className={cn(
        "rounded-2xl border border-border bg-card p-5 shadow-[0_12px_40px_color-mix(in_oklab,var(--tobago-900)_12%,transparent)]",
        className,
      )}
    >
      {children}
    </div>
  );
}

type EmptyStateProps = {
  title: string;
  description: string;
  href?: string;
  cta?: string;
};

export function AdminEmptyState({ title, description, href, cta }: EmptyStateProps) {
  return (
    <AdminCard className="flex flex-col items-start gap-3">
      <p className="font-display text-2xl text-heading">{title}</p>
      <p className="max-w-xl text-sm text-muted">{description}</p>
      {href && cta ? (
        <Link
          href={href}
          className="mt-2 rounded-full bg-rose-400 px-4 py-2 text-sm font-medium text-tobago-900"
        >
          {cta}
        </Link>
      ) : null}
    </AdminCard>
  );
}
