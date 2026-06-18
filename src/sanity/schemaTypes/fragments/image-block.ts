import { defineArrayMember, defineField } from 'sanity'
import { IoIosImage } from 'react-icons/io'

export default defineArrayMember({
	type: 'image',
	icon: IoIosImage,
	options: {
		hotspot: true,
		metadata: ['lqip'],
	},
	fieldsets: [
		{ name: 'attributes' },
		{ name: 'options' },
	],
	fields: [
		defineField({
			name: 'decorative',
			title: 'Decorative image',
			description:
				'Toggle on when the image conveys no information. Skips the alt text and renders alt="".',
			type: 'boolean',
			initialValue: false,
			fieldset: 'attributes',
		}),
		defineField({
			name: 'alt',
			type: 'string',
			description:
				'Describe what the image shows. Used by screen readers and search engines.',
			hidden: ({ parent }) => !!parent?.decorative,
			fieldset: 'attributes',
			validation: (Rule) =>
				Rule.custom((alt, ctx) => {
					const parent = ctx.parent as
						| { asset?: unknown; decorative?: boolean | null }
						| undefined
					if (!parent?.asset) return true
					if (parent.decorative) return true
					if (!alt || (typeof alt === 'string' && !alt.trim())) {
						return 'Add alt text or mark the image as decorative.'
					}
					return true
				}).warning(),
		}),
		defineField({
			name: 'loading',
			type: 'string',
			options: {
				list: ['lazy', 'eager'],
				layout: 'radio',
			},
			initialValue: 'lazy',
			fieldset: 'attributes',
		}),
		defineField({
			name: 'caption',
			type: 'text',
			rows: 2,
			fieldset: 'options',
		}),
		defineField({
			name: 'source',
			type: 'url',
			fieldset: 'options',
		}),
	],
	preview: {
		select: {
			title: 'caption',
			subtitle: 'alt',
			media: 'asset',
		},
	},
})
