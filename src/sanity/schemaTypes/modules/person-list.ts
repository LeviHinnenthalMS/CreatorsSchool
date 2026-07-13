import { defineField, defineType } from 'sanity'
import { GoPerson } from 'react-icons/go'
import { getBlockText } from '@/lib/utils'
import { byLanguage } from '@/sanity/lib/byLanguage'
import { richTitleField } from '../fragments/rich-title'

export default defineType({
	name: 'person-list',
	title: 'Person list',
	type: 'object',
	icon: GoPerson,
	groups: [{ name: 'content', default: true }, { name: 'options' }],
	fields: [
		defineField({ name: 'eyebrow', title: 'Eyebrow', type: 'string', group: 'content' }),
		defineField({
			name: 'title',
			title: 'Headline',
			...richTitleField(),
			group: 'content',
		}),
		defineField({
			name: 'tagline',
			title: 'Tagline',
			type: 'text',
			rows: 3,
			group: 'content',
		}),
		defineField({
			name: 'intro',
			title: 'Intro (legacy)',
			type: 'array',
			of: [{ type: 'block' }],
			group: 'content',
			hidden: true,
		}),
		defineField({
			name: 'people',
			type: 'array',
			of: [
				{
					type: 'reference',
					to: [{ type: 'person' }],
					options: { filter: byLanguage },
				},
			],
			group: 'content',
		}),
		defineField({
			name: 'layout',
			type: 'string',
			options: {
				list: ['grid', 'carousel'],
				layout: 'radio',
			},
			group: 'options',
			initialValue: 'carousel',
		}),
	],
	preview: {
		select: {
			intro: 'intro',
		},
		prepare: ({ intro }) => ({
			title: getBlockText(intro),
			subtitle: 'Person list',
		}),
	},
})
