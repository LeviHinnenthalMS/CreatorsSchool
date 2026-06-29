import { defineField, defineType } from 'sanity'
import { richTitleField } from '../fragments/rich-title'

export default defineType({
	name: 'performance-banner',
	title: 'Performance banner (plum)',
	type: 'object',
	fields: [
		defineField({
			name: 'performance',
			title: 'Performance',
			description:
				'If empty: uses the featured performance for the current language.',
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
			name: 'title',
			title: 'Headline (override)',
			description: 'If empty: uses the performance title.',
			...richTitleField(),
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
		prepare: () => ({ title: 'Performance banner' }),
	},
})
