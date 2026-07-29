'use client'

import { useState } from 'react'
import { cn } from '@/lib/utils'
import { Icon } from '@/ui/creators/Icon'
import { stegaClean } from 'next-sanity'
import type { ScheduleSlotResult } from '@/sanity/lib/creators'

type Filter = 'all' | 'musik' | 'tanz' | 'frueh' | 'erwachsene'

type FilterLabels = Record<Filter, string>
type StatusLabels = { open: string; few: string; full: string }

const WEEKDAY_FULL: Record<string, [string, string]> = {
	mo: ['Mo', 'ntag'],
	di: ['Di', 'enstag'],
	mi: ['Mi', 'ttwoch'],
	do: ['Do', 'nnerstag'],
	fr: ['Fr', 'eitag'],
	sa: ['Sa', 'mstag'],
	so: ['So', 'nntag'],
}

function weekdayLabel(weekday?: string | null) {
	const cleanWeekday = stegaClean(weekday ?? '')
	const parts = WEEKDAY_FULL[cleanWeekday]
	return parts ? parts.join('') : cleanWeekday
}

function getTodayKey() {
	return new Intl.DateTimeFormat('de-DE', {
		weekday: 'short',
		timeZone: 'Europe/Berlin',
	})
		.format(new Date())
		.toLowerCase()
		.replace('.', '')
}

function matches(slot: ScheduleSlotResult, f: Filter) {
	if (f === 'all') return true
	const bereich = stegaClean(slot.bereich ?? '')
	const cats = (slot.categories ?? []).map((c) => stegaClean(c))
	if (f === 'musik') return bereich === 'musik' || bereich === 'instrument'
	if (f === 'tanz') return bereich === 'tanz'
	return cats.includes(f)
}

function ageLabel(slot: ScheduleSlotResult) {
	return [slot.ageRange, slot.subInfo].filter(Boolean).join(' · ')
}

export default function ScheduleFilter({
	slots,
	filterLabels,
	layout = 'preview',
	detailHref,
	emptyText,
}: {
	slots: ScheduleSlotResult[]
	filterLabels: FilterLabels
	statusLabels: StatusLabels
	layout?: 'preview' | 'full'
	detailHref?: string
	emptyText?: string
}) {
	const [active, setActive] = useState<Filter>('all')
	const todayKey = getTodayKey()
	const filters: Filter[] = ['all', 'musik', 'tanz', 'frueh', 'erwachsene']
	const visible = slots.filter((s) => matches(s, active))

	const Filters = (
		<div
			className={cn(
				layout === 'full'
					? 'border-line md:bg-paper flex w-full [scrollbar-width:none] flex-nowrap gap-2 overflow-x-auto px-0.5 pb-2 md:w-fit md:flex-wrap md:overflow-visible md:rounded-full md:border md:p-2 md:shadow-sm [&::-webkit-scrollbar]:hidden'
					: 'bg-paper border-line flex w-fit flex-wrap gap-2 rounded-full border p-2 shadow-sm',
			)}
		>
			{filters.map((f) => (
				<button
					key={f}
					type="button"
					aria-pressed={active === f}
					onClick={() => setActive(f)}
					className={cn(
						'shrink-0 rounded-full font-semibold transition-colors',
						layout === 'full'
							? 'px-4 py-2 text-[13px] md:px-5 md:py-2.5 md:text-[13.5px]'
							: 'px-5 py-2.5 text-[13.5px]',
						active === f
							? 'bg-ink text-paper'
							: 'text-ink-2 hover:bg-paper-2 bg-transparent',
						layout === 'full' &&
							active !== f &&
							'bg-paper ring-line ring-1 ring-inset md:bg-transparent md:ring-0',
					)}
				>
					{filterLabels[f]}
				</button>
			))}
		</div>
	)

	if (layout === 'full') {
		const byDay = visible.reduce<Record<string, ScheduleSlotResult[]>>(
			(acc, slot) => {
				const day = stegaClean(slot.weekday || 'mo')
				;(acc[day] ||= []).push(slot)
				return acc
			},
			{},
		)
		const order = ['mo', 'di', 'mi', 'do', 'fr', 'sa', 'so']
		const scheduledDays = new Set(
			slots.map((slot) => stegaClean(slot.weekday || 'mo')),
		)
		const days = order.filter((d) => scheduledDays.has(d))

		return (
			<>
				<div className="mt-9">{Filters}</div>

				<div className="mt-10 grid gap-4 md:grid-cols-2 xl:grid-cols-5">
					{days.length === 0 && (
						<p className="text-mute text-center text-[15px] md:col-span-2 xl:col-span-5">
							{emptyText || 'Keine Termine für diesen Filter.'}
						</p>
					)}
					{days.map((d) => {
						const list = byDay[d] ?? []
						const isToday = d === todayKey
						return (
							<section
								key={d}
								className={cn(
									'bg-paper border-line flex min-h-40 flex-col overflow-hidden rounded-[20px] border',
									isToday &&
										'border-coral/40 shadow-[0_12px_32px_-26px_var(--color-coral)]',
								)}
							>
								<header
									className={cn(
										'bg-paper-2 border-line flex items-center justify-between gap-3 border-b px-4 py-3.5',
										isToday && 'bg-coral-tint',
									)}
								>
									<h2 className="text-ink font-display m-0 flex items-center gap-2 text-[21px] leading-none font-bold -tracking-[0.02em]">
										{isToday && (
											<span
												aria-hidden
												className="bg-coral inline-block size-[7px] shrink-0 rounded-full"
											/>
										)}
										{weekdayLabel(d)}
									</h2>
									<span
										className={cn(
											'bg-paper border-line text-mute rounded-full border px-2.5 py-1 text-[11.5px] font-semibold',
											isToday &&
												'border-coral/20 bg-paper text-coral-deep tracking-[0.05em] uppercase',
										)}
									>
										{isToday ? 'Heute' : list.length}
									</span>
								</header>
								<div className="flex flex-1 flex-col">
									{list.length > 0 ? (
										list.map((slot) => (
											<CalendarSlot
												key={slot._id}
												slot={slot}
												href={detailHref}
											/>
										))
									) : (
										<p className="text-mute m-auto px-4 py-8 text-center text-[12.5px]">
											Keine Kurse
										</p>
									)}
								</div>
							</section>
						)
					})}
				</div>
			</>
		)
	}

	return (
		<>
			<div className="mb-7">{Filters}</div>

			<div className="bg-paper border-line rounded-panel overflow-hidden border">
				{visible.length === 0 && (
					<div className="text-mute px-7 py-12 text-center text-[15px]">
						{emptyText || 'Keine Termine für diesen Filter.'}
					</div>
				)}
				{visible.map((slot) => (
					<SlotRow key={slot._id} slot={slot} href={detailHref} />
				))}
			</div>
		</>
	)
}

