import fs from "node:fs/promises";
import path from "node:path";

export default async function Testimonials() {
  async function loadTestimonials() {
    try {
      const p = path.join(process.cwd(), "data", "testimonials.json");
      const raw = await fs.readFile(p, "utf8");
      const json = JSON.parse(raw);
      if (Array.isArray(json) && json.length)
        return json.filter((t: any) => t.visible !== false);
    } catch {}
    return [
      {
        quote:
          "Every photo feels like a memory we can step back into. Thoughtful, calm, and endlessly creative.",
        name: "— Alex & Jordan",
      },
      {
        quote:
          "He captured our day exactly as it felt—joyful and effortless. Our families won’t stop talking about the photos!",
        name: "— Priya & Marco",
      },
      {
        quote:
          "The portrait session was a blast and the edits look like a magazine spread.",
        name: "— Taylor",
      },
    ];
  }
  const items = await loadTestimonials();

  return (
    <section className="relative px-6 md:px-10 lg:px-16 py-16 md:py-24">
      {/* minimal, clean backdrop */}
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-white" />
        <div
          className="absolute inset-0 opacity-[0.35]"
          style={{
            background:
              "radial-gradient(60rem 30rem at 18% 8%,rgba(0,0,0,0.035),transparent 70%),radial-gradient(46rem 22rem at 82% 88%,rgba(0,0,0,0.03),transparent 70%)",
          }}
        />
      </div>
      <div className="mx-auto max-w-6xl">
        <div className="mb-10 md:mb-14 text-center">
          <div className="text-[11px] md:text-xs tracking-[0.28em] uppercase text-neutral-400">
            Testimonials
          </div>
          <h2 className="mt-2 text-3xl md:text-5xl font-semibold md:font-bold tracking-tight text-neutral-950">
            Kind Words
          </h2>
          <div className="mx-auto mt-4 h-[2px] w-24 rounded-full bg-neutral-900/70" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
          {items.map((t, i) => (
            <figure
              key={i}
              data-aos="fade-up"
              data-aos-delay={Math.min(i * 80, 320)}
              className="group relative overflow-hidden rounded-2xl bg-white ring-1 ring-neutral-200/70 shadow-sm p-6 md:p-7 lg:p-8 transition-transform duration-300 ease-out hover:-translate-y-[2px] hover:shadow-md h-full flex flex-col"
            >
              {/* left accent bar */}
              <div className="pointer-events-none absolute left-0 top-0 h-full w-[3px] bg-gradient-to-b from-neutral-900/70 via-neutral-900/30 to-transparent" />

              {/* decorative large quotes */}
              <span className="pointer-events-none absolute -top-3 left-3 text-6xl md:text-7xl font-serif text-neutral-900/10 select-none">
                “
              </span>
              <span className="pointer-events-none absolute -bottom-6 right-4 text-6xl md:text-7xl font-serif text-neutral-900/5 select-none">
                ”
              </span>

              <blockquote className="relative text-neutral-800 text-[15px] md:text-[17px] leading-relaxed md:leading-[1.85] italic tracking-[0.005em]">
                {t.quote}
              </blockquote>

              <div className="mt-5 pt-5 border-t border-neutral-200/70">
                <figcaption className="text-[12px] md:text-sm font-medium tracking-wide text-neutral-600">
                  {t.name}
                </figcaption>
              </div>
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
}
