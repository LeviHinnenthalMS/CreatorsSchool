import { BLOG_DIR } from './env'
import { DEFAULT_LANG } from './i18n'
import { stegaClean } from 'next-sanity'

type ResolvableDoc = {
	_type?: string
	metadata?: {
		slug?: { current?: string | null } | null
	} | null
}

function segmentFor(type?: string) {
	if (type === 'blog.post') return `/${BLOG_DIR}/`
	return '/'
}

export default function resolveUrl(
	page?: ResolvableDoc | null,
	{
		base = true,
		params,
		language,
	}: {
		base?: boolean
		params?: string
		language?: string
	} = {},
) {
	const segment = segmentFor(page?._type)
	const lang = language && language !== DEFAULT_LANG ? `/${language}` : ''
	const slug = page?.metadata?.slug?.current
	const path = slug === 'index' ? null : slug

	return [
		base && process.env.NEXT_PUBLIC_BASE_URL,
		lang,
		segment,
		path,
		stegaClean(params),
	]
		.filter(Boolean)
		.join('')
}
