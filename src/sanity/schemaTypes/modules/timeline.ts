import { defineArrayMember, defineField, defineType } from 'sanity'
import { richTitleField } from '../fragments/rich-title'

export default defineType({
	name: 'timeline',
	title: 'Timeline',
	type: 'object',
	fields: [
		defineField({ name: 'eyebrow', title: 'Eyebrow', type: 'string' }),
		defineField({ name: 'title', title: 'Headline', ...richTitleField() }),
		defineField({ name: 'intro', title: 'Intro text', type: 'text', rows: 3 }),
		defineField({
			name: 'items',
			title: 'Timeline items',
			type: 'array',
			of: [
				defineArrayMember({
					type: 'object',
					name: 'timelineItem',
					fields: [
						defineField({ name: 'year', title: 'Year', type: 'string' }),
						defineField({ name: 'title', title: 'Title', ...richTitleField() }),
						defineField({ name: 'text', title: 'Text', type: 'text', rows: 3 }),
					],
					preview: {
						select: { year: 'year', subtitle: 'text' },
						prepare: ({ year, subtitle }) => ({ title: year ?? 'Item', subtitle }),
					},
				}),
			],
		}),
		defineField({ name: 'options', type: 'module-options' }),
	],
	preview: {
		select: { eyebrow: 'eyebrow' },
		prepare: ({ eyebrow }) => ({ title: eyebrow || 'Timeline', subtitle: 'Timeline' }),
	},
})
