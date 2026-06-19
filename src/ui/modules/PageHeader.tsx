import moduleProps from '@/lib/moduleProps'
import AccentTitle from '@/ui/creators/AccentTitle'
import CTAs from '@/ui/creators/CTAs'
import type { SanityCTA, SanityModule } from '@/sanity/typeHelpers'

type Fact = { _key?: string; key?: string | null; value?: string | null }

type Props = SanityModule & {
	eyebrow?: string | null
	titleBefore?: string | null
	titleAccent?: string | null
	titleAfter?: string | null
	titlePill?: string | null
	lede?: string | null
	facts?: Fact[] | null
	ctas?: Array<SanityCTA | null> | null
}

export default function PageHeader(props: Props) {
	const {
		eyebrow,
		titleBefore,
		titleAccent,
		titleAfter,
		titlePill,
		lede,
		facts,
		ctas,
	} = props

	return (
		<section
			{...moduleProps(props)}
			className="relative overflow-hidden pb-[clamp(40px,5vw,70px)] pt-[clamp(60px,8vw,110px)]"
		>
			<span
				aria-hidden
				className="bg-blush pointer-events-none absolute -right-[30px] -top-[70px] -z-10 size-[340px] rounded-full opacity-45 blur-[30px]"
			/>
			<div className="wrap">
				{eyebrow && (
					<span className="bg-paper-2 border-line text-ink-2 mb-7 inline-flex items-center gap-2.5 rounded-full border px-4.5 py-2 text-[13px] font-semibold tracking-[0.04em]">
						<span aria-hidden className="bg-coral inline-block size-2 rounded-full" />
						{eyebrow}
					</span>
				)}

				<AccentTitle
					as="h1"
					before={titleBefore}
					accent={titleAccent}
					after={titleAfter}
					pill={titlePill}
					className="h-display max-w-[18ch]"
				/>

				{lede && (
					<p className="text-ink-2 mt-8 max-w-[54ch] text-[clamp(17px,1.4vw,19px)] leading-relaxed">
						{lede}
					</p>
				)}

				{facts && facts.length > 0 && (
					<div className="mt-9 flex flex-wrap gap-3">
						{facts.map((f, i) => (
							<div
								key={f._key ?? i}
								className="bg-paper-2 border-line flex min-w-[130px] flex-col gap-1 rounded-[16px] border px-5 py-3.5"
							>
								<span className="text-mute text-[11.5px] font-semibold uppercase tracking-[0.06em]">
									{f.key}
								</span>
								<span className="text-ink font-display text-[21px] font-semibold leading-none -tracking-[0.01em]">
									{f.value}
								</span>
							</div>
						))}
					</div>
				)}

				{ctas && ctas.length > 0 && (
					<CTAs ctas={ctas} className="mt-9 flex flex-wrap items-center gap-5" />
				)}
			</div>
		</section>
	)
}
