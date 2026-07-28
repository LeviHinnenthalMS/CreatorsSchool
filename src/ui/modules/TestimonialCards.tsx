'use client'

import moduleProps from '@/lib/moduleProps'
import SectionHead from '@/ui/creators/SectionHead'
import { Icon } from '@/ui/creators/Icon'
import { useRef } from 'react'
import type { SanityModule } from '@/sanity/typeHelpers'

type Testimonial = {
	_id?: string
	author?: { name?: string | null; role?: string | null } | null
	content?: unknown
}

type Block = {
	_type?: string
	children?: Array<{ text?: string; marks?: string[] }>
}

type Props = SanityModule & {
	eyebrow?: string | null
	title?: Block[] | null
	tagline?: string | null
	testimonials?: Array<{
		_key?: string
		items?: Testimonial[] | null
	} | null> | null
}

function plainText(node: unknown): string {
	if (!Array.isArray(node)) return ''
	return node
		.map((block) => {
			if (
				typeof block === 'object' &&
				block &&
				Array.isArray((block as { children?: unknown[] }).children)
			) {
				return ((block as { children: { text?: string }[] }).children || [])
					.map((c) => c.text || '')
					.join('')
			}
			return ''
		})
		.join('\n')
		.trim()
}

function Attribution({ author }: { author?: Testimonial['author'] }) {
	if (!author?.name && !author?.role) return null

	return (
		<footer className="mt-7 flex items-start gap-3">
			<span aria-hidden className="bg-coral mt-[0.65em] h-px w-8 shrink-0" />
			<div>
				{author.name && (
					<p className="text-ink m-0 text-[15px] font-semibold">
						{author.name}
					</p>
				)}
				{author.role && (
					<p className="text-mute mt-1 text-[12.5px] leading-relaxed">
						{author.role}
					</p>
				)}
			</div>
		</footer>
	)
}

export default function TestimonialCards(props: Props) {
	const trackRef = useRef<HTMLUListElement>(null)
	const items: Testimonial[] = (props.testimonials ?? [])
		.flatMap((t) => t?.items ?? [])
		.filter(Boolean) as Testimonial[]

	if (!items.length) return null

	function scroll(direction: 1 | -1) {
		const track = trackRef.current
		if (!track) return
		const slide = track.querySelector<HTMLElement>('[data-slide]')
		track.scrollBy({
			left: direction * (slide?.offsetWidth ?? track.clientWidth),
			behavior: 'smooth',
		})
	}

	return (
		<section {...moduleProps(props)} className="py-[clamp(44px,9vw,130px)]">
			<div className="wrap">
				<SectionHead
					eyebrow={props.eyebrow}
					title={props.title}
					tagline={props.tagline}
				/>

				<ul
					ref={trackRef}
					role="region"
					aria-roledescription="carousel"
					aria-label="Stimmen aus der Schule"
					tabIndex={0}
					onKeyDown={(event) => {
						if (event.key === 'ArrowRight') scroll(1)
						if (event.key === 'ArrowLeft') scroll(-1)
					}}
					className="border-line-2 divide-line-2 m-0 flex [scrollbar-width:none] list-none divide-x overflow-x-auto border-y p-0 [&::-webkit-scrollbar]:hidden"
					style={{ scrollSnapType: 'x mandatory' }}
				>
					{items.map((testimonial, index) => (
						<li
							key={testimonial._id ?? index}
							data-slide
							className="w-[88%] shrink-0 px-6 py-9 sm:w-[60%] sm:px-9 lg:w-[42%] lg:px-[clamp(36px,4vw,64px)] lg:py-12 xl:w-[36%]"
							style={{ scrollSnapAlign: 'start' }}
						>
							<article className="flex h-full flex-col">
								<span
									aria-hidden
									className="text-coral font-display block h-7 text-[64px] leading-[0.62] italic"
								>
									&ldquo;
								</span>
								<blockquote className="text-ink font-display m-0 mt-5 text-[clamp(20px,2vw,27px)] leading-[1.3] font-medium -tracking-[0.01em]">
									{plainText(testimonial.content)}
								</blockquote>
								<Attribution author={testimonial.author} />
							</article>
						</li>
					))}
				</ul>

				<div className="mt-5 flex justify-end gap-3">
					<button
						type="button"
						onClick={() => scroll(-1)}
						className="bg-paper border-line hover:bg-paper-2 focus-visible:outline-coral grid size-11 place-items-center rounded-full border transition-colors focus-visible:outline-2 focus-visible:outline-offset-2"
						aria-label="Vorherige Stimme"
					>
						<Icon
							name="arrow"
							size={14}
							strokeWidth={2.5}
							className="rotate-180"
						/>
					</button>
					<button
						type="button"
						onClick={() => scroll(1)}
						className="bg-paper border-line hover:bg-paper-2 focus-visible:outline-coral grid size-11 place-items-center rounded-full border transition-colors focus-visible:outline-2 focus-visible:outline-offset-2"
						aria-label="Nächste Stimme"
					>
						<Icon name="arrow" size={14} strokeWidth={2.5} />
					</button>
				</div>
			</div>
		</section>
	)
}
