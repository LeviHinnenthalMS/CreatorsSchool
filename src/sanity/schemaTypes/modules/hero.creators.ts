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
			name: 'tags',
			title: 'Floating tags (max 3)',
			type: 'array',
			validation: (Rule) => Rule.max(3),
			of: [
				defineArrayMember({
					type: 'object',
					name: 'photoTag',
					fields: [
						defineField({
							name: 'position',
							title: 'Position',
							type: 'string',
							options: {
								list: [
									{ title: 'Top right', value: 't1' },
									{ title: 'Middle left', value: 't2' },
									{ title: 'Bottom right', value: 't3' },
								],
								layout: 'radio',
							},
						}),
						defineField({
							name: 'style',
							title: 'Style',
							type: 'string',
							options: {
								list: [
									{ title: 'Coral', value: 'coral' },
									{ title: 'Neutral', value: 'neutral' },
									{ title: 'Ink', value: 'ink' },
								],
								layout: 'radio',
							},
							initialValue: 'neutral',
						}),
						defineField({ name: 'icon', title: 'Icon key', type: 'string' }),
						defineField({ name: 'label', title: 'Label', type: 'string' }),
						defineField({ name: 'value', title: 'Value', type: 'string' }),
					],
					preview: {
						select: { title: 'label', subtitle: 'value' },
					},
				}),
			],
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
			title: 'Hero',
			subtitle: eyebrow || 'hero.creators',
		}),
	},
})
