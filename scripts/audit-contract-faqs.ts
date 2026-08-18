// Run with: npx tsx --env-file=.env.local scripts/audit-contract-faqs.ts
import { createClient } from '@sanity/client'

const client = createClient({
	projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!,
	dataset: process.env.NEXT_PUBLIC_SANITY_DATASET!,
	token: process.env.SANITY_API_WRITE_TOKEN!,
	apiVersion: '2026-08-13',
	useCdn: false,
})

async function main() {
	// Offerings: faq[]
	const offerings = await client.fetch<
		Array<{
			_id: string
			title: string
			language: string
			faq?: Array<{ _key: string; q?: string; a?: string }>
		}>
	>(`*[_type == "offering"]{_id, title, language, faq}`)

	// Pages: modules[] with type svc-faq or accordion-list
	const pages = await client.fetch<
		Array<{
			_id: string
			title: string
			language: string
			modules?: Array<{
				_type: string
				_key: string
				eyebrow?: string
				items?: Array<{ _key: string; q?: string; a?: string; summary?: string; content?: unknown }>
			}>
			stage?: Array<{ _type: string; _key: string }>
		}>
	>(
		`*[_type == "page"]{
			_id, title, language,
			"modules": modules[_type == "svc-faq" || _type == "accordion-list"]{
				_type, _key, eyebrow, items[]{_key, q, a, summary, content}
			}
		}`,
	)

	console.log('\n=== OFFERINGS ===')
	for (const o of offerings) {
		if (!o.faq?.length) continue
		console.log(`\n[${o.language}] ${o.title} (${o._id})`)
		for (const item of o.faq) {
			console.log(`  Q: ${item.q}`)
			console.log(`  A: ${item.a}`)
			console.log(`  key: ${item._key}`)
		}
	}

	console.log('\n\n=== PAGES ===')
	for (const p of pages) {
		if (!p.modules?.length) continue
		console.log(`\n[${p.language}] ${p.title} (${p._id})`)
		for (const m of p.modules) {
			console.log(`  Module: ${m._type} (${m._key}) ${m.eyebrow ?? ''}`)
			for (const item of m.items ?? []) {
				const q = item.q ?? item.summary
				const a =
					item.a ??
					(Array.isArray(item.content)
						? JSON.stringify(item.content).slice(0, 500)
						: undefined)
				console.log(`    Q: ${q}`)
				console.log(`    A: ${a}`)
				console.log(`    key: ${item._key}`)
			}
		}
	}
}

main().catch((error) => {
	console.error(error)
	process.exitCode = 1
})
