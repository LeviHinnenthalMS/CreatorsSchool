// Run with: npx tsx --env-file=.env.local scripts/fix-kindergarten-project-region.ts
import { createClient } from '@sanity/client'

const client = createClient({
	projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!,
	dataset: process.env.NEXT_PUBLIC_SANITY_DATASET!,
	token: process.env.SANITY_API_WRITE_TOKEN!,
	apiVersion: '2026-08-13',
	useCdn: false,
})

const id = 'offering-kindergarten-projekte'

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
			'forWho[_key=="k244"].title':
				'Kindertagesstätten von Minden bis Herford',
			'forWho[_key=="k244"].text':
				'Seit 2002 arbeiten wir mit Kindertagesstätten von Minden bis Herford verlässlich und pädagogisch fundiert zusammen.',
			'detailRows[_key=="k260"].value': 'Minden bis Herford',
			'faq[_key=="k268"].a':
				'Von Minden bis Herford. Bei größeren Projekten sprechen wir gern über weitere Entfernungen.',
		})
		.commit()

	console.log(`Updated ${result._id} at revision ${result._rev}.`)
}

main().catch((error) => {
	console.error(error)
	process.exitCode = 1
})
