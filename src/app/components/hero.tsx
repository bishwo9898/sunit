import Link from "next/link";
import Image from "next/image";
import { loadManifest } from "@/utils/manifest.server";

// Server Component: CSS-only Ken Burns hero with overlay and CTAs
export default async function Hero() {
  const manifest = await loadManifest();
  const heroFromManifest = manifest.filter((m) => m.category === "hero");
  const slides = heroFromManifest.length
    ? heroFromManifest
    : [
        { src: "/hero/hero1.webp", alt: "West Texas sunset elopement" },
        { src: "/hero/hero2.webp", alt: "Downtown portrait" },
        { src: "/hero/hero3.webp", alt: "Austin rooftop wedding" },
      ];

  return (
    <section className="relative h-[88vh] md:h-screen w-full overflow-hidden">
      {/* Slides */}
      {slides.map((s: any, i: number) => (
        <div
          key={s.src}
          aria-hidden="true"
          className="absolute inset-0 opacity-0 kb-slide"
          style={{ animationDelay: `${i * 6}s` }}
        >
          <Image
            src={s.src}
            alt={s.alt || "Hero image"}
            fill
            priority={i === 0}
            sizes="100vw"
            className="object-cover"
            placeholder={s.blurDataURL ? "blur" : "empty"}
            blurDataURL={s.blurDataURL}
          />
        </div>
      ))}

      {/* Film grain + gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
      <div className="pointer-events-none absolute inset-0 grain" />

      {/* Content */}
      <div className="relative z-10 flex h-full items-center">
        <div className="px-6 md:px-10 lg:px-16 w-full">
          <div className="mx-auto max-w-6xl">
            <p className="text-neutral-300 tracking-widest uppercase text-xs md:text-sm">
              Midland, TX • Available Worldwide
            </p>
            <h1 className="mt-4 text-4xl md:text-6xl lg:text-7xl font-bold tracking-tight text-white">
              Cinematic Wedding & Portrait Photography
            </h1>
            <p className="mt-4 max-w-2xl text-neutral-300 text-base md:text-lg">
              Honest frames. Editorial polish. Made for people who value story
              over trends.
            </p>
            <div className="mt-8 flex flex-wrap items-center gap-4 md:gap-5">
              {/* Primary: solid + subtle glow */}
              <a
                href="#book"
                className="group relative inline-flex items-center gap-2 rounded-full bg-white px-8 py-3 text-sm font-semibold text-neutral-900 shadow-sm shadow-black/10 ring-1 ring-black/5 transition focus:outline-none focus:ring-2 focus:ring-white/60 hover:shadow-lg hover:shadow-black/20"
              >
                <span className="relative flex items-center gap-2">
                  <span className="tracking-tight">Check Availability</span>
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
                </span>
                <span className="pointer-events-none absolute inset-0 rounded-full bg-gradient-to-r from-white/10 via-white/10 to-white/10 opacity-0 group-hover:opacity-100 transition-opacity" />
                <span className="pointer-events-none absolute -inset-px rounded-full ring-1 ring-black/10" />
              </a>
              {/* Secondary: glass / outline hybrid */}
              <a
                href="#recent-work"
                className="group relative inline-flex items-center gap-2 rounded-full px-8 py-3 text-sm font-semibold text-white/90 ring-1 ring-white/30 hover:ring-white/50 backdrop-blur-md bg-white/10 hover:bg-white/15 focus:outline-none focus:ring-2 focus:ring-white/60"
              >
                <span className="tracking-tight">View Gallery</span>
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
                <span className="pointer-events-none absolute inset-0 rounded-full bg-gradient-to-r from-white/0 via-white/0 to-white/0 group-hover:from-white/5 group-hover:to-white/0 transition-colors" />
              </a>
              {/* Tertiary: pill + animated underline */}
              <a
                href="#services"
                className="relative text-[11px] md:text-xs font-medium text-white/70 hover:text-white px-4 py-1.5 rounded-full overflow-hidden transition group ring-1 ring-white/15 hover:ring-white/30 backdrop-blur-sm"
              >
                <span className="relative z-10">Services</span>
                <span className="pointer-events-none absolute inset-0 bg-gradient-to-r from-white/0 via-white/5 to-white/0 opacity-0 group-hover:opacity-100 transition-opacity" />
                <span className="pointer-events-none absolute bottom-0 left-1/2 -translate-x-1/2 h-px w-0 group-hover:w-8 bg-white/70 transition-all duration-500" />
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Scroll cue */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 text-white/90 text-xs tracking-widest">
        <div className="flex flex-col items-center gap-2">
          <span>SCROLL</span>
          <span className="h-6 w-px bg-white/70 animate-pulse" />
        </div>
      </div>
    </section>
  );
}
