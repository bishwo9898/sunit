import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Contact Photographer in Texas | Book Your Session | Shutter Unit",
  description:
    "Get in touch with photographer in Texas. Book your wedding, portrait, or editorial session. Fast response times, available across Midland, Odessa, Lubbock & Texas.",
  keywords: [
    "contact photographer",
    "book photographer",
    "hire photographer texas",
    "photography services",
    "schedule session",
    "photography inquiry",
  ],
  openGraph: {
    title: "Contact Photographer in Texas | Shutter Unit",
    description:
      "Get in touch to book your photography session. Available for weddings, portraits, events & more.",
    url: "https://www.shutterunit.com/contact",
    type: "website",
    images: [
      {
        url: "https://www.shutterunit.com/optimized/hero/hero1.jpg",
        width: 1200,
        height: 800,
        alt: "Shutter Unit photography portfolio",
      },
    ],
  },
  twitter: {
    title: "Contact Photographer in Texas | Shutter Unit",
    description: "Get in touch to book your photography session.",
    card: "summary_large_image",
    images: ["https://www.shutterunit.com/optimized/hero/hero1.jpg"],
  },
};

export default function ContactLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
