import moduleProps from '@/lib/moduleProps'
import { cn } from '@/lib/utils'
import { Img } from '@/ui/Img'
import { stegaClean } from 'next-sanity'
import { Icon } from '@/ui/creators/Icon'
import CTAs from '@/ui/creators/CTAs'
import RichTitle from '@/ui/creators/RichTitle'
import type { SanityImage, SanityCTA, SanityModule } from '@/sanity/typeHelpers'

type Tag = {
	_key?: string
	position?: 't1' | 't2' | 't3' | null
	style?: 'coral' | 'neutral' | 'ink' | null
	icon?: string | null
	label?: string | null
	value?: string | null
}

type TitleBlock = {
	_type?: string
	_key?: string
	children?: Array<{ text?: string; marks?: string[] }>
}

type Props = SanityModule & {
	eyebrow?: string | null
	title?: TitleBlock[] | null
	sub?: string | null
	image?: SanityImage | null
	tags?: Tag[] | null
	ctas?: Array<SanityCTA | null> | null
	reviewTitle?: string | null
	reviewSubtitle?: string | null
	reviewAvatars?: string[] | null
}

const tagPosition: Record<NonNullable<Tag['position']>, string> = {
	t1: 'top-[6%] right-[-4%] max-md:right-[4%]',
	t2: 'bottom-[30%] left-[-6%] max-md:left-[4%]',
	t3: 'bottom-[4%] right-[-2%] max-md:right-[4%]',
}

const tagBg: Record<NonNullable<Tag['style']>, string> = {
	coral: 'bg-coral text-paper',
	neutral: 'bg-paper-3 text-ink',
	ink: 'bg-ink text-paper',
}

export default function HeroCreators(props: Props) {
	const {
		eyebrow,
		title,
		sub,
		image,
		tags,
		ctas,
		reviewTitle,
		reviewSubtitle,
		reviewAvatars,
	} = props

	return (
		<section
			{...moduleProps(props)}
			className="relative overflow-hidden pb-[clamp(60px,7vw,100px)] pt-[calc(var(--header-height)+14px+clamp(40px,5vw,70px))]"
		>
			<span
				aria-hidden
				className="bg-blush pointer-events-none absolute -left-[8%] top-[8%] size-[320px] rounded-full opacity-70 blur-[20px]"
			/>
			<span
				aria-hidden
				className="bg-warm-white pointer-events-none absolute -bottom-[8%] right-[18%] size-[280px] rounded-full opacity-90 blur-[30px]"
			/>

			<div className="wrap relative z-10">
				<div className="grid items-center gap-[clamp(2rem,4vw,3.5rem)] lg:grid-cols-[1.05fr_1fr]">
					<div>
						{eyebrow && (
							<span className="bg-paper-2 border-line text-charcoal mb-7 inline-flex items-center gap-2.5 rounded-full border px-4.5 py-2 text-[13px] font-semibold">
								<span className="bg-coral shadow-[0_0_0_4px_var(--color-coral-tint)] inline-block size-[7px] rounded-full" />
								{eyebrow}
							</span>
						)}

						<RichTitle
							title={title}
							as="h1"
							className="text-ink m-0 font-display font-semibold leading-[1] tracking-[-0.02em] text-[clamp(46px,5vw,92px)]"
						/>

						{sub && (
							<p className="text-charcoal mt-7 max-w-[48ch] text-[clamp(16px,1.3vw,18.5px)] leading-relaxed">
								{sub}
							</p>
						)}

						{ctas && ctas.length > 0 && (
							<CTAs ctas={ctas} className="mt-10 flex flex-wrap items-center gap-6" />
						)}

						{(reviewTitle || reviewSubtitle) && (
							<div className="mt-9 flex flex-wrap items-center gap-3.5">
								{reviewAvatars && reviewAvatars.length > 0 && (
									<div className="flex">
										{reviewAvatars.map((initial, i) => {
											const bg =
												i === 0
													? 'bg-coral-tint'
													: i === 1
														? 'bg-warm-white'
														: 'bg-paper-3'
											return (
												<div
													key={i}
													className={cn(
														'border-paper text-ink font-display shadow-sm -ml-2.5 grid size-10 place-items-center rounded-full border-[3px] text-[13px] font-semibold first:ml-0',
														bg,
													)}
												>
													{stegaClean(initial)}
												</div>
											)
										})}
									</div>
								)}
								<div className="text-charcoal">
									{reviewTitle && (
										<div className="text-ink text-[14.5px] font-semibold">
											{reviewTitle}
										</div>
									)}
									{reviewSubtitle && (
										<div className="text-mute text-[12.5px]">
											{reviewSubtitle}
										</div>
									)}
								</div>
							</div>
						)}
					</div>

					{image && (
						<div className="relative mx-auto aspect-[4/5] min-h-[420px] w-full max-lg:max-w-md max-sm:min-h-[280px] lg:min-h-[480px]">
							<div className="from-blush to-warm-white border-line absolute inset-0 -z-10 translate-x-3.5 translate-y-3.5 rounded-[28px] border bg-gradient-to-br" />
							<div className="bg-ink shadow-lg absolute inset-0 overflow-hidden rounded-[28px]">
								<Img
									image={image}
									className="size-full object-cover"
									alt={image.alt ?? ''}
									sizes="(min-width: 1024px) 50vw, 100vw"
									loading="eager"
								/>
							</div>

							{tags?.map((tag, i) => {
								if (!tag.position) return null
								const variant = (stegaClean(tag.style) ||
									'neutral') as keyof typeof tagBg
								return (
									<div
										key={tag._key ?? i}
										className={cn(
											'bg-paper border-line shadow-md absolute z-10 flex items-center gap-3 rounded-[18px] border px-4.5 py-3.5',
											tagPosition[tag.position],
										)}
									>
										<span
											className={cn(
												'grid size-9 place-items-center rounded-xl',
												tagBg[variant],
											)}
										>
											<Icon name={tag.icon} size={20} />
										</span>
										<div>
											{tag.label && (
												<div className="text-mute text-[12px] font-medium">
													{tag.label}
												</div>
											)}
											{tag.value && (
												<div className="text-ink font-display text-[20px] font-semibold leading-none -tracking-[0.01em]">
													{tag.value}
												</div>
											)}
										</div>
									</div>
								)
							})}
						</div>
					)}
				</div>
			</div>
		</section>
	)
}
