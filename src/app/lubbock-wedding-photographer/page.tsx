import type { Metadata } from "next";
import LocalServicePage, {
  type LocalServicePageContent,
} from "../components/local-service-page";
import { SEO_CONFIG } from "@/config/seo";

const content: LocalServicePageContent = {
  slug: "lubbock-wedding-photographer",
  eyebrow: "Wedding photography in Lubbock, Texas",
  title: "Lubbock Wedding Photographer for Honest, Cinematic Stories",
  introduction: [
    "Your wedding photographs should hold more than a record of who stood where. They should bring back the nervous energy before the ceremony, the look across the room, the voices at dinner, and the joy when everyone finally reaches the dance floor. Shutter Unit photographs Lubbock weddings with documentary awareness and an editorial eye.",
    "Fortunes Efe blends calm direction with space for real moments to unfold. The result is a cohesive gallery with natural skin tones, thoughtful composition, and the atmosphere of your day intact. Coverage is available for weddings in Lubbock, throughout the South Plains, and across Texas.",
  ],
  image: "/optimized/weddings/eunice-224.jpg",
  imageAlt: "Bride photographed by Shutter Unit at a West Texas wedding",
  portfolioHref: "/weddings",
  portfolioLabel: "View wedding portfolio",
  highlights: [
    {
      title: "Documentary attention",
      body: "The unscripted parts of the day matter: family reactions, movement, room energy, and the quiet transitions that make a wedding personal.",
    },
    {
      title: "Editorial portraits",
      body: "Clear, encouraging direction creates polished portraits without turning the day into a long production or asking you to perform.",
    },
    {
      title: "Intentional skin tones",
      body: "Mixed lighting and different complexions are handled carefully so every person looks dimensional, natural, and true to the celebration.",
    },
  ],
  planningTitle: "Wedding coverage built around your day—not a template.",
  planning: [
    {
      title: "Begin with priorities",
      body: "Planning starts with the people, traditions, and moments you care about most. We discuss your venue, ceremony, family dynamics, creative references, and how you want the day to feel before recommending coverage.",
    },
    {
      title: "Build a photography-friendly timeline",
      body: "West Texas light changes quickly, and Lubbock weather can have a personality of its own. Timeline guidance protects breathing room for portraits while keeping photography from taking over the experience. A practical rain or wind alternative is considered when needed.",
    },
    {
      title: "Photograph presence, not perfection",
      body: "On the wedding day, Fortunes moves between gentle direction and observation. Formal groups are organized efficiently; the ceremony and reception are documented with restraint; portraits feel composed but alive. Preview images arrive in a few days, followed by a carefully edited gallery.",
    },
  ],
  locations: [
    "Lubbock",
    "Wolfforth",
    "Ransom Canyon",
    "Slaton",
    "Levelland",
    "South Plains",
  ],
  faqs: [
    {
      question: "How far in advance should we book a Lubbock wedding photographer?",
      answer:
        "Popular spring and fall dates can fill many months ahead, so reaching out once you have a date and venue is wise. If your wedding is soon, inquire anyway—availability changes and weekday or intimate celebrations may still be open.",
    },
    {
      question: "Do you photograph weddings outside Lubbock?",
      answer:
        "Yes. Shutter Unit serves the South Plains, Midland–Odessa, and destinations across Texas. Share your venue and schedule in the inquiry so travel can be included clearly in the proposal.",
    },
    {
      question: "Can you photograph interracial couples and a wide range of skin tones?",
      answer:
        "Yes. Skin tone care is a central part of the Shutter Unit approach. Exposure, lighting, and color are handled with intention so lighter and darker complexions remain natural and beautifully represented in the same frame.",
    },
    {
      question: "Do you offer engagement sessions or wedding film?",
      answer:
        "Engagement photography is available and is a useful way to become comfortable in front of the camera before the wedding. Film and motion options depend on the date and scope; mention both photography and video in your inquiry.",
    },
  ],
  related: [
    {
      href: "/lubbock-engagement-photographer",
      label: "Lubbock engagement photography",
    },
    {
      href: "/lubbock-portrait-photographer",
      label: "Lubbock portrait photography",
    },
  ],
};

export const metadata: Metadata = {
  title: "Lubbock Wedding Photographer | Cinematic & Documentary",
  description:
    "Lubbock wedding photographer Fortunes Efe creates cinematic, documentary wedding photographs with editorial portraits and intentional skin tones.",
  alternates: { canonical: `/${content.slug}` },
  openGraph: {
    title: "Lubbock Wedding Photographer | Shutter Unit",
    description:
      "Honest wedding moments, editorial portraits, and cinematic color for celebrations in Lubbock and across West Texas.",
    url: `${SEO_CONFIG.baseUrl}/${content.slug}`,
    images: [{ url: content.image, alt: content.imageAlt }],
  },
};

export default function Page() {
  return <LocalServicePage content={content} />;
}
