'use client'

import { Suspense, useState, useTransition, type FormEvent } from 'react'
import { useSearchParams } from 'next/navigation'
import { stegaClean } from 'next-sanity'
import Link from 'next/link'
import { cn } from '@/lib/utils'
import { Icon } from '@/ui/creators/Icon'
import { submitContact } from './contactSubmit'
import moduleProps from '@/lib/moduleProps'
import RichTitle from '@/ui/creators/RichTitle'
import resolveUrl from '@/lib/resolveUrl'
import type { SanityLink, SanityModule } from '@/sanity/typeHelpers'

type Option = { value?: string | null; label?: string | null }

type InfoCard = {
	_key?: string | null
	variant?: 'coral' | 'ink' | 'neutral' | null
	icon?: string | null
	label?: string | null
	value?: string | null
	small?: string | null
	link?: SanityLink | null
}

type Labels = {
	name?: string | null
	child?: string | null
	email?: string | null
	phone?: string | null
	interest?: string | null
	age?: string | null
	when?: string | null
	message?: string | null
	submit?: string | null
	requiredHint?: string | null
	privacy?: string | null
	successTitle?: string | null
	successText?: string | null
	errorText?: string | null
}

type TitleBlock = { _type?: string; children?: Array<{ text?: string; marks?: string[] }> }

type Props = SanityModule & {
	title?: TitleBlock[] | null
	lead?: string | null
	labels?: Labels | null
	interests?: Option[] | null
	ageOptions?: Option[] | null
	whenOptions?: Option[] | null
	infoCards?: InfoCard[] | null
}

function clean(v?: string | null) {
	return v ? stegaClean(v) : v
}

function normalize(s?: string | null) {
	return (s ?? '').toLowerCase().replace(/[^a-z0-9äöüß]/g, '')
}

function matchOption(options: Option[], val: string): Option | undefined {
	const v = normalize(val)
	if (!v) return undefined
	return (
		options.find((o) => normalize(o.value) === v) ??
		options.find((o) => normalize(o.label) === v) ??
		options.find((o) => normalize(o.label).includes(v) || v.includes(normalize(o.label)))
	)
}

function cardHref(link?: SanityLink | null) {
	if (!link) return undefined
	if (link.type === 'internal' && link.internal) return resolveUrl(link.internal)
	return link.external ?? undefined
}

function InfoCardItem({ card: c }: { card: InfoCard }) {
	const variant = stegaClean(c.variant || 'neutral') as 'coral' | 'ink' | 'neutral'
	const iconBg =
		variant === 'coral'
			? 'bg-coral text-paper'
			: variant === 'ink'
				? 'bg-coral-soft text-ink'
				: 'bg-paper-3 text-charcoal'

	const wrap = cn(
		'grid grid-cols-[56px_1fr] items-center gap-5 rounded-card border p-6 no-underline transition-[transform,border-color] duration-300',
		variant === 'ink'
			? 'bg-ink border-ink text-paper'
			: 'bg-paper border-line hover:border-coral hover:scale-[1.01]',
	)

	const inner = (
		<>
			<span className={cn('grid size-14 shrink-0 place-items-center rounded-[14px]', iconBg)}>
				<Icon name={c.icon} size={20} />
			</span>
			<div>
				{c.label && (
					<p className={cn('m-0 text-[11.5px] font-bold uppercase tracking-[0.08em]', variant === 'ink' ? 'text-white/50' : 'text-mute')}>
						{c.label}
					</p>
				)}
				{c.value && (
					<p className={cn('font-display m-0 mt-1 text-[20px] font-bold leading-tight -tracking-[0.015em]', variant === 'ink' ? 'text-paper' : 'text-ink')}>
						{c.value}
					</p>
				)}
				{c.small && (
					<p className={cn('m-0 mt-1 text-[13px]', variant === 'ink' ? 'text-white/50' : 'text-mute')}>
						{c.small}
					</p>
				)}
			</div>
		</>
	)

	const url = cardHref(c.link)
	return url ? (
		<Link href={url} className={wrap}>{inner}</Link>
	) : (
		<div className={wrap}>{inner}</div>
	)
}

