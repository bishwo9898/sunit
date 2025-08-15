"use client";
import { useState } from "react";
import GoBackButton from "@/app/components/go-back";
import MasonryGallery from "@/app/components/masonry-gallery";
import UploadBox from "@/app/components/admin/upload-box";

export default function AdminAllImagesGallery() {
  const [refreshKey, setRefreshKey] = useState(0);
  return (
    <main className="min-h-screen bg-neutral-950 text-white px-6 md:px-10 lg:px-16 py-10">
      <div className="mx-auto max-w-6xl">
        <header className="mb-6 flex items-center gap-4">
          <GoBackButton />
          <div>
            <h1 className="text-2xl md:text-3xl font-semibold tracking-tight">
              All Images
            </h1>
            <p className="text-sm text-neutral-400 mt-1">
              Read-only preview of all categories (portraits and weddings).
            </p>
          </div>
        </header>
        <UploadBox
          className="mb-4"
          target="portraits"
          allowTargetSwitch
          title="Upload to a Category or Home"
          onDone={() => setRefreshKey((k) => k + 1)}
        />
        <div className="rounded-xl overflow-hidden shadow-sm ring-1 ring-white/10 bg-white">
          <MasonryGallery
            category={["portraits", "weddings", "wedding"]}
            lightboxVariant="clean"
            unoptimized
            animations={false}
            max={5000}
            refreshKey={refreshKey}
          />
        </div>
      </div>
    </main>
  );
}
