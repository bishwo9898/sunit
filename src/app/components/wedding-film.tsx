type WeddingFilmProps = {
  eyebrow?: string;
  title?: string;
  description?: string;
  align?: "left" | "center";
};

const VIDEO_SRC = "/video/adriaana-isaiah-wedding-film.mp4";
const POSTER_SRC = "/video/adriaana-isaiah-wedding-film-poster.jpg";

export default function WeddingFilm({
  eyebrow = "Wedding Film",
  title = "A moving heirloom from the day",
  description = "Press play for the atmosphere between the photographs: movement, breath, vows, laughter, and the kind of quiet that still feels loud years later.",
  align = "left",
}: WeddingFilmProps) {
  const isCentered = align === "center";

  return (
    <section className="relative isolate overflow-hidden bg-neutral-950 py-16 text-white md:py-24">
      <div
        className="pointer-events-none absolute inset-0 opacity-50"
        style={{
          background:
            "radial-gradient(circle at 20% 10%, rgba(255,255,255,0.16), transparent 34%), radial-gradient(circle at 80% 75%, rgba(255,255,255,0.08), transparent 30%)",
        }}
      />
      <div className="pointer-events-none absolute inset-0 grain opacity-60" />

      <div className="relative mx-auto grid w-full max-w-[1600px] gap-10 px-4 sm:px-6 md:px-10 lg:grid-cols-[0.82fr_1.18fr] lg:items-end lg:px-16">
        <div
          className={`max-w-xl ${
            isCentered ? "lg:mx-auto lg:text-center" : ""
          }`}
          data-aos="fade-up"
        >
          <p className="text-[11px] font-semibold uppercase tracking-[0.32em] text-white/55">
            {eyebrow}
          </p>
          <h2 className="mt-4 font-display text-3xl font-semibold leading-tight tracking-tight text-white md:text-5xl">
            {title}
          </h2>
          <p className="mt-5 text-sm leading-relaxed text-white/60 md:text-base">
            {description}
          </p>
          <div
            className={`mt-8 flex flex-wrap gap-3 ${
              isCentered ? "lg:justify-center" : ""
            }`}
          >
            <span className="rounded-full border border-white/15 px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.2em] text-white/60">
              4 min film
            </span>
            <span className="rounded-full border border-white/15 px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.2em] text-white/60">
              Adriaana & Isaiah
            </span>
          </div>
        </div>

        <div
          className="relative"
          data-aos="fade-up"
          data-aos-delay="120"
        >
          <div className="absolute -inset-x-4 bottom-0 top-10 bg-white/[0.03] blur-3xl" />
          <div className="relative overflow-hidden rounded-lg border border-white/10 bg-black shadow-[0_40px_120px_-55px_rgba(255,255,255,0.35)]">
            <video
              className="aspect-video w-full bg-black object-cover"
              poster={POSTER_SRC}
              controls
              playsInline
              preload="metadata"
            >
              <source src={VIDEO_SRC} type="video/mp4" />
              Your browser does not support the video tag.
            </video>
          </div>
          <div className="mt-4 flex items-center justify-between gap-4 text-[10px] uppercase tracking-[0.24em] text-white/35">
            <span>Motion archive</span>
            <span>Watch with sound</span>
          </div>
        </div>
      </div>
    </section>
  );
}
