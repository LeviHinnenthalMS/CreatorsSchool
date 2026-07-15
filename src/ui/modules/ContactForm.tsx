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
	contact?: string | null
	interest?: string | null
	age?: string | null
	submit?: string | null
	footnote?: string | null
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
	infoCards?: InfoCard[] | null
	privacyUrl?: string | null
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
	if (link.type === 'internal') {
		if (link.internal) return resolveUrl(link.internal, { params: link.params ?? undefined })
		if (link.params) return stegaClean(link.params)
	}
	return link.external ?? undefined
}

function InfoCardItem({ card: c }: { card: InfoCard }) {
	const url = cardHref(c.link)

	const inner = (
		<div className="flex items-center gap-3.5 py-3.5">
			<span className="bg-paper-3 text-coral grid size-9 shrink-0 place-items-center rounded-full">
				<Icon name={c.icon} size={15} />
			</span>
			<div>
				{c.label && (
					<p className="text-mute m-0 text-[11px] font-semibold uppercase tracking-[0.07em]">
						{c.label}
					</p>
				)}
				{c.value && (
					<p className="text-ink m-0 text-[15px] font-semibold leading-snug">
						{c.value}
					</p>
				)}
				{c.small && (
					<p className="text-mute m-0 mt-0.5 text-[12px]">{c.small}</p>
				)}
			</div>
		</div>
	)

	const cls = 'block border-b border-line last:border-0 no-underline transition-opacity hover:opacity-70'
	return url ? (
		<Link href={url} className={cls}>{inner}</Link>
	) : (
		<div className={cn(cls, 'hover:opacity-100')}>{inner}</div>
	)
}

