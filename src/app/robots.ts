import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/admin/", "/api/", "/test"],
    },
    sitemap: "https://www.shutterunit.com/sitemap.xml",
    host: "https://www.shutterunit.com",
  };
}
