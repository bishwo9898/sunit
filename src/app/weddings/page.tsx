import Image from "next/image";
import StickyBook from "../components/sticky-book";
import MasonryGallery from "../components/masonry-gallery"; // already client component
import { loadManifest } from "@/utils/manifest.server";
import { selectHeroImages } from "@/utils/hero-selection";

export default async function WeddingsPage() {
  // Load manifest server-side similar to home hero to select wedding hero images
  const manifest = await loadManifest();
  // Accept both possible spellings of the category (singular/plural)
  const slides = selectHeroImages(manifest, {
    categories: ["weddings", "wedding"],
    count: 5,
  });
  const fallbackSlides = [
    { src: "/hero/hero3.webp", alt: "Elegant bridal portrait" },
    { src: "/hero/hero1.webp", alt: "Cinematic ceremony moment" },
    { src: "/hero/hero2.webp", alt: "Editorial couple frame" },
  ];

  return (
    <>
      {/* HERO (Ken Burns style reused) */}
      <section className="relative h-[78vh] md:h-[92vh] w-full overflow-hidden">
        {(slides.length ? slides : (fallbackSlides as any)).map(
          (s: any, i: number) => (
            <div
              key={s.src}
              aria-hidden="true"
              className="absolute inset-0 opacity-0 kb-slide"
              style={{ animationDelay: `${i * 6}s` }}
            >
              <Image
                src={s.src}
                alt={s.alt || s.tags?.join(", ") || "Wedding hero"}
                fill
                priority={i === 0}
                sizes="100vw"
                className="object-cover"
                placeholder={s.blurDataURL ? "blur" : "empty"}
                blurDataURL={s.blurDataURL}
              />
            </div>
          )
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/25 to-transparent" />
        <div className="pointer-events-none absolute inset-0 grain" />
        <div className="relative z-10 flex h-full items-end pb-16 md:pb-24">
          <div className="px-6 md:px-12 lg:px-20 w-full">
            <div className="max-w-4xl">
              <p className="text-neutral-300 tracking-widest uppercase text-[11px] md:text-xs">
                Wedding Collections
              </p>
              <h1 className="mt-4 font-display text-4xl md:text-6xl lg:text-7xl font-bold tracking-tight text-white">
                Intentional Storytelling for Modern Celebrations
              </h1>
              <p className="mt-5 max-w-2xl text-neutral-300 text-sm md:text-lg leading-relaxed">
                Editorial finesse meets documentary honesty—quiet in-between
                moments, architectural context, luminous skin tones, and
                timeless color that ages with grace.
              </p>
              <div className="mt-8 flex flex-wrap items-center gap-4 md:gap-5">
                <a
                  href="#wedding-gallery"
                  className="group relative inline-flex items-center gap-2 rounded-full bg-white px-8 py-3 text-sm font-semibold text-neutral-900 shadow-sm shadow-black/10 ring-1 ring-black/5 transition hover:shadow-lg hover:shadow-black/20 focus:outline-none focus:ring-2 focus:ring-white/60"
                >
                  <span className="tracking-tight">View Gallery</span>
                  <svg
                    className="w-3.5 h-3.5 text-neutral-500 group-hover:translate-x-0.5 transition-transform"
                    viewBox="0 0 14 14"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.7"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M3 11L11 3" />
                    <path d="M5 3h6v6" />
                  </svg>
                </a>
                <a
                  href="#book"
                  className="group relative inline-flex items-center gap-2 rounded-full px-8 py-3 text-sm font-semibold text-white/90 ring-1 ring-white/30 hover:ring-white/50 backdrop-blur-md bg-white/10 hover:bg-white/15 focus:outline-none focus:ring-2 focus:ring-white/60"
                >
                  <span className="tracking-tight">Check Availability</span>
                  <svg
                    className="w-3.5 h-3.5 translate-x-0.5 opacity-70 group-hover:translate-x-1 group-hover:opacity-100 transition-all"
                    viewBox="0 0 14 14"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.7"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M3 11L11 3" />
                    <path d="M5 3h6v6" />
                  </svg>
                </a>
              </div>
            </div>
          </div>
        </div>
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 text-white/90 text-[11px] tracking-[0.28em]">
          <div className="flex flex-col items-center gap-2">
            <span>SCROLL</span>
            <span className="h-6 w-px bg-white/70 animate-pulse" />
          </div>
        </div>
      </section>

      {/* Intro / value pillars */}
      <section className="py-24 md:py-32 bg-white">
        <div className="mx-auto max-w-6xl px-6 md:px-10">
          <div className="grid md:grid-cols-3 gap-10 md:gap-14">
            {[
              {
                title: "Editorial + Documentary",
                body: "Guided where it matters—authentic the rest of the time. Direction that preserves energy and story.",
              },
              {
                title: "Timeless Color",
                body: "Natural skin tones, restrained palette, and depth that won't feel dated in 10 years.",
              },
              {
                title: "Archival Delivery",
                body: "Museum-grade print options & multi-location backup. Your visual legacy preserved.",
              },
            ].map((p) => (
              <div key={p.title} className="group relative">
                <h3 className="font-display text-xl md:text-2xl font-semibold tracking-tight mb-3">
                  {p.title}
                </h3>
                <p className="text-sm md:text-base text-neutral-600 leading-relaxed">
                  {p.body}
                </p>
                <span className="pointer-events-none absolute -left-4 top-1 h-8 w-px bg-gradient-to-b from-neutral-300 via-neutral-300/0 to-transparent" />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Wedding Gallery */}
      <div id="wedding-gallery">
        <MasonryGallery
          // Pass both to be safe; gallery component supports string[]
          category={["weddings", "wedding"]}
          lightboxVariant="clean"
          heading="Wedding Stories"
          description="A collage of full-day narratives, luminous portraits & quiet between-moments. Tap to enlarge."
          className="border-t border-neutral-100"
          max={180}
        />
      </div>

      {/* Sticky utility (client) */}
      <StickyBook />
    </>
  );
}
