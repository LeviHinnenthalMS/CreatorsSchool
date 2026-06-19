import { defineArrayMember, defineField, defineType } from 'sanity'

export default defineType({
	name: 'marquee',
	title: 'Marquee · Schlagwörter',
	type: 'object',
	fields: [
		defineField({
			name: 'items',
			title: 'Wörter',
			description:
				'Eine Reihe Schlagwörter. Markiere einzelne als „kursiv (coral)" für den Akzent.',
			type: 'array',
			of: [
				defineArrayMember({
					type: 'object',
					name: 'word',
					fields: [
						defineField({ name: 'text', title: 'Text', type: 'string' }),
						defineField({
							name: 'accent',
							title: 'Akzent (kursiv, coral)',
							type: 'boolean',
							initialValue: false,
						}),
					],
					preview: {
						select: { title: 'text', accent: 'accent' },
						prepare: ({ title, accent }) => ({
							title,
							subtitle: accent ? 'kursiv (coral)' : undefined,
						}),
					},
				}),
			],
		}),
		defineField({
			name: 'durationSeconds',
			title: 'Animationsdauer (Sekunden)',
			type: 'number',
			initialValue: 55,
		}),
		defineField({ name: 'options', type: 'module-options' }),
	],
	preview: {
		prepare: () => ({ title: 'Marquee' }),
	},
})
