"use client";

import { useCallback, useEffect, useId, useState, type FormEvent } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { AdminCard, AdminPageHeader } from "@/components/admin/admin-ui";
import { AdminLoadingState } from "@/components/admin/admin-loading-state";
import type { Service } from "@/types";
import { cn } from "@/lib/utils";

type ServiceFormState = {
  title: string;
  slug: string;
  description: string;
  hoverDemo: Service["hoverDemo"];
  cta: string;
  isPublished: boolean;
  sortOrder: number;
};

const emptyForm = (): ServiceFormState => ({
  title: "",
  slug: "",
  description: "",
  hoverDemo: "seo",
  cta: "Book this service",
  isPublished: true,
  sortOrder: 0,
});

function slugify(value: string): string {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

const fieldClass =
  "mt-1.5 w-full rounded-xl border border-border bg-tobago-800/60 px-3 py-2.5 text-sm text-fantasy-100 outline-none placeholder:text-muted focus:border-rose-400";

export function AdminServicesManager() {
  const deleteTitleId = useId();
  const [services, setServices] = useState<Service[]>([]);
  const [form, setForm] = useState<ServiceFormState>(emptyForm);
  const [slugTouched, setSlugTouched] = useState(false);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [pendingDelete, setPendingDelete] = useState<Service | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string[]>>({});

  const loadServices = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/admin/services", { cache: "no-store" });
      const payload = (await response.json()) as Service[] | { message?: string };

      if (!response.ok) {
        setError(
          !Array.isArray(payload) && payload.message
            ? payload.message
            : "Could not load services.",
        );
        setServices([]);
        return;
      }

      setServices(Array.isArray(payload) ? payload : []);
    } catch {
      setError("Could not load services.");
      setServices([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadServices();
  }, [loadServices]);

  useEffect(() => {
    if (!pendingDelete) {
      return;
    }

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape" && !deleting) {
        setPendingDelete(null);
      }
    };

    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [pendingDelete, deleting]);

  const updateField = <K extends keyof ServiceFormState>(
    key: K,
    value: ServiceFormState[K],
  ) => {
    setForm((current) => {
      const next = { ...current, [key]: value };
      if (key === "title" && !slugTouched && typeof value === "string") {
        next.slug = slugify(value);
      }
      return next;
    });
  };

  const onSubmit = async (event: FormEvent) => {
    event.preventDefault();
    setSaving(true);
    setError(null);
    setFieldErrors({});

    try {
      const response = await fetch("/api/admin/services", {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title: form.title,
          slug: form.slug,
          description: form.description,
          hoverDemo: form.hoverDemo,
          cta: form.cta,
          isPublished: form.isPublished,
          sortOrder: form.sortOrder,
        }),
      });

      const payload = (await response.json()) as
        | Service
        | { message?: string; errors?: Record<string, string[]> };

      if (!response.ok) {
        if ("errors" in payload && payload.errors) {
          setFieldErrors(payload.errors);
        }
        setError(
          "message" in payload && payload.message
            ? payload.message
            : "Could not create service.",
        );
        return;
      }

      setForm(emptyForm());
      setSlugTouched(false);
      setOpen(false);
      await loadServices();
    } catch {
      setError("Could not create service.");
    } finally {
      setSaving(false);
    }
  };

  const confirmDelete = async () => {
    if (!pendingDelete) {
      return;
    }

    setDeleting(true);
    setError(null);

    try {
      const response = await fetch(`/api/admin/services/${pendingDelete.id}`, {
        method: "DELETE",
      });

      if (!response.ok && response.status !== 204) {
        const payload = (await response.json()) as { message?: string };
        setError(payload.message ?? "Could not delete service.");
        return;
      }

      setPendingDelete(null);
      await loadServices();
    } catch {
      setError("Could not delete service.");
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div>
      <AdminPageHeader
        title="Services"
        description="Service cards displayed on the marketing site and booking page."
        action={
          <button
            type="button"
            onClick={() => {
              setOpen((value) => !value);
              setError(null);
              setFieldErrors({});
            }}
            className="rounded-full bg-rose-400 px-4 py-2 text-sm font-medium text-tobago-900"
          >
            {open ? "Cancel" : "Add service"}
          </button>
        }
      />

      {error ? (
        <p className="mb-4 rounded-2xl border border-rose-400/30 bg-rose-400/10 px-4 py-3 text-sm text-rose-200">
          {error}
        </p>
      ) : null}

      {open ? (
        <AdminCard className="mb-6">
          <form onSubmit={onSubmit} className="grid gap-4 md:grid-cols-2">
            <label className="block">
              <span className="text-xs uppercase tracking-wider text-muted">Title</span>
              <input
                required
                value={form.title}
                onChange={(event) => updateField("title", event.target.value)}
                className={fieldClass}
                placeholder="SEO Strategy"
              />
              {fieldErrors.title?.[0] ? (
                <p className="mt-1 text-xs text-rose-300">{fieldErrors.title[0]}</p>
              ) : null}
            </label>

            <label className="block">
              <span className="text-xs uppercase tracking-wider text-muted">Slug</span>
              <input
                required
                value={form.slug}
                onChange={(event) => {
                  setSlugTouched(true);
                  updateField("slug", slugify(event.target.value));
                }}
                className={fieldClass}
                placeholder="seo-strategy"
              />
              {fieldErrors.slug?.[0] ? (
                <p className="mt-1 text-xs text-rose-300">{fieldErrors.slug[0]}</p>
              ) : null}
            </label>

            <label className="block md:col-span-2">
              <span className="text-xs uppercase tracking-wider text-muted">Description</span>
              <textarea
                required
                rows={3}
                value={form.description}
                onChange={(event) => updateField("description", event.target.value)}
                className={cn(fieldClass, "resize-y")}
                placeholder="What this service delivers…"
              />
              {fieldErrors.description?.[0] ? (
                <p className="mt-1 text-xs text-rose-300">{fieldErrors.description[0]}</p>
              ) : null}
            </label>

            <label className="block">
              <span className="text-xs uppercase tracking-wider text-muted">Hover demo</span>
              <select
                value={form.hoverDemo}
                onChange={(event) =>
                  updateField("hoverDemo", event.target.value as Service["hoverDemo"])
                }
                className={cn(fieldClass, "appearance-none")}
              >
                <option value="seo">SEO</option>
                <option value="social">Social</option>
                <option value="ads">Ads</option>
              </select>
            </label>

            <label className="block">
              <span className="text-xs uppercase tracking-wider text-muted">CTA label</span>
              <input
                required
                value={form.cta}
                onChange={(event) => updateField("cta", event.target.value)}
                className={fieldClass}
                placeholder="Climb the ranks"
              />
            </label>

            <label className="block">
              <span className="text-xs uppercase tracking-wider text-muted">Sort order</span>
              <input
                type="number"
                min={0}
                value={form.sortOrder}
                onChange={(event) =>
                  updateField("sortOrder", Number(event.target.value) || 0)
                }
                className={fieldClass}
              />
            </label>

            <label className="flex items-center gap-3 pt-6">
              <input
                type="checkbox"
                checked={form.isPublished}
                onChange={(event) => updateField("isPublished", event.target.checked)}
                className="size-4 rounded border-border accent-rose-400"
              />
              <span className="text-sm text-fantasy-100">Published on the site</span>
            </label>

            <div className="md:col-span-2">
              <button
                type="submit"
                disabled={saving}
                className="rounded-full bg-rose-400 px-5 py-2.5 text-sm font-medium text-tobago-900 disabled:opacity-60"
              >
                {saving ? "Saving…" : "Create service"}
              </button>
            </div>
          </form>
        </AdminCard>
      ) : null}

      {loading ? (
        <AdminLoadingState label="Loading services…" />
      ) : services.length === 0 ? (
        <AdminCard>
          <p className="font-display text-2xl text-heading">No services yet</p>
          <p className="mt-2 text-sm text-muted">
            Add your first service to show it on the homepage and booking form.
          </p>
        </AdminCard>
      ) : (
        <div className="grid gap-3 md:grid-cols-2">
          {services.map((service) => (
            <AdminCard key={service.id} className="flex flex-col gap-3">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="text-fantasy-100">{service.title}</p>
                  <p className="mt-1 text-xs text-silver-400">/{service.slug}</p>
                </div>
                <span
                  className={cn(
                    "rounded-full px-2.5 py-1 text-[10px] uppercase tracking-wider",
                    service.isPublished
                      ? "bg-rose-400/20 text-rose-200"
                      : "bg-silver-400/15 text-silver-300",
                  )}
                >
                  {service.isPublished ? "Published" : "Draft"}
                </span>
              </div>
              <p className="text-sm text-silver-300">{service.description}</p>
              <div className="mt-auto flex items-center justify-between gap-2 pt-1">
                <p className="text-xs text-muted">
                  {service.hoverDemo} · {service.cta}
                </p>
                <button
                  type="button"
                  onClick={() => setPendingDelete(service)}
                  className="rounded-full border border-rose-400/30 px-3 py-1.5 text-xs text-rose-200"
                >
                  Delete
                </button>
              </div>
            </AdminCard>
          ))}
        </div>
      )}

      <AnimatePresence>
        {pendingDelete ? (
          <motion.div
            className="fixed inset-0 z-[80] flex items-center justify-center p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <button
              type="button"
              aria-label="Close delete dialog"
              className="absolute inset-0 bg-tobago-900/70 backdrop-blur-sm"
              disabled={deleting}
              onClick={() => {
                if (!deleting) {
                  setPendingDelete(null);
                }
              }}
            />
            <motion.div
              role="dialog"
              aria-modal="true"
              aria-labelledby={deleteTitleId}
              initial={{ opacity: 0, y: 16, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 10, scale: 0.98 }}
              transition={{ duration: 0.2 }}
              className="relative z-10 w-full max-w-md rounded-3xl border border-border bg-tobago-800 p-6 shadow-[0_24px_80px_color-mix(in_oklab,var(--tobago-900)_55%,transparent)]"
            >
              <p className="type-overline text-rose-300">Delete service</p>
              <h2 id={deleteTitleId} className="mt-2 font-display text-2xl text-heading">
                Remove “{pendingDelete.title}”?
              </h2>
              <p className="mt-3 text-sm text-muted">
                This removes it from the homepage, booking form, and admin list. This
                can’t be undone.
              </p>
              <div className="mt-6 flex flex-wrap justify-end gap-2">
                <button
                  type="button"
                  disabled={deleting}
                  onClick={() => setPendingDelete(null)}
                  className="rounded-full border border-silver-400/25 px-4 py-2 text-sm text-fantasy-100 disabled:opacity-60"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  disabled={deleting}
                  onClick={() => void confirmDelete()}
                  className="rounded-full bg-rose-400 px-4 py-2 text-sm font-medium text-tobago-900 disabled:opacity-60"
                >
                  {deleting ? "Deleting…" : "Delete service"}
                </button>
              </div>
            </motion.div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </div>
  );
}
