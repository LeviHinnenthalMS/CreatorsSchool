import { DEFAULT_LANG } from './i18n'
import { stegaClean } from 'next-sanity'

type ResolvableDoc = {
	_type?: string
	metadata?: {
		slug?: { current?: string | null } | null
	} | null
}

export default function resolveUrl(
	page?: ResolvableDoc | null,
	{
		base = false,
		params,
		language,
	}: {
		base?: boolean
		params?: string
		language?: string
	} = {},
) {
	const lang = language && language !== DEFAULT_LANG ? `/${language}` : ''
	const slug = page?.metadata?.slug?.current
	const path = slug === 'index' ? null : slug

	return [
		base && process.env.NEXT_PUBLIC_BASE_URL,
		lang,
		'/',
		path,
		stegaClean(params),
	]
		.filter(Boolean)
		.join('')
}
