import Hero from "@/app/components/hero";
import MasonryGallery from "../components/masonry-gallery";
import StickyBook from "../components/sticky-book";
import CTABlock from "../components/cta-block";

export const metadata = {
  title: "Midland Texas Portrait Photographer | Shutter Unit",
  description:
    "Editorial & natural-light portrait photography for individuals, creatives, families & grads in Midland, Odessa & West Texas.",
  alternates: { canonical: "/portraits" },
  openGraph: {
    title: "Portrait Photographer in Midland TX – Shutter Unit",
    description:
      "Candid + guided portrait sessions with true-to-tone color and subtle retouching.",
    url: "/portraits",
    type: "article",
  },
  keywords: [
    "Midland portrait photographer",
    "Texas portrait photography",
    "branding photographer Midland",
    "family portraits Midland",
    "graduation photos Midland",
    "Unit Photography",
    "ShutterUnit Photography",
    "Texas photgraphers",
  ],
} as const;

export default async function PortraitsPage() {
  return (
    <>
      {/* Breadcrumb JSON-LD */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "BreadcrumbList",
            itemListElement: [
              {
                "@type": "ListItem",
                position: 1,
                name: "Home",
                item: "https://www.shutterunit.com/",
              },
              {
                "@type": "ListItem",
                position: 2,
                name: "Portraits",
                item: "https://www.shutterunit.com/portraits",
              },
            ],
          }),
        }}
      />
      <Hero variant="portraits" />

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
