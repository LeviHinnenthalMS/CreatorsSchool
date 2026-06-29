import moduleProps from '@/lib/moduleProps'
import Eyebrow from '@/ui/creators/Eyebrow'
import RichTitle from '@/ui/creators/RichTitle'
import CTAs from '@/ui/creators/CTAs'
import { stegaClean } from 'next-sanity'
import type { SanityCTA, SanityModule } from '@/sanity/typeHelpers'

type Stat = { _key?: string; value?: string | null; label?: string | null }
type Block = { _type?: string; children?: Array<{ text?: string; marks?: string[] }> }

type Props = SanityModule & {
	eyebrow?: string | null
	title?: Block[] | null
	body?: string | null
	stats?: Stat[] | null
	ctas?: Array<SanityCTA | null> | null
	profile?: {
		tags?: string[] | null
		firstName?: string | null
		lastName?: string | null
		role?: string | null
		quote?: string | null
	} | null
}

export default function AboutStrip(props: Props) {
	const { profile } = props
	return (
		<section
			{...moduleProps(props)}
			className="bg-ink text-paper relative mx-[clamp(8px,1.5vw,24px)] overflow-hidden rounded-band py-[clamp(80px,9vw,130px)]"
		>
			<span
				aria-hidden
				className="pointer-events-none absolute -right-24 -top-24 size-[400px] rounded-full bg-[radial-gradient(circle,rgba(207,28,32,0.26),transparent_60%)]"
			/>
			<div className="wrap relative z-10">
				<div className="grid items-center gap-14 md:grid-cols-2">
					<div>
						{props.eyebrow && <Eyebrow tone="blush">{props.eyebrow}</Eyebrow>}
						<RichTitle
							title={props.title}
							as="h2"
							tone="blush"
							className="text-paper mt-4 font-display text-[clamp(34px,4.2vw,58px)] font-semibold leading-[1.04] -tracking-[0.02em]"
						/>
						{props.body && (
							<p className="text-paper/70 mt-6 max-w-[50ch] text-[16.5px] leading-relaxed">
								{props.body}
							</p>
						)}
						{props.stats && props.stats.length > 0 && (
							<div className="mt-9 grid grid-cols-3 gap-3.5 max-sm:grid-cols-1">
								{props.stats.map((s, i) => (
									<div
										key={s._key ?? i}
										className="rounded-[20px] border border-white/10 bg-white/[0.03] p-5"
									>
										<div className="text-paper font-display text-[30px] font-semibold leading-none -tracking-[0.015em]">
											{s.value}
										</div>
										<div className="text-paper/55 mt-2.5 text-[12px] uppercase tracking-[0.04em]">
											{s.label}
										</div>
									</div>
								))}
							</div>
						)}
						{props.ctas && props.ctas.length > 0 && (
							<CTAs
								ctas={props.ctas}
								variants={['blush']}
								className="mt-9 flex flex-wrap gap-4"
							/>
						)}
					</div>

					{profile && (
						<div className="from-coral to-coral-deep relative flex min-h-[480px] flex-col justify-between overflow-hidden rounded-[32px] border border-white/15 bg-gradient-to-br p-9">
							<span
								aria-hidden
								className="pointer-events-none absolute inset-0 [background-image:radial-gradient(rgba(255,255,255,0.12)_1.5px,transparent_1.5px)] [background-size:24px_24px] [mask-image:radial-gradient(80%_80%_at_50%_50%,black,transparent)]"
							/>
							<div className="relative z-10">
								{profile.tags && profile.tags.length > 0 && (
									<div className="flex flex-wrap gap-2">
										{profile.tags.map((t, i) => (
											<span
												key={i}
												className="rounded-full border border-white/25 bg-white/15 px-3.5 py-2 text-[12.5px] font-semibold backdrop-blur"
											>
												{stegaClean(t)}
											</span>
										))}
									</div>
								)}
							</div>
							<div className="relative z-10">
								<h3 className="text-paper font-display m-0 text-[clamp(40px,5vw,60px)] font-semibold leading-[0.98] -tracking-[0.02em]">
									{profile.firstName}
									{profile.lastName && (
										<>
											<br />
											<span className="text-blush font-medium italic">
												{profile.lastName}
											</span>
										</>
									)}
								</h3>
								{profile.role && (
									<div className="text-paper/85 mt-2.5 text-[13px] uppercase tracking-[0.04em]">
										{profile.role}
									</div>
								)}
								{profile.quote && (
									<p className="text-paper font-display mt-6 max-w-[40ch] text-[18px] font-normal italic leading-snug">
										<span className="text-blush font-display text-[60px] leading-[0.4] -tracking-[0.01em] mr-2 align-text-bottom italic">
											&ldquo;
										</span>
										{profile.quote}
									</p>
								)}
							</div>
						</div>
					)}
				</div>
			</div>
		</section>
	)
}
