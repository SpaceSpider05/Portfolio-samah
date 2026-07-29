import Image from "next/image";
import { resolveMediaUrl } from "@/lib/media";
import { cn } from "@/lib/utils";

type ProjectCoverImageProps = {
  src: string;
  alt: string;
  className?: string;
  priority?: boolean;
  sizes?: string;
};

export function ProjectCoverImage({
  src,
  alt,
  className,
  priority = false,
  sizes = "(max-width: 768px) 100vw, 50vw",
}: ProjectCoverImageProps) {
  const resolved = resolveMediaUrl(src);

  return (
    <Image
      src={resolved}
      alt={alt}
      fill
      priority={priority}
      className={cn("object-cover", className)}
      sizes={sizes}
      unoptimized={resolved.startsWith("http://127.0.0.1") || resolved.startsWith("http://localhost")}
    />
  );
}