function FormPanel({
	props,
	pending,
	done,
	error,
	fieldErrors,
	onSubmit,
	interests,
	ages,
	preselected,
	preselectedAge,
}: {
	props: Props
	pending: boolean
	done: boolean
	error: string | null
	fieldErrors: Record<string, string>
	onSubmit: (e: FormEvent<HTMLFormElement>) => void
	interests: Option[]
	ages: Option[]
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
				<h2 className="text-ink font-display m-0 text-[clamp(26px,3vw,38px)] font-bold leading-[1.05] -tracking-[0.025em]">
					{clean(labels.successTitle) || 'Danke für deine Nachricht.'}
				</h2>
				<p className="text-ink-2 mt-3.5 max-w-[42ch] text-[15.5px]">
					{clean(labels.successText) || 'Wir melden uns in den nächsten 24 Stunden bei dir.'}
				</p>
			</div>
		)
	}

	const privacyUrl = clean(props.privacyUrl)

	return (
		<div className="bg-paper border-line relative overflow-hidden rounded-panel border p-[clamp(24px,3.5vw,40px)]">
			<span
				aria-hidden
				className="bg-coral-tint pointer-events-none absolute -right-24 -top-24 size-[280px] rounded-full opacity-60 blur-[20px]"
			/>

			{(props.title?.length || props.lead) && (
				<header className="relative z-10">
					<RichTitle
						title={props.title}
						as="h2"
						className="text-ink font-display m-0 text-[clamp(26px,3vw,38px)] font-bold leading-[1.05] -tracking-[0.025em]"
					/>
					{props.lead && (
						<p className="text-ink-2 mt-3 max-w-[42ch] text-[14.5px] leading-relaxed">{props.lead}</p>
					)}
				</header>
			)}

			<form onSubmit={onSubmit} className="relative z-10 mt-6 grid gap-4" noValidate>
				{/* Honeypot — invisible to humans, bots fill it in */}
				<div aria-hidden style={{ position: 'absolute', left: '-9999px', opacity: 0, pointerEvents: 'none' }}>
					<label>Website <input name="_hp" type="text" autoComplete="off" tabIndex={-1} /></label>
				</div>
				{interests.length > 0 && (
					<Select
						label={clean(labels.interest) || 'Welches Angebot?'}
						name="interest"
						options={interests}
						defaultValue={preselected ? stegaClean(preselected.value!) ?? undefined : undefined}
					/>
				)}

				{ages.length > 0 && (
					<Select
						label={clean(labels.age) || 'Alter des Kindes'}
						name="age"
						options={ages}
						defaultValue={preselectedAge ? stegaClean(preselectedAge.value!) ?? undefined : undefined}
					/>
				)}

				<Field
					label={clean(labels.name) || 'Ihr Name'}
					name="name"
					placeholder="Vor- und Nachname"
					required
					requiredHint={clean(labels.requiredHint)}
					error={fieldErrors.name}
				/>

				<Field
					label={clean(labels.contact) || 'Telefon oder E-Mail'}
					name="contact"
					placeholder="So erreichen wir Sie am besten"
					required
					requiredHint={clean(labels.requiredHint)}
					error={fieldErrors.contact}
				/>

				<div>
					<label className="text-ink-2 flex cursor-pointer items-start gap-3 text-[13px] leading-snug">
						<input
							type="checkbox"
							name="privacy"
							className="mt-0.5 shrink-0 accent-coral"
						/>
						<span>
							{clean(labels.privacy) || 'Ich stimme der Verarbeitung meiner Angaben zur Kontaktaufnahme zu'}
							{privacyUrl ? (
								<> (<Link href={privacyUrl} className="text-coral underline">Datenschutz</Link>).</>
							) : '.'}
						</span>
					</label>
					{fieldErrors.privacy && (
						<p className="text-coral-deep mt-1.5 text-[12.5px] font-medium">{fieldErrors.privacy}</p>
					)}
				</div>

				<button
					type="submit"
					disabled={pending}
					className="bg-coral text-paper hover:bg-coral-deep mt-1 w-full rounded-full py-4 text-[15.5px] font-semibold shadow-[0_10px_28px_-10px_color-mix(in_srgb,var(--color-coral)_42%,transparent)] transition-colors disabled:opacity-70"
				>
					{pending ? '…' : clean(labels.submit) || 'Kostenlose Probestunde anfragen'}
				</button>

				{error && (
					<p role="alert" className="text-coral-deep text-center text-[13.5px] font-semibold">
						{error}
					</p>
				)}

				<p className="text-mute flex items-center justify-center gap-2 text-center text-[12.5px]">
					<span aria-hidden className="bg-mute inline-block size-1.5 shrink-0 rounded-full" />
					{clean(labels.footnote) || 'Antwort innerhalb von 24 Stunden · unverbindlich'}
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
	const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({})
	const searchParams = useSearchParams()
	const kurs = searchParams.get('kurs') ?? ''
	const alter = searchParams.get('alter') ?? ''

	function onSubmit(e: FormEvent<HTMLFormElement>) {
		e.preventDefault()
		setError(null)
		const fd = new FormData(e.currentTarget)

		// Honeypot: if the hidden field has a value, a bot filled it — silently abort
		if (String(fd.get('_hp') || '')) return

		const errors: Record<string, string> = {}
		if (!String(fd.get('name') || '').trim())
			errors.name = 'Bitte geben Sie Ihren Namen ein.'
		if (!String(fd.get('contact') || '').trim())
			errors.contact = 'Bitte geben Sie Ihre Telefonnummer oder E-Mail-Adresse ein.'
		if (!fd.get('privacy'))
			errors.privacy = 'Bitte stimmen Sie der Datenschutzerklärung zu.'
		if (Object.keys(errors).length) {
			setFieldErrors(errors)
			return
		}
		setFieldErrors({})

		const payload = {
			name: String(fd.get('name') || ''),
			contact: String(fd.get('contact') || ''),
			interest: String(fd.get('interest') || ''),
			childAge: String(fd.get('age') || ''),
			_hp: String(fd.get('_hp') || ''),
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
	const preselected = kurs ? matchOption(interests, kurs) ?? null : null
	const preselectedAge = alter ? matchOption(ages, alter) ?? null : null

	const formPanel = (
		<FormPanel
			props={props}
			pending={pending}
			done={done}
			error={error}
			fieldErrors={fieldErrors}
			onSubmit={onSubmit}
			interests={interests}
			ages={ages}
			preselected={preselected}
			preselectedAge={preselectedAge}
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
					<div className="grid gap-10 lg:grid-cols-[1fr_1.6fr] lg:items-start">
						<div className="lg:pt-2">
							<div className="divide-y divide-line">
								{cards.map((c, i) => (
									<InfoCardItem key={c._key ?? i} card={c} />
								))}
							</div>
						</div>
						{formPanel}
					</div>
				) : (
					<div className="mx-auto max-w-lg">
						{formPanel}
					</div>
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
	error,
}: {
	label: string
	name: string
	type?: string
	placeholder?: string
	required?: boolean
	requiredHint?: string | null
	error?: string
}) {
	return (
		<div className="flex flex-col gap-2">
			<label className="text-ink text-[13.5px] font-semibold">
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
				aria-required={required || undefined}
				aria-invalid={error ? true : undefined}
				className={cn(
					'border-line bg-paper-2 text-ink placeholder:text-mute focus:border-coral focus:shadow-[0_0_0_4px_var(--color-coral-tint)] rounded-[14px] border px-4 py-3.5 text-[14.5px] outline-none transition-[border-color,box-shadow]',
					error && 'border-coral-deep',
				)}
			/>
			{error && (
				<p className="text-coral-deep text-[12.5px] font-medium">{error}</p>
			)}
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
			<label className="text-ink text-[13.5px] font-semibold">{label}</label>
			<select
				name={name}
				defaultValue={defaultValue ?? ''}
				className="border-line bg-paper-2 text-ink focus:border-coral focus:shadow-[0_0_0_4px_var(--color-coral-tint)] appearance-none rounded-[14px] border bg-[url('data:image/svg+xml;utf8,<svg%20xmlns=%27http://www.w3.org/2000/svg%27%20width=%2714%27%20height=%2714%27%20viewBox=%270%200%2024%2024%27%20fill=%27none%27%20stroke=%27%232d1a22%27%20stroke-width=%272.5%27%20stroke-linecap=%27round%27%20stroke-linejoin=%27round%27><polyline%20points=%276%209%2012%2015%2018%209%27/></svg>')] bg-[length:14px] bg-[right_16px_center] bg-no-repeat px-4 py-3.5 pr-11 text-[14.5px] outline-none transition-[border-color,box-shadow]"
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
