const TYPE_PREFIX: Record<string, string> = {
	performance: 'performances/',
	offering: 'angebote/',
}

export default function resolveSlug({
	_type,
	internal,
	params,
	external,
}: {
	_type?: string
	internal?: string
	params?: string
	external?: string
}) {
	if (external) return external

	if (internal) {
		const prefix = (_type && TYPE_PREFIX[_type]) || ''
		const path =
			internal === 'index'
				? null
				: prefix && !internal.startsWith(prefix)
					? `${prefix}${internal}`
					: internal
		return ['/', path, params].filter(Boolean).join('')
	}

	return undefined
}
