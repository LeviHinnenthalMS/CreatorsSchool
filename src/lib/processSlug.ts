import { DEFAULT_LANG, languages, type Lang } from './i18n'

type SlugInput = string[] | undefined

/**
 * Extract `{ slug, lang }` from a catch-all route's params.
 *
 * Convention:
 * - The first segment is a language code → use it; strip it from the slug.
 * - Otherwise → DEFAULT_LANG.
 * - Empty segments → 'index'.
 *
 * Used by the root catch-all, the blog post route, and the video detail route
 * so they all parse URLs the same way.
 */
export function processSlug(input: SlugInput): { slug: string; lang: Lang } {
	if (!input || input.length === 0) {
		return { slug: 'index', lang: DEFAULT_LANG }
	}

	const hasLangPrefix = (languages as readonly string[]).includes(input[0])
	const lang = (hasLangPrefix ? input[0] : DEFAULT_LANG) as Lang

	const joined = input.join('/')
	const slug = hasLangPrefix
		? joined.replace(new RegExp(`^${lang}/?`), '')
		: joined

	return {
		slug: slug === '' ? 'index' : slug,
		lang,
	}
}
