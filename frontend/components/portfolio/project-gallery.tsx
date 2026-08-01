"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { ProjectCoverImage } from "@/components/portfolio/project-cover-image";
import { resolveMediaUrl } from "@/lib/media";
import { cn } from "@/lib/utils";
import type { ProjectGalleryImage } from "@/types";

type ProjectGalleryProps = {
  images: ProjectGalleryImage[];
  title: string;
};

export function ProjectGallery({ images, title }: ProjectGalleryProps) {
  const [active, setActive] = useState<number | null>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (active === null) {
      return;
    }

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setActive(null);
      }
      if (event.key === "ArrowRight") {
        setActive((current) =>
          current === null ? 0 : (current + 1) % images.length,
        );
      }
      if (event.key === "ArrowLeft") {
        setActive((current) =>
          current === null
            ? 0
            : (current - 1 + images.length) % images.length,
        );
      }
    };

    document.documentElement.classList.add("modal-open");
    document.body.classList.add("modal-open");
    document.addEventListener("keydown", onKeyDown);

    return () => {
      document.documentElement.classList.remove("modal-open");
      document.body.classList.remove("modal-open");
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [active, images.length]);

  if (images.length === 0) {
    return null;
  }

  const [featured, ...rest] = images;
  const activeImage = active !== null ? images[active] : null;

  const lightbox =
    mounted && active !== null && activeImage
      ? createPortal(
          <div
            className="fixed inset-0 z-[200] flex items-center justify-center bg-tobago-900/92 p-4 backdrop-blur-md"
            role="dialog"
            aria-modal="true"
            aria-label={`${title} gallery`}
          >
            <button
              type="button"
              aria-label="Close gallery"
              className="absolute inset-0 cursor-default"
              onClick={() => setActive(null)}
            />
            <div
              className="relative z-10 flex w-full max-w-5xl flex-col"
              onClick={(event) => event.stopPropagation()}
              onKeyDown={(event) => event.stopPropagation()}
            >
              <div className="relative flex max-h-[72svh] min-h-[40svh] items-center justify-center overflow-hidden rounded-3xl border border-silver-400/20 bg-tobago-800">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={resolveMediaUrl(activeImage.path)}
                  alt={
                    activeImage.description || `${title} gallery ${active + 1}`
                  }
                  className="max-h-[72svh] w-full object-contain"
                />
              </div>
              <div className="mt-4 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
                <div className="max-w-2xl">
                  <p className="type-caption text-vanilla-200/80">
                    {active + 1} / {images.length}
                  </p>
                  {activeImage.description ? (
                    <p className="mt-2 text-base text-fantasy-100">
                      {activeImage.description}
                    </p>
                  ) : null}
                </div>
                <div className="flex gap-2">
                  <button
                    type="button"
                    className="rounded-full border border-silver-400/25 px-4 py-2 text-sm text-fantasy-100 transition hover:border-rose-400/40"
                    onClick={() =>
                      setActive((current) =>
                        current === null
                          ? 0
                          : (current - 1 + images.length) % images.length,
                      )
                    }
                  >
                    Prev
                  </button>
                  <button
                    type="button"
                    className="rounded-full border border-silver-400/25 px-4 py-2 text-sm text-fantasy-100 transition hover:border-rose-400/40"
                    onClick={() =>
                      setActive((current) =>
                        current === null ? 0 : (current + 1) % images.length,
                      )
                    }
                  >
                    Next
                  </button>
                  <button
                    type="button"
                    className="rounded-full bg-rose-400 px-4 py-2 text-sm font-medium text-tobago-900"
                    onClick={() => setActive(null)}
                  >
                    Close
                  </button>
                </div>
              </div>
            </div>
          </div>,
          document.body,
        )
      : null;

  return (
    <section className="section-pad">
      <div className="mx-auto max-w-6xl">
        <div className="max-w-2xl">
          <p className="type-overline">Gallery</p>
          <h2 className="type-h2 mt-3 text-heading">Selected frames</h2>
          <p className="mt-4 text-base text-muted">
            Screenshots and process shots from {title}.
          </p>
        </div>

        <div className="mt-10 grid gap-4 md:grid-cols-12 md:gap-5">
          <button
            type="button"
            onClick={() => setActive(0)}
            className={cn(
              "group relative overflow-hidden rounded-3xl border border-silver-400/15 bg-tobago-800 text-left",
              rest.length > 0
                ? "aspect-4/3 md:col-span-7 md:aspect-auto md:min-h-[28rem]"
                : "aspect-16/10 md:col-span-12",
            )}
          >
            <ProjectCoverImage
              src={featured.path}
              alt={featured.description || `${title} gallery 1`}
              sizes="(max-width: 768px) 100vw, 60vw"
              className="transition duration-500 group-hover:scale-[1.02]"
            />
            {featured.description ? (
              <span className="absolute inset-x-0 bottom-0 bg-linear-to-t from-tobago-900 via-tobago-900/70 to-transparent px-5 pb-5 pt-16">
                <span className="block text-sm text-fantasy-100/95">
                  {featured.description}
                </span>
              </span>
            ) : null}
          </button>

          {rest.length > 0 ? (
            <div className="grid gap-4 sm:grid-cols-2 md:col-span-5 md:grid-cols-1 md:gap-5">
              {rest.slice(0, 4).map((image, index) => (
                <button
                  key={`${image.path}-${index + 1}`}
                  type="button"
                  onClick={() => setActive(index + 1)}
                  className="group relative aspect-4/3 overflow-hidden rounded-3xl border border-silver-400/15 bg-tobago-800 text-left md:aspect-auto md:min-h-[13.25rem]"
                >
                  <ProjectCoverImage
                    src={image.path}
                    alt={image.description || `${title} gallery ${index + 2}`}
                    sizes="(max-width: 768px) 50vw, 35vw"
                    className="transition duration-500 group-hover:scale-[1.03]"
                  />
                  {image.description ? (
                    <span className="absolute inset-x-0 bottom-0 bg-linear-to-t from-tobago-900 via-tobago-900/75 to-transparent px-4 pb-4 pt-12">
                      <span className="line-clamp-2 block text-xs text-fantasy-100/95">
                        {image.description}
                      </span>
                    </span>
                  ) : null}
                </button>
              ))}
            </div>
          ) : null}
        </div>

        {rest.length > 4 ? (
          <div className="mt-4 grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 md:gap-5">
            {rest.slice(4).map((image, index) => (
              <button
                key={`${image.path}-${index + 5}`}
                type="button"
                onClick={() => setActive(index + 5)}
                className="group relative aspect-4/3 overflow-hidden rounded-3xl border border-silver-400/15 bg-tobago-800 text-left"
              >
                <ProjectCoverImage
                  src={image.path}
                  alt={image.description || `${title} gallery ${index + 6}`}
                  sizes="(max-width: 768px) 50vw, 25vw"
                  className="transition duration-500 group-hover:scale-[1.03]"
                />
                {image.description ? (
                  <span className="absolute inset-x-0 bottom-0 bg-linear-to-t from-tobago-900 via-tobago-900/75 to-transparent px-3 pb-3 pt-10">
                    <span className="line-clamp-2 block text-xs text-fantasy-100/95">
                      {image.description}
                    </span>
                  </span>
                ) : null}
              </button>
            ))}
          </div>
        ) : null}
      </div>

      {lightbox}
    </section>
  );
}
