/**
 * Code-level i18n maps for UI **chrome** — labels that don't warrant editor
 * control via Sanity (button text, ARIA labels, sidebar headings, etc.).
 *
 * Any user-facing content (titles, descriptions, body copy) should still come
 * from Sanity per CLAUDE.md. This file is only for system labels where
 * editorial control would be overkill.
 *
 * Keyed by `Lang` so adding a new language to `supportedLanguages` will produce
 * a TypeScript error here until the new translations are filled in.
 */
import type { Lang } from './i18n'
import { DEFAULT_LANG } from './i18n'

type LabelMap<T extends Record<string, string>> = Record<Lang, T>

function pick<T extends Record<string, string>>(map: LabelMap<T>, lang: string): T {
	return lang in map ? map[lang as Lang] : map[DEFAULT_LANG]
}

// Example placeholder — add UI chrome label maps here as needed.
const COMMON_LABELS = {
	de: {
		readMore: 'Mehr lesen',
		close: 'Schließen',
	},
} as const satisfies LabelMap<{
	readMore: string
	close: string
}>

export const commonLabels = (lang: string) => pick(COMMON_LABELS, lang)
