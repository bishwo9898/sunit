import Link from "next/link";
import Image from "next/image";

// Elevated, minimal category showcase with refined overlays & micro-interactions
export default function CategoryTiles() {
  const tiles = [
    {
      href: "optimized/weddings",
      title: "Weddings",
      subtitle: "Cinematic • candid • timeless",
      src: "/hero/hero3.webp",
      alt: "Wedding couple embracing under flowing veil",
    },
    {
      href: "optimized/portraits",
      title: "Portraits",
      subtitle: "Editorial meets personal",
      src: "/hero/hero2.webp",
      alt: "Creative portrait with expressive gesture",
    },
  ];

  return (
    <section className="relative py-16 md:py-24">
      {/* Subtle radial backdrop to lift section (no harsh box) */}
      <div className="pointer-events-none absolute inset-0 opacity-[0.35] [background:radial-gradient(circle_at_50%_10%,#f6f6f6,transparent_60%)]" />
      <div className="relative w-full max-w-[2000px] mx-auto px-4 sm:px-6 md:px-10 lg:px-12 xl:px-16">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-8 mb-10 md:mb-14">
          <div className="max-w-xl">
            <h2 className="font-displaytext-3xl md:text-5xl font-semibold tracking-tight leading-tight">
              Explore Collections
            </h2>
            <p className="mt-4 text-sm md:text-base text-neutral-600 leading-relaxed">
              Distinct bodies of work—each curated for tone, pacing, and
              emotional narrative. Choose a path to dive deeper.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 md:gap-8 xl:gap-10">
          {tiles.map((t, i) => (
            <Link
              key={t.href}
              href={t.href}
              aria-label={`${t.title} – ${t.subtitle}`}
              className="group relative aspect-[5/4] md:aspect-[4/3] overflow-hidden rounded-[2rem] isolate focus:outline-none focus-visible:ring-2 focus-visible:ring-neutral-900/40"
            >
              {/* Image */}
              <Image
                src={t.src}
                alt={t.alt}
                fill
                priority={i === 0}
                sizes="(max-width:768px) 100vw, (max-width:1400px) 50vw, 900px"
                className="object-cover object-center transition-transform duration-[1400ms] ease-[cubic-bezier(.22,1,.22,1)] group-hover:scale-[1.06]"
              />

              {/* Ambient overlays */}
              <div className="absolute inset-0 bg-neutral-900/0 group-hover:bg-neutral-900/10 transition-colors duration-700" />
              <div className="absolute inset-0 bg-[linear-gradient(to_top,rgba(0,0,0,.55),rgba(0,0,0,.15),rgba(0,0,0,0))]" />
              {/* Soft edge vignette */}
              <div className="absolute inset-0 [mask:radial-gradient(circle_at_center,black_60%,transparent_100%)] bg-black/10 mix-blend-multiply" />

              {/* Gradient ring accent using ::after mimic */}
              <div className="absolute inset-0 rounded-[2rem] ring-1 ring-white/10 group-hover:ring-white/20 transition" />
              <div className="pointer-events-none absolute -inset-px rounded-[2.1rem] opacity-0 group-hover:opacity-100 transition duration-700 [background:linear-gradient(120deg,#ffffff40,transparent_30%,transparent_70%,#ffffff30)]" />

              {/* Content panel */}
              <div className="absolute left-0 right-0 bottom-0 p-6 md:p-8 lg:p-10 flex">
                <div className="relative z-10 max-w-sm">
                  <div className="inline-block rounded-xl bg-white/6 backdrop-blur-md px-5 py-4 md:px-6 md:py-5 shadow-[0_4px_18px_-6px_rgba(0,0,0,0.35)] ring-1 ring-white/15 group-hover:bg-white/8 transition-colors">
                    <h3 className="font-display text-white text-2xl md:text-3xl font-semibold tracking-tight leading-snug">
                      {t.title}
                    </h3>
                    <p className="mt-1 text-[13px] md:text-sm font-medium tracking-wide text-white/70">
                      {t.subtitle}
                    </p>
                    <span className="mt-4 inline-flex items-center gap-1 text-xs md:text-[13px] font-semibold uppercase tracking-[0.14em] text-white/80 group-hover:text-white transition-colors">
                      View {t.title}
                      <svg
                        className="w-3.5 h-3.5 translate-x-0 group-hover:translate-x-1 transition-transform duration-300"
                        viewBox="0 0 20 20"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <path d="M5 10h10" />
                        <path d="M11 6l4 4-4 4" />
                      </svg>
                    </span>
                  </div>
                </div>
              </div>

              {/* Lift / depth shadows */}
              <div className="absolute inset-0 rounded-[2rem] shadow-[0_30px_60px_-25px_rgba(0,0,0,0.35),0_8px_18px_-8px_rgba(0,0,0,0.25)] opacity-60 group-hover:opacity-80 transition-opacity" />
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
