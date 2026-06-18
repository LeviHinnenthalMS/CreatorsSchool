import { defineArrayMember, defineField, defineType } from 'sanity'
import { VscFileMedia } from 'react-icons/vsc'
import {
	getPreset,
	TextInputWithPresets,
	type Preset,
} from '@/sanity/ui/TextInputWithPresets'
import { count } from '@/lib/utils'

const presets: Preset[] = [
	{ title: 'Tablet and below', value: '(width < 48rem)' },
	{ title: 'Mobile only', value: '(width < 40rem)' },
	{ title: 'Dark mode', value: '(prefers-color-scheme: dark)' },
]

export default defineType({
	name: 'img',
	title: 'Image',
	type: 'object',
	icon: VscFileMedia,
	fieldsets: [{ name: 'options' }],
	fields: [
		defineField({
			name: 'image',
			title: 'Default image',
			type: 'image',
			options: {
				hotspot: true,
				metadata: ['lqip'],
			},
		}),
		defineField({
			name: 'responsive',
			title: 'Responsive images',
			type: 'array',
			of: [
				defineArrayMember({
					type: 'object',
					name: 'responsive',
					fields: [
						defineField({
							name: 'image',
							type: 'image',
							options: {
								hotspot: true,
							},
							validation: (Rule) => Rule.required(),
						}),
						defineField({
							name: 'media',
							title: 'Media query',
							type: 'string',
							placeholder: `e.g. ${presets.map((p) => getPreset(p)).join(', ')}`,
							validation: (Rule) => Rule.required(),
							initialValue: getPreset(presets[0]),
							components: {
								input: (props) => (
									<TextInputWithPresets
										prefix="@media"
										presets={presets}
										{...(props as any)}
									/>
								),
							},
						}),
					],
					preview: {
						select: {
							title: 'media',
							media: 'image',
						},
					},
				}),
			],
		}),
		defineField({
			name: 'decorative',
			title: 'Decorative image',
			description:
				'Toggle on when the image conveys no information (purely visual). Skips the alt text and renders alt="", which is the correct WCAG pattern for decorative images.',
			type: 'boolean',
			initialValue: false,
			fieldset: 'options',
		}),
		defineField({
			name: 'alt',
			type: 'string',
			description:
				'Describe what the image shows. Used by screen readers and search engines.',
			hidden: ({ parent }) => !!parent?.decorative,
			fieldset: 'options',
			validation: (Rule) =>
				Rule.custom((alt, ctx) => {
					const parent = ctx.parent as
						| { image?: { asset?: unknown } | null; decorative?: boolean | null }
						| undefined
					if (!parent?.image?.asset) return true
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
			fieldset: 'options',
		}),
	],
	preview: {
		select: {
			image: 'image',
			responsive: 'responsive',
			alt: 'alt',
			decorative: 'decorative',
			loading: 'loading',
		},
		prepare: ({ image, responsive, alt, decorative, loading = 'lazy' }) => ({
			title: decorative ? 'Decorative image' : alt,
			subtitle: [
				responsive && count(responsive, 'responsive image'),
				loading && `loading="${loading}"`,
			]
				.filter(Boolean)
				.join(', '),
			media: image,
		}),
	},
})
