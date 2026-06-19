import { defineField, defineType } from 'sanity'
import { VscCalendar } from 'react-icons/vsc'

const WEEKDAYS = [
	{ title: 'Montag', value: 'mo' },
	{ title: 'Dienstag', value: 'di' },
	{ title: 'Mittwoch', value: 'mi' },
	{ title: 'Donnerstag', value: 'do' },
	{ title: 'Freitag', value: 'fr' },
	{ title: 'Samstag', value: 'sa' },
	{ title: 'Sonntag', value: 'so' },
]

const WEEKDAY_ORDER: Record<string, number> = {
	mo: 0,
	di: 1,
	mi: 2,
	do: 3,
	fr: 4,
	sa: 5,
	so: 6,
}

export default defineType({
	name: 'scheduleSlot',
	title: 'Stundenplan-Termin',
	type: 'document',
	icon: VscCalendar,
	fields: [
		defineField({
			name: 'weekday',
			title: 'Wochentag',
			type: 'string',
			options: { list: WEEKDAYS, layout: 'dropdown' },
			validation: (Rule) => Rule.required(),
		}),
		defineField({
			name: 'weekdayOrder',
			title: 'Wochentag-Reihenfolge',
			type: 'number',
			hidden: true,
			readOnly: true,
		}),
		defineField({
			name: 'time',
			title: 'Uhrzeit',
			description: 'z. B. "16:45"',
			type: 'string',
			validation: (Rule) => Rule.required(),
		}),
		defineField({
			name: 'duration',
			title: 'Dauer',
			description: 'z. B. "60 Min."',
			type: 'string',
		}),
		defineField({
			name: 'name',
			title: 'Kursname',
			type: 'string',
			validation: (Rule) => Rule.required(),
		}),
		defineField({
			name: 'ageRange',
			title: 'Altersbereich',
			description: 'z. B. "ab 6 J."',
			type: 'string',
		}),
		defineField({
			name: 'subInfo',
			title: 'Zusatz-Info',
			description:
				'Komma-getrennte Tags wie „Eltern-Kind, Max. 6 Kinder, Kleingruppe".',
			type: 'string',
		}),
		defineField({
			name: 'room',
			title: 'Saal / Raum',
			type: 'string',
		}),
		defineField({
			name: 'floor',
			title: 'Etage',
			description: 'z. B. "EG", "1. OG"',
			type: 'string',
		}),
		defineField({
			name: 'teacher',
			title: 'Lehrkraft',
			type: 'reference',
			to: [{ type: 'teacher' }],
			options: {
				filter: ({ document }) =>
					document?.language
						? { filter: 'language == $lang', params: { lang: document.language } }
						: {},
			},
		}),
		defineField({
			name: 'status',
			title: 'Verfügbarkeit',
			type: 'string',
			options: {
				list: [
					{ title: 'Plätze frei', value: 'open' },
					{ title: 'Wenige Plätze', value: 'few' },
					{ title: 'Warteliste', value: 'full' },
				],
				layout: 'radio',
			},
			initialValue: 'open',
		}),
		defineField({
			name: 'statusLabel',
			title: 'Status-Label (Override)',
			description:
				'Optional: ersetzt das Standard-Label, z. B. "3 Plätze", "Voll", "Quereinstieg".',
			type: 'string',
		}),
		defineField({
			name: 'capacity',
			title: 'Kapazität',
			description: 'z. B. "von 8"',
			type: 'string',
		}),
		defineField({
			name: 'bereich',
			title: 'Bereich',
			type: 'string',
			options: {
				list: [
					{ title: 'Musik', value: 'musik' },
					{ title: 'Tanz', value: 'tanz' },
					{ title: 'Instrument', value: 'instrument' },
				],
				layout: 'radio',
			},
		}),
		defineField({
			name: 'categories',
			title: 'Filter-Kategorien',
			description:
				'Zusatz-Filter neben dem Bereich. Verfügbare Schlüssel: frueh, erwachsene.',
			type: 'array',
			of: [{ type: 'string' }],
			options: {
				list: [
					{ title: 'Frühförderung', value: 'frueh' },
					{ title: 'Erwachsene', value: 'erwachsene' },
				],
			},
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
			name: 'weekday',
			title: 'Wochentag · Uhrzeit',
			by: [
				{ field: 'weekdayOrder', direction: 'asc' },
				{ field: 'time', direction: 'asc' },
			],
		},
	],
	preview: {
		select: {
			title: 'name',
			weekday: 'weekday',
			time: 'time',
			language: 'language',
		},
		prepare: ({ title, weekday, time, language }) => ({
			title,
			subtitle: [language && `[${language}]`, weekday, time]
				.filter(Boolean)
				.join(' · '),
		}),
	},
})

export { WEEKDAYS, WEEKDAY_ORDER }
