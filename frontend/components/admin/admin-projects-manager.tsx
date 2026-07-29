"use client";

import { useCallback, useEffect, useId, useState, type FormEvent } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { AdminCard, AdminPageHeader } from "@/components/admin/admin-ui";
import { AdminLoadingState } from "@/components/admin/admin-loading-state";
import { ProjectCoverUploader } from "@/components/admin/project-cover-uploader";
import { ProjectGalleryUploader } from "@/components/admin/project-gallery-uploader";
import type { Project, ProjectGalleryImage } from "@/types";
import { cn } from "@/lib/utils";

type ProjectFormState = {
  title: string;
  slug: string;
  client: string;
  category: string;
  summary: string;
  challenge: string;
  solution: string;
  resultsText: string;
  technologiesText: string;
  coverImage: string;
  galleryImages: ProjectGalleryImage[];
  videoPreview: string;
  status: NonNullable<Project["status"]>;
  isPublished: boolean;
  sortOrder: number;
};

const emptyForm = (): ProjectFormState => ({
  title: "",
  slug: "",
  client: "",
  category: "",
  summary: "",
  challenge: "",
  solution: "",
  resultsText: "",
  technologiesText: "",
  coverImage: "",
  galleryImages: [],
  videoPreview: "",
  status: "completed",
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

function linesToList(value: string): string[] {
  return value
    .split(/\n|,/)
    .map((item) => item.trim())
    .filter(Boolean);
}

function toStoragePath(path: string): string {
  const storageIndex = path.indexOf("/storage/");
  return storageIndex >= 0 ? path.slice(storageIndex) : path;
}

function normalizeGalleryImages(
  images: Project["galleryImages"] | undefined,
): ProjectGalleryImage[] {
  return (images ?? []).map((item) => ({
    path: toStoragePath(item.path),
    description: item.description ?? "",
  }));
}

function projectToForm(project: Project): ProjectFormState {
  return {
    title: project.title,
    slug: project.slug,
    client: project.client,
    category: project.category,
    summary: project.summary,
    challenge: project.challenge,
    solution: project.solution,
    resultsText: project.results.join("\n"),
    technologiesText: project.technologies.join(", "),
    coverImage: toStoragePath(project.coverImage ?? ""),
    galleryImages: normalizeGalleryImages(project.galleryImages),
    videoPreview: project.videoPreview ?? "",
    status: project.status ?? "completed",
    isPublished: project.isPublished ?? true,
    sortOrder: project.sortOrder ?? 0,
  };
}

const fieldClass =
  "mt-1.5 w-full rounded-xl border border-border bg-tobago-800/60 px-3 py-2.5 text-sm text-fantasy-100 outline-none placeholder:text-muted focus:border-rose-400";

export function AdminProjectsManager() {
  const deleteTitleId = useId();
  const [projects, setProjects] = useState<Project[]>([]);
  const [form, setForm] = useState<ProjectFormState>(emptyForm);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [slugTouched, setSlugTouched] = useState(false);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [pendingDelete, setPendingDelete] = useState<Project | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string[]>>({});

  const loadProjects = useCallback(async (opts?: { silent?: boolean }) => {
    if (!opts?.silent) {
      setLoading(true);
    }
    setError(null);

    try {
      const response = await fetch("/api/admin/projects", { cache: "no-store" });
      const payload = (await response.json()) as Project[] | { message?: string };

      if (!response.ok) {
        setError(
          !Array.isArray(payload) && payload.message
            ? payload.message
            : "Could not load projects.",
        );
        setProjects([]);
        return;
      }

      setProjects(Array.isArray(payload) ? payload : []);
    } catch {
      setError("Could not load projects.");
      setProjects([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadProjects();
  }, [loadProjects]);

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

  const updateField = <K extends keyof ProjectFormState>(
    key: K,
    value: ProjectFormState[K],
  ) => {
    setForm((current) => {
      const next = { ...current, [key]: value };
      if (key === "title" && !slugTouched && typeof value === "string") {
        next.slug = slugify(value);
      }
      return next;
    });
  };

  const openCreate = () => {
    setEditingId(null);
    setForm(emptyForm());
    setSlugTouched(false);
    setFieldErrors({});
    setError(null);
    setOpen(true);
  };

  const openEdit = (project: Project) => {
    setEditingId(project.id);
    setForm(projectToForm(project));
    setSlugTouched(true);
    setFieldErrors({});
    setError(null);
    setOpen(true);
  };

  const closeForm = () => {
    setOpen(false);
    setEditingId(null);
    setForm(emptyForm());
    setSlugTouched(false);
    setFieldErrors({});
  };

  const payloadFromForm = () => ({
    title: form.title,
    slug: form.slug,
    client: form.client,
    category: form.category,
    summary: form.summary,
    challenge: form.challenge,
    solution: form.solution,
    results: linesToList(form.resultsText),
    technologies: linesToList(form.technologiesText),
    coverImage: form.coverImage,
    galleryImages: form.galleryImages.map((item) => ({
      path: item.path,
      description: item.description.trim(),
    })),
    videoPreview: form.videoPreview || null,
    status: form.status,
    isPublished: form.isPublished,
    sortOrder: form.sortOrder,
  });

  const onSubmit = async (event: FormEvent) => {
    event.preventDefault();
    setSaving(true);
    setError(null);
    setFieldErrors({});

    if (!form.coverImage.trim()) {
      setFieldErrors({ coverImage: ["Please upload a cover photo."] });
      setSaving(false);
      return;
    }

    const body = payloadFromForm();
    const url = editingId ? `/api/admin/projects/${editingId}` : "/api/admin/projects";
    const method = editingId ? "PUT" : "POST";

    try {
      const response = await fetch(url, {
        method,
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
      });

      const payload = (await response.json()) as
        | Project
        | { message?: string; errors?: Record<string, string[]> };

      if (!response.ok) {
        if ("errors" in payload && payload.errors) {
          setFieldErrors(payload.errors);
        }
        setError(
          "message" in payload && payload.message
            ? payload.message
            : "Could not save project.",
        );
        return;
      }

      closeForm();
      await loadProjects({ silent: true });
    } catch {
      setError("Could not save project.");
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
      const response = await fetch(`/api/admin/projects/${pendingDelete.id}`, {
        method: "DELETE",
      });

      if (!response.ok && response.status !== 204) {
        const payload = (await response.json()) as { message?: string };
        setError(payload.message ?? "Could not delete project.");
        return;
      }

      setPendingDelete(null);
      await loadProjects({ silent: true });
    } catch {
      setError("Could not delete project.");
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div>
      <AdminPageHeader
        title="Projects"
        description="Case studies shown on the public portfolio pages."
        action={
          <button
            type="button"
            onClick={() => {
              if (open) {
                closeForm();
              } else {
                openCreate();
              }
            }}
            className="rounded-full bg-rose-400 px-4 py-2 text-sm font-medium text-tobago-900"
          >
            {open ? "Cancel" : "Add project"}
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
          <p className="mb-4 font-display text-2xl text-heading">
            {editingId ? "Edit project" : "New project"}
          </p>
          <form onSubmit={onSubmit} className="grid gap-4 md:grid-cols-2">
            <label className="block">
              <span className="text-xs uppercase tracking-wider text-muted">Title</span>
              <input
                required
                value={form.title}
                onChange={(event) => updateField("title", event.target.value)}
                className={fieldClass}
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
              />
              {fieldErrors.slug?.[0] ? (
                <p className="mt-1 text-xs text-rose-300">{fieldErrors.slug[0]}</p>
              ) : null}
            </label>

            <label className="block">
              <span className="text-xs uppercase tracking-wider text-muted">Client</span>
              <input
                required
                value={form.client}
                onChange={(event) => updateField("client", event.target.value)}
                className={fieldClass}
              />
            </label>

            <label className="block">
              <span className="text-xs uppercase tracking-wider text-muted">Category</span>
              <input
                required
                value={form.category}
                onChange={(event) => updateField("category", event.target.value)}
                className={fieldClass}
                placeholder="Brand + Performance"
              />
            </label>

            <label className="block md:col-span-2">
              <span className="text-xs uppercase tracking-wider text-muted">Summary</span>
              <textarea
                required
                rows={2}
                value={form.summary}
                onChange={(event) => updateField("summary", event.target.value)}
                className={cn(fieldClass, "resize-y")}
              />
            </label>

            <label className="block">
              <span className="text-xs uppercase tracking-wider text-muted">Challenge</span>
              <textarea
                required
                rows={3}
                value={form.challenge}
                onChange={(event) => updateField("challenge", event.target.value)}
                className={cn(fieldClass, "resize-y")}
              />
            </label>

            <label className="block">
              <span className="text-xs uppercase tracking-wider text-muted">Solution</span>
              <textarea
                required
                rows={3}
                value={form.solution}
                onChange={(event) => updateField("solution", event.target.value)}
                className={cn(fieldClass, "resize-y")}
              />
            </label>

            <label className="block">
              <span className="text-xs uppercase tracking-wider text-muted">
                Results (one per line)
              </span>
              <textarea
                required
                rows={3}
                value={form.resultsText}
                onChange={(event) => updateField("resultsText", event.target.value)}
                className={cn(fieldClass, "resize-y")}
                placeholder={"+186% organic traffic\n3.2x ROAS"}
              />
            </label>

            <label className="block">
              <span className="text-xs uppercase tracking-wider text-muted">
                Technologies (comma or line separated)
              </span>
              <textarea
                required
                rows={3}
                value={form.technologiesText}
                onChange={(event) => updateField("technologiesText", event.target.value)}
                className={cn(fieldClass, "resize-y")}
                placeholder="Next.js, GA4, Meta Ads"
              />
            </label>

            <ProjectCoverUploader
              value={form.coverImage}
              onChange={(value) => updateField("coverImage", value)}
              error={fieldErrors.coverImage?.[0]}
            />

            <ProjectGalleryUploader
              value={form.galleryImages}
              onChange={(value) => updateField("galleryImages", value)}
              error={fieldErrors.galleryImages?.[0]}
            />

            <label className="block md:col-span-2">
              <span className="text-xs uppercase tracking-wider text-muted">
                Video preview URL (optional)
              </span>
              <input
                value={form.videoPreview}
                onChange={(event) => updateField("videoPreview", event.target.value)}
                className={fieldClass}
              />
            </label>

            <label className="block">
              <span className="text-xs uppercase tracking-wider text-muted">
                Project status
              </span>
              <select
                value={form.status}
                onChange={(event) =>
                  updateField(
                    "status",
                    event.target.value as ProjectFormState["status"],
                  )
                }
                className={cn(fieldClass, "appearance-none")}
              >
                <option value="completed">Completed (counts in Results)</option>
                <option value="in_progress">In progress</option>
                <option value="draft">Draft</option>
              </select>
              <p className="mt-1.5 text-xs text-muted">
                Only completed projects count toward Projects and Clients stats.
              </p>
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

            <label className="flex items-center gap-3 md:col-span-2">
              <input
                type="checkbox"
                checked={form.isPublished}
                onChange={(event) => updateField("isPublished", event.target.checked)}
                className="size-4 rounded border-border accent-rose-400"
              />
              <span className="text-sm text-fantasy-100">
                Show on the public portfolio (independent of status)
              </span>
            </label>

            <div className="md:col-span-2">
              <button
                type="submit"
                disabled={saving}
                className="rounded-full bg-rose-400 px-5 py-2.5 text-sm font-medium text-tobago-900 disabled:opacity-60"
              >
                {saving ? "Saving…" : editingId ? "Update project" : "Create project"}
              </button>
            </div>
          </form>
        </AdminCard>
      ) : null}

      {loading && projects.length === 0 ? (
        <AdminLoadingState label="Loading projects…" />
      ) : projects.length === 0 ? (
        <AdminCard>
          <p className="font-display text-2xl text-heading">No projects yet</p>
          <p className="mt-2 text-sm text-muted">
            Create a case study to show it on `/portfolio`.
          </p>
        </AdminCard>
      ) : (
        <div className="space-y-3">
          {projects.map((project) => (
            <AdminCard
              key={project.id}
              className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between"
            >
              <div>
                <div className="flex flex-wrap items-center gap-2">
                  <p className="text-fantasy-100">{project.title}</p>
                  <span
                    className={cn(
                      "rounded-full px-2.5 py-1 text-[10px] uppercase tracking-wider",
                      project.status === "completed"
                        ? "bg-rose-400/20 text-rose-200"
                        : project.status === "in_progress"
                          ? "bg-vanilla-200/20 text-vanilla-200"
                          : "bg-silver-400/15 text-silver-300",
                    )}
                  >
                    {project.status === "completed"
                      ? "Completed"
                      : project.status === "in_progress"
                        ? "In progress"
                        : "Draft"}
                  </span>
                  {!project.isPublished ? (
                    <span className="rounded-full bg-silver-400/15 px-2.5 py-1 text-[10px] uppercase tracking-wider text-silver-300">
                      Hidden
                    </span>
                  ) : null}
                </div>
                <p className="mt-1 text-xs text-silver-400">
                  {project.client} · {project.category} · /{project.slug}
                </p>
              </div>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => openEdit(project)}
                  className="rounded-full border border-silver-400/25 px-3 py-1.5 text-xs text-fantasy-100"
                >
                  Edit
                </button>
                <button
                  type="button"
                  onClick={() => setPendingDelete(project)}
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
              <p className="type-overline text-rose-300">Delete project</p>
              <h2 id={deleteTitleId} className="mt-2 font-display text-2xl text-heading">
                Remove “{pendingDelete.title}”?
              </h2>
              <p className="mt-3 text-sm text-muted">
                This removes it from the portfolio pages and homepage. This can’t be undone.
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
                  {deleting ? "Deleting…" : "Delete project"}
                </button>
              </div>
            </motion.div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </div>
  );
}
