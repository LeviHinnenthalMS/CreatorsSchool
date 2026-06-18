import { defineArrayMember, defineField, defineType } from 'sanity'
import { LuBookOpen } from 'react-icons/lu'
import { imageBlock } from '../fragments'
import { getBlockText } from '@/lib/utils'

export default defineType({
	name: 'about-story',
	title: 'About story',
	icon: LuBookOpen,
	type: 'object',
	groups: [{ name: 'content', default: true }, { name: 'options' }],
	fields: [
		defineField({
			name: 'options',
			title: 'Module options',
			type: 'module-options',
			group: 'options',
		}),
		defineField({
			name: 'content',
			title: 'Story',
			description:
				'Long-form story. Supports headings, bullet/numbered lists, bold, italic, links, and inline images (rendered full-width of the reading column).',
			type: 'array',
			of: [{ type: 'block' }, imageBlock],
			group: 'content',
		}),
		defineField({
			name: 'timeline',
			title: 'Timeline',
			description:
				'Optional row of milestone images shown below the story. Each item is editable; rows with no image are skipped.',
			type: 'array',
			of: [
				defineArrayMember({
					type: 'object',
					name: 'milestone',
					fields: [
						defineField({
							name: 'year',
							title: 'Year',
							type: 'string',
						}),
						defineField({
							name: 'image',
							title: 'Image',
							type: 'image',
							options: { hotspot: true, metadata: ['lqip'] },
							fields: [
								defineField({ name: 'alt', type: 'string' }),
							],
						}),
					],
					preview: {
						select: { year: 'year', media: 'image' },
						prepare: ({ year, media }) => ({
							title: year || 'Milestone',
							media,
						}),
					},
				}),
			],
			group: 'content',
		}),
	],
	preview: {
		select: { content: 'content', timeline: 'timeline' },
		prepare: ({ content, timeline }) => ({
			title: getBlockText(content) || 'About story',
			subtitle: timeline?.length
				? `About story · ${timeline.length} milestones`
				: 'About story',
		}),
	},
})
