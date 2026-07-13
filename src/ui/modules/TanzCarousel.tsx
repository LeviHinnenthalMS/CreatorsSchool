'use client'

import { useRef } from 'react'
import Link from 'next/link'
import { Icon } from '@/ui/creators/Icon'
import type { OfferingListItem } from '@/sanity/lib/creators'

type Props = {
	items: OfferingListItem[]
	cardCtaLabel?: string | null
	ctaTileHref?: string | null
	ctaTileTitle?: string | null
	ctaTileText?: string | null
	ctaTileLinkLabel?: string | null
}

export default function TanzCarousel({ items, cardCtaLabel, ctaTileHref, ctaTileTitle, ctaTileText, ctaTileLinkLabel }: Props) {
	const ref = useRef<HTMLDivElement>(null)

	function scroll(dir: 1 | -1) {
		if (!ref.current) return
		const card = ref.current.querySelector<HTMLElement>('[data-slide]')
		const width = (card?.offsetWidth ?? 300) + 18
		ref.current.scrollBy({ left: dir * width, behavior: 'smooth' })
	}

	return (
		<div>
			<div
				ref={ref}
				className="flex gap-[18px] overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
				style={{ scrollSnapType: 'x mandatory' }}
			>
				{items.map((o) => (
					<Link
						key={o._id}
						href={o.slug ? `/angebote/${o.slug}` : '#'}
						data-slide
						className="bg-paper border-line hover:border-coral-soft flex min-h-[230px] w-[80vw] shrink-0 flex-col gap-3 rounded-card-sm border px-7 py-7 no-underline transition-[transform,border-color] duration-300 hover:-translate-y-1 sm:w-[calc(50%-9px)] lg:w-[calc(33.333%-12px)]"
						style={{ scrollSnapAlign: 'start' }}
					>
						{o.facts?.[0]?.value && (
							<span className="text-coral-deep bg-blush font-display self-start rounded-full px-3.5 py-1 text-[14px] font-semibold italic">
								{o.facts[0].value}
							</span>
						)}
						{o.title && (
							<h3 className="text-ink font-display m-0 text-[23px] font-semibold leading-tight -tracking-[0.015em]">
								{o.title}
							</h3>
						)}
						{o.lede && (
							<p className="text-charcoal m-0 text-[14.5px] leading-relaxed">
								{o.lede}
							</p>
						)}
						{cardCtaLabel && (
							<span className="text-coral-deep mt-auto inline-flex items-center gap-2 pt-4 text-[13.5px] font-semibold">
								{cardCtaLabel}
								<Icon name="arrow" size={13} strokeWidth={2.5} />
							</span>
						)}
					</Link>
				))}

				{ctaTileHref && (
					<Link
						href={ctaTileHref}
						data-slide
						className="bg-ink text-paper rounded-card-sm flex min-h-[230px] w-[80vw] shrink-0 flex-col justify-center gap-3 px-7 py-7 no-underline sm:w-[calc(50%-9px)] lg:w-[calc(33.333%-12px)]"
						style={{ scrollSnapAlign: 'start' }}
					>
						{ctaTileTitle && (
							<h3 className="text-paper font-display m-0 text-[26px] font-semibold leading-tight -tracking-[0.015em]">
								{ctaTileTitle}
							</h3>
						)}
						{ctaTileText && (
							<p className="text-paper/70 m-0 text-[14.5px]">{ctaTileText}</p>
						)}
						{ctaTileLinkLabel && (
							<span className="text-coral-soft mt-2 inline-flex items-center gap-2 text-[13.5px] font-semibold">
								{ctaTileLinkLabel}
								<Icon name="arrow" size={13} strokeWidth={2.5} />
							</span>
						)}
					</Link>
				)}
			</div>

			<div className="mt-5 flex items-center gap-3">
				<button
					onClick={() => scroll(-1)}
					className="bg-paper border-line hover:bg-paper-2 grid size-10 place-items-center rounded-full border transition-colors"
					aria-label="Zurück"
				>
					<Icon name="arrow" size={14} strokeWidth={2.5} className="rotate-180" />
				</button>
				<button
					onClick={() => scroll(1)}
					className="bg-paper border-line hover:bg-paper-2 grid size-10 place-items-center rounded-full border transition-colors"
					aria-label="Weiter"
				>
					<Icon name="arrow" size={14} strokeWidth={2.5} />
				</button>
			</div>
		</div>
	)
}
