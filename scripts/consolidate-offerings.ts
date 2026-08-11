// Run with: npx tsx --env-file=.env.local scripts/consolidate-offerings.ts
import { createClient } from '@sanity/client'

const client = createClient({
	projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!,
	dataset: process.env.NEXT_PUBLIC_SANITY_DATASET!,
	token: process.env.SANITY_API_WRITE_TOKEN!,
	apiVersion: '2026-08-01',
	useCdn: false,
})

const consolidations = [
	{
		id: 'offering-ballett-ab-9',
		source: '/angebote/ballett-ab-9',
		destination: '/angebote/ballett',
	},
	{
		id: 'offering-moderndance-ab-10',
		source: '/angebote/moderndance-ab-10',
		destination: '/angebote/jazz-musicaldance',
	},
	{
		id: 'offering-moderndance-ab-15',
		source: '/angebote/moderndance-ab-15',
		destination: '/angebote/jazz-musicaldance',
	},
	{
		id: 'offering-moderndance-ab-18',
		source: '/angebote/moderndance-ab-18',
		destination: '/angebote/jazz-musicaldance',
	},
	{
		id: 'offering-moderndance-ab-30',
		source: '/angebote/moderndance-ab-30',
		destination: '/angebote/jazz-musicaldance',
	},
] as const

async function main() {
	const transaction = client.transaction()

	for (const item of consolidations) {
		transaction.createOrReplace({
			_id: `redirect-${item.id}`,
			_type: 'redirect',
			source: item.source,
			destination: {
				_type: 'link',
				type: 'external',
				external: item.destination,
			},
			permanent: true,
		})
		transaction.delete(`drafts.${item.id}`)
		transaction.delete(item.id)
	}

	const result = await transaction.commit()
	console.log(
		`Consolidated ${consolidations.length} offerings and created permanent redirects.`,
	)
	console.log(`Changed ${result.documentIds.length} Sanity documents.`)
}

main().catch((error) => {
	console.error(error)
	process.exitCode = 1
})
