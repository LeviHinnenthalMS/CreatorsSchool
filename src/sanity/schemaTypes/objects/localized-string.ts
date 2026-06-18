import { defineField, defineType } from 'sanity'
import { supportedLanguages } from '@/lib/i18n'

export default defineType({
	name: 'localizedString',
	title: 'Lokalisierter Text',
	type: 'object',
	fields: supportedLanguages.map((lang) =>
		defineField({
			name: lang.id,
			title: lang.title,
			type: 'string',
		}),
	),
})
