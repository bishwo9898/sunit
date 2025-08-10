import type { Metadata } from "next";
import "./globals.css";
import Navbar from "./components/navbar";
import Footer from "./components/footer";
import { Plus_Jakarta_Sans, Playfair_Display } from "next/font/google";
import Script from "next/script";

// Font pairing: Playfair Display for high-impact headings, Plus Jakarta Sans for UI & body
const bodyFont = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
});
const displayFont = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-display",
  display: "swap",
  weight: ["500", "600", "700"],
});

const siteName = "Shutter Unit";
const baseUrl = "https://www.shutterunit.com"; // adjust if deploying under different domain
const defaultDesc =
  "Shutter Unit – Midland, Texas wedding & portrait photographer. Timeless, cinematic imagery for modern celebrations, portraits, branding & editorial.";

export const metadata: Metadata = {
  metadataBase: new URL(baseUrl),
  title: {
    default: `${siteName} | Midland Texas Wedding & Portrait Photographer`,
    template: `%s | ${siteName}`,
  },
  description: defaultDesc,
  applicationName: siteName,
  keywords: [
    "Midland Texas photographer",
    "Texas wedding photographer",
    "Midland portraits",
    "Shutter Unit",
    "editorial wedding photography",
    "documentary wedding photographer",
    "West Texas photographer",
    "personal branding photographer",
    "engagement photos Midland",
  ],
  authors: [{ name: "Shutter Unit" }],
  creator: "Shutter Unit",
  publisher: "Shutter Unit",
  openGraph: {
    type: "website",
    url: baseUrl,
    siteName,
    title: `${siteName} | Midland Texas Wedding & Portrait Photographer`,
    description: defaultDesc,
    locale: "en_US",
    images: [
      {
        url: `/optimized/hero/hero1.jpg`,
        width: 1200,
        height: 800,
        alt: `${siteName} portfolio cover`,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    creator: "@shutterunit", // update if a real handle exists
    title: `${siteName} | Midland Texas Wedding & Portrait Photographer`,
    description: defaultDesc,
    images: [
      {
        url: `/optimized/hero/hero1.jpg`,
        alt: `${siteName} portfolio cover`,
      },
    ],
  },
  alternates: {
    canonical: baseUrl,
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-snippet": -1,
      "max-image-preview": "large",
      "max-video-preview": -1,
    },
  },
  icons: {
    icon: "/favicon.ico",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const jsonLdOrg = {
    "@context": "https://schema.org",
    "@type": "ProfessionalService",
    name: siteName,
    image: `${baseUrl}/optimized/hero/hero1.jpg`,
    url: baseUrl,
    logo: `${baseUrl}/favicon.ico`,
    description: defaultDesc,
    address: {
      "@type": "PostalAddress",
      addressLocality: "Midland",
      addressRegion: "TX",
      addressCountry: "US",
    },
    areaServed: ["United States", "Texas", "Midland"],
    sameAs: [
      "https://www.instagram.com/shutterunit",
      "https://www.facebook.com/shutterunit",
    ],
    openingHoursSpecification: [
      { "@type": "OpeningHoursSpecification", dayOfWeek: "Monday" },
    ],
  };

  const jsonLdPerson = {
    "@context": "https://schema.org",
    "@type": "Person",
    name: "Shutter Unit",
    jobTitle: "Photographer",
    worksFor: { "@type": "Organization", name: siteName },
    url: baseUrl,
    address: {
      "@type": "PostalAddress",
      addressLocality: "Midland",
      addressRegion: "TX",
      addressCountry: "US",
    },
  };

  return (
    <html lang="en" className={`${bodyFont.variable} ${displayFont.variable}`}>
      <head>
        <link rel="canonical" href={baseUrl} />
        <meta name="theme-color" content="#ffffff" />
        <meta
          name="google-site-verification"
          content="YOUR_GOOGLE_SITE_VERIFICATION_CODE"
        />
        <Script
          id="ld-org"
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdOrg) }}
        />
        <Script
          id="ld-person"
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdPerson) }}
        />
      </head>
      <body className="flex flex-col min-h-screen bg-white text-neutral-900 antialiased font-sans">
        <Navbar />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
