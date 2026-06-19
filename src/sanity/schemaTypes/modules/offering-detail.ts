import { defineField, defineType } from 'sanity'

export default defineType({
	name: 'offering-detail',
	title: 'Angebot-Detail (auto)',
	description:
		'Komplettes Angebot-Layout: Page Header (Facts), Für wen, Das lernst du, Auf einen Blick, FAQ. Quelle: ein Angebot-Dokument.',
	type: 'object',
	fields: [
		defineField({
			name: 'offering',
			title: 'Angebot',
			type: 'reference',
			to: [{ type: 'offering' }],
			validation: (Rule) => Rule.required(),
			options: {
				filter: ({ document }) =>
					document?.language
						? { filter: 'language == $lang', params: { lang: document.language } }
						: {},
			},
		}),
		defineField({
			name: 'breadcrumbHomeLabel',
			title: 'Breadcrumb · Home',
			type: 'string',
		}),
		defineField({
			name: 'breadcrumbParentLabel',
			title: 'Breadcrumb · Angebote',
			type: 'string',
		}),
		defineField({
			name: 'breadcrumbParentHref',
			title: 'Breadcrumb · Angebote-Link',
			type: 'string',
		}),
		defineField({
			name: 'ctas',
			title: 'CTAs im Page-Header',
			type: 'array',
			of: [{ type: 'cta' }],
		}),
		defineField({
			name: 'backLinkLabel',
			title: 'Zurück-Link-Label',
			type: 'string',
		}),
		defineField({
			name: 'backLinkHref',
			title: 'Zurück-Link-URL',
			type: 'string',
		}),
		defineField({
			name: 'panelCtas',
			title: 'Panel-CTAs (Preis-Box)',
			type: 'array',
			of: [{ type: 'cta' }],
		}),
		defineField({ name: 'options', type: 'module-options' }),
	],
	preview: {
		select: { title: 'offering.title' },
		prepare: ({ title }) => ({
			title: title || 'Angebot-Detail',
			subtitle: 'offering-detail',
		}),
	},
})
