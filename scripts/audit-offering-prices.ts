// Run with: npx tsx --env-file=.env.local scripts/audit-offering-prices.ts
import { createClient } from '@sanity/client'

const client = createClient({
	projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!,
	dataset: process.env.NEXT_PUBLIC_SANITY_DATASET!,
	token: process.env.SANITY_API_WRITE_TOKEN!,
	apiVersion: '2026-08-13',
	useCdn: false,
})

async function main() {
	const offerings = await client.fetch<
		Array<{
			_id: string
			title: string
			priceLabel?: string
			priceCurrency?: string
			priceValue?: string
			priceUnit?: string
			facts?: Array<{ key?: string; value?: string }>
			detailRows?: Array<{ key?: string; value?: string }>
		}>
	>(`*[_type == "offering"]{_id, title, priceLabel, priceCurrency, priceValue, priceUnit, facts, detailRows}`)

	for (const o of offerings) {
		console.log(`\n=== ${o.title} (${o._id}) ===`)
		console.log(`  price fields: label=${o.priceLabel} curr=${o.priceCurrency} value=${o.priceValue} unit=${o.priceUnit}`)
		console.log(`  facts:`)
		for (const f of o.facts ?? []) console.log(`    · ${f.key} = ${f.value}`)
		console.log(`  detailRows:`)
		for (const r of o.detailRows ?? []) console.log(`    · ${r.key} = ${r.value}`)
	}
}

main().catch((error) => {
	console.error(error)
	process.exitCode = 1
})
