import { defineField, defineType } from 'sanity'
import { VscMail } from 'react-icons/vsc'

export default defineType({
	name: 'contactSubmission',
	title: 'Kontakt-Anfrage',
	type: 'document',
	icon: VscMail,
	readOnly: true,
	fields: [
		defineField({ name: 'name', type: 'string' }),
		defineField({ name: 'childName', title: 'Name des Kindes', type: 'string' }),
		defineField({ name: 'email', type: 'string' }),
		defineField({ name: 'phone', title: 'Telefon', type: 'string' }),
		defineField({
			name: 'interest',
			title: 'Interesse',
			type: 'string',
		}),
		defineField({
			name: 'childAge',
			title: 'Alter des Kindes',
			type: 'string',
		}),
		defineField({
			name: 'preferredTime',
			title: 'Bevorzugte Zeit',
			type: 'string',
		}),
		defineField({ name: 'message', title: 'Nachricht', type: 'text', rows: 4 }),
		defineField({ name: 'submittedAt', title: 'Eingegangen', type: 'datetime' }),
		defineField({ name: 'sourcePath', title: 'Quelle (URL)', type: 'string' }),
	],
	preview: {
		select: { title: 'name', subtitle: 'email', date: 'submittedAt' },
		prepare: ({ title, subtitle, date }) => ({
			title: title || '— ohne Name —',
			subtitle:
				[subtitle, date && new Date(date as string).toLocaleString('de-DE')]
					.filter(Boolean)
					.join(' · ') || undefined,
		}),
	},
})
