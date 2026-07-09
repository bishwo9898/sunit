import type { MetadataRoute } from "next";

const BASE_URL =
  process.env.NEXT_PUBLIC_SITE_URL || "https://www.shutterunit.com";

export default function sitemap(): MetadataRoute.Sitemap {
  const pages = [
    { path: "", changeFrequency: "weekly" as const, priority: 1 },
    { path: "/weddings", changeFrequency: "monthly" as const, priority: 0.9 },
    { path: "/portraits", changeFrequency: "monthly" as const, priority: 0.9 },
    { path: "/about", changeFrequency: "yearly" as const, priority: 0.7 },
    { path: "/contact", changeFrequency: "yearly" as const, priority: 0.7 },
    {
      path: "/lubbock-wedding-photographer",
      changeFrequency: "monthly" as const,
      priority: 0.9,
    },
    {
      path: "/lubbock-engagement-photographer",
      changeFrequency: "monthly" as const,
      priority: 0.8,
    },
    {
      path: "/lubbock-graduation-photographer",
      changeFrequency: "monthly" as const,
      priority: 0.8,
    },
    {
      path: "/lubbock-portrait-photographer",
      changeFrequency: "monthly" as const,
      priority: 0.8,
    },
  ];

  return pages.map(({ path, ...entry }) => ({
    url: `${BASE_URL}${path || "/"}`,
    ...entry,
  }));
}
