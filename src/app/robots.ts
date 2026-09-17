import type { MetadataRoute } from 'next'
import { BASE_URL, vercelPreview } from '@/lib/env'

export default function robots(): MetadataRoute.Robots {
	if (vercelPreview) {
		return { rules: { userAgent: '*', disallow: '/' } }
	}
	return {
		rules: {
			// One shared group gives search and AI crawlers the same access.
			// Bot-specific Allow groups would override these exclusions.
			userAgent: '*',
			allow: ['/', '/api/og$', '/api/og?'],
			disallow: ['/admin$', '/admin/', '/admin?', '/api$', '/api/', '/api?'],
		},
		sitemap: `${BASE_URL}/sitemap.xml`,
	}
}
