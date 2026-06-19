import { defineArrayMember, defineField, defineType } from 'sanity'

export default defineType({
	name: 'info-cards',
	title: 'Info-Karten (Kontakt)',
	type: 'object',
	fields: [
		defineField({
			name: 'cards',
			title: 'Karten',
			type: 'array',
			of: [
				defineArrayMember({
					type: 'object',
					name: 'infoCard',
					fields: [
						defineField({
							name: 'variant',
							title: 'Variante',
							type: 'string',
							options: {
								list: [
									{ title: 'Coral', value: 'coral' },
									{ title: 'Ink (dark)', value: 'ink' },
									{ title: 'Neutral', value: 'neutral' },
								],
								layout: 'radio',
							},
							initialValue: 'neutral',
						}),
						defineField({ name: 'icon', title: 'Icon-Key', type: 'string' }),
						defineField({ name: 'label', title: 'Label', type: 'string' }),
						defineField({ name: 'value', title: 'Wert', type: 'string' }),
						defineField({
							name: 'small',
							title: 'Zusatz-Zeile (kleiner)',
							type: 'string',
						}),
						defineField({ name: 'link', title: 'Link', type: 'link' }),
					],
					preview: { select: { title: 'label', subtitle: 'value' } },
				}),
			],
		}),
		defineField({ name: 'options', type: 'module-options' }),
	],
	preview: {
		prepare: () => ({ title: 'Info-Karten' }),
	},
})
