import { defineArrayMember, defineField, defineType } from 'sanity'
import { richTitleField } from '../fragments/rich-title'

export default defineType({
	name: 'hero.creators',
	title: 'Hero · Creators',
	type: 'object',
	fields: [
		defineField({ name: 'eyebrow', title: 'Eyebrow', type: 'string' }),
		defineField({
			name: 'title',
			title: 'Headline',
			description:
				'Press Enter for a new line. Select text and mark it as Accent or Pill for the coloured/styled emphasis.',
			...richTitleField(),
		}),
		defineField({
			name: 'sub',
			title: 'Sub-headline',
			type: 'text',
			rows: 3,
		}),
		defineField({
			name: 'image',
			title: 'Hero photo',
			type: 'image',
			options: { hotspot: true, metadata: ['lqip'] },
			fields: [
				defineField({
					name: 'alt',
					title: 'Alt text',
					type: 'string',
					validation: (Rule) => Rule.required(),
				}),
			],
		}),
		defineField({
			name: 'testimonial',
			title: 'Testimonial overlay (on image)',
			type: 'reference',
			to: [{ type: 'testimonial' }],
		}),
		defineField({
			name: 'ctas',
			title: 'CTAs',
			type: 'array',
			of: [{ type: 'cta' }],
		}),
		defineField({
			name: 'reviewTitle',
			title: 'Review row · headline',
			type: 'string',
		}),
		defineField({
			name: 'reviewSubtitle',
			title: 'Review row · subtitle',
			type: 'string',
		}),
		defineField({
			name: 'reviewAvatars',
			title: 'Review avatars (max 3 initials)',
			type: 'array',
			of: [{ type: 'string' }],
			validation: (Rule) => Rule.max(3),
		}),
		defineField({ name: 'options', type: 'module-options' }),
	],
	preview: {
		select: { eyebrow: 'eyebrow' },
		prepare: ({ eyebrow }) => ({
			title: eyebrow || 'Hero',
			subtitle: 'Hero (Creators)',
		}),
	},
})
