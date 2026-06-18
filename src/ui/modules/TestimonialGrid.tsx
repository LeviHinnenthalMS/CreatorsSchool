import moduleProps from '@/lib/moduleProps'
import { getQuoteStyle } from '@/lib/quotes'
import CTAList from '@/ui/CTAList'
import { Img } from '@/ui/Img'
import MobileScrollCarousel from '@/ui/MobileScrollCarousel'
import ModuleHeader from '@/ui/ModuleHeader'
import { PortableText } from 'next-sanity'
import { cn } from '@/lib/utils'
import type { Testimonial } from '@/sanity/types'
import type { SanityCTA, SanityModule } from '@/sanity/typeHelpers'

const COLUMN_COUNT = 3
const MAX_TESTIMONIALS = 9

type TestimonialGridEntry = {
	_key?: string
	_type?: string
	items?: (Testimonial | null)[] | null
}

export default function TestimonialGrid({
	title,
	intro,
	testimonials,
	ctas,
	...props
}: Partial<{
	title: string
	intro: any
	testimonials: TestimonialGridEntry[]
	ctas: SanityCTA[]
}> &
	SanityModule) {
	const flat: Testimonial[] = []
	const seen = new Set<string>()
	for (const entry of testimonials ?? []) {
		for (const t of entry?.items ?? []) {
			if (!t || !t._id || seen.has(t._id)) continue
			seen.add(t._id)
			flat.push(t)
		}
	}

	const visible = flat.slice(0, MAX_TESTIMONIALS)
	if (!visible.length) return null

	const columns: Testimonial[][] = Array.from(
		{ length: COLUMN_COUNT },
		() => [],
	)
	visible.forEach((t, i) => {
		columns[i % COLUMN_COUNT].push(t)
	})

	return (
		<section className="overflow-hidden" {...moduleProps(props)}>
			<div className="section-pad-medium mx-auto flex max-w-xxlarge flex-col items-center gap-module-gap px-8 max-md:px-4">
				<ModuleHeader title={title} intro={intro}>
					<CTAList ctas={ctas} className="!mt-2 justify-center gap-3" />
				</ModuleHeader>

				<MobileScrollCarousel
					className="w-full md:hidden"
					listClassName="carousel no-scrollbar max-md:full-bleed w-full gap-4 px-4 pb-2"
					listStyle={{ '--size': 'min(20rem, 80vw)' } as React.CSSProperties}
					label="Testimonials"
				>
					{visible.map((testimonial, i) => (
						<li
							key={`m-${testimonial._id ?? i}`}
							className="h-full"
							data-slide
						>
							<TestimonialCard testimonial={testimonial} />
						</li>
					))}
				</MobileScrollCarousel>

				<div
					className="hidden w-full grid-cols-3 gap-6 md:grid"
					style={{
						maskImage:
							'linear-gradient(to bottom, black calc(100% - 340px), transparent)',
						WebkitMaskImage:
							'linear-gradient(to bottom, black calc(100% - 340px), transparent)',
					}}
				>
					{columns.map((column, columnIndex) => (
						<div
							key={columnIndex}
							className={cn(
								'flex flex-col gap-6',
								columnIndex === 0 && 'py-8',
								columnIndex === 2 && 'pt-10',
							)}
						>
							{column.map((testimonial, i) => (
								<TestimonialCard
									key={`${columnIndex}-${i}`}
									testimonial={testimonial}
								/>
							))}
						</div>
					))}
				</div>
			</div>
		</section>
	)
}

function TestimonialCard({ testimonial }: { testimonial: Testimonial }) {
	const author = testimonial.author

	return (
		<figure className="border-border flex h-fit md:h-full flex-col justify-between gap-4 rounded-md border p-6 md:gap-5 md:p-8">
			<blockquote
				style={getQuoteStyle(testimonial.language)}
				className="richtext text-ink text-small leading-relaxed [&_p:first-of-type]:before:content-[var(--quote-open)] [&_p:last-of-type]:after:content-[var(--quote-close)]"
			>
				<PortableText value={testimonial.content} />
			</blockquote>

			{author && (
				<figcaption className="flex items-center gap-3">
					{author.image && (
						<Img
							className="size-12 shrink-0 rounded-full object-cover"
							image={author.image}
							width={96}
							height={96}
							alt={
								[author.name, author.role]
									.filter(Boolean)
									.join(', ') || 'Author'
							}
						/>
					)}
					<div className="flex flex-col text-start">
						{author.name && (
							<span className="text-ink text-regular font-semibold">
								{author.name}
							</span>
						)}
						{author.role && (
							<span className="text-ink-muted text-small">
								{author.role}
							</span>
						)}
					</div>
				</figcaption>
			)}
		</figure>
	)
}
