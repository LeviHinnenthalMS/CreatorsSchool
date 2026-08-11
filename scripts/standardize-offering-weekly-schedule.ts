// Run with: npx tsx --env-file=.env.local scripts/standardize-offering-weekly-schedule.ts
import { createClient } from '@sanity/client'

const client = createClient({
	projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!,
	dataset: process.env.NEXT_PUBLIC_SANITY_DATASET!,
	token: process.env.SANITY_API_WRITE_TOKEN!,
	apiVersion: '2026-08-01',
	useCdn: false,
})

type DetailRow = {
	_key: string
	_type: 'detailRow'
	key?: string
	value?: string
}

type Offering = {
	_id: string
	detailRows?: DetailRow[]
}

const recurringOfferingIds = [
	'offering-musikalische-fruehfoerderung',
	'offering-eltern-kind-kurs',
	'offering-taenzerische-fruehfoerderung',
	'offering-ballett',
	'offering-jazz-musicaldance',
]

async function main() {
	const offerings = await client.fetch<Offering[]>(
		`*[_id in $ids]{ _id, detailRows }`,
		{ ids: recurringOfferingIds },
	)
	const transaction = client.transaction()

	for (const offering of offerings) {
		const rows = offering.detailRows ?? []
		const weeklyRow = rows.find((row) => row.key === 'Unterricht')

		if (weeklyRow) {
			transaction.patch(offering._id, (patch) =>
				patch.set({
					[`detailRows[_key=="${weeklyRow._key}"].value`]: 'Wöchentlich',
				}),
			)
			continue
		}

		transaction.patch(offering._id, (patch) =>
			patch.set({
				detailRows: [
					...rows,
					{
						_key: 'weekly-lessons',
						_type: 'detailRow',
						key: 'Unterricht',
						value: 'Wöchentlich',
					},
				],
			}),
		)
	}

	const result = await transaction.commit()
	console.log(
		`Standardized weekly schedules on ${result.documentIds.length} offerings.`,
	)
}

main().catch((error) => {
	console.error(error)
	process.exitCode = 1
})
