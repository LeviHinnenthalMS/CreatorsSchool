import { defineArrayMember, defineField, defineType } from 'sanity'

export default defineType({
	name: 'page-header',
	title: 'Page Header (Innenseiten)',
	type: 'object',
	fields: [
		defineField({ name: 'eyebrow', title: 'Eyebrow', type: 'string' }),
		defineField({
			name: 'titleBefore',
			title: 'Headline · vor dem Akzent',
			type: 'string',
		}),
		defineField({
			name: 'titleAccent',
			title: 'Headline · Akzent (kursiv, coral)',
			type: 'string',
		}),
		defineField({
			name: 'titleAfter',
			title: 'Headline · nach dem Akzent',
			type: 'string',
		}),
		defineField({
			name: 'titlePill',
			title: 'Headline · Pill (Butter-Pille)',
			type: 'string',
		}),
		defineField({
			name: 'lede',
			title: 'Lead-Text',
			type: 'text',
			rows: 3,
		}),
		defineField({
			name: 'facts',
			title: 'Fakten-Chips',
			description: 'Optional. Zeigt z. B. Alter, Dauer, Niveau, Preis als Chips.',
			type: 'array',
			of: [
				defineArrayMember({
					type: 'object',
					name: 'fact',
					fields: [
						defineField({ name: 'key', title: 'Label', type: 'string' }),
						defineField({ name: 'value', title: 'Wert', type: 'string' }),
					],
					preview: { select: { title: 'key', subtitle: 'value' } },
				}),
			],
		}),
		defineField({
			name: 'ctas',
			title: 'CTAs',
			type: 'array',
			of: [{ type: 'cta' }],
		}),
		defineField({ name: 'options', type: 'module-options' }),
	],
	preview: {
		select: { eyebrow: 'eyebrow', accent: 'titleAccent' },
		prepare: ({ eyebrow, accent }) => ({
			title: accent || 'Page Header',
			subtitle: eyebrow || 'page-header',
		}),
	},
})
