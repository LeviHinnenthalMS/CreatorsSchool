import { defineArrayMember, defineField, defineType } from 'sanity'
import { TfiLayoutMediaLeft } from 'react-icons/tfi'
import { getBlockText } from '@/lib/utils'

export default defineType({
	name: 'hero.split',
	title: 'Hero (split)',
	icon: TfiLayoutMediaLeft,
	type: 'object',
	groups: [{ name: 'content', default: true }, { name: 'asset' }],
	fields: [
		defineField({
			name: 'eyebrowImage',
			title: 'Eyebrow image',
			description:
				'Optional small image/badge displayed above the headline (e.g. a "2500 downloads" tag).',
			type: 'img',
			group: 'content',
		}),
		defineField({
			name: 'title',
			title: 'Title (H1)',
			description:
				'The main headline. Always rendered as <h1>. Use line breaks for multi-line layouts.',
			type: 'text',
			rows: 3,
			validation: (Rule) => Rule.required(),
			group: 'content',
		}),
		defineField({
			name: 'content',
			title: 'Description',
			description: 'Optional supporting copy shown below the headline.',
			type: 'array',
			of: [{ type: 'block' }, { type: 'custom-html' }],
			group: 'content',
		}),
		defineField({
			name: 'ctas',
			title: 'Call-to-actions',
			type: 'array',
			of: [{ type: 'cta' }],
			group: 'content',
		}),
		defineField({
			name: 'assets',
			title: 'Assets',
			type: 'array',
			of: [
				{ type: 'img' },
				defineArrayMember({
					title: 'Code block',
					type: 'code',
					options: { withFilename: true },
				}),
				{ type: 'custom-html' },
			],
			validation: (Rule) => Rule.max(1),
			group: 'asset',
		}),
		defineField({
			name: 'assetOnRight',
			type: 'boolean',
			description: 'Display the asset to the right of the content on desktop',
			initialValue: false,
			group: 'asset',
		}),
		defineField({
			name: 'assetBelowContent',
			type: 'boolean',
			description: 'Display the asset below the content on mobile',
			initialValue: false,
			group: 'asset',
		}),
	],
	preview: {
		select: {
			title: 'title',
			content: 'content',
			media: 'assets.0.image',
		},
		prepare: ({ title, content, media }) => ({
			title: title || getBlockText(content),
			subtitle: 'Hero (split)',
			media,
		}),
	},
})
