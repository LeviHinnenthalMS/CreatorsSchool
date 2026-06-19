import { defineArrayMember, defineField, defineType } from 'sanity'

export default defineType({
	name: 'contact-form',
	title: 'Kontakt-Formular',
	type: 'object',
	fields: [
		defineField({
			name: 'title',
			title: 'Headline',
			type: 'string',
		}),
		defineField({
			name: 'titleAccent',
			title: 'Headline · Akzent (am Ende)',
			type: 'string',
		}),
		defineField({
			name: 'lead',
			title: 'Lead',
			type: 'text',
			rows: 3,
		}),
		defineField({
			name: 'labels',
			title: 'Feld-Beschriftungen',
			type: 'object',
			fields: [
				defineField({ name: 'name', title: 'Name', type: 'string' }),
				defineField({
					name: 'child',
					title: 'Name des Kindes',
					type: 'string',
				}),
				defineField({ name: 'email', title: 'E-Mail', type: 'string' }),
				defineField({ name: 'phone', title: 'Telefon', type: 'string' }),
				defineField({
					name: 'interest',
					title: 'Welches Angebot interessiert dich?',
					type: 'string',
				}),
				defineField({
					name: 'age',
					title: 'Alter des Kindes',
					type: 'string',
				}),
				defineField({
					name: 'when',
					title: 'Wann passt es?',
					type: 'string',
				}),
				defineField({
					name: 'message',
					title: 'Nachricht',
					type: 'string',
				}),
				defineField({
					name: 'submit',
					title: 'Submit-Button',
					type: 'string',
				}),
				defineField({
					name: 'requiredHint',
					title: 'Pflichtfeld-Hinweis (* erforderlich)',
					type: 'string',
				}),
				defineField({
					name: 'privacy',
					title: 'Datenschutz-Zustimmung',
					type: 'text',
					rows: 3,
				}),
				defineField({
					name: 'successTitle',
					title: 'Erfolg · Titel',
					type: 'string',
				}),
				defineField({
					name: 'successText',
					title: 'Erfolg · Text',
					type: 'string',
				}),
				defineField({
					name: 'errorText',
					title: 'Fehler · Text',
					type: 'string',
				}),
			],
		}),
		defineField({
			name: 'interests',
			title: 'Interesse · Chip-Optionen',
			type: 'array',
			of: [
				defineArrayMember({
					type: 'object',
					name: 'option',
					fields: [
						defineField({ name: 'value', title: 'Wert (id)', type: 'string' }),
						defineField({ name: 'label', title: 'Label', type: 'string' }),
					],
					preview: { select: { title: 'label', subtitle: 'value' } },
				}),
			],
		}),
		defineField({
			name: 'ageOptions',
			title: 'Alter · Dropdown-Optionen',
			type: 'array',
			of: [
				defineArrayMember({
					type: 'object',
					name: 'option',
					fields: [
						defineField({ name: 'value', type: 'string' }),
						defineField({ name: 'label', type: 'string' }),
					],
				}),
			],
		}),
		defineField({
			name: 'whenOptions',
			title: 'Zeitwunsch · Dropdown-Optionen',
			type: 'array',
			of: [
				defineArrayMember({
					type: 'object',
					name: 'option',
					fields: [
						defineField({ name: 'value', type: 'string' }),
						defineField({ name: 'label', type: 'string' }),
					],
				}),
			],
		}),
		defineField({ name: 'options', type: 'module-options' }),
	],
	preview: {
		prepare: () => ({ title: 'Kontakt-Formular' }),
	},
})
