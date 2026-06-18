import { defineField, defineType } from 'sanity'
import { ImNewspaper } from 'react-icons/im'
import { getBlockText } from '@/lib/utils'

export default defineType({
	name: 'blog-overview',
	title: 'Blog overview',
	icon: ImNewspaper,
	type: 'object',
	groups: [
		{ name: 'content', default: true },
		{ name: 'labels' },
		{ name: 'options' },
	],
	fields: [
		defineField({
			name: 'options',
			title: 'Module options',
			type: 'module-options',
			group: 'options',
		}),
		defineField({
			name: 'title',
			title: 'Title (H1)',
			description:
				'Main page headline (e.g. "The latest writings from our team").',
			type: 'text',
			rows: 2,
			validation: (Rule) => Rule.required(),
			group: 'content',
		}),
		defineField({
			name: 'intro',
			title: 'Description',
			description: 'Short supporting paragraph shown below the headline.',
			type: 'array',
			of: [{ type: 'block' }],
			group: 'content',
		}),
		defineField({
			name: 'itemsPerPage',
			title: 'Posts per page',
			type: 'number',
			initialValue: 9,
			validation: (Rule) => Rule.required().min(1).integer(),
			group: 'content',
		}),
		defineField({
			name: 'searchPlaceholder',
			title: 'Search placeholder',
			type: 'string',
			initialValue: 'Search',
			group: 'labels',
		}),
		defineField({
			name: 'viewAllLabel',
			title: '"View all" tab label',
			type: 'string',
			initialValue: 'View all',
			group: 'labels',
		}),
		defineField({
			name: 'mostRecentLabel',
			title: '"Most recent" sort label',
			type: 'string',
			initialValue: 'Most recent',
			group: 'labels',
		}),
		defineField({
			name: 'oldestFirstLabel',
			title: '"Oldest first" sort label',
			type: 'string',
			initialValue: 'Oldest first',
			group: 'labels',
		}),
		defineField({
			name: 'sortAriaLabel',
			title: 'Sort dropdown accessible label',
			description: 'Read by screen readers to describe the sort dropdown.',
			type: 'string',
			initialValue: 'Sort posts',
			group: 'labels',
		}),
		defineField({
			name: 'emptyLabel',
			title: 'Empty-state message',
			description: 'Shown when filters/search return no posts.',
			type: 'string',
			initialValue: 'No posts found.',
			group: 'labels',
		}),
		defineField({
			name: 'previousLabel',
			title: 'Pagination — "Previous" label',
			type: 'string',
			initialValue: 'Previous',
			group: 'labels',
		}),
		defineField({
			name: 'nextLabel',
			title: 'Pagination — "Next" label',
			type: 'string',
			initialValue: 'Next',
			group: 'labels',
		}),
	],
	preview: {
		select: { title: 'title', intro: 'intro' },
		prepare: ({ title, intro }) => ({
			title: title || getBlockText(intro) || 'Blog overview',
			subtitle: 'Blog overview',
		}),
	},
})
