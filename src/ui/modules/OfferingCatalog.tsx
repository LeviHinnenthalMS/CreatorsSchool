'use client'

import Link from 'next/link'
import { useState } from 'react'
import { cn } from '@/lib/utils'
import { DEFAULT_LANG } from '@/lib/i18n'
import type { OfferingListItem } from '@/sanity/lib/creators'
import { Img } from '@/ui/Img'

const FILTER_LABELS: Record<string, string> = {
	alle: 'Alle',
	musik: 'Musik',
	tanz: 'Tanz',
	frueh: 'Frühförderung',
	erwachsene: 'Erwachsene',
	einzelunterricht: 'Einzelunterricht',
}

const FILTER_ORDER = ['alle', 'musik', 'tanz', 'frueh', 'erwachsene', 'einzelunterricht']

// inline SVGs to avoid Icon dependency in client bundle
function ClockIcon() {
	return (
		<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" aria-hidden className="size-3.5 shrink-0">
			<circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>
		</svg>
	)
}
function UsersIcon() {
	return (
		<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" aria-hidden className="size-3.5 shrink-0">
			<path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/>
			<path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/>
		</svg>
	)
}
function CalIcon() {
	return (
		<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" aria-hidden className="size-3.5 shrink-0">
			<rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/>
			<line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/>
		</svg>
	)
}

const META_ICONS = [<ClockIcon key="c" />, <UsersIcon key="u" />, <CalIcon key="k" />]

function probeHref(
	kontaktHref: string,
	title: string | null | undefined,
	ageFact: string | null | undefined,
) {
	const base = kontaktHref.split('#')[0].split('?')[0]
	const params = new URLSearchParams()
	if (title) params.set('kurs', title)
	if (ageFact) params.set('alter', ageFact)
	const qs = params.toString() ? `?${params.toString()}` : ''
	return `${base}${qs}#kontaktformular`
}

function offeringHref(o: OfferingListItem) {
	if (!o.slug) return '#'
	const lang = o.language && o.language !== DEFAULT_LANG ? `/${o.language}` : ''
	return `${lang}/angebote/${o.slug}`
}

// Split title into [regular, italic-coral] parts
function splitTitle(title: string): [string, string] {
	if (title.includes(' — ')) {
		const idx = title.lastIndexOf(' — ')
		return [title.slice(0, idx), title.slice(idx + 3)]
	}
	const idx = title.lastIndexOf(' ')
	if (idx === -1) return [title, '']
	return [title.slice(0, idx), title.slice(idx + 1)]
}

type Props = { items: OfferingListItem[]; kontaktHref: string }

