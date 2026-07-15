import moduleProps from '@/lib/moduleProps'
import { getSite } from '@/sanity/lib/queries'
import { Icon } from '@/ui/creators/Icon'
import CTAs from '@/ui/creators/CTAs'
import RichTitle from '@/ui/creators/RichTitle'
import Btn from '@/ui/creators/Btn'
import type { SanityCTA, SanityModule } from '@/sanity/typeHelpers'

type Block = { _type?: string; children?: Array<{ text?: string; marks?: string[] }> }

type Props = SanityModule & {
	eyebrow?: string | null
	title?: Block[] | null
	text?: string | null
	showPhone?: boolean | null
	showWhatsapp?: boolean | null
	showEmail?: boolean | null
	whatsappLabel?: string | null
	emailLabel?: string | null
	extraCtas?: Array<SanityCTA | null> | null
}

export default async function CTABand(props: Props) {
	const site = (await getSite()) as {
		phone?: string | null
		phoneTel?: string | null
		whatsapp?: string | null
		email?: string | null
		ctaBandEyebrow?: string | null
		ctaBandTitle?: Block[] | null
		ctaBandText?: string | null
	}

	const eyebrow = props.eyebrow ?? site.ctaBandEyebrow
	const title = props.title ?? site.ctaBandTitle
	const text = props.text ?? site.ctaBandText

	return (
		<section
			{...moduleProps(props)}
			className="px-[clamp(20px,3.5vw,48px)] py-[clamp(40px,5vw,60px)]"
		>
			<div className="bg-coral text-paper relative grid items-center gap-10 max-sm:gap-6 overflow-hidden rounded-band p-6 md:p-[clamp(48px,6vw,80px)] md:grid-cols-[1.4fr_1fr]">
				<span
					aria-hidden
					className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_55%_at_110%_-10%,rgba(244,199,126,0.55),transparent)]"
				/>
				<span
					aria-hidden
					className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_45%_at_-8%_110%,rgba(45,26,34,0.28),transparent)]"
				/>

				<div className="relative z-10">
					{eyebrow && (
						<span className="text-paper mb-4 inline-flex items-center gap-2.5 text-[13px] font-semibold uppercase tracking-[0.06em]">
							<span aria-hidden className="bg-coral-soft shadow-[0_0_0_4px_rgba(232,71,74,0.30)] inline-block size-2 rounded-full" />
							{eyebrow}
						</span>
					)}
					<RichTitle
						title={title}
						as="h2"
						tone="blush"
						className="text-paper m-0 text-[clamp(32px,4.5vw,60px)] font-display font-bold leading-[1.02] -tracking-[0.03em]"
					/>
					{text && (
						<p className="text-paper/85 mt-5 max-w-[48ch] text-[16.5px]">
							{text}
						</p>
					)}
				</div>

				<div className="relative z-10 flex flex-col justify-start gap-5 max-md:items-start">
					{props.showPhone !== false && site.phone && (
						<a
							href={site.phoneTel ? `tel:${site.phoneTel}` : undefined}
							className="text-paper hover:text-blush font-display text-[clamp(28px,3.4vw,46px)] font-bold leading-none -tracking-[0.02em] no-underline"
						>
							{site.phone}
						</a>
					)}

					<div className="flex flex-wrap gap-3">
						{props.showWhatsapp !== false && site.whatsapp && (
							<a
								href={`https://wa.me/${site.whatsapp}`}
								className="action-base bg-paper text-ink hover:bg-paper-2"
							>
								<Icon name="whatsapp" size={22} stroke='1.2' />
								{props.whatsappLabel || 'WhatsApp'}
							</a>
						)}
						{props.showEmail !== false && site.email && (
							<Btn href={`mailto:${site.email}`} variant="ink">
								{props.emailLabel || site.email}
							</Btn>
						)}
						{props.extraCtas && (
							<CTAs ctas={props.extraCtas} variants={['paper-outline']} />
						)}
					</div>
				</div>
			</div>
		</section>
	)
}
