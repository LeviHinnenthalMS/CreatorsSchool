import { stegaClean } from 'next-sanity'
import { dev } from './env'
import type { SanityModule } from '@/sanity/typeHelpers'

export default function ({
	_type,
	options,
	_key,
	...props
}: SanityModule) {
	const passthrough: Record<string, unknown> = {}
	for (const [key, value] of Object.entries(props)) {
		if (key.startsWith('data-') || key.startsWith('aria-')) {
			passthrough[key] = value
		}
	}
	return {
		id: stegaClean(options?.uid) || 'module-' + _key,
		'data-module': _type,
		hidden: (!dev && options?.hidden) || undefined,
		...passthrough,
	}
}
