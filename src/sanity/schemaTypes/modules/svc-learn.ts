import { defineArrayMember, defineField, defineType } from 'sanity'

export default defineType({
	name: 'svc-learn',
	title: 'Service · 3-Karten-Lernen',
	description:
		'Drei Karten mit Icon, Titel und Text — z. B. „Das lernst du".',
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
			name: 'tinted',
			title: 'Warm-White Hintergrund',
			type: 'boolean',
			initialValue: true,
		}),
		defineField({
			name: 'cards',
			title: 'Karten (3)',
			validation: (Rule) => Rule.max(3),
			type: 'array',
			of: [
				defineArrayMember({
					type: 'object',
					name: 'learnCard',
					fields: [
						defineField({ name: 'icon', title: 'Icon-Key', type: 'string' }),
						defineField({ name: 'title', type: 'string' }),
						defineField({ name: 'text', type: 'text', rows: 2 }),
					],
					preview: { select: { title: 'title', subtitle: 'text' } },
				}),
			],
		}),
		defineField({ name: 'options', type: 'module-options' }),
	],
	preview: {
		prepare: () => ({ title: 'Service-Lernen' }),
	},
})
