'use client'

import { defineLocations, presentationTool } from 'sanity/presentation'
import { groq } from 'next-sanity'

export const presentation = presentationTool({
	name: 'editor',
	title: 'Editor',
	previewUrl: {
		previewMode: {
			enable: '/api/draft-mode/enable',
		},
	},
	resolve: {
		mainDocuments: [
			{
				route: '/blog/:slug',
				filter: groq`_type == 'blogPost' && slug.current == $slug`,
			},
			{
				route: '/',
				filter: groq`_type == 'page' && metadata.slug.current == 'index'`,
			},
			{
				route: '/:slug',
				filter: groq`_type == 'page' && metadata.slug.current == $slug`,
			},
		],
		locations: {
			blogPost: defineLocations({
				select: { title: 'title', slug: 'slug.current' },
				resolve: (doc) => ({
					locations: doc?.slug
						? [{ title: doc.title || 'Blog post', href: `/blog/${doc.slug}` }]
						: [],
				}),
			}),
			site: defineLocations({
				message: 'This document is used on all pages',
				locations: [
					{
						title: 'Home',
						href: '/',
					},
				],
			}),
			page: defineLocations({
				select: {
					title: 'title',
					metaTitle: 'metadata.title',
					slug: 'metadata.slug.current',
				},
				resolve: (doc) => ({
					locations: [
						{
							title: doc?.title || doc?.metaTitle || 'Untitled',
							href: doc?.slug
								? doc.slug === 'index'
									? '/'
									: `/${doc.slug}`
								: '/',
						},
					],
				}),
			}),
		},
	},
})
