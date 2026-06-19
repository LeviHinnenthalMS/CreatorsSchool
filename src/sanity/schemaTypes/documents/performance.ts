import { defineField, defineType } from 'sanity'
import { VscMegaphone } from 'react-icons/vsc'

export default defineType({
	name: 'performance',
	title: 'Aufführung',
	type: 'document',
	icon: VscMegaphone,
	fields: [
		defineField({
			name: 'title',
			type: 'string',
			validation: (Rule) => Rule.required(),
		}),
		defineField({
			name: 'year',
			title: 'Jahr',
			type: 'number',
		}),
		defineField({
			name: 'dates',
			title: 'Datum (Anzeige)',
			description: 'z. B. "5.–6. September 2026"',
			type: 'string',
		}),
		defineField({
			name: 'startDate',
			title: 'Startdatum',
			type: 'date',
		}),
		defineField({
			name: 'venue',
			title: 'Spielstätte',
			type: 'string',
		}),
		defineField({
			name: 'description',
			title: 'Beschreibung',
			type: 'text',
			rows: 4,
		}),
		defineField({
			name: 'lead',
			title: 'Lead-Zeile',
			description: 'z. B. „Zwei Abende, eine Schule auf der Bühne."',
			type: 'string',
		}),
		defineField({
			name: 'ticketInfo',
			title: 'Ticket-Informationen',
			type: 'text',
			rows: 3,
		}),
		defineField({
			name: 'image',
			title: 'Bild',
			type: 'image',
			options: { hotspot: true, metadata: ['lqip'] },
			fields: [
				defineField({
					name: 'alt',
					title: 'Alt-Text',
					type: 'string',
				}),
			],
		}),
		defineField({
			name: 'featured',
			title: 'Hervorgehoben (Header-Badge & Home-Banner)',
			type: 'boolean',
			initialValue: false,
		}),
		defineField({
			name: 'badgeLabel',
			title: 'Badge-Label',
			description: 'z. B. "5.–6. Sep"',
			type: 'string',
		}),
		defineField({
			name: 'badgeSub',
			title: 'Badge-Subline',
			description: 'z. B. "Aufführung"',
			type: 'string',
		}),
		defineField({
			name: 'metadata',
			type: 'metadata',
		}),
		defineField({
			name: 'language',
			type: 'string',
			readOnly: true,
			hidden: true,
		}),
	],
	orderings: [
		{
			name: 'date',
			title: 'Nach Datum',
			by: [{ field: 'startDate', direction: 'desc' }],
		},
	],
	preview: {
		select: {
			title: 'title',
			subtitle: 'dates',
			media: 'image',
			language: 'language',
		},
		prepare: ({ title, subtitle, media, language }) => ({
			title,
			subtitle: [language && `[${language}]`, subtitle].filter(Boolean).join(' · '),
			media,
		}),
	},
})
