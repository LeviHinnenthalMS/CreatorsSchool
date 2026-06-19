import type { MetadataRoute } from 'next'
import { BASE_URL, vercelPreview } from '@/lib/env'

export default function robots(): MetadataRoute.Robots {
	if (vercelPreview) {
		return { rules: { userAgent: '*', disallow: '/' } }
	}
	return {
		rules: {
			userAgent: '*',
			allow: ['/', '/api/og'],
			disallow: ['/admin', '/api'],
		},
		sitemap: `${BASE_URL}/sitemap.xml`,
		host: BASE_URL,
	}
}
