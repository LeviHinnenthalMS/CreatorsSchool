import { defineField, defineType } from 'sanity'

export default defineType({
	name: 'offering-detail',
	title: 'Offering detail (auto)',
	description:
		'Full offering layout: page header (facts), For whom, What you\'ll learn, At a glance, FAQ. Source: one Offering document.',
	type: 'object',
	fields: [
		defineField({
			name: 'offering',
			title: 'Offering',
			type: 'reference',
			to: [{ type: 'offering' }],
			validation: (Rule) => Rule.required(),
			options: {
				filter: ({ document }) =>
					document?.language
						? { filter: 'language == $lang', params: { lang: document.language } }
						: {},
			},
		}),
		defineField({
			name: 'breadcrumbHomeLabel',
			title: 'Breadcrumb · Home',
			type: 'string',
		}),
		defineField({
			name: 'breadcrumbParentLabel',
			title: 'Breadcrumb · Offerings',
			type: 'string',
		}),
		defineField({
			name: 'breadcrumbParentHref',
			title: 'Breadcrumb · Offerings URL',
			type: 'string',
		}),
		defineField({
			name: 'ctas',
			title: 'CTAs in page header',
			type: 'array',
			of: [{ type: 'cta' }],
		}),
		defineField({
			name: 'backLinkLabel',
			title: 'Back-link label',
			type: 'string',
		}),
		defineField({
			name: 'backLinkHref',
			title: 'Back-link URL',
			type: 'string',
		}),
		defineField({
			name: 'panelCtas',
			title: 'Panel CTAs (price box)',
			type: 'array',
			of: [{ type: 'cta' }],
		}),
		defineField({ name: 'options', type: 'module-options' }),
	],
	preview: {
		select: { title: 'offering.title' },
		prepare: ({ title }) => ({
			title: title || 'Offering detail',
			subtitle: 'offering-detail',
		}),
	},
})
