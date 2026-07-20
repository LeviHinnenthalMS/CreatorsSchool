import { defineArrayMember, defineField, defineType } from 'sanity'
import { VscEdit } from 'react-icons/vsc'
import { admonition, imageBlock } from '../fragments'

export default defineType({
	name: 'blogPost',
	title: 'Blog post',
	type: 'document',
	icon: VscEdit,
	initialValue: { language: 'de' },
	groups: [
		{ name: 'content', title: 'Content', default: true },
		{ name: 'seo', title: 'Search & sharing' },
	],
	fields: [
		defineField({
			name: 'title',
			title: 'Title',
			type: 'string',
			group: 'content',
			validation: (Rule) => Rule.required().max(90),
		}),
		defineField({
			name: 'slug',
			title: 'URL slug',
			type: 'slug',
			group: 'content',
			options: {
				source: 'title',
				maxLength: 96,
				slugify: (input) =>
					input
						.toLowerCase()
						.trim()
						.normalize('NFD')
						.replace(/[\u0300-\u036f]/g, '')
						.replace(/[^a-z0-9]+/g, '-')
						.replace(/(^-|-$)/g, '')
						.slice(0, 96),
			},
			validation: (Rule) => Rule.required(),
		}),
		defineField({
			name: 'excerpt',
			title: 'Summary',
			description: 'Shown on the blog overview and in search results.',
			type: 'text',
			rows: 3,
			group: ['content', 'seo'],
			validation: (Rule) => Rule.required().max(220),
		}),
		defineField({
			name: 'coverImage',
			title: 'Cover image',
			type: 'image',
			group: ['content', 'seo'],
			options: { hotspot: true, metadata: ['lqip'] },
			fields: [
				defineField({
					name: 'alt',
					title: 'Alternative text',
					type: 'string',
					validation: (Rule) => Rule.required().warning(),
				}),
			],
		}),
		defineField({
			name: 'publishedAt',
			title: 'Publication date',
			type: 'datetime',
			group: 'content',
			initialValue: () => new Date().toISOString(),
			validation: (Rule) => Rule.required(),
		}),
		defineField({
			name: 'author',
			title: 'Author',
			type: 'reference',
			to: [{ type: 'person' }],
			group: 'content',
		}),
		defineField({
			name: 'body',
			title: 'Article',
			type: 'array',
			group: 'content',
			of: [
				defineArrayMember({
					type: 'block',
					styles: [
						{ title: 'Normal', value: 'normal' },
						{ title: 'Heading 2', value: 'h2' },
						{ title: 'Heading 3', value: 'h3' },
						{ title: 'Heading 4', value: 'h4' },
						{ title: 'Quote', value: 'blockquote' },
					],
					marks: {
						annotations: [
							{
								name: 'link',
								title: 'Link',
								type: 'object',
								fields: [
									defineField({
										name: 'href',
										title: 'URL',
										type: 'url',
										validation: (Rule) =>
											Rule.uri({
												scheme: ['http', 'https', 'mailto', 'tel'],
												allowRelative: true,
											}),
									}),
								],
							},
						],
					},
				}),
				imageBlock,
				{ type: 'blog.video' },
				admonition,
				defineArrayMember({
					title: 'Code block',
					type: 'code',
					options: { withFilename: true },
				}),
			],
			validation: (Rule) => Rule.required().min(1),
		}),
		defineField({
			name: 'seoTitle',
			title: 'SEO title override',
			description: 'Optional. The post title is used when this is empty.',
			type: 'string',
			group: 'seo',
			validation: (Rule) => Rule.max(60).warning(),
		}),
		defineField({
			name: 'seoDescription',
			title: 'SEO description override',
			description: 'Optional. The summary is used when this is empty.',
			type: 'text',
			rows: 3,
			group: 'seo',
			validation: (Rule) => Rule.max(160).warning(),
		}),
		defineField({
			name: 'language',
			type: 'string',
			readOnly: true,
			hidden: true,
		}),
	],
	orderings: [
		{
			title: 'Newest first',
			name: 'publishedAtDesc',
			by: [{ field: 'publishedAt', direction: 'desc' }],
		},
	],
	preview: {
		select: {
			title: 'title',
			date: 'publishedAt',
			media: 'coverImage',
			language: 'language',
		},
		prepare: ({ title, date, media, language }) => ({
			title: title || 'Untitled post',
			subtitle: [language && `[${language}]`, date?.slice(0, 10)]
				.filter(Boolean)
				.join(' · '),
			media,
		}),
	},
})
