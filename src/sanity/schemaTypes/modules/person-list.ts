import { defineField, defineType } from 'sanity'
import { GoPerson } from 'react-icons/go'
import { getBlockText } from '@/lib/utils'
import { byLanguage } from '@/sanity/lib/byLanguage'

export default defineType({
	name: 'person-list',
	title: 'Person list',
	type: 'object',
	icon: GoPerson,
	groups: [{ name: 'content', default: true }, { name: 'options' }],
	fields: [
		defineField({
			name: 'intro',
			type: 'array',
			of: [{ type: 'block' }],
			group: 'content',
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
