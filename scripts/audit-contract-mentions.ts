// Run with: npx tsx --env-file=.env.local scripts/audit-contract-mentions.ts
// Sweeps all Sanity docs for any mention of contract/cancellation/holiday/price terms.
import { createClient } from '@sanity/client'

const client = createClient({
	projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!,
	dataset: process.env.NEXT_PUBLIC_SANITY_DATASET!,
	token: process.env.SANITY_API_WRITE_TOKEN!,
	apiVersion: '2026-08-13',
	useCdn: false,
})

const patterns = [
	/vertragslauf/i,
	/halbjahres/i,
	/kündig/i,
	/kuendig/i,
	/sechs wochen/i,
	/6 wochen/i,
	/vier wochen/i,
	/4 wochen/i,
	/monatsbeitrag/i,
	/monatsbeiträg/i,
	/44\s?€/i,
	/43\s?€/i,
	/45\s?€/i,
	/probestunde/i,
	/ferien/i,
	/feiertag/i,
	/sepa/i,
	/lastschrift/i,
	/beitrag/i,
]

function walk(node: unknown, hits: string[], path = '') {
	if (typeof node === 'string') {
		for (const re of patterns) {
			if (re.test(node)) {
				hits.push(`${path}: ${node.replace(/\s+/g, ' ').slice(0, 200)}`)
				break
			}
		}
	} else if (Array.isArray(node)) {
		node.forEach((v, i) => walk(v, hits, `${path}[${i}]`))
	} else if (node && typeof node === 'object') {
		for (const [k, v] of Object.entries(node)) {
			if (k.startsWith('_')) continue
			walk(v, hits, path ? `${path}.${k}` : k)
		}
	}
}

async function main() {
	const docs = await client.fetch<Array<{ _id: string; _type: string }>>(
		`*[!(_id in path("drafts.**")) && !(_type match "system.*")]`,
	)

	console.log(`Scanning ${docs.length} docs…\n`)

	for (const doc of docs) {
		const hits: string[] = []
		walk(doc, hits)
		if (hits.length) {
			console.log(`\n== ${doc._type} · ${doc._id} ==`)
			for (const h of hits) console.log(`  ${h}`)
		}
	}
}

main().catch((error) => {
	console.error(error)
	process.exitCode = 1
})
