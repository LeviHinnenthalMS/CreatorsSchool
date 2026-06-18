import { defineField, defineType } from 'sanity'
import { VscSymbolColor } from 'react-icons/vsc'

export default defineType({
	name: 'style-guide',
	title: 'Style guide',
	icon: VscSymbolColor,
	type: 'object',
	description:
		'Renders the full UI primitive set — headings, body texts, buttons. Drop on a styleguide page.',
	fields: [
		defineField({
			name: 'title',
			title: 'Title',
			type: 'string',
			initialValue: 'Style guide',
		}),
	],
	preview: {
		select: { title: 'title' },
		prepare: ({ title }) => ({
			title: title || 'Style guide',
			subtitle: 'UI primitives',
		}),
	},
})
