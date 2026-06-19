import moduleProps from '@/lib/moduleProps'
import getServerLang from '@/lib/getServerLang'
import { getFeaturedPerformance, getPerformanceById } from '@/sanity/lib/creators'
import Eyebrow from '@/ui/creators/Eyebrow'
import CTAs from '@/ui/creators/CTAs'
import type { SanityCTA, SanityModule } from '@/sanity/typeHelpers'

type Props = SanityModule & {
	performance?: { _ref?: string } | { _id?: string } | null
	eyebrow?: string | null
	titleBefore?: string | null
	titleAccent?: string | null
	titleAfter?: string | null
	ctas?: Array<SanityCTA | null> | null
}

function splitDate(dates?: string | null) {
	if (!dates) return { big: null as string | null, mon: null as string | null }
	// expects "5.–6. September 2026" or similar — show the leading day(s) big
	const match = dates.match(/^([\d.,\s–-]+?)([A-Za-zÄÖÜäöüß]+\s*\d*)?$/)
	const big = match?.[1]?.trim().replace(/\.$/, '').trim() || null
	const mon = (match?.[2] || dates.replace(big ?? '', '')).trim() || null
	return { big, mon }
}

export default async function PerformanceBanner(props: Props) {
	const lang = await getServerLang()
	const id =
		(props.performance as { _ref?: string } | null)?._ref ??
		(props.performance as { _id?: string } | null)?._id ??
		null
	const perf = id
		? await getPerformanceById(id)
		: await getFeaturedPerformance(lang)

	if (!perf) return null

	const eyebrow = props.eyebrow ?? 'Bühne frei'
	const titleAccent = props.titleAccent ?? perf.title
	const { big, mon } = splitDate(perf.dates)

	return (
		<section
			{...moduleProps(props)}
			className="my-[clamp(50px,6vw,90px)] px-[clamp(8px,1.5vw,24px)]"
		>
			<div className="bg-plum text-paper relative overflow-hidden rounded-[40px] p-[clamp(48px,6vw,96px)]">
				<span
					aria-hidden
					className="pointer-events-none absolute -right-20 -top-[120px] size-[460px] rounded-full bg-[radial-gradient(circle,rgba(251,227,227,0.16),transparent_62%)]"
				/>
				<span
					aria-hidden
					className="pointer-events-none absolute -bottom-1/2 -left-[10%] h-[160%] w-1/2 bg-[radial-gradient(circle,rgba(232,71,74,0.22),transparent_60%)]"
				/>

				<div className="relative z-10 grid items-center gap-[clamp(36px,4vw,64px)] md:grid-cols-[0.85fr_1.15fr]">
					{(big || mon || perf.venue) && (
						<div className="rounded-[28px] border border-white/15 bg-white/[0.04] p-[clamp(28px,3vw,44px)] text-center">
							{big && (
								<div className="text-paper font-display text-[clamp(64px,8vw,116px)] font-semibold leading-[0.9] -tracking-[0.02em]">
									{big}
								</div>
							)}
							{mon && (
								<div className="text-blush mt-3.5 text-[14px] font-semibold uppercase tracking-[0.24em]">
									{mon}
								</div>
							)}
							{perf.venue && (
								<div className="text-paper/70 mt-1.5 text-[14px]">
									{perf.venue}
								</div>
							)}
						</div>
					)}

					<div>
						{eyebrow && <Eyebrow tone="blush">{eyebrow}</Eyebrow>}

						<h2 className="text-paper font-display m-0 mt-4 text-[clamp(30px,3.7vw,52px)] font-semibold leading-[1.04] -tracking-[0.02em]">
							{props.titleBefore}
							{titleAccent && (
								<>
									{props.titleBefore ? ' ' : ''}
									<span className="text-blush font-medium italic">
										{titleAccent}
									</span>
								</>
							)}
							{props.titleAfter}
						</h2>

						{perf.lead && (
							<p className="text-paper/90 font-display mt-4 text-[clamp(18px,1.7vw,23px)] font-medium italic">
								{perf.lead}
							</p>
						)}

						{perf.description && (
							<p className="text-paper/80 mt-4 max-w-[50ch] text-[16px] leading-relaxed">
								{perf.description}
							</p>
						)}

						{props.ctas && props.ctas.length > 0 && (
							<CTAs
								ctas={props.ctas}
								variants={['blush', 'paper-outline']}
								className="mt-8 flex flex-wrap items-center gap-5"
							/>
						)}
					</div>
				</div>
			</div>
		</section>
	)
}
