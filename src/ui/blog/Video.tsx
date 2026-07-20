import { stegaClean } from 'next-sanity'

type VideoValue = {
	url?: string | null
	fileUrl?: string | null
	mimeType?: string | null
	caption?: string | null
}

function embedUrl(value?: string | null) {
	if (!value) return null
	try {
		const url = new URL(stegaClean(value))
		const host = url.hostname.replace(/^www\./, '')

		if (host === 'youtu.be') {
			const id = url.pathname.split('/').filter(Boolean)[0]
			return id ? `https://www.youtube-nocookie.com/embed/${id}` : null
		}
		if (host.endsWith('youtube.com')) {
			const id =
				url.searchParams.get('v') ||
				url.pathname.match(/^\/(?:embed|shorts)\/([^/]+)/)?.[1]
			return id ? `https://www.youtube-nocookie.com/embed/${id}` : null
		}
		if (host === 'vimeo.com' || host.endsWith('.vimeo.com')) {
			const id = url.pathname.split('/').filter(Boolean).find((part) => /^\d+$/.test(part))
			return id ? `https://player.vimeo.com/video/${id}` : null
		}
	} catch {
		return null
	}
	return null
}

export default function BlogVideo({ value }: { value: VideoValue }) {
	const source = stegaClean(value.fileUrl || value.url || '')
	const embed = embedUrl(value.url)
	if (!source && !embed) return null

	return (
		<figure className="my-10 space-y-3 md:[grid-column:bleed]!">
			<div className="bg-ink overflow-hidden rounded-[20px]">
				{embed ? (
					<iframe
						src={embed}
						title={value.caption || 'Video'}
						className="aspect-video w-full border-0"
						loading="lazy"
						allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
						allowFullScreen
					/>
				) : (
					<video className="aspect-video w-full" controls preload="metadata">
						<source src={source} type={value.mimeType || undefined} />
						Your browser does not support embedded video.
					</video>
				)}
			</div>
			{value.caption && (
				<figcaption className="text-mute text-center text-sm italic">
					{value.caption}
				</figcaption>
			)}
		</figure>
	)
}
