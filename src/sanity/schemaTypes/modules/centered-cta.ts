import { defineField, defineType } from 'sanity'
import { LuMegaphone } from 'react-icons/lu'
import { getBlockText } from '@/lib/utils'

export default defineType({
	name: 'centered-cta',
	title: 'Centered CTA',
	icon: LuMegaphone,
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
			title: 'Title',
			description:
				'Main centered message. Rendered as <h2> styled at H4 size. Use line breaks for multi-line layouts.',
			type: 'text',
			rows: 3,
			group: 'content',
		}),
		defineField({
			name: 'intro',
			title: 'Subtitle',
			description: 'Optional supporting copy shown below the headline.',
			type: 'array',
			of: [{ type: 'block' }],
			group: 'content',
		}),
		defineField({
			name: 'ctas',
			title: 'Call-to-actions',
			description:
				'Buttons shown below the message. Per-button you can pick variant (Primary / Secondary / Tertiary), size, and an optional icon.',
			type: 'array',
			of: [{ type: 'cta' }],
			group: 'content',
		}),
	],
	preview: {
		select: { title: 'title', intro: 'intro' },
		prepare: ({ title, intro }) => ({
			title: title || getBlockText(intro),
			subtitle: 'Centered CTA',
		}),
	},
})
