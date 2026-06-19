'use server'

import { createClient } from 'next-sanity'
import { projectId, dataset, apiVersion } from '@/sanity/lib/env'

const writeToken =
	process.env.SANITY_API_WRITE_TOKEN || process.env.SANITY_API_READ_TOKEN

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
	childName?: string
	email?: string
	phone?: string
	interest?: string
	childAge?: string
	preferredTime?: string
	message?: string
	sourcePath?: string
}

export async function submitContact(payload: ContactPayload) {
	// Trust boundary: validate at input. Email + name are required.
	const email = (payload.email || '').trim()
	const name = (payload.name || '').trim()
	if (!email || !name) {
		return { ok: false as const, error: 'missing-required' }
	}
	if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
		return { ok: false as const, error: 'invalid-email' }
	}

	if (!writeClient) {
		console.warn(
			'[contactSubmit] No Sanity write token configured — submission was logged only.',
			{ name, email },
		)
		return { ok: true as const, mode: 'console' as const }
	}

	try {
		await writeClient.create({
			_type: 'contactSubmission',
			name,
			email,
			childName: payload.childName,
			phone: payload.phone,
			interest: payload.interest,
			childAge: payload.childAge,
			preferredTime: payload.preferredTime,
			message: payload.message,
			submittedAt: new Date().toISOString(),
			sourcePath: payload.sourcePath,
		})
		return { ok: true as const, mode: 'saved' as const }
	} catch (err) {
		console.error('[contactSubmit] Failed to write submission', err)
		return { ok: false as const, error: 'server' }
	}
}
