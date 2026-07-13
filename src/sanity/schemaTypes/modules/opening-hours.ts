import { defineArrayMember, defineField, defineType } from 'sanity'
import { richTitleField } from '../fragments/rich-title'

const DAY_KEYS = [
	{ title: 'Montag', value: 'mo' },
	{ title: 'Dienstag', value: 'di' },
	{ title: 'Mittwoch', value: 'mi' },
	{ title: 'Donnerstag', value: 'do' },
	{ title: 'Freitag', value: 'fr' },
	{ title: 'Samstag', value: 'sa' },
	{ title: 'Sonntag', value: 'so' },
]

export default defineType({
	name: 'opening-hours',
	title: 'Opening hours',
	type: 'object',
	fields: [
		defineField({ name: 'eyebrow', title: 'Eyebrow', type: 'string' }),
		defineField({ name: 'title', title: 'Headline', ...richTitleField() }),
		defineField({ name: 'text', title: 'Body text', type: 'text', rows: 3 }),
		defineField({
			name: 'hours',
			title: 'Hours per day',
			type: 'array',
			of: [
				defineArrayMember({
					type: 'object',
					name: 'hourRow',
					fields: [
						defineField({
							name: 'dayKey',
							title: 'Day',
							type: 'string',
							options: { list: DAY_KEYS, layout: 'radio' },
						}),
						defineField({ name: 'label', title: 'Label', type: 'string', description: 'e.g. Montag' }),
						defineField({ name: 'open', title: 'Opens', type: 'string', description: 'e.g. 09:00' }),
						defineField({ name: 'close', title: 'Closes', type: 'string', description: 'e.g. 20:00' }),
						defineField({ name: 'closed', title: 'Closed', type: 'boolean', initialValue: false }),
					],
					preview: {
						select: { title: 'label', open: 'open', close: 'close', closed: 'closed' },
						prepare: ({ title, open, close, closed }) => ({
							title,
							subtitle: closed ? 'Geschlossen' : `${open} – ${close} Uhr`,
						}),
					},
				}),
			],
		}),
		defineField({ name: 'options', type: 'module-options' }),
	],
	preview: {
		select: { eyebrow: 'eyebrow' },
		prepare: ({ eyebrow }) => ({ title: eyebrow || 'Opening hours', subtitle: 'Opening hours' }),
	},
})
