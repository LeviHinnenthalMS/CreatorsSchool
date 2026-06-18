import { defineArrayMember, defineField, defineType } from 'sanity'
import { TfiLayoutTab } from 'react-icons/tfi'
import { getBlockText, count } from '@/lib/utils'

export default defineType({
	name: 'feature-tabs',
	title: 'Feature tabs',
	icon: TfiLayoutTab,
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
				'Main headline shown above the tabs. Rendered as <h2>. Use line breaks for multi-line layouts.',
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
			name: 'tabsHeading',
			title: 'Tabs heading',
			description:
				'Optional lead-in text shown above the list of tabs (e.g. "So funktioniert die 2minBibel:").',
			type: 'string',
			group: 'content',
		}),
		defineField({
			name: 'tabs',
			title: 'Tabs',
			description:
				'Each tab shows its image on the right when selected. Editors choose the order; the first tab is selected by default.',
			type: 'array',
			of: [
				defineArrayMember({
					type: 'object',
					name: 'tab',
					fields: [
						defineField({
							name: 'title',
							title: 'Title',
							type: 'string',
							validation: (Rule) => Rule.required(),
						}),
						defineField({
							name: 'subtitle',
							title: 'Description',
							type: 'text',
							rows: 3,
							validation: (Rule) => Rule.required(),
						}),
						defineField({
							name: 'link',
							title: 'Link',
							description:
								'Optional. Rendered as a "Learn more →" link below the description.',
							type: 'link',
						}),
						defineField({
							name: 'linkLabel',
							title: 'Link label',
							description:
								'Overrides the link label set on the link itself for this tab.',
							type: 'string',
							hidden: ({ parent }) => !parent?.link?.type,
						}),
						defineField({
							name: 'image',
							title: 'Image',
							description:
								'Shown on the right when this tab is selected. If a video is uploaded below, this image is used as the poster (shown while the video loads).',
							type: 'img',
							validation: (Rule) => Rule.required(),
						}),
						defineField({
							name: 'video',
							title: 'Video (optional)',
							description:
								'Optional looping video shown instead of the image when this tab is active. Upload an .mp4 or .webm (autoplay, muted, looped). Keep it short and lightweight (under ~3 MB).',
							type: 'file',
							options: {
								accept: 'video/mp4,video/webm',
							},
						}),
					],
					preview: {
						select: {
							title: 'title',
							subtitle: 'subtitle',
							media: 'image.image',
						},
						prepare: ({ title, subtitle, media }) => ({
							title,
							subtitle,
							media,
						}),
					},
				}),
			],
			validation: (Rule) => Rule.required().min(1),
			group: 'content',
		}),
	],
	preview: {
		select: {
			title: 'title',
			intro: 'intro',
			tabs: 'tabs',
			media: 'tabs.0.image.image',
		},
		prepare: ({ title, intro, tabs, media }) => ({
			title: title || getBlockText(intro) || count(tabs, 'tab'),
			subtitle: 'Feature tabs',
			media,
		}),
	},
})
