import type {
	StructureBuilder,
	ListItemBuilder,
	ListItem,
	Divider,
} from 'sanity/structure'
import { supportedLanguages } from '@/lib/i18n'
import { apiVersion } from './env'

export const singleton = (
	S: StructureBuilder,
	id: string,
	title?: string,
	schemaType?: string,
): ListItemBuilder =>
	S.listItem()
		.id(id)
		.title(
			title ||
				id
					.split(/(?=[A-Z])/)
					.map((w) => w.charAt(0).toUpperCase() + w.slice(1))
					.join(' '),
		)
		.child(S.editor().id(id).schemaType(schemaType ?? id).documentId(id))

export const group = (
	S: StructureBuilder,
	title: string,
	items: (ListItemBuilder | ListItem | Divider)[],
): ListItemBuilder =>
	S.listItem().title(title).child(S.list().title(title).items(items))

export const directory = (
	S: StructureBuilder,
	path: string,
	{ maxLevel }: { maxLevel?: number } = {},
) =>
	S.listItem()
		.title(`/${path}`)
		.schemaType('page')
		.child(
			S.documentList()
				.id(`page.${path.replaceAll('/', '-')}`)
				.apiVersion(apiVersion)
				.filter(
					`
						string::startsWith(metadata.slug.current, $path)
						${maxLevel !== undefined ? `&& count(string::split(metadata.slug.current, '/')) <= ${maxLevel + 1}` : ''}
					`,
				)
				.params({ path: path + '/' }),
		)

/**
 * Wraps a document type in an "All / per-language" list, driven by
 * supportedLanguages. Adding a new language to i18n.ts automatically
 * adds a new sub-list — no Studio code changes required.
 *
 * Pass `extraFilter` to scope the list to a subset (e.g. only the
 * homepage, only blog posts in a category). The filter is ANDed
 * onto every sub-list including "All".
 */
export const languageList = (
	S: StructureBuilder,
	schemaType: string,
	title?: string,
	options: {
		id?: string
		extraFilter?: string
		extraParams?: Record<string, unknown>
	} = {},
): ListItemBuilder => {
	const idKey = options.id ?? schemaType
	const baseFilter = [
		'_type == $type',
		options.extraFilter && `(${options.extraFilter})`,
	]
		.filter(Boolean)
		.join(' && ')
	const baseParams = { type: schemaType, ...(options.extraParams ?? {}) }

	// Single-language project: skip the "All / per-language" sub-tree —
	// open the document list directly. Keeps the Studio one click shorter.
	if (supportedLanguages.length <= 1) {
		const onlyLang = supportedLanguages[0]?.id
		const filter = onlyLang ? `${baseFilter} && language == $lang` : baseFilter
		const params = onlyLang ? { ...baseParams, lang: onlyLang } : baseParams

		return S.listItem()
			.id(`${idKey}.lang-root`)
			.title(title || schemaType)
			.schemaType(schemaType)
			.child(
				S.documentList()
					.id(`${idKey}.list`)
					.title(title || schemaType)
					.schemaType(schemaType)
					.apiVersion(apiVersion)
					.filter(filter)
					.params(params),
			)
	}

	return S.listItem()
		.id(`${idKey}.lang-root`)
		.title(title || schemaType)
		.schemaType(schemaType)
		.child(
			S.list()
				.title(title || schemaType)
				.items([
					S.listItem()
						.id(`${idKey}.all`)
						.title('All')
						.schemaType(schemaType)
						.child(
							S.documentList()
								.id(`${idKey}.all.list`)
								.title(`All ${title || schemaType}`)
								.schemaType(schemaType)
								.apiVersion(apiVersion)
								.filter(baseFilter)
								.params(baseParams),
						),
					S.divider(),
					...supportedLanguages.map((lang) =>
						S.listItem()
							.id(`${idKey}.${lang.id}`)
							.title(lang.title)
							.schemaType(schemaType)
							.child(
								S.documentList()
									.id(`${idKey}.${lang.id}.list`)
									.title(`${title || schemaType} — ${lang.title}`)
									.schemaType(schemaType)
									.apiVersion(apiVersion)
									.filter(`${baseFilter} && language == $lang`)
									.params({ ...baseParams, lang: lang.id }),
							),
					),
				]),
		)
}
