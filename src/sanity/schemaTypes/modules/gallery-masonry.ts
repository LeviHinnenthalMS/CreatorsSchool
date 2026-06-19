import { defineField, defineType } from 'sanity'

export default defineType({
	name: 'gallery-masonry',
	title: 'Galerie · Masonry',
	type: 'object',
	fields: [
		defineField({
			name: 'emptyText',
			title: 'Hinweis bei leerer Galerie',
			type: 'string',
		}),
		defineField({
			name: 'bereich',
			title: 'Filter nach Bereich',
			type: 'string',
			options: {
				list: [
					{ title: 'Alle', value: 'alle' },
					{ title: 'Musik', value: 'musik' },
					{ title: 'Tanz', value: 'tanz' },
					{ title: 'Bühne', value: 'buehne' },
					{ title: 'Schule', value: 'schule' },
				],
				layout: 'radio',
			},
			initialValue: 'alle',
		}),
		defineField({ name: 'options', type: 'module-options' }),
	],
	preview: {
		prepare: () => ({ title: 'Galerie' }),
	},
})
