"use client";
import { useEffect, useState, useRef } from "react";
import Image from "next/image";
import GoBackButton from "@/app/components/go-back";
import { useState as useReactState } from "react";
// Helper to recursively get all images from /public/optimized
async function getAllOptimizedImages() {
  // This is a placeholder for a real API or static import. In production, you would fetch from a server endpoint or generate a manifest at build time.
  // For now, we hardcode a few sample paths for demo. Replace with a dynamic import or API call as needed.
  if (typeof window === "undefined") return [];
  // @ts-ignore
  if (window.__allOptimizedImages) return window.__allOptimizedImages;
  // Fallback: scan DOM for <img> in /optimized/ (not robust, but works for demo)
  const imgs = Array.from(document.querySelectorAll('img[src^="/optimized/"]'));
  const paths = Array.from(new Set(imgs.map((img) => img.getAttribute("src"))));
  // @ts-ignore
  window.__allOptimizedImages = paths;
  return paths;
}

type Item = {
  id: string;
  src: string;
  width: number;
  height: number;
  alt?: string;
  category?: string;
  tags?: string[];
  blurDataURL?: string;
};

const SECTIONS = [
  { key: "home", label: "Home Hero", category: "hero" },
  { key: "portraits", label: "Portraits Hero", category: "portraits-hero" },
  { key: "weddings", label: "Weddings Hero", category: "weddings-hero" },
];

