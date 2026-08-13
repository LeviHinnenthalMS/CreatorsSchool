// Run with: npx tsx --env-file=.env.local scripts/fix-parent-child-course-duration.ts
import { createClient } from '@sanity/client'

const client = createClient({
	projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!,
	dataset: process.env.NEXT_PUBLIC_SANITY_DATASET!,
	token: process.env.SANITY_API_WRITE_TOKEN!,
	apiVersion: '2026-08-13',
	useCdn: false,
})

const id = 'offering-eltern-kind-kurs'

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
			'forWho[_key=="k47"].text':
				'45 Minuten, in denen gemeinsames Singen, Bewegen und Wahrnehmen im Mittelpunkt stehen.',
			'detailRows[_key=="k60"].value': '45 Min / Woche',
		})
		.commit()

	console.log(`Updated ${result._id} at revision ${result._rev}.`)
}

main().catch((error) => {
	console.error(error)
	process.exitCode = 1
})
