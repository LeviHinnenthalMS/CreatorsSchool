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
		'Hero/Banner-Sektion über dem Seiteninhalt. Wähle eine Hero-Variante oder einen Page-Header.',
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
				{ name: 'header', title: 'Page Header', of: ['page-header'] },
			],
		},
	},
})

export default defineField({
	name: 'modules',
	title: 'Page builder',
	description:
		'Inhalts-Module der Seite (Hero/Header werden in der Stage konfiguriert).',
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
					title: 'Sections (generisch)',
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
					title: 'People & Testimonials',
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
