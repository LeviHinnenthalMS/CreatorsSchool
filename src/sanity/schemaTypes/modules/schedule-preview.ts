import { defineField, defineType } from 'sanity'

export default defineType({
	name: 'schedule-preview',
	title: 'Stundenplan · Preview',
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
			name: 'tagline',
			title: 'Tagline',
			type: 'text',
			rows: 3,
		}),
		defineField({
			name: 'limit',
			title: 'Max. Anzahl an Terminen',
			type: 'number',
			initialValue: 7,
		}),
		defineField({
			name: 'footnote',
			title: 'Fußzeile',
			type: 'string',
		}),
		defineField({
			name: 'link',
			title: 'Link zum vollen Stundenplan',
			type: 'link',
		}),
		defineField({
			name: 'linkLabel',
			title: 'Link-Label',
			type: 'string',
		}),
		defineField({
			name: 'filterLabels',
			title: 'Filter-Beschriftungen',
			description: 'Beschriftung der 5 Filter-Buttons.',
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
		defineField({ name: 'options', type: 'module-options' }),
	],
	preview: {
		prepare: () => ({ title: 'Stundenplan-Preview' }),
	},
})
