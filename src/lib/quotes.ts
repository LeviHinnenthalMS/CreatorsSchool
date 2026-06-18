import { stegaClean } from 'next-sanity'
import type { CSSProperties } from 'react'

const QUOTE_PAIRS: Record<string, readonly [string, string]> = {
	de: ['„', '“'], // U+201E low-9, U+201C left double
	fr: ['«\u00A0', '\u00A0»'], // guillemets with non-breaking spaces
}

const DEFAULT_QUOTES: readonly [string, string] = ['“', '”'] // U+201C, U+201D

/**
 * Returns inline-style CSS custom properties that supply locale-appropriate
 * opening/closing quote glyphs to a blockquote. Pair with Tailwind:
 *
 *   <blockquote
 *     style={getQuoteStyle(language)}
 *     className="[&_p:first-of-type]:before:content-[var(--quote-open)]
 *                [&_p:last-of-type]:after:content-[var(--quote-close)]"
 *   >
 */
export function getQuoteStyle(
	language: string | null | undefined,
): CSSProperties {
	const lang = stegaClean(language ?? '').trim().toLowerCase()
	const [open, close] = QUOTE_PAIRS[lang] ?? DEFAULT_QUOTES
	return {
		'--quote-open': `"${open}"`,
		'--quote-close': `"${close}"`,
	} as CSSProperties
}
