import { DEFAULT_LANG } from './i18n'
import { stegaClean } from 'next-sanity'

type ResolvableDoc = {
	_type?: string
	metadata?: {
		slug?: { current?: string | null } | null
	} | null
}

const TYPE_PREFIX: Record<string, string> = {
	performance: 'performances/',
	offering: 'angebote/',
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
	const type = stegaClean(page?._type ?? '') as string
	const prefix = TYPE_PREFIX[type] || ''
	const rawPath = slug === 'index' ? null : slug
	const path = rawPath
		? prefix && !rawPath.startsWith(prefix)
			? `${prefix}${rawPath}`
			: rawPath
		: null

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
