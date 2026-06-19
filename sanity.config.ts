'use client'

import { defineConfig } from 'sanity'
import { projectId, dataset, apiVersion } from '@/sanity/lib/env'
import { structure } from './src/sanity/structure'
import { presentation } from './src/sanity/presentation'
import { icon } from '@/sanity/ui/Icon'
import {
	dashboardTool,
	projectInfoWidget,
	projectUsersWidget,
} from '@sanity/dashboard'
import { visionTool } from '@sanity/vision'
import { codeInput } from '@sanity/code-input'
import { media, mediaAssetSource } from 'sanity-plugin-media'
import { supportedLanguages } from '@/lib/i18n'
import { documentInternationalization } from '@sanity/document-internationalization'
import { schemaTypes } from './src/sanity/schemaTypes'
import resolveUrl from '@/lib/resolveUrl'
import type { PageOrPost } from '@/sanity/typeHelpers'

const singletonTypes = ['site']

export default defineConfig({
	title: 'Creators School',
	icon,
	projectId,
	dataset,
	basePath: '/admin',

	plugins: [
		structure,
		presentation,
		dashboardTool({
			name: 'info',
			title: 'Info',
			widgets: [projectInfoWidget(), projectUsersWidget()],
		}),
		visionTool({ defaultApiVersion: apiVersion }),
		codeInput(),
		media(),
		documentInternationalization({
			supportedLanguages,
			schemaTypes: [
				'page',
				'blog.post',
				'navigation',
				'announcement',
				'footer',
				'logo',
				'person',
				'testimonial',
				'offering',
				'teacher',
				'performance',
				'scheduleSlot',
				'galleryImage',
				'job',
			],
		}),
	],

	schema: {
		types: schemaTypes,
		templates: (templates) =>
			templates.filter(
				({ schemaType }) => !singletonTypes.includes(schemaType),
			),
	},
	form: {
		image: {
			assetSources: (prev) => [mediaAssetSource, ...prev],
		},
		file: {
			assetSources: (prev) => [mediaAssetSource, ...prev],
		},
	},
	document: {
		productionUrl: async (prev, { document }) => {
			if (['page', 'blog.post'].includes(document?._type)) {
				return resolveUrl(document as PageOrPost, { base: true })
			}
			if (document?._type === 'offering') {
				const lang = (document as { language?: string }).language
				const slug = (document as { slug?: { current?: string } }).slug?.current
				if (slug)
					return `${process.env.NEXT_PUBLIC_BASE_URL || ''}${
						lang && lang !== 'de' ? `/${lang}` : ''
					}/angebote/${slug}`
			}
			return prev
		},

		actions: (input, { schemaType }) => {
			if (singletonTypes.includes(schemaType)) {
				return input.filter(
					({ action }) =>
						action && ['publish', 'discardChanges', 'restore'].includes(action),
				)
			}

			return input
		},
	},
})
