// Run with: npx tsx --env-file=.env.local scripts/fix-offering-price-range-faq.ts
import { createClient } from '@sanity/client'

const client = createClient({
	projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!,
	dataset: process.env.NEXT_PUBLIC_SANITY_DATASET!,
	token: process.env.SANITY_API_WRITE_TOKEN!,
	apiVersion: '2026-08-13',
	useCdn: false,
})

const id = 'page-angebote'

async function main() {
	const current = await client.fetch<{ _rev: string }>(
		'*[_id == $id][0]{_rev}',
		{ id },
	)

	if (!current?._rev) {
		throw new Error(`Page not found: ${id}`)
	}

	const result = await client
		.patch(id)
		.ifRevisionId(current._rev)
		.set({
			'modules[_key=="k512"].items[_key=="k519"].a':
				'Die Monatsbeiträge für unsere Gruppenangebote liegen aktuell – je nach Kurs und Unterrichtsdauer – zwischen 43 € und 45 €. Preise für individuelle Projekte teilen wir auf Anfrage mit. Für Geschwister gibt es Rabatte.',
		})
		.commit()

	console.log(`Updated ${result._id} at revision ${result._rev}.`)
}

main().catch((error) => {
	console.error(error)
	process.exitCode = 1
})
