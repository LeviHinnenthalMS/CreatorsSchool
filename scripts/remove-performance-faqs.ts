// Run with: npx tsx --env-file=.env.local scripts/remove-performance-faqs.ts
import { createClient } from '@sanity/client'

const client = createClient({
	projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!,
	dataset: process.env.NEXT_PUBLIC_SANITY_DATASET!,
	token: process.env.SANITY_API_WRITE_TOKEN!,
	apiVersion: '2026-08-13',
	useCdn: false,
})

type Match = {
	_id: string
	_rev: string
	faq: Array<{ _key: string; q?: string }>
}

async function main() {
	const documents = await client.fetch<Match[]>(
		'*[defined(faq) && count(faq[q == "Gibt es Auftritte?"]) > 0]{_id,_rev,faq}',
	)

	if (documents.length === 0) {
		console.log('No matching FAQ entries found.')
		return
	}

	const transaction = client.transaction()

	for (const document of documents) {
		const keys = document.faq
			.filter((item) => item.q === 'Gibt es Auftritte?')
			.map((item) => item._key)

		transaction.patch(document._id, (patch) =>
			patch
				.ifRevisionId(document._rev)
				.unset(keys.map((key) => `faq[_key=="${key}"]`)),
		)
	}

	const result = await transaction.commit()
	console.log(`Updated ${result.documentIds.length} document(s).`)
}

main().catch((error) => {
	console.error(error)
	process.exitCode = 1
})
