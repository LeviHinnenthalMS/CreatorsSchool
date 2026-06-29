import { defineField, defineType } from 'sanity'
import { VscMail } from 'react-icons/vsc'

export default defineType({
	name: 'contactSubmission',
	title: 'Contact submission',
	type: 'document',
	icon: VscMail,
	readOnly: true,
	fields: [
		defineField({ name: 'name', title: 'Name', type: 'string' }),
		defineField({ name: 'childName', title: "Child's name", type: 'string' }),
		defineField({ name: 'email', title: 'Email', type: 'string' }),
		defineField({ name: 'phone', title: 'Phone', type: 'string' }),
		defineField({ name: 'interest', title: 'Interest', type: 'string' }),
		defineField({ name: 'childAge', title: "Child's age", type: 'string' }),
		defineField({ name: 'preferredTime', title: 'Preferred time', type: 'string' }),
		defineField({ name: 'message', title: 'Message', type: 'text', rows: 4 }),
		defineField({ name: 'submittedAt', title: 'Submitted at', type: 'datetime' }),
		defineField({ name: 'sourcePath', title: 'Source path', type: 'string' }),
	],
	preview: {
		select: { title: 'name', subtitle: 'email', date: 'submittedAt' },
		prepare: ({ title, subtitle, date }) => ({
			title: title || '— no name —',
			subtitle:
				[subtitle, date && new Date(date as string).toLocaleString('en-GB')]
					.filter(Boolean)
					.join(' · ') || undefined,
		}),
	},
})
