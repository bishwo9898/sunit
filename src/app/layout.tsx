import type { Metadata } from "next";
import "./globals.css";
import SiteChrome from "./components/site-chrome";
import { Plus_Jakarta_Sans, Playfair_Display } from "next/font/google";
import Script from "next/script";
import { headers } from "next/headers";

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
const altNames = [
  "Unit",
  "ShutterUnit",
  "Unit Photography",
  "ShutterUnit Photography",
];
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
    "ShutterUnit",
    "Unit",
    "Unit Photography",
    "ShutterUnit Photography",
    "Midland TX photographer",
    "Midland Texas photography",
    "West Texas photographer",
    "West Texas photography",
    "Texas photographers",
    "Texas photo",
    "Texas portrait photographer",
    "Texas wedding photography",
    "Midland Odessa photographer",
    "Permian Basin photographer",
    "Ector County photographer",
    "Odessa TX photographer",
    "engagement photos Midland",
    "bridal portraits Midland",
    "family portraits Midland",
    "editorial photographer Texas",
    "documentary wedding photographer",
    "cinematic wedding photographer",
    // common misspellings
    "Texas photgraphers",
    "Texas middleland photopgrapher",
    "Texas middleland photography",
    "shutterunit photography",
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
        url: `/unit.png`,
        width: 1200,
        height: 630,
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
        url: `/unit.png`,
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
    icon: "/unit.png",
    shortcut: "/unit.png",
    apple: "/unit.png",
  },
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  await headers();
  const jsonLdOrg = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    name: siteName,
    image: `${baseUrl}/unit.png`,
    url: baseUrl,
    logo: `${baseUrl}/unit.png`,
    description: defaultDesc,
    alternateName: altNames.join(", "),
    address: {
      "@type": "PostalAddress",
      addressLocality: "Midland",
      addressRegion: "TX",
      addressCountry: "US",
    },
    geo: {
      "@type": "GeoCoordinates",
      latitude: 31.9974,
      longitude: -102.0779,
    },
    areaServed: [
      "United States",
      "Texas",
      "Midland",
      "Odessa",
      "Permian Basin",
    ],
    sameAs: [
      "https://www.instagram.com/shutterunit",
      "https://www.facebook.com/shutterunit",
    ],
    priceRange: "$$",
    telephone: "+1-000-000-0000",
    openingHoursSpecification: [
      { "@type": "OpeningHoursSpecification", dayOfWeek: "Monday" },
    ],
  };

  const jsonLdPerson = {
    "@context": "https://schema.org",
    "@type": "Person",
    name: "Shutter Unit",
    alternateName: altNames,
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

  const jsonLdWebsite = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: siteName,
    url: baseUrl,
    potentialAction: {
      "@type": "SearchAction",
      target: `${baseUrl}/?q={search_term_string}`,
      "query-input": "required name=search_term_string",
    },
  };

  return (
    <html lang="en" className={`${bodyFont.variable} ${displayFont.variable}`}>
      <head>
        {/* Explicit favicon + app icons pointing to unit.png */}
        <link rel="icon" type="image/png" href="/unit.png" />
        <link rel="shortcut icon" type="image/png" href="/unit.png" />
        <link rel="apple-touch-icon" href="/unit.png" />
        <link rel="canonical" href={baseUrl} />
        <meta name="geo.region" content="US-TX" />
        <meta name="geo.placename" content="Midland" />
        <meta name="geo.position" content="31.9974;-102.0779" />
        <meta name="ICBM" content="31.9974, -102.0779" />
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
        <Script
          id="ld-website"
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdWebsite) }}
        />
        {/* Brand synonyms to aid discoverability */}
        <meta name="author" content="Shutter Unit" />
        <meta name="copyright" content="Shutter Unit" />
        <meta
          name="keywords"
          content={[
            "Shutter Unit",
            ...altNames,
            "Midland Texas photographer",
            "Texas wedding photographer",
            "West Texas photographer",
            "Permian Basin photographer",
            "Texas photgraphers",
            "Texas middleland photopgrapher",
          ].join(", ")}
        />
      </head>
      <body className="flex flex-col min-h-screen bg-white text-neutral-900 antialiased font-sans">
        <SiteChrome>{children}</SiteChrome>
      </body>
    </html>
  );
}
