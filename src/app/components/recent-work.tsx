"use client";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import AOS from "aos";
import Image from "next/image";

type Img = {
  src: string;
  width?: number;
  height?: number;
  blurDataURL?: string;
  alt?: string;
  category?: string;
};

export default function RecentWork() {
  const [open, setOpen] = useState<number | null>(null);
  const [items, setItems] = useState<Img[]>([]);
  const [cols, setCols] = useState(4);
  const [loaded, setLoaded] = useState(false);
  const containerRef = useRef<HTMLDivElement | null>(null);

  // Load images from manifest
  useEffect(() => {
    let mounted = true;
    const fallback = (): Img[] => [
      { src: "/optimized/hero/hero1.jpg", alt: "Elopement" },
      { src: "/optimized/hero/hero2.jpg", alt: "Portrait" },
      { src: "/optimized/hero/hero3.jpg", alt: "Wedding" },
      { src: "/optimized/hero/hero4.jpg", alt: "Details" },
    ];
    (async () => {
      try {
        const res = await fetch("/images.manifest.json", { cache: "no-store" });
        if (res.ok) {
          const data: Img[] = await res.json();
          const filtered = data.filter(
            (i) => i.category && i.category !== "hero"
          );
          if (mounted) {
            setItems((filtered.length ? filtered : fallback()).slice(0, 60));
            setLoaded(true);
          }
          return;
        }
      } catch {}
      if (mounted) {
        setItems(fallback());
        setLoaded(true);
      }
    })();
    return () => {
      mounted = false;
    };
  }, []);

  // Responsive column count
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

  // Distribute + store original indices
  const columnized = useMemo(() => {
    const columns: { img: Img; original: number }[][] = Array.from(
      { length: cols },
      () => []
    );
    const heights = new Array(cols).fill(0);
    items.forEach((img, original) => {
      const w = img.width || 1600;
      const h = img.height || 1200;
      const ratio = h / w;
      let target = 0;
      for (let i = 1; i < cols; i++)
        if (heights[i] < heights[target]) target = i;
      columns[target].push({ img, original });
      heights[target] += ratio;
    });
    return columns;
  }, [items, cols]);

  // Row-major ordering across columns (left-to-right, then next row)
  const { displayOrder, rowMajorIndex } = useMemo(() => {
    const maxLen = Math.max(0, ...columnized.map((c) => c.length));
    const rowMajorIndex: number[][] = columnized.map((c) =>
      new Array(c.length).fill(-1)
    );
    const order: number[] = [];
    let counter = 0;
    for (let r = 0; r < maxLen; r++) {
      for (let c = 0; c < columnized.length; c++) {
        if (columnized[c][r]) {
          rowMajorIndex[c][r] = counter;
          order.push(columnized[c][r].original);
          counter++;
        }
      }
    }
    return { displayOrder: order, rowMajorIndex };
  }, [columnized]);

  // Initialize / refresh AOS when column layout updates
  useEffect(() => {
    AOS.init({
      duration: 900,
      easing: "ease-out",
      once: true,
      offset: 100,
    });
    // refresh to account for dynamically loaded images
    setTimeout(() => AOS.refresh(), 50);
  }, [columnized]);

  const showPrev = useCallback(
    () =>
      setOpen((o) =>
        o === null ? o : (o - 1 + displayOrder.length) % displayOrder.length
      ),
    [displayOrder.length]
  );
  const showNext = useCallback(
    () => setOpen((o) => (o === null ? o : (o + 1) % displayOrder.length)),
    [displayOrder.length]
  );
  const close = useCallback(() => setOpen(null), []);

  // Keyboard navigation
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
    <section
      id="recent-work"
      className="py-20 md:py-28 bg-white text-neutral-900"
    >
      <style jsx>{`
        .mouse-shell {
          width: 38px;
          height: 62px;
          border: 2px solid #d1d5db;
          border-radius: 22px;
          display: flex;
          align-items: flex-start;
          justify-content: center;
          padding-top: 10px;
          position: relative;
        }
        .mouse-wheel {
          width: 6px;
          height: 10px;
          background: #9ca3af;
          border-radius: 4px;
          animation: wheel 2.2s cubic-bezier(0.22, 1, 0.22, 1) infinite;
        }
        @keyframes wheel {
          0% {
            transform: translateY(0);
            opacity: 1;
          }
          55% {
            transform: translateY(14px);
            opacity: 1;
          }
          70% {
            opacity: 0;
          }
          100% {
            transform: translateY(0);
            opacity: 0;
          }
        }
        .finger {
          width: 38px;
          height: 54px;
          position: relative;
          animation: finger 2.6s ease-in-out infinite;
        }
        .finger-tip {
          position: absolute;
          left: 50%;
          top: 0;
          transform: translateX(-50%);
          width: 20px;
          height: 20px;
          background: linear-gradient(145deg, #f3f4f6, #e5e7eb);
          border: 1px solid #d1d5db;
          border-radius: 10px;
          box-shadow: 0 6px 14px -6px rgba(0, 0, 0, 0.2);
        }
        .finger::after {
          content: "";
          position: absolute;
          left: 50%;
          top: 18px;
          transform: translateX(-50%);
          width: 14px;
          height: 34px;
          background: linear-gradient(#f3f4f6, #e5e7eb);
          border: 1px solid #d1d5db;
          border-radius: 8px 8px 12px 12px;
        }
        @keyframes finger {
          0% {
            transform: translateY(0);
          }
          45% {
            transform: translateY(10px);
          }
          52% {
            transform: translateY(10px);
          }
          100% {
            transform: translateY(0);
          }
        }
      `}</style>
      <div className="w-full max-w-none mx-auto px-2 sm:px-3 md:px-4 lg:px-6 xl:px-8 2xl:px-10">
        <div className="flex flex-col items-center text-center gap-8 mb-16">
          <h2 className="font-display text-4xl md:text-6xl font-semibold tracking-tight leading-[1.05]">
            See my work:
          </h2>
          {/* Scroll / swipe hint */}
          <div className="flex flex-col items-center gap-6" aria-hidden="true">
            {/* Desktop / tablet mouse scroll indicator */}
            <div className="hidden md:flex flex-col items-center gap-3">
              <div className="mouse-shell">
                <div className="mouse-wheel" />
              </div>
              <span className="text-[11px] tracking-[0.28em] font-medium text-neutral-400"></span>
            </div>
            {/* Mobile finger swipe animation */}
            <div className="md:hidden flex flex-col items-center gap-2">
              <div className="finger">
                <div className="finger-tip" />
              </div>
              <span className="text-[10px] tracking-[0.25em] font-semibold text-neutral-400">
                SWIPE
              </span>
            </div>
          </div>
        </div>

        {/* Masonry Columns */}
        <div ref={containerRef} className="flex gap-2 items-start">
          {/* 8px gutters */}
          {columnized.map((col, ci) => (
            <div key={ci} className="flex flex-col gap-2 w-full">
              {col.map((entry, rIndex) => {
                const { img } = entry;
                const displayIdx = rowMajorIndex[ci][rIndex];
                return (
                  <button
                    key={img.src + displayIdx}
                    onClick={() => setOpen(displayIdx)}
                    data-aos="fade-up"
                    data-aos-delay={(displayIdx % 12) * 60}
                    className="group relative overflow-hidden rounded-md focus:outline-none focus-visible:ring-2 focus-visible:ring-neutral-900/40 bg-neutral-100 shadow-sm hover:shadow-md transition-shadow duration-300 will-change-transform"
                    aria-label={`Open image ${img.alt || "Recent work"}`}
                  >
                    <Image
                      src={img.src}
                      alt={img.alt || "Recent work"}
                      width={img.width || 1600}
                      height={img.height || 1200}
                      sizes="(max-width:640px) 50vw, (max-width:1024px) 33vw, (max-width:1600px) 25vw, (max-width:2600px) 24vw, 23vw"
                      placeholder={img.blurDataURL ? "blur" : "empty"}
                      blurDataURL={img.blurDataURL}
                      className="w-full h-auto transition-transform duration-500 ease-[cubic-bezier(.22,1,.22,1)] group-hover:scale-[1.03]"
                    />
                    {/* Hover overlay */}
                    <div className="pointer-events-none absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-colors duration-500" />
                    {img.alt && (
                      <span className="pointer-events-none absolute left-3 bottom-3 text-[11px] tracking-wide uppercase font-medium text-white/95 opacity-0 group-hover:opacity-100 transition-opacity duration-400">
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
              {Array.from({ length: 8 }).map((_, i) => (
                <div key={i} className="rounded-lg bg-neutral-100 h-44" />
              ))}
            </div>
          )}
        </div>
      </div>

      {open !== null && displayOrder[open] !== undefined && (
        <div className="fixed inset-0 z-50" role="dialog" aria-modal>
          <div
            className="absolute inset-0 bg-black/90 backdrop-blur-sm"
            onClick={close}
          />
          <figure className="relative z-10 h-full w-full flex flex-col items-center justify-center p-6">
            <img
              src={items[displayOrder[open]].src}
              alt={items[displayOrder[open]].alt || "Recent work"}
              className="max-h-[78vh] max-w-[90vw] object-contain select-none"
              draggable={false}
            />
            {items[displayOrder[open]].alt && (
              <figcaption className="mt-4 text-xs md:text-sm text-neutral-300 tracking-wide">
                {items[displayOrder[open]].alt}
              </figcaption>
            )}
            <button
              onClick={close}
              aria-label="Close"
              className="absolute top-4 right-4 h-11 w-11 rounded-full bg-white/10 hover:bg-white/20 text-white text-xl flex items-center justify-center backdrop-blur focus:outline-none focus-visible:ring-2 focus-visible:ring-white"
            >
              ×
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                showPrev();
              }}
              aria-label="Previous"
              className="absolute left-4 top-1/2 -translate-y-1/2 h-12 w-12 rounded-full bg-white/10 hover:bg-white/20 text-white text-2xl flex items-center justify-center backdrop-blur focus:outline-none focus-visible:ring-2 focus-visible:ring-white"
            >
              ‹
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                showNext();
              }}
              aria-label="Next"
              className="absolute right-4 top-1/2 -translate-y-1/2 h-12 w-12 rounded-full bg-white/10 hover:bg-white/20 text-white text-2xl flex items-center justify-center backdrop-blur focus:outline-none focus-visible:ring-2 focus-visible:ring-white"
            >
              ›
            </button>
          </figure>
        </div>
      )}
    </section>
  );
}
