import { defineArrayMember, defineField, defineType } from 'sanity'
import { richTitleField } from '../fragments/rich-title'
import { iconField } from '../fragments/icon-field'
import { getBlockText } from '@/lib/utils'

export default defineType({
	name: 'contact-form',
	title: 'Contact form',
	type: 'object',
	fields: [
		defineField({
			name: 'title',
			title: 'Headline',
			...richTitleField(),
		}),
		defineField({
			name: 'lead',
			title: 'Lead',
			type: 'text',
			rows: 3,
		}),
		defineField({
			name: 'privacyUrl',
			title: 'Datenschutz page URL',
			description: 'Link shown in the privacy consent checkbox (e.g. /datenschutz).',
			type: 'string',
		}),
		defineField({
			name: 'labels',
			title: 'Field labels',
			type: 'object',
			fields: [
				defineField({ name: 'name', title: 'Your name', type: 'string' }),
				defineField({ name: 'contact', title: 'Phone or E-Mail (combined field)', type: 'string' }),
				defineField({ name: 'interest', title: 'Which offering?', type: 'string' }),
				defineField({ name: 'age', title: "Child's age", type: 'string' }),
				defineField({ name: 'submit', title: 'Submit button', type: 'string' }),
				defineField({ name: 'footnote', title: 'Below-button note', type: 'string' }),
				defineField({ name: 'requiredHint', title: 'Required-field hint', type: 'string' }),
				defineField({ name: 'privacy', title: 'Privacy consent text', type: 'text', rows: 2 }),
				defineField({ name: 'successTitle', title: 'Success · title', type: 'string' }),
				defineField({ name: 'successText', title: 'Success · text', type: 'string' }),
				defineField({ name: 'errorText', title: 'Error · text', type: 'string' }),
			],
		}),
		defineField({
			name: 'interests',
			title: 'Interest chips',
			type: 'array',
			of: [
				defineArrayMember({
					type: 'object',
					name: 'option',
					fields: [
						defineField({ name: 'value', title: 'Value (id)', type: 'string' }),
						defineField({ name: 'label', title: 'Label', type: 'string' }),
					],
					preview: { select: { title: 'label', subtitle: 'value' } },
				}),
			],
		}),
		defineField({
			name: 'ageOptions',
			title: "Child's age · dropdown options",
			type: 'array',
			of: [
				defineArrayMember({
					type: 'object',
					name: 'option',
					fields: [
						defineField({ name: 'value', title: 'Value', type: 'string' }),
						defineField({ name: 'label', title: 'Label', type: 'string' }),
					],
				}),
			],
		}),
		defineField({
			name: 'whenOptions',
			title: 'Time preference · dropdown options',
			type: 'array',
			of: [
				defineArrayMember({
					type: 'object',
					name: 'option',
					fields: [
						defineField({ name: 'value', title: 'Value', type: 'string' }),
						defineField({ name: 'label', title: 'Label', type: 'string' }),
					],
				}),
			],
		}),
		defineField({
			name: 'infoCards',
			title: 'Contact info cards (left panel)',
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
						defineField({ name: 'small', title: 'Small (extra line)', type: 'string' }),
						defineField({ name: 'link', title: 'Link', type: 'link' }),
					],
					preview: { select: { title: 'label', subtitle: 'value' } },
				}),
			],
		}),
		defineField({ name: 'options', type: 'module-options' }),
	],
	preview: {
		select: { title: 'title' },
		prepare: ({ title }) => ({ title: getBlockText(title) || 'Contact form', subtitle: 'Contact form' }),
	},
})
