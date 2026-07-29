import moduleProps from '@/lib/moduleProps'
import { Img } from '@/ui/Img'
import CTAList from '@/ui/CTAList'
import RichTitle from '@/ui/creators/RichTitle'
import type { SanityImage, SanityCTA, SanityModule } from '@/sanity/typeHelpers'

type TitleBlock = {
	_type?: string
	_key?: string
	children?: Array<{ text?: string; marks?: string[] }>
}

type Testimonial = {
	content?: unknown
	author?: { name?: string | null; role?: string | null } | null
}

type Props = SanityModule & {
	eyebrow?: string | null
	title?: TitleBlock[] | null
	sub?: string | null
	image?: SanityImage | null
	testimonial?: Testimonial | null
	ctas?: Array<SanityCTA | null> | null
	reviewTitle?: string | null
	reviewSubtitle?: string | null
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

const Stars = ({ className }: { className?: string }) => (
	<span className={className} role="img" aria-label="5 Sterne">
		{Array.from({ length: 5 }).map((_, i) => (
			<svg
				key={i}
				width="18"
				height="18"
				viewBox="0 0 20 20"
				fill="currentColor"
				className="text-coral inline-block"
				aria-hidden="true"
			>
				<path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
			</svg>
		))}
	</span>
)

export default function HeroCreators(props: Props) {
	const {
		eyebrow,
		title,
		sub,
		image,
		testimonial,
		ctas,
		reviewTitle,
		reviewSubtitle,
	} = props
	const quote = plainText(testimonial?.content)

	return (
		<section
			{...moduleProps(props)}
			className="relative overflow-hidden pt-[calc(var(--header-height)+clamp(20px,4vw,70px))] pb-[clamp(40px,7vw,100px)]"
		>
			<span
				aria-hidden
				className="bg-blush pointer-events-none absolute top-[8%] -left-[8%] size-[320px] rounded-full opacity-70 blur-[20px] max-lg:hidden"
			/>
			<span
				aria-hidden
				className="bg-warm-white pointer-events-none absolute right-[18%] -bottom-[8%] size-[280px] rounded-full opacity-90 blur-[30px] max-lg:hidden"
			/>

			<div className="wrap relative z-10">
				<div className="max-lg:bg-ink grid items-center gap-[clamp(2rem,4vw,3.5rem)] max-lg:relative max-lg:overflow-hidden max-lg:rounded-[28px] max-lg:px-[clamp(20px,4vw,48px)] max-lg:py-[clamp(44px,7vw,72px)] lg:grid-cols-[1.05fr_1fr]">
					<div className="max-lg:relative max-lg:z-10">
						{eyebrow && (
							<span className="bg-paper-2 border-line text-charcoal max-lg:border-paper/25 max-lg:bg-paper/12 max-lg:text-paper mb-5 inline-flex items-center gap-2.5 rounded-full border px-4.5 py-2 text-[13px] font-semibold max-lg:backdrop-blur-sm">
								<span className="bg-coral inline-block size-[7px] rounded-full shadow-[0_0_0_4px_var(--color-coral-tint)]" />
								{eyebrow}
							</span>
						)}

						<RichTitle
							title={title}
							as="h1"
							className="text-ink font-display max-lg:text-paper m-0 text-[clamp(40px,5vw,92px)] leading-[1] font-semibold tracking-[-0.02em]"
						/>

						{sub && (
							<p className="text-charcoal max-lg:text-paper/85 mt-5 max-w-[48ch] text-[clamp(15px,1.3vw,18.5px)] leading-relaxed lg:mt-7">
								{sub}
							</p>
						)}

						{ctas && ctas.length > 0 && (
							<CTAList
								ctas={ctas}
								className="mt-6 flex flex-wrap items-center gap-6 lg:mt-10"
								size="action"
								withArrow
							/>
						)}

						{(reviewTitle || reviewSubtitle) && (
							<div className="mt-5 flex flex-wrap items-center gap-3.5 lg:mt-9">
								<Stars />
								<div>
									{reviewTitle && (
										<div className="text-ink max-lg:text-paper text-[14.5px] font-semibold">
											{reviewTitle}
										</div>
									)}
									{reviewSubtitle && (
										<div className="text-mute max-lg:text-paper/70 text-[12.5px]">
											{reviewSubtitle}
										</div>
									)}
								</div>
							</div>
						)}
					</div>

					{/* One responsive hero image avoids duplicate eager downloads. */}
					{image && (
						<div className="relative mx-auto aspect-[4/5] min-h-[480px] w-full max-lg:absolute max-lg:inset-0 max-lg:z-0 max-lg:aspect-auto max-lg:min-h-0">
							<div className="from-blush to-warm-white border-line absolute inset-0 -z-10 translate-x-3.5 translate-y-3.5 rounded-[28px] border bg-gradient-to-br max-lg:hidden" />
							<div className="bg-ink absolute inset-0 overflow-hidden rounded-[28px] shadow-lg">
								<Img
									image={image}
									className="size-full object-cover max-lg:opacity-65"
									alt={image.alt || undefined}
									sizes="(min-width: 64rem) 50vw, 100vw"
									loading="eager"
									fetchPriority="high"
								/>
								<span
									aria-hidden
									className="from-ink/50 via-ink/25 to-ink/15 pointer-events-none absolute inset-0 bg-gradient-to-r lg:hidden"
								/>
							</div>

							{testimonial && quote && (
								<div className="bg-paper border-line absolute right-[-2%] bottom-[4%] z-10 max-w-[240px] rounded-[18px] border px-4.5 py-4 shadow-md max-lg:hidden">
									<Stars className="mb-2.5 flex gap-0.5" />
									<p className="text-ink text-[13px] leading-snug">„{quote}“</p>
									{testimonial.author?.name && (
										<p className="text-mute mt-2 text-[12px]">
											{testimonial.author.name}
											{testimonial.author.role &&
												` · ${testimonial.author.role}`}
										</p>
									)}
								</div>
							)}
						</div>
					)}
				</div>
			</div>
		</section>
	)
}
