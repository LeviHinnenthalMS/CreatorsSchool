import { defineArrayMember, defineField, defineType } from 'sanity'
import { richTitleField } from '../fragments/rich-title'

export default defineType({
	name: 'feature-grid',
	title: 'Feature grid · 4 cards',
	type: 'object',
	fields: [
		defineField({ name: 'eyebrow', title: 'Eyebrow', type: 'string' }),
		defineField({
			name: 'title',
			title: 'Headline',
			...richTitleField(),
		}),
		defineField({
			name: 'tagline',
			title: 'Tagline (next to headline)',
			type: 'text',
			rows: 3,
		}),
		defineField({
			name: 'features',
			title: 'Features',
			type: 'array',
			of: [
				defineArrayMember({
					type: 'object',
					name: 'featureCard',
					fields: [
						defineField({
							name: 'tint',
							title: 'Tint',
							type: 'string',
							options: {
								list: [
									{ title: 'Coral (blush)', value: 'coral' },
									{ title: 'Warm white', value: 'soft' },
								],
								layout: 'radio',
							},
							initialValue: 'soft',
						}),
						defineField({ name: 'icon', title: 'Icon key', type: 'string' }),
						defineField({ name: 'title', title: 'Title', type: 'string' }),
						defineField({ name: 'text', title: 'Text', type: 'text', rows: 3 }),
					],
					preview: { select: { title: 'title', subtitle: 'text' } },
				}),
			],
		}),
		defineField({ name: 'options', type: 'module-options' }),
	],
	preview: {
		select: { eyebrow: 'eyebrow' },
		prepare: ({ eyebrow }) => ({ title: eyebrow || 'Feature grid', subtitle: 'Feature grid · 4 cards' }),
	},
})