function SlotRow({ slot, href }: { slot: ScheduleSlotResult; href?: string }) {
	const bereich = stegaClean(slot.bereich ?? '')

	const bereichBar =
		bereich === 'tanz'
			? 'bg-coral'
			: bereich === 'instrument'
				? 'bg-ink'
				: 'bg-mute'

	const Wrapper: 'a' | 'div' = href ? 'a' : 'div'
	const wrapperProps = href ? { href } : {}

	return (
		<Wrapper
			{...wrapperProps}
			className="border-line hover:bg-paper-2 text-ink grid grid-cols-[14px_1fr_70px] items-center gap-3.5 border-b px-4.5 py-4.5 no-underline last:border-b-0 md:grid-cols-[56px_1.7fr_1fr_1fr_100px] md:gap-6 md:px-7 md:py-5"
		>
			<span
				className={cn('h-9 w-1.5 justify-self-center rounded', bereichBar)}
			/>
			<h3 className="text-ink font-display m-0 text-[18px] leading-tight font-semibold -tracking-[0.01em]">
				{slot.name}
				<span className="text-coral-deep font-body mt-1 block text-[13.5px] font-semibold md:hidden">
					{weekdayLabel(slot.weekday)} · {slot.time} Uhr
				</span>
				{slot.ageRange && (
					<span className="text-mute font-body mt-0.5 block text-[13.5px] font-medium">
						{ageLabel(slot)}
					</span>
				)}
			</h3>
			<span className="text-mute hidden text-[14px] md:block">
				<strong className="text-ink font-semibold">
					{weekdayLabel(slot.weekday)}
				</strong>{' '}
				· {slot.time}
			</span>
			<span className="text-mute hidden text-[14px] md:block">
				{slot.room && (
					<strong className="text-ink font-semibold">{slot.room}</strong>
				)}
				{slot.teacher?.name && ` · ${slot.teacher.name}`}
			</span>
			<span
				className={cn(
					'justify-self-end rounded-full px-3 py-1.5 text-[11.5px] font-bold tracking-[0.06em] uppercase',
					bereich === 'tanz'
						? 'bg-blush text-coral-deep'
						: 'bg-paper-2 text-charcoal border-line border',
				)}
			>
				{bereich === 'tanz'
					? 'Tanz'
					: bereich === 'instrument'
						? 'Instrument'
						: 'Musik'}
			</span>
		</Wrapper>
	)
}

function CalendarSlot({
	slot,
	href,
}: {
	slot: ScheduleSlotResult
	href?: string
}) {
	const Wrapper: 'a' | 'div' = href ? 'a' : 'div'
	const wrapperProps = href ? { href } : {}

	return (
		<Wrapper
			{...wrapperProps}
			className="border-line text-ink hover:bg-paper-2 block border-b px-4 py-3.5 no-underline transition-colors last:border-b-0"
		>
			<div className="flex items-baseline justify-between gap-3">
				<time className="font-display text-[18px] leading-none font-bold -tracking-[0.02em]">
					{slot.time}
				</time>
				{slot.duration && (
					<span className="text-mute text-[10.5px] font-semibold tracking-[0.05em] uppercase">
						{slot.duration}
					</span>
				)}
			</div>
			<h3 className="font-display mt-2.5 text-[16px] leading-tight font-bold -tracking-[0.01em]">
				{slot.name}
			</h3>
			{(slot.ageRange || slot.subInfo) && (
				<p className="text-coral-deep mt-1 text-[12px] font-semibold">
					{ageLabel(slot)}
				</p>
			)}
			{(slot.room || slot.teacher?.name) && (
				<div className="text-mute mt-2 flex items-center gap-1.5 text-[11.5px]">
					<Icon name="pin" size={12} />
					<span>
						{slot.room}
						{slot.teacher?.name && ` · ${slot.teacher.name}`}
					</span>
				</div>
			)}
		</Wrapper>
	)
}
