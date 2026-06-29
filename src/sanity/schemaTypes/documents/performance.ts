import { defineField, defineType } from 'sanity'
import { VscMegaphone } from 'react-icons/vsc'

export default defineType({
	name: 'performance',
	title: 'Performance',
	type: 'document',
	icon: VscMegaphone,
	fields: [
		defineField({
			name: 'title',
			title: 'Title',
			type: 'string',
			validation: (Rule) => Rule.required(),
		}),
		defineField({
			name: 'year',
			title: 'Year',
			type: 'number',
		}),
		defineField({
			name: 'dates',
			title: 'Dates (display)',
			description: 'e.g. "5.–6. September 2026"',
			type: 'string',
		}),
		defineField({
			name: 'startDate',
			title: 'Start date',
			type: 'date',
		}),
		defineField({
			name: 'venue',
			title: 'Venue',
			type: 'string',
		}),
		defineField({
			name: 'bigNumber',
			title: 'Big number (date block)',
			description:
				'The large number(s) shown in the date block, e.g. "5 & 6". Leave empty to hide the date block.',
			type: 'string',
		}),
		defineField({
			name: 'monthLabel',
			title: 'Month label',
			description: 'Shown under the big number, e.g. "September 2026".',
			type: 'string',
		}),
		defineField({
			name: 'description',
			title: 'Description',
			type: 'text',
			rows: 4,
		}),
		defineField({
			name: 'lead',
			title: 'Lead sentence',
			description: 'e.g. "Two evenings, one school on stage."',
			type: 'string',
		}),
		defineField({
			name: 'ticketInfo',
			title: 'Ticket info',
			type: 'text',
			rows: 3,
		}),
		defineField({
			name: 'image',
			title: 'Image',
			type: 'image',
			options: { hotspot: true, metadata: ['lqip'] },
			fields: [
				defineField({ name: 'alt', title: 'Alt text', type: 'string' }),
			],
		}),
		defineField({
			name: 'featured',
			title: 'Featured (header badge & home banner)',
			type: 'boolean',
			initialValue: false,
		}),
		defineField({
			name: 'badgeLabel',
			title: 'Badge label',
			description: 'e.g. "5.–6. Sep"',
			type: 'string',
		}),
		defineField({
			name: 'badgeSub',
			title: 'Badge sublabel',
			description: 'e.g. "Performance"',
			type: 'string',
		}),
		defineField({
			name: 'metadata',
			title: 'Metadata',
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
			title: 'By date',
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
