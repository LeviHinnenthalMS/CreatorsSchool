import { defineField, defineType } from 'sanity'
import { VscListUnordered } from 'react-icons/vsc'

export default defineType({
	name: 'feature',
	title: 'Feature',
	type: 'object',
	icon: VscListUnordered,
	fields: [
		defineField({
			name: 'icon',
			type: 'icon',
		}),
		defineField({
			name: 'title',
			type: 'string',
			validation: (Rule) => Rule.required(),
		}),
		defineField({
			name: 'subtitle',
			type: 'text',
			rows: 3,
		}),
	],
	preview: {
		select: {
			title: 'title',
			subtitle: 'subtitle',
			ic0n: 'icon.ic0n',
			image: 'icon.image',
		},
		prepare: ({ title, subtitle, ic0n, image }) => ({
			title: title || 'Feature',
			subtitle,
			media: ic0n ? <img src={`https://ic0n.dev/${ic0n}`} /> : image,
		}),
	},
})
