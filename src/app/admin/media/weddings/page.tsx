"use client";
import { useCallback, useState } from "react";
import GoBackButton from "@/app/components/go-back";
import MasonryGallery from "@/app/components/masonry-gallery";
import UploadBox from "@/app/components/admin/upload-box";

export default function AdminWeddingsGallery() {
  const [selected, setSelected] = useState<string[]>([]);
  const [refreshKey, setRefreshKey] = useState(0);
  const [ordering, setOrdering] = useState<string[] | null>(null);
  const [savingOrder, setSavingOrder] = useState(false);
  const toggle = useCallback((src: string, on: boolean) => {
    setSelected((prev) => {
      const set = new Set(prev);
      if (on) set.add(src);
      else set.delete(src);
      return Array.from(set);
    });
  }, []);
  const onDelete = useCallback(async () => {
    if (!selected.length) return;
    // Clear category for each selected image
    await Promise.all(
      selected.map((id) =>
        fetch("/api/admin/media/update", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ id, category: "" }),
        })
      )
    );
    setSelected([]);
    setRefreshKey((k) => k + 1);
  }, [selected]);
  return (
    <main className="min-h-screen bg-neutral-950 text-white px-6 md:px-10 lg:px-16 py-10">
      <div className="mx-auto max-w-6xl">
        <header className="mb-4 flex items-center gap-4">
          <GoBackButton />
          <div>
            <h1 className="text-2xl md:text-3xl font-semibold tracking-tight">
              Weddings Gallery
            </h1>
            <p className="text-sm text-neutral-400 mt-1">
              Read-only preview of category “weddings”.
            </p>
          </div>
          <div className="ml-auto flex items-center gap-3">
            {/* Randomize */}
            <button
              onClick={async () => {
                if (
                  !confirm(
                    "Randomize entire gallery order? This affects all pages."
                  )
                )
                  return;
                const res = await fetch("/api/admin/media/randomize", {
                  method: "POST",
                  credentials: "same-origin",
                });
                if (!res.ok) {
                  alert("Failed to randomize");
                  return;
                }
                setOrdering(null);
                setRefreshKey((k) => k + 1);
              }}
              className="inline-flex items-center gap-2 rounded-md bg-indigo-300 text-neutral-900 text-sm font-medium px-3 py-1.5"
            >
              <span className="text-[12px]">Randomize Gallery</span>
            </button>
            {/* Save order */}
            <button
              onClick={async () => {
                if (!ordering) return;
                setSavingOrder(true);
                try {
                  const res = await fetch("/api/admin/media/reorder", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    credentials: "same-origin",
                    body: JSON.stringify({ order: ordering }),
                  });
                  if (!res.ok) throw new Error("Failed to save order");
                  setOrdering(null);
                  setRefreshKey((k) => k + 1);
                } catch (e) {
                  alert("Failed to save order");
                } finally {
                  setSavingOrder(false);
                }
              }}
              disabled={!ordering || savingOrder}
              className="inline-flex items-center gap-2 rounded-md bg-emerald-400 text-neutral-900 text-sm font-medium px-3 py-1.5 disabled:opacity-40"
              title={
                !ordering ? "Drag to change order first" : "Save custom order"
              }
            >
              <span className="text-[12px]">
                {savingOrder ? "Saving…" : "Save Order"}
              </span>
            </button>
            {/* Cancel order */}
            <button
              onClick={() => setOrdering(null)}
              disabled={!ordering || savingOrder}
              className="inline-flex items-center gap-2 rounded-md bg-neutral-200 text-neutral-900 text-sm font-medium px-3 py-1.5 disabled:opacity-40"
              title="Discard current ordering"
            >
              <span className="text-[12px]">Cancel</span>
            </button>
            <button
              onClick={onDelete}
              disabled={!selected.length}
              title={
                !selected.length
                  ? "Select images first"
                  : "Remove from Weddings"
              }
              className="inline-flex items-center gap-2 rounded-md bg-white text-neutral-900 text-sm font-medium px-3 py-1.5 disabled:opacity-40"
            >
              <span className="text-[12px]">Delete from Weddings</span>
            </button>
          </div>
        </header>
        <UploadBox
          className="mb-4"
          target="weddings"
          title="Upload to Weddings"
          onDone={() => setRefreshKey((k) => k + 1)}
        />
        <div className="rounded-xl overflow-hidden shadow-sm ring-1 ring-white/10 bg-white">
          <MasonryGallery
            category={["weddings", "wedding"]}
            lightboxVariant="clean"
            unoptimized
            animations={false}
            max={9999}
            sortable
            showCaptions={false}
            onReorder={(srcs) => setOrdering(srcs)}
            onItemsRendered={() => {
              // Clear pending ordering on refresh/navigation so Save matches current view
              setOrdering(null);
            }}
            selectable
            selectedSrcs={selected}
            onToggleSelect={toggle}
            refreshKey={refreshKey}
          />
        </div>
      </div>
    </main>
  );
}
