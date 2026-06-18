import { defineField, defineType } from 'sanity'
import { VscVerified } from 'react-icons/vsc'
import { getBlockText, count } from '@/lib/utils'
import { byLanguage } from '@/sanity/lib/byLanguage'

export default defineType({
	name: 'social-proof.logos',
	title: 'Logo marquee',
	icon: VscVerified,
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
				'Headline shown above the logos. Rendered as <h2>. Leave empty to hide.',
			type: 'string',
			group: 'content',
		}),
		defineField({
			name: 'intro',
			title: 'Intro / subtitle',
			description: 'Optional supporting copy shown below the headline.',
			type: 'array',
			of: [{ type: 'block' }],
			group: 'content',
		}),
		defineField({
			name: 'logos',
			title: 'Logos',
			description:
				'Order matters. The strip scrolls infinitely and duplicates entries automatically. Recommended: at least 6 logos.',
			type: 'array',
			of: [
				{
					type: 'reference',
					to: [{ type: 'logo' }],
					options: { filter: byLanguage },
				},
			],
			validation: (Rule) => Rule.min(1),
			group: 'content',
		}),
		defineField({
			name: 'ctas',
			title: 'Call-to-actions',
			description: 'Optional. Shown below the logos.',
			type: 'array',
			of: [{ type: 'cta' }],
			group: 'content',
		}),
	],
	preview: {
		select: {
			title: 'title',
			intro: 'intro',
			logos: 'logos',
		},
		prepare: ({ title, intro, logos }) => ({
			title: title || getBlockText(intro) || count(logos, 'logo'),
			subtitle: 'Logo marquee',
		}),
	},
})
