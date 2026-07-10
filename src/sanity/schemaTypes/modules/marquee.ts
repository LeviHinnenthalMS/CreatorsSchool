import { defineArrayMember, defineField, defineType } from 'sanity'

export default defineType({
	name: 'marquee',
	title: 'Marquee · scrolling words',
	type: 'object',
	fields: [
		defineField({
			name: 'items',
			title: 'Words',
			description:
				'List of words to scroll. Mark individual words as accent for the coral italic emphasis.',
			type: 'array',
			of: [
				defineArrayMember({
					type: 'object',
					name: 'word',
					fields: [
						defineField({ name: 'text', title: 'Text', type: 'string' }),
						defineField({
							name: 'accent',
							title: 'Accent (italic, coral)',
							type: 'boolean',
							initialValue: false,
						}),
					],
					preview: {
						select: { title: 'text', accent: 'accent' },
						prepare: ({ title, accent }) => ({
							title,
							subtitle: accent ? 'accent (italic coral)' : undefined,
						}),
					},
				}),
			],
		}),
		defineField({
			name: 'durationSeconds',
			title: 'Animation duration (seconds)',
			type: 'number',
			initialValue: 55,
		}),
		defineField({ name: 'options', type: 'module-options' }),
	],
	preview: {
		prepare: () => ({ title: 'Marquee', subtitle: 'Marquee · scrolling words' }),
	},
})
