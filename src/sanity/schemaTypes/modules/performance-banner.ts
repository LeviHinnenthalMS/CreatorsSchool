import { defineField, defineType } from 'sanity'

export default defineType({
	name: 'performance-banner',
	title: 'Aufführungs-Banner (plum)',
	type: 'object',
	fields: [
		defineField({
			name: 'performance',
			title: 'Aufführung',
			description:
				'Wenn leer: nutzt die hervorgehobene Aufführung („featured") der aktuellen Sprache.',
			type: 'reference',
			to: [{ type: 'performance' }],
			options: {
				filter: ({ document }) =>
					document?.language
						? { filter: 'language == $lang', params: { lang: document.language } }
						: {},
			},
		}),
		defineField({ name: 'eyebrow', title: 'Eyebrow (override)', type: 'string' }),
		defineField({
			name: 'titleBefore',
			title: 'Headline · vor Akzent (override)',
			type: 'string',
		}),
		defineField({
			name: 'titleAccent',
			title: 'Headline · Akzent (override)',
			type: 'string',
		}),
		defineField({
			name: 'titleAfter',
			title: 'Headline · nach Akzent (override)',
			type: 'string',
		}),
		defineField({
			name: 'ctas',
			title: 'CTAs',
			type: 'array',
			of: [{ type: 'cta' }],
		}),
		defineField({ name: 'options', type: 'module-options' }),
	],
	preview: {
		prepare: () => ({ title: 'Aufführungs-Banner' }),
	},
})
