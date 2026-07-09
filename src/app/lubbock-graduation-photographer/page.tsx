import type { Metadata } from "next";
import LocalServicePage, {
  type LocalServicePageContent,
} from "../components/local-service-page";
import { SEO_CONFIG } from "@/config/seo";

const content: LocalServicePageContent = {
  slug: "lubbock-graduation-photographer",
  eyebrow: "Graduation photography in Lubbock, Texas",
  title: "Lubbock Graduation Photos with Personality and Polish",
  introduction: [
    "Graduation marks years of work, late nights, friendships, and change. Your photos should celebrate the achievement without flattening your personality into the same poses everyone else has. Shutter Unit creates graduation portraits in Lubbock that feel confident, editorial, and unmistakably yours.",
    "Sessions are available for Texas Tech University graduates and students at schools throughout the Lubbock area. We plan around campus access, seasonal crowds, wardrobe, light, and the people or details you want included. You receive clear direction throughout, so you can arrive excited even if being photographed is not usually your thing.",
  ],
  image: "/optimized/portraits/golden-3.jpg",
  imageAlt: "Confident editorial portrait by Shutter Unit in West Texas",
  portfolioHref: "/portraits",
  portfolioLabel: "View portrait portfolio",
  highlights: [
    {
      title: "More than cap and gown",
      body: "Classic graduation photographs are included, but the session also makes room for personality, movement, favorite outfits, and portraits that remain useful after graduation.",
    },
    {
      title: "Campus-aware planning",
      body: "Popular Texas Tech landmarks become crowded near commencement. Timing and route planning reduce waiting and create visual variety without spending the session in transit.",
    },
    {
      title: "Individuals or groups",
      body: "Book a focused individual experience or celebrate with friends. Group sessions are paced to include the full group, smaller combinations, and each graduate.",
    },
  ],
  planningTitle: "Celebrate the degree and the person who earned it.",
  planning: [
    {
      title: "Map the story",
      body: "Tell me your school, degree, meaningful campus spaces, extracurriculars, and how you will use the photographs. That context helps us choose a route and build a session that feels personal rather than like a checklist of landmarks.",
    },
    {
      title: "Prepare the details",
      body: "Before the session, we cover outfit options, regalia, cords, stoles, props, and comfortable shoes for moving between locations. Wrinkle-free garments and small practical choices make a visible difference. Confetti or celebratory items must follow campus and location rules.",
    },
    {
      title: "Create a complete portrait set",
      body: "The session balances recognizable graduation frames with clean editorial portraits and candid celebration. Direction is specific and encouraging, from hand placement to movement. The final selection is edited as one cohesive story with natural color and careful skin tones.",
    },
  ],
  locations: [
    "Texas Tech University",
    "Downtown Lubbock",
    "Lubbock Christian University",
    "South Plains College",
    "Wolfforth",
    "Lubbock",
  ],
  faqs: [
    {
      question: "When should I book Texas Tech graduation photos?",
      answer:
        "Book early for spring and fall commencement seasons, especially if you want a weekend or a narrow date range. Earlier scheduling also gives you more choices for light and helps avoid the busiest campus periods.",
    },
    {
      question: "Can my friends or family join the session?",
      answer:
        "Yes. Family members can be included for part of an individual session, and dedicated friend-group sessions are available. Share the number of people when you inquire so enough time can be planned.",
    },
    {
      question: "How many outfits should I bring?",
      answer:
        "One main outfit plus cap and gown is enough for a polished set. A second look can add variety if the session length and location plan allow it. Choosing fewer strong options usually creates a calmer experience than carrying a large wardrobe.",
    },
    {
      question: "Do you photograph graduates who are not at Texas Tech?",
      answer:
        "Absolutely. Shutter Unit photographs college, high school, graduate-school, and professional milestones throughout the Lubbock area and across West Texas.",
    },
  ],
  related: [
    {
      href: "/lubbock-portrait-photographer",
      label: "Lubbock portrait photography",
    },
    {
      href: "/lubbock-engagement-photographer",
      label: "Lubbock engagement photography",
    },
  ],
};

export const metadata: Metadata = {
  title: "Lubbock Graduation Photographer | Texas Tech Portraits",
  description:
    "Editorial graduation photos in Lubbock for Texas Tech and area graduates. Individual and group sessions with confident direction and natural color.",
  alternates: { canonical: `/${content.slug}` },
  openGraph: {
    title: "Lubbock Graduation Photographer | Shutter Unit",
    description:
      "Texas Tech and Lubbock graduation portraits with personality, polished direction, and intentional planning.",
    url: `${SEO_CONFIG.baseUrl}/${content.slug}`,
    images: [{ url: content.image, alt: content.imageAlt }],
  },
};

export default function Page() {
  return <LocalServicePage content={content} />;
}
