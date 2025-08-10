"use client";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import Image from "next/image";

export type MasonryImage = {
  src: string;
  width?: number;
  height?: number;
  blurDataURL?: string;
  alt?: string;
  category?: string;
  featured?: boolean;
};

type MasonryGalleryProps = {
  category?: string | string[];
  max?: number;
  className?: string;
  images?: MasonryImage[];
  heading?: string;
  description?: string;
  // Lightbox visual style variant: default (dark) or clean (white)
  lightboxVariant?: "default" | "clean";
};

export default function MasonryGallery({
  category,
  max = 120,
  className = "",
  images,
  heading,
  description,
  lightboxVariant = "default",
}: MasonryGalleryProps) {
  const [items, setItems] = useState<MasonryImage[]>(images || []);
  const [open, setOpen] = useState<number | null>(null);
  const [cols, setCols] = useState(4);
  const [loaded, setLoaded] = useState(!!images);
  const containerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (images) return;
    let mounted = true;
    (async () => {
      try {
        const res = await fetch("/images.manifest.json", { cache: "no-store" });
        if (res.ok) {
          const data: MasonryImage[] = await res.json();
          let filtered = data.filter(
            (d) => d.category && d.category !== "hero"
          );
          if (category) {
            const cats = Array.isArray(category) ? category : [category];
            filtered = filtered.filter(
              (d) => d.category && cats.includes(d.category)
            );
          }
          // Deterministic shuffle that changes every 2 days.
          // Keeps featured images at the front but randomizes order within groups.
          const period = Math.floor(Date.now() / (1000 * 60 * 60 * 24 * 2)); // 2-day buckets
          const seedBase = period + filtered.length;
          function mulberry32(a: number) {
            return function () {
              let t = (a += 0x6d2b79f5);
              t = Math.imul(t ^ (t >>> 15), t | 1);
              t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
              return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
            };
          }
          function shuffle<T>(arr: T[], seed: number) {
            const rand = mulberry32(seed);
            for (let i = arr.length - 1; i > 0; i--) {
              const j = Math.floor(rand() * (i + 1));
              [arr[i], arr[j]] = [arr[j], arr[i]];
            }
          }
          const featuredGroup = filtered.filter((f) => f.featured);
          const regularGroup = filtered.filter((f) => !f.featured);
          shuffle(featuredGroup, seedBase + 17);
          // slight different seed for regular group
          shuffle(regularGroup, seedBase + 53);
          filtered = [...featuredGroup, ...regularGroup];
          if (mounted) {
            setItems(filtered.slice(0, max));
            setLoaded(true);
          }
          return;
        }
      } catch {}
      if (mounted) setLoaded(true);
    })();
    return () => {
      mounted = false;
    };
  }, [category, max, images]);

  useEffect(() => {
    const calc = () => {
      const w = window.innerWidth;
      if (w < 1024) setCols(3);
      else setCols(4);
    };
    calc();
    window.addEventListener("resize", calc);
    return () => window.removeEventListener("resize", calc);
  }, []);

  const columnized = useMemo(() => {
    // Each column holds objects with original index so lightbox maps correctly
    const columns: { img: MasonryImage; index: number }[][] = Array.from(
      { length: cols },
      () => []
    );
    const heights = new Array(cols).fill(0);
    items.forEach((img, originalIndex) => {
      const w = img.width || 1600;
      const h = img.height || 1200;
      const ratio = h / w;
      let target = 0;
      for (let i = 1; i < cols; i++)
        if (heights[i] < heights[target]) target = i;
      columns[target].push({ img, index: originalIndex });
      heights[target] += ratio;
    });
    return columns;
  }, [items, cols]);

  // AOS handles fade-up animations; ensure refresh after images mount (optional)
  useEffect(() => {
    // @ts-ignore
    if (typeof window !== "undefined" && window.AOS && window.AOS.refresh) {
      // @ts-ignore
      window.AOS.refresh();
    }
  }, [columnized]);

  const showPrev = useCallback(
    () =>
      setOpen((o) => (o === null ? o : (o - 1 + items.length) % items.length)),
    [items.length]
  );
  const showNext = useCallback(
    () => setOpen((o) => (o === null ? o : (o + 1) % items.length)),
    [items.length]
  );
  const close = useCallback(() => setOpen(null), []);

  // Add / remove a body class when lightbox is open so other fixed UI (StickyBook) can hide
  useEffect(() => {
    if (open !== null) {
      document.documentElement.classList.add("lightbox-open");
    } else {
      document.documentElement.classList.remove("lightbox-open");
    }
    return () => document.documentElement.classList.remove("lightbox-open");
  }, [open]);

  useEffect(() => {
    if (open === null) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
      else if (e.key === "ArrowLeft") showPrev();
      else if (e.key === "ArrowRight") showNext();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, showPrev, showNext, close]);

  return (
    <section className={`bg-white ${className}`}>
      <div className="w-full max-w-none mx-auto px-1 sm:px-2 md:px-4 lg:px-6 py-12 md:py-20">
        {(heading || description) && (
          <header className="mb-10 md:mb-14 max-w-3xl">
            {heading && (
              <h2 className="font-display text-3xl md:text-5xl font-semibold tracking-tight leading-tight">
                {heading}
              </h2>
            )}
            {description && (
              <p className="mt-4 text-neutral-500 text-sm md:text-base leading-relaxed">
                {description}
              </p>
            )}
          </header>
        )}
        <div ref={containerRef} className="flex gap-1 sm:gap-2 items-start">
          {columnized.map((col, ci) => (
            <div key={ci} className="flex flex-col gap-1 sm:gap-2 w-full">
              {col.map(({ img, index }) => (
                <button
                  key={img.src + index}
                  onClick={() => setOpen(index)}
                  className="relative overflow-hidden rounded-md focus:outline-none bg-neutral-50 shadow-sm cursor-zoom-in"
                  aria-label={`Open image ${img.alt || "Gallery image"}`}
                  data-aos="fade-up"
                  data-aos-delay={Math.min(index * 30, 240)}
                >
                  <Image
                    src={img.src}
                    alt={img.alt || "Gallery image"}
                    width={(img.width || 1600) * 1.5} // increased resolution
                    height={(img.height || 1200) * 1.5}
                    sizes="100vw"
                    placeholder={img.blurDataURL ? "blur" : "empty"}
                    blurDataURL={img.blurDataURL}
                    className="w-full h-auto object-contain" // ensure no cropping
                    loading="lazy"
                  />
                  {img.alt && (
                    <span className="pointer-events-none absolute left-3 bottom-3 text-[11px] tracking-wide uppercase font-medium text-white bg-black/40 px-2 py-1 rounded">
                      {img.alt}
                    </span>
                  )}
                </button>
              ))}
            </div>
          ))}
          {!loaded && (
            <div className="flex-1 flex flex-col gap-3 animate-pulse">
              {Array.from({ length: 10 }).map((_, i) => (
                <div key={i} className="rounded-lg bg-neutral-100 h-44" />
              ))}
            </div>
          )}
        </div>
      </div>

      {open !== null && items[open] && (
        <div
          className={`fixed inset-0 z-[120] select-none ${
            lightboxVariant === "clean"
              ? "bg-white"
              : "bg-black/90 backdrop-blur-sm"
          }`}
          role="dialog"
          aria-modal
        >
          <figure
            className={`relative h-full w-full flex flex-col items-center justify-center ${
              lightboxVariant === "clean" ? "p-4 md:p-8" : "p-6"
            }`}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Progress indicator */}
            <div
              className={`absolute top-4 left-4 text-[11px] font-medium tracking-wide ${
                lightboxVariant === "clean"
                  ? "text-neutral-500"
                  : "text-white/70"
              }`}
            >
              {open + 1} / {items.length}
            </div>
            <img
              src={items[open].src}
              alt={items[open].alt || "Gallery image"}
              className={`max-h-[82vh] w-auto max-w-[92vw] object-contain transition duration-500 ease-out ${
                lightboxVariant === "clean"
                  ? "shadow-xl shadow-black/10 rounded-lg animate-[fadeScale_.6s_ease]"
                  : "animate-[fadeIn_.5s_ease]"
              }`}
              draggable={false}
              loading="eager"
            />
            {items[open].alt && (
              <figcaption
                className={`mt-5 text-xs md:text-sm tracking-wide max-w-2xl text-center ${
                  lightboxVariant === "clean"
                    ? "text-neutral-600"
                    : "text-neutral-300"
                }`}
              >
                {items[open].alt}
              </figcaption>
            )}
            {/* Close */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                close();
              }}
              aria-label="Close"
              className={`absolute top-3 right-3 flex items-center justify-center px-3 py-2 text-4xl leading-none font-light select-none transition-colors focus:outline-none focus-visible:ring-2 rounded-md z-20 ${
                lightboxVariant === "clean"
                  ? "text-neutral-500 hover:text-neutral-800 focus-visible:ring-neutral-300"
                  : "text-white/80 hover:text-white focus-visible:ring-white/60"
              }`}
            >
              ×
            </button>
            {/* Prev */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                showPrev();
              }}
              aria-label="Previous"
              className={`absolute left-3 top-1/2 -translate-y-1/2 -translate-x-1/2 flex items-center justify-center px-3 py-3 text-3xl font-normal transition-colors focus:outline-none focus-visible:ring-2 rounded-md z-20 ${
                lightboxVariant === "clean"
                  ? "text-neutral-400 hover:text-neutral-800 focus-visible:ring-neutral-300"
                  : "text-white/70 hover:text-white focus-visible:ring-white/50"
              }`}
            >
              ‹
            </button>
            {/* Next */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                showNext();
              }}
              aria-label="Next"
              className={`absolute right-3 top-1/2 translate-x-1/2 -translate-y-1/2 flex items-center justify-center px-3 py-3 text-3xl font-normal transition-colors focus:outline-none focus-visible:ring-2 rounded-md z-20 ${
                lightboxVariant === "clean"
                  ? "text-neutral-400 hover:text-neutral-800 focus-visible:ring-neutral-300"
                  : "text-white/70 hover:text-white focus-visible:ring-white/50"
              }`}
            >
              ›
            </button>
            {/* Invisible side click zones for prev/next */}
            {items.length > 1 && (
              <>
                <div
                  aria-hidden
                  onClick={(e) => {
                    e.stopPropagation();
                    showPrev();
                  }}
                  className="absolute inset-y-0 left-0 w-1/2 z-10"
                />
                <div
                  aria-hidden
                  onClick={(e) => {
                    e.stopPropagation();
                    showNext();
                  }}
                  className="absolute inset-y-0 right-0 w-1/2 z-10"
                />
              </>
            )}
          </figure>
          {/* Lightbox keyframe animations */}
          <style jsx global>{`
            @keyframes fadeScale {
              0% {
                opacity: 0;
                transform: scale(0.94);
              }
              60% {
                opacity: 1;
              }
              100% {
                opacity: 1;
                transform: scale(1);
              }
            }
            @keyframes fadeIn {
              0% {
                opacity: 0;
              }
              100% {
                opacity: 1;
              }
            }
            .lightbox-open body,
            body.lightbox-open {
              overflow: hidden;
            }
            /* Optional hover hint (only for clean variant) */
            /* Removed custom resize cursors for cleaner default pointer */
          `}</style>
        </div>
      )}
    </section>
  );
}
