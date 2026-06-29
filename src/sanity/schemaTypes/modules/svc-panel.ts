import { defineArrayMember, defineField, defineType } from 'sanity'
import { richTitleField } from '../fragments/rich-title'

export default defineType({
	name: 'svc-panel',
	title: 'Service · price panel (two columns)',
	description:
		'Left: headline + lead. Right: dark panel with price, detail rows and CTAs.',
	type: 'object',
	fields: [
		defineField({ name: 'eyebrow', title: 'Eyebrow', type: 'string' }),
		defineField({
			name: 'title',
			title: 'Headline',
			...richTitleField(),
		}),
		defineField({
			name: 'lead',
			title: 'Lead text',
			type: 'text',
			rows: 3,
		}),
		defineField({
			name: 'panel',
			title: 'Panel contents',
			type: 'object',
			fields: [
				defineField({ name: 'label', title: 'Top label', type: 'string' }),
				defineField({ name: 'currency', title: 'Currency', type: 'string' }),
				defineField({
					name: 'value',
					title: 'Value (price or text)',
					type: 'string',
				}),
				defineField({ name: 'unit', title: 'Unit', type: 'string' }),
				defineField({
					name: 'rows',
					title: 'Detail rows',
					type: 'array',
					of: [
						defineArrayMember({
							type: 'object',
							name: 'row',
							fields: [
								defineField({ name: 'key', title: 'Key', type: 'string' }),
								defineField({ name: 'value', title: 'Value', type: 'string' }),
							],
							preview: { select: { title: 'key', subtitle: 'value' } },
						}),
					],
				}),
				defineField({
					name: 'ctas',
					title: 'CTAs',
					type: 'array',
					of: [{ type: 'cta' }],
				}),
			],
		}),
		defineField({ name: 'options', type: 'module-options' }),
	],
	preview: {
		prepare: () => ({ title: 'Service panel' }),
	},
})
