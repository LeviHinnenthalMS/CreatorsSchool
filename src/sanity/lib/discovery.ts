import { groq } from 'next-sanity'
import { DEFAULT_LANG, languages } from '@/lib/i18n'
import { fetchPublished } from './published'

type Fact = { key?: string | null; value?: string | null }

export type DiscoveryEntry = {
	_type: 'page' | 'offering' | 'blogPost' | 'performance'
	title: string
	language: string
	slug: string
	description?: string | null
	_updatedAt: string
	lede?: string | null
	facts?: Fact[] | null
	detailRows?: Fact[] | null
	priceLabel?: string | null
	priceCurrency?: string | null
	priceValue?: string | null
	priceUnit?: string | null
	faq?: Array<{ q?: string | null; a?: string | null }> | null
	dates?: string | null
	startDate?: string | null
	venue?: string | null
	publishedAt?: string | null
}

export type DiscoveryContent = {
	site: {
		title?: string | null
		tagline?: string | null
		phone?: string | null
		email?: string | null
		addressLines?: string[] | null
	} | null
	entries: DiscoveryEntry[]
}

// Only project public fields. No subscriptions, submissions, draft documents,
// hidden pages, unsupported locales, or legacy pages shadowed by offerings.
export const DISCOVERY_QUERY = groq`{
	'site': *[_type == 'site'][0]{title, tagline, phone, email, addressLines},
	'entries': *[
		_type in ['page', 'offering', 'blogPost', 'performance'] &&
		language in $languages &&
		metadata.noIndex != true &&
		select(
			_type == 'page' =>
				defined(metadata.slug.current) &&
				!(metadata.slug.current in ['404', 'components']) &&
				count(*[
					_type == 'offering' &&
					language == ^.language &&
					metadata.slug.current == ^.metadata.slug.current
				]) == 0,
			_type == 'offering' => defined(slug.current),
			// The blog currently has routes only in the default language.
			_type == 'blogPost' => defined(slug.current) && language == $defaultLang,
			_type == 'performance' => defined(metadata.slug.current),
			false
		)
	] | order(language asc, order asc, title asc){
		_type, language, _updatedAt,
		'title': coalesce(title, metadata.title),
		'slug': select(_type in ['offering', 'blogPost'] => slug.current, metadata.slug.current),
		'description': coalesce(metadata.description, seoDescription, lede, excerpt, description),
		_type == 'offering' => {
			lede, facts[]{key, value}, detailRows[]{key, value},
			priceLabel, priceCurrency, priceValue, priceUnit, faq[]{q, a}
		},
		_type == 'performance' => {dates, startDate, venue},
		_type == 'blogPost' => {publishedAt}
	}
}`

export function getDiscoveryContent() {
	return fetchPublished<DiscoveryContent>({
		query: DISCOVERY_QUERY,
		params: { languages, defaultLang: DEFAULT_LANG },
		tags: ['site', 'page', 'offering', 'blogPost', 'performance'],
	})
}
