import { defineField } from 'sanity'

const HERO_TYPES = ['hero.split', 'hero.creators'] as const

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
		'Hero/banner section above the page content. Pick one hero variant or a page header.',
	type: 'array',
	of: [
		...HERO_TYPES.map((type) => ({ type })),
		{ type: 'page-header' },
	],
	validation: (Rule) => Rule.max(1),
	options: {
		insertMenu: {
			views: insertMenuViews,
			groups: [
				{ name: 'hero', title: 'Hero', of: [...HERO_TYPES] },
				{ name: 'header', title: 'Page header', of: ['page-header'] },
			],
		},
	},
})

export default defineField({
	name: 'modules',
	title: 'Page builder',
	description:
		'Page content modules (hero/header are configured in the Stage above).',
	type: 'array',
	of: [
		// Creators-specific
		{ type: 'marquee' },
		{ type: 'feature-grid' },
		{ type: 'welten-split' },
		{ type: 'offering-list' },
		{ type: 'offering-detail' },
		{ type: 'performance-banner' },
		{ type: 'about-strip' },
		{ type: 'cta-band' },
		{ type: 'schedule-preview' },
		{ type: 'schedule-full' },
		{ type: 'gallery-masonry' },
		{ type: 'info-cards' },
		{ type: 'contact-form' },
		{ type: 'jobs-list' },
		{ type: 'location-card' },
		{ type: 'testimonial-cards' },
		{ type: 'svc-split' },
		{ type: 'svc-learn' },
		{ type: 'svc-faq' },
		{ type: 'svc-panel' },

		// Generic page-builder modules from the base
		{ type: 'accordion-list' },
{ type: 'breadcrumbs' },
		{ type: 'callout' },
		{ type: 'centered-cta' },
		{ type: 'custom-html' },
		{ type: 'feature-media' },
		{ type: 'person-list' },
		{ type: 'richtext-module' },
		{ type: 'social-proof.logos' },
		{ type: 'style-guide' },
	],
	options: {
		insertMenu: {
			views: insertMenuViews,
			groups: [
				{
					name: 'creators',
					title: 'Creators School',
					of: [
						'marquee',
						'feature-grid',
						'welten-split',
						'offering-list',
						'offering-detail',
						'performance-banner',
						'about-strip',
						'cta-band',
						'schedule-preview',
						'schedule-full',
						'gallery-masonry',
						'info-cards',
						'contact-form',
						'jobs-list',
						'location-card',
						'testimonial-cards',
						'svc-split',
						'svc-learn',
						'svc-faq',
						'svc-panel',
					],
				},
				{
					name: 'sections',
					title: 'Sections (generic)',
					of: [
						'callout',
						'centered-cta',
						'feature-media',
					],
				},
				{
					name: 'content',
					title: 'Content',
					of: [
						'accordion-list',
						'custom-html',
						'richtext-module',
					],
				},
{
					name: 'people',
					title: 'People & testimonials',
					of: [
						'person-list',
						'social-proof.logos',
					],
				},
				{
					name: 'utility',
					title: 'Utility',
					of: ['breadcrumbs', 'style-guide'],
				},
			],
		},
	},
})
