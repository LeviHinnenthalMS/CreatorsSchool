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
			className="bg-ink relative mx-[clamp(20px,3.5vw,48px)] mb-[clamp(50px,6vw,90px)] mt-[clamp(25px,3vw,45px)] overflow-hidden rounded-band py-[clamp(40px,4vw,64px)]"
		>
			{/* Subtle red glow top-right */}
			<span
				aria-hidden
				className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_45%_at_calc(100%+5%)_-5%,rgba(207,28,32,0.32),transparent)]"
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
									'grid grid-cols-[1fr_auto] grid-rows-[auto_auto] items-center gap-x-3 gap-y-1 px-4 py-3',
									'sm:grid-cols-[160px_1fr_auto] sm:grid-rows-1 sm:gap-x-6 sm:px-6 sm:py-[18px]',
									isToday
										? 'rounded-[14px] bg-white/[0.07]'
										: 'border-t border-white/[0.07] first:border-t-0',
								)}
							>
								{/* Day name — col1 row1 always */}
								<span className="flex items-center gap-2 sm:col-[1] sm:row-[1]">
									{isToday && (
										<span
											aria-hidden
											className="bg-coral inline-block size-[7px] shrink-0 rounded-full"
										/>
									)}
									<span className="font-display text-[15px] font-bold leading-none text-paper sm:text-[16px]">
										{row.label}
									</span>
								</span>

								{/* Badge — col2 row1 on mobile, col3 on sm */}
								<span className="col-[2] row-[1] inline-flex items-center justify-center rounded-full border border-white/20 bg-white/10 px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.07em] text-paper/80 sm:col-[3] sm:px-3.5 sm:py-1.5 sm:text-[11px]">
									{isToday ? 'Heute' : isClosed ? 'Zu' : 'Offen'}
								</span>

								{/* Time — spans both cols row2 on mobile, col2 on sm */}
								<span
									className={cn(
										'col-span-2 row-[2] text-[13px] text-paper/70 sm:col-[2] sm:col-span-1 sm:row-[1] sm:text-[15px]',
										isClosed && 'italic',
									)}
								>
									{isClosed ? 'geschlossen' : `${row.open} – ${row.close} Uhr`}
								</span>
							</div>
						)
					})}
				</div>
			</div>
		</section>
	)
}
