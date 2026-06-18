import { defineField, defineType } from 'sanity'
import { VscFolderOpened } from 'react-icons/vsc'
import { count } from '@/lib/utils'

export default defineType({
	name: 'link.list',
	title: 'Link list',
	icon: VscFolderOpened,
	type: 'object',
	fields: [
		defineField({
			name: 'active',
			title: 'Active',
			description:
				'Toggle off to hide this dropdown in the header navigation without deleting it.',
			type: 'boolean',
			initialValue: true,
		}),
		defineField({
			name: 'link',
			type: 'link',
		}),
		defineField({
			name: 'links',
			type: 'array',
			of: [{ type: 'link.nav' }],
		}),
	],
	preview: {
		select: {
			link: 'link',
			links: 'links',
			active: 'active',
		},
		prepare: ({ link, links, active }) => ({
			title: [active === false && '(inactive)', link.label || link.internal?.title]
				.filter(Boolean)
				.join(' '),
			subtitle: count(links, 'link'),
		}),
	},
})
