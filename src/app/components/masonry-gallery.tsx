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
  collections?: string[];
};

type MasonryGalleryProps = {
  category?: string | string[];
  collection?: string | string[]; // e.g., 'home'
  max?: number;
  className?: string;
  images?: MasonryImage[];
  heading?: string;
  description?: string;
  // Lightbox visual style variant: default (dark) or clean (white)
  lightboxVariant?: "default" | "clean";
  // If true, disables Next.js image optimization (use direct URLs). Useful for admin UIs.
  unoptimized?: boolean;
  // Enable/disable AOS animations; when disabled, avoid data-aos attributes so elements are visible.
  animations?: boolean;
  // Admin helpers: selection controls and parent notifications
  selectable?: boolean;
  selectedSrcs?: string[];
  onToggleSelect?: (src: string, selected: boolean) => void;
  onItemsRendered?: (srcs: string[]) => void;
  // Force refetch/re-render of items when this value changes
  refreshKey?: number;
  // New: ordering (manifest/shuffle) and optional drag-and-drop sorting mode
  orderStrategy?: "manifest" | "shuffle";
  sortable?: boolean;
  onReorder?: (orderedSrcs: string[]) => void;
  // Show or hide small caption label (alt text) overlay
  showCaptions?: boolean;
};

export default function MasonryGallery({
  category,
  collection,
  max = 120,
  className = "",
  images,
  heading,
  description,
  lightboxVariant = "default",
  unoptimized = false,
  animations = true,
  selectable = false,
  selectedSrcs = [],
  onToggleSelect,
  onItemsRendered,
  refreshKey,
  // New: ordering & drag-and-drop support
  orderStrategy = "manifest",
  sortable = false,
  onReorder,
  showCaptions = true,
}: MasonryGalleryProps) {
  const [items, setItems] = useState<MasonryImage[]>(images || []);
  const [open, setOpen] = useState<number | null>(null);
  const [cols, setCols] = useState(4);
  const [loaded, setLoaded] = useState(!!images);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const dragFromIndex = useRef<number | null>(null);
  // Stabilize category/collection dependencies so array literals don't re-trigger fetches
  const catKey = useMemo(() => {
    if (!category) return "";
    return Array.isArray(category) ? category.join("|") : String(category);
  }, [Array.isArray(category) ? (category as string[]).join("|") : category]);
  const colKey = useMemo(() => {
    if (!collection) return "";
    return Array.isArray(collection)
      ? collection.join("|")
      : String(collection);
  }, [
    Array.isArray(collection) ? (collection as string[]).join("|") : collection,
  ]);

  useEffect(() => {
    if (images) return;
    let mounted = true;
    (async () => {
      try {
        const res = await fetch("/api/images", { cache: "no-store" });
        if (res.ok) {
          const data: MasonryImage[] = await res.json();
          // Base filter: keep valid src and exclude legacy hero entries.
          // Do NOT require category globally; category may be cleared intentionally (e.g., admin removes from a category)
          // and such items should still be eligible when filtering by collections like "home".
          let filtered = data
            .filter((d) => d.src && d.category !== "hero")
            .filter((d) => !d.src.includes("/optimized/hero/"));
          if (catKey) {
            const cats = Array.isArray(category)
              ? category
              : [String(category)];
            filtered = filtered.filter(
              (d) => d.category && cats.includes(d.category)
            );
          }
          if (colKey) {
            const cols = Array.isArray(collection)
              ? collection
              : [String(collection)];
            filtered = filtered.filter(
              (d) =>
                Array.isArray(d.collections) &&
                d.collections.some((c) => cols.includes(c))
            );
          }
          if (orderStrategy === "shuffle") {
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
            shuffle(regularGroup, seedBase + 53);
            filtered = [...featuredGroup, ...regularGroup];
          }
          if (mounted) {
            const final = filtered.slice(0, max);
            setItems(final);
            if (onItemsRendered) onItemsRendered(final.map((i) => i.src));
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
  }, [catKey, colKey, max, images, refreshKey]);

  useEffect(() => {
    const calc = () => {
      const w = window.innerWidth;
      if (w < 640) setCols(2);
      else if (w < 1024) setCols(3);
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
    if (!animations) return;
    // @ts-ignore
    if (typeof window !== "undefined" && window.AOS && window.AOS.refresh) {
      // @ts-ignore
      window.AOS.refresh();
    }
  }, [columnized, animations]);

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

  // (Easter egg removed)
  // Drag & drop handlers (only active when sortable)
  const onDragStart = useCallback((index: number) => {
    dragFromIndex.current = index;
  }, []);
  const onDragOver = useCallback(
    (e: React.DragEvent) => {
      if (!sortable) return;
      e.preventDefault();
    },
    [sortable]
  );
  const onDrop = useCallback(
    (toIndex: number) => {
      if (!sortable) return;
      const fromIndex = dragFromIndex.current;
      dragFromIndex.current = null;
      if (fromIndex === null || fromIndex === toIndex) return;
      setItems((prev) => {
        const next = prev.slice();
        const [moved] = next.splice(fromIndex, 1);
        next.splice(toIndex, 0, moved);
        onReorder && onReorder(next.map((i) => i.src));
        return next;
      });
    },
    [sortable, onReorder]
  );

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
        <div
          ref={containerRef}
          className="flex gap-1 sm:gap-2 items-start w-full"
        >
          {columnized.map((col, ci) => (
            <div
              key={ci}
              className="flex flex-col gap-1 sm:gap-2 flex-1 min-w-0"
            >
              {col.map(({ img, index }) => {
                const aosProps = animations
                  ? {
                      "data-aos": "fade-up",
                      "data-aos-delay": Math.min(index * 30, 240),
                    }
                  : {};
                const isSelected = selectable && selectedSrcs.includes(img.src);
                return (
                  <button
                    key={img.src + index}
                    onClick={() => !sortable && setOpen(index)}
                    className="relative overflow-hidden rounded-md focus:outline-none bg-neutral-50 shadow-sm cursor-zoom-in"
                    aria-label={`Open image ${img.alt || "Gallery image"}`}
                    draggable={sortable}
                    onDragStart={() => onDragStart(index)}
                    onDragOver={onDragOver}
                    onDrop={() => onDrop(index)}
                    {...(aosProps as any)}
                  >
                    {selectable && (
                      <label className="absolute top-2 right-2 z-10 inline-flex items-center gap-1 text-[12px] text-neutral-100 bg-black/60 px-2 py-1 rounded shadow cursor-pointer select-none">
                        <input
                          type="checkbox"
                          className="accent-black w-4 h-4"
                          checked={isSelected}
                          onChange={(e) => {
                            e.stopPropagation();
                            onToggleSelect &&
                              onToggleSelect(img.src, e.target.checked);
                          }}
                          onClick={(e) => e.stopPropagation()}
                        />
                        Select
                      </label>
                    )}
                    {sortable && (
                      <span className="absolute top-2 left-2 z-10 inline-flex items-center gap-1 text-[11px] text-neutral-100 bg-black/40 px-2 py-1 rounded cursor-move">
                        Drag
                      </span>
                    )}
                    <Image
                      src={img.src}
                      alt={img.alt || "Gallery image"}
                      width={img.width || 1600}
                      height={img.height || 1200}
                      sizes={`${Math.round(100 / cols)}vw`}
                      placeholder={img.blurDataURL ? "blur" : "empty"}
                      blurDataURL={img.blurDataURL}
                      className={`block w-full h-auto object-contain ${
                        sortable ? "cursor-move" : ""
                      }`}
                      loading="lazy"
                      unoptimized={unoptimized}
                    />
                    {showCaptions && img.alt && (
                      <span className="pointer-events-none absolute left-3 bottom-3 text-[11px] tracking-wide uppercase font-medium text-white bg-black/40 px-2 py-1 rounded">
                        {img.alt}
                      </span>
                    )}
                  </button>
                );
              })}
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
            <div className="flex flex-col md:flex-row items-center justify-center gap-12 w-full">
              <div className="flex items-center justify-center">
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
              </div>
              {/* Easter egg UI removed */}
            </div>
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
