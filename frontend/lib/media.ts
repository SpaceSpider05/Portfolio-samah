const API_URL =
  process.env.NEXT_PUBLIC_API_URL?.replace(/\/$/, "") ||
  "http://127.0.0.1:8000";

/** Resolves Laravel `/storage/...` paths for Next.js Image / img tags. */
export function resolveMediaUrl(path: string | null | undefined): string {
  if (!path) {
    return "/images/project-lumen.svg";
  }

  if (path.startsWith("http://") || path.startsWith("https://")) {
    return path;
  }

  if (path.startsWith("/storage/")) {
    return `${API_URL}${path}`;
  }

  return path;
}
