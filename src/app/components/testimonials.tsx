export default function Testimonials() {
  const items = [
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

  return (
    <section className="px-6 md:px-10 lg:px-16 py-16 md:py-24">
      <div className="mx-auto max-w-6xl">
        <h2 className="text-3xl md:text-5xl font-bold tracking-tight mb-10">
          Kind Words
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
          {items.map((t, i) => (
            <figure
              key={i}
              className="rounded-2xl border border-white/10 bg-white/5 p-6"
            >
              <blockquote className="text-neutral-200">“{t.quote}”</blockquote>
              <figcaption className="mt-4 text-neutral-400">
                {t.name}
              </figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
}
