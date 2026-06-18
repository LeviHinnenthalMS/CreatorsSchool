import { PortableText } from 'next-sanity'
import moduleProps from '@/lib/moduleProps'
import { getQuoteStyle } from '@/lib/quotes'
import { Img } from '@/ui/Img'
import { cn } from '@/lib/utils'
import type { SanityModule } from '@/sanity/typeHelpers'
import type { Testimonial } from '@/sanity/types'

export default function TestimonialFeatured({
	testimonial,
	...props
}: Partial<{
	testimonial: Testimonial
}> &
	SanityModule) {
	if (!testimonial) return null

	const { author, content, language } = testimonial
	const hasContent = !!content?.length
	const hasImage = !!author?.image?.asset

	if (!hasContent && !author?.name) return null

	const quoteVars = getQuoteStyle(language)

	return (
		<section className="bg-canvas section-pad-medium" {...moduleProps(props)}>
			<div className="mx-auto w-full max-w-xxlarge px-8 max-md:px-4">
				<figure
					className={cn(
						'bg-canvas-muted flex overflow-hidden rounded-lg',
						hasImage
							? 'flex-col md:flex-row md:items-stretch'
							: 'flex-col items-stretch',
					)}
				>
					<div className="flex flex-1 flex-col items-start justify-center gap-8 p-8 md:p-12 lg:p-16">
						<div className="flex w-full flex-col items-start gap-6">
{hasContent && (
								<blockquote
									style={quoteVars}
									className="font-display text-h3 text-ink w-full text-balance leading-tight font-medium tracking-[-0.01em] [&_p:first-of-type]:before:content-[var(--quote-open)] [&_p:last-of-type]:after:content-[var(--quote-close)]"
								>
									<PortableText value={content} />
								</blockquote>
							)}
						</div>

						{author?.name && (
							<figcaption className="text-ink text-medium leading-7 font-semibold">
								<span>{`- ${author.name}`}</span>
								{author.role && (
									<span className="text-ink-muted">, {author.role}</span>
								)}
							</figcaption>
						)}
					</div>

					{hasImage && (
						<div className="relative shrink-0 max-md:aspect-[4/3] max-md:w-full md:h-auto md:min-h-112 md:w-120 md:self-stretch">
							<Img
								className="absolute inset-0 size-full object-cover"
								image={author.image}
								width={960}
								alt={
									[author?.name, author?.role].filter(Boolean).join(', ') ||
									'Testimonial author'
								}
							/>
						</div>
					)}
				</figure>
			</div>
		</section>
	)
}
