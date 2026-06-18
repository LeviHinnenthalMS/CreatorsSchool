import { useQueryState } from 'nuqs'
import { create } from 'zustand'
import { fetchSanityLive } from '@/sanity/lib/fetch'
import { SEARCH_QUERY } from '@/sanity/lib/queries'
import type { SEARCH_QUERY_RESULT } from '@/sanity/types'

export type SearchScope = 'all' | 'pages' | 'path' | 'blog posts' | undefined

type SearchResults = SEARCH_QUERY_RESULT

export const useQuery = () => {
	const [query, setQuery] = useQueryState('query', {
		defaultValue: '',
	})

	return { query, setQuery }
}

export const searchStore = create<{
	loading: boolean
	setLoading: (loading: boolean) => void
	results: SearchResults
	setResults: (results: SearchResults) => void
}>((set) => ({
	loading: false,
	setLoading: (loading) => set({ loading }),
	results: [],
	setResults: (results) => set({ results }),
}))

export async function handleSearch({
	query,
	scope,
	path,
	setQuery,
	setLoading,
	setResults,
}: {
	query: string
	scope: SearchScope
	path?: string
	setQuery: (query: string) => void
	setLoading: (loading: boolean) => void
	setResults: (results: SearchResults) => void
}) {
	if (!query) setResults([])

	setQuery(query)
	setLoading(true)
	setResults([])

	const results = await fetchSanityLive<SearchResults>({
		query: SEARCH_QUERY,
		params: {
			query: `*${query}*` as any,
			scope: scope ?? 'all',
			path: path ?? '',
		},
	})

	setLoading(false)
	setResults(results)
}
