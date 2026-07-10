'use client'

import { usePathname } from 'next/navigation'
import { languages } from '@/lib/i18n'

export default function useLang() {
	const pathname = usePathname()

	// ponytail: alternation, not a character class — `[de|en]` matches `d`, `e`, `|`, `n`.
	const { lang } =
		pathname.match(
			new RegExp(`^/(?<lang>${languages.join('|')})(?:/|$)`),
		)?.groups ?? {}

	return lang || languages?.[0] || 'en'
}
