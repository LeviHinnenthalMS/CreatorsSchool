'use server'

import { createClient } from 'next-sanity'
import { projectId, dataset, apiVersion } from '@/sanity/lib/env'
import { Resend } from 'resend'
import { createElement } from 'react'
import ContactNotification from '@/emails/ContactNotification'

const writeToken =
	process.env.SANITY_API_WRITE_TOKEN || process.env.SANITY_API_READ_TOKEN

const resend = process.env.RESEND_API_KEY ? new Resend(process.env.RESEND_API_KEY) : null
const NOTIFY_TO = process.env.CONTACT_NOTIFY_EMAIL   // e.g. miriam@creators-school.de
const NOTIFY_FROM = process.env.CONTACT_FROM_EMAIL   // e.g. anfragen@creators-school.de

const writeClient = writeToken
	? createClient({
			projectId,
			dataset,
			apiVersion,
			useCdn: false,
			token: writeToken,
		})
	: null

export type ContactPayload = {
	name?: string
	contact?: string   // phone or email — new combined field
	interest?: string
	childAge?: string
	sourcePath?: string
	_hp?: string       // honeypot — must be empty
}

// Strip HTML tags and limit length — trust boundary for all user input
function sanitize(value: string | undefined, maxLen = 300): string {
	return (value ?? '').replace(/<[^>]*>/g, '').trim().slice(0, maxLen)
}

export async function submitContact(payload: ContactPayload) {
	// Honeypot check — silently succeed so bots don't retry
	if (payload._hp) return { ok: true as const, mode: 'honeypot' as const }

	const contact = sanitize(payload.contact)
	const name = sanitize(payload.name)
	if (!contact || !name) {
		return { ok: false as const, error: 'missing-required' }
	}

	const isEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(contact)

	if (!writeClient) {
		console.warn('[contactSubmit] No write token — logged only.', { name, contact })
		return { ok: true as const, mode: 'console' as const }
	}

	try {
		await writeClient.create({
			_type: 'contactSubmission',
			name,
			email: isEmail ? contact : '',
			phone: isEmail ? '' : contact,
			interest: sanitize(payload.interest),
			childAge: sanitize(payload.childAge),
			submittedAt: new Date().toISOString(),
			sourcePath: sanitize(payload.sourcePath, 200),
		})
		if (resend && NOTIFY_TO && NOTIFY_FROM) {
			resend.emails.send({
				from: NOTIFY_FROM,
				to: NOTIFY_TO,
				subject: `Neue Anfrage von ${name}`,
				react: createElement(ContactNotification, {
					name,
					contact,
					interest: sanitize(payload.interest) || undefined,
					childAge: sanitize(payload.childAge) || undefined,
					sourcePath: sanitize(payload.sourcePath, 200) || undefined,
				}),
			}).catch((e) => console.error('[contactSubmit] Resend error', e))
		} else if (!resend) {
			console.warn('[contactSubmit] RESEND_API_KEY not set — email skipped.')
		}

		return { ok: true as const, mode: 'saved' as const }
	} catch (err) {
		console.error('[contactSubmit] Failed to write submission', err)
		return { ok: false as const, error: 'server' }
	}
}
