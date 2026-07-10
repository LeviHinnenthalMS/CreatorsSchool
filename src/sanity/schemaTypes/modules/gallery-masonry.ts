import { defineField, defineType } from 'sanity'

export default defineType({
	name: 'gallery-masonry',
	title: 'Gallery · masonry',
	type: 'object',
	fields: [
		defineField({
			name: 'emptyText',
			title: 'Empty-state text',
			type: 'string',
		}),
		defineField({
			name: 'bereich',
			title: 'Filter by category',
			type: 'string',
			options: {
				list: [
					{ title: 'All', value: 'alle' },
					{ title: 'Music', value: 'musik' },
					{ title: 'Dance', value: 'tanz' },
					{ title: 'Stage', value: 'buehne' },
					{ title: 'School', value: 'schule' },
				],
				layout: 'radio',
			},
			initialValue: 'alle',
		}),
		defineField({ name: 'options', type: 'module-options' }),
	],
	preview: {
		select: { bereich: 'bereich' },
		prepare: ({ bereich }) => ({ title: bereich ? `Gallery (${bereich})` : 'Gallery', subtitle: 'Gallery · masonry' }),
	},
})