function FormPanel({
	props,
	pending,
	done,
	error,
	onSubmit,
	interests,
	ages,
	whens,
	preselected,
	preselectedAge,
}: {
	props: Props
	pending: boolean
	done: boolean
	error: string | null
	onSubmit: (e: FormEvent<HTMLFormElement>) => void
	interests: Option[]
	ages: Option[]
	whens: Option[]
	preselected: Option | null
	preselectedAge: Option | null
}) {
	const labels = props.labels ?? {}

	if (done) {
		return (
			<div
				role="status"
				aria-live="polite"
				className="bg-paper border-line relative overflow-hidden rounded-panel border p-[clamp(28px,3.5vw,44px)]"
			>
				<div className="bg-coral text-paper mb-6 grid size-12 place-items-center rounded-full">
					<Icon name="check" size={22} />
				</div>
				<h2 className="text-ink font-display m-0 text-[clamp(28px,3.5vw,42px)] font-bold leading-[1.05] -tracking-[0.025em]">
					{clean(labels.successTitle) || 'Danke für deine Nachricht.'}
				</h2>
				<p className="text-ink-2 mt-3.5 max-w-[42ch] text-[15.5px]">
					{clean(labels.successText) || 'Wir melden uns in den nächsten Tagen bei dir.'}
				</p>
			</div>
		)
	}

	return (
		<div className="bg-paper border-line relative overflow-hidden rounded-panel border p-[clamp(28px,3.5vw,44px)]">
			<span
				aria-hidden
				className="bg-coral-tint pointer-events-none absolute -right-24 -top-24 size-[280px] rounded-full opacity-60 blur-[20px]"
			/>

			{(props.title?.length || props.lead) && (
				<header className="relative z-10">
					<RichTitle
						title={props.title}
						as="h2"
						className="text-ink font-display m-0 text-[clamp(28px,3.5vw,42px)] font-bold leading-[1.05] -tracking-[0.025em]"
					/>
					{props.lead && (
						<p className="text-ink-2 mt-3.5 max-w-[42ch] text-[15.5px]">{props.lead}</p>
					)}
				</header>
			)}

			<form onSubmit={onSubmit} className="relative z-10 mt-8 grid gap-4.5" noValidate>
				<div className="grid gap-3.5 sm:grid-cols-2">
					<Field
						label={clean(labels.name) || 'Ihr Name'}
						name="name"
						placeholder="Vor- und Nachname"
						required
						requiredHint={clean(labels.requiredHint)}
					/>
					<Field
						label={clean(labels.child) || 'Name des Kindes'}
						name="child"
						placeholder="Optional"
					/>
				</div>
				<div className="grid gap-3.5 sm:grid-cols-2">
					<Field
						label={clean(labels.email) || 'E-Mail'}
						name="email"
						type="email"
						placeholder="ihre.email@beispiel.de"
						required
						requiredHint={clean(labels.requiredHint)}
					/>
					<Field
						label={clean(labels.phone) || 'Telefon'}
						name="phone"
						type="tel"
						placeholder="Optional"
					/>
				</div>

				{interests.length > 0 && (
					<fieldset className="m-0 border-0 p-0">
						<legend className="text-ink mb-3 text-[14px] font-semibold">
							{clean(labels.interest) || 'Welches Angebot interessiert Sie?'}
						</legend>
						<div className="flex flex-wrap gap-2">
							{interests.map((o, i) => (
								<label key={o.value} className="relative inline-flex cursor-pointer">
									<input
										type="radio"
										name="interest"
										value={stegaClean(o.value!)}
										defaultChecked={
											preselected
												? stegaClean(o.value) === stegaClean(preselected.value)
												: i === 0
										}
										className="peer pointer-events-none absolute opacity-0"
									/>
									<span className="border-line bg-paper-2 text-ink-2 hover:border-coral hover:text-coral peer-checked:bg-ink peer-checked:border-ink peer-checked:text-paper inline-block rounded-full border px-4 py-2 text-[13.5px] font-medium transition-colors">
										{stegaClean(o.label!)}
									</span>
								</label>
							))}
						</div>
					</fieldset>
				)}

				{(ages.length > 0 || whens.length > 0) && (
					<div className="grid gap-3.5 sm:grid-cols-2">
						{ages.length > 0 && (
							<Select
								label={clean(labels.age) || 'Alter des Kindes'}
								name="age"
								options={ages}
								defaultValue={preselectedAge ? stegaClean(preselectedAge.value!) ?? undefined : undefined}
							/>
						)}
						{whens.length > 0 && (
							<Select
								label={clean(labels.when) || 'Wann passt es Ihnen?'}
								name="when"
								options={whens}
							/>
						)}
					</div>
				)}

				<div className="flex flex-col gap-2">
					<label className="text-ink mb-1 text-[14px] font-semibold">
						{clean(labels.message) || 'Ihre Nachricht'}
					</label>
					<textarea
						name="msg"
						rows={5}
						placeholder="Erzählen Sie uns kurz, was Sie suchen — Vorerfahrung, Wünsche, Fragen. Alles, was uns hilft, Sie gut zu beraten."
						className="border-line bg-paper text-ink placeholder:text-mute focus:border-coral focus:shadow-[0_0_0_4px_var(--color-coral-tint)] min-h-[120px] resize-y rounded-[14px] border px-4 py-3.5 text-[14.5px] outline-none transition-[border-color,box-shadow]"
					/>
				</div>

				<div className="border-line-2 mt-2 flex flex-wrap items-center justify-between gap-4 border-t border-dashed pt-5">
					<label className="text-ink-2 flex max-w-[40ch] cursor-pointer items-start gap-2.5 text-[13px] leading-snug">
						<input
							type="checkbox"
							required
							name="privacy"
							className="mt-0.5 accent-coral"
						/>
						<span>
							{clean(labels.privacy) ||
								'Ich habe die Datenschutzhinweise gelesen und stimme der Verarbeitung meiner Angaben für die Kontaktaufnahme zu.'}
						</span>
					</label>
					<button
						type="submit"
						disabled={pending}
						className="action-base bg-coral text-paper shadow-[0_10px_28px_-10px_color-mix(in_srgb,var(--color-coral)_42%,transparent)] hover:shadow-[0_18px_38px_-12px_color-mix(in_srgb,var(--color-coral)_52%,transparent)] disabled:opacity-70 max-sm:w-full max-sm:justify-center"
					>
						{pending ? '…' : clean(labels.submit) || 'Anfrage senden'}
						<span
							aria-hidden
							className="bg-paper text-coral grid size-7 place-items-center rounded-full"
						>
							<Icon name="arrow" size={14} strokeWidth={2.5} />
						</span>
					</button>
				</div>

				{error && (
					<p role="alert" className="text-coral-deep mt-2 text-[14px] font-semibold">
						{error}
					</p>
				)}

				<p className="text-mute text-[12px]">
					Pflichtfelder mit * markiert. Wir nutzen Ihre Daten ausschließlich zur Beantwortung Ihrer Anfrage.
				</p>
			</form>
		</div>
	)
}

