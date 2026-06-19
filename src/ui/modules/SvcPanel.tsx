import moduleProps from '@/lib/moduleProps'
import Eyebrow from '@/ui/creators/Eyebrow'
import AccentTitle from '@/ui/creators/AccentTitle'
import CTAs from '@/ui/creators/CTAs'
import type { SanityCTA, SanityModule } from '@/sanity/typeHelpers'

type Row = { _key?: string; key?: string | null; value?: string | null }

type Panel = {
	label?: string | null
	currency?: string | null
	value?: string | null
	unit?: string | null
	rows?: Row[] | null
	ctas?: Array<SanityCTA | null> | null
}

type Props = SanityModule & {
	eyebrow?: string | null
	titleBefore?: string | null
	titleAccent?: string | null
	titleAfter?: string | null
	lead?: string | null
	panel?: Panel | null
}

export default function SvcPanel(props: Props) {
	const p = props.panel

	return (
		<section
			{...moduleProps(props)}
			className="py-[clamp(50px,6vw,90px)]"
		>
			<div className="wrap">
				<div className="grid items-start gap-[clamp(32px,4vw,64px)] md:grid-cols-2">
					<div>
						{props.eyebrow && <Eyebrow>{props.eyebrow}</Eyebrow>}
						<AccentTitle
							as="h2"
							before={props.titleBefore}
							accent={props.titleAccent}
							after={props.titleAfter}
							className="text-ink h-sub mt-3"
						/>
						{props.lead && (
							<p className="text-charcoal mt-5 max-w-[50ch] text-[16.5px] leading-relaxed">
								{props.lead}
							</p>
						)}
					</div>

					{p && (
						<div className="bg-ink text-paper rounded-panel relative overflow-hidden p-[clamp(30px,3.4vw,44px)]">
							<span
								aria-hidden
								className="pointer-events-none absolute -bottom-12 -right-12 size-[220px] rounded-full bg-[radial-gradient(circle,color-mix(in_srgb,var(--color-coral)_32%,transparent),transparent_62%)]"
							/>

							<div className="relative z-10">
								{p.label && (
									<div className="text-paper/55 mb-2.5 text-[12px] font-semibold uppercase tracking-[0.06em]">
										{p.label}
									</div>
								)}
								{p.value && (
									<div className="flex items-baseline gap-2">
										{p.currency && (
											<span className="text-paper/80 text-[24px] font-semibold">
												{p.currency}
											</span>
										)}
										<span className="text-paper font-display text-[56px] font-bold leading-none -tracking-[0.03em]">
											{p.value}
										</span>
										{p.unit && (
											<span className="text-paper/60 text-[15px]">{p.unit}</span>
										)}
									</div>
								)}
								{p.rows && p.rows.length > 0 && (
									<div className="mt-6">
										{p.rows.map((row, i) => (
											<div
												key={row._key ?? i}
												className="flex justify-between gap-4 border-t border-white/10 py-3 text-[14.5px]"
											>
												<span className="text-paper/60">{row.key}</span>
												<span className="text-paper text-right font-semibold">
													{row.value}
												</span>
											</div>
										))}
									</div>
								)}
								{p.ctas && p.ctas.length > 0 && (
									<CTAs
										ctas={p.ctas}
										variants={['coral', 'paper-outline']}
										className="mt-7 flex flex-wrap gap-2.5"
									/>
								)}
							</div>
						</div>
					)}
				</div>
			</div>
		</section>
	)
}
