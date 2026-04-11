// Centralized SEO configuration for Shutter Unit
// This file serves as the single source of truth for SEO metadata across the site

export const SEO_CONFIG = {
  // Business Information
  businessName: "Shutter Unit",
  baseUrl: "https://www.shutterunit.com",
  description:
    "Shutter Unit – Midland, Texas wedding & portrait photographer. Timeless, cinematic imagery for modern celebrations, portraits, branding & editorial.",

  // Location Information
  location: {
    city: "Midland",
    state: "Texas",
    country: "United States",
    countryCode: "US",
    stateCode: "TX",
    // Approximate coordinates for Midland, Texas
    latitude: "31.9973",
    longitude: "-102.0779",
  },

  // Service Areas (West Texas focus)
  serviceAreas: ["Midland", "Odessa", "Lubbock", "Big Spring", "Texas"],

  // Social Media Links
  socialLinks: {
    instagram: "https://www.instagram.com/shutterunit",
    facebook: "https://www.facebook.com/shutterunit",
  },

  // Contact Information
  email: "shutterunit@gmail.com",
  phone: "", // Add phone if available

  // Keywords by Page/Category
  keywords: {
    general: [
      "photographer",
      "photography",
      "shutterunit",
      "shutter unit",
      "Texas photographer",
    ],
    home: [
      "photographer",
      "camera operator",
      "texas photographer",
      "midland photographer",
      "professional photography",
      "shutterunit",
      "shutter unit",
    ],
    weddings: [
      "wedding photographer",
      "wedding photography texas",
      "destination wedding photographer",
      "documentary wedding photographer",
      "editorial wedding photography",
      "midland wedding photographer",
      "texas wedding photographer",
      "wedding photographer midland",
      "engagement photographer",
      "elopement photographer",
    ],
    portraits: [
      "portrait photographer",
      "portrait photography texas",
      "headshot photographer",
      "brand photography",
      "editorial photography",
      "professional portraits",
      "personal branding",
      "lifestyle photography",
      "character portraits",
      "midland photographer",
    ],
    contact: [
      "hire photographer",
      "book photographer",
      "photography services",
      "contact photographer",
      "photography inquiry",
      "schedule photography session",
    ],
  },

  // OpenGraph Image
  ogImage: {
    url: "/optimized/hero/hero1.jpg",
    width: 1200,
    height: 800,
    alt: "Shutter Unit portfolio cover",
  },

  // Twitter Handle
  twitterHandle: "@shutterunit",

  // Organization Schema Info
  organizationSchema: {
    type: "ProfessionalService",
    name: "Shutter Unit",
    serviceType: [
      "Photography",
      "Portrait Photography",
      "Wedding Photography",
      "Editorial Photography",
      "Branding Photography",
    ],
  },

  // Pricing (to be configured with actual rates)
  pricing: {
    weddingPhotography: {
      currency: "USD",
      // Update with actual pricing
      // priceRange: "3500-8000",
      // priceCurrency: "USD",
    },
    portraitSessions: {
      currency: "USD",
      // Update with actual pricing
      // priceRange: "500-2000",
      // priceCurrency: "USD",
    },
  },
};

// Helper function to get full SEO config with defaults
export function getSEOConfig() {
  return SEO_CONFIG;
}

// Helper to get keywords for a specific page
export function getPageKeywords(page: keyof typeof SEO_CONFIG.keywords) {
  return [
    ...SEO_CONFIG.keywords.general,
    ...(SEO_CONFIG.keywords[page] || []),
  ];
}

// Helper to construct full metadata
export function constructMetadataTitle(pageTitle: string) {
  return `${pageTitle} | ${SEO_CONFIG.businessName}`;
}

// Helper for breadcrumb schema
export function getBreadcrumbSchema(items: Array<{ name: string; url: string }>) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: `${SEO_CONFIG.baseUrl}${item.url}`,
    })),
  };
}

// Helper for LocalBusiness schema
export function getLocalBusinessSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    name: SEO_CONFIG.businessName,
    image: `${SEO_CONFIG.baseUrl}${SEO_CONFIG.ogImage.url}`,
    description: SEO_CONFIG.description,
    address: {
      "@type": "PostalAddress",
      addressLocality: SEO_CONFIG.location.city,
      addressRegion: SEO_CONFIG.location.state,
      addressCountry: SEO_CONFIG.location.country,
    },
    areaServed: SEO_CONFIG.serviceAreas.map((area) => ({
      "@type": "City",
      name: area,
    })),
    url: SEO_CONFIG.baseUrl,
    telephone: SEO_CONFIG.phone || undefined,
    email: SEO_CONFIG.email,
    sameAs: [SEO_CONFIG.socialLinks.instagram, SEO_CONFIG.socialLinks.facebook],
  };
}

// Helper for Service schema
export function getServiceSchema() {
  return SEO_CONFIG.organizationSchema.serviceType.map((serviceType) => ({
    "@context": "https://schema.org",
    "@type": "Service",
    name: serviceType,
    provider: {
      "@type": "ProfessionalService",
      name: SEO_CONFIG.businessName,
      url: SEO_CONFIG.baseUrl,
    },
    areaServed: SEO_CONFIG.serviceAreas.map((area) => ({
      "@type": "City",
      name: area,
    })),
  }));
}
