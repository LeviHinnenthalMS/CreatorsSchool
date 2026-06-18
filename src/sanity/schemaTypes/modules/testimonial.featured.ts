import { defineField, defineType } from 'sanity'
import { GrBlockQuote } from 'react-icons/gr'
import { getBlockText } from '@/lib/utils'
import { byLanguage } from '@/sanity/lib/byLanguage'

export default defineType({
	name: 'testimonial.featured',
	title: 'Testimonial (featured)',
	icon: GrBlockQuote,
	type: 'object',
	groups: [{ name: 'content', default: true }, { name: 'options' }],
	fields: [
		defineField({
			name: 'options',
			title: 'Module options',
			type: 'module-options',
			group: 'options',
		}),
		defineField({
			name: 'testimonial',
			title: 'Testimonial',
			description:
				'Reference the testimonial document to feature. The author photo is used as the side image.',
			type: 'reference',
			to: [{ type: 'testimonial' }],
			options: { filter: byLanguage },
			validation: (Rule) => Rule.required(),
			group: 'content',
		}),
	],
	preview: {
		select: {
			testimonial: 'testimonial.content',
			image: 'testimonial.author.image',
		},
		prepare: ({ testimonial, image }) => {
			return {
				title: getBlockText(testimonial),
				subtitle: 'Testimonial (featured)',
				media: image,
			}
		},
	},
})
