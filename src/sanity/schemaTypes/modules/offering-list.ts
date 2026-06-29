import { defineField, defineType } from 'sanity'
import { richTitleField } from '../fragments/rich-title'

export default defineType({
	name: 'offering-list',
	title: 'Offerings list',
	type: 'object',
	fields: [
		defineField({ name: 'eyebrow', title: 'Eyebrow', type: 'string' }),
		defineField({
			name: 'title',
			title: 'Headline',
			...richTitleField(),
		}),
		defineField({
			name: 'tagline',
			title: 'Tagline',
			type: 'text',
			rows: 3,
		}),
		defineField({
			name: 'bereich',
			title: 'Filter by category',
			type: 'string',
			options: {
				list: [
					{ title: 'All', value: 'alle' },
					{ title: 'Music only', value: 'musik' },
					{ title: 'Dance only', value: 'tanz' },
				],
				layout: 'radio',
			},
			initialValue: 'alle',
		}),
		defineField({
			name: 'layout',
			title: 'Layout',
			type: 'string',
			options: {
				list: [
					{ title: 'Music: 2 large cards', value: 'musik-pair' },
					{ title: 'Dance: 3-col grid with CTA tile', value: 'tanz-grid' },
					{ title: 'Overview (4-col program cards)', value: 'prog' },
				],
				layout: 'radio',
			},
			initialValue: 'prog',
		}),
		defineField({
			name: 'tinted',
			title: 'Warm-white background',
			type: 'boolean',
			initialValue: false,
		}),
		defineField({
			name: 'ctaTileTitle',
			title: 'CTA tile · title',
			description: 'Only visible in the "Dance: 3-col grid with CTA tile" layout.',
			type: 'string',
		}),
		defineField({
			name: 'ctaTileText',
			title: 'CTA tile · text',
			type: 'string',
		}),
		defineField({
			name: 'ctaTileLink',
			title: 'CTA tile · link',
			type: 'link',
		}),
		defineField({
			name: 'ctaTileLinkLabel',
			title: 'CTA tile · link label',
			type: 'string',
		}),
		defineField({ name: 'options', type: 'module-options' }),
	],
	preview: {
		select: { bereich: 'bereich' },
		prepare: ({ bereich }) => ({
			title: 'Offerings list',
			subtitle: `Filter: ${bereich || 'all'}`,
		}),
	},
})
