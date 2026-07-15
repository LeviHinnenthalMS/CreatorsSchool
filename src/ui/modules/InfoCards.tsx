import moduleProps from '@/lib/moduleProps'
import { cn } from '@/lib/utils'
import Link from 'next/link'
import { stegaClean } from 'next-sanity'
import { Icon } from '@/ui/creators/Icon'
import resolveUrl from '@/lib/resolveUrl'
import Eyebrow from '@/ui/creators/Eyebrow'
import RichTitle from '@/ui/creators/RichTitle'
import { getSite } from '@/sanity/lib/queries'
import type { SanityLink, SanityModule } from '@/sanity/typeHelpers'

type Block = { _type?: string; children?: Array<{ text?: string; marks?: string[] }> }

type Card = {
	_key?: string
	variant?: 'coral' | 'ink' | 'neutral' | null
	icon?: string | null
	label?: string | null
	value?: string | null
	small?: string | null
	link?: SanityLink | null
}

type Props = SanityModule & {
	cards?: Card[] | null
	layout?: string | null
	eyebrow?: string | null
	title?: Block[] | null
	tagline?: string | null
	cardLabel?: string | null
	cardTitle?: string | null
}

function href(link?: SanityLink | null) {
	if (!link) return undefined
	if (link.type === 'internal') {
		if (link.internal) return resolveUrl(link.internal, { params: link.params ?? undefined })
		if (link.params) return stegaClean(link.params)
	}
	return link.external ?? undefined
}

export default async function InfoCards(props: Props) {
	const layout = stegaClean(props.layout)

	if (layout === 'apply') {
		const site = (await getSite()) as {
			email?: string | null
			phone?: string | null
			phoneTel?: string | null
			addressLabel?: string | null
		}

		const infoRows = [
			{ label: 'E-Mail', value: site.email },
			{ label: 'Telefon', value: site.phone },
			{ label: 'Adresse', value: site.addressLabel },
		].filter((r): r is { label: string; value: string } => !!r.value)

		const buttonCards = props.cards?.filter((c) => !!href(c.link)) ?? []

		return (
			<section {...moduleProps(props)} className="relative overflow-hidden py-[clamp(40px,5vw,70px)]">
				<div className="pointer-events-none absolute -right-24 -top-24 size-[400px] rounded-full bg-[radial-gradient(circle,rgba(207,28,32,0.22),transparent_60%)]" />
				<div className="wrap grid gap-12 lg:grid-cols-[1fr_420px] lg:items-start">
					<div className="flex flex-col gap-5 lg:pt-4">
						{props.eyebrow && <Eyebrow>{props.eyebrow}</Eyebrow>}
						{props.title && (
							<RichTitle
								title={props.title}
								className="font-display text-[clamp(28px,3.5vw,44px)] font-bold leading-tight -tracking-[0.02em]"
							/>
						)}
						{props.tagline && (
							<p className="text-charcoal text-[16px] leading-relaxed">{props.tagline}</p>
						)}
					</div>

					<div className="bg-ink flex flex-col gap-6 rounded-[28px] p-8">
						{props.cardLabel && (
							<p className="text-white/40 m-0 text-[11px] font-bold tracking-[0.12em] uppercase">
								{props.cardLabel}
							</p>
						)}
						{props.cardTitle && (
							<h3 className="text-paper font-display m-0 text-[26px] font-bold leading-tight -tracking-[0.02em]">
								{props.cardTitle}
							</h3>
						)}

						{infoRows.length > 0 && (
							<div className="flex flex-col divide-y divide-white/8">
								{infoRows.map((r, i) => (
									<div
										key={i}
										className="flex items-center justify-between gap-4 py-4 first:pt-0 last:pb-0"
									>
										<span className="shrink-0 text-[13px] font-semibold text-white/40">
											{r.label}
										</span>
										<span className="text-paper text-right text-[14px] font-medium">
											{r.value}
										</span>
									</div>
								))}
							</div>
						)}

						{buttonCards.length > 0 && (
							<div className="flex flex-wrap gap-3 pt-2">
								{buttonCards.map((c, i) => {
									const url = href(c.link)!
									const isFirst = i === 0
									return (
										<Link
											key={c._key ?? i}
											href={url}
											className={cn(
												'flex flex-1 basis-[140px] items-center justify-center gap-2.5 rounded-full px-6 py-3.5 text-[14px] font-semibold no-underline transition-colors',
												isFirst
													? 'bg-coral text-paper hover:bg-coral-deep'
													: 'border border-white/20 text-paper hover:border-white/50',
											)}
										>
											{c.icon && <Icon name={c.icon} size={16} strokeWidth={1} />}
											{c.value ?? c.label}
										</Link>
									)
								})}
							</div>
						)}
					</div>
				</div>
			</section>
		)
	}

	if (!props.cards?.length) return null

	return (
		<section
			{...moduleProps(props)}
			className="relative overflow-hidden py-[clamp(40px,5vw,70px)]"
		>
			<div className="pointer-events-none absolute -right-24 -top-24 size-[400px] rounded-full bg-[radial-gradient(circle,rgba(207,28,32,0.22),transparent_60%)]" />
			<div className="wrap grid gap-4.5">
				{props.cards.map((c, i) => {
					const variant = stegaClean(c.variant || 'neutral') as
						| 'coral'
						| 'ink'
						| 'neutral'
					const ic =
						variant === 'coral'
							? 'bg-coral text-paper'
							: variant === 'ink'
								? 'bg-coral-soft text-ink'
								: 'bg-coral-tint text-coral-deep'

					const wrap = cn(
						'bg-paper border-line hover:border-coral grid grid-cols-[60px_1fr] items-center gap-5 rounded-card border p-7 max-sm:p-5 no-underline transition-[transform,border-color] duration-300 hover:-translate-y-1',
						variant === 'ink' && 'bg-ink text-paper border-ink',
					)

					const inner = (
						<>
							<span className={cn('grid size-15 place-items-center rounded-[18px]', ic)}>
								<Icon name={c.icon} size={22} />
							</span>
							<div>
								{c.label && (
									<div
										className={cn(
											'text-mute text-[12px] font-semibold uppercase tracking-[0.08em]',
											variant === 'ink' && 'text-paper/60',
										)}
									>
										{c.label}
									</div>
								)}
								{c.value && (
									<div
										className={cn(
											'text-ink font-display mt-1.5 text-[22px] font-bold leading-tight -tracking-[0.015em]',
											variant === 'ink' && 'text-paper',
										)}
									>
										{c.value}
									</div>
								)}
								{c.small && (
									<div
										className={cn(
											'text-mute mt-1.5 text-[13.5px] font-normal',
											variant === 'ink' && 'text-paper/60',
										)}
									>
										{c.small}
									</div>
								)}
							</div>
						</>
					)

					const url = href(c.link)
					return url ? (
						<Link key={c._key ?? i} href={url} className={wrap}>
							{inner}
						</Link>
					) : (
						<div key={c._key ?? i} className={wrap}>
							{inner}
						</div>
					)
				})}
			</div>
		</section>
	)
}
