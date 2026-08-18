// Run with: npx tsx --env-file=.env.local scripts/fix-school-holidays-faq.ts
import { createClient } from '@sanity/client'

const client = createClient({
	projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!,
	dataset: process.env.NEXT_PUBLIC_SANITY_DATASET!,
	token: process.env.SANITY_API_WRITE_TOKEN!,
	apiVersion: '2026-08-13',
	useCdn: false,
})

const newAnswer =
	'Während der Schulferien und an Feiertagen findet kein Unterricht statt. Die Ferien richten sich nach dem Kalender des jeweiligen Bundeslandes. Der Monatsbeitrag läuft in dieser Zeit weiter — er ist als Pauschale über das ganze Jahr kalkuliert.'

const targets: Array<{ id: string; path: string }> = [
	{ id: 'offering-ballett', path: 'faq[_key=="technical-school-holidays"].a' },
	{ id: 'offering-eltern-kind-kurs', path: 'faq[_key=="technical-school-holidays"].a' },
	{ id: 'offering-jazz-musicaldance', path: 'faq[_key=="technical-school-holidays"].a' },
	{ id: 'offering-musikalische-fruehfoerderung', path: 'faq[_key=="technical-school-holidays"].a' },
	{ id: 'offering-taenzerische-fruehfoerderung', path: 'faq[_key=="technical-school-holidays"].a' },
	{ id: 'page-angebote', path: 'modules[_key=="k512"].items[_key=="k522"].a' },
]

async function main() {
	for (const { id, path } of targets) {
		const current = await client.fetch<{ _rev: string } | null>(
			'*[_id == $id][0]{_rev}',
			{ id },
		)
		if (!current?._rev) {
			console.warn(`  skip ${id} (not found)`)
			continue
		}
		const result = await client
			.patch(id)
			.ifRevisionId(current._rev)
			.set({ [path]: newAnswer })
			.commit()
		console.log(`  ✓ ${result._id} @ ${path}`)
	}
}

main().catch((error) => {
	console.error(error)
	process.exitCode = 1
})
