import { defineField, defineType } from 'sanity'
import { VscArrowSwap } from 'react-icons/vsc'

export default defineType({
	name: 'comparison-cards',
	title: 'Comparison cards (without / with)',
	icon: VscArrowSwap,
	type: 'object',
	groups: [
		{ name: 'content', default: true },
		{ name: 'without', title: 'Without card' },
		{ name: 'with', title: 'With card' },
		{ name: 'footnote' },
		{ name: 'options' },
	],
	fields: [
		defineField({
			name: 'options',
			title: 'Module options',
			type: 'module-options',
			group: 'options',
		}),
		defineField({
			name: 'title',
			title: 'Title (H2)',
			type: 'string',
			group: 'content',
		}),
		defineField({
			name: 'intro',
			title: 'Intro / subtitle',
			description: 'Shown below the heading inside the dark section.',
			type: 'array',
			of: [{ type: 'block' }],
			group: 'content',
		}),
		defineField({
			name: 'negativeCard',
			title: 'Without card (left)',
			type: 'object',
			group: 'without',
			fields: [
				defineField({
					name: 'heading',
					title: 'Heading',
					type: 'string',
					validation: (Rule) => Rule.required(),
				}),
				defineField({
					name: 'items',
					title: 'Items',
					description: 'Each item is shown with an X icon.',
					type: 'array',
					of: [{ type: 'string' }],
					validation: (Rule) => Rule.min(1),
				}),
			],
		}),
		defineField({
			name: 'positiveCard',
			title: 'With card (right)',
			type: 'object',
			group: 'with',
			fields: [
				defineField({
					name: 'heading',
					title: 'Heading',
					type: 'string',
					validation: (Rule) => Rule.required(),
				}),
				defineField({
					name: 'items',
					title: 'Items',
					description: 'Each item is shown with a check icon.',
					type: 'array',
					of: [{ type: 'string' }],
					validation: (Rule) => Rule.min(1),
				}),
				defineField({
					name: 'ctas',
					title: 'Call-to-actions',
					description: 'Shown as a full-width button at the bottom of the right card.',
					type: 'array',
					of: [{ type: 'cta' }],
				}),
			],
		}),
		defineField({
			name: 'footnote',
			title: 'Footnote (arrow + caption)',
			description:
				'Optional. Small hand-drawn arrow image and caption shown below the left card.',
			type: 'object',
			group: 'footnote',
			fields: [
				defineField({
					name: 'image',
					title: 'Arrow image',
					type: 'image',
					options: { hotspot: false, metadata: ['lqip'] },
					fields: [
						defineField({
							name: 'alt',
							title: 'Alt text',
							type: 'string',
						}),
					],
				}),
				defineField({
					name: 'text',
					title: 'Caption',
					type: 'string',
				}),
			],
		}),
	],
	preview: {
		select: {
			title: 'title',
			left: 'negativeCard.heading',
			right: 'positiveCard.heading',
		},
		prepare: ({ title, left, right }) => ({
			title: title || [left, right].filter(Boolean).join(' / ') || 'Comparison',
			subtitle: 'Comparison cards',
		}),
	},
})
