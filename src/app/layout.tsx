import type { Metadata } from "next";
import "./globals.css";
import Navbar from "./components/navbar";
import Footer from "./components/footer";
import { Plus_Jakarta_Sans, Playfair_Display } from "next/font/google";
import { SEO_CONFIG } from "@/config/seo";

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

const siteName = SEO_CONFIG.businessName;
const baseUrl = SEO_CONFIG.baseUrl;
const defaultDesc = SEO_CONFIG.description;

export const metadata: Metadata = {
  metadataBase: new URL(baseUrl),
  title: {
    default: `${siteName} | West Texas Wedding & Portrait Photographer`,
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
    "portrait photographer texas",
    "photographer texas",
    "wedding photography texas",
  ],
  authors: [{ name: "Shutter Unit" }],
  creator: "Shutter Unit",
  publisher: "Shutter Unit",
  openGraph: {
    type: "website",
    url: baseUrl,
    siteName,
    title: `${siteName} | West Texas Wedding & Portrait Photographer`,
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
    title: `${siteName} | West Texas Wedding & Portrait Photographer`,
    description: defaultDesc,
    images: [
      {
        url: `/optimized/hero/hero1.jpg`,
        alt: `${siteName} portfolio cover`,
      },
    ],
  },
  alternates: {
    canonical: "/",
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
  ...(process.env.GOOGLE_SITE_VERIFICATION
    ? {
        verification: {
          google: process.env.GOOGLE_SITE_VERIFICATION,
        },
      }
    : {}),
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const structuredData = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebSite",
        "@id": `${baseUrl}/#website`,
        url: baseUrl,
        name: siteName,
        description: defaultDesc,
        inLanguage: "en-US",
        publisher: { "@id": `${baseUrl}/#business` },
      },
      {
        "@type": ["LocalBusiness", "ProfessionalService"],
        "@id": `${baseUrl}/#business`,
        name: siteName,
        url: baseUrl,
        image: `${baseUrl}/optimized/hero/hero1.jpg`,
        logo: `${baseUrl}/favicon.ico`,
        description: defaultDesc,
        email: SEO_CONFIG.email,
        areaServed: SEO_CONFIG.serviceAreas.map((name) => ({
          "@type":
            name === "Texas" || name === "West Texas" ? "AdministrativeArea" : "City",
          name,
        })),
        founder: { "@id": `${baseUrl}/about#fortunes-efe` },
        sameAs: [
          SEO_CONFIG.socialLinks.instagram,
          SEO_CONFIG.socialLinks.facebook,
        ],
        hasOfferCatalog: {
          "@type": "OfferCatalog",
          name: "Photography services",
          itemListElement: [
            {
              "@type": "Offer",
              itemOffered: {
                "@type": "Service",
                name: "Wedding Photography",
                url: `${baseUrl}/weddings`,
              },
            },
            {
              "@type": "Offer",
              itemOffered: {
                "@type": "Service",
                name: "Portrait Photography",
                url: `${baseUrl}/portraits`,
              },
            },
          ],
        },
      },
      {
        "@type": "Person",
        "@id": `${baseUrl}/about#fortunes-efe`,
        name: "Fortunes Efe",
        jobTitle: "Photographer",
        url: `${baseUrl}/about`,
        worksFor: { "@id": `${baseUrl}/#business` },
        knowsAbout: [
          "Wedding photography",
          "Portrait photography",
          "Editorial photography",
          "Skin tone care in photography",
        ],
      },
    ],
  };

  return (
    <html lang="en" className={`${bodyFont.variable} ${displayFont.variable}`}>
      <head>
        <meta name="theme-color" content="#ffffff" />
        <script
          id="site-structured-data"
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(structuredData).replace(/</g, "\\u003c"),
          }}
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
