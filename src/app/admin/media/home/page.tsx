"use client";
import { useCallback, useMemo, useState } from "react";
import GoBackButton from "@/app/components/go-back";
import MasonryGallery from "@/app/components/masonry-gallery";
import UploadBox from "@/app/components/admin/upload-box";

export default function AdminHomeGallery() {
  const [selected, setSelected] = useState<string[]>([]);
  const [rendered, setRendered] = useState<string[]>([]);
  const [refreshKey, setRefreshKey] = useState(0);
  const [deleting, setDeleting] = useState(false);
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
  const anySelected = selected.length > 0;
  const disableDelete = !anySelected;

  const onDelete = useCallback(async () => {
    if (!selected.length) return;
    // Use exact srcs selected in the currently rendered grid
    const ids = Array.from(new Set(selected));
    setDeleting(true);
    try {
      const res = await fetch("/api/admin/media/home", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "same-origin",
        body: JSON.stringify({ ids }),
      });
      if (!res.ok) {
        // Fallback to bulk collections API with basename matching
        const res2 = await fetch("/api/admin/media/bulk", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "same-origin",
          body: JSON.stringify({ ids, add: [], remove: ["home"] }),
        });
        if (!res2.ok) {
          console.error("Remove from Home failed", await res.text());
          alert("Failed to remove from Home. Please try again.");
          return;
        }
      } else {
        // If server reports zero changes (e.g., only basename variant present), try fallback once
        try {
          const data = (await res.json()) as { ok?: boolean; changed?: number };
          if (!data || typeof data.changed !== "number" || data.changed === 0) {
            await fetch("/api/admin/media/bulk", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              credentials: "same-origin",
              body: JSON.stringify({ ids, add: [], remove: ["home"] }),
            });
          }
        } catch {}
      }
      setSelected([]);
      setRefreshKey((k) => k + 1);
    } finally {
      setDeleting(false);
    }
  }, [selected]);

  return (
    <main className="min-h-screen bg-neutral-950 text-white px-6 md:px-10 lg:px-16 py-10">
      <div className="mx-auto max-w-6xl">
        <header className="mb-4 flex items-center gap-4">
          <GoBackButton />
          <div>
            <h1 className="text-2xl md:text-3xl font-semibold tracking-tight">
              Homepage Gallery
            </h1>
            <p className="text-sm text-neutral-400 mt-1">
              Read-only preview of images in the “home” collection.
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
              disabled={disableDelete || deleting}
              title={
                disableDelete
                  ? "Select images first"
                  : deleting
                  ? "Deleting…"
                  : "Remove from Home"
              }
              className="inline-flex items-center gap-2 rounded-md bg-white text-neutral-900 text-sm font-medium px-3 py-1.5 disabled:opacity-40"
            >
              <span className="text-[12px]">
                {deleting ? "Deleting…" : "Delete from Home"}
              </span>
            </button>
          </div>
        </header>
        <UploadBox
          className="mb-4"
          target="home"
          collections={["home"]}
          title="Upload to Home (adds to Home collection only)"
          onDone={() => setRefreshKey((k) => k + 1)}
        />
        <div className="rounded-xl overflow-hidden shadow-sm ring-1 ring-white/10 bg-white">
          <MasonryGallery
            collection="home"
            lightboxVariant="clean"
            unoptimized
            animations={false}
            max={9999}
            // Enable sorting; when order changes, store list until saved
            sortable
            showCaptions={false}
            onReorder={(srcs) => setOrdering(srcs)}
            selectable
            selectedSrcs={selected}
            onToggleSelect={toggle}
            onItemsRendered={(srcs) => {
              setRendered(srcs);
              if (!ordering) setOrdering(null);
            }}
            refreshKey={refreshKey}
          />
        </div>
      </div>
    </main>
  );
}
