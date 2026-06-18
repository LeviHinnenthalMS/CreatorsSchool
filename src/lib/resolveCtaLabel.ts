import { stegaClean } from 'next-sanity'
import type { SanityCTA } from '@/sanity/typeHelpers'

export function resolveCtaLabel(cta?: { link?: SanityCTA['link'] }): string {
	const candidate =
		cta?.link?.label ||
		cta?.link?.internal?.title ||
		cta?.link?.external ||
		''
	return typeof candidate === 'string' ? stegaClean(candidate).trim() : ''
}
