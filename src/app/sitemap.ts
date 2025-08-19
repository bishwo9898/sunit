import type { MetadataRoute } from 'next';

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.shutterunit.com';

export default function sitemap(): MetadataRoute.Sitemap {
	const now = new Date();
	return [
		{
			url: `${BASE_URL}/`,
			lastModified: now,
			changeFrequency: 'weekly',
			priority: 1,
		},
		{
			url: `${BASE_URL}/portraits`,
			lastModified: now,
			changeFrequency: 'weekly',
			priority: 0.8,
		},
		{
			url: `${BASE_URL}/weddings`,
			lastModified: now,
			changeFrequency: 'weekly',
			priority: 0.8,
		},
		{
			url: `${BASE_URL}/contact`,
			lastModified: now,
			changeFrequency: 'monthly',
			priority: 0.6,
		},
	];
}

