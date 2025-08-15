import Hero from "@/app/components/hero";
import CategoryTiles from "@/app/components/category-tiles";
import Services from "@/app/components/services";
//import BeforeAfter from "@/app/components/before-after";
import Process from "@/app/components/process";
import Testimonials from "@/app/components/testimonials";
import CTABlock from "@/app/components/cta-block";
import StickyBook from "@/app/components/sticky-book";
import MasonryGallery from "@/app/components/masonry-gallery";

export const metadata = {
  title: "Midland Texas Wedding & Portrait Photographer | Shutter Unit",
  description:
    "Award-winning wedding & portrait photographer serving Midland, Odessa, West Texas & beyond. Editorial, cinematic, true-to-color imagery. Inquire today.",
  alternates: { canonical: "/" },
  openGraph: {
    title: "Shutter Unit – Midland TX Photographer",
    description:
      "Wedding, portrait & editorial photography in Midland, Odessa & West Texas.",
    url: "/",
    type: "website",
  },
  keywords: [
    "Midland Texas photographer",
    "Texas wedding photographer",
    "Midland portraits",
    "Unit Photography",
    "ShutterUnit Photography",
    "West Texas photographer",
    "Permian Basin photographer",
    "Texas photgraphers",
    "Texas middleland photopgrapher",
  ],
} as const;

export default function HomePage() {
  return (
    <main className="min-h-screen w-full">
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
            ],
          }),
        }}
      />
      <Hero />
      <div data-aos="fade-up" data-aos-delay="50">
        <CategoryTiles />
      </div>
      {/* Unified gallery styling across site using MasonryGallery */}
      <div id="recent-work">
        <MasonryGallery
          heading="See my work"
          description="A living collage—weddings, portraits & recent commissions. Tap to enlarge."
          lightboxVariant="clean"
          collection="home"
          max={140}
        />
      </div>
      {/* <section className="px-6 md:px-10 lg:px-16 py-16 md:py-24">
        <div className="mx-auto max-w-6xl">
          <h2 className="text-3xl md:text-5xl font-bold tracking-tight mb-6">
            Featured Stories
          </h2>
          <p className="text-neutral-400 max-w-2xl mb-10">
            A few recent favorites—from intimate elopements to character-driven
            portraits.
          </p>
          {/* Placeholder for stories – wire to CMS later 
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
            <div className="group relative overflow-hidden rounded-2xl bg-neutral-900 aspect-[4/5]">
              <div className="absolute inset-0 bg-[url('/hero/hero1.webp')] bg-cover bg-center transition-transform duration-700 group-hover:scale-105" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
              <div className="absolute bottom-0 p-5">
                <h3 className="text-white text-xl font-semibold">
                  Marfa Sunset Elopement
                </h3>
                <p className="text-white/70 text-sm">West Texas • 48 frames</p>
              </div>
            </div>
            <div className="group relative overflow-hidden rounded-2xl bg-neutral-900 aspect-[4/5]">
              <div className="absolute inset-0 bg-[url('/hero/hero2.webp')] bg-cover bg-center transition-transform duration-700 group-hover:scale-105" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
              <div className="absolute bottom-0 p-5">
                <h3 className="text-white text-xl font-semibold">
                  Downtown Portrait Series
                </h3>
                <p className="text-white/70 text-sm">Midland, TX • 24 frames</p>
              </div>
            </div>
            <div className="group relative overflow-hidden rounded-2xl bg-neutral-900 aspect-[4/5]">
              <div className="absolute inset-0 bg-[url('/hero/hero3.webp')] bg-cover bg-center transition-transform duration-700 group-hover:scale-105" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
              <div className="absolute bottom-0 p-5">
                <h3 className="text-white text-xl font-semibold">
                  Austin Rooftop Wedding
                </h3>
                <p className="text-white/70 text-sm">Austin, TX • 60 frames</p>
              </div>
            </div>
          </div>
        </div>
      </section> */}
      <div data-aos="fade-up" data-aos-delay="100">
        <Services />
      </div>
      {/* Before/After retouch example */}
      {/* <section
        className="px-6 md:px-10 lg:px-16 py-12 md:py-20"
        data-aos="fade-up"
        data-aos-delay="150"
      >
        <div className="mx-auto max-w-6xl">
          <h2 className="text-3xl md:text-5xl font-bold tracking-tight mb-6">
            Before & After
          </h2>
          <p className="text-neutral-400 max-w-2xl mb-6">
            Subtle retouching that keeps skin natural and color true to the
            scene.
          </p>
          <BeforeAfter
            before="/hero/hero2.webp"
            after="/hero/hero3.webp"
            alt="Retouch example"
          />
        </div>
      </section> */}

      <div data-aos="fade-up" data-aos-delay="200">
        <Process />
      </div>
      <div data-aos="fade-up" data-aos-delay="250">
        <Testimonials />
      </div>
      <div id="book" data-aos="fade-up" data-aos-delay="300">
        <CTABlock />
      </div>
      <StickyBook />
    </main>
  );
}
