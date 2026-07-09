import type { Metadata } from "next";
import { loadManifest } from "@/utils/manifest.server";
import MasonryGallery from "../components/masonry-gallery";
import { FiCloud, FiInfo, FiCode } from "react-icons/fi";

export const dynamic = "force-dynamic";
export const metadata: Metadata = {
  robots: {
    index: false,
    follow: false,
    noarchive: true,
  },
};

export default async function CloudinaryTestPage() {
  const manifest = await loadManifest();
  const source = process.env.IMAGE_SOURCE || "local";
  
  const homeImages = manifest.filter(img => img.category === 'home');

  return (
    <div className="min-h-screen bg-neutral-50 px-6 py-12 md:py-20 font-sans">
      <div className="mx-auto max-w-6xl">
        <header className="mb-12">
          <div className="flex items-center gap-3 mb-4">
             <div className="bg-blue-100 p-2 rounded-lg text-blue-600">
               <FiCloud className="w-6 h-6" />
             </div>
             <h1 className="font-display text-3xl font-bold tracking-tight text-neutral-900">
               Cloudinary Migration Test
             </h1>
          </div>
          <div className="bg-white border border-neutral-200 rounded-xl p-4 shadow-sm flex items-start gap-4">
            <FiInfo className="mt-1 text-neutral-400 shrink-0" />
            <div>
              <p className="text-sm text-neutral-600">
                Current active source: <span className="font-mono font-bold text-neutral-900 bg-neutral-100 px-1.5 py-0.5 rounded uppercase">{source}</span>
              </p>
              <p className="text-xs text-neutral-400 mt-1">
                Found <span className="font-bold">{homeImages.length}</span> images in the <span className="font-mono font-bold">home</span> folder on Cloudinary.
              </p>
            </div>
          </div>
        </header>

        <main className="space-y-16">
          {/* Visual Gallery Test */}
          <section>
            <div className="flex items-center gap-2 mb-6">
              <span className="h-px flex-1 bg-neutral-200" />
              <h2 className="text-xs font-bold uppercase tracking-[0.2em] text-neutral-400">Visual Gallery Render</h2>
              <span className="h-px flex-1 bg-neutral-200" />
            </div>
            
            <div className="bg-white p-6 rounded-3xl border border-neutral-200 shadow-sm">
              <MasonryGallery 
                category="home" 
                heading="Live Gallery Test"
                description="Rendering directly from Cloudinary using existing gallery logic."
              />
            </div>
          </section>

          {/* Data Integrity Test */}
          <section>
             <div className="flex items-center gap-2 mb-6">
              <span className="h-px flex-1 bg-neutral-200" />
              <h2 className="text-xs font-bold uppercase tracking-[0.2em] text-neutral-400">Raw Data Manifest</h2>
              <span className="h-px flex-1 bg-neutral-200" />
            </div>

            <div className="bg-neutral-900 rounded-2xl p-6 overflow-hidden shadow-2xl">
              <div className="flex items-center gap-2 text-white/50 mb-4 text-xs font-mono">
                <FiCode />
                <span>manifest_dump.json</span>
              </div>
              <pre className="text-[11px] text-green-400 font-mono overflow-auto max-h-[500px] leading-relaxed scrollbar-thin scrollbar-thumb-neutral-800 scrollbar-track-transparent">
                {JSON.stringify(homeImages, null, 2)}
              </pre>
            </div>
          </section>
        </main>
      </div>
    </div>
  );
}
