import { defineArrayMember, defineField, defineType } from 'sanity'
import { richTitleField } from '../fragments/rich-title'

export default defineType({
	name: 'svc-split',
	title: 'Service split (text + bullets)',
	description:
		'Two-column layout: left = headline + lead, right = bulleted check-list.',
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
			name: 'tinted',
			title: 'Warm-white background',
			type: 'boolean',
			initialValue: false,
		}),
		defineField({
			name: 'items',
			title: 'List (right column)',
			type: 'array',
			of: [
				defineArrayMember({
					type: 'object',
					name: 'svcItem',
					fields: [
						defineField({ name: 'title', title: 'Title', type: 'string' }),
						defineField({ name: 'text', title: 'Text', type: 'string' }),
					],
					preview: { select: { title: 'title', subtitle: 'text' } },
				}),
			],
		}),
		defineField({ name: 'options', type: 'module-options' }),
	],
	preview: {
		prepare: () => ({ title: 'Service split' }),
	},
})
