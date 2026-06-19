import { defineField, defineType } from 'sanity'
import { VscDeviceCamera } from 'react-icons/vsc'

export default defineType({
	name: 'galleryImage',
	title: 'Galerie-Bild',
	type: 'document',
	icon: VscDeviceCamera,
	fields: [
		defineField({
			name: 'image',
			title: 'Bild',
			type: 'image',
			options: { hotspot: true, metadata: ['lqip'] },
			validation: (Rule) => Rule.required(),
		}),
		defineField({
			name: 'caption',
			title: 'Bildunterschrift / Alt-Text',
			type: 'string',
			validation: (Rule) =>
				Rule.required().error('Bildunterschrift wird für Barrierefreiheit benötigt.'),
		}),
		defineField({
			name: 'bereich',
			title: 'Bereich',
			type: 'string',
			options: {
				list: [
					{ title: 'Musik', value: 'musik' },
					{ title: 'Tanz', value: 'tanz' },
					{ title: 'Bühne', value: 'buehne' },
					{ title: 'Schule', value: 'schule' },
				],
			},
		}),
		defineField({
			name: 'span',
			title: 'Grid-Größe',
			description:
				'Steuert die Kachelgröße im dichten Masonry-Grid (grid-auto-flow: dense).',
			type: 'string',
			options: {
				list: [
					{ title: 'Normal', value: 'normal' },
					{ title: 'Breit (2 Spalten)', value: 'wide' },
					{ title: 'Hoch (2 Zeilen)', value: 'tall' },
					{ title: 'Groß (2×2)', value: 'big' },
				],
				layout: 'radio',
			},
			initialValue: 'normal',
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
