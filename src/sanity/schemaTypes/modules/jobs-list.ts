import { defineField, defineType } from 'sanity'
import { richTitleField } from '../fragments/rich-title'

export default defineType({
	name: 'jobs-list',
	title: 'Jobs list',
	type: 'object',
	fields: [
		defineField({ name: 'eyebrow', title: 'Eyebrow', type: 'string' }),
		defineField({
			name: 'title',
			title: 'Headline',
			...richTitleField(),
		}),
		defineField({
			name: 'applyLabel',
			title: 'Apply button label',
			type: 'string',
		}),
		defineField({
			name: 'emptyText',
			title: 'Empty-state text',
			type: 'string',
		}),
		defineField({
			name: 'tinted',
			title: 'Warm-white background',
			type: 'boolean',
			initialValue: true,
		}),
		defineField({ name: 'options', type: 'module-options' }),
	],
	preview: {
		select: { eyebrow: 'eyebrow' },
		prepare: ({ eyebrow }) => ({ title: eyebrow || 'Jobs list', subtitle: 'Jobs list' }),
	},
})
