import { defineArrayMember, defineField, defineType } from 'sanity'
import { GoNote } from 'react-icons/go'

const bereichList = [
	{ title: 'Musik', value: 'musik' },
	{ title: 'Tanz', value: 'tanz' },
]

export default defineType({
	name: 'offering',
	title: 'Angebot',
	type: 'document',
	icon: GoNote,
	groups: [
		{ name: 'overview', title: 'Übersicht', default: true },
		{ name: 'forWho', title: 'Für wen' },
		{ name: 'learn', title: 'Das lernst du' },
		{ name: 'details', title: 'Auf einen Blick' },
		{ name: 'faq', title: 'FAQ' },
		{ name: 'seo', title: 'SEO / Metadata' },
	],
	fields: [
		defineField({
			name: 'title',
			type: 'string',
			validation: (Rule) => Rule.required(),
			group: 'overview',
		}),
		defineField({
			name: 'slug',
			type: 'slug',
			options: { source: 'title' },
			validation: (Rule) => Rule.required(),
			group: 'overview',
		}),
		defineField({
			name: 'bereich',
			title: 'Bereich',
			type: 'string',
			options: { list: bereichList, layout: 'radio' },
			validation: (Rule) => Rule.required(),
			group: 'overview',
		}),
		defineField({
			name: 'eyebrow',
			title: 'Eyebrow',
			description: 'z. B. "Bereich Tanz · Klassik"',
			type: 'string',
			group: 'overview',
		}),
		defineField({
			name: 'lede',
			title: 'Intro-Text',
			type: 'text',
			rows: 3,
			group: 'overview',
		}),
		defineField({
			name: 'heroImage',
			title: 'Hero-Bild',
			type: 'image',
			options: { hotspot: true, metadata: ['lqip'] },
			fields: [
				defineField({
					name: 'alt',
					title: 'Alt-Text',
					type: 'string',
					validation: (Rule) =>
						Rule.required().error('Alt-Text wird für Barrierefreiheit benötigt.'),
				}),
			],
			group: 'overview',
		}),
		defineField({
			name: 'order',
			title: 'Sortierung',
			type: 'number',
			group: 'overview',
		}),

		defineField({
			name: 'facts',
			title: 'Fakten (Header-Chips)',
			description: 'z. B. Alter · Dauer · Niveaus · Preis',
			type: 'array',
			of: [
				defineArrayMember({
					type: 'object',
					name: 'fact',
					fields: [
						defineField({ name: 'key', title: 'Label', type: 'string' }),
						defineField({ name: 'value', title: 'Wert', type: 'string' }),
					],
					preview: { select: { title: 'key', subtitle: 'value' } },
				}),
			],
			group: 'overview',
		}),

		defineField({
			name: 'forWho',
			title: 'Für wen',
			type: 'array',
			of: [
				defineArrayMember({
					type: 'object',
					name: 'audience',
					fields: [
						defineField({ name: 'title', type: 'string' }),
						defineField({ name: 'text', type: 'text', rows: 2 }),
					],
					preview: { select: { title: 'title', subtitle: 'text' } },
				}),
			],
			group: 'forWho',
		}),
		defineField({
			name: 'forWhoTitle',
			title: 'Sektions-Headline',
			type: 'string',
			group: 'forWho',
		}),
		defineField({
			name: 'forWhoLead',
			title: 'Sektions-Lead',
			type: 'text',
			rows: 2,
			group: 'forWho',
		}),

		defineField({
			name: 'learnTitle',
			title: 'Sektions-Headline',
			type: 'string',
			group: 'learn',
		}),
		defineField({
			name: 'learn',
			title: 'Das lernst du (3 Karten)',
			type: 'array',
			validation: (Rule) => Rule.max(3),
			of: [
				defineArrayMember({
					type: 'object',
					name: 'learnCard',
					fields: [
						defineField({
							name: 'icon',
							title: 'Icon',
							type: 'string',
							description:
								'Ein Key des Icon-Sets (z. B. "sparkle", "music", "stage", "movement", "voice", "heart").',
						}),
						defineField({ name: 'title', type: 'string' }),
						defineField({ name: 'text', type: 'text', rows: 2 }),
					],
					preview: { select: { title: 'title', subtitle: 'text' } },
				}),
			],
			group: 'learn',
		}),

		defineField({
			name: 'detailsTitle',
			title: 'Sektions-Headline',
			type: 'string',
			group: 'details',
		}),
		defineField({
			name: 'detailsLead',
			title: 'Sektions-Lead',
			type: 'text',
			rows: 2,
			group: 'details',
		}),
		defineField({
			name: 'priceLabel',
			title: 'Preis-Label',
			description: 'z. B. "Ab"',
			type: 'string',
			group: 'details',
		}),
		defineField({
			name: 'priceCurrency',
			title: 'Währung',
			type: 'string',
			group: 'details',
		}),
		defineField({
			name: 'priceValue',
			title: 'Preis-Wert',
			type: 'string',
			group: 'details',
		}),
		defineField({
			name: 'priceUnit',
			title: 'Preis-Einheit',
			description: 'z. B. "/ Kind"',
			type: 'string',
			group: 'details',
		}),
		defineField({
			name: 'detailRows',
			title: 'Detail-Zeilen',
			type: 'array',
			of: [
				defineArrayMember({
					type: 'object',
					name: 'detailRow',
					fields: [
						defineField({ name: 'key', type: 'string' }),
						defineField({ name: 'value', type: 'string' }),
					],
					preview: { select: { title: 'key', subtitle: 'value' } },
				}),
			],
			group: 'details',
		}),

		defineField({
			name: 'faqTitle',
			title: 'Sektions-Headline',
			type: 'string',
			group: 'faq',
		}),
		defineField({
			name: 'faqLead',
			title: 'Sektions-Lead',
			type: 'text',
			rows: 2,
			group: 'faq',
		}),
		defineField({
			name: 'faq',
			title: 'FAQ',
			type: 'array',
			of: [
				defineArrayMember({
					type: 'object',
					name: 'qa',
					fields: [
						defineField({ name: 'q', title: 'Frage', type: 'string' }),
						defineField({ name: 'a', title: 'Antwort', type: 'text', rows: 4 }),
					],
					preview: { select: { title: 'q' } },
				}),
			],
			group: 'faq',
		}),

		defineField({
			name: 'metadata',
			type: 'metadata',
			group: 'seo',
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
			name: 'order',
			title: 'Reihenfolge',
			by: [{ field: 'order', direction: 'asc' }],
		},
	],
	preview: {
		select: {
			title: 'title',
			subtitle: 'bereich',
			media: 'heroImage',
			language: 'language',
		},
		prepare: ({ title, subtitle, media, language }) => ({
			title,
			subtitle: [language && `[${language}]`, subtitle].filter(Boolean).join(' · '),
			media,
		}),
	},
})
