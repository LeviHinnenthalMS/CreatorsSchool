import { defineField, defineType } from 'sanity'
import { VscDeviceCamera } from 'react-icons/vsc'

export default defineType({
	name: 'galleryImage',
	title: 'Gallery image',
	type: 'document',
	icon: VscDeviceCamera,
	fields: [
		defineField({
			name: 'image',
			title: 'Image',
			type: 'image',
			options: { hotspot: true, metadata: ['lqip'] },
			validation: (Rule) => Rule.required(),
		}),
		defineField({
			name: 'caption',
			title: 'Caption / Alt text',
			type: 'string',
			validation: (Rule) =>
				Rule.required().error('Caption is required for accessibility.'),
		}),
		defineField({
			name: 'bereich',
			title: 'Category',
			type: 'string',
			options: {
				list: [
					{ title: 'Music', value: 'musik' },
					{ title: 'Dance', value: 'tanz' },
					{ title: 'Stage', value: 'buehne' },
					{ title: 'School', value: 'schule' },
				],
			},
		}),
		defineField({
			name: 'span',
			title: 'Grid span',
			description:
				'Tile size in the dense masonry grid (grid-auto-flow: dense).',
			type: 'string',
			options: {
				list: [
					{ title: 'Normal', value: 'normal' },
					{ title: 'Wide (2 columns)', value: 'wide' },
					{ title: 'Tall (2 rows)', value: 'tall' },
					{ title: 'Big (2×2)', value: 'big' },
				],
				layout: 'radio',
			},
			initialValue: 'normal',
		}),
		defineField({
			name: 'order',
			title: 'Sort order',
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
			title: 'caption',
			subtitle: 'bereich',
			media: 'image',
			language: 'language',
		},
		prepare: ({ title, subtitle, media, language }) => ({
			title: title || '—',
			subtitle: [language && `[${language}]`, subtitle].filter(Boolean).join(' · '),
			media,
		}),
	},
})
