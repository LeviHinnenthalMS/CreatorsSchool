/**
 * Reference-filter that constrains the picker to documents matching the
 * parent document's `language` field.
 *
 * - When the parent doc has no language (e.g. `site`, `global-module`,
 *   `redirect`), the filter is a no-op so all documents stay pickable.
 * - When the parent has a language, the filter matches documents in the
 *   same language **plus** any documents that don't have a language field
 *   at all (so refs targeting non-translatable types like `projekt` keep
 *   working in the same picker).
 *
 * Use it on every reference field whose target is (or includes) a
 * translatable document type:
 *
 *   defineField({
 *     type: 'reference',
 *     to: [{ type: 'topic' }],
 *     options: { filter: byLanguage },
 *   })
 *
 * Sanity's TS types for `options.filter` only accept a string, but the
 * function form is officially supported at runtime, so we cast on the
 * boundary to keep a single helper across the schema.
 */
type ReferenceFilterContext = { document?: { language?: string } | null }

const byLanguageFn = ({ document }: ReferenceFilterContext) => {
	const lang = document?.language
	if (!lang) return {}
	return {
		filter: 'language == $lang || !defined(language)',
		params: { lang },
	}
}

export const byLanguage = byLanguageFn as unknown as string
