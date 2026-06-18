import { fetchSanityLive } from '@/sanity/lib/fetch'
import { DEFAULT_LANG } from '@/lib/i18n'
import { SITEMAP_QUERY } from '@/sanity/lib/queries'
import type { MetadataRoute } from 'next'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
	const data = await fetchSanityLive<Record<string, MetadataRoute.Sitemap>>({
		query: SITEMAP_QUERY,
		params: {
			baseUrl: process.env.NEXT_PUBLIC_BASE_URL + '/',
			defaultLang: DEFAULT_LANG,
		},
	})

	return Object.values(data).flat()
}
