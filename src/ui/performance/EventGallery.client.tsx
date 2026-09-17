'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import { ChevronLeft, ChevronRight, Download, X } from 'lucide-react'
import { stegaClean } from 'next-sanity'
import { Img } from '@/ui/Img'
import { urlFor } from '@/sanity/lib/image'
import { cn } from '@/lib/utils'
import type { EventPhoto } from '@/sanity/lib/creators'
import type { SanityImage } from '@/sanity/typeHelpers'

const spanCls: Record<string, string> = {
	normal: '',
	wide: 'sm:col-span-2',
	tall: 'sm:row-span-2',
	big: 'sm:col-span-2 sm:row-span-2',
}

type Labels = {
	close: string
	prev: string
	next: string
	download: string
}

type Props = {
	photos: EventPhoto[]
	labels?: Partial<Labels>
}

const DEFAULT_LABELS: Labels = {
	close: 'Schließen',
	prev: 'Vorheriges Foto',
	next: 'Nächstes Foto',
	download: 'Foto herunterladen',
}

function downloadHref(photo: EventPhoto) {
	const url = stegaClean(photo.downloadUrl || '')
	if (!url) return undefined
	const name = photo.filename || 'photo.jpg'
	return `${url}?dl=${encodeURIComponent(name)}`
}

function altFromFilename(filename?: string | null): string {
	if (!filename) return ''
	return filename
		.replace(/\.[^.]+$/, '')
		.replace(/[-_]+/g, ' ')
		.trim()
}

function resolveAlt(photo: EventPhoto): string {
	return photo.altText?.trim() || altFromFilename(photo.filename)
}

