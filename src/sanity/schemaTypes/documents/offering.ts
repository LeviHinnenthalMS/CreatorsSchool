import { defineArrayMember, defineField, defineType } from 'sanity'
import { GoNote } from 'react-icons/go'
import { richTitleField } from '../fragments/rich-title'

const bereichList = [
	{ title: 'Music', value: 'musik' },
	{ title: 'Dance', value: 'tanz' },
]

export default defineType({
	name: 'offering',
	title: 'Offering',
	type: 'document',
	icon: GoNote,
	groups: [
		{ name: 'overview', title: 'Overview', default: true },
		{ name: 'forWho', title: 'For whom' },
		{ name: 'learn', title: "What you'll learn" },
		{ name: 'details', title: 'At a glance' },
		{ name: 'faq', title: 'FAQ' },
		{ name: 'seo', title: 'SEO / Metadata' },
	],
	fields: [
		defineField({
			name: 'title',
			title: 'Title',
			type: 'string',
			validation: (Rule) => Rule.required(),
			group: 'overview',
		}),
		defineField({
			name: 'slug',
			title: 'Slug',
			type: 'slug',
			options: { source: 'title' },
			validation: (Rule) => Rule.required(),
			group: 'overview',
		}),
		defineField({
			name: 'bereich',
			title: 'Category',
			type: 'string',
			options: { list: bereichList, layout: 'radio' },
			validation: (Rule) => Rule.required(),
			group: 'overview',
		}),
		defineField({
			name: 'eyebrow',
			title: 'Eyebrow',
			description: 'e.g. "Dance area · Classical"',
			type: 'string',
			group: 'overview',
		}),
		defineField({
			name: 'lede',
			title: 'Intro text',
			type: 'text',
			rows: 3,
			group: 'overview',
		}),
		defineField({
			name: 'heroImage',
			title: 'Hero image',
			type: 'image',
			options: { hotspot: true, metadata: ['lqip'] },
			fields: [
				defineField({
					name: 'alt',
					title: 'Alt text',
					type: 'string',
					validation: (Rule) =>
						Rule.required().error('Alt text is required for accessibility.'),
				}),
			],
			group: 'overview',
		}),
		defineField({
			name: 'order',
			title: 'Sort order',
			type: 'number',
			group: 'overview',
		}),

		defineField({
			name: 'facts',
			title: 'Facts (header chips)',
			description: 'e.g. Age · Duration · Levels · Price',
			type: 'array',
			of: [
				defineArrayMember({
					type: 'object',
					name: 'fact',
					fields: [
						defineField({ name: 'key', title: 'Label', type: 'string' }),
						defineField({ name: 'value', title: 'Value', type: 'string' }),
					],
					preview: { select: { title: 'key', subtitle: 'value' } },
				}),
			],
			group: 'overview',
		}),

		defineField({
			name: 'forWhoTitle',
			title: 'Section headline',
			...richTitleField(),
			group: 'forWho',
		}),
		defineField({
			name: 'forWhoLead',
			title: 'Section lead',
			type: 'text',
			rows: 2,
			group: 'forWho',
		}),
		defineField({
			name: 'forWho',
			title: 'Audience list',
			type: 'array',
			of: [
				defineArrayMember({
					type: 'object',
					name: 'audience',
					fields: [
						defineField({ name: 'title', title: 'Title', type: 'string' }),
						defineField({ name: 'text', title: 'Text', type: 'text', rows: 2 }),
					],
					preview: { select: { title: 'title', subtitle: 'text' } },
				}),
			],
			group: 'forWho',
		}),

		defineField({
			name: 'learnTitle',
			title: 'Section headline',
			...richTitleField(),
			group: 'learn',
		}),
		defineField({
			name: 'learn',
			title: "What you'll learn (3 cards)",
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
								'Key from the icon set (e.g. "sparkle", "music", "stage", "movement", "voice", "heart").',
						}),
						defineField({ name: 'title', title: 'Title', type: 'string' }),
						defineField({ name: 'text', title: 'Text', type: 'text', rows: 2 }),
					],
					preview: { select: { title: 'title', subtitle: 'text' } },
				}),
			],
			group: 'learn',
		}),

		defineField({
			name: 'detailsTitle',
			title: 'Section headline',
			...richTitleField(),
			group: 'details',
		}),
		defineField({
			name: 'detailsLead',
			title: 'Section lead',
			type: 'text',
			rows: 2,
			group: 'details',
		}),
		defineField({
			name: 'priceLabel',
			title: 'Price label',
			description: 'e.g. "From"',
			type: 'string',
			group: 'details',
		}),
		defineField({
			name: 'priceCurrency',
			title: 'Currency',
			type: 'string',
			group: 'details',
		}),
		defineField({
			name: 'priceValue',
			title: 'Price value',
			type: 'string',
			group: 'details',
		}),
		defineField({
			name: 'priceUnit',
			title: 'Price unit',
			description: 'e.g. "/ child"',
			type: 'string',
			group: 'details',
		}),
		defineField({
			name: 'detailRows',
			title: 'Detail rows',
			type: 'array',
			of: [
				defineArrayMember({
					type: 'object',
					name: 'detailRow',
					fields: [
						defineField({ name: 'key', title: 'Key', type: 'string' }),
						defineField({ name: 'value', title: 'Value', type: 'string' }),
					],
					preview: { select: { title: 'key', subtitle: 'value' } },
				}),
			],
			group: 'details',
		}),

		defineField({
			name: 'faqTitle',
			title: 'Section headline',
			...richTitleField(),
			group: 'faq',
		}),
		defineField({
			name: 'faqLead',
			title: 'Section lead',
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
						defineField({ name: 'q', title: 'Question', type: 'string' }),
						defineField({ name: 'a', title: 'Answer', type: 'text', rows: 4 }),
					],
					preview: { select: { title: 'q' } },
				}),
			],
			group: 'faq',
		}),

		defineField({
			name: 'metadata',
			title: 'Metadata',
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
			title: 'Sort order',
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