function ContactFormInner(props: Props) {
	const labels = props.labels ?? {}
	const [pending, startTransition] = useTransition()
	const [done, setDone] = useState(false)
	const [error, setError] = useState<string | null>(null)
	const searchParams = useSearchParams()
	const kurs = searchParams.get('kurs') ?? ''
	const alter = searchParams.get('alter') ?? ''

	function onSubmit(e: FormEvent<HTMLFormElement>) {
		e.preventDefault()
		setError(null)
		const fd = new FormData(e.currentTarget)
		const payload = {
			name: String(fd.get('name') || ''),
			childName: String(fd.get('child') || ''),
			email: String(fd.get('email') || ''),
			phone: String(fd.get('phone') || ''),
			interest: String(fd.get('interest') || ''),
			childAge: String(fd.get('age') || ''),
			preferredTime: String(fd.get('when') || ''),
			message: String(fd.get('msg') || ''),
			sourcePath: typeof window !== 'undefined' ? window.location.pathname : undefined,
		}

		startTransition(async () => {
			const result = await submitContact(payload)
			if (result.ok) setDone(true)
			else setError(labels.errorText ? clean(labels.errorText)! : 'Etwas ist schiefgelaufen.')
		})
	}

	const interests = (props.interests ?? []).filter((o) => o.value && o.label)
	const ages = (props.ageOptions ?? []).filter((o) => o.value && o.label)
	const whens = (props.whenOptions ?? []).filter((o) => o.value && o.label)
	const preselected = kurs ? matchOption(interests, kurs) : null
	const preselectedAge = alter ? matchOption(ages, alter) : null

	const formPanel = (
		<FormPanel
			props={props}
			pending={pending}
			done={done}
			error={error}
			onSubmit={onSubmit}
			interests={interests}
			ages={ages}
			whens={whens}
			preselected={preselected ?? null}
			preselectedAge={preselectedAge ?? null}
		/>
	)

	const cards = props.infoCards?.filter((c) => c.label || c.value)

	return (
		<section
			{...moduleProps(props)}
			id="kontaktformular"
			className="py-[clamp(40px,5vw,70px)]"
		>
			<div className="wrap">
				{cards?.length ? (
					<div className="grid gap-8 lg:grid-cols-[1fr_1.45fr] lg:items-start">
						<div className="flex flex-col gap-3">
							{cards.map((c, i) => (
								<InfoCardItem key={c._key ?? i} card={c} />
							))}
						</div>
						{formPanel}
					</div>
				) : (
					formPanel
				)}
			</div>
		</section>
	)
}

