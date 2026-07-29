"use client";

import { useRef, useState, type ChangeEvent } from "react";
import { ImagePlus, LoaderCircle, Trash2, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { resolveMediaUrl } from "@/lib/media";
import type { ProjectGalleryImage } from "@/types";

type ProjectGalleryUploaderProps = {
  value: ProjectGalleryImage[];
  onChange: (value: ProjectGalleryImage[]) => void;
  error?: string;
};

function toStoragePath(path: string): string {
  const storageIndex = path.indexOf("/storage/");
  return storageIndex >= 0 ? path.slice(storageIndex) : path;
}

export function ProjectGalleryUploader({
  value,
  onChange,
  error,
}: ProjectGalleryUploaderProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);

  const onFileChange = async (event: ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files ?? []);
    if (files.length === 0) {
      return;
    }

    setUploading(true);
    setUploadError(null);

    const uploaded: ProjectGalleryImage[] = [];

    try {
      for (const file of files) {
        const body = new FormData();
        body.append("file", file);
        body.append("folder", "projects");

        const response = await fetch("/api/admin/media", {
          method: "POST",
          body,
        });

        const payload = (await response.json()) as {
          coverImage?: string;
          message?: string;
        };

        if (!response.ok || !payload.coverImage) {
          setUploadError(payload.message ?? "One or more uploads failed.");
          break;
        }

        uploaded.push({
          path: toStoragePath(payload.coverImage),
          description: "",
        });
      }

      if (uploaded.length > 0) {
        onChange([...value, ...uploaded].slice(0, 24));
      }
    } catch {
      setUploadError("Upload failed. Is Laravel running?");
    } finally {
      setUploading(false);
      if (inputRef.current) {
        inputRef.current.value = "";
      }
    }
  };

  const removeAt = (index: number) => {
    onChange(value.filter((_, i) => i !== index));
  };

  const updateDescription = (index: number, description: string) => {
    onChange(
      value.map((item, i) => (i === index ? { ...item, description } : item)),
    );
  };

  return (
    <div className="md:col-span-2">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <span className="text-xs uppercase tracking-wider text-muted">
            Project gallery
          </span>
          <p className="mt-1 text-sm text-muted">
            Extra screenshots with optional captions shown on the project page.
            Cover stays separate as the hero image.
          </p>
        </div>
        <button
          type="button"
          disabled={uploading || value.length >= 24}
          onClick={() => inputRef.current?.click()}
          className="inline-flex items-center gap-2 rounded-full bg-rose-400 px-4 py-2 text-sm font-medium text-tobago-900 disabled:opacity-60"
        >
          {uploading ? (
            <LoaderCircle className="h-4 w-4 animate-spin" />
          ) : (
            <ImagePlus className="h-4 w-4" />
          )}
          {uploading ? "Uploading…" : "Add photos"}
        </button>
      </div>

      {value.length === 0 ? (
        <button
          type="button"
          disabled={uploading}
          onClick={() => inputRef.current?.click()}
          className={cn(
            "mt-3 flex w-full flex-col items-center justify-center gap-2 rounded-2xl border border-dashed border-silver-400/30 bg-tobago-900/40 px-4 py-10 text-muted transition hover:border-rose-400/50",
            uploading && "opacity-70",
          )}
        >
          <ImagePlus className="h-6 w-6 text-rose-300" />
          <span className="text-sm">Upload gallery screenshots</span>
          <span className="text-xs">JPG, PNG, or WebP · up to 24 images</span>
        </button>
      ) : (
        <ul className="mt-3 space-y-3">
          {value.map((item, index) => (
            <li
              key={`${item.path}-${index}`}
              className="grid gap-3 rounded-2xl border border-border bg-tobago-900/40 p-3 sm:grid-cols-[140px_1fr_auto]"
            >
              <div className="relative aspect-4/3 overflow-hidden rounded-xl border border-border/60">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={resolveMediaUrl(item.path)}
                  alt={item.description || `Gallery ${index + 1}`}
                  className="h-full w-full object-cover"
                />
                <span className="absolute bottom-2 left-2 rounded-full bg-tobago-900/70 px-2 py-0.5 text-[10px] uppercase tracking-wider text-fantasy-100">
                  {index + 1}
                </span>
              </div>

              <label className="block text-sm">
                <span className="text-xs uppercase tracking-wider text-muted">
                  Image description
                </span>
                <textarea
                  rows={3}
                  value={item.description}
                  onChange={(event) =>
                    updateDescription(index, event.target.value)
                  }
                  placeholder="What does this screenshot show?"
                  className="mt-1.5 w-full resize-y rounded-xl border border-border bg-tobago-800/60 px-3 py-2.5 text-sm text-fantasy-100 outline-none placeholder:text-muted focus:border-rose-400"
                />
              </label>

              <button
                type="button"
                aria-label={`Remove gallery image ${index + 1}`}
                onClick={() => removeAt(index)}
                className="inline-flex h-10 w-10 items-center justify-center self-start rounded-xl border border-border text-rose-300 transition hover:bg-rose-400/10 sm:mt-6"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </li>
          ))}
        </ul>
      )}

      {(uploadError || error) && (
        <p className="mt-2 text-xs text-rose-300">{uploadError ?? error}</p>
      )}

      {value.length > 0 ? (
        <button
          type="button"
          disabled={uploading}
          onClick={() => onChange([])}
          className="mt-3 inline-flex items-center gap-1.5 text-xs text-muted transition hover:text-rose-300"
        >
          <X className="h-3.5 w-3.5" />
          Clear gallery
        </button>
      ) : null}

      <input
        ref={inputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp,image/gif"
        multiple
        className="hidden"
        onChange={onFileChange}
      />
    </div>
  );
}
