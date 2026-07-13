import moduleProps from '@/lib/moduleProps'
import Eyebrow from '@/ui/creators/Eyebrow'
import RichTitle from '@/ui/creators/RichTitle'
import { cn } from '@/lib/utils'
import type { SanityModule } from '@/sanity/typeHelpers'

type HourRow = {
	_key?: string
	dayKey?: string | null
	label?: string | null
	open?: string | null
	close?: string | null
	closed?: boolean | null
}

type Block = { _type?: string; children?: Array<{ text?: string; marks?: string[] }> }

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

export default function OpeningHours(props: Props) {
	if (!props.hours?.length) return null

	const todayKey = getTodayKey()

	return (
		<section
			{...moduleProps(props)}
			className="bg-ink relative mx-[clamp(8px,1.5vw,24px)] mb-[clamp(40px,5vw,70px)] overflow-hidden rounded-band py-[clamp(40px,4vw,64px)]"
		>
			{/* Subtle red glow top-right */}
			<span
				aria-hidden
				className="pointer-events-none absolute -right-24 -top-24 size-[400px] rounded-full bg-[radial-gradient(circle,rgba(207,28,32,0.22),transparent_60%)]"
			/>

			<div className="wrap relative z-10 grid gap-[clamp(48px,6vw,80px)] lg:grid-cols-[2fr_3fr] lg:items-center">
				{/* Left */}
				<div>
					{props.eyebrow && <Eyebrow tone="blush">{props.eyebrow}</Eyebrow>}
					<RichTitle
						title={props.title}
						as="h2"
						tone="blush"
						className="text-paper font-display m-0 mt-3 text-[clamp(34px,4.5vw,56px)] font-bold leading-[1.02] -tracking-[0.025em]"
					/>
					{props.text && (
						<p className="text-paper/45 mt-5 max-w-[40ch] text-[15px] leading-relaxed">
							{props.text}
						</p>
					)}
				</div>

				{/* Right: hours */}
				<div className="flex flex-col">
					{props.hours.map((row, i) => {
						const isToday = row.dayKey === todayKey
						const isClosed = !!row.closed

						return (
							<div
								key={row._key ?? i}
								className={cn(
									'grid grid-cols-[160px_1fr_auto] items-center gap-x-6 px-6 py-[18px]',
									isToday
										? 'rounded-[14px] bg-white/[0.07]'
										: 'border-t border-white/[0.07] first:border-t-0',
								)}
							>
								{/* Day name */}
								<span className="flex items-center gap-2.5">
									{isToday && (
										<span
											aria-hidden
											className="bg-coral inline-block size-[7px] shrink-0 rounded-full"
										/>
									)}
									<span className="font-display text-[16px] font-bold leading-none text-paper">
										{row.label}
									</span>
								</span>

								{/* Time */}
								<span className={cn('text-[15px] text-paper/70', isClosed && 'italic')}>
									{isClosed ? 'geschlossen' : `${row.open} – ${row.close} Uhr`}
								</span>

								{/* Badge */}
								<span className="inline-flex items-center rounded-full border border-white/20 bg-white/10 px-3.5 py-1.5 text-[11px] font-bold uppercase tracking-[0.07em] text-paper/80">
									{isToday ? 'Heute geöffnet' : isClosed ? 'Geschlossen' : 'Geöffnet'}
								</span>
							</div>
						)
					})}
				</div>
			</div>
		</section>
	)
}
