'use client'

import { Suspense, useState, useTransition, type FormEvent } from 'react'
import { useSearchParams } from 'next/navigation'
import { stegaClean } from 'next-sanity'
import { cn } from '@/lib/utils'
import { Icon } from '@/ui/creators/Icon'
import { submitContact } from './contactSubmit'
import moduleProps from '@/lib/moduleProps'
import RichTitle from '@/ui/creators/RichTitle'
import type { SanityModule } from '@/sanity/typeHelpers'

type Option = { value?: string | null; label?: string | null }

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
}

function clean(v?: string | null) {
	return v ? stegaClean(v) : v
}

function normalize(s?: string | null) {
	return (s ?? '').toLowerCase().replace(/[^a-z0-9äöüß]/g, '')
}

function matchInterest(interests: Option[], kurs: string): Option | undefined {
	const k = normalize(kurs)
	if (!k) return undefined
	return (
		interests.find((o) => normalize(o.value) === k) ??
		interests.find((o) => normalize(o.label) === k) ??
		interests.find((o) => normalize(o.label).includes(k) || k.includes(normalize(o.label)))
	)
}

function ContactFormInner(props: Props) {
	const labels = props.labels ?? {}
	const [pending, startTransition] = useTransition()
	const [done, setDone] = useState(false)
	const [error, setError] = useState<string | null>(null)
	const searchParams = useSearchParams()
	const kurs = searchParams.get('kurs') ?? ''

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
	const preselected = kurs ? matchInterest(interests, kurs) : null

	if (done) {
		return (
			<section
				{...moduleProps(props)}
				id="kontaktformular"
				className="py-[clamp(40px,5vw,70px)]"
			>
				<div className="wrap">
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
							{clean(labels.successText) ||
								'Wir melden uns in den nächsten Tagen bei dir.'}
						</p>
					</div>
				</div>
			</section>
		)
	}

	return (
		<section
			{...moduleProps(props)}
			id="kontaktformular"
			className="py-[clamp(40px,5vw,70px)]"
		>
			<div className="wrap">
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
								<p className="text-ink-2 mt-3.5 max-w-[42ch] text-[15.5px]">
									{props.lead}
								</p>
							)}
						</header>
					)}

					<form onSubmit={onSubmit} className="relative z-10 mt-8 grid gap-4.5" noValidate>
						<div className="grid gap-3.5 sm:grid-cols-2">
							<Field
								label={clean(labels.name) || 'Ihr Name'}
								name="name"
								required
								requiredHint={clean(labels.requiredHint)}
							/>
							<Field
								label={clean(labels.child) || 'Name des Kindes'}
								name="child"
							/>
						</div>
						<div className="grid gap-3.5 sm:grid-cols-2">
							<Field
								label={clean(labels.email) || 'E-Mail'}
								name="email"
								type="email"
								required
								requiredHint={clean(labels.requiredHint)}
							/>
							<Field
								label={clean(labels.phone) || 'Telefon'}
								name="phone"
								type="tel"
							/>
						</div>

						{interests.length > 0 && (
							<fieldset className="m-0 p-0 border-0">
								<legend className="text-ink-2 mb-2 text-[13px] font-semibold tracking-[0.02em]">
									{clean(labels.interest) || 'Welches Angebot interessiert dich?'}
								</legend>
								<div className="flex flex-wrap gap-2">
									{interests.map((o, i) => (
										<label
											key={o.value}
											className="relative inline-flex cursor-pointer"
										>
											<input
												type="radio"
												name="interest"
												value={stegaClean(o.value!)}
												defaultChecked={
													preselected
														? stegaClean(o.value) === stegaClean(preselected.value)
														: i === 0
												}
												className="pointer-events-none absolute opacity-0"
											/>
											<span className="bg-paper-2 border-line text-ink-2 hover:border-coral hover:text-coral peer-checked:bg-ink peer-checked:text-paper peer-checked:border-ink inline-block rounded-full border px-4 py-2 text-[13.5px] font-medium transition-colors">
												{stegaClean(o.label!)}
											</span>
										</label>
									))}
								</div>
							</fieldset>
						)}

						<div className="grid gap-3.5 sm:grid-cols-2">
							{ages.length > 0 && (
								<Select
									label={clean(labels.age) || 'Alter des Kindes'}
									name="age"
									options={ages}
								/>
							)}
							{whens.length > 0 && (
								<Select
									label={clean(labels.when) || 'Wann passt es?'}
									name="when"
									options={whens}
								/>
							)}
						</div>

						<div className="flex flex-col gap-2">
							<label className="text-ink-2 text-[13px] font-semibold tracking-[0.02em]">
								{clean(labels.message) || 'Ihre Nachricht'}
							</label>
							<textarea
								name="msg"
								rows={6}
								className="border-line bg-paper text-ink focus:border-coral focus:shadow-[0_0_0_4px_var(--color-coral-tint)] min-h-[130px] resize-y rounded-[14px] border px-4 py-3.5 text-[14.5px] outline-none transition-[border-color,box-shadow]"
							/>
						</div>

						<div className="border-line-2 mt-2.5 flex flex-wrap items-center justify-between gap-4 border-t border-dashed pt-6">
							<label className="text-ink-2 flex max-w-[40ch] items-start gap-2.5 text-[13px] leading-snug">
								<input
									type="checkbox"
									required
									name="privacy"
									className="mt-0.5 accent-coral"
								/>
								<span>
									{clean(labels.privacy) ||
										'Ich habe die Datenschutzerklärung gelesen und stimme zu.'}
								</span>
							</label>
							<button
								type="submit"
								disabled={pending}
								className="action-base bg-coral text-paper shadow-[0_10px_28px_-10px_color-mix(in_srgb,var(--color-coral)_42%,transparent)] hover:shadow-[0_18px_38px_-12px_color-mix(in_srgb,var(--color-coral)_52%,transparent)] disabled:opacity-70"
							>
								{pending ? '…' : clean(labels.submit) || 'Nachricht senden'}
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
					</form>
				</div>
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
	required,
	requiredHint,
}: {
	label: string
	name: string
	type?: string
	required?: boolean
	requiredHint?: string | null
}) {
	return (
		<label className="flex flex-col gap-2">
			<span className="text-ink-2 text-[13px] font-semibold tracking-[0.02em]">
				{label}
				{required && (
					<span aria-label={requiredHint || 'erforderlich'} className="text-coral ml-0.5">
						*
					</span>
				)}
			</span>
			<input
				name={name}
				type={type}
				required={required}
				aria-required={required || undefined}
				className={cn(
					'border-line bg-paper text-ink focus:border-coral focus:shadow-[0_0_0_4px_var(--color-coral-tint)] rounded-[14px] border px-4 py-3.5 text-[14.5px] outline-none transition-[border-color,box-shadow]',
				)}
			/>
		</label>
	)
}