export default function HeroesAdmin() {
  const [all, setAll] = useState<Item[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeSection, setActiveSection] = useState(SECTIONS[0]);
  const dragIndex = useRef<number | null>(null);
  const [optimizedImages, setOptimizedImages] = useReactState<string[]>([]);

  useEffect(() => {
    // Only run on client
    getAllOptimizedImages().then(setOptimizedImages);
  }, []);

  const load = async () => {
    setLoading(true);
    const res = await fetch("/api/admin/media/list");
    if (res.ok) {
      const list: Item[] = await res.json();
      // Auto-sync: any image whose category == 'hero' gets 'hero' tag added (one-time)
      const toSync = list.filter(
        (i) => i.category === "hero" && !(i.tags || []).includes("hero")
      );
      if (toSync.length) {
        await Promise.all(
          toSync.map((i) =>
            fetch("/api/admin/media/update", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                id: i.id,
                tags: [...new Set([...(i.tags || []), "hero"])],
              }),
            })
          )
        );
        const resReload = await fetch("/api/admin/media/list");
        if (resReload.ok) {
          setAll(await resReload.json());
          setLoading(false);
          return;
        }
      }
      setAll(list);
    }
    setLoading(false);
  };
  useEffect(() => {
    load();
  }, []);

  // Section-specific filtering for hero assignment
  let sectionItems: Item[] = [];
  let available: Item[] = [];
  let allOptimized: string[] = [];

  if (activeSection.key === "portraits") {
    sectionItems = all.filter(
      (i) =>
        i.tags?.includes("portraits-hero") &&
        i.src.startsWith("/optimized/portraits/")
    );
    available = all.filter(
      (i) =>
        !sectionItems.includes(i) && i.src.startsWith("/optimized/portraits/")
    );
    allOptimized = optimizedImages.filter((src) =>
      src.startsWith("/optimized/portraits/")
    );
  } else if (activeSection.key === "weddings") {
    sectionItems = all.filter(
      (i) =>
        i.tags?.includes("weddings-hero") &&
        i.src.startsWith("/optimized/weddings/")
    );
    available = all.filter(
      (i) =>
        !sectionItems.includes(i) && i.src.startsWith("/optimized/weddings/")
    );
    allOptimized = optimizedImages.filter((src) =>
      src.startsWith("/optimized/weddings/")
    );
  } else {
    // Home Hero: include ALL images from portraits and weddings (from manifest), regardless of existing tags
    const inScope = all.filter(
      (i) =>
        i.src.startsWith("/optimized/portraits/") ||
        i.src.startsWith("/optimized/weddings/")
    );
    sectionItems = inScope.filter((i) => (i.tags || []).includes("hero"));
    available = inScope.filter((i) => !sectionItems.includes(i));
    // Also show a best-effort list of any optimized files found on the page (optional)
    allOptimized = (
      optimizedImages.length ? optimizedImages : inScope.map((i) => i.src)
    ).filter(
      (src) =>
        src.startsWith("/optimized/portraits/") ||
        src.startsWith("/optimized/weddings/")
    );
  }

  const toggleAssign = async (item: Item) => {
    const tags = new Set(item.tags || []);
    if (tags.has(activeSection.category)) tags.delete(activeSection.category);
    else tags.add(activeSection.category);
    await fetch("/api/admin/media/update", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: item.id, tags: Array.from(tags) }),
    });
    load();
  };

  const reorder = async (from: number, to: number) => {
    const list = [...sectionItems];
    const [m] = list.splice(from, 1);
    list.splice(to, 0, m);
    const remaining = all.filter((a) => !list.find((l) => l.id === a.id));
    const merged = [...list, ...remaining];
    await fetch("/api/admin/media/reorder", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ order: merged.map((m) => m.id) }),
    });
    load();
  };

  return (
    <main className="min-h-screen bg-neutral-950 text-white px-6 md:px-10 lg:px-16 py-12">
      <div className="mx-auto max-w-7xl">
        <GoBackButton />
        <header className="mb-10 flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <div className="flex-1">
            <h1 className="text-3xl md:text-4xl font-bold tracking-tight">
              Hero Banners
            </h1>
            <p className="text-neutral-400 mt-3 text-sm max-w-2xl">
              Curate and order rotating hero images for each section. Assign
              images by toggling them. Drag to reorder within the hero sequence.
              Front-end will reflect ordering (first image loads first).
            </p>
          </div>
          <nav className="flex gap-2 flex-wrap">
            {SECTIONS.map((s) => (
              <button
                key={s.key}
                onClick={() => setActiveSection(s)}
                className={`px-4 py-2 rounded-full text-xs font-medium ring-1 transition ${
                  activeSection.key === s.key
                    ? "bg-white text-neutral-900 ring-white"
                    : "bg-white/5 text-white/80 ring-white/15 hover:bg-white/10"
                }`}
              >
                {s.label}
              </button>
            ))}
          </nav>
        </header>

        {loading && (
          <div className="text-neutral-400 text-sm mb-6">Loading images…</div>
        )}

        <h2 className="text-sm uppercase tracking-wider text-neutral-400 mb-3">
          Assigned ({sectionItems.length})
        </h2>
        <ul className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3 mb-10">
          {sectionItems.map((m, idx) => (
            <li
              key={m.id}
              draggable
              onDragStart={() => (dragIndex.current = idx)}
              onDragOver={(e) => e.preventDefault()}
              onDrop={() => {
                if (dragIndex.current !== null && dragIndex.current !== idx)
                  reorder(dragIndex.current, idx);
                dragIndex.current = null;
              }}
              className="group relative rounded-lg overflow-hidden ring-1 ring-white/15 bg-neutral-900/40"
            >
              <Image
                src={m.src}
                alt={m.alt || ""}
                width={m.width}
                height={m.height}
                className="object-cover aspect-[4/3] w-full h-auto"
              />
              <button
                onClick={() => toggleAssign(m)}
                className="absolute top-1.5 right-1.5 text-[10px] px-2 py-1 rounded bg-white/90 text-neutral-900 font-medium shadow"
              >
                Remove
              </button>
            </li>
          ))}
          {!sectionItems.length && !loading && (
            <div className="col-span-full text-neutral-500 text-sm">
              No hero images yet. Assign some below.
            </div>
          )}
        </ul>

        <h2 className="text-sm uppercase tracking-wider text-neutral-400 mb-3">
          Available Images ({available.length})
        </h2>
        <ul className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
          {available.slice(0, 120).map((m) => (
            <li
              key={m.id}
              className="group relative rounded-lg overflow-hidden ring-1 ring-white/10 bg-neutral-900/40 hover:ring-white/30 transition"
            >
              <Image
                src={m.src}
                alt={m.alt || ""}
                width={m.width}
                height={m.height}
                className="object-cover aspect-[4/3] w-full h-auto"
              />
              <button
                onClick={() => toggleAssign(m)}
                className="absolute bottom-1.5 left-1.5 text-[10px] px-2 py-1 rounded bg-white/90 text-neutral-900 font-medium shadow opacity-0 group-hover:opacity-100 transition"
              >
                Assign
              </button>
            </li>
          ))}
        </ul>
        <h2 className="text-sm uppercase tracking-wider text-neutral-400 mb-3 mt-10">
          All Images in /public/optimized ({allOptimized.length})
        </h2>
        <ul className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
          {allOptimized.map((src) => (
            <li
              key={src}
              className="group relative rounded-lg overflow-hidden ring-1 ring-white/10 bg-neutral-900/40 hover:ring-white/30 transition"
            >
              <Image
                src={src}
                alt={src.split("/").pop() || ""}
                width={400}
                height={300}
                className="object-cover aspect-[4/3] w-full h-auto"
              />
              {/* Optionally: add assign button if not already in manifest */}
            </li>
          ))}
        </ul>
      </div>
    </main>
  );
}
