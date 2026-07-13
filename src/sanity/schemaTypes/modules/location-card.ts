import { defineArrayMember, defineField, defineType } from 'sanity'
import { richTitleField } from '../fragments/rich-title'
import { getBlockText } from '@/lib/utils'

export default defineType({
	name: 'location-card',
	title: 'Location card',
	type: 'object',
	fields: [
		defineField({ name: 'eyebrow', title: 'Eyebrow', type: 'string' }),
		defineField({
			name: 'title',
			title: 'Headline',
			...richTitleField(),
		}),
		defineField({
			name: 'text',
			title: 'Text',
			type: 'text',
			rows: 3,
		}),
		defineField({
			name: 'directions',
			title: 'Direction items',
			type: 'array',
			of: [
				defineArrayMember({
					type: 'object',
					name: 'direction',
					fields: [
						defineField({ name: 'icon', title: 'Icon key', type: 'string' }),
						defineField({ name: 'title', title: 'Title', type: 'string' }),
						defineField({ name: 'text', title: 'Text', type: 'string' }),
					],
					preview: { select: { title: 'title', subtitle: 'text' } },
				}),
			],
		}),
		defineField({
			name: 'mapEmbedUrl',
			title: 'Google Maps embed URL',
			description: 'Share → Embed a map → copy the src URL. Shown only after cookie consent.',
			type: 'url',
		}),
		defineField({
			name: 'mapImage',
			title: 'Map image (static map or screenshot)',
			type: 'image',
			options: { hotspot: true, metadata: ['lqip'] },
			fields: [
				defineField({ name: 'alt', title: 'Alt text', type: 'string' }),
			],
		}),
		defineField({
			name: 'mapLink',
			title: 'Maps link',
			type: 'link',
		}),
		defineField({
			name: 'mapLinkLabel',
			title: 'Maps button label',
			type: 'string',
		}),
		defineField({ name: 'options', type: 'module-options' }),
	],
	preview: {
		select: { title: 'title' },
		prepare: ({ title }) => ({ title: getBlockText(title) || 'Location card', subtitle: 'Location card' }),
	},
})
