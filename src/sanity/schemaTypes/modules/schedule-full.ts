import { defineField, defineType } from 'sanity'

export default defineType({
	name: 'schedule-full',
	title: 'Stundenplan · Komplett',
	type: 'object',
	fields: [
		defineField({
			name: 'filterLabels',
			title: 'Filter-Beschriftungen',
			type: 'object',
			fields: [
				defineField({ name: 'all', title: 'Alle', type: 'string' }),
				defineField({ name: 'musik', title: 'Musik', type: 'string' }),
				defineField({ name: 'tanz', title: 'Tanz', type: 'string' }),
				defineField({
					name: 'frueh',
					title: 'Frühförderung',
					type: 'string',
				}),
				defineField({
					name: 'erwachsene',
					title: 'Erwachsene',
					type: 'string',
				}),
			],
		}),
		defineField({
			name: 'statusLabels',
			title: 'Status-Beschriftungen',
			type: 'object',
			fields: [
				defineField({ name: 'open', title: 'Plätze frei', type: 'string' }),
				defineField({ name: 'few', title: 'Wenige Plätze', type: 'string' }),
				defineField({ name: 'full', title: 'Warteliste', type: 'string' }),
			],
		}),
		defineField({
			name: 'noteTitle',
			title: 'Hinweis-Box · Titel',
			type: 'string',
		}),
		defineField({
			name: 'noteText',
			title: 'Hinweis-Box · Text',
			type: 'text',
			rows: 3,
		}),
		defineField({
			name: 'emptyText',
			title: 'Text wenn keine Termine',
			type: 'string',
		}),
		defineField({ name: 'options', type: 'module-options' }),
	],
	preview: {
		prepare: () => ({ title: 'Stundenplan-Komplett' }),
	},
})
