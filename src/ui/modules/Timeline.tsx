'use client'
import { useEffect, useRef } from 'react'
import moduleProps from '@/lib/moduleProps'
import Eyebrow from '@/ui/creators/Eyebrow'
import RichTitle from '@/ui/creators/RichTitle'
import { cn } from '@/lib/utils'
import type { SanityModule } from '@/sanity/typeHelpers'

type TimelineItem = {
	_key?: string
	year?: string | null
	title?: any
	text?: string | null
}

type Props = SanityModule & {
	eyebrow?: string | null
	title?: any
	intro?: string | null
	items?: TimelineItem[] | null
}

export default function Timeline({ eyebrow, title, intro, items, ...props }: Props) {
	const ref = useRef<HTMLElement>(null)

	useEffect(() => {
		const els = ref.current?.querySelectorAll<HTMLElement>('[data-tl-item]')
		if (!els?.length) return
		const io = new IntersectionObserver(
			(entries) =>
				entries.forEach((e) => {
					if (e.isIntersecting) {
						;(e.target as HTMLElement).style.opacity = '1'
						;(e.target as HTMLElement).style.transform = 'translateY(0)'
						io.unobserve(e.target)
					}
				}),
			{ threshold: 0.12 },
		)
		els.forEach((el) => io.observe(el))
		return () => io.disconnect()
	}, [])

	if (!items?.length) return null

	return (
		<section
			ref={ref}
			{...moduleProps(props)}
			className="wrap py-[clamp(60px,8vw,120px)]"
		>
			{/* Header */}
			<div className="mb-[clamp(56px,7vw,96px)] grid items-end gap-10 lg:grid-cols-2 lg:gap-20">
				<div>
					{eyebrow && <Eyebrow tone="coral">{eyebrow}</Eyebrow>}
					{title && (
						<RichTitle
							title={title}
							tone="coral"
							as="h2"
							className="mt-3 !text-[clamp(2.6rem,5vw,4rem)] leading-[1.03] -tracking-[0.025em]"
						/>
					)}
				</div>
				{intro && (
					<p className="text-ink-2 max-w-[42ch] text-[15.5px] leading-[1.7] lg:pb-2">
						{intro}
					</p>
				)}
			</div>

			{/* Timeline */}
			<div className="relative">
				{/* Continuous dashed line */}
				<div
					aria-hidden
					className="border-line absolute top-[10px] bottom-4 left-[calc(clamp(64px,8vw,96px)+20px)] w-px border-l-2 border-dashed"
				/>

				<div className="flex flex-col gap-[clamp(36px,5vw,56px)]">
					{items.map((item, i) => (
						<div
							key={item._key ?? i}
							data-tl-item
							className="grid items-start"
							style={{
								gridTemplateColumns: `clamp(64px,8vw,96px) 40px 1fr`,
								opacity: 0,
								transform: 'translateY(20px)',
								transition: `opacity 0.55s ease ${i * 90}ms, transform 0.55s ease ${i * 90}ms`,
							}}
						>
							{/* Year */}
							<span className="font-display text-coral pt-0.5 text-right text-[clamp(18px,2.2vw,26px)] font-bold leading-none">
								{item.year}
							</span>

							{/* Dot */}
							<div className="relative flex justify-center pt-[3px]">
								<span className="bg-coral relative z-10 size-3 rounded-full" />
							</div>

							{/* Content */}
							<div className="pb-2">
								{item.title && (
									<RichTitle
										title={item.title}
										tone="coral"
										as="h3"
										className="!text-[clamp(15px,1.6vw,18px)] font-bold leading-snug -tracking-[0.01em]"
									/>
								)}
								{item.text && (
									<p className="text-ink-2 mt-2 max-w-[52ch] text-[14.5px] leading-[1.65]">
										{item.text}
									</p>
								)}
							</div>
						</div>
					))}
				</div>
			</div>
		</section>
	)
}
