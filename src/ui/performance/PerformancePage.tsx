import { stegaClean } from 'next-sanity'
import { Download, Film } from 'lucide-react'
import EventGallery from './EventGallery.client'
import type { PerformanceDetail } from '@/sanity/lib/creators'

function youtubeEmbedUrl(value?: string | null): string | null {
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
	} catch {
		return null
	}
	return null
}

function formatBytes(bytes?: number | null): string | null {
	if (!bytes) return null
	if (bytes < 1024 * 1024) return `${Math.round(bytes / 1024)} KB`
	if (bytes < 1024 * 1024 * 1024)
		return `${Math.round(bytes / (1024 * 1024))} MB`
	return `${(bytes / (1024 * 1024 * 1024)).toFixed(1)} GB`
}

type Props = {
	performance: PerformanceDetail
	lang: string
}

export default function PerformancePage({ performance, lang }: Props) {
	const embedUrl = youtubeEmbedUrl(performance.videoUrl)
	const photos = performance.photos?.filter((p) => p?.asset) ?? []
	const zip = performance.photosZip
	const videoDownload = stegaClean(performance.videoDownloadUrl || '')
	const isUpcoming = performance.startDate
		? new Date(performance.startDate) > new Date()
		: false

	const galleryLabels =
		lang === 'en'
			? {
					close: 'Close',
					prev: 'Previous photo',
					next: 'Next photo',
					download: 'Download photo',
				}
			: undefined

	const zipDownloadLabel = lang === 'en' ? 'Download all photos (ZIP)' : 'Alle Fotos herunterladen (ZIP)'
	const videoDownloadLabel = lang === 'en' ? 'Download full video' : 'Video herunterladen'
	const downloadsHeading = lang === 'en' ? 'Downloads' : 'Downloads'
	const videoHeading = lang === 'en' ? 'Full recording' : 'Aufzeichnung'
	const photosHeading = lang === 'en' ? 'Photos' : 'Fotos'

	return (
		<article className="pb-[clamp(60px,8vw,120px)]">
			<header className="relative overflow-hidden pt-[calc(var(--header-height)+14px+clamp(42px,5vw,76px))] pb-[clamp(32px,4vw,60px)]">
				<span
					aria-hidden
					className="bg-coral-tint/70 pointer-events-none absolute -top-[24vw] -right-[16vw] -z-10 aspect-square w-[60vw] rounded-full blur-3xl"
				/>
				<div className="wrap">
					{performance.badgeSub && (
						<span className="eyebrow">
							<span className="eyebrow-pip" />
							{performance.badgeSub}
						</span>
					)}
					<h1 className="h-display text-ink mt-5 max-w-[18ch]">
						{performance.title}
					</h1>
					{(performance.dates || performance.venue) && (
						<p className="text-mute mt-5 text-[clamp(15px,1.2vw,17px)]">
							{[performance.dates, performance.venue]
								.filter(Boolean)
								.join(' · ')}
						</p>
					)}
					{performance.lead && (
						<p className="text-ink mt-7 max-w-[58ch] text-[clamp(18px,1.6vw,22px)] leading-relaxed font-medium">
							{performance.lead}
						</p>
					)}
					{performance.description && (
						<p className="text-charcoal mt-5 max-w-[58ch] text-[clamp(16px,1.4vw,18px)] leading-relaxed whitespace-pre-line">
							{performance.description}
						</p>
					)}
				</div>
			</header>

			{isUpcoming && performance.ticketInfo && (
				<section className="pb-[clamp(30px,4vw,60px)]">
					<div className="wrap">
						<div className="border-line bg-paper-2 rounded-[24px] border p-6 md:p-8">
							<p className="text-ink text-[clamp(15px,1.2vw,17px)] leading-relaxed whitespace-pre-line">
								{performance.ticketInfo}
							</p>
						</div>
					</div>
				</section>
			)}

			{embedUrl && (
				<section
					id="video"
					className="pt-[clamp(20px,3vw,40px)] pb-[clamp(40px,5vw,72px)]"
				>
					<div className="wrap">
						<h2 className="text-ink font-display mb-6 text-2xl font-semibold md:mb-8 md:text-3xl">
							{videoHeading}
						</h2>
						<div className="bg-ink overflow-hidden rounded-[20px]">
							<iframe
								src={embedUrl}
								title={performance.title || 'Performance video'}
								className="aspect-video w-full border-0"
								loading="lazy"
								allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
								allowFullScreen
							/>
						</div>
					</div>
				</section>
			)}

			{photos.length > 0 && (
				<section
					id="photos"
					className="pt-[clamp(20px,3vw,40px)] pb-[clamp(50px,6vw,90px)]"
				>
					<div className="wrap">
						<h2 className="text-ink font-display mb-6 text-2xl font-semibold md:mb-8 md:text-3xl">
							{photosHeading}
						</h2>
						<EventGallery photos={photos} labels={galleryLabels} />
					</div>
				</section>
			)}

			{(zip?.url || videoDownload) && (
				<section
					id="downloads"
					className="pt-[clamp(20px,3vw,40px)] pb-[clamp(40px,5vw,72px)]"
				>
					<div className="wrap">
						<h2 className="text-ink font-display mb-6 text-2xl font-semibold md:mb-8 md:text-3xl">
							{downloadsHeading}
						</h2>
						<div className="flex flex-col gap-4 sm:flex-row sm:flex-wrap">
							{zip?.url && (
								<a
									href={`${stegaClean(zip.url)}?dl=${encodeURIComponent(zip.filename || 'photos.zip')}`}
									download={zip.filename || undefined}
									className="bg-ink text-canvas inline-flex items-center gap-3 rounded-full px-6 py-3 text-[15px] font-medium transition-colors hover:bg-black focus-visible:outline-2 focus-visible:outline-offset-2 md:text-base"
								>
									<Download className="size-4" aria-hidden />
									<span>{zipDownloadLabel}</span>
									{formatBytes(zip.size) && (
										<span className="text-canvas/70 text-sm">
											({formatBytes(zip.size)})
										</span>
									)}
								</a>
							)}
							{videoDownload && (
								<a
									href={videoDownload}
									target="_blank"
									rel="noopener noreferrer"
									className="border-line text-ink hover:bg-paper-2 inline-flex items-center gap-3 rounded-full border bg-transparent px-6 py-3 text-[15px] font-medium transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 md:text-base"
								>
									<Film className="size-4" aria-hidden />
									<span>{videoDownloadLabel}</span>
								</a>
							)}
						</div>
					</div>
				</section>
			)}
		</article>
	)
}
