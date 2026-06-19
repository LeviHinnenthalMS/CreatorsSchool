import { defineArrayMember, defineField, defineType } from 'sanity'

export default defineType({
	name: 'about-strip',
	title: 'About-Strip (dark)',
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
			name: 'body',
			title: 'Fließtext',
			type: 'text',
			rows: 4,
		}),
		defineField({
			name: 'stats',
			title: 'Stat-Karten (max. 3)',
			validation: (Rule) => Rule.max(3),
			type: 'array',
			of: [
				defineArrayMember({
					type: 'object',
					name: 'stat',
					fields: [
						defineField({ name: 'value', title: 'Wert', type: 'string' }),
						defineField({ name: 'label', title: 'Label', type: 'string' }),
					],
					preview: { select: { title: 'value', subtitle: 'label' } },
				}),
			],
		}),
		defineField({
			name: 'ctas',
			title: 'CTAs',
			type: 'array',
			of: [{ type: 'cta' }],
		}),
		defineField({
			name: 'profile',
			title: 'Profil-Karte (Miriam)',
			type: 'object',
			fields: [
				defineField({
					name: 'tags',
					title: 'Tags',
					type: 'array',
					of: [{ type: 'string' }],
				}),
				defineField({
					name: 'firstName',
					title: 'Vorname',
					type: 'string',
				}),
				defineField({
					name: 'lastName',
					title: 'Nachname (kursiv, blush)',
					type: 'string',
				}),
				defineField({ name: 'role', title: 'Rolle', type: 'string' }),
				defineField({
					name: 'quote',
					title: 'Zitat',
					type: 'text',
					rows: 3,
				}),
			],
		}),
		defineField({ name: 'options', type: 'module-options' }),
	],
	preview: {
		prepare: () => ({ title: 'About-Strip' }),
	},
})