export default function EventGallery({ photos, labels: labelOverrides }: Props) {
	const labels = { ...DEFAULT_LABELS, ...labelOverrides }
	const [openIndex, setOpenIndex] = useState<number | null>(null)
	const dialogRef = useRef<HTMLDialogElement>(null)
	const touchStartX = useRef<number | null>(null)

	const open = useCallback((i: number) => setOpenIndex(i), [])
	const close = useCallback(() => setOpenIndex(null), [])
	const next = useCallback(
		() =>
			setOpenIndex((i) => (i === null ? null : (i + 1) % photos.length)),
		[photos.length],
	)
	const prev = useCallback(
		() =>
			setOpenIndex((i) =>
				i === null ? null : (i - 1 + photos.length) % photos.length,
			),
		[photos.length],
	)

	// Sync the native <dialog> open state with React state.
	useEffect(() => {
		const dialog = dialogRef.current
		if (!dialog) return
		if (openIndex !== null && !dialog.open) dialog.showModal()
		else if (openIndex === null && dialog.open) dialog.close()
	}, [openIndex])

	// Arrow-key navigation. Esc closing is native to <dialog>.
	useEffect(() => {
		if (openIndex === null) return
		const handler = (e: KeyboardEvent) => {
			if (e.key === 'ArrowRight') next()
			else if (e.key === 'ArrowLeft') prev()
		}
		window.addEventListener('keydown', handler)
		return () => window.removeEventListener('keydown', handler)
	}, [openIndex, next, prev])

	const current = openIndex !== null ? photos[openIndex] : null
	const bigSrc = current?.asset
		? urlFor(current as unknown as { asset: unknown })
				.width(1800)
				.auto('format')
				.url()
		: null

	return (
		<>
			<div
				className="grid grid-cols-1 gap-3.5 sm:grid-cols-2 lg:grid-cols-4"
				style={{ gridAutoFlow: 'dense' }}
			>
				{photos.map((photo, i) => {
					const span = stegaClean(photo.span || 'normal')
					const spansTwoColumns = span === 'wide' || span === 'big'
					const imageSizes = spansTwoColumns
						? '(min-width: 1024px) 50vw, (min-width: 640px) 100vw, 100vw'
						: '(min-width: 1024px) 25vw, (min-width: 640px) 50vw, 100vw'
					return (
						<button
							key={photo._key}
							type="button"
							onClick={() => open(i)}
							className={cn(
								'group bg-paper-2 relative m-0 cursor-zoom-in overflow-hidden rounded-[18px] border-0 p-0 focus-visible:outline-2 focus-visible:outline-offset-2',
								spanCls[span] || '',
							)}
							style={{
								minHeight: span === 'tall' || span === 'big' ? 480 : 240,
							}}
							aria-label={resolveAlt(photo) || undefined}
						>
							<Img
								image={photo as unknown as SanityImage}
								alt={resolveAlt(photo)}
								className="size-full object-cover motion-safe:transition-transform motion-safe:duration-300 motion-safe:group-hover:scale-[1.02]"
								sizes={imageSizes}
							/>
						</button>
					)
				})}
			</div>

			<dialog
				ref={dialogRef}
				onClose={close}
				onClick={(e) => {
					if (e.target === dialogRef.current) close()
				}}
				className="h-screen max-h-none w-screen max-w-none overflow-hidden bg-transparent p-0 backdrop:bg-black/85 backdrop:backdrop-blur-sm motion-safe:backdrop:transition-opacity"
			>
				{current && (
					<div
						className="grid h-full w-full grid-rows-[1fr_auto] text-white"
						onTouchStart={(e) => {
							touchStartX.current = e.touches[0]?.clientX ?? null
						}}
						onTouchEnd={(e) => {
							const start = touchStartX.current
							const end = e.changedTouches[0]?.clientX ?? null
							touchStartX.current = null
							if (start === null || end === null) return
							const delta = end - start
							if (Math.abs(delta) < 50) return
							if (delta < 0) next()
							else prev()
						}}
					>
						<div className="relative flex items-center justify-center p-4 md:p-10">
							{bigSrc && (
								<img
									key={openIndex}
									src={bigSrc}
									alt={resolveAlt(current)}
									className="max-h-full max-w-full object-contain motion-safe:transition-opacity motion-safe:duration-200"
								/>
							)}

							<button
								type="button"
								onClick={close}
								className="absolute top-4 right-4 grid size-11 place-items-center rounded-full bg-black/50 text-white backdrop-blur-md transition-colors hover:bg-black/70 focus-visible:outline-2 focus-visible:outline-offset-2 md:top-6 md:right-6"
								aria-label={labels.close}
							>
								<X className="size-5" aria-hidden />
							</button>

							{photos.length > 1 && (
								<>
									<button
										type="button"
										onClick={prev}
										className="absolute top-1/2 left-2 grid size-11 -translate-y-1/2 place-items-center rounded-full bg-black/50 text-white backdrop-blur-md transition-colors hover:bg-black/70 focus-visible:outline-2 focus-visible:outline-offset-2 md:left-4 md:size-14"
										aria-label={labels.prev}
									>
										<ChevronLeft className="size-6" aria-hidden />
									</button>
									<button
										type="button"
										onClick={next}
										className="absolute top-1/2 right-2 grid size-11 -translate-y-1/2 place-items-center rounded-full bg-black/50 text-white backdrop-blur-md transition-colors hover:bg-black/70 focus-visible:outline-2 focus-visible:outline-offset-2 md:right-4 md:size-14"
										aria-label={labels.next}
									>
										<ChevronRight className="size-6" aria-hidden />
									</button>
								</>
							)}
						</div>

						<div className="flex items-end justify-between gap-4 px-4 pb-6 md:px-10 md:pb-8">
							<div className="min-w-0 text-sm text-white/90 md:text-base">
								{current.captionText && (
									<p className="line-clamp-2">{current.captionText}</p>
								)}
								<p className="text-xs text-white/60 md:text-sm">
									{(openIndex ?? 0) + 1} / {photos.length}
								</p>
							</div>
							{downloadHref(current) && (
								<a
									href={downloadHref(current)}
									download={current.filename || undefined}
									className="text-ink inline-flex shrink-0 items-center gap-2 rounded-full bg-white/95 px-4 py-2 text-sm font-medium transition-colors hover:bg-white focus-visible:outline-2 focus-visible:outline-offset-2 md:px-5 md:py-2.5"
								>
									<Download className="size-4" aria-hidden />
									<span>{labels.download}</span>
								</a>
							)}
						</div>
					</div>
				)}
			</dialog>
		</>
	)
}
