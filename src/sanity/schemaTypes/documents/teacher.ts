import { defineField, defineType } from 'sanity'
import { GoPerson } from 'react-icons/go'

export default defineType({
	name: 'teacher',
	title: 'Lehrkraft',
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
			title: 'Rolle / Funktion',
			type: 'string',
		}),
		defineField({
			name: 'bio',
			title: 'Biografie',
			type: 'text',
			rows: 4,
		}),
		defineField({
			name: 'photo',
			title: 'Foto',
			type: 'image',
			options: { hotspot: true, metadata: ['lqip'] },
			fields: [
				defineField({
					name: 'alt',
					title: 'Alt-Text',
					type: 'string',
				}),
			],
		}),
		defineField({
			name: 'order',
			title: 'Sortierung',
			type: 'number',
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
			subtitle: 'role',
			media: 'photo',
			language: 'language',
		},
		prepare: ({ title, subtitle, media, language }) => ({
			title,
			subtitle: [language && `[${language}]`, subtitle].filter(Boolean).join(' · '),
			media,
		}),
	},
})
