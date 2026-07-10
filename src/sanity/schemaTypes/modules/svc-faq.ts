import { defineArrayMember, defineField, defineType } from 'sanity'
import { richTitleField } from '../fragments/rich-title'

export default defineType({
	name: 'svc-faq',
	title: 'Service · FAQ',
	description: 'FAQ block: left = headline + CTA, right = accordion items.',
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
			name: 'ctas',
			title: 'CTAs (left column)',
			type: 'array',
			of: [{ type: 'cta' }],
		}),
		defineField({
			name: 'items',
			title: 'FAQ items',
			type: 'array',
			of: [
				defineArrayMember({
					type: 'object',
					name: 'qa',
					fields: [
						defineField({ name: 'q', title: 'Question', type: 'string' }),
						defineField({ name: 'a', title: 'Answer', type: 'text', rows: 4 }),
						defineField({
							name: 'defaultOpen',
							title: 'Open by default',
							type: 'boolean',
							initialValue: false,
						}),
					],
					preview: { select: { title: 'q' } },
				}),
			],
		}),
		defineField({ name: 'options', type: 'module-options' }),
	],
	preview: {
		select: { eyebrow: 'eyebrow' },
		prepare: ({ eyebrow }) => ({ title: eyebrow || 'Service FAQ', subtitle: 'Service · FAQ' }),
	},
})
