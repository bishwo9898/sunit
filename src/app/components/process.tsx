export default function Process() {
  const steps = [
    {
      k: "01",
      title: "Inquire",
      desc: "Share your date, location, priorities, and any inspiration. I respond within 24 hours with availability.",
    },
    {
      k: "02",
      title: "Plan",
      desc: "We refine vision, build a loose timeline, confirm coverage + deliverables. Clear agreement. Deposit secures the date.",
    },
    {
      k: "03",
      title: "Create",
      desc: "Shoot day: gentle direction, real interactions, mix of digital & optional film. Space for organic moments.",
    },
    {
      k: "04",
      title: "Deliver",
      desc: "Preview selects in a few days. Full curated gallery with print store + archival files within stated turnaround.",
    },
  ];

  return (
    <section id="process" className="relative py-24 md:py-32 bg-white">
      {/* subtle background texture */}
      <div
        className="absolute inset-0 pointer-events-none [mask-image:radial-gradient(circle_at_center,black,transparent_90%)] opacity-[0.6]"
        style={{
          background:
            "repeating-linear-gradient(45deg,#f5f5f5_0,#f5f5f5_2px,#ffffff_2px,#ffffff_6px)",
        }}
      />
      <div className="relative px-6 md:px-10 lg:px-16 mx-auto max-w-6xl">
        <div className="max-w-3xl">
          <h2 className="text-3xl md:text-5xl font-bold tracking-tight text-neutral-900 leading-tight">
            The Process
          </h2>
          <p className="mt-5 text-neutral-600 text-base md:text-lg leading-relaxed">
            A calm, intentional flow from first message to final gallery—built
            to keep you informed and free to be present.
          </p>
        </div>

        <ol className="mt-14 relative grid grid-cols-1 md:grid-cols-2 gap-x-14 gap-y-16">
          {/* vertical guideline */}
          <div
            className="hidden md:block absolute left-[34px] top-4 bottom-4 w-px bg-gradient-to-b from-neutral-200 via-neutral-300 to-neutral-200"
            aria-hidden="true"
          />
          {steps.map((s, idx) => (
            <li key={s.k} className="relative flex flex-col max-w-md">
              <div className="flex items-start gap-5">
                <div className="relative">
                  <div className="h-16 w-16 rounded-2xl bg-neutral-50 ring-1 ring-neutral-200 shadow-sm flex items-center justify-center font-medium text-neutral-800 text-lg tracking-wide">
                    {s.k}
                  </div>
                  {/* connecting line for mobile */}
                  {idx < steps.length - 1 && (
                    <span className="md:hidden absolute left-1/2 top-16 -translate-x-1/2 w-px h-10 bg-neutral-200" />
                  )}
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-neutral-900 tracking-tight">
                    {s.title}
                  </h3>
                  <p className="mt-3 text-neutral-600 leading-relaxed text-sm md:text-[15px]">
                    {s.desc}
                  </p>
                </div>
              </div>
            </li>
          ))}
        </ol>

        <div className="mt-16 md:mt-20 flex flex-wrap items-center gap-4 text-sm">
          <div className="inline-flex items-center gap-2 rounded-full bg-neutral-900 text-white px-4 py-2 font-medium shadow-sm">
            Full wedding collection:{" "}
            <span className="font-semibold">story‑driven coverage</span>
          </div>
          <div className="inline-flex items-center gap-2 rounded-full bg-neutral-100 text-neutral-700 px-4 py-2 font-medium ring-1 ring-neutral-200">
            Preview in <span className="font-semibold">3–5 days</span>
          </div>
          <div className="inline-flex items-center gap-2 rounded-full bg-neutral-100 text-neutral-700 px-4 py-2 font-medium ring-1 ring-neutral-200">
            Full delivery <span className="font-semibold">2–3 weeks</span>
          </div>
        </div>
      </div>
    </section>
  );
}
