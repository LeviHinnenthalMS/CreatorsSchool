import { defineArrayMember, defineField, defineType } from 'sanity'

export default defineType({
	name: 'svc-faq',
	title: 'Service · FAQ',
	description: 'FAQ-Block im Service-Layout: links Headline+CTA, rechts Accordion.',
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
			name: 'ctas',
			title: 'CTAs (linke Spalte)',
			type: 'array',
			of: [{ type: 'cta' }],
		}),
		defineField({
			name: 'items',
			title: 'FAQ-Einträge',
			type: 'array',
			of: [
				defineArrayMember({
					type: 'object',
					name: 'qa',
					fields: [
						defineField({ name: 'q', title: 'Frage', type: 'string' }),
						defineField({ name: 'a', title: 'Antwort', type: 'text', rows: 4 }),
						defineField({
							name: 'defaultOpen',
							title: 'Standard offen',
							type: 'boolean',
							initialValue: false,
						}),
					],
					preview: { select: { title: 'q' } },
				}),
			],
		}),
		defineField({ name: 'options', type: 'module-options' }),
	],
	preview: {
		prepare: () => ({ title: 'Service-FAQ' }),
	},
})
