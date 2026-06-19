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

function matches(slot: ScheduleSlotResult, f: Filter) {
	if (f === 'all') return true
	const bereich = stegaClean(slot.bereich ?? '')
	const cats = (slot.categories ?? []).map((c) => stegaClean(c))
	if (f === 'musik') return bereich === 'musik' || bereich === 'instrument'
	if (f === 'tanz') return bereich === 'tanz'
	return cats.includes(f)
}

function statusKey(s?: string | null): 'open' | 'few' | 'full' {
	const v = stegaClean(s ?? 'open')
	return v === 'few' || v === 'full' ? v : 'open'
}

function ageLabel(slot: ScheduleSlotResult) {
	return [slot.ageRange, slot.subInfo].filter(Boolean).join(' · ')
}

export default function ScheduleFilter({
	slots,
	filterLabels,
	statusLabels,
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
	const filters: Filter[] = ['all', 'musik', 'tanz', 'frueh', 'erwachsene']
	const visible = slots.filter((s) => matches(s, active))

	const Filters = (
		<div className="bg-paper border-line shadow-sm flex w-fit flex-wrap gap-2 rounded-full border p-2">
			{filters.map((f) => (
				<button
					key={f}
					type="button"
					aria-pressed={active === f}
					onClick={() => setActive(f)}
					className={cn(
						'rounded-full px-5 py-2.5 text-[13.5px] font-semibold transition-colors',
						active === f
							? 'bg-ink text-paper'
							: 'text-ink-2 hover:bg-paper-2 bg-transparent',
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
		const days = order.filter((d) => byDay[d]?.length)

		return (
			<>
				<div className="mt-9">{Filters}</div>

				<div className="mt-12 space-y-[clamp(32px,4vw,48px)]">
					{days.length === 0 && (
						<p className="text-mute text-center text-[15px]">
							{emptyText || 'Keine Termine für diesen Filter.'}
						</p>
					)}
					{days.map((d) => {
						const [it, rest] = WEEKDAY_FULL[d] || [d, '']
						const list = byDay[d]
						return (
							<div key={d}>
								<div className="border-line-2 mb-4.5 flex items-baseline gap-5 border-b-2 border-dashed pb-4">
									<div className="text-ink font-display text-[clamp(36px,4.5vw,56px)] font-bold leading-none -tracking-[0.03em]">
										<span className="text-coral font-medium italic">{it}</span>
										{rest}
									</div>
									<span className="bg-paper-2 border-line text-ink-2 ml-auto rounded-full border px-3.5 py-1.5 text-[13px] font-semibold">
										{list.length}
									</span>
								</div>
								<div className="space-y-2.5">
									{list.map((slot) => (
										<SlotRow
											key={slot._id}
											slot={slot}
											statusLabels={statusLabels}
											href={detailHref}
											variant="full"
										/>
									))}
								</div>
							</div>
						)
					})}
				</div>
			</>
		)
	}

	return (
		<>
			<div className="mb-7">{Filters}</div>

			<div className="bg-paper border-line overflow-hidden rounded-panel border">
				{visible.length === 0 && (
					<div className="text-mute px-7 py-12 text-center text-[15px]">
						{emptyText || 'Keine Termine für diesen Filter.'}
					</div>
				)}
				{visible.map((slot) => (
					<SlotRow
						key={slot._id}
						slot={slot}
						statusLabels={statusLabels}
						href={detailHref}
						variant="preview"
					/>
				))}
			</div>
		</>
	)
}

function SlotRow({
	slot,
	statusLabels,
	href,
	variant,
}: {
	slot: ScheduleSlotResult
	statusLabels: StatusLabels
	href?: string
	variant: 'preview' | 'full'
}) {
	const bereich = stegaClean(slot.bereich ?? '')
	const status = statusKey(slot.status)
	const statusBg =
		status === 'open'
			? 'bg-warm-white text-ink-2'
			: status === 'few'
				? 'bg-coral-tint text-coral-deep'
				: 'bg-coral-tint text-coral-deep'

	const bereichBar =
		bereich === 'tanz' ? 'bg-coral' : bereich === 'instrument' ? 'bg-ink' : 'bg-mute'

	const Wrapper: 'a' | 'div' = href ? 'a' : 'div'
	const wrapperProps = href ? { href } : {}

	if (variant === 'preview') {
		return (
			<Wrapper
				{...wrapperProps}
				className="border-line hover:bg-paper-2 grid grid-cols-[14px_1fr_70px] items-center gap-3.5 border-b px-4.5 py-4.5 text-ink no-underline last:border-b-0 md:grid-cols-[56px_1.7fr_1fr_1fr_100px] md:gap-6 md:px-7 md:py-5"
			>
				<span className={cn('h-9 w-1.5 justify-self-center rounded', bereichBar)} />
				<div className="text-ink font-display text-[18px] font-semibold leading-tight -tracking-[0.01em]">
					{slot.name}
					{slot.ageRange && (
						<span className="text-mute font-body mt-0.5 block text-[13.5px] font-medium">
							{ageLabel(slot)}
						</span>
					)}
				</div>
				<span className="text-mute hidden text-[14px] md:block">
					<strong className="text-ink font-semibold">
						{(slot.weekday || '').toString().toUpperCase()}
					</strong>{' '}
					· {slot.time}
				</span>
				<span className="text-mute hidden text-[14px] md:block">
					{slot.room && <strong className="text-ink font-semibold">{slot.room}</strong>}
					{slot.teacher?.name && ` · ${slot.teacher.name}`}
				</span>
				<span
					className={cn(
						'justify-self-end rounded-full px-3 py-1.5 text-[11.5px] font-bold uppercase tracking-[0.06em]',
						bereich === 'tanz' ? 'bg-blush text-coral-deep' : 'bg-paper-2 text-charcoal border-line border',
					)}
				>
					{bereich === 'tanz' ? 'Tanz' : bereich === 'instrument' ? 'Instrument' : 'Musik'}
				</span>
			</Wrapper>
		)
	}

	// full layout
	return (
		<Wrapper
			{...wrapperProps}
			className="bg-paper border-line hover:border-coral grid grid-cols-[80px_1fr_80px] items-center gap-3.5 rounded-card-sm border px-4.5 py-4 text-ink no-underline transition-[transform,border-color] duration-300 hover:translate-x-1 lg:grid-cols-[130px_80px_1fr_200px_200px_90px] lg:gap-4.5 lg:px-6 lg:py-5.5"
		>
			<div className="flex flex-col items-start gap-0.5">
				<span className="font-display text-[18px] font-bold leading-none -tracking-[0.02em] lg:text-[24px]">
					{slot.time}
				</span>
				<span className="text-mute mt-1 text-[12px] uppercase tracking-[0.06em]">
					{slot.duration}
				</span>
			</div>
			<div className="hidden size-15 place-items-center rounded-[16px] lg:grid">
				<span
					className={cn(
						'grid size-15 place-items-center rounded-[16px]',
						bereich === 'tanz'
							? 'bg-coral text-paper'
							: bereich === 'instrument'
								? 'bg-ink text-paper'
								: 'bg-coral-tint text-coral-deep',
					)}
				>
					<Icon
						name={bereich === 'tanz' ? 'dance' : bereich === 'instrument' ? 'smile' : 'music'}
						size={22}
					/>
				</span>
			</div>
			<div>
				<h3 className="font-display m-0 text-[20px] font-bold leading-tight -tracking-[0.015em]">
					{slot.name}
				</h3>
				<div className="text-mute mt-1 flex flex-wrap gap-3.5 text-[13px]">
					{slot.ageRange && <span className="text-coral font-semibold">{slot.ageRange}</span>}
					{slot.subInfo && <span>{slot.subInfo}</span>}
				</div>
			</div>
			<div className="hidden items-center gap-2.5 lg:flex">
				{slot.teacher?.name && (
					<>
						<div className="bg-paper-2 border-line font-display grid size-9 place-items-center rounded-full border text-[14px] font-bold">
							{slot.teacher.name.charAt(0)}
						</div>
						<div className="text-[13px] leading-tight">
							<div className="font-semibold">{slot.teacher.name}</div>
							{slot.teacher.role && (
								<div className="text-mute text-[12px]">{slot.teacher.role}</div>
							)}
						</div>
					</>
				)}
			</div>
			<div className="text-ink-2 hidden items-center gap-2 text-[13.5px] lg:flex">
				<Icon name="pin" size={14} className="text-mute" />
				{slot.room && (
					<span>
						<strong className="block font-semibold">{slot.room}</strong>
						{slot.floor && <span className="text-mute text-[12px]">{slot.floor}</span>}
					</span>
				)}
			</div>
			<div className="text-right">
				<span
					className={cn(
						'inline-block rounded-full px-3 py-1.5 text-[11.5px] font-semibold uppercase tracking-[0.04em]',
						statusBg,
					)}
				>
					{slot.statusLabel ? stegaClean(slot.statusLabel) : statusLabels[status]}
				</span>
				{slot.capacity && (
					<div className="text-mute mt-1.5 text-[12px]">{slot.capacity}</div>
				)}
			</div>
		</Wrapper>
	)
}
