import Hero from "@/app/components/hero";
import StickyBook from "../components/sticky-book";
import MasonryGallery from "../components/masonry-gallery"; // already client component
import CTABlock from "../components/cta-block"; // Assuming you have a CTA block component

export const metadata = {
  title: "Midland Texas Wedding Photographer | Shutter Unit",
  description:
    "Documentary + editorial wedding photography in Midland, Odessa, Permian Basin & West Texas. Timeless color, cinematic compositions, and storytelling.",
  alternates: { canonical: "/weddings" },
  openGraph: {
    title: "Wedding Photographer in Midland TX – Shutter Unit",
    description:
      "Full-day wedding stories, engagement sessions, and bridal portraits across Texas.",
    url: "/weddings",
    type: "article",
  },
  keywords: [
    "Midland wedding photographer",
    "Texas wedding photography",
    "West Texas weddings",
    "engagement photos Midland",
    "bridal portraits Midland",
    "Unit Photography",
    "ShutterUnit Photography",
    "Texas photgraphers",
  ],
} as const;

export default async function WeddingsPage() {
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
                name: "Weddings",
                item: "https://www.shutterunit.com/weddings",
              },
            ],
          }),
        }}
      />
      <Hero variant="weddings" />

      {/* Intro / value pillars */}
      <section className="py-24 md:py-32 bg-white">
        <div className="mx-auto max-w-6xl px-6 md:px-10">
          <div className="grid md:grid-cols-3 gap-10 md:gap-14">
            {[
              {
                title: "Editorial + Documentary",
                body: "Guided where it matters—authentic the rest of the time. Direction that preserves energy and story.",
              },
              {
                title: "Timeless Color",
                body: "Natural skin tones, restrained palette, and depth that won't feel dated in 10 years.",
              },
              {
                title: "Archival Delivery",
                body: "Museum-grade print options & multi-location backup. Your visual legacy preserved.",
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

      {/* Wedding Gallery */}
      <div id="wedding-gallery">
        <MasonryGallery
          // Pass both to be safe; gallery component supports string[]
          category={["weddings", "wedding"]}
          lightboxVariant="clean"
          heading="Wedding Stories"
          description="A collage of full-day narratives, luminous portraits & quiet between-moments. Tap to enlarge."
          className="border-t border-neutral-100"
          max={180}
        />
      </div>

      <div id="book" data-aos="fade-up" data-aos-delay="300">
        <CTABlock />
      </div>

      {/* Sticky utility (client) */}
      <StickyBook />
    </>
  );
}
