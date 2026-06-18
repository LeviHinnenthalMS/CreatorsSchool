import { defineField, defineType } from 'sanity'
import { VscPreview } from 'react-icons/vsc'
import { getBlockText } from '@/lib/utils'
import { BG_OPTIONS } from '@/sanity/schemaTypes/fragments/background'

export default defineType({
	name: 'image-callouts',
	title: 'Image with callouts',
	icon: VscPreview,
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
			name: 'image',
			title: 'Image',
			description:
				'Full-width illustration. Any callouts/arrows are baked into this image asset.',
			type: 'img',
			group: 'content',
		}),
		defineField({
			name: 'bottomVariant',
			title: 'Bottom content',
			description:
				'What to show between the image and the CTAs. Choose "Checklist" for a row of ✓ items, or "Text" for a rich-text paragraph.',
			type: 'string',
			options: {
				list: [
					{ title: 'None', value: 'none' },
					{ title: 'Checklist', value: 'checklist' },
					{ title: 'Text', value: 'text' },
				],
				layout: 'radio',
			},
			initialValue: 'checklist',
			group: 'content',
		}),
		defineField({
			name: 'checklist',
			title: 'Checklist',
			description: 'Bullet row shown below the image. Each item is prefixed with a check icon.',
			type: 'array',
			of: [{ type: 'string' }],
			hidden: ({ parent }) => parent?.bottomVariant !== 'checklist',
			group: 'content',
		}),
		defineField({
			name: 'bottomText',
			title: 'Text',
			description: 'Rich-text block shown below the image.',
			type: 'array',
			of: [{ type: 'block' }],
			hidden: ({ parent }) => parent?.bottomVariant !== 'text',
			group: 'content',
		}),
		defineField({
			name: 'ctas',
			title: 'Call-to-actions',
			description: 'Optional. Shown centered at the bottom of the module.',
			type: 'array',
			of: [{ type: 'cta' }],
			group: 'content',
		}),
		defineField({
			name: 'background',
			title: 'Section background',
			type: 'string',
			options: {
				list: [...BG_OPTIONS],
				layout: 'radio',
			},
			initialValue: 'white',
			group: 'options',
		}),
		defineField({
			name: 'removeTopPadding',
			title: 'Remove top padding',
			description:
				'Useful when this module should sit flush against the previous one (no gap).',
			type: 'boolean',
			initialValue: false,
			group: 'options',
		}),
	],
	preview: {
		select: {
			title: 'title',
			intro: 'intro',
			image: 'image.image',
		},
		prepare: ({ title, intro, image }) => ({
			title: title || getBlockText(intro) || 'Image with callouts',
			subtitle: 'Image with callouts',
			media: image,
		}),
	},
})
