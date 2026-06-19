import { defineField, defineType } from 'sanity'

export default defineType({
	name: 'testimonial-cards',
	title: 'Testimonial-Karten (Creators)',
	description:
		'Variante der Testimonial-Grid mit Stars + tönten Karten in der Creators-Optik.',
	type: 'object',
	fields: [
		defineField({ name: 'eyebrow', title: 'Eyebrow', type: 'string' }),
		defineField({
			name: 'titleBefore',
			title: 'Headline · vor Akzent',
			type: 'string',
		}),
		defineField({
			name: 'titleAccent',
			title: 'Headline · Akzent',
			type: 'string',
		}),
		defineField({
			name: 'titleAfter',
			title: 'Headline · nach Akzent',
			type: 'string',
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
		prepare: () => ({ title: 'Testimonial-Karten' }),
	},
})
