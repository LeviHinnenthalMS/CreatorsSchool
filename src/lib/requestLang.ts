import { DEFAULT_LANG, type Lang } from './i18n'

/**
 * Unprefixed routes publish content in the site's default language.
 * Reading a language cookie here prevented blog pages from being cached.
 *
 * Routes that derive language from the URL (catch-alls with `[lang]` in the
 * slug) should use `processSlug()` instead. This helper is for routes that
 * don't have a language segment in the URL (e.g. `/blog`, `/videos`, the
 * not-found page).
 */
export async function getRequestLang(): Promise<Lang> {
	return DEFAULT_LANG
}
