import { notFound } from 'next/navigation'
import Modules from '@/ui/modules'
import PostContent from '@/ui/modules/blog/PostContent'
import processMetadata from '@/lib/processMetadata'
import { processSlug } from '@/lib/processSlug'
import { client } from '@/sanity/lib/client'
import { fetchSanityLive } from '@/sanity/lib/fetch'
import { BLOG_POST_QUERY, BLOG_POST_SLUGS_QUERY } from '@/sanity/lib/queries'
import type { BLOG_POST_QUERY_RESULT } from '@/sanity/types'
import type { Module } from '@/sanity/typeHelpers'

export default async function Page({ params }: Props) {
	const post = await getPost(await params)
	if (!post) notFound()

	const before = filterContentModules(post.modulesBefore)
	const after = filterContentModules(post.modulesAfter)

	return (
		<>
			<Modules modules={before} post={post} />
			<PostContent post={post} />
			<Modules modules={after} post={post} />
		</>
	)
}

export async function generateMetadata({ params }: Props) {
	const post = await getPost(await params)
	if (!post) notFound()
	return processMetadata(post)
}

export async function generateStaticParams() {
	const slugs = await client.fetch<string[]>(BLOG_POST_SLUGS_QUERY)
	return slugs.map((slug) => ({ slug: slug.split('/') }))
}

async function getPost(params: Params) {
	const { slug, lang } = processSlug(params.slug)

	return await fetchSanityLive<BLOG_POST_QUERY_RESULT>({
		query: BLOG_POST_QUERY,
		params: { slug, lang },
	})
}

function filterContentModules(
	modules?: Array<(Module & { _type?: string }) | null> | null,
) {
	if (!modules) return null
	return modules.filter((m) => m?._type !== 'blog-post-content')
}

type Params = { slug: string[] }

type Props = {
	params: Promise<Params>
}
