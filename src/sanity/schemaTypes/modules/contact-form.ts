import { defineArrayMember, defineField, defineType } from 'sanity'
import { richTitleField } from '../fragments/rich-title'

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
			name: 'labels',
			title: 'Field labels',
			type: 'object',
			fields: [
				defineField({ name: 'name', title: 'Your name', type: 'string' }),
				defineField({ name: 'child', title: "Child's name", type: 'string' }),
				defineField({ name: 'email', title: 'Email', type: 'string' }),
				defineField({ name: 'phone', title: 'Phone', type: 'string' }),
				defineField({
					name: 'interest',
					title: 'Which offering?',
					type: 'string',
				}),
				defineField({ name: 'age', title: "Child's age", type: 'string' }),
				defineField({ name: 'when', title: 'When works for you?', type: 'string' }),
				defineField({ name: 'message', title: 'Message', type: 'string' }),
				defineField({ name: 'submit', title: 'Submit button', type: 'string' }),
				defineField({
					name: 'requiredHint',
					title: 'Required-field hint (e.g. "* required")',
					type: 'string',
				}),
				defineField({
					name: 'privacy',
					title: 'Privacy consent',
					type: 'text',
					rows: 3,
				}),
				defineField({
					name: 'successTitle',
					title: 'Success · title',
					type: 'string',
				}),
				defineField({
					name: 'successText',
					title: 'Success · text',
					type: 'string',
				}),
				defineField({
					name: 'errorText',
					title: 'Error · text',
					type: 'string',
				}),
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
		defineField({ name: 'options', type: 'module-options' }),
	],
	preview: {
		prepare: () => ({ title: 'Contact form' }),
	},
})
