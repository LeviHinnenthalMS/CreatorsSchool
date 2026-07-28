import { defineField, defineType } from 'sanity'
import { richTitleField } from '../fragments/rich-title'

export default defineType({
	name: 'testimonial-cards',
	title: 'Testimonials · slider',
	description:
		'A simple testimonial slider with transparent slides and subtle dividers.',
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
			name: 'testimonials',
			title: 'Testimonials',
			type: 'array',
			of: [{ type: 'reference', to: [{ type: 'testimonial' }] }],
		}),
		defineField({ name: 'options', type: 'module-options' }),
	],
	preview: {
		select: { eyebrow: 'eyebrow' },
		prepare: ({ eyebrow }) => ({
			title: eyebrow || 'Testimonials',
			subtitle: 'Testimonials · slider',
		}),
	},
})
