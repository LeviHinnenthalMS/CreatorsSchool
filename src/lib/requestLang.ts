import { cookies } from 'next/headers'
import { DEFAULT_LANG, langCookieName, languages, type Lang } from './i18n'

/**
 * Server-side helper: resolve the active language for the current request from
 * the language cookie, falling back to the default language.
 *
 * Routes that derive language from the URL (catch-alls with `[lang]` in the
 * slug) should use `processSlug()` instead. This helper is for routes that
 * don't have a language segment in the URL (e.g. `/blog`, `/videos`, the
 * not-found page).
 */
export async function getRequestLang(): Promise<Lang> {
	const cookieLang = (await cookies()).get(langCookieName)?.value
	return cookieLang && (languages as readonly string[]).includes(cookieLang)
		? (cookieLang as Lang)
		: DEFAULT_LANG
}
