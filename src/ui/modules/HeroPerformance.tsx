import moduleProps from '@/lib/moduleProps'
import getServerLang from '@/lib/getServerLang'
import { getFeaturedPerformance, getPerformanceById } from '@/sanity/lib/creators'
import { getSite } from '@/sanity/lib/queries'
import Eyebrow from '@/ui/creators/Eyebrow'
import RichTitle from '@/ui/creators/RichTitle'
import { Icon } from '@/ui/creators/Icon'
import type { SanityModule } from '@/sanity/typeHelpers'

type Block = { _type?: string; children?: Array<{ text?: string; marks?: string[] }> }

type Props = SanityModule & {
	performance?: { _ref?: string } | null
	eyebrow?: string | null
	title?: Block[] | null
	sub?: string | null
	whatsappLabel?: string | null
	emailLabel?: string | null
}

export default async function HeroPerformance(props: Props) {
	const lang = await getServerLang()
	const id = (props.performance as { _ref?: string } | null)?._ref ?? null
	const perf = id ? await getPerformanceById(id) : await getFeaturedPerformance(lang)

	const site = (await getSite()) as {
		phone?: string | null
		phoneTel?: string | null
		whatsapp?: string | null
		email?: string | null
	}

	// Split bigNumber on "&" → e.g. "5 & 6" → ["5 ", " 6"]
	const bigParts = perf?.bigNumber ? perf.bigNumber.split('&').map((s) => s.trim()) : []

	// Strip year from monthLabel: "September 2026" → "September"
	const month = perf?.monthLabel?.replace(/\s+\d{4}$/, '') ?? ''

	return (
		<section
			{...moduleProps(props)}
			className="bg-ink relative overflow-hidden pb-[clamp(70px,8vw,120px)] pt-[calc(var(--header-height)+14px+clamp(70px,8vw,120px))]"
		>
			{/* Gradient blob top-right */}
			<span
				aria-hidden
				className="pointer-events-none absolute -right-[120px] -top-[160px] size-[600px] rounded-full bg-[radial-gradient(circle,rgba(196,70,80,0.48),transparent_55%)]"
			/>

			<div className="wrap relative z-10 flex flex-col gap-6">
				{/* Breadcrumb */}
				<p className="text-paper/35 m-0 text-[13px]">
					Home / Aufführungen{perf?.year ? ` ${perf.year}` : ''}
				</p>

				{/* Eyebrow */}
				{props.eyebrow && (
					<Eyebrow tone="paper">{props.eyebrow.toUpperCase()}</Eyebrow>
				)}

				{/* Title */}
				{props.title && (
					<RichTitle
						title={props.title}
						as="h1"
						tone="blush"
						className="text-paper font-display m-0 md:max-w-3/4 text-[clamp(38px,5.5vw,80px)] font-bold leading-[1.02] -tracking-[0.025em]"
					/>
				)}

				{/* Date display */}
				{bigParts.length >= 2 && (
					<div className="mt-2 flex items-baseline gap-0 leading-none">
						<span
							className="text-paper font-display font-bold -tracking-[0.025em]"
							style={{ fontSize: 'clamp(80px,10vw,140px)', lineHeight: 0.95 }}
						>
							{bigParts[0]}
						</span>
						<span
							aria-hidden
							className="text-blush font-display font-bold italic"
							style={{ fontSize: 'clamp(70px,9vw,124px)', lineHeight: 0.95 }}
						>
							&amp;
						</span>
						<span
							className="text-paper font-display font-bold -tracking-[0.025em]"
							style={{ fontSize: 'clamp(80px,10vw,140px)', lineHeight: 0.95 }}
						>
							{bigParts[1]}
						</span>
						{month && (
							<span
								className="text-paper font-display ml-4 font-semibold -tracking-[0.01em]"
								style={{ fontSize: 'clamp(28px,3.5vw,52px)', lineHeight: 1 }}
							>
								{month}
							</span>
						)}
					</div>
				)}

				{/* Sub / venue */}
				{(props.sub || perf?.venue) && (
					<p className="text-paper/50 m-0 text-[14.5px]">
						{props.sub ?? perf?.venue}
					</p>
				)}

				{/* CTAs */}
				<div className="mt-2 flex flex-wrap items-center gap-4">
					{site.whatsapp && (
						<a
							href={`https://wa.me/${site.whatsapp}`}
							target="_blank"
							rel="noopener noreferrer"
							className="action-base bg-paper text-ink hover:bg-paper-2"
						>
							<Icon name="whatsapp" size={20} stroke="1.2" />
							{props.whatsappLabel ?? 'Karten per WhatsApp'}
						</a>
					)}
					{site.email && (
						<a
							href={`mailto:${site.email}`}
							className="action-base border border-white/30 bg-transparent text-paper hover:bg-white/10"
						>
							{props.emailLabel ?? 'Karten per E-Mail'}
							<span aria-hidden className="ml-1.5">→</span>
						</a>
					)}
					{site.phone && (
						<a
							href={site.phoneTel ? `tel:${site.phoneTel}` : undefined}
							className="text-paper/60 hover:text-paper ml-2 text-[15px] font-medium no-underline transition-colors"
						>
							{site.phone}
						</a>
					)}
				</div>
			</div>
		</section>
	)
}
