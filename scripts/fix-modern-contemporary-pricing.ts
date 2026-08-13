// Run with: npx tsx --env-file=.env.local scripts/fix-modern-contemporary-pricing.ts
import { createClient } from '@sanity/client'

const client = createClient({
	projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!,
	dataset: process.env.NEXT_PUBLIC_SANITY_DATASET!,
	token: process.env.SANITY_API_WRITE_TOKEN!,
	apiVersion: '2026-08-13',
	useCdn: false,
})

const id = 'offering-jazz-musicaldance'

async function main() {
	const current = await client.fetch<{ _rev: string }>(
		'*[_id == $id][0]{_rev}',
		{ id },
	)

	if (!current?._rev) {
		throw new Error(`Offering not found: ${id}`)
	}

	const result = await client
		.patch(id)
		.ifRevisionId(current._rev)
		.set({
			'facts[_key=="k139"].value': '75 Min / Woche',
			'facts[_key=="k141"].value': '€45 / Monat',
			priceCurrency: '€',
			priceValue: '45',
			priceUnit: '/ Monat',
			'detailRows[_key=="k160"].value': '75 Min / Woche',
		})
		.commit()

	console.log(`Updated ${result._id} at revision ${result._rev}.`)
}

main().catch((error) => {
	console.error(error)
	process.exitCode = 1
})
