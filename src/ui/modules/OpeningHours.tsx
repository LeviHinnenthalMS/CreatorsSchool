import moduleProps from '@/lib/moduleProps'
import Eyebrow from '@/ui/creators/Eyebrow'
import RichTitle from '@/ui/creators/RichTitle'
import Icon from '@/ui/creators/Icon'
import { cn } from '@/lib/utils'
import { getSite } from '@/sanity/lib/queries'
import type { SanityModule } from '@/sanity/typeHelpers'

type HourRow = {
	_key?: string
	dayKey?: string | null
	label?: string | null
	open?: string | null
	close?: string | null
	closed?: boolean | null
}

type Block = {
	_type?: string
	children?: Array<{ text?: string; marks?: string[] }>
}

type Props = SanityModule & {
	eyebrow?: string | null
	title?: Block[] | null
	text?: string | null
	hours?: HourRow[] | null
}

function getTodayKey(): string {
	const short = new Intl.DateTimeFormat('de-DE', {
		weekday: 'short',
		timeZone: 'Europe/Berlin',
	}).format(new Date())
	return short.toLowerCase().replace('.', '')
}

function formatPhoneDisplay(digits?: string | null) {
	if (!digits) return null
	const clean = digits.replace(/\D/g, '')
	// e.g. 4915208993894 → +49 152 08993894
	if (clean.startsWith('49') && clean.length > 4) {
		return `+49 ${clean.slice(2, 5)} ${clean.slice(5)}`
	}
	return `+${clean}`
}

type Channel = {
	key: string
	icon: string
	label: string
	value: string
	href: string
	external?: boolean
}

