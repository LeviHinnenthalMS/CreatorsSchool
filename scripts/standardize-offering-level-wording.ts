// Run with: npx tsx --env-file=.env.local scripts/standardize-offering-level-wording.ts
import { createClient } from '@sanity/client'

const client = createClient({
	projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!,
	dataset: process.env.NEXT_PUBLIC_SANITY_DATASET!,
	token: process.env.SANITY_API_WRITE_TOKEN!,
	apiVersion: '2026-08-01',
	useCdn: false,
})

const wordings = [
	{
		id: 'offering-ballett',
		factKey: 'k106',
		detailKey: 'k127',
		label: 'Stufen',
		value: '4 Stufen',
	},
	{
		id: 'offering-jazz-musicaldance',
		factKey: 'k140',
		detailKey: 'k161',
		label: 'Stufen',
		value: '3 Stufen',
	},
] as const

async function main() {
	const transaction = client.transaction()

	for (const wording of wordings) {
		transaction.patch(wording.id, (patch) =>
			patch.set({
				[`facts[_key=="${wording.factKey}"].key`]: wording.label,
				[`facts[_key=="${wording.factKey}"].value`]: wording.value,
				[`detailRows[_key=="${wording.detailKey}"].key`]: wording.label,
				[`detailRows[_key=="${wording.detailKey}"].value`]: wording.value,
			}),
		)
	}

	const result = await transaction.commit()
	console.log(`Standardized level wording on ${result.documentIds.length} offerings.`)
}

main().catch((error) => {
	console.error(error)
	process.exitCode = 1
})
