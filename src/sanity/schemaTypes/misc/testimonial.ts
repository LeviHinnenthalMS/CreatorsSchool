import { defineField, defineType } from 'sanity'
import { GrBlockQuote } from 'react-icons/gr'
import { getBlockText } from '@/lib/utils'
import UsageList from '@/sanity/ui/UsageList'

export default defineType({
	name: 'testimonial',
	title: 'Testimonial',
	icon: GrBlockQuote,
	type: 'document',
	groups: [
		{ name: 'content', default: true },
		{ name: 'usage', title: 'Used on' },
	],
	fields: [
		defineField({
			name: 'content',
			title: 'Content (Block)',
			type: 'array',
			of: [{ type: 'block' }],
			group: 'content',
		}),
		defineField({
			name: 'author',
			title: 'Author',
			type: 'object',
			group: 'content',
			fields: [
				defineField({ name: 'name', type: 'string' }),
				defineField({ name: 'role', type: 'string' }),
				defineField({
					name: 'image',
					type: 'image',
					options: { hotspot: true },
				}),
			],
		}),
		defineField({
			name: 'highlight',
			title: 'Highlight',
			type: 'boolean',
			initialValue: false,
			group: 'content',
		}),
		defineField({
			name: 'usage',
			title: 'Used on',
			description:
				'Pages and other documents that directly reference this testimonial. Open one to jump to it.',
			type: 'string',
			readOnly: true,
			group: 'usage',
			components: {
				field: UsageList as any,
			},
		}),
		defineField({
			name: 'language',
			type: 'string',
			readOnly: true,
			hidden: true,
		}),
	],
	preview: {
		select: {
			content: 'content',
			author: 'author',
			language: 'language',
		},
		prepare: ({ content, author, language }) => ({
			title: author?.name || 'No author',
			subtitle: [language && `[${language}]`, getBlockText(content)]
				.filter(Boolean)
				.join(' '),
			media: author?.image,
		}),
	},
})
