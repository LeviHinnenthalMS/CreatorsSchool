import JsonLd from '@/ui/JsonLd'
import type { PerformanceDetail } from '@/sanity/lib/creators'

function youtubeId(url?: string | null): string | null {
	if (!url) return null
	try {
		const parsed = new URL(url)
		const host = parsed.hostname.replace(/^www\./, '')
		if (host === 'youtu.be') return parsed.pathname.split('/').filter(Boolean)[0] || null
		if (host.endsWith('youtube.com')) {
			return (
				parsed.searchParams.get('v') ||
				parsed.pathname.match(/^\/(?:embed|shorts)\/([^/]+)/)?.[1] ||
				null
			)
		}
	} catch {
		return null
	}
	return null
}

type Props = {
	performance: PerformanceDetail
	url: string
	lang: string
}

export default function PerformanceStructuredData({
	performance,
	url,
	lang,
}: Props) {
	const graph: Array<Record<string, unknown>> = []

	const image = performance.metadata?.ogimage || undefined
	const description =
		performance.metadata?.description ||
		performance.lead ||
		performance.description ||
		undefined

	if (performance.title && performance.startDate) {
		graph.push({
			'@context': 'https://schema.org',
			'@type': 'Event',
			name: performance.title,
			startDate: performance.startDate,
			eventStatus: 'https://schema.org/EventScheduled',
			eventAttendanceMode: 'https://schema.org/OfflineEventAttendanceMode',
			location: performance.venue
				? { '@type': 'Place', name: performance.venue }
				: undefined,
			description,
			image,
			url,
			inLanguage: performance.language || lang,
		})
	}

	const ytId = youtubeId(performance.videoUrl)
	if (ytId) {
		graph.push({
			'@context': 'https://schema.org',
			'@type': 'VideoObject',
			name: performance.title || 'Performance video',
			description: description || performance.title || undefined,
			thumbnailUrl: `https://img.youtube.com/vi/${ytId}/maxresdefault.jpg`,
			embedUrl: `https://www.youtube-nocookie.com/embed/${ytId}`,
			uploadDate: performance._updatedAt || performance.startDate || undefined,
			contentUrl: `https://www.youtube.com/watch?v=${ytId}`,
			inLanguage: performance.language || lang,
		})
	}

	if (graph.length === 0) return null
	return <JsonLd value={graph.length === 1 ? graph[0] : graph} />
}
