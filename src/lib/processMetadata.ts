import resolveUrl from './resolveUrl'
import { BASE_URL, vercelPreview } from './env'
import type { Metadata } from 'next'
import { DEFAULT_LANG, languages } from './i18n'
import { getSite } from '@/sanity/lib/queries'

type MetadataInput = {
	_type?: string
	title?: string | null
	lede?: string | null
	excerpt?: string | null
	stage?: unknown[] | null
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

function clean(value?: string | null) {
	return value?.replace(/\s+/g, ' ').trim() || undefined
}

function truncate(value: string, max: number) {
	if (value.length <= max) return value
	const shortened = value
		.slice(0, max + 1)
		.replace(/\s+\S*$/, '')
		.trim()
	return `${shortened || value.slice(0, max - 1).trimEnd()}…`
}

function socialImage(url: string) {
	if (!url.includes('cdn.sanity.io/images/')) return url
	const separator = url.includes('?') ? '&' : '?'
	return `${url}${separator}w=1200&h=630&fit=crop&auto=format`
}

export default async function processMetadata(
	page: MetadataInput,
): Promise<Metadata> {
	const url = resolveUrl(page, {
		base: true,
		language: page.language ?? undefined,
	})
	const {
		title: seoTitle,
		description: seoDescription,
		ogimage,
		noIndex,
	} = page.metadata ?? {}

	const site = await getSite()
	const {
		title: siteTitle,
		city,
		ogimage: siteOgimage,
	} = site as {
		title?: string | null
		city?: string | null
		ogimage?: string | null
	}
	const brand = clean(siteTitle) || 'Creators School'
	const pageTitle = clean(page.title)
	const fallbackTitle = pageTitle
		? `${pageTitle} | ${brand}${city ? ` ${city}` : ''}`
		: brand
	const title = truncate(clean(seoTitle) || fallbackTitle, 60)
	const sourceDescription =
		clean(seoDescription) ||
		clean(page.lede) ||
		clean(page.excerpt) ||
		page.stage
			?.map((item) => {
				if (!item || typeof item !== 'object') return undefined
				const stage = item as { lede?: string | null; sub?: string | null }
				return clean(stage.lede) || clean(stage.sub)
			})
			.find(Boolean) ||
		`${pageTitle || brand}: Informationen, Angebote und Kontakt zur ${brand}${city ? ` in ${city}` : ''}.`
	const description = truncate(sourceDescription, 160)

	const ogImageUrl =
		ogimage ||
		siteOgimage ||
		`${BASE_URL}/api/og?title=${encodeURIComponent(title)}`
	const socialImageUrl = socialImage(ogImageUrl)

	const pageLang = page.language ?? DEFAULT_LANG
	const currentSlug = page.metadata?.slug?.current
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
	if (currentSlug) langMap[pageLang] = url
	const xDefault =
		langMap[DEFAULT_LANG] ?? (pageLang === DEFAULT_LANG ? url : undefined)

	return {
		metadataBase: new URL(BASE_URL),
		title,
		description,
		openGraph: {
			type: 'website',
			url,
			siteName: brand,
			title,
			description,
			images: [{ url: socialImageUrl, width: 1200, height: 630 }],
			locale: pageLang,
			alternateLocale: languages.filter((l) => l !== pageLang),
		},
		twitter: {
			card: 'summary_large_image',
			title,
			description,
			images: [socialImageUrl],
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
