import { groq } from 'next-sanity'
import { fetchSanityLive } from './fetch'
import { IMAGE_QUERY, LINK_QUERY } from './queries'

const OFFERING_FIELDS = `
	_id, _type, title, language,
	'slug': slug.current,
	bereich, eyebrow, lede, order,
	heroImage{ ${IMAGE_QUERY} },
	facts[]{ _key, key, value },
	categories,
	catalogTag, decorativeLetter,
	priceLabel, priceCurrency, priceValue, priceUnit,
	detailRows[]{ _key, key, value }
`

const OFFERING_DETAIL_FIELDS = `
	${OFFERING_FIELDS},
	forWhoTitle, forWhoLead,
	forWho[]{ _key, title, text },
	learnTitle,
	learn[]{ _key, icon, title, text },
	detailsTitle, detailsLead,
	priceLabel, priceCurrency, priceValue, priceUnit,
	detailRows[]{ _key, key, value },
	faqTitle, faqLead,
	faq[]{ _key, q, a }
`

export const OFFERINGS_BY_LANG_QUERY = groq`
	*[_type == 'offering' && language == $lang] | order(order asc, title asc){
		${OFFERING_FIELDS}
	}
`

export const OFFERING_BY_SLUG_QUERY = groq`
	*[_type == 'offering' && slug.current == $slug && language == $lang][0]{
		${OFFERING_DETAIL_FIELDS}
	}
`

export const OFFERING_BY_ID_QUERY = groq`
	*[_type == 'offering' && _id == $id][0]{
		${OFFERING_DETAIL_FIELDS}
	}
`

export const OFFERING_SLUGS_QUERY = groq`
	*[_type == 'offering' && defined(slug.current)]{
		'slug': slug.current,
		language
	}
`

export type OfferingListItem = {
	_id: string
	_type: 'offering'
	title?: string | null
	language?: string | null
	slug?: string | null
	bereich?: 'musik' | 'tanz' | null
	eyebrow?: string | null
	lede?: string | null
	order?: number | null
	heroImage?: { _type?: string; asset?: unknown; alt?: string | null; lqip?: string | null; assetAlt?: string | null } | null
	facts?: Array<{ _key?: string; key?: string | null; value?: string | null }> | null
	categories?: string[] | null
	catalogTag?: string | null
	decorativeLetter?: string | null
	priceLabel?: string | null
	priceCurrency?: string | null
	priceValue?: string | null
	priceUnit?: string | null
	detailRows?: Array<{ _key?: string; key?: string | null; value?: string | null }> | null
}

type TitleBlock = {
	_type?: string
	_key?: string
	children?: Array<{ text?: string; marks?: string[] }>
}

export type OfferingDetail = OfferingListItem & {
	forWhoTitle?: TitleBlock[] | null
	forWhoLead?: string | null
	forWho?: Array<{ _key?: string; title?: string | null; text?: string | null }> | null
	learnTitle?: TitleBlock[] | null
	learn?: Array<{ _key?: string; icon?: string | null; title?: string | null; text?: string | null }> | null
	detailsTitle?: TitleBlock[] | null
	detailsLead?: string | null
	priceLabel?: string | null
	priceCurrency?: string | null
	priceValue?: string | null
	priceUnit?: string | null
	detailRows?: Array<{ _key?: string; key?: string | null; value?: string | null }> | null
	faqTitle?: TitleBlock[] | null
	faqLead?: string | null
	faq?: Array<{ _key?: string; q?: string | null; a?: string | null }> | null
}

export async function getOfferings(lang: string) {
	return (await fetchSanityLive<OfferingListItem[]>({
		query: OFFERINGS_BY_LANG_QUERY,
		params: { lang },
	})) || []
}

export async function getOfferingBySlug(slug: string, lang: string) {
	return await fetchSanityLive<OfferingDetail | null>({
		query: OFFERING_BY_SLUG_QUERY,
		params: { slug, lang },
	})
}

export async function getOfferingById(id: string) {
	return await fetchSanityLive<OfferingDetail | null>({
		query: OFFERING_BY_ID_QUERY,
		params: { id },
	})
}

// ── Schedule ──────────────────────────────────────────────

export const SCHEDULE_BY_LANG_QUERY = groq`
	*[_type == 'scheduleSlot' && language == $lang] | order(weekdayOrder asc, time asc){
		_id, _type, _key,
		weekday, weekdayOrder, time, duration,
		name, ageRange, subInfo, room, floor,
		status, statusLabel, capacity,
		bereich, categories,
		teacher->{ _id, name, role,
			photo{ ${IMAGE_QUERY} }
		}
	}
`

