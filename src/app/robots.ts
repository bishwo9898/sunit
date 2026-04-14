import type { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
	return {
		rules: {
			userAgent: '*',
			allow: '/',
			disallow: '/admin',
			// crawlDelay: 1 // Crawl delay can be handled if needed, but omitted for broad compatibility
		},
		sitemap: 'https://www.shutterunit.com/sitemap.xml',
	};
}
