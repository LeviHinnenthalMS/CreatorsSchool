import { defineField, defineType } from 'sanity'
import { VscListUnordered } from 'react-icons/vsc'
import { count } from '@/lib/utils'

export default defineType({
	name: 'link.group',
	title: 'Link group',
	icon: VscListUnordered,
	type: 'object',
	fields: [
		defineField({
			name: 'title',
			title: 'Title',
			type: 'string',
		}),
		defineField({
			name: 'links',
			title: 'Links',
			type: 'array',
			of: [{ type: 'link' }],
		}),
	],
	preview: {
		select: { title: 'title', links: 'links' },
		prepare: ({ title, links }) => ({
			title,
			subtitle: count(links, 'link'),
		}),
	},
})