export default async function OpeningHours(props: Props) {
	const hasHours = !!props.hours?.length
	if (!hasHours && !props.title?.length && !props.text && !props.eyebrow) return null

	const todayKey = getTodayKey()

	const site = hasHours
		? null
		: ((await getSite()) as {
				phone?: string | null
				phoneTel?: string | null
				whatsapp?: string | null
				email?: string | null
		  })

	const channels: Channel[] = []
	if (site) {
		if (site.email) {
			channels.push({
				key: 'email',
				icon: 'mail',
				label: 'E-Mail',
				value: site.email,
				href: `mailto:${site.email}`,
			})
		}
		if (site.whatsapp) {
			const display = formatPhoneDisplay(site.whatsapp) ?? site.whatsapp
			channels.push({
				key: 'whatsapp',
				icon: 'whatsapp',
				label: 'WhatsApp',
				value: display,
				href: `https://wa.me/${site.whatsapp.replace(/\D/g, '')}`,
				external: true,
			})
		}
		if (site.phone || site.phoneTel) {
			const tel = (site.phoneTel || site.phone || '').replace(/\s/g, '')
			channels.push({
				key: 'phone',
				icon: 'phone',
				label: 'Telefon',
				value: site.phone || tel,
				href: `tel:${tel}`,
			})
		}
	}

	const hasChannels = channels.length > 0
	const twoCol = hasHours || hasChannels

	return (
		<section
			{...moduleProps(props)}
			className="bg-ink rounded-band relative mx-auto mt-[clamp(25px,3vw,45px)] mb-[clamp(50px,6vw,90px)] w-[calc(100%-clamp(40px,7vw,96px))] max-w-[1440px] overflow-hidden py-[clamp(40px,4vw,64px)]"
		>
			{/* Subtle red glow top-right */}
			<span
				aria-hidden
				className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_45%_at_calc(100%+5%)_-5%,rgba(207,28,32,0.32),transparent)]"
			/>

			<div
				className={cn(
					'wrap relative z-10 grid gap-[clamp(48px,6vw,80px)]',
					twoCol && 'lg:grid-cols-[2fr_3fr] lg:items-center',
				)}
			>
				{/* Left */}
				<div>
					{props.eyebrow && <Eyebrow tone="blush">{props.eyebrow}</Eyebrow>}
					<RichTitle
						title={props.title}
						as="h2"
						tone="blush"
						className="text-paper font-display m-0 mt-3 text-[clamp(34px,4.5vw,56px)] leading-[1.02] font-bold -tracking-[0.025em]"
					/>
					{props.text && (
						<p className="text-paper/45 mt-5 max-w-[40ch] text-[15px] leading-relaxed">
							{props.text}
						</p>
					)}
				</div>

				{/* Right: hours grid OR contact channels */}
				{hasHours ? (
					<div className="flex flex-col">
						{props.hours!.map((row, i) => {
							const isToday = row.dayKey === todayKey
							const isClosed = !!row.closed

							return (
								<div
									key={row._key ?? i}
									className={cn(
										'grid grid-cols-[1fr_auto] grid-rows-[auto_auto] items-center gap-x-3 gap-y-1 px-4 py-3',
										'sm:grid-cols-[160px_1fr_auto] sm:grid-rows-1 sm:gap-x-6 sm:px-6 sm:py-[18px]',
										isToday
											? 'rounded-[14px] bg-white/[0.07]'
											: 'border-t border-white/[0.07] first:border-t-0',
									)}
								>
									<span className="flex items-center gap-2 sm:col-[1] sm:row-[1]">
										{isToday && (
											<span
												aria-hidden
												className="bg-coral inline-block size-[7px] shrink-0 rounded-full"
											/>
										)}
										<span className="font-display text-paper text-[15px] leading-none font-bold sm:text-[16px]">
											{row.label}
										</span>
									</span>

									<span className="text-paper/80 col-[2] row-[1] inline-flex items-center justify-center rounded-full border border-white/20 bg-white/10 px-2.5 py-1 text-[10px] font-bold tracking-[0.07em] uppercase sm:col-[3] sm:px-3.5 sm:py-1.5 sm:text-[11px]">
											{isToday ? 'Heute' : isClosed ? 'Zu' : 'Offen'}
										</span>

									<span
										className={cn(
											'text-paper/70 col-span-2 row-[2] text-[13px] sm:col-[2] sm:col-span-1 sm:row-[1] sm:text-[15px]',
											isClosed && 'italic',
										)}
									>
										{isClosed ? 'geschlossen' : `${row.open} – ${row.close} Uhr`}
									</span>
								</div>
							)
						})}
					</div>
				) : hasChannels ? (
					<ul className="grid gap-3 sm:gap-4">
						{channels.map((c) => (
							<li key={c.key}>
								<a
									href={c.href}
									{...(c.external
										? { target: '_blank', rel: 'noopener noreferrer' }
										: {})}
									className={cn(
										'group border-paper/10 hover:border-paper/25 hover:bg-paper/[0.04] focus-visible:outline-coral',
										'grid grid-cols-[52px_1fr_auto] items-center gap-4 rounded-[18px] border px-5 py-4',
										'transition motion-safe:duration-200 focus-visible:outline-2 focus-visible:outline-offset-2',
										'sm:px-6 sm:py-5',
									)}
								>
									<span
										aria-hidden
										className="bg-coral/15 text-coral grid size-[52px] place-items-center rounded-full transition motion-safe:group-hover:scale-[1.04]"
									>
										<Icon name={c.icon} size={22} />
									</span>
									<span className="min-w-0">
										<span className="text-paper/55 block text-[11px] font-bold tracking-[0.09em] uppercase">
											{c.label}
										</span>
										<span className="text-paper font-display block truncate text-[18px] leading-tight font-bold sm:text-[20px]">
											{c.value}
										</span>
									</span>
									<span
										aria-hidden
										className="text-paper/40 group-hover:text-paper transition motion-safe:group-hover:translate-x-1"
									>
										<Icon name="arrow" size={18} />
									</span>
								</a>
							</li>
						))}
					</ul>
				) : null}
			</div>
		</section>
	)
}
