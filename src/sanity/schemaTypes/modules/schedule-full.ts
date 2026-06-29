import { defineField, defineType } from 'sanity'

export default defineType({
	name: 'schedule-full',
	title: 'Schedule · full',
	type: 'object',
	fields: [
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
		defineField({
			name: 'noteTitle',
			title: 'Note box · title',
			type: 'string',
		}),
		defineField({
			name: 'noteText',
			title: 'Note box · text',
			type: 'text',
			rows: 3,
		}),
		defineField({
			name: 'emptyText',
			title: 'Text when no slots',
			type: 'string',
		}),
		defineField({ name: 'options', type: 'module-options' }),
	],
	preview: {
		prepare: () => ({ title: 'Schedule full' }),
	},
})
