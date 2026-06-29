import { defineField, defineType } from 'sanity'
import { richTitleField } from '../fragments/rich-title'

export default defineType({
	name: 'schedule-preview',
	title: 'Schedule · preview',
	type: 'object',
	fields: [
		defineField({ name: 'eyebrow', title: 'Eyebrow', type: 'string' }),
		defineField({
			name: 'title',
			title: 'Headline',
			...richTitleField(),
		}),
		defineField({
			name: 'tagline',
			title: 'Tagline',
			type: 'text',
			rows: 3,
		}),
		defineField({
			name: 'limit',
			title: 'Max slots shown',
			type: 'number',
			initialValue: 7,
		}),
		defineField({ name: 'footnote', title: 'Footnote', type: 'string' }),
		defineField({
			name: 'link',
			title: 'Link to full schedule',
			type: 'link',
		}),
		defineField({ name: 'linkLabel', title: 'Link label', type: 'string' }),
		defineField({
			name: 'filterLabels',
			title: 'Filter button labels',
			type: 'object',
			fields: [
				defineField({ name: 'all', title: 'All', type: 'string' }),
				defineField({ name: 'musik', title: 'Music', type: 'string' }),
				defineField({ name: 'tanz', title: 'Dance', type: 'string' }),
				defineField({ name: 'frueh', title: 'Early education', type: 'string' }),
				defineField({ name: 'erwachsene', title: 'Adults', type: 'string' }),
			],
		}),
		defineField({
			name: 'statusLabels',
			title: 'Status badge labels',
			type: 'object',
			fields: [
				defineField({ name: 'open', title: 'Available', type: 'string' }),
				defineField({ name: 'few', title: 'Few left', type: 'string' }),
				defineField({ name: 'full', title: 'Waitlist', type: 'string' }),
			],
		}),
		defineField({ name: 'options', type: 'module-options' }),
	],
	preview: {
		prepare: () => ({ title: 'Schedule preview' }),
	},
})
