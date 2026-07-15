import { defineArrayMember, defineField, defineType } from 'sanity'
import { richTitleField } from '../fragments/rich-title'

export default defineType({
	name: 'page-header',
	title: 'Page header (inner pages)',
	type: 'object',
	fields: [
		defineField({ name: 'eyebrow', title: 'Eyebrow', type: 'string' }),
		defineField({
			name: 'title',
			title: 'Headline',
			description:
				'Press Enter for a new line. Mark inline text as Accent or Pill for emphasis.',
			...richTitleField(),
		}),
		defineField({
			name: 'lede',
			title: 'Lead text',
			type: 'text',
			rows: 3,
		}),
		defineField({
			name: 'facts',
			title: 'Fact chips',
			description: 'Optional. Shows e.g. age, duration, level, price as chips.',
			type: 'array',
			of: [
				defineArrayMember({
					type: 'object',
					name: 'fact',
					fields: [
						defineField({ name: 'key', title: 'Label', type: 'string' }),
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
		defineField({ name: 'options', type: 'module-options' }),
	],
	preview: {
		select: { eyebrow: 'eyebrow' },
		prepare: ({ eyebrow }) => ({
			title: eyebrow || 'Page header',
			subtitle: 'Page header',
		}),
	},
})
