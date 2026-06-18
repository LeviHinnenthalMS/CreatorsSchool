'use client'

import { useState, type FormEvent } from 'react'
import Button from '@/ui/Button'
import { cn } from '@/lib/utils'

type Props = {
	title?: string
	description?: string
	namePlaceholder?: string
	emailPlaceholder?: string
	buttonLabel?: string
	formAction?: string
	successMessage?: string
	errorMessage?: string
}

type Status = 'idle' | 'submitting' | 'success' | 'error'

export default function Newsletter({
	title,
	description,
	namePlaceholder,
	emailPlaceholder,
	buttonLabel,
	formAction,
	successMessage,
	errorMessage,
}: Props) {
	const [status, setStatus] = useState<Status>('idle')

	if (!title && !description && !buttonLabel) return null

	async function onSubmit(e: FormEvent<HTMLFormElement>) {
		e.preventDefault()

		const form = e.currentTarget
		const data = new FormData(form)
		const endpoint = formAction || '/api/subscribe'
		setStatus('submitting')

		try {
			const res = await fetch(endpoint, {
				method: 'POST',
				headers: { 'content-type': 'application/json' },
				body: JSON.stringify({
					name: data.get('name'),
					email: data.get('email'),
				}),
			})
			if (!res.ok) {
				const payload = (await res.json().catch(() => ({}))) as {
					error?: string
				}
				// Already subscribed: surface as success — they're on the list.
				if (payload.error === 'already_subscribed') {
					setStatus('success')
					form.reset()
					return
				}
				throw new Error(String(res.status))
			}
			setStatus('success')
			form.reset()
		} catch {
			setStatus('error')
		}
	}

	const inputClass =
		'h-12 w-full rounded-button bg-canvas px-4 text-regular leading-6 text-ink placeholder:text-ink-muted/70 outline-none focus-visible:ring-2 focus-visible:ring-accent'

	return (
		<section className="bg-neutral-darker rounded-md p-6 md:p-8">
			<div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
				<div className="space-y-2">
					{title && (
						<h2 className="text-canvas text-large leading-snug font-semibold md:text-h5">
							{title}
						</h2>
					)}
					{description && (
						<p className="text-canvas/70 max-w-xl text-small leading-5 md:text-small">
							{description}
						</p>
					)}
				</div>

				{status === 'success' ? (
					<p
						role="status"
						aria-live="polite"
						className="text-canvas text-small leading-6 lg:max-w-md lg:text-right"
					>
						{successMessage}
					</p>
				) : (
					<form
						onSubmit={onSubmit}
						className={cn(
							'flex w-full flex-col gap-3',
							'lg:w-auto lg:flex-row lg:items-center',
						)}
						aria-live="polite"
					>
						<label htmlFor="newsletter-name" className="sr-only">
							{namePlaceholder ?? 'Name'}
						</label>
						<input
							id="newsletter-name"
							type="text"
							name="name"
							required
							aria-required="true"
							autoComplete="given-name"
							placeholder={namePlaceholder}
							className={cn(inputClass, 'min-w-0 lg:w-44')}
							disabled={status === 'submitting'}
						/>
						<label htmlFor="newsletter-email" className="sr-only">
							{emailPlaceholder ?? 'Email'}
						</label>
						<input
							id="newsletter-email"
							type="email"
							name="email"
							required
							aria-required="true"
							autoComplete="email"
							placeholder={emailPlaceholder}
							className={cn(inputClass, 'min-w-0 lg:w-64')}
							disabled={status === 'submitting'}
						/>
						<Button
							className="shrink-0"
							variant="primary"
							size="medium"
							disabled={status === 'submitting'}
							type="submit"
						>
							{buttonLabel || 'Submit'}
						</Button>
					</form>
				)}
			</div>

			{status === 'error' && errorMessage && (
				<p
					role="alert"
					className="mt-4 text-small leading-5 text-red-400"
				>
					{errorMessage}
				</p>
			)}
		</section>
	)
}
