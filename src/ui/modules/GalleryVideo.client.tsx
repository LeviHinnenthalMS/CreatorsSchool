'use client'

import { useRef, useState } from 'react'
import { Play } from 'lucide-react'
import { stegaClean } from 'next-sanity'
import { cn } from '@/lib/utils'

type Props = {
	src: string
	mimeType?: string | null
	caption?: string | null
	hasPoster?: boolean
}

export default function GalleryVideo({
	src,
	mimeType,
	caption,
	hasPoster = false,
}: Props) {
	const videoRef = useRef<HTMLVideoElement>(null)
	const [hasStarted, setHasStarted] = useState(false)
	const cleanSrc = stegaClean(src)
	const cleanCaption = stegaClean(caption)

	const play = () => {
		void videoRef.current?.play()
	}

	return (
		<>
			<video
				ref={videoRef}
				className={cn(
					'bg-ink absolute inset-0 size-full object-cover transition-opacity duration-300',
					hasPoster && !hasStarted ? 'opacity-0' : 'opacity-100',
				)}
				controls={hasStarted}
				preload="metadata"
				playsInline
				onPlay={() => setHasStarted(true)}
				aria-label={cleanCaption || 'Gallery video'}
			>
				<source src={cleanSrc} type={mimeType || undefined} />
				Your browser does not support embedded video.
			</video>

			{!hasStarted && (
				<button
					type="button"
					onClick={play}
					className="group absolute inset-0 z-[3] grid cursor-pointer place-items-center border-0 bg-transparent"
					aria-label={
						cleanCaption
							? `Video abspielen: ${cleanCaption}`
							: 'Video abspielen'
					}
				>
					<span className="grid size-16 place-items-center rounded-full border border-white/35 bg-black/30 text-white shadow-[0_12px_36px_rgba(0,0,0,0.28)] backdrop-blur-md transition-[transform,background-color] duration-200 group-hover:scale-105 group-hover:bg-black/45 group-focus-visible:scale-105 group-focus-visible:outline-2 group-focus-visible:outline-offset-4 group-focus-visible:outline-white md:size-[72px]">
						<Play
							aria-hidden
							className="ml-1 size-7 fill-current md:size-8"
							strokeWidth={1.8}
						/>
					</span>
				</button>
			)}
		</>
	)
}
