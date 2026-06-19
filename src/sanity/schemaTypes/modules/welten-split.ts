import { defineArrayMember, defineField, defineType } from 'sanity'

export default defineType({
	name: 'welten-split',
	title: 'Welten-Split (Musik / Tanz)',
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
			name: 'cards',
			title: 'Karten (2)',
			validation: (Rule) => Rule.length(2).warning('Genau 2 Karten erwartet.'),
			type: 'array',
			of: [
				defineArrayMember({
					type: 'object',
					name: 'weltCard',
					fields: [
						defineField({
							name: 'variant',
							title: 'Variante',
							type: 'string',
							options: {
								list: [
									{ title: 'Musik (warm-white)', value: 'musik' },
									{ title: 'Tanz (coral)', value: 'tanz' },
								],
								layout: 'radio',
							},
						}),
						defineField({ name: 'eyebrow', title: 'Eyebrow', type: 'string' }),
						defineField({ name: 'title', title: 'Titel', type: 'string' }),
						defineField({
							name: 'subtitle',
							title: 'Untertitel (kursiv)',
							type: 'string',
						}),
						defineField({ name: 'text', title: 'Text', type: 'text', rows: 3 }),
						defineField({
							name: 'link',
							title: 'Link',
							type: 'link',
						}),
						defineField({ name: 'linkLabel', title: 'Link-Label', type: 'string' }),
					],
					preview: { select: { title: 'title', subtitle: 'variant' } },
				}),
			],
		}),
		defineField({ name: 'options', type: 'module-options' }),
	],
	preview: {
		prepare: () => ({ title: 'Welten-Split' }),
	},
})
