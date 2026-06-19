import { createClient, groq } from 'next-sanity'
import { projectId, dataset, apiVersion } from '@/sanity/lib/env'
// import { token } from '@/lib/sanity/token'
import { BLOG_DIR } from '@/lib/env'
import { DEFAULT_LANG, supportedLanguages } from '@/lib/i18n'
import type { NextConfig } from 'next'

const client = createClient({
	projectId,
	dataset,
	// token, // for private datasets
	apiVersion,
	useCdn: true,
})

export default {
	images: {
		dangerouslyAllowSVG: true,
		contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
		remotePatterns: [
			{
				protocol: 'https',
				hostname: 'cdn.sanity.io',
			},
			{
				protocol: 'https',
				hostname: 'avatars.githubusercontent.com',
			},
		],
	},

	async redirects() {
		return await client.fetch(groq`*[_type == 'redirect']{
			source,
			'destination': select(
				destination.type == 'internal' =>
					select(
						destination.internal->.language != null && destination.internal->.language != '${DEFAULT_LANG}'
							=> '/' + destination.internal->.language,
						''
					) + select(
						destination.internal->._type == 'blog.post' => '/${BLOG_DIR}/',
						'/'
					) + coalesce(
						destination.internal->.metadata.slug.current,
						destination.internal->.slug.current
					),
				destination.external
			),
			permanent
		}`)
	},

	async rewrites() {
		if (!supportedLanguages?.length) return []

		return [
			{
				source: `/:lang/${BLOG_DIR}/:slug+`,
				destination: `/${BLOG_DIR}/:lang/:slug+`,
			},
		]
	},

	env: {
		SC_DISABLE_SPEEDY: 'false',
	},

	// logging: {
	// 	fetches: {
	// 		fullUrl: true,
	// 	},
	// },
} satisfies NextConfig
