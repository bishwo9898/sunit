import type { Metadata } from "next";
import LocalServicePage, {
  type LocalServicePageContent,
} from "../components/local-service-page";
import { SEO_CONFIG } from "@/config/seo";

const content: LocalServicePageContent = {
  slug: "lubbock-engagement-photographer",
  eyebrow: "Engagement photography in Lubbock, Texas",
  title: "Lubbock Engagement Photography That Feels Like a Real Date",
  introduction: [
    "An engagement session does not need to be a string of stiff poses. It can feel like an hour set aside to slow down, move through a place you enjoy, and make photographs that reflect how you actually relate to each other. Shutter Unit creates Lubbock engagement photos with cinematic light, honest interaction, and enough direction to help you feel confident.",
    "Whether you want open West Texas landscape, clean city architecture, or a location connected to your relationship, the session is shaped around your energy. The finished gallery mixes wider storytelling frames, close details, and editorial portraits that work beautifully for invitations, wedding websites, prints, and the life you are building beyond the wedding.",
  ],
  image: "/optimized/weddings/eunice-187.jpg",
  imageAlt: "Couple sharing a candid moment during a West Texas photo session",
  portfolioHref: "/weddings",
  portfolioLabel: "See couples and weddings",
  highlights: [
    {
      title: "Comfortable direction",
      body: "You receive simple prompts for movement, posture, and light. There is no need to arrive knowing how to pose or pretending the camera is not there.",
    },
    {
      title: "A location with meaning",
      body: "The strongest setting is one that supports your story and visual style. We balance meaning with practical details such as access, crowds, wind, and sunset.",
    },
    {
      title: "Useful variety",
      body: "A thoughtful pace creates a gallery of candid connection, clean portraits, landscape, and detail—without making the session feel rushed or overproduced.",
    },
  ],
  planningTitle: "A session designed around the two of you.",
  planning: [
    {
      title: "Choose the feeling first",
      body: "Instead of beginning with a list of trendy locations, we begin with tone. Quiet and intimate, playful and urban, elegant and minimal, or windswept and expansive all lead to different choices. Your references help identify the right direction without copying someone else’s session.",
    },
    {
      title: "Plan wardrobe and light together",
      body: "Clothing should feel like you while working with the color and movement of the setting. You receive practical guidance on coordination, texture, footwear, and optional outfit changes. Timing is chosen around the quality of light rather than a generic clock time.",
    },
    {
      title: "Let the session breathe",
      body: "The first few minutes are for settling in. From there, gentle prompts create movement and connection while intentional portrait direction adds polish. If the session is part of wedding coverage, it also builds familiarity so photography feels natural when the wedding day arrives.",
    },
  ],
  locations: [
    "Lubbock",
    "Texas Tech",
    "Downtown Lubbock",
    "Ransom Canyon",
    "Wolfforth",
    "South Plains",
  ],
  faqs: [
    {
      question: "When is the best time for engagement photos in Lubbock?",
      answer:
        "The best time depends on the location and visual direction, but the final hours before sunset often provide softer light and more dimension. Midday or after-dark sessions can also work when a stronger editorial look is planned intentionally.",
    },
    {
      question: "What happens if the West Texas weather turns windy?",
      answer:
        "Some wind can add movement, but severe wind or unsafe weather calls for flexibility. We watch the forecast, consider sheltered or indoor alternatives, and reschedule when conditions would prevent the experience or photographs you booked.",
    },
    {
      question: "Can we include two outfits or more than one location?",
      answer:
        "Often, yes. The best plan depends on session length and travel time. One well-chosen location can create more visual range than expected, while a second setting or outfit can be useful when it adds a genuinely different chapter.",
    },
    {
      question: "Do we need to be engaged to book a couples session?",
      answer:
        "Not at all. The same approach works for anniversaries, proposals, dating milestones, or simply documenting this season of your relationship.",
    },
  ],
  related: [
    {
      href: "/lubbock-wedding-photographer",
      label: "Lubbock wedding photography",
    },
    {
      href: "/lubbock-portrait-photographer",
      label: "Lubbock portrait photography",
    },
  ],
};

export const metadata: Metadata = {
  title: "Lubbock Engagement Photographer | Natural & Cinematic",
  description:
    "Natural, cinematic engagement photography in Lubbock, Texas, with comfortable direction, meaningful locations, and true-to-tone editing.",
  alternates: { canonical: `/${content.slug}` },
  openGraph: {
    title: "Lubbock Engagement Photographer | Shutter Unit",
    description:
      "Engagement sessions with honest connection, cinematic West Texas light, and relaxed editorial direction.",
    url: `${SEO_CONFIG.baseUrl}/${content.slug}`,
    images: [{ url: content.image, alt: content.imageAlt }],
  },
};

export default function Page() {
  return <LocalServicePage content={content} />;
}
