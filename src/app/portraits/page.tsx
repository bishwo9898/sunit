import Image from "next/image";
import MasonryGallery from "../components/masonry-gallery";
import StickyBook from "../components/sticky-book";
import CTABlock from "../components/cta-block";
import { loadManifest } from "@/utils/manifest.server";
import { selectHeroImages } from "@/utils/hero-selection";

export default async function PortraitsPage() {
  const manifest = await loadManifest();
  const slides = selectHeroImages(manifest, {
    categories: ["portraits"],
    count: 6,
  });
  const fallbackSlides = [
    { src: "/hero/hero2.webp", alt: "Editorial portrait" },
    { src: "/hero/hero3.webp", alt: "Natural light profile" },
    { src: "/hero/hero1.webp", alt: "Golden hour" },
  ];

  return (
    <>
      {/* HERO (Ken Burns style, mirroring weddings/home) */}
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
                alt={s.alt || s.tags?.join(", ") || "Portrait hero"}
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
                Portrait Sessions
              </p>
              <h1 className="mt-4 font-display text-4xl md:text-6xl lg:text-7xl font-bold tracking-tight text-white">
                Editorial & Honest Portraiture
              </h1>
              <p className="mt-5 max-w-2xl text-neutral-300 text-sm md:text-lg leading-relaxed">
                Direction where it serves you—authentic in-between frames the
                rest of the time. Natural color, luminous skin tones, and a
                cinematic stillness.
              </p>
              <div className="mt-8 flex flex-wrap items-center gap-4 md:gap-5">
                <a
                  href="#portrait-gallery"
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
                  <span className="tracking-tight">Book a Session</span>
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

      {/* Value Pillars */}
      <section className="py-24 md:py-32 bg-white">
        <div className="mx-auto max-w-6xl px-6 md:px-10">
          <div className="grid md:grid-cols-3 gap-10 md:gap-14">
            {[
              {
                title: "Guided + Candid",
                body: "Micro direction for posture & light—space for personality between prompts.",
              },
              {
                title: "True-to-Tone",
                body: "Natural color grading, luminous skin, subtle retouch preserving texture.",
              },
              {
                title: "Editorial Versatility",
                body: "Clean branding frames to emotive cinematic crops—delivered cohesively.",
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

      {/* Portrait Gallery */}
      <div id="portrait-gallery">
        <MasonryGallery
          category="portraits"
          heading="Portrait Sessions"
          description="Editorial & honest frames—individuals, creatives, couples & families. Tap to enlarge."
          className="border-t border-neutral-100"
          lightboxVariant="clean"
          max={180}
        />
      </div>

      <div id="book" data-aos="fade-up" data-aos-delay="300">
        <CTABlock />
      </div>

      <StickyBook />
    </>
  );
}
