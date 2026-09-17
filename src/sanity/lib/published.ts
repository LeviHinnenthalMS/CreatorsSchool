import { client } from './client'
import type { QueryParams } from 'next-sanity'

/** Public discovery documents must never inherit Studio draft mode or stega. */
export function fetchPublished<T>({
	query,
	params = {},
	tags,
}: {
	query: string
	params?: QueryParams
	tags: string[]
}) {
	return client.fetch<T>(query, params, {
		perspective: 'published',
		stega: false,
		useCdn: false,
		next: { revalidate: 3600, tags },
	})
}
