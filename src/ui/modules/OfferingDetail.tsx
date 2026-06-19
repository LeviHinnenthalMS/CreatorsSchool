import moduleProps from '@/lib/moduleProps'
import { stegaClean } from 'next-sanity'
import Link from 'next/link'
import Eyebrow from '@/ui/creators/Eyebrow'
import AccentTitle from '@/ui/creators/AccentTitle'
import CTAs from '@/ui/creators/CTAs'
import { Icon } from '@/ui/creators/Icon'
import { getOfferingById } from '@/sanity/lib/creators'
import type { SanityCTA, SanityModule } from '@/sanity/typeHelpers'

type Props = SanityModule & {
	offering?: { _ref?: string } | { _id?: string } | null
	breadcrumbHomeLabel?: string | null
	breadcrumbParentLabel?: string | null
	breadcrumbParentHref?: string | null
	ctas?: Array<SanityCTA | null> | null
	backLinkLabel?: string | null
	backLinkHref?: string | null
	panelCtas?: Array<SanityCTA | null> | null
}

export default async function OfferingDetail(props: Props) {
	const id =
		(props.offering as { _ref?: string } | null)?._ref ??
		(props.offering as { _id?: string } | null)?._id
	if (!id) return null

	const offering = await getOfferingById(id)
	if (!offering) return null

	const parentHref = stegaClean(props.breadcrumbParentHref || '/angebote')

	return (
		<>
			{/* page header */}
			<section
				{...moduleProps(props)}
				className="relative overflow-hidden pb-[clamp(40px,5vw,70px)] pt-[clamp(60px,8vw,110px)]"
			>
				<span
					aria-hidden
					className="bg-blush pointer-events-none absolute -right-[30px] -top-[70px] -z-10 size-[340px] rounded-full opacity-45 blur-[30px]"
				/>
				<div className="wrap">
					<nav className="text-mute mb-7 flex flex-wrap items-center gap-2 text-[13px]" aria-label="Breadcrumb">
						<Link href="/" className="text-mute hover:text-coral no-underline">
							{props.breadcrumbHomeLabel || 'Home'}
						</Link>
						<span aria-hidden className="text-line-2">/</span>
						<Link href={parentHref} className="text-mute hover:text-coral no-underline">
							{props.breadcrumbParentLabel || 'Angebote'}
						</Link>
						<span aria-hidden className="text-line-2">/</span>
						<span className="text-ink-2">{offering.title}</span>
					</nav>

					{offering.eyebrow && (
						<span className="bg-paper-2 border-line text-ink-2 mb-7 inline-flex items-center gap-2.5 rounded-full border px-4.5 py-2 text-[13px] font-semibold tracking-[0.04em]">
							<span aria-hidden className="bg-coral inline-block size-2 rounded-full" />
							{offering.eyebrow}
						</span>
					)}

					{offering.title && (
						<h1 className="h-display text-ink m-0 max-w-[18ch]">
							{offering.title}
						</h1>
					)}

					{offering.lede && (
						<p className="text-ink-2 mt-8 max-w-[54ch] text-[clamp(17px,1.4vw,19px)] leading-relaxed">
							{offering.lede}
						</p>
					)}

					{offering.facts && offering.facts.length > 0 && (
						<div className="mt-9 flex flex-wrap gap-3">
							{offering.facts.map((f, i) => (
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

					<div className="mt-9 flex flex-wrap items-center gap-5">
						{props.ctas && <CTAs ctas={props.ctas} />}
						{props.backLinkLabel && props.backLinkHref && (
							<Link
								href={stegaClean(props.backLinkHref)}
								className="text-ink hover:text-coral-deep border-line-2 hover:border-coral-deep inline-flex items-center gap-2 border-b-2 pb-1 text-[14.5px] font-semibold no-underline transition-colors"
							>
								{props.backLinkLabel}
							</Link>
						)}
					</div>
				</div>
			</section>

			{/* Für wen */}
			{offering.forWho && offering.forWho.length > 0 && (
				<section className="py-[clamp(50px,6vw,90px)]">
					<div className="wrap grid gap-[clamp(32px,4vw,64px)] md:grid-cols-2">
						<div>
							<Eyebrow>{offering.forWhoTitle?.startsWith('Für') ? 'Für wen' : 'Für wen'}</Eyebrow>
							<AccentTitle
								as="h2"
								before={offering.forWhoTitle}
								className="text-ink h-sub mt-3"
							/>
							{offering.forWhoLead && (
								<p className="text-charcoal mt-5 max-w-[50ch] text-[16.5px] leading-relaxed">
									{offering.forWhoLead}
								</p>
							)}
						</div>
						<ul className="m-0 flex list-none flex-col gap-4 p-0">
							{offering.forWho.map((it, i) => (
								<li key={it._key ?? i} className="flex items-start gap-3.5">
									<span className="bg-coral-tint text-coral-deep mt-0.5 grid size-7 shrink-0 place-items-center rounded-full">
										<Icon name="check" size={13} strokeWidth={3} />
									</span>
									<span className="text-charcoal">
										{it.title && (
											<strong className="text-ink mb-0.5 block text-[15.5px] font-semibold">
												{it.title}
											</strong>
										)}
										<span className="text-[14.5px] leading-relaxed">{it.text}</span>
									</span>
								</li>
							))}
						</ul>
					</div>
				</section>
			)}

			{/* Das lernst du */}
			{offering.learn && offering.learn.length > 0 && (
				<section className="bg-warm-white py-[clamp(50px,6vw,90px)]">
					<div className="wrap">
						<Eyebrow>{offering.learnTitle?.split(' ')[0] || 'Das lernst du'}</Eyebrow>
						{offering.learnTitle && (
							<AccentTitle
								as="h2"
								before={offering.learnTitle}
								className="text-ink h-sub mt-3"
							/>
						)}
						<div className="mt-[clamp(36px,4vw,52px)] grid grid-cols-1 gap-4 md:grid-cols-3">
							{offering.learn.map((c, i) => (
								<article
									key={c._key ?? i}
									className="bg-paper border-line rounded-card-sm border p-7"
								>
									<div className="bg-coral-tint text-coral-deep mb-4.5 grid size-[50px] place-items-center rounded-[14px]">
										<Icon name={c.icon} size={24} />
									</div>
									{c.title && (
										<h3 className="text-ink font-display m-0 mb-2 text-[20px] font-semibold -tracking-[0.01em]">
											{c.title}
										</h3>
									)}
									{c.text && (
										<p className="text-charcoal m-0 text-[14.5px] leading-relaxed">
											{c.text}
										</p>
									)}
								</article>
							))}
						</div>
					</div>
				</section>
			)}

			{/* Auf einen Blick */}
			{(offering.priceValue || offering.detailRows?.length) && (
				<section className="py-[clamp(50px,6vw,90px)]">
					<div className="wrap grid items-start gap-[clamp(32px,4vw,64px)] md:grid-cols-2">
						<div>
							<Eyebrow>Auf einen Blick</Eyebrow>
							{offering.detailsTitle && (
								<AccentTitle
									as="h2"
									before={offering.detailsTitle}
									className="text-ink h-sub mt-3"
								/>
							)}
							{offering.detailsLead && (
								<p className="text-charcoal mt-5 max-w-[50ch] text-[16.5px] leading-relaxed">
									{offering.detailsLead}
								</p>
							)}
						</div>

						<div className="bg-ink text-paper rounded-panel relative overflow-hidden p-[clamp(30px,3.4vw,44px)]">
							<span
								aria-hidden
								className="pointer-events-none absolute -bottom-12 -right-12 size-[220px] rounded-full bg-[radial-gradient(circle,color-mix(in_srgb,var(--color-coral)_32%,transparent),transparent_62%)]"
							/>
							<div className="relative z-10">
								{offering.priceLabel && (
									<div className="text-paper/55 mb-2.5 text-[12px] font-semibold uppercase tracking-[0.06em]">
										{offering.priceLabel}
									</div>
								)}
								{offering.priceValue && (
									<div className="flex items-baseline gap-2">
										{offering.priceCurrency && (
											<span className="text-paper/80 text-[24px] font-semibold">
												{offering.priceCurrency}
											</span>
										)}
										<span className="text-paper font-display text-[56px] font-bold leading-none -tracking-[0.03em]">
											{offering.priceValue}
										</span>
										{offering.priceUnit && (
											<span className="text-paper/60 text-[15px]">
												{offering.priceUnit}
											</span>
										)}
									</div>
								)}
								{offering.detailRows && offering.detailRows.length > 0 && (
									<div className="mt-6">
										{offering.detailRows.map((r, i) => (
											<div
												key={r._key ?? i}
												className="flex justify-between gap-4 border-t border-white/10 py-3 text-[14.5px]"
											>
												<span className="text-paper/60">{r.key}</span>
												<span className="text-paper text-right font-semibold">
													{r.value}
												</span>
											</div>
										))}
									</div>
								)}
								{props.panelCtas && props.panelCtas.length > 0 && (
									<CTAs
										ctas={props.panelCtas}
										variants={['coral', 'paper-outline']}
										className="mt-7 flex flex-wrap gap-2.5"
									/>
								)}
							</div>
						</div>
					</div>
				</section>
			)}

			{/* FAQ */}
			{offering.faq && offering.faq.length > 0 && (
				<section className="pb-[clamp(70px,8vw,110px)] pt-[clamp(50px,6vw,90px)]">
					<div className="wrap grid gap-[clamp(32px,4vw,60px)] md:grid-cols-[1fr_1.4fr]">
						<div>
							<Eyebrow>Häufige Fragen</Eyebrow>
							{offering.faqTitle && (
								<AccentTitle as="h2" before={offering.faqTitle} className="h-sub mt-3" />
							)}
							{offering.faqLead && (
								<p className="text-charcoal mt-5 max-w-[42ch] text-[16.5px]">
									{offering.faqLead}
								</p>
							)}
						</div>
						<div className="flex flex-col gap-3">
							{offering.faq.map((qa, i) => (
								<details
									key={qa._key ?? i}
									open={i === 0}
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
			)}
		</>
	)
}
