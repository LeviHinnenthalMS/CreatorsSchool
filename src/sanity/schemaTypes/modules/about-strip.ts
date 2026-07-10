import { defineArrayMember, defineField, defineType } from 'sanity'
import { richTitleField } from '../fragments/rich-title'

export default defineType({
	name: 'about-strip',
	title: 'About strip (dark)',
	type: 'object',
	fields: [
		defineField({ name: 'eyebrow', title: 'Eyebrow', type: 'string' }),
		defineField({
			name: 'title',
			title: 'Headline',
			...richTitleField(),
		}),
		defineField({
			name: 'body',
			title: 'Body text',
			type: 'text',
			rows: 4,
		}),
		defineField({
			name: 'stats',
			title: 'Stat cards (max 3)',
			validation: (Rule) => Rule.max(3),
			type: 'array',
			of: [
				defineArrayMember({
					type: 'object',
					name: 'stat',
					fields: [
						defineField({ name: 'value', title: 'Value', type: 'string' }),
						defineField({ name: 'label', title: 'Label', type: 'string' }),
					],
					preview: { select: { title: 'value', subtitle: 'label' } },
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
			name: 'profile',
			title: 'Profile card (Miriam)',
			type: 'object',
			fields: [
				defineField({
					name: 'tags',
					title: 'Tags',
					type: 'array',
					of: [{ type: 'string' }],
				}),
				defineField({
					name: 'firstName',
					title: 'First name',
					type: 'string',
				}),
				defineField({
					name: 'lastName',
					title: 'Last name (italic, blush)',
					type: 'string',
				}),
				defineField({ name: 'role', title: 'Role', type: 'string' }),
				defineField({
					name: 'quote',
					title: 'Quote',
					type: 'text',
					rows: 3,
				}),
			],
		}),
		defineField({ name: 'options', type: 'module-options' }),
	],
	preview: {
		select: { eyebrow: 'eyebrow' },
		prepare: ({ eyebrow }) => ({ title: eyebrow || 'About strip', subtitle: 'About strip (dark)' }),
	},
})
