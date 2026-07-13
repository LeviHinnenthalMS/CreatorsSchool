import { defineArrayMember, defineField, defineType } from 'sanity'
import { richTitleField } from '../fragments/rich-title'

export default defineType({
	name: 'performance-dates',
	title: 'Performance · Termine',
	type: 'object',
	fields: [
		defineField({ name: 'eyebrow', title: 'Eyebrow', type: 'string' }),
		defineField({ name: 'title', title: 'Headline', ...richTitleField() }),
		defineField({
			name: 'tinted',
			title: 'Tinted background',
			type: 'boolean',
			initialValue: true,
		}),
		defineField({
			name: 'rows',
			title: 'Date rows',
			type: 'array',
			of: [
				defineArrayMember({
					type: 'object',
					name: 'dateRow',
					fields: [
						defineField({ name: 'date', title: 'Date label', type: 'string', description: 'e.g. "Fr · 4. Sep"' }),
						defineField({ name: 'sublabel', title: 'Sub-label', type: 'string', description: 'e.g. "Generalprobe"' }),
						defineField({ name: 'title', title: 'Event title', type: 'string' }),
						defineField({ name: 'text', title: 'Description', type: 'text', rows: 2 }),
					],
					preview: {
						select: { title: 'date', subtitle: 'title' },
					},
				}),
			],
		}),
		defineField({ name: 'options', type: 'module-options' }),
	],
	preview: {
		select: { eyebrow: 'eyebrow' },
		prepare: ({ eyebrow }) => ({
			title: eyebrow ?? 'Termine',
			subtitle: 'Performance · Termine',
		}),
	},
})
