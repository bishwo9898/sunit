import Image from "next/image";
import { loadManifest } from "@/utils/manifest.server";

export type HeroVariant = "home" | "portraits" | "weddings";

interface HeroProps {
  variant?: HeroVariant;
}

// Unified Hero component with variant-specific copy & layout while sharing slide selection logic.
export default async function Hero({ variant = "home" }: HeroProps) {
  const manifest = await loadManifest();

  // Slide pools by variant
  let slides: any[] = [];
  if (variant === "home") {
    // Only use images explicitly assigned by admin (tag: 'hero')
    slides = manifest.filter(
      (m) =>
        (m.tags || []).includes("hero") &&
        (m.src?.startsWith("/optimized/portraits/") ||
          m.src?.startsWith("/optimized/weddings/"))
    );
  } else if (variant === "portraits") {
    // Only images tagged 'portraits-hero' and inside portraits folder
    slides = manifest.filter(
      (m) =>
        (m.tags || []).includes("portraits-hero") &&
        m.src?.startsWith("/optimized/portraits/")
    );
  } else if (variant === "weddings") {
    // Only images tagged 'weddings-hero' and inside weddings folder
    slides = manifest.filter(
      (m) =>
        (m.tags || []).includes("weddings-hero") &&
        m.src?.startsWith("/optimized/weddings/")
    );
  }

  // Variant specific UI config
  const config = {
    home: {
      outer: "relative h-[88vh] md:h-screen w-full overflow-hidden",
      gradient: "from-black/60 via-black/20",
      contentWrapper: "flex h-full items-center",
      tagline: "Midland, TX • Available Worldwide",
      heading: "Cinematic Wedding & Portrait Photography",
      sub: "Honest frames. Editorial polish. Made for people who value story over trends.",
      ctas: (
        <div className="mt-8 flex flex-wrap items-center gap-4 md:gap-5">
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
          <a
            href="#services"
            className="relative text-[11px] md:text-xs font-medium text-white/70 hover:text-white px-4 py-1.5 rounded-full overflow-hidden transition group ring-1 ring-white/15 hover:ring-white/30 backdrop-blur-sm"
          >
            <span className="relative z-10">Services</span>
            <span className="pointer-events-none absolute inset-0 bg-gradient-to-r from-white/0 via-white/5 to-white/0 opacity-0 group-hover:opacity-100 transition-opacity" />
            <span className="pointer-events-none absolute bottom-0 left-1/2 -translate-x-1/2 h-px w-0 group-hover:w-8 bg-white/70 transition-all duration-500" />
          </a>
        </div>
      ),
      bottomSpacing: "bottom-6",
    },
    portraits: {
      outer:
        "relative h-[82vh] sm:h-[86vh] md:h-[92vh] min-h-[480px] w-full overflow-hidden",
      gradient: "from-black/70 via-black/25",
      contentWrapper: "flex h-full items-end pb-12 sm:pb-14 md:pb-24",
      tagline: "Portrait Sessions",
      heading: "Editorial & Honest Portraiture",
      sub: "Direction where it serves you—authentic in-between frames the rest of the time. Natural color, luminous skin tones, and a cinematic stillness.",
      ctas: (
        <div className="mt-6 md:mt-8 flex flex-wrap items-center gap-3 md:gap-5">
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
            className="group relative inline-flex items-center gap-2 rounded-full px-7 md:px-8 py-3 text-sm font-semibold text-white/90 ring-1 ring-white/30 hover:ring-white/50 backdrop-blur-md bg-white/10 hover:bg-white/15 focus:outline-none focus:ring-2 focus:ring-white/60"
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
      ),
      bottomSpacing: "bottom-4 sm:bottom-6",
    },
    weddings: {
      outer:
        "relative h-[82vh] sm:h-[86vh] md:h-[92vh] min-h-[480px] w-full overflow-hidden",
      gradient: "from-black/70 via-black/25",
      contentWrapper: "flex h-full items-end pb-12 sm:pb-14 md:pb-24",
      tagline: "Wedding Collections",
      heading: "Intentional Storytelling for Modern Celebrations",
      sub: "Editorial finesse meets documentary honesty—quiet in-between moments, architectural context, luminous skin tones, and timeless color that ages with grace.",
      ctas: (
        <div className="mt-6 md:mt-8 flex flex-wrap items-center gap-3 md:gap-5">
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
            className="group relative inline-flex items-center gap-2 rounded-full px-7 md:px-8 py-3 text-sm font-semibold text-white/90 ring-1 ring-white/30 hover:ring-white/50 backdrop-blur-md bg-white/10 hover:bg-white/15 focus:outline-none focus:ring-2 focus:ring-white/60"
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
      ),
      bottomSpacing: "bottom-4 sm:bottom-6",
    },
  } as const;

  const v = config[variant];

  return (
    <section className={v.outer}>
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
      <div
        className={`absolute inset-0 bg-gradient-to-t ${v.gradient} to-transparent`}
      />
      <div className="pointer-events-none absolute inset-0 grain" />
      <div className={`relative z-10 ${v.contentWrapper}`}>
        <div
          className={
            variant === "home"
              ? "px-6 md:px-10 lg:px-16 w-full"
              : "px-4 sm:px-6 md:px-12 lg:px-20 w-full"
          }
        >
          <div
            className={
              variant === "home"
                ? "mx-auto max-w-6xl"
                : "max-w-3xl sm:max-w-4xl"
            }
          >
            <p
              className={
                variant === "home"
                  ? "text-neutral-300 tracking-widest uppercase text-xs md:text-sm"
                  : "text-neutral-300 tracking-[0.3em] uppercase text-[10px] sm:text-[11px] md:text-xs"
              }
            >
              {v.tagline}
            </p>
            <h1
              className={
                variant === "home"
                  ? "mt-4 text-4xl md:text-6xl lg:text-7xl font-bold tracking-tight text-white"
                  : "mt-4 font-display text-[clamp(2.05rem,6.8vw,3.4rem)] md:text-6xl lg:text-7xl font-bold tracking-tight text-white leading-[1.06]"
              }
            >
              {v.heading}
            </h1>
            <p
              className={
                variant === "home"
                  ? "mt-4 max-w-2xl text-neutral-300 text-base md:text-lg"
                  : "mt-3 md:mt-5 max-w-2xl text-neutral-300 text-[13px] sm:text-[15px] md:text-lg leading-relaxed"
              }
            >
              {v.sub}
            </p>
            {v.ctas}
          </div>
        </div>
      </div>
      <div
        className={`absolute ${
          v.bottomSpacing
        } left-1/2 -translate-x-1/2 text-white/90 ${
          variant === "home"
            ? "text-xs tracking-widest"
            : "text-[10px] sm:text-[11px] tracking-[0.25em] hidden sm:flex"
        }`}
      >
        <div className="flex flex-col items-center gap-2">
          <span>SCROLL</span>
          <span
            className={
              variant === "home"
                ? "h-6 w-px bg-white/70 animate-pulse"
                : "h-5 sm:h-6 w-px bg-white/70 animate-pulse"
            }
          />
        </div>
      </div>
    </section>
  );
}
