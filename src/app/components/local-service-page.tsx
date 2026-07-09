import Image from "next/image";
import Link from "next/link";
import { SEO_CONFIG } from "@/config/seo";

export type LocalServicePageContent = {
  slug: string;
  eyebrow: string;
  title: string;
  introduction: string[];
  image: string;
  imageAlt: string;
  portfolioHref: string;
  portfolioLabel: string;
  highlights: Array<{ title: string; body: string }>;
  planningTitle: string;
  planning: Array<{ title: string; body: string }>;
  locations: string[];
  faqs: Array<{ question: string; answer: string }>;
  related: Array<{ href: string; label: string }>;
};

export default function LocalServicePage({
  content,
}: {
  content: LocalServicePageContent;
}) {
  const url = `${SEO_CONFIG.baseUrl}/${content.slug}`;
  const structuredData = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Service",
        "@id": `${url}#service`,
        name: content.title,
        url,
        description: content.introduction.join(" "),
        serviceType: content.eyebrow,
        provider: { "@id": `${SEO_CONFIG.baseUrl}/#business` },
        areaServed: {
          "@type": "City",
          name: "Lubbock",
          containedInPlace: { "@type": "State", name: "Texas" },
        },
      },
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          {
            "@type": "ListItem",
            position: 1,
            name: "Home",
            item: SEO_CONFIG.baseUrl,
          },
          {
            "@type": "ListItem",
            position: 2,
            name: content.title,
            item: url,
          },
        ],
      },
      {
        "@type": "FAQPage",
        mainEntity: content.faqs.map((faq) => ({
          "@type": "Question",
          name: faq.question,
          acceptedAnswer: {
            "@type": "Answer",
            text: faq.answer,
          },
        })),
      },
    ],
  };

  return (
    <main className="bg-[#faf9f7] text-neutral-900">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(structuredData).replace(/</g, "\\u003c"),
        }}
      />

      <section className="px-6 py-20 md:px-12 md:py-28 lg:px-20">
        <div className="mx-auto grid max-w-7xl items-center gap-12 lg:grid-cols-12 lg:gap-20">
          <div className="lg:col-span-7">
            <p className="text-xs font-semibold uppercase tracking-[0.28em] text-neutral-500">
              {content.eyebrow}
            </p>
            <h1 className="mt-5 max-w-4xl font-display text-5xl font-semibold leading-[1.04] tracking-tight md:text-7xl">
              {content.title}
            </h1>
            <div className="mt-8 max-w-3xl space-y-5 text-base leading-8 text-neutral-600 md:text-lg">
              {content.introduction.map((paragraph) => (
                <p key={paragraph}>{paragraph}</p>
              ))}
            </div>
            <div className="mt-9 flex flex-wrap gap-4">
              <Link
                href="/contact"
                className="rounded-full bg-neutral-900 px-7 py-3 text-sm font-semibold text-white transition hover:bg-neutral-700"
              >
                Check availability
              </Link>
              <Link
                href={content.portfolioHref}
                className="rounded-full border border-neutral-300 bg-white px-7 py-3 text-sm font-semibold text-neutral-900 transition hover:border-neutral-500"
              >
                {content.portfolioLabel}
              </Link>
            </div>
          </div>
          <div className="relative aspect-[4/5] overflow-hidden rounded-[2rem] lg:col-span-5">
            <Image
              src={content.image}
              alt={content.imageAlt}
              fill
              priority
              sizes="(min-width: 1024px) 38vw, 90vw"
              className="object-cover"
            />
          </div>
        </div>
      </section>

      <section className="border-y border-neutral-200 bg-white px-6 py-20 md:px-12 lg:px-20">
        <div className="mx-auto max-w-7xl">
          <div className="grid gap-8 md:grid-cols-3">
            {content.highlights.map((highlight) => (
              <article key={highlight.title}>
                <h2 className="font-display text-2xl font-semibold">
                  {highlight.title}
                </h2>
                <p className="mt-4 leading-7 text-neutral-600">
                  {highlight.body}
                </p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="px-6 py-20 md:px-12 md:py-28 lg:px-20">
        <div className="mx-auto grid max-w-7xl gap-12 lg:grid-cols-12">
          <div className="lg:col-span-4">
            <p className="text-xs font-semibold uppercase tracking-[0.25em] text-neutral-500">
              A local, thoughtful process
            </p>
            <h2 className="mt-4 font-display text-4xl font-semibold leading-tight md:text-5xl">
              {content.planningTitle}
            </h2>
          </div>
          <div className="space-y-10 lg:col-span-7 lg:col-start-6">
            {content.planning.map((section, index) => (
              <article
                key={section.title}
                className="border-b border-neutral-200 pb-10"
              >
                <p className="text-xs font-semibold text-neutral-400">
                  0{index + 1}
                </p>
                <h3 className="mt-2 font-display text-3xl font-semibold">
                  {section.title}
                </h3>
                <p className="mt-4 leading-8 text-neutral-600">
                  {section.body}
                </p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-neutral-900 px-6 py-20 text-white md:px-12 lg:px-20">
        <div className="mx-auto grid max-w-7xl gap-10 md:grid-cols-2">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.25em] text-neutral-400">
              Serving Lubbock and nearby
            </p>
            <h2 className="mt-4 max-w-xl font-display text-4xl font-semibold">
              Familiar with West Texas light, weather, and wide-open space.
            </h2>
          </div>
          <div>
            <p className="leading-8 text-neutral-300">
              Sessions are available throughout Lubbock and the South Plains,
              with travel across West Texas. Final locations are selected for
              the right light, access, visual character, and fit for your
              story—not simply because a spot is popular.
            </p>
            <ul className="mt-7 flex flex-wrap gap-3">
              {content.locations.map((location) => (
                <li
                  key={location}
                  className="rounded-full border border-white/20 px-4 py-2 text-sm text-neutral-200"
                >
                  {location}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      <section className="bg-white px-6 py-20 md:px-12 md:py-28 lg:px-20">
        <div className="mx-auto max-w-4xl">
          <p className="text-xs font-semibold uppercase tracking-[0.25em] text-neutral-500">
            Questions
          </p>
          <h2 className="mt-4 font-display text-4xl font-semibold md:text-5xl">
            Lubbock photography FAQ
          </h2>
          <div className="mt-10 divide-y divide-neutral-200 border-y border-neutral-200">
            {content.faqs.map((faq) => (
              <details key={faq.question} className="group py-6">
                <summary className="cursor-pointer list-none pr-8 text-lg font-semibold">
                  {faq.question}
                </summary>
                <p className="mt-4 max-w-3xl leading-8 text-neutral-600">
                  {faq.answer}
                </p>
              </details>
            ))}
          </div>
        </div>
      </section>

      <section className="px-6 py-20 text-center md:px-12 md:py-24">
        <h2 className="font-display text-4xl font-semibold md:text-5xl">
          Ready to make photographs that feel like you?
        </h2>
        <p className="mx-auto mt-5 max-w-2xl leading-8 text-neutral-600">
          Tell me about your date, location, and what matters most. I’ll reply
          with availability and the next steps for planning.
        </p>
        <Link
          href="/contact"
          className="mt-8 inline-flex rounded-full bg-neutral-900 px-8 py-3 text-sm font-semibold text-white transition hover:bg-neutral-700"
        >
          Start your inquiry
        </Link>
        <nav
          aria-label="Related Lubbock photography services"
          className="mt-10 flex flex-wrap justify-center gap-x-6 gap-y-3 text-sm"
        >
          {content.related.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="underline decoration-neutral-300 underline-offset-4 hover:decoration-neutral-800"
            >
              {link.label}
            </Link>
          ))}
        </nav>
      </section>
    </main>
  );
}
