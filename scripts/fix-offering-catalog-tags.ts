// Run with: npx tsx --env-file=.env.local scripts/fix-offering-catalog-tags.ts
import { createClient } from '@sanity/client'

const client = createClient({
	projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!,
	dataset: process.env.NEXT_PUBLIC_SANITY_DATASET!,
	token: process.env.SANITY_API_WRITE_TOKEN!,
	apiVersion: '2026-08-01',
	useCdn: false,
})

async function main() {
	const modernLevelRow = await client.fetch<{ _key?: string } | null>(
		`*[_id == "offering-jazz-musicaldance"][0].detailRows[key == "Niveaus"][0]{ _key }`,
	)
	const transaction = client
		.transaction()
		.patch('offering-musikalische-fruehfoerderung', (patch) =>
			patch.set({ catalogTag: 'Beliebt · 3–6 Jahre' }),
		)
		.patch('offering-taenzerische-fruehfoerderung', (patch) =>
			patch.set({ catalogTag: '3–6 Jahre' }),
		)
		.patch('offering-ballett', (patch) =>
			patch.set({
				catalogTag: 'Ab 6 Jahren · bis ins Erwachsenenalter',
			}),
		)
		.patch('offering-jazz-musicaldance', (patch) =>
			patch.set({
				catalogTag: 'Ab 8 Jahren · bis ins Erwachsenenalter',
			}),
		)

	if (modernLevelRow?._key) {
		transaction.patch('offering-jazz-musicaldance', (patch) =>
			patch.set({
				[`detailRows[_key=="${modernLevelRow._key}"].value`]: '3 Stufen',
			}),
		)
	}

	const result = await transaction.commit()

	console.log(`Updated catalog metadata on ${result.documentIds.length} offerings.`)
}

main().catch((error) => {
	console.error(error)
	process.exitCode = 1
})