export default function ContactForm(props: Props) {
	return (
		<Suspense>
			<ContactFormInner {...props} />
		</Suspense>
	)
}

function Field({
	label,
	name,
	type = 'text',
	placeholder,
	required,
	requiredHint,
}: {
	label: string
	name: string
	type?: string
	placeholder?: string
	required?: boolean
	requiredHint?: string | null
}) {
	return (
		<div className="flex flex-col gap-2">
			<label className="text-ink text-[14px] font-semibold">
				{label}
				{required && (
					<span aria-label={requiredHint || 'erforderlich'} className="text-coral ml-0.5">
						*
					</span>
				)}
			</label>
			<input
				name={name}
				type={type}
				placeholder={placeholder}
				required={required}
				aria-required={required || undefined}
				className={cn(
					'border-line bg-paper text-ink placeholder:text-mute focus:border-coral focus:shadow-[0_0_0_4px_var(--color-coral-tint)] rounded-[14px] border px-4 py-3.5 text-[14.5px] outline-none transition-[border-color,box-shadow]',
				)}
			/>
		</div>
	)
}

function Select({
	label,
	name,
	options,
	defaultValue,
}: {
	label: string
	name: string
	options: Option[]
	defaultValue?: string
}) {
	return (
		<div className="flex flex-col gap-2">
			<label className="text-ink text-[14px] font-semibold">{label}</label>
			<select
				name={name}
				defaultValue={defaultValue ?? ''}
				className="border-line bg-paper text-ink focus:border-coral focus:shadow-[0_0_0_4px_var(--color-coral-tint)] appearance-none rounded-[14px] border bg-[url('data:image/svg+xml;utf8,<svg%20xmlns=%27http://www.w3.org/2000/svg%27%20width=%2714%27%20height=%2714%27%20viewBox=%270%200%2024%2024%27%20fill=%27none%27%20stroke=%27%232d1a22%27%20stroke-width=%272.5%27%20stroke-linecap=%27round%27%20stroke-linejoin=%27round%27><polyline%20points=%276%209%2012%2015%2018%209%27/></svg>')] bg-[length:14px] bg-[right_16px_center] bg-no-repeat px-4 py-3.5 pr-11 text-[14.5px] outline-none transition-[border-color,box-shadow]"
			>
				<option value="">Bitte wählen</option>
				{options.map((o) => (
					<option key={o.value} value={stegaClean(o.value!)}>
						{stegaClean(o.label!)}
					</option>
				))}
			</select>
		</div>
	)
}
