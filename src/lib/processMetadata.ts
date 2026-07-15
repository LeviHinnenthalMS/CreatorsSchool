import resolveUrl from './resolveUrl'
import { BASE_URL, vercelPreview } from './env'
import type { Metadata } from 'next'
import { DEFAULT_LANG, languages } from './i18n'
import { getSite } from '@/sanity/lib/queries'

type MetadataInput = {
	_type?: string
	language?: string | null
	metadata?: {
		slug?: { current?: string | null } | null
		title?: string | null
		description?: string | null
		ogimage?: string | null
		noIndex?: boolean | null
	} | null
	translations?: Array<{
		slug?: string | null
		language?: string | null
	} | null> | null
}

export default async function processMetadata(
	page: MetadataInput,
): Promise<Metadata> {
	const url = resolveUrl(page, { base: true, language: page.language ?? undefined })
	const { title, description, ogimage, noIndex } = page.metadata ?? {}

	const site = await getSite()
	const siteOgimage = (site as { ogimage?: string | null } | null)?.ogimage

	const ogImageUrl =
		ogimage ||
		siteOgimage ||
		`${BASE_URL}/api/og?title=${encodeURIComponent(title ?? '')}`

	const pageLang = page.language ?? DEFAULT_LANG
	const langMap = Object.fromEntries(
		page.translations
			?.filter(
				(t): t is { slug: string; language: string } =>
					!!t?.language && !!t?.slug,
			)
			?.map(({ language, slug }) => [
				language,
				[BASE_URL, language !== DEFAULT_LANG && language, slug]
					.filter(Boolean)
					.join('/'),
			]) || [],
	)
	const xDefault = langMap[DEFAULT_LANG] ?? (pageLang === DEFAULT_LANG ? url : undefined)

	return {
		metadataBase: new URL(BASE_URL),
		title: title ?? undefined,
		description: description ?? undefined,
		openGraph: {
			type: 'website',
			url,
			title: title ?? undefined,
			description: description ?? undefined,
			images: ogImageUrl,
			locale: pageLang,
			alternateLocale: languages.filter((l) => l !== pageLang),
		},
		twitter: {
			card: 'summary_large_image',
			title: title ?? undefined,
			description: description ?? undefined,
			images: ogImageUrl,
		},
		robots: {
			index: noIndex || vercelPreview ? false : undefined,
		},
		alternates: {
			canonical: url,
			languages: {
				...langMap,
				...(xDefault ? { 'x-default': xDefault } : {}),
			},
		},
	}
}
