import { defineField, defineType } from 'sanity'
import { GoPerson } from 'react-icons/go'

export default defineType({
	name: 'person',
	title: 'Person',
	type: 'document',
	icon: GoPerson,
	fields: [
		defineField({
			name: 'name',
			type: 'string',
			validation: (Rule) => Rule.required(),
		}),
		defineField({
			name: 'role',
			title: 'Role / Function',
			type: 'string',
		}),
		defineField({
			name: 'slug',
			type: 'slug',
			options: {
				source: 'name',
			},
		}),
		defineField({
			name: 'image',
			type: 'image',
			options: {
				hotspot: true,
			},
		}),
		defineField({
			name: 'bio',
			type: 'text',
			rows: 4,
		}),
		defineField({
			name: 'badge',
			title: 'Department badge',
			description: 'Short label on the card, e.g. "Leitung", "Tanz", "Instrumente"',
			type: 'string',
		}),
		defineField({
			name: 'cardColor',
			title: 'Card color',
			type: 'string',
			options: {
				list: [
					{ title: 'Red', value: 'red' },
					{ title: 'Coral (light red)', value: 'coral' },
					{ title: 'Gray', value: 'gray' },
					{ title: 'Ink (dark)', value: 'ink' },
				],
				layout: 'radio',
			},
			initialValue: 'red',
		}),
		defineField({
			name: 'tags',
			title: 'Disciplines / Tags',
			type: 'array',
			of: [{ type: 'string' }],
			options: { layout: 'tags' },
		}),
		defineField({
			name: 'language',
			type: 'string',
			readOnly: true,
			hidden: true,
		}),
	],
	preview: {
		select: {
			title: 'name',
			media: 'image',
			language: 'language',
		},
		prepare: ({ title, media, language }) => ({
			title,
			subtitle: language && `[${language}]`,
			media,
		}),
	},
})
