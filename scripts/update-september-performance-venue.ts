// Run with: npx tsx --env-file=.env.local scripts/update-september-performance-venue.ts
import { createClient } from '@sanity/client'

const client = createClient({
	projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!,
	dataset: process.env.NEXT_PUBLIC_SANITY_DATASET!,
	token: process.env.SANITY_API_WRITE_TOKEN!,
	apiVersion: '2026-08-17',
	useCdn: false,
})

async function main() {
	const result = await client
		.transaction()
		.patch('performance-sept-2026', (patch) =>
			patch.set({
				title: 'Aufführungen im Theater Melle · September 2026',
				venue: 'Theater Melle',
			}),
		)
		.patch('page-auffuehrungen', (patch) =>
			patch.set({
				'metadata.description':
					'Tanz- und Musikaufführungen der Creators School im Theater Melle: Termine, Programm und Informationen zu Tickets.',
				'modules[_key=="kHP01"].sub': 'Theater Melle · Beginn jeweils am Abend',
				'modules[_key=="k673"].features[_key=="k679"].text':
					'Licht, Kostüme und die Atmosphäre im Theater Melle machen die Bühne zu einem Ort, an dem der eigene Ausdruck sichtbar werden darf.',
				'modules[_key=="k687"].items[_key=="k694"].a':
					'Im Theater Melle. Die genaue Anfahrt und Einlasszeit teilen wir mit der Kartenbestätigung mit.',
			}),
		)
		.patch('page-home', (patch) =>
			patch.set({
				'modules[_key=="k445"].title[_key=="k446"].children[_key=="k449"].text':
					' im Theater Melle.',
			}),
		)
		.commit()

	console.log(`Updated ${result.documentIds.length} documents.`)
}

main().catch((error) => {
	console.error(error)
	process.exit(1)
})
