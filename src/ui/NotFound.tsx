import Modules from '@/ui/modules'
import NotFoundLayout from '@/ui/NotFoundLayout'
import { fetchSanityLive } from '@/sanity/lib/fetch'
import { NOT_FOUND_QUERY } from '@/sanity/lib/queries'
import { DEFAULT_LANG } from '@/lib/i18n'
import type { NOT_FOUND_QUERY_RESULT } from '@/sanity/types'

async function get404() {
	return await fetchSanityLive<NOT_FOUND_QUERY_RESULT>({
		query: NOT_FOUND_QUERY,
		params: { lang: DEFAULT_LANG },
	})
}

export default async function NotFound() {
	const page = await get404()
	if (!page) return <NotFoundLayout />
	return <Modules modules={page?.modules} />
}

export async function generateMetadata() {
	return (await get404())?.metadata
}
