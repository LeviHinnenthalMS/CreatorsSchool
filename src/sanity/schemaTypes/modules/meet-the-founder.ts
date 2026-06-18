import { defineField, defineType } from 'sanity'
import { GoPerson } from 'react-icons/go'

export default defineType({
	name: 'meet-the-founder',
	title: 'Meet the Founder',
	icon: GoPerson,
	type: 'object',
	fields: [
		defineField({
			name: 'title',
			title: 'Heading',
			type: 'string',
		}),
		defineField({
			name: 'founder',
			title: 'Founder',
			type: 'reference',
			to: [{ type: 'person' }],
		}),
	],
	preview: {
		select: {
			title: 'title',
			founderName: 'founder.name',
			media: 'founder.image',
		},
		prepare: ({ title, founderName, media }) => ({
			title: title || 'Meet the Founder',
			subtitle: founderName,
			media,
		}),
	},
})
