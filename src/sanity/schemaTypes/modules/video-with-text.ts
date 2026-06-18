import { defineField, defineType } from 'sanity'
import { VscDeviceCameraVideo } from 'react-icons/vsc'
import { getBlockText } from '@/lib/utils'
import { BG_OPTIONS } from '@/sanity/schemaTypes/fragments/background'

export default defineType({
	name: 'video-with-text',
	title: 'Video with text',
	icon: VscDeviceCameraVideo,
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
			description: 'Main heading shown above the video. Rendered as <h2>.',
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
			name: 'youtubeUrl',
			title: 'YouTube URL',
			description:
				'Paste the standard share or watch URL. youtu.be, /watch, /embed/ and /shorts/ links are all supported.',
			type: 'url',
			validation: (Rule) =>
				Rule.required().uri({ scheme: ['http', 'https'] }),
			group: 'content',
		}),
		defineField({
			name: 'body',
			title: 'Body',
			description: 'Rich text shown below the video.',
			type: 'array',
			of: [{ type: 'block' }],
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
	],
	preview: {
		select: {
			title: 'title',
			intro: 'intro',
			body: 'body',
		},
		prepare: ({ title, intro, body }) => ({
			title: title || getBlockText(intro) || getBlockText(body) || 'Video with text',
			subtitle: 'Video with text',
		}),
	},
})
