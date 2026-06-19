import { fetchSanityLive } from '@/sanity/lib/fetch'
import { DEFAULT_LANG } from '@/lib/i18n'
import { SITEMAP_QUERY } from '@/sanity/lib/queries'
import type { MetadataRoute } from 'next'

type RawEntry = MetadataRoute.Sitemap[number] & {
	language?: string | null
	alternates?: Array<{ language?: string | null; url?: string | null } | null> | null
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
	const data = await fetchSanityLive<Record<string, RawEntry[]>>({
		query: SITEMAP_QUERY,
		params: {
			baseUrl: process.env.NEXT_PUBLIC_BASE_URL + '/',
			defaultLang: DEFAULT_LANG,
		},
	})

	return Object.values(data)
		.flat()
		.map(({ language, alternates, ...entry }) => {
			const langs = [
				...(alternates ?? []),
				language && entry.url ? { language, url: entry.url } : null,
			].filter((a): a is { language: string; url: string } => !!a?.language && !!a?.url)

			if (!langs.length) return entry

			const xDefault = langs.find((a) => a.language === DEFAULT_LANG)?.url
			return {
				...entry,
				alternates: {
					languages: {
						...Object.fromEntries(langs.map((a) => [a.language, a.url])),
						...(xDefault ? { 'x-default': xDefault } : {}),
					},
				},
			}
		})
}
