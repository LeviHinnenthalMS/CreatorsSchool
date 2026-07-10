import type { BlogPost, Page, PAGE_QUERY_RESULT } from './types'

export type Module = NonNullable<
	NonNullable<NonNullable<PAGE_QUERY_RESULT>['modules']>[number]
>

export type PageOrPost = Page | BlogPost

/**
 * Permissive shape of a translation entry returned by `getTranslations()`.
 * Flattens the page/blog union from the generated query so consumers can
 * operate on shared fields.
 */
export type TranslationDoc = {
	slug?: string | null
	translations?: Array<{
		slug?: string | null
		slugBlogAlt?: string | null
		language?: string | null
	} | null> | null
}

/**
 * Permissive Sanity image shape covering both raw schema images and
 * query-projected images (with `lqip`, `alt`, `loading` siblings).
 */
export type SanityImage = {
	_type?: string
	asset?: unknown
	hotspot?: unknown
	crop?: unknown
	alt?: string | null
	assetAlt?: string | null
	decorative?: boolean | null
	loading?: 'lazy' | 'eager' | null
	lqip?: string | null
}

/**
 * Permissive img-object shape (`{ image, responsive[], alt, loading }`).
 */
export type SanityImg = {
	_type?: string
	_key?: string
	image?: SanityImage | null
	responsive?: Array<{
		_key?: string
		image?: SanityImage | null
		media?: string | null
	} | null> | null
	alt?: string | null
	decorative?: boolean | null
	loading?: 'lazy' | 'eager' | null
}

/**
 * Permissive icon shape.
 */
export type SanityIcon = {
	_type?: string
	image?: SanityImage | null
	ic0n?: string | null
	size?: string | null
}

/**
 * Permissive link shape with optional resolved `internal` doc.
 */
export type SanityLink = {
	_type?: string
	_key?: string
	label?: string | null
	type?: 'internal' | 'external' | null
	internal?: {
		_type?: string
		title?: string | null
		language?: string | null
		metadata?: {
			slug?: { current?: string | null } | null
		} | null
	} | null
	external?: string | null
	params?: string | null
	icon?: string | null
	description?: string | null
}

/**
 * Permissive CTA shape (link with variant/size/icon configuration).
 */
export type SanityCTA = {
	_type?: string
	_key?: string
	active?: boolean | null
	link?: SanityLink | null
	variant?: 'primary' | 'secondary' | 'tertiary' | 'pill' | 'pill-dark' | null
	size?: 'small' | 'medium' | 'large' | null
	icon?: string | null
	iconAspectRatio?: number | null
	iconHeight?: number | null
	iconPosition?: 'leading' | 'trailing' | null
}

/**
 * Permissive feature shape.
 */
export type SanityFeature = {
	_type?: string
	_key?: string
	icon?: SanityIcon | null
	title?: string | null
	subtitle?: string | null
}

/**
 * Base module shape — the structural fields every renderable Sanity
 * module shares. Components use this as a prop-type constraint instead
 * of the discriminated `Module` union, since the union narrows by
 * `_type` literal which doesn't survive prop spreading.
 */
export type SanityModule = {
	_type?: string
	_key?: string
	options?: {
		hidden?: boolean | null
		uid?: string | null
	} | null
}

/**
 * Permissive code-block shape (`@sanity/code-input`).
 */
export type SanityCode = {
	_type?: string
	_key?: string
	language?: string | null
	code?: string | null
	filename?: string | null
	highlightedLines?: number[] | null
}

/**
 * Permissive custom-HTML module shape.
 */
export type SanityCustomHTML = SanityModule & {
	className?: string
	html?: {
		code?: string | null
	} | null
	css?: {
		code?: string | null
	} | null
}