function Select({
	label,
	name,
	options,
}: {
	label: string
	name: string
	options: Option[]
}) {
	return (
		<label className="flex flex-col gap-2">
			<span className="text-ink-2 text-[13px] font-semibold tracking-[0.02em]">
				{label}
			</span>
			<select
				name={name}
				className="border-line bg-paper text-ink focus:border-coral focus:shadow-[0_0_0_4px_var(--color-coral-tint)] appearance-none rounded-[14px] border bg-[url('data:image/svg+xml;utf8,<svg%20xmlns=%27http://www.w3.org/2000/svg%27%20width=%2714%27%20height=%2714%27%20viewBox=%270%200%2024%2024%27%20fill=%27none%27%20stroke=%27%232d1a22%27%20stroke-width=%272.5%27%20stroke-linecap=%27round%27%20stroke-linejoin=%27round%27><polyline%20points=%276%209%2012%2015%2018%209%27/></svg>')] bg-[length:14px] bg-[right_16px_center] bg-no-repeat px-4 py-3.5 pr-11 text-[14.5px] outline-none transition-[border-color,box-shadow]"
			>
				<option value="">—</option>
				{options.map((o) => (
					<option key={o.value} value={stegaClean(o.value!)}>
						{stegaClean(o.label!)}
					</option>
				))}
			</select>
		</label>
	)
}
