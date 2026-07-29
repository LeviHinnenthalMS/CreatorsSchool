import moduleProps from '@/lib/moduleProps'
import { getSite } from '@/sanity/lib/queries'
import { Icon } from '@/ui/creators/Icon'
import Button from '@/ui/Button'
import CTAList from '@/ui/CTAList'
import RichTitle from '@/ui/creators/RichTitle'
import type { SanityCTA, SanityModule } from '@/sanity/typeHelpers'

type Block = {
	_type?: string
	children?: Array<{ text?: string; marks?: string[] }>
}

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
			className="mt-[clamp(25px,3vw,45px)] mb-[clamp(50px,6vw,90px)] px-[clamp(20px,3.5vw,48px)]"
		>
			<div className="bg-coral text-paper rounded-band relative mx-auto grid max-w-[1440px] items-center gap-10 overflow-hidden p-6 max-sm:gap-6 md:grid-cols-[1.4fr_1fr] md:p-[clamp(48px,6vw,80px)]">
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
						<span className="text-paper mb-4 inline-flex items-center gap-2.5 text-[13px] font-semibold tracking-[0.06em] uppercase">
							<span
								aria-hidden
								className="bg-coral-soft inline-block size-2 rounded-full shadow-[0_0_0_4px_rgba(232,71,74,0.30)]"
							/>
							{eyebrow}
						</span>
					)}
					<RichTitle
						title={title}
						as="h2"
						tone="blush"
						className="text-paper font-display m-0 text-[clamp(32px,4.5vw,60px)] leading-[1.02] font-bold -tracking-[0.03em]"
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
							className="text-paper hover:text-blush font-display text-[clamp(28px,3.4vw,46px)] leading-none font-bold -tracking-[0.02em] no-underline"
						>
							{site.phone}
						</a>
					)}

					<div className="flex flex-wrap gap-3">
						{props.showWhatsapp !== false && site.whatsapp && (
							<Button
								href={`https://wa.me/${site.whatsapp}`}
								external
								variant="tertiary"
								size="action"
							>
								<span className="flex items-center gap-3">
									<Icon name="whatsapp" size={22} stroke="1.2" />
									{props.whatsappLabel || 'WhatsApp'}
								</span>
							</Button>
						)}
						{props.showEmail !== false && site.email && (
							<Button
								href={`mailto:${site.email}`}
								external
								target="_self"
								variant="ink"
								size="action"
								withArrow
							>
								{props.emailLabel || site.email}
							</Button>
						)}
						{props.extraCtas && (
							<CTAList
								ctas={props.extraCtas}
								variantOverrides={['paper-outline']}
								size="action"
								withArrow
							/>
						)}
					</div>
				</div>
			</div>
		</section>
	)
}
