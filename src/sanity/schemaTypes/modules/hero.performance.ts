import { defineField, defineType } from 'sanity'
import { richTitleField } from '../fragments/rich-title'

export default defineType({
	name: 'hero.performance',
	title: 'Hero · Aufführung',
	type: 'object',
	fields: [
		defineField({
			name: 'performance',
			title: 'Performance',
			description: 'If empty: uses the featured performance for the current language.',
			type: 'reference',
			to: [{ type: 'performance' }],
		}),
		defineField({ name: 'eyebrow', title: 'Eyebrow', type: 'string' }),
		defineField({
			name: 'title',
			title: 'Headline',
			...richTitleField(),
		}),
		defineField({ name: 'sub', title: 'Subtitle / venue line', type: 'string' }),
		defineField({ name: 'whatsappLabel', title: 'WhatsApp button label', type: 'string' }),
		defineField({ name: 'emailLabel', title: 'E-Mail button label', type: 'string' }),
		defineField({ name: 'options', type: 'module-options' }),
	],
	preview: {
		select: { eyebrow: 'eyebrow' },
		prepare: ({ eyebrow }) => ({
			title: 'Hero · Aufführung',
			subtitle: eyebrow ?? 'hero.performance',
		}),
	},
})
