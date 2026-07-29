"use client";

import { useRef, useState, type ChangeEvent } from "react";
import { ImagePlus, LoaderCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import { resolveMediaUrl } from "@/lib/media";

type ProjectCoverUploaderProps = {
  value: string;
  onChange: (value: string) => void;
  error?: string;
  label?: string;
  folder?: "projects" | "services" | "about" | "general";
  helpText?: string;
};

export function ProjectCoverUploader({
  value,
  onChange,
  error,
  label = "Cover photo",
  folder = "projects",
  helpText = "Upload a JPG, PNG, or WebP (max 5MB). This image appears on the portfolio grid and the project detail page.",
}: ProjectCoverUploaderProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);

  const onFileChange = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) {
      return;
    }

    setUploading(true);
    setUploadError(null);

    try {
      const body = new FormData();
      body.append("file", file);
      body.append("folder", folder);

      const response = await fetch("/api/admin/media", {
        method: "POST",
        body,
      });

      const payload = (await response.json()) as {
        coverImage?: string;
        message?: string;
      };

      if (!response.ok || !payload.coverImage) {
        setUploadError(payload.message ?? "Upload failed. Try another image.");
        return;
      }

      onChange(payload.coverImage);
    } catch {
      setUploadError("Upload failed. Is Laravel running?");
    } finally {
      setUploading(false);
      if (inputRef.current) {
        inputRef.current.value = "";
      }
    }
  };

  return (
    <div className="md:col-span-2">
      <span className="text-xs uppercase tracking-wider text-muted">{label}</span>

      <div className="mt-1.5 grid gap-4 md:grid-cols-[220px_1fr]">
        <button
          type="button"
          disabled={uploading}
          onClick={() => inputRef.current?.click()}
          className={cn(
            "relative flex aspect-[4/5] items-center justify-center overflow-hidden rounded-2xl border border-dashed border-silver-400/30 bg-tobago-900/40 transition hover:border-rose-400/50",
            uploading && "opacity-70",
          )}
        >
          {value ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={resolveMediaUrl(value)}
              alt="Upload preview"
              className="absolute inset-0 h-full w-full object-cover"
            />
          ) : (
            <div className="flex flex-col items-center gap-2 px-4 text-center text-muted">
              <ImagePlus className="h-6 w-6 text-rose-300" />
              <span className="text-xs">Upload photo</span>
            </div>
          )}

          {uploading ? (
            <div className="absolute inset-0 flex items-center justify-center bg-tobago-900/60">
              <LoaderCircle className="h-6 w-6 animate-spin text-rose-300" />
            </div>
          ) : null}
        </button>

        <div className="flex flex-col justify-center gap-3">
          <p className="text-sm text-muted">{helpText}</p>
          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              disabled={uploading}
              onClick={() => inputRef.current?.click()}
              className="rounded-full bg-rose-400 px-4 py-2 text-sm font-medium text-tobago-900 disabled:opacity-60"
            >
              {uploading ? "Uploading…" : value ? "Replace photo" : "Choose photo"}
            </button>
            {value ? (
              <button
                type="button"
                disabled={uploading}
                onClick={() => onChange("")}
                className="rounded-full border border-silver-400/25 px-4 py-2 text-sm text-fantasy-100 disabled:opacity-60"
              >
                Remove
              </button>
            ) : null}
          </div>
          {(uploadError || error) && (
            <p className="text-xs text-rose-300">{uploadError ?? error}</p>
          )}
        </div>
      </div>

      <input
        ref={inputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp,image/gif"
        className="hidden"
        onChange={onFileChange}
      />
    </div>
  );
}
