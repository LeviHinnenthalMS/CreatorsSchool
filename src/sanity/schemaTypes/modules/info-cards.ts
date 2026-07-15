import { defineArrayMember, defineField, defineType } from 'sanity'
import { iconField } from '../fragments/icon-field'

export default defineType({
	name: 'info-cards',
	title: 'Info cards (contact)',
	type: 'object',
	fields: [
		defineField({
			name: 'cards',
			title: 'Cards',
			type: 'array',
			of: [
				defineArrayMember({
					type: 'object',
					name: 'infoCard',
					fields: [
						defineField({
							name: 'variant',
							title: 'Variant',
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
						defineField(iconField),
						defineField({ name: 'label', title: 'Label', type: 'string' }),
						defineField({ name: 'value', title: 'Value', type: 'string' }),
						defineField({
							name: 'small',
							title: 'Small (extra line)',
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
		prepare: () => ({ title: 'Info cards', subtitle: 'Info cards (contact)' }),
	},
})
