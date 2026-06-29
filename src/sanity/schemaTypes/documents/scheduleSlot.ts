import { defineField, defineType } from 'sanity'
import { VscCalendar } from 'react-icons/vsc'

const WEEKDAYS = [
	{ title: 'Monday', value: 'mo' },
	{ title: 'Tuesday', value: 'di' },
	{ title: 'Wednesday', value: 'mi' },
	{ title: 'Thursday', value: 'do' },
	{ title: 'Friday', value: 'fr' },
	{ title: 'Saturday', value: 'sa' },
	{ title: 'Sunday', value: 'so' },
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
	title: 'Schedule slot',
	type: 'document',
	icon: VscCalendar,
	fields: [
		defineField({
			name: 'weekday',
			title: 'Weekday',
			type: 'string',
			options: { list: WEEKDAYS, layout: 'dropdown' },
			validation: (Rule) => Rule.required(),
		}),
		defineField({
			name: 'weekdayOrder',
			title: 'Weekday order',
			type: 'number',
			hidden: true,
			readOnly: true,
		}),
		defineField({
			name: 'time',
			title: 'Time',
			description: 'e.g. "16:45"',
			type: 'string',
			validation: (Rule) => Rule.required(),
		}),
		defineField({
			name: 'duration',
			title: 'Duration',
			description: 'e.g. "60 min"',
			type: 'string',
		}),
		defineField({
			name: 'name',
			title: 'Class name',
			type: 'string',
			validation: (Rule) => Rule.required(),
		}),
		defineField({
			name: 'ageRange',
			title: 'Age range',
			description: 'e.g. "from 6 y."',
			type: 'string',
		}),
		defineField({
			name: 'subInfo',
			title: 'Additional info',
			description:
				'Comma-separated tags like "Parent–child, max 6 children, small group".',
			type: 'string',
		}),
		defineField({
			name: 'room',
			title: 'Room',
			type: 'string',
		}),
		defineField({
			name: 'floor',
			title: 'Floor',
			description: 'e.g. "GF", "1F"',
			type: 'string',
		}),
		defineField({
			name: 'teacher',
			title: 'Teacher',
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
			title: 'Availability',
			type: 'string',
			options: {
				list: [
					{ title: 'Available', value: 'open' },
					{ title: 'Few left', value: 'few' },
					{ title: 'Waitlist', value: 'full' },
				],
				layout: 'radio',
			},
			initialValue: 'open',
		}),
		defineField({
			name: 'statusLabel',
			title: 'Status label (override)',
			description:
				'Optional: replaces the default label, e.g. "3 spots", "Full", "Open enrollment".',
			type: 'string',
		}),
		defineField({
			name: 'capacity',
			title: 'Capacity',
			description: 'e.g. "of 8"',
			type: 'string',
		}),
		defineField({
			name: 'bereich',
			title: 'Category',
			type: 'string',
			options: {
				list: [
					{ title: 'Music', value: 'musik' },
					{ title: 'Dance', value: 'tanz' },
					{ title: 'Instrument', value: 'instrument' },
				],
				layout: 'radio',
			},
		}),
		defineField({
			name: 'categories',
			title: 'Filter categories',
			description:
				'Extra filters besides category. Available keys: early, adults.',
			type: 'array',
			of: [{ type: 'string' }],
			options: {
				list: [
					{ title: 'Early education', value: 'frueh' },
					{ title: 'Adults', value: 'erwachsene' },
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
			title: 'Weekday · time',
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
