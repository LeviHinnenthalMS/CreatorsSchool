import { defineField, defineType } from 'sanity'
import { GrBlockQuote } from 'react-icons/gr'
import { getBlockText, count } from '@/lib/utils'
import { byLanguage } from '@/sanity/lib/byLanguage'

export default defineType({
	name: 'testimonial.grid',
	title: 'Testimonial grid',
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
			name: 'title',
			title: 'Title (H2)',
			description: 'Main heading shown above the grid. Rendered as <h2>.',
			type: 'string',
			group: 'content',
		}),
		defineField({
			name: 'intro',
			title: 'Intro / subtitle',
			description: 'Optional supporting copy shown below the heading.',
			type: 'array',
			of: [{ type: 'block' }],
			group: 'content',
		}),
		defineField({
			name: 'testimonials',
			title: 'Testimonials',
			description:
				'Distributed across three columns in the order you set here.',
			type: 'array',
			of: [
				{
					type: 'reference',
					to: [{ type: 'testimonial' }],
					options: { filter: byLanguage },
				},
			],
			validation: (Rule) => Rule.min(1),
			group: 'content',
		}),
		defineField({
			name: 'ctas',
			title: 'Call-to-actions',
			description: 'Optional. Shown below the heading.',
			type: 'array',
			of: [{ type: 'cta' }],
			group: 'content',
		}),
	],
	preview: {
		select: {
			title: 'title',
			intro: 'intro',
			testimonials: 'testimonials',
		},
		prepare: ({ title, intro, testimonials }) => ({
			title:
				title ||
				getBlockText(intro) ||
				count(testimonials, 'testimonial'),
			subtitle: 'Testimonial grid',
		}),
	},
})
