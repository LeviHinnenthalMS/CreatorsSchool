import { defineField } from 'sanity'

const HERO_TYPES = ['hero.split'] as const

const insertMenuViews = [
	{
		name: 'grid' as const,
		previewImageUrl: (schemaType: string) =>
			`/admin/thumbnails/${schemaType}.webp`,
	},
	{ name: 'list' as const },
]

export const stage = defineField({
	name: 'stage',
	title: 'Stage',
	description:
		'Hero/banner section shown above page content. Choose one hero variant.',
	type: 'array',
	of: HERO_TYPES.map((type) => ({ type })),
	validation: (Rule) => Rule.max(1),
	options: {
		insertMenu: {
			views: insertMenuViews,
			groups: [{ name: 'hero', title: 'Hero', of: [...HERO_TYPES] }],
		},
	},
})

export default defineField({
	name: 'modules',
	title: 'Page builder',
	description: 'Page content modules (heroes are configured in the Stage).',
	type: 'array',
	of: [
		{ type: 'about-story' },
		{ type: 'accordion-list' },
		{ type: 'blog-overview' },
		{ type: 'blog-post-content' },
		{ type: 'breadcrumbs' },
		{ type: 'callout' },
		{ type: 'centered-cta' },
		{ type: 'comparison-cards' },
		{ type: 'custom-html' },
		{ type: 'feature-media' },
		{ type: 'feature-tabs' },
		{ type: 'image-callouts' },
		{ type: 'meet-the-founder' },
		{ type: 'meet-the-team' },
		{ type: 'newsletter-cta' },
		{ type: 'person-list' },
		{ type: 'richtext-module' },
		{ type: 'search-module' },
		{ type: 'social-proof.logos' },
		{ type: 'stats-grid' },
		{ type: 'style-guide' },
		{ type: 'testimonial.featured' },
		{ type: 'testimonial.grid' },
		{ type: 'video-with-text' },
	],
	options: {
		insertMenu: {
			views: insertMenuViews,
			groups: [
				{
					name: 'sections',
					title: 'Sections',
					of: [
						'callout',
						'centered-cta',
						'comparison-cards',
						'feature-media',
						'feature-tabs',
						'image-callouts',
						'newsletter-cta',
						'stats-grid',
					],
				},
				{
					name: 'content',
					title: 'Content',
					of: [
						'about-story',
						'accordion-list',
						'custom-html',
						'richtext-module',
						'video-with-text',
					],
				},
				{
					name: 'blog',
					title: 'Blog',
					of: ['blog-overview', 'blog-post-content'],
				},
				{
					name: 'people',
					title: 'People & testimonials',
					of: [
						'meet-the-founder',
						'meet-the-team',
						'person-list',
						'social-proof.logos',
						'testimonial.featured',
						'testimonial.grid',
					],
				},
				{
					name: 'utility',
					title: 'Utility',
					of: ['breadcrumbs', 'search-module', 'style-guide'],
				},
			],
		},
	},
})
