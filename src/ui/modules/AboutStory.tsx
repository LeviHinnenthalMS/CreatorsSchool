import { PortableText, stegaClean } from 'next-sanity'
import moduleProps from '@/lib/moduleProps'
import { Img } from '@/ui/Img'
import Eyebrow from '@/ui/creators/Eyebrow'
import RichTitle from '@/ui/creators/RichTitle'
import type { SanityImage, SanityModule } from '@/sanity/typeHelpers'

type Props = SanityModule & {
	eyebrow?: string | null
	title?: any
	body?: any
	image?: (SanityImage & { caption?: string | null; captionSub?: string | null }) | null
	signatureName?: string | null
	personName?: string | null
	personRole?: string | null
}

export default function AboutStory({
	eyebrow,
	title,
	body,
	image,
	signatureName,
	personName,
	personRole,
	...props
}: Props) {
	const hasContent = title || body || signatureName
	if (!hasContent && !image?.asset) return null

	return (
		<section
			{...moduleProps(props)}
			className="py-[clamp(60px,8vw,120px)]"
		>
			<div className="wrap grid items-center gap-12 lg:grid-cols-[1fr_1.15fr] lg:gap-20">
				{/* Left: stacked photo card */}
				<div className="relative mx-auto w-full max-w-[440px] lg:mx-0">
					{/* Back cards (decorative depth) */}
					<div
						className="absolute inset-0 -rotate-3 scale-95 rounded-[22px] bg-mute-2/35"
						aria-hidden
					/>
					<div
						className="absolute inset-0 rotate-[1.5deg] scale-[0.97] rounded-[22px] bg-mute/20"
						aria-hidden
					/>

					{/* Front card */}
					<div className="relative overflow-hidden rounded-[22px] shadow-lg">
						{image?.asset ? (
							<Img
								image={image}
								width={880}
								sizes="(max-width: 1024px) 90vw, 480px"
								className="block aspect-[3/4] w-full object-cover"
							/>
						) : (
							<div className="aspect-[3/4] w-full bg-line" />
						)}

						{(image?.caption || image?.captionSub) && (
							<div className="absolute inset-x-0 bottom-0 bg-ink/80 px-6 py-5 backdrop-blur-sm">
								{image?.caption && (
									<p className="font-display m-0 text-[17px] font-bold leading-snug text-paper">
										{stegaClean(image.caption)}
									</p>
								)}
								{image?.captionSub && (
									<p className="m-0 mt-1 text-[13px] leading-snug text-paper/65">
										{stegaClean(image.captionSub)}
									</p>
								)}
							</div>
						)}
					</div>
				</div>

				{/* Right: content */}
				<div>
					{eyebrow && <Eyebrow tone="coral">{eyebrow}</Eyebrow>}

					{title && (
						<RichTitle
							title={title}
							tone="coral"
							as="h2"
							className="mt-3 mb-8 !text-[clamp(2.2rem,3.8vw,3rem)] leading-[1.05] -tracking-[0.02em]"
						/>
					)}

					{body && (
						<div className="space-y-5 text-[16px] leading-[1.7] text-charcoal [&_p]:m-0">
							<PortableText value={body} />
						</div>
					)}

					{(signatureName || personName) && (
						<div className="mt-10 flex items-center gap-5 border-t border-line pt-7">
							{signatureName && (
								<span className="font-display text-coral shrink-0 text-[28px] font-medium italic leading-none">
									— {stegaClean(signatureName)}
								</span>
							)}
							{personName && (
								<div>
									<p className="font-display m-0 text-[14.5px] font-bold leading-snug text-ink">
										{stegaClean(personName)}
									</p>
									{personRole && (
										<p className="m-0 mt-1 text-[10.5px] font-semibold uppercase tracking-[0.13em] text-mute">
											{stegaClean(personRole)}
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
