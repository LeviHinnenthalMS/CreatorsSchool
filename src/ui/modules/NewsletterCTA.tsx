'use client'

import { PortableText, stegaClean } from 'next-sanity'
import { useState, type FormEvent } from 'react'
import moduleProps from '@/lib/moduleProps'
import { Img, ResponsiveImg } from '@/ui/Img'
import Button from '@/ui/Button'
import Tick from '@/ui/Tick'
import { cn } from '@/lib/utils'
import type { SanityImg, SanityModule } from '@/sanity/typeHelpers'

type State = 'idle' | 'submitting' | 'success' | 'error'

const inputClasses =
	'w-full rounded-sm border border-border bg-canvas px-3.5 py-3 text-regular leading-6 text-ink ' +
	'shadow-xs placeholder:text-ink-muted ' +
	'transition-[border-color,box-shadow] duration-150 motion-reduce:transition-none ' +
	'focus:outline-none focus-visible:border-accent ' +
	'focus-visible:ring-2 focus-visible:ring-accent/30'

export default function NewsletterCTA({
	eyebrowImage,
	eyebrowText,
	title,
	image,
	firstNameLabel,
	firstNamePlaceholder,
	emailLabel,
	emailPlaceholder,
	submitLabel,
	privacyNote,
	formAction,
	activeCampaignTag,
	successMessage,
	errorMessage,
	benefits,
	...props
}: Partial<{
	eyebrowImage: SanityImg
	eyebrowText: string
	title: string
	image: SanityImg
	firstNameLabel: string
	firstNamePlaceholder: string
	emailLabel: string
	emailPlaceholder: string
	submitLabel: string
	privacyNote: any
	formAction: string
	activeCampaignTag: string
	successMessage: any
	errorMessage: string
	benefits: string[]
}> &
	SanityModule) {
	const [state, setState] = useState<State>('idle')
	const [firstName, setFirstName] = useState('')
	const [email, setEmail] = useState('')

	const showFirstName = !!firstNamePlaceholder

	async function handleSubmit(event: FormEvent<HTMLFormElement>) {
		event.preventDefault()
		if (!email) return

		setState('submitting')
		try {
			let res: Response
			if (formAction) {
				// Custom external endpoint: keep the legacy URL-encoded shape.
				const body = new URLSearchParams()
				if (firstName) body.set('firstName', firstName)
				body.set('email', email)
				res = await fetch(formAction, {
					method: 'POST',
					headers: {
						'Content-Type': 'application/x-www-form-urlencoded',
						Accept: 'application/json',
					},
					body,
				})
			} else {
				// Default: post to /api/subscribe (Sanity + ActiveCampaign sync).
				res = await fetch('/api/subscribe', {
					method: 'POST',
					headers: { 'Content-Type': 'application/json' },
					body: JSON.stringify({
						name: firstName || email,
						email,
						kind: 'newsletter',
						activeCampaignTag: stegaClean(activeCampaignTag ?? '') || undefined,
					}),
				})
			}

			if (!res.ok && res.type !== 'opaque') {
				// Already subscribed: surface as success.
				if (res.status === 409) {
					const payload = (await res.json().catch(() => ({}))) as {
						error?: string
					}
					if (payload.error === 'already_subscribed') {
						setState('success')
						return
					}
				}
				throw new Error(`Request failed: ${res.status}`)
			}
			setState('success')
		} catch {
			setState('error')
		}
	}

	const hasEyebrow = !!(eyebrowImage?.image || eyebrowText)

	return (
		<section
			className="bg-canvas section-pad-medium"
			{...moduleProps(props)}
		>
			<div className="mx-auto w-full max-w-xxlarge px-8 max-md:px-4">
				<div className="grid grid-cols-1 items-center gap-10 lg:grid-cols-2 lg:gap-5">
					{/* Left — heading + form */}
					<div className="flex flex-col gap-10 md:gap-12">
						<div className="flex flex-col gap-2">
							{hasEyebrow && (
								<div className="flex items-center gap-2.5">
									{eyebrowImage?.image && (
										<Img
											image={eyebrowImage.image}
											alt={eyebrowImage.alt ?? ''}
											height={100}
											className="h-7 w-auto shrink-0 object-contain"
										/>
									)}
									{eyebrowText && (
										<p className="text-medium font-bold tracking-[1px] uppercase text-ink-muted">
											{eyebrowText}
										</p>
									)}
								</div>
							)}
							{title && (
								<h2 className="font-display text-[clamp(40px,5.5vw,60px)] font-medium leading-tight tracking-[-0.01em] whitespace-pre-line text-ink">
									{title}
								</h2>
							)}
						</div>

						<div className="max-w-small min-[500px]:max-lg:max-w-none">
							{state === 'success' ? (
								<div
									role="status"
									aria-live="polite"
									className="richtext text-medium text-ink"
								>
									{successMessage ? (
										<PortableText value={successMessage} />
									) : (
										<p>{submitLabel}</p>
									)}
								</div>
							) : (
								<form
									onSubmit={handleSubmit}
									className="flex flex-col gap-4"
									noValidate
								>
									<div className="flex flex-col gap-3 min-[500px]:flex-row min-[500px]:items-end">
										{showFirstName && (
											<label className="flex flex-col gap-1.5 min-[500px]:w-32">
												<span className="sr-only">
													{firstNameLabel ?? firstNamePlaceholder}
												</span>
												<input
													type="text"
													name="firstName"
													value={firstName}
													onChange={(e) => setFirstName(e.target.value)}
													placeholder={firstNamePlaceholder}
													autoComplete="given-name"
													className={inputClasses}
												/>
											</label>
										)}
										<label className="flex min-w-0 flex-1 flex-col gap-1.5">
											<span className="sr-only">
												{emailLabel ?? emailPlaceholder}
											</span>
											<input
												type="email"
												name="email"
												required
												aria-required="true"
												value={email}
												onChange={(e) => setEmail(e.target.value)}
												placeholder={emailPlaceholder}
												autoComplete="email"
												className={inputClasses}
											/>
										</label>
										<Button
											type="submit"
											variant="primary"
											size="medium"
											disabled={state === 'submitting' || !email}
											className="hidden min-[500px]:max-lg:inline-flex min-[500px]:max-lg:shrink-0"
										>
											{submitLabel}
										</Button>
									</div>

									<Button
										type="submit"
										variant="primary"
										size="medium"
										disabled={state === 'submitting' || !email}
										className="w-full min-[500px]:max-lg:hidden"
									>
										{submitLabel}
									</Button>

									{state === 'error' && errorMessage && (
										<p
											role="alert"
											className="text-small text-danger"
										>
											{errorMessage}
										</p>
									)}

									{privacyNote && (
										<div className="text-small text-accent-dark leading-5">
											<PortableText value={privacyNote} />
										</div>
									)}
								</form>
							)}
						</div>
					</div>

					{/* Right — image */}
					{image?.image && (
						<div className="w-full">
							<ResponsiveImg
								img={image}
								className="block h-auto w-full object-contain"
								width={1400}
							/>
						</div>
					)}
				</div>

				{!!benefits?.length && (
					<ul
						className={cn(
							'mx-auto mt-module-gap flex max-w-xlarge flex-wrap items-center justify-center',
							'gap-x-10 gap-y-3.5',
						)}
					>
						{benefits.map((label, i) => (
							<li
								key={i}
								className="flex items-center justify-center gap-3"
							>
								<Tick size="lg" />
								<span className="text-medium font-medium text-ink">
									{label}
								</span>
							</li>
						))}
					</ul>
				)}
			</div>
		</section>
	)
}
