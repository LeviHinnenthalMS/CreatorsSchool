'use client'

import {
	useCallback,
	useEffect,
	useRef,
	useState,
	type CSSProperties,
	type ReactNode,
} from 'react'
import CarouselNavButton from '@/ui/CarouselNavButton'
import { cn } from '@/lib/utils'

type Props = {
	children: ReactNode
	/** Classes on the inner scrollable `<ul>` (carousel utility, gap, padding). */
	listClassName?: string
	/** Inline styles on the inner `<ul>` (typically CSS vars like `--size`). */
	listStyle?: CSSProperties
	/** Accessible label for the carousel region. */
	label?: string
	/** Classes on the wrapping `<div>` (visibility, margin). */
	className?: string
	/** Classes on the row containing the arrows. */
	navClassName?: string
}

/**
 * Mobile-only scroll-snap carousel with shared previous/next arrows beneath
 * the track. Touch users can still swipe directly (CSS scroll-snap is
 * untouched); arrows are the keyboard / screen-reader path. Wraps a server-
 * rendered list of items as children.
 */
export default function MobileScrollCarousel({
	children,
	listClassName,
	listStyle,
	label = 'Carousel',
	className,
	navClassName,
}: Props) {
	const trackRef = useRef<HTMLUListElement>(null)
	const [canPrev, setCanPrev] = useState(false)
	const [canNext, setCanNext] = useState(false)

	const update = useCallback(() => {
		const track = trackRef.current
		if (!track) return
		const { scrollLeft, scrollWidth, clientWidth } = track
		setCanPrev(scrollLeft > 1)
		setCanNext(scrollLeft + clientWidth < scrollWidth - 1)
	}, [])

	useEffect(() => {
		const track = trackRef.current
		if (!track) return
		update()
		track.addEventListener('scroll', update, { passive: true })
		window.addEventListener('resize', update)
		return () => {
			track.removeEventListener('scroll', update)
			window.removeEventListener('resize', update)
		}
	}, [update])

	const scroll = (direction: 1 | -1) => {
		const track = trackRef.current
		if (!track) return
		const card = track.querySelector<HTMLElement>('[data-slide]')
		const step = card ? card.getBoundingClientRect().width : track.clientWidth
		track.scrollBy({ left: step * direction, behavior: 'smooth' })
	}

	return (
		<div className={cn('relative', className)}>
			<ul
				ref={trackRef}
				className={listClassName}
				style={listStyle}
				role="region"
				aria-roledescription="carousel"
				aria-label={label}
				tabIndex={0}
				onKeyDown={(e) => {
					if (e.key === 'ArrowRight') {
						e.preventDefault()
						scroll(1)
					} else if (e.key === 'ArrowLeft') {
						e.preventDefault()
						scroll(-1)
					}
				}}
			>
				{children}
			</ul>
			<div className={navClassName}>
				<CarouselNavButton
					direction="prev"
					onClick={() => scroll(-1)}
					disabled={!canPrev}
					className="absolute top-1/2 left-2 z-10 grid -translate-y-1/2 disabled:opacity-30!"
				/>
				<CarouselNavButton
					direction="next"
					onClick={() => scroll(1)}
					disabled={!canNext}
					className="absolute top-1/2 right-2 z-10 grid -translate-y-1/2 disabled:opacity-30!"
				/>
			</div>
		</div>
	)
}
