import { defineArrayMember, defineField, defineType } from 'sanity'

export default defineType({
	name: 'svc-split',
	title: 'Service-Split (Text + Bullets)',
	description:
		'Zwei-Spalten-Layout aus den Service-Detail-Seiten: links Headline+Text, rechts Bullet-Liste mit Check-Icons.',
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
			name: 'lead',
			title: 'Lead-Text',
			type: 'text',
			rows: 3,
		}),
		defineField({
			name: 'tinted',
			title: 'Warm-White Hintergrund',
			type: 'boolean',
			initialValue: false,
		}),
		defineField({
			name: 'items',
			title: 'Liste (rechte Spalte)',
			type: 'array',
			of: [
				defineArrayMember({
					type: 'object',
					name: 'svcItem',
					fields: [
						defineField({ name: 'title', type: 'string' }),
						defineField({ name: 'text', type: 'string' }),
					],
					preview: { select: { title: 'title', subtitle: 'text' } },
				}),
			],
		}),
		defineField({ name: 'options', type: 'module-options' }),
	],
	preview: {
		prepare: () => ({ title: 'Service-Split' }),
	},
})