export type ScheduleSlotResult = {
	_id: string
	_key?: string
	weekday?: string | null
	weekdayOrder?: number | null
	time?: string | null
	duration?: string | null
	name?: string | null
	ageRange?: string | null
	subInfo?: string | null
	room?: string | null
	floor?: string | null
	status?: 'open' | 'few' | 'full' | null
	statusLabel?: string | null
	capacity?: string | null
	bereich?: 'musik' | 'tanz' | 'instrument' | null
	categories?: string[] | null
	teacher?: {
		_id: string
		name?: string | null
		role?: string | null
		photo?: { asset?: unknown; alt?: string | null; lqip?: string | null } | null
	} | null
}

export async function getSchedule(lang: string) {
	return (await fetchSanityLive<ScheduleSlotResult[]>({
		query: SCHEDULE_BY_LANG_QUERY,
		params: { lang },
	})) || []
}

// ── Gallery ──────────────────────────────────────────────

export const GALLERY_BY_LANG_QUERY = groq`
	*[_type == 'galleryImage' && language == $lang] | order(order asc){
		_id,
		image{ ${IMAGE_QUERY} },
		caption, bereich, span
	}
`

export type GalleryItem = {
	_id: string
	image?: { asset?: unknown; alt?: string | null; lqip?: string | null } | null
	caption?: string | null
	bereich?: string | null
	span?: 'normal' | 'wide' | 'tall' | 'big' | null
}

export async function getGallery(lang: string) {
	return (await fetchSanityLive<GalleryItem[]>({
		query: GALLERY_BY_LANG_QUERY,
		params: { lang },
	})) || []
}

// ── Performances ─────────────────────────────────────────

export const FEATURED_PERFORMANCE_QUERY = groq`
	*[_type == 'performance' && language == $lang && featured == true]
		| order(startDate desc)[0]{
		_id, title, year, dates, startDate, venue, description, lead,
		ticketInfo, badgeLabel, badgeSub, featured, bigNumber, monthLabel,
		image{ ${IMAGE_QUERY} }
	}
`

export const PERFORMANCE_BY_ID_QUERY = groq`
	*[_type == 'performance' && _id == $id][0]{
		_id, title, year, dates, startDate, venue, description, lead,
		ticketInfo, badgeLabel, badgeSub, featured, bigNumber, monthLabel,
		image{ ${IMAGE_QUERY} }
	}
`

export type PerformanceDoc = {
	_id: string
	title?: string | null
	year?: number | null
	dates?: string | null
	startDate?: string | null
	venue?: string | null
	description?: string | null
	lead?: string | null
	ticketInfo?: string | null
	badgeLabel?: string | null
	badgeSub?: string | null
	featured?: boolean | null
	bigNumber?: string | null
	monthLabel?: string | null
	image?: { asset?: unknown; alt?: string | null; lqip?: string | null } | null
}

export async function getFeaturedPerformance(lang: string) {
	return await fetchSanityLive<PerformanceDoc | null>({
		query: FEATURED_PERFORMANCE_QUERY,
		params: { lang },
	})
}

export async function getPerformanceById(id: string) {
	return await fetchSanityLive<PerformanceDoc | null>({
		query: PERFORMANCE_BY_ID_QUERY,
		params: { id },
	})
}

// ── Jobs ──────────────────────────────────────────────────

export const JOBS_BY_LANG_QUERY = groq`
	*[_type == 'job' && language == $lang && active == true] | order(order asc){
		_id, _key, title, icon, type, location, summary, description,
		applyEmailSubject
	}
`

export type JobDoc = {
	_id: string
	_key?: string
	title?: string | null
	icon?: string | null
	type?: string | null
	location?: string | null
	summary?: string | null
	description?: unknown
	applyEmailSubject?: string | null
}

export async function getJobs(lang: string) {
	return (await fetchSanityLive<JobDoc[]>({
		query: JOBS_BY_LANG_QUERY,
		params: { lang },
	})) || []
}

// ── Event badge from siteSettings (links to featured performance) ──

export const HEADER_EVENT_BADGE_QUERY = groq`
	*[_type == 'site'][0].eventBadge{
		active, label, sub, link{ ${LINK_QUERY} }
	}
`
