import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import BlogArticle from '@/ui/blog/BlogArticle'
import { BLOG_POST_SLUGS_QUERY, getBlogPost } from '@/sanity/lib/blog'
import { client } from '@/sanity/lib/client'
import { getRequestLang } from '@/lib/requestLang'
import { BASE_URL } from '@/lib/env'
import { urlFor } from '@/sanity/lib/image'

type Props = { params: Promise<{ slug: string }> }

export default async function BlogPostPage({ params }: Props) {
	const { slug } = await params
	const lang = await getRequestLang()
	const post = await getBlogPost(slug, lang)
	if (!post) notFound()

	const url = `${BASE_URL}/blog/${slug}`
	const image = post.coverImage?.asset
		? urlFor(post.coverImage).width(1200).height(630).fit('crop').url()
		: undefined
	const jsonLd = {
		'@context': 'https://schema.org',
		'@type': 'BlogPosting',
		mainEntityOfPage: url,
		headline: post.title,
		description: post.seoDescription || post.excerpt,
		image,
		datePublished: post.publishedAt,
		dateModified: post._updatedAt,
		inLanguage: post.language || lang,
		author: post.author?.name ? { '@type': 'Person', name: post.author.name } : undefined,
	}

	return (
		<>
			<script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
			<BlogArticle post={post} />
		</>
	)
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
	const { slug } = await params
	const lang = await getRequestLang()
	const post = await getBlogPost(slug, lang)
	if (!post) return {}

	const title = post.seoTitle || post.title || undefined
	const description = post.seoDescription || post.excerpt || undefined
	const url = `${BASE_URL}/blog/${slug}`
	const image = post.coverImage?.asset
		? urlFor(post.coverImage).width(1200).height(630).fit('crop').url()
		: undefined

	return {
		title,
		description,
		alternates: { canonical: url },
		openGraph: { type: 'article', url, title, description, publishedTime: post.publishedAt || undefined, images: image ? [image] : undefined },
		twitter: { card: 'summary_large_image', title, description, images: image ? [image] : undefined },
	}
}

export async function generateStaticParams() {
	return client.fetch<Array<{ slug: string }>>(BLOG_POST_SLUGS_QUERY)
}
