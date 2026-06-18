import { NextResponse, type NextRequest, type ProxyConfig } from 'next/server'
import { getCachedTranslations } from './sanity/lib/queries'
import { DEFAULT_LANG, langCookieName, languages } from './lib/i18n'
import type { TranslationDoc } from './sanity/typeHelpers'

function detectBrowserLanguage(header: string | null): string | null {
	if (!header) return null
	const ranked = header
		.split(',')
		.map((part) => {
			const [code, q] = part.trim().split(';q=')
			return {
				code: code.split('-')[0]?.toLowerCase(),
				q: q ? parseFloat(q) : 1,
			}
		})
		.sort((a, b) => b.q - a.q)
	for (const { code } of ranked) {
		if (code && languages.includes(code)) return code
	}
	return null
}

export default async function proxy(request: NextRequest) {
	const { pathname } = request.nextUrl

	const requestHeaders = new Headers(request.headers)
	requestHeaders.set('x-pathname', pathname)
	const next = () => NextResponse.next({ request: { headers: requestHeaders } })

	const lang = request.cookies.get(langCookieName)?.value

	// Fast-path: skip the Sanity lookup entirely when the user has no language
	// cookie and the URL has no language prefix — most first-time visitors hit this.
	if (!request.cookies.has(langCookieName) && !pathname.match(/^\/[a-z]{2}(\/|$)/)) {
		// Language detection redirect intentionally disabled:
		// Visitors always land on the default-language page regardless of browser language.
		// Use the language switcher or explicit /<lang> URLs to access other languages.
		return next()
	}

	const T = (await getCachedTranslations()) as TranslationDoc[]

	const isPrefixed = !!T.find((t) =>
		t.translations?.some((tr) => tr?.slug === pathname),
	)

	if (!request.cookies.has(langCookieName) && !isPrefixed) return next()

	const available = T?.find((t) =>
		[t.slug, ...(t.translations?.map((tr) => tr?.slug) ?? [])].includes(
			pathname,
		),
	)
	if (!available) return next()

	const cookieMatchesCurrentPrefix =
		// cookie matches current prefix
		lang ===
			available.translations?.find(
				(tr) => tr && [tr.slugBlogAlt, tr.slug].includes(pathname),
			)?.language ||
		// default language and current path is the base path
		(lang === DEFAULT_LANG && pathname === available.slug)

	if (!cookieMatchesCurrentPrefix) {
		const target = available.translations?.find((tr) => tr?.language === lang)
		// use base path for default language
		const url =
			target?.language === DEFAULT_LANG
				? available.slug
				: (target?.slugBlogAlt ?? target?.slug)
		if (!url) return next()

		return NextResponse.redirect(new URL(url, request.url))
	}

	return next()
}

export const config: ProxyConfig = {
	matcher: [
		// Exclude:
		//  - _next/* (static + image optimizer)
		//  - api/*, admin/* (Studio + Route Handlers — handle their own logic)
		//  - Static-asset extensions (images, fonts, manifests, sitemap, robots, etc.)
		//    — these never benefit from language redirection and add latency on every request.
		'/((?!_next/|api/|admin/|.*\\.(?:ico|png|jpg|jpeg|gif|svg|webp|avif|woff2?|ttf|otf|eot|css|js|map|xml|txt|json|webmanifest)$).*)',
	],
}
