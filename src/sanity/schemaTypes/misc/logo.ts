import { defineField, defineType } from 'sanity'
import { VscVerified } from 'react-icons/vsc'

export default defineType({
	name: 'logo',
	title: 'Logo',
	icon: VscVerified,
	type: 'document',
	fields: [
		defineField({
			name: 'name',
			type: 'string',
		}),
		defineField({
			name: 'image',
			type: 'object',
			fields: [
				defineField({
					name: 'default',
					type: 'image',
					options: {
						hotspot: true,
					},
				}),
				defineField({
					name: 'light',
					description: 'On dark backgrounds',
					type: 'image',
					options: {
						hotspot: true,
					},
				}),
				defineField({
					name: 'dark',
					description: 'On light backgrounds',
					type: 'image',
					options: {
						hotspot: true,
					},
				}),
			],
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
			media: 'image.default',
			language: 'language',
		},
		prepare: ({ title, media, language }) => ({
			title,
			subtitle: language ? `Logo [${language}]` : 'Logo',
			media,
		}),
	},
})
