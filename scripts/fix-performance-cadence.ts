// Run with: npx tsx --env-file=.env.local scripts/fix-performance-cadence.ts
import { createClient } from '@sanity/client'

const client = createClient({
	projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!,
	dataset: process.env.NEXT_PUBLIC_SANITY_DATASET!,
	token: process.env.SANITY_API_WRITE_TOKEN!,
	apiVersion: '2026-08-11',
	useCdn: false,
})

type DetailRow = {
	_key: string
	_type: 'detailRow'
	key: string
	value: string
}

async function main() {
	const rows = await client.fetch<{
		ballet: DetailRow[]
	}>(`{
		"ballet": *[_id == "offering-ballett"][0].detailRows
	}`)

	const transaction = client.transaction()

	transaction.patch('offering-ballett', (patch) =>
		patch.set({
			lede: 'Klassisches Ballett verbindet sorgfältig aufgebaute Technik mit Musikalität und Ausdruck. Vom Kinderballett bis zur fortgeschrittenen Klasse wächst jede Stufe auf gemeinsame Aufführungen hin.',
			'forWho[_key=="k114"].text':
				'Aufführungen geben dem gemeinsamen Lernen ein Ziel und machen Entwicklung auf der Bühne sichtbar.',
			'learn[_key=="k121"].text':
				'Choreografien werden gemeinsam entwickelt und sorgfältig für kommende Aufführungen vorbereitet.',
			'faq[_key=="k137"].a':
				'Ja — regelmäßig auf einer echten Bühne, mit Kostümen und Bühnenbild.',
			detailRows: (rows.ballet ?? []).filter((row) => row.key !== 'Aufführung'),
		}),
	)

	transaction.patch('offering-jazz-musicaldance', (patch) =>
		patch.set({
			'faq[_key=="k170"].a':
				'Ja — bei verschiedenen Gelegenheiten, darunter unsere große Aufführung im Schauspielhaus Melle.',
		}),
	)

	transaction.patch('d10863bf-4540-4ba5-bc52-43d5ef607815', (patch) =>
		patch.set({
			'modules[_key=="6e6ded2e"].features[_key=="fg4"].text':
				'Regelmäßige Aufführungen im Schauspielhaus Melle für alle Schüler:innen.',
			'modules[_key=="078c981c"].items[_key=="si3"].text':
				'Regelmäßige Aufführungen, Bühnenworkshops und Projektarbeit.',
		}),
	)

	const result = await transaction.commit()
	console.log(`Updated ${result.documentIds.length} documents.`)
}

main().catch((error) => {
	console.error(error)
	process.exit(1)
})
