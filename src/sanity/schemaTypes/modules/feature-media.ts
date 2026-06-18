import { defineField, defineType } from 'sanity'
import { TfiLayoutMediaCenter } from 'react-icons/tfi'
import { getBlockText } from '@/lib/utils'

export default defineType({
	name: 'feature-media',
	title: 'Feature with media',
	icon: TfiLayoutMediaCenter,
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
			description:
				'Main headline shown above the media. Rendered as <h2>. Use line breaks for multi-line layouts.',
			type: 'text',
			rows: 3,
			validation: (Rule) => Rule.required(),
			group: 'content',
		}),
		defineField({
			name: 'intro',
			title: 'Subtitle / description',
			description: 'Optional supporting copy shown below the headline.',
			type: 'array',
			of: [{ type: 'block' }],
			group: 'content',
		}),
		defineField({
			name: 'image',
			title: 'Media',
			description: 'Large image shown between the description and the CTA.',
			type: 'img',
			validation: (Rule) => Rule.required(),
			group: 'content',
		}),
		defineField({
			name: 'ctas',
			title: 'Call-to-actions',
			description: 'Optional. Shown centered below the media.',
			type: 'array',
			of: [{ type: 'cta' }],
			group: 'content',
		}),
	],
	preview: {
		select: {
			title: 'title',
			intro: 'intro',
			media: 'image.image',
		},
		prepare: ({ title, intro, media }) => ({
			title: title || getBlockText(intro),
			subtitle: 'Feature with media',
			media,
		}),
	},
})
