/**
 * Parse common YouTube URL shapes (watch?v=, youtu.be, /embed/, /shorts/)
 * and return a ready-to-embed iframe `src`. Returns `null` if the input
 * isn't recognizable.
 *
 * TODO: GDPR — the resulting iframe sets YouTube tracking cookies on load.
 * It MUST be blocked behind a consent gate (click-to-load or cookie banner)
 * before production. Until then, do not ship to EU users without consent UI.
 */
export function buildYouTubeEmbedSrc(url: string): string | null {
	if (!url) return null

	try {
		const parsed = new URL(url)
		const host = parsed.hostname.replace(/^www\./, '')

		let id: string | null = null

		if (host === 'youtu.be') {
			id = parsed.pathname.slice(1) || null
		} else if (host.endsWith('youtube.com')) {
			if (parsed.pathname === '/watch') {
				id = parsed.searchParams.get('v')
			} else if (parsed.pathname.startsWith('/embed/')) {
				id = parsed.pathname.slice('/embed/'.length).split('/')[0] || null
			} else if (parsed.pathname.startsWith('/shorts/')) {
				id = parsed.pathname.slice('/shorts/'.length).split('/')[0] || null
			}
		}

		if (!id) return null

		const embedUrl = new URL(`https://www.youtube.com/embed/${id}`)
		embedUrl.searchParams.set('rel', '0')
		embedUrl.searchParams.set('playsinline', '1')
		return embedUrl.toString()
	} catch {
		return null
	}
}
