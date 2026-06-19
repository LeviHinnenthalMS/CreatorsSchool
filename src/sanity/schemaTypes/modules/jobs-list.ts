import { defineField, defineType } from 'sanity'

export default defineType({
	name: 'jobs-list',
	title: 'Stellen-Liste',
	type: 'object',
	fields: [
		defineField({ name: 'eyebrow', title: 'Eyebrow', type: 'string' }),
		defineField({
			name: 'titleBefore',
			title: 'Headline · vor Akzent',
			type: 'string',
		}),
		defineField({
			name: 'titleAccent',
			title: 'Headline · Akzent',
			type: 'string',
		}),
		defineField({
			name: 'titleAfter',
			title: 'Headline · nach Akzent',
			type: 'string',
		}),
		defineField({
			name: 'applyLabel',
			title: 'Apply-Button-Label',
			type: 'string',
		}),
		defineField({
			name: 'emptyText',
			title: 'Text wenn keine Stellen',
			type: 'string',
		}),
		defineField({
			name: 'tinted',
			title: 'Warm-White Hintergrund',
			type: 'boolean',
			initialValue: true,
		}),
		defineField({ name: 'options', type: 'module-options' }),
	],
	preview: {
		prepare: () => ({ title: 'Stellen-Liste' }),
	},
})