export default function OfferingCatalog({ items, kontaktHref }: Props) {
	const [active, setActive] = useState('alle')

	const catCounts: Record<string, number> = { alle: items.length }
	for (const o of items) {
		for (const c of o.categories ?? []) {
			catCounts[c] = (catCounts[c] ?? 0) + 1
		}
	}

	const filters = FILTER_ORDER.filter((k) => k === 'alle' || (catCounts[k] ?? 0) >= 1)

	const visible =
		active === 'alle'
			? items
			: items.filter((o) => o.categories?.includes(active))

	return (
		<div>
			{/* Filter pills */}
			<div className="mb-14 flex flex-wrap gap-2.5" role="group" aria-label="Angebote filtern">
				{filters.map((f) => {
					const isActive = active === f
					return (
						<button
							key={f}
							onClick={() => setActive(f)}
							aria-pressed={isActive}
							className={cn(
								'inline-flex items-center gap-2.5 rounded-full border px-5 py-2.5 text-[14px] font-semibold transition-colors',
								isActive
									? 'bg-ink text-paper border-ink'
									: 'bg-paper border-line-2 text-charcoal hover:border-charcoal',
							)}
						>
							{FILTER_LABELS[f] ?? f}
							<span
								className={cn(
									'grid min-w-[26px] place-items-center rounded-full px-1.5 py-0.5 text-[12px] font-bold leading-none',
									isActive
										? 'bg-coral text-paper'
										: 'bg-paper-3 text-charcoal',
								)}
							>
								{String(catCounts[f] ?? 0).padStart(2, '0')}
							</span>
						</button>
					)
				})}
			</div>

			{/* Cards */}
			<div className="flex flex-col gap-5">
				{visible.map((o, i) => {
					const dark = i % 2 === 0
					const [titleMain, titleItalic] = splitTitle(o.title ?? '')
					const letter = o.decorativeLetter ?? titleItalic?.[0]?.toLowerCase() ?? '·'
					const tag = o.catalogTag ?? o.facts?.[0]?.value
					const metaRows = o.detailRows?.slice(0, 3) ?? []
					const ageFact = o.facts?.find((f) =>
						/alter|age/i.test(f.key ?? ''),
					)?.value

					return (
						<div
							key={o._id}
							className={cn(
								'flex flex-col overflow-hidden rounded-[22px] lg:flex-row',
								dark ? 'bg-ink' : 'bg-paper border border-line',
							)}
						>
							{/* Left image box */}
							<div className="p-3 lg:p-4 shrink-0 lg:w-[222px]">
								<div className="relative min-h-[120px] w-full overflow-hidden rounded-[18px] lg:h-full lg:min-h-[160px]">
									{o.heroImage?.asset ? (
										<Img
											image={o.heroImage}
											width={420}
											className="absolute inset-0 h-full w-full object-cover"
											alt={o.heroImage.alt ?? o.title ?? ''}
										/>
									) : (
										<div
											className="flex h-full min-h-[120px] w-full flex-col p-5 lg:min-h-[160px]"
											style={{ background: 'var(--color-coral)' }}
										>
											<span className="font-display text-[13px] font-bold tracking-[0.06em] text-white/80">
												N° {String(i + 1).padStart(2, '0')}
											</span>
											<span
												aria-hidden
												className={cn(
													'font-display absolute bottom-4 left-0 right-0 select-none text-center font-bold leading-none',
													dark ? 'text-white/20' : 'text-ink/20',
												)}
												style={{ fontSize: 'clamp(80px,9vw,108px)', fontStyle: 'italic' }}
											>
												{letter}
											</span>
										</div>
									)}
								</div>
							</div>

							{/* Middle content */}
							<div className="flex flex-1 flex-col justify-center gap-3 p-7 lg:py-9">
								{tag && (
									<span
										className={cn(
											'inline-flex w-fit items-center gap-2 rounded-full px-4 py-1.5 text-[12.5px] font-semibold',
											dark
												? 'bg-white/10 text-white/75'
												: 'bg-paper-3 text-charcoal',
										)}
									>
										<span aria-hidden className="bg-coral inline-block size-1.5 rounded-full" />
										{tag}
									</span>
								)}

								{o.title && (
									<h3
										className={cn(
											'font-display m-0 text-[clamp(22px,2.4vw,30px)] font-bold leading-tight -tracking-[0.02em]',
											dark ? 'text-paper' : 'text-ink',
										)}
									>
										{titleMain}{titleItalic ? <> <em className="text-coral not-italic" style={{ fontStyle: 'italic', fontFamily: 'var(--font-display)' }}>{titleItalic}</em></> : null}
									</h3>
								)}

								{o.lede && (
									<p
										className={cn(
											'm-0 text-[14.5px] leading-relaxed',
											dark ? 'text-white/60' : 'text-charcoal',
										)}
									>
										{o.lede}
									</p>
								)}

								{metaRows.length > 0 && (
									<div className="mt-1 flex flex-wrap gap-x-6 gap-y-1.5">
										{metaRows.map((row, ri) => (
											<span
												key={row._key ?? ri}
												className={cn(
													'inline-flex items-center gap-1.5 text-[13px]',
													dark ? 'text-white/40' : 'text-mute',
												)}
											>
												{META_ICONS[ri]}
												{row.value}
											</span>
										))}
									</div>
								)}
							</div>

							{/* Right price panel */}
							<div className="p-3 lg:p-4 shrink-0 lg:w-[238px]">
							<div
								className={cn(
									'flex h-full flex-col justify-center gap-5 rounded-[18px] p-6',
									dark ? 'bg-ink-2' : 'bg-paper-2',
								)}
							>
								{o.priceValue && (
									<div>
										{o.priceLabel && (
											<p
												className={cn(
													'm-0 text-[10px] font-bold tracking-[0.1em] uppercase',
													dark ? 'text-white/35' : 'text-mute',
												)}
											>
												{o.priceLabel}
											</p>
										)}
										<p className="m-0 flex items-baseline gap-1 leading-none">
											{o.priceCurrency && (
												<span className={cn('font-display text-[20px] font-bold', dark ? 'text-white/70' : 'text-charcoal')}>
													{o.priceCurrency}
												</span>
											)}
											<span className={cn('font-display text-[clamp(32px,3.5vw,44px)] font-bold -tracking-[0.02em]', dark ? 'text-paper' : 'text-ink')}>
												{o.priceValue}
											</span>
											{o.priceUnit && (
												<span className={cn('text-[14px] font-normal', dark ? 'text-white/40' : 'text-mute')}>
													{o.priceUnit}
												</span>
											)}
										</p>
									</div>
								)}

								<div className="flex flex-col gap-2.5">
									<Link
										href={probeHref(kontaktHref, o.title, ageFact)}
										className={cn(
											'rounded-full px-5 py-3 text-center text-[13.5px] font-semibold no-underline transition-colors',
											dark
												? 'bg-coral text-paper hover:bg-coral-deep'
												: 'bg-ink text-paper hover:bg-ink-2',
										)}
									>
										Probestunde
									</Link>
									<Link
										href={offeringHref(o)}
										className={cn(
											'rounded-full border px-5 py-3 text-center text-[13.5px] font-semibold no-underline transition-colors',
											dark
												? 'border-white/20 text-paper hover:border-white/50'
												: 'border-line-2 text-ink hover:border-charcoal',
										)}
									>
										Details
									</Link>
								</div>
							</div>
							</div>
						</div>
					)
				})}
			</div>
		</div>
	)
}
