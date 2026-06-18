import { NextResponse } from 'next/server'
import { createClient } from 'next-sanity'
import { projectId, dataset, apiVersion } from '@/sanity/lib/env'

const writeClient = createClient({
	projectId,
	dataset,
	apiVersion,
	token: process.env.SANITY_API_WRITE_TOKEN,
	useCdn: false,
})

type Payload = {
	name?: unknown
	email?: unknown
	source?: unknown
	language?: unknown
}

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

function str(v: unknown, max = 200): string | null {
	if (typeof v !== 'string') return null
	const trimmed = v.trim().slice(0, max)
	return trimmed.length ? trimmed : null
}

export async function POST(req: Request) {
	let body: Payload
	try {
		body = (await req.json()) as Payload
	} catch {
		return NextResponse.json({ error: 'invalid_json' }, { status: 400 })
	}

	const name = str(body.name, 200)
	const email = str(body.email, 320)
	const source = str(body.source, 500) ?? undefined
	const language = str(body.language, 10) ?? undefined

	if (!name) {
		return NextResponse.json(
			{ error: 'missing_name', field: 'name' },
			{ status: 400 },
		)
	}
	if (!email || !EMAIL_RE.test(email)) {
		return NextResponse.json(
			{ error: 'invalid_email', field: 'email' },
			{ status: 400 },
		)
	}

	if (!process.env.SANITY_API_WRITE_TOKEN) {
		console.error('[api/subscribe] SANITY_API_WRITE_TOKEN is not set')
		return NextResponse.json({ error: 'server_misconfigured' }, { status: 500 })
	}

	const normalizedEmail = email.toLowerCase()
	const kind = 'newsletter'

	// Dedup: one subscription per email. 409 lets the client surface a distinct
	// "already subscribed" state.
	try {
		const existing = await writeClient.fetch<{ _id: string } | null>(
			`*[_type == 'subscription' && email == $email && kind == $kind][0]{ _id }`,
			{ email: normalizedEmail, kind },
		)
		if (existing) {
			return NextResponse.json(
				{ error: 'already_subscribed' },
				{ status: 409 },
			)
		}
	} catch (err) {
		console.error('[api/subscribe] dedup lookup failed', err)
	}

	const doc = {
		_type: 'subscription',
		name,
		email: normalizedEmail,
		kind,
		source,
		language,
		createdAt: new Date().toISOString(),
	}

	try {
		await writeClient.create(doc)
	} catch (err) {
		console.error('[api/subscribe] sanity write failed', err)
		return NextResponse.json({ error: 'storage_failed' }, { status: 500 })
	}

	return NextResponse.json({ ok: true })
}
