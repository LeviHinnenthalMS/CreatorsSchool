import { defineField, defineType } from 'sanity'
import { VscMap } from 'react-icons/vsc'
import { count } from '@/lib/utils'

export default defineType({
	name: 'navigation',
	title: 'Navigation',
	icon: VscMap,
	type: 'document',
	fields: [
		defineField({
			name: 'title',
			type: 'string',
			validation: (Rule) => Rule.required(),
		}),
		defineField({
			name: 'type',
			title: 'Purpose',
			description: 'Where this navigation is rendered on the site.',
			type: 'string',
			initialValue: 'header',
			readOnly: true,
			hidden: true,
		}),
		defineField({
			name: 'items',
			type: 'array',
			of: [{ type: 'link' }, { type: 'link.list' }, { type: 'cta' }],
		}),
		defineField({
			name: 'language',
			type: 'string',
			readOnly: true,
			hidden: true,
		}),
	],
	preview: {
		select: {
			title: 'title',
			items: 'items',
			language: 'language',
		},
		prepare: ({ title, items, language }) => ({
			title,
			subtitle: [language && `[${language}]`, count(items)]
				.filter(Boolean)
				.join(' · '),
		}),
	},
})
