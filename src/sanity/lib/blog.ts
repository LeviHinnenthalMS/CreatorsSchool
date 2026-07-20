import { defineQuery, groq } from 'next-sanity'
import { fetchSanityLive } from './fetch'
import type { SanityImage } from '../typeHelpers'

export type BlogAuthor = {
	_id: string
	name?: string | null
	role?: string | null
	image?: SanityImage | null
}

export type BlogPost = {
	_id: string
	_type: 'blogPost'
	_createdAt?: string
	_updatedAt?: string
	title?: string | null
	slug?: { current?: string | null } | null
	excerpt?: string | null
	coverImage?: SanityImage | null
	publishedAt?: string | null
	language?: string | null
	author?: BlogAuthor | null
	body?: unknown[] | null
	readTime?: number | null
	seoTitle?: string | null
	seoDescription?: string | null
}

const BLOG_IMAGE_QUERY = `
	...,
	'lqip': asset->metadata.lqip,
	'assetAlt': asset->altText
`

export const BLOG_POSTS_QUERY = defineQuery(groq`*[
	_type == 'blogPost' && coalesce(language, $lang) == $lang
] | order(publishedAt desc) {
	_id,
	_type,
	title,
	slug,
	excerpt,
	publishedAt,
	language,
	coverImage { ${BLOG_IMAGE_QUERY} },
	author->{
		_id,
		name,
		role,
		image { ${BLOG_IMAGE_QUERY} }
	}
}`)

export const BLOG_POST_QUERY = defineQuery(groq`*[
	_type == 'blogPost'
	&& slug.current == $slug
	&& coalesce(language, $lang) == $lang
][0]{
	...,
	coverImage { ${BLOG_IMAGE_QUERY} },
	body[]{
		...,
		_type == 'image' => { ${BLOG_IMAGE_QUERY} },
		_type == 'blog.video' => {
			...,
			'fileUrl': file.asset->url,
			'mimeType': file.asset->mimeType
		}
	},
	'wordCount': count(string::split(pt::text(body), ' ')),
	'readTime': round(count(string::split(pt::text(body), ' ')) / 200.0),
	author->{
		_id,
		name,
		role,
		image { ${BLOG_IMAGE_QUERY} }
	}
}`)

export const BLOG_POST_SLUGS_QUERY = defineQuery(groq`*[
	_type == 'blogPost' && defined(slug.current)
]{ 'slug': slug.current }`)

export async function getBlogPosts(lang: string) {
	return fetchSanityLive<BlogPost[]>({
		query: BLOG_POSTS_QUERY,
		params: { lang },
	})
}

export async function getBlogPost(slug: string, lang: string) {
	return fetchSanityLive<BlogPost | null>({
		query: BLOG_POST_QUERY,
		params: { slug, lang },
	})
}
