import { defineArrayMember, defineField, defineType } from 'sanity'

export default defineType({
	name: 'svc-panel',
	title: 'Service · Preis-Panel (zwei-spaltig)',
	description:
		'Links Headline+Text, rechts dunkles Panel mit Preis, Detail-Zeilen und CTAs.',
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
			name: 'panel',
			title: 'Panel-Inhalt',
			type: 'object',
			fields: [
				defineField({ name: 'label', title: 'Top-Label', type: 'string' }),
				defineField({ name: 'currency', title: 'Währung', type: 'string' }),
				defineField({
					name: 'value',
					title: 'Wert (Preis oder Text)',
					type: 'string',
				}),
				defineField({ name: 'unit', title: 'Einheit', type: 'string' }),
				defineField({
					name: 'rows',
					title: 'Detail-Zeilen',
					type: 'array',
					of: [
						defineArrayMember({
							type: 'object',
							name: 'row',
							fields: [
								defineField({ name: 'key', type: 'string' }),
								defineField({ name: 'value', type: 'string' }),
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
			],
		}),
		defineField({ name: 'options', type: 'module-options' }),
	],
	preview: {
		prepare: () => ({ title: 'Service-Panel' }),
	},
})
