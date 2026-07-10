import { defineArrayMember, defineField, defineType } from 'sanity'
import { richTitleField } from '../fragments/rich-title'

export default defineType({
	name: 'welten-split',
	title: 'Two-worlds split (Music / Dance)',
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
			title: 'Tagline',
			type: 'text',
			rows: 3,
		}),
		defineField({
			name: 'cards',
			title: 'Cards (2)',
			validation: (Rule) => Rule.length(2).warning('Exactly 2 cards expected.'),
			type: 'array',
			of: [
				defineArrayMember({
					type: 'object',
					name: 'weltCard',
					fields: [
						defineField({
							name: 'variant',
							title: 'Variant',
							type: 'string',
							options: {
								list: [
									{ title: 'Music (warm white)', value: 'musik' },
									{ title: 'Dance (coral)', value: 'tanz' },
								],
								layout: 'radio',
							},
						}),
						defineField({ name: 'eyebrow', title: 'Eyebrow', type: 'string' }),
						defineField({ name: 'title', title: 'Title', type: 'string' }),
						defineField({
							name: 'subtitle',
							title: 'Subtitle (italic)',
							type: 'string',
						}),
						defineField({ name: 'text', title: 'Text', type: 'text', rows: 3 }),
						defineField({ name: 'link', title: 'Link', type: 'link' }),
						defineField({ name: 'linkLabel', title: 'Link label', type: 'string' }),
					],
					preview: { select: { title: 'title', subtitle: 'variant' } },
				}),
			],
		}),
		defineField({ name: 'options', type: 'module-options' }),
	],
	preview: {
		select: { eyebrow: 'eyebrow' },
		prepare: ({ eyebrow }) => ({ title: eyebrow || 'Two-worlds split', subtitle: 'Two-worlds split (Music / Dance)' }),
	},
})
