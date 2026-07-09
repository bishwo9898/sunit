import type { Metadata } from "next";
import LocalServicePage, {
  type LocalServicePageContent,
} from "../components/local-service-page";
import { SEO_CONFIG } from "@/config/seo";

const content: LocalServicePageContent = {
  slug: "lubbock-portrait-photographer",
  eyebrow: "Portrait photography in Lubbock, Texas",
  title: "Lubbock Portrait Photographer for People, Brands, and Milestones",
  introduction: [
    "A strong portrait can feel quiet, bold, polished, vulnerable, or playful—but it should still feel like the person in it. Shutter Unit creates editorial portrait photography in Lubbock for individuals, couples, creatives, graduates, families, and professionals who want more than a generic headshot.",
    "Fortunes Efe combines detailed lighting and skin-tone care with direction that stays human. Sessions can be built for personal branding, creative editorials, professional profiles, family milestones, or simply the experience of being seen well. Each gallery is edited with natural texture, cohesive color, and attention to how the photographs will actually be used.",
  ],
  image: "/optimized/portraits/editorial-sammmy-_07.jpg",
  imageAlt: "Editorial portrait photographed by Shutter Unit in Texas",
  portfolioHref: "/portraits",
  portfolioLabel: "View portrait portfolio",
  highlights: [
    {
      title: "Direction without stiffness",
      body: "Specific guidance for light, expression, posture, and movement helps you look confident while leaving room for the gestures that make the portrait feel personal.",
    },
    {
      title: "Skin-tone care",
      body: "Exposure and color are handled intentionally across a wide range of complexions. Retouching preserves texture and identity rather than erasing them.",
    },
    {
      title: "Built for the final use",
      body: "Brand campaigns, profile photographs, prints, and personal editorials need different framing and variety. The shot plan begins with where the images need to work.",
    },
  ],
  planningTitle: "Portraits with a point of view and a practical plan.",
  planning: [
    {
      title: "Define what the photographs need to say",
      body: "We start with purpose and audience. A creative portrait series can lean into concept and mood; a personal-branding gallery may need warmth, authority, negative space, and several crops. Your references become a shared visual language rather than a script to copy.",
    },
    {
      title: "Shape wardrobe, setting, and light",
      body: "Location and styling are chosen together so they support the same message. Guidance covers colors, layers, texture, accessories, and what to avoid. Depending on the concept, we can work outdoors, in a client space, or in an appropriate indoor setting.",
    },
    {
      title: "Create range without losing cohesion",
      body: "During the session, small changes in position, expression, lens choice, and background build variety efficiently. You are guided throughout and can review direction as we work. Final images are selected and edited to feel like one considered body of work.",
    },
  ],
  locations: [
    "Lubbock",
    "Downtown Lubbock",
    "Texas Tech",
    "Wolfforth",
    "Ransom Canyon",
    "South Plains",
  ],
  faqs: [
    {
      question: "What kinds of portrait sessions do you offer in Lubbock?",
      answer:
        "Sessions include individual portraits, creative editorials, personal branding, professional headshots, couples, families, graduation, and milestone photography. Describe the intended use and visual direction in your inquiry for the best recommendation.",
    },
    {
      question: "I feel awkward in front of a camera. Is that a problem?",
      answer:
        "Not at all. Most clients are not professional models. You receive concrete, easy direction and time to settle in. The goal is confidence and connection, not forcing a performance.",
    },
    {
      question: "Do you provide studio photography?",
      answer:
        "Indoor and studio-style sessions can be arranged depending on the concept, group size, and availability. Some looks can also be created effectively in a client workspace or another controlled interior.",
    },
    {
      question: "Can a business license the photos for marketing?",
      answer:
        "Yes. Commercial and personal-branding projects can include usage suited to websites, social media, press, and campaigns. Because business usage differs from personal portrait rights, the required channels and duration should be discussed before quoting.",
    },
  ],
  related: [
    {
      href: "/lubbock-graduation-photographer",
      label: "Lubbock graduation photography",
    },
    {
      href: "/lubbock-engagement-photographer",
      label: "Lubbock engagement photography",
    },
    {
      href: "/lubbock-wedding-photographer",
      label: "Lubbock wedding photography",
    },
  ],
};

export const metadata: Metadata = {
  title: "Lubbock Portrait Photographer | Editorial & Branding",
  description:
    "Editorial portraits, personal branding, headshots, families, and creative photography in Lubbock with natural skin tones and confident direction.",
  alternates: { canonical: `/${content.slug}` },
  openGraph: {
    title: "Lubbock Portrait Photographer | Shutter Unit",
    description:
      "Portrait photography for people, brands, and milestones with thoughtful lighting and intentional skin-tone care.",
    url: `${SEO_CONFIG.baseUrl}/${content.slug}`,
    images: [{ url: content.image, alt: content.imageAlt }],
  },
};

export default function Page() {
  return <LocalServicePage content={content} />;
}
