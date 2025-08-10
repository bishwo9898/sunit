import Link from "next/link";

export default function CTABlock() {
  return (
    <section id="book" className="px-6 md:px-10 lg:px-16 py-16 md:py-24">
      <div className="mx-auto max-w-6xl">
        <div className="rounded-3xl border border-white/10 bg-gradient-to-br from-white/5 to-white/[0.02] p-8 md:p-12">
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-black">
            Ready to make something beautiful?
          </h2>
          <p className="mt-3 text-neutral-300 max-w-2xl">
            Flexible travel, clear communication, and images that feel like you.
          </p>
          <div className="mt-6 flex flex-wrap gap-4">
            <Link
              href="/contact"
              className="inline-flex items-center rounded-full bg-white px-6 py-3 text-sm font-semibold text-black transition hover:bg-neutral-200"
            >
              Contact Me
            </Link>
            <Link
              href="#book"
              className="inline-flex items-center rounded-full bg-white px-6 py-3 text-sm font-semibold text-black transition hover:bg-neutral-200"
            >
              or Sceedule a meeting below
            </Link>
          </div>

          {/* Inline scheduler (Calendly) – uncomment to enable */}
          <div className="mt-10">
            <iframe
              title="Book a session"
              src="https://calendly.com/shutterunitofficial/30min?hide_event_type_details=1&hide_gdpr_banner=1&background_color=0a0a0a&text_color=ffffff&primary_color=ffffff"
              className="w-full h-[700px] rounded-2xl border border-white/10"
              loading="lazy"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
