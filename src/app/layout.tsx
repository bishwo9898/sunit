import type { Metadata } from "next";
import "./globals.css";
import Navbar from "./components/navbar";
import Footer from "./components/footer";
import { Plus_Jakarta_Sans, Playfair_Display } from "next/font/google";
import Script from "next/script";
import {
  SEO_CONFIG,
  getBreadcrumbSchema,
  getLocalBusinessSchema,
  getServiceSchema,
} from "@/config/seo";

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
    areaServed: ["United States", "Texas", "Midland", "Odessa", "Lubbock"],
    sameAs: [SEO_CONFIG.socialLinks.instagram, SEO_CONFIG.socialLinks.facebook],
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

  // LocalBusiness schema for improved local SEO
  const jsonLdLocalBusiness = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    name: siteName,
    image: `${baseUrl}/optimized/hero/hero1.jpg`,
    description: defaultDesc,
    address: {
      "@type": "PostalAddress",
      addressLocality: "Midland",
      addressRegion: "TX",
      addressCountry: "US",
    },
    areaServed: [
      { "@type": "City", name: "Midland" },
      { "@type": "City", name: "Odessa" },
      { "@type": "City", name: "Lubbock" },
      { "@type": "State", name: "Texas" },
    ],
    url: baseUrl,
    email: SEO_CONFIG.email,
    sameAs: [SEO_CONFIG.socialLinks.instagram, SEO_CONFIG.socialLinks.facebook],
  };

  // Breadcrumb schema for better navigation in SERPs
  const jsonLdBreadcrumb = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Home",
        item: baseUrl,
      },
      {
        "@type": "ListItem",
        position: 2,
        name: "Weddings",
        item: `${baseUrl}/weddings`,
      },
      {
        "@type": "ListItem",
        position: 3,
        name: "Portraits",
        item: `${baseUrl}/portraits`,
      },
      {
        "@type": "ListItem",
        position: 4,
        name: "Contact",
        item: `${baseUrl}/contact`,
      },
    ],
  };

  // Service schema describing photography services
  const jsonLdServices = [
    {
      "@context": "https://schema.org",
      "@type": "Service",
      name: "Wedding Photography",
      provider: {
        "@type": "ProfessionalService",
        name: siteName,
        url: baseUrl,
      },
      areaServed: [
        { "@type": "City", name: "Midland" },
        { "@type": "City", name: "Odessa" },
        { "@type": "State", name: "Texas" },
      ],
      description:
        "Documentary and editorial wedding photography with timeless color and cinematic style.",
      url: `${baseUrl}/weddings`,
    },
    {
      "@context": "https://schema.org",
      "@type": "Service",
      name: "Portrait Photography",
      provider: {
        "@type": "ProfessionalService",
        name: siteName,
        url: baseUrl,
      },
      areaServed: [
        { "@type": "City", name: "Midland" },
        { "@type": "City", name: "Odessa" },
        { "@type": "State", name: "Texas" },
      ],
      description:
        "Professional portrait photography including headshots, editorial, and personal branding.",
      url: `${baseUrl}/portraits`,
    },
  ];

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
        <Script
          id="ld-local-business"
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(jsonLdLocalBusiness),
          }}
        />
        <Script
          id="ld-breadcrumb"
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdBreadcrumb) }}
        />
        {jsonLdServices.map((service, index) => (
          <Script
            key={`ld-service-${index}`}
            id={`ld-service-${index}`}
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(service) }}
          />
        ))}
      </head>
      <body className="flex flex-col min-h-screen bg-white text-neutral-900 antialiased font-sans">
        <Navbar />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
