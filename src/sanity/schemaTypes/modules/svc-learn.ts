import { defineArrayMember, defineField, defineType } from 'sanity'
import { richTitleField } from '../fragments/rich-title'

export default defineType({
	name: 'svc-learn',
	title: 'Service · 3 learning cards',
	description: 'Three cards with icon, title and text — e.g. "What you\'ll learn".',
	type: 'object',
	fields: [
		defineField({ name: 'eyebrow', title: 'Eyebrow', type: 'string' }),
		defineField({
			name: 'title',
			title: 'Headline',
			...richTitleField(),
		}),
		defineField({
			name: 'tinted',
			title: 'Warm-white background',
			type: 'boolean',
			initialValue: true,
		}),
		defineField({
			name: 'cards',
			title: 'Cards (3)',
			validation: (Rule) => Rule.max(3),
			type: 'array',
			of: [
				defineArrayMember({
					type: 'object',
					name: 'learnCard',
					fields: [
						defineField({ name: 'icon', title: 'Icon key', type: 'string' }),
						defineField({ name: 'title', title: 'Title', type: 'string' }),
						defineField({ name: 'text', title: 'Text', type: 'text', rows: 2 }),
					],
					preview: { select: { title: 'title', subtitle: 'text' } },
				}),
			],
		}),
		defineField({ name: 'options', type: 'module-options' }),
	],
	preview: {
		select: { eyebrow: 'eyebrow' },
		prepare: ({ eyebrow }) => ({ title: eyebrow || 'Service learn', subtitle: 'Service · 3 learning cards' }),
	},
})
