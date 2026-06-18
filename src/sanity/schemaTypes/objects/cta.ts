import { defineField, defineType } from 'sanity'
import { VscInspect } from 'react-icons/vsc'
import resolveSlug from '@/sanity/lib/resolveSlug'

export default defineType({
	name: 'cta',
	title: 'Call-to-action',
	icon: VscInspect,
	type: 'object',
	fields: [
		defineField({
			name: 'active',
			title: 'Active',
			description:
				'Toggle off to hide this CTA in the header navigation without deleting it.',
			type: 'boolean',
			initialValue: true,
		}),
		defineField({
			name: 'link',
			type: 'link',
		}),
		defineField({
			name: 'variant',
			title: 'Variant',
			type: 'string',
			initialValue: 'primary',
			options: {
				list: [
					{ title: 'Primary', value: 'primary' },
					{ title: 'Secondary', value: 'secondary' },
					{ title: 'Tertiary', value: 'tertiary' },
				],
				layout: 'radio',
				direction: 'horizontal',
			},
		}),
		defineField({
			name: 'size',
			title: 'Size',
			type: 'string',
			initialValue: 'medium',
			options: {
				list: [
					{ title: 'Small', value: 'small' },
					{ title: 'Medium', value: 'medium' },
					{ title: 'Large', value: 'large' },
				],
				layout: 'radio',
				direction: 'horizontal',
			},
		}),
		defineField({
			name: 'icon',
			title: 'Icon (SVG)',
			description: 'Optional. Upload an SVG to render inside the button.',
			type: 'image',
			options: { accept: 'image/svg+xml' },
		}),
		defineField({
			name: 'iconHeight',
			title: 'Icon height (px)',
			description:
				'Optional. Override the icon height in pixels. Width is computed automatically from the SVG\'s aspect ratio. Defaults to 24px.',
			type: 'number',
			validation: (Rule) => Rule.positive().integer(),
			hidden: ({ parent }) => !parent?.icon,
		}),
		defineField({
			name: 'iconPosition',
			title: 'Icon position',
			type: 'string',
			initialValue: 'leading',
			options: {
				list: [
					{ title: 'Leading (left)', value: 'leading' },
					{ title: 'Trailing (right)', value: 'trailing' },
				],
				layout: 'radio',
				direction: 'horizontal',
			},
			hidden: ({ parent }) => !parent?.icon,
		}),
	],
	preview: {
		select: {
			label: 'link.label',
			variant: 'variant',
			size: 'size',
			_type: 'link.internal._type',
			pageTitle: 'link.internal.title',
			internal: 'link.internal.metadata.slug.current',
			params: 'link.params',
			external: 'link.external',
			fileName: 'link.file.asset.originalFilename',
			active: 'active',
		},
		prepare: ({ label, pageTitle, variant, size, active, ...props }) => ({
			title: [active === false && '(inactive)', label || pageTitle || props.fileName]
				.filter(Boolean)
				.join(' '),
			subtitle: [variant, size, resolveSlug(props)]
				.filter(Boolean)
				.join(' · '),
		}),
	},
})
