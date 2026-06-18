import { notFound } from 'next/navigation'
import Modules from '@/ui/modules'
import processMetadata from '@/lib/processMetadata'
import { processSlug } from '@/lib/processSlug'
import { client } from '@/sanity/lib/client'
import { fetchSanityLive } from '@/sanity/lib/fetch'
import { PAGE_QUERY, PAGE_SLUGS_QUERY } from '@/sanity/lib/queries'
import type { PAGE_QUERY_RESULT } from '@/sanity/types'

export default async function Page({ params }: Props) {
	const page = await getPage(await params)
	if (!page) notFound()
	return <Modules modules={page.modules} page={page} />
}

export async function generateMetadata({ params }: Props) {
	const page = await getPage(await params)
	if (!page) notFound()
	return processMetadata(page)
}

export async function generateStaticParams() {
	const slugs = await client.fetch<{ slug: string }[]>(PAGE_SLUGS_QUERY)
	return slugs.map(({ slug }) => ({ slug: slug.split('/') }))
}

async function getPage(params: Params) {
	const { slug, lang } = processSlug(params.slug)

	return await fetchSanityLive<PAGE_QUERY_RESULT>({
		query: PAGE_QUERY,
		params: { slug, lang },
	})
}

type Params = { slug?: string[] }

type Props = {
	params: Promise<Params>
}
