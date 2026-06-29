import moduleProps from '@/lib/moduleProps'
import Eyebrow from '@/ui/creators/Eyebrow'
import RichTitle from '@/ui/creators/RichTitle'
import CTAs from '@/ui/creators/CTAs'
import type { SanityCTA, SanityModule } from '@/sanity/typeHelpers'

type QA = { _key?: string; q?: string | null; a?: string | null; defaultOpen?: boolean | null }
type Block = { _type?: string; children?: Array<{ text?: string; marks?: string[] }> }

type Props = SanityModule & {
	eyebrow?: string | null
	title?: Block[] | null
	lead?: string | null
	ctas?: Array<SanityCTA | null> | null
	items?: QA[] | null
}

export default function SvcFaq(props: Props) {
	if (!props.items?.length) return null

	return (
		<section
			{...moduleProps(props)}
			className="pb-[clamp(70px,8vw,110px)] pt-[clamp(50px,6vw,90px)]"
		>
			<div className="wrap grid gap-[clamp(32px,4vw,60px)] md:grid-cols-[1fr_1.4fr]">
				<div>
					{props.eyebrow && <Eyebrow>{props.eyebrow}</Eyebrow>}
					<RichTitle
						title={props.title}
						as="h2"
						className="text-ink h-sub mt-3"
					/>
					{props.lead && (
						<p className="text-charcoal mt-5 max-w-[42ch] text-[16.5px]">
							{props.lead}
						</p>
					)}
					{props.ctas && props.ctas.length > 0 && (
						<CTAs ctas={props.ctas} className="mt-7 flex flex-wrap gap-4" />
					)}
				</div>

				<div className="flex flex-col gap-3">
					{props.items.map((qa, i) => (
						<details
							key={qa._key ?? i}
							open={qa.defaultOpen || undefined}
							className="bg-paper border-line group/faq rounded-[20px] border px-6 py-5.5 transition-[border-color,background] open:border-coral-soft open:bg-coral-tint"
						>
							<summary className="text-ink font-display flex cursor-pointer items-center justify-between gap-4 text-[18px] font-semibold -tracking-[0.015em] [&::-webkit-details-marker]:hidden">
								<span>{qa.q}</span>
								<span
									aria-hidden
									className="text-coral text-[24px] leading-none transition-transform duration-300 group-open/faq:rotate-45"
								>
									+
								</span>
							</summary>
							{qa.a && (
								<p className="text-charcoal mt-3.5 text-[14.5px] leading-relaxed">
									{qa.a}
								</p>
							)}
						</details>
					))}
				</div>
			</div>
		</section>
	)
}
