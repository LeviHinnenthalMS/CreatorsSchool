// Run with: npx tsx --env-file=.env.local scripts/fix-trial-lesson-consistency.ts
import { createClient } from '@sanity/client'

const client = createClient({
	projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!,
	dataset: process.env.NEXT_PUBLIC_SANITY_DATASET!,
	token: process.env.SANITY_API_WRITE_TOKEN!,
	apiVersion: '2026-08-11',
	useCdn: false,
	perspective: 'raw',
})

type LabeledValue = {
	_key: string
	_type: string
	key?: string
	value?: string
}

type Qa = {
	_key: string
	_type: 'qa'
	q: string
	a: string
}

type Offering = {
	_id: string
	facts?: LabeledValue[]
	detailRows?: LabeledValue[]
	faq?: Qa[]
}

const trialAnswer =
	'Die ersten zwei Probestunden sind kostenlos, wenn du bzw. dein Kind danach nicht weitermachst. Entscheidest du dich für den weiteren Unterricht, werden beide Probestunden rückwirkend berechnet.'

function normalizeTrialRows(items: LabeledValue[] | undefined) {
	return items?.map((item) =>
		/probestunde/i.test(item.key ?? '')
			? { ...item, key: 'Probestunden', value: '2 Termine' }
			: item,
	)
}

function normalizeOfferingFaq(id: string, items: Qa[] | undefined) {
	return items
		?.filter(
			(item) =>
				id !== 'offering-musikalische-fruehfoerderung' ||
				!/aufführung|auftritt/i.test(`${item.q} ${item.a}`),
		)
		.map((item) => {
			if (
				id === 'offering-musikalische-fruehfoerderung' &&
				/erste stunde/i.test(item.q)
			) {
				return {
					...item,
					a: 'Nichts außer Neugier und bequemer Kleidung. Instrumente stellen wir bereit.',
				}
			}

			if (id === 'offering-ballett' && /kostenlose Probestunde/i.test(item.a)) {
				return {
					...item,
					a: item.a
						.replace(/^Die kostenlose Probestunde/, 'Eine Probestunde')
						.replace(/die kostenlose Probestunde/, 'eine Probestunde'),
				}
			}

			return item
		})
}

async function main() {
	const offerings = await client.fetch<Offering[]>(`*[_type == "offering"]{
		_id, facts, detailRows, faq
	}`)

	const transaction = client.transaction()

	for (const offering of offerings) {
		const changes: Record<string, unknown> = {}
		const facts = normalizeTrialRows(offering.facts)
		const detailRows = normalizeTrialRows(offering.detailRows)
		const faq = normalizeOfferingFaq(offering._id, offering.faq)

		if (facts) changes.facts = facts
		if (detailRows) changes.detailRows = detailRows
		if (faq) changes.faq = faq

		if (offering._id === 'offering-musikalische-fruehfoerderung') {
			changes['metadata.description'] =
				'Musikalische Frühförderung für Kinder von 3 bis 6 Jahren: Musik, Rhythmus und Bewegung in individuell begleiteten Gruppen mit etwa 10 Kindern.'
		}

		transaction.patch(offering._id, (patch) => patch.set(changes))
	}

	transaction.patch('page-home', (patch) =>
		patch.set({
			'modules[_key=="k452"].features[_key=="k458"].title': 'Zwei Probestunden',
			'modules[_key=="k452"].features[_key=="k458"].text':
				'In Ruhe kennenlernen. Erst wenn du dich für den weiteren Unterricht entscheidest, werden die Probestunden rückwirkend berechnet.',
			'modules[_key=="k473"].ctaTileText':
				'Komm zu einer Probestunde und finde es heraus.',
		}),
	)

	transaction.patch('page-angebote', (patch) =>
		patch.set({
			'modules[_key=="k503"].features[_key=="k510"].title': '03 · Probestunden',
			'modules[_key=="k503"].features[_key=="k510"].text':
				'Zwei Termine geben Zeit zum Kennenlernen. Wenn du dich für den weiteren Unterricht entscheidest, werden sie rückwirkend berechnet.',
			'modules[_key=="k512"].items[_key=="k520"].q':
				'Wie funktionieren die Probestunden?',
			'modules[_key=="k512"].items[_key=="k520"].a': trialAnswer,
		}),
	)

	transaction.patch('d10863bf-4540-4ba5-bc52-43d5ef607815', (patch) =>
		patch.set({
			'modules[_key=="0138801e"].items[_key=="qa3"].q':
				'Wie funktionieren die Probestunden?',
			'modules[_key=="0138801e"].items[_key=="qa3"].a': trialAnswer,
		}),
	)

	const result = await transaction.commit()
	console.log(`Updated ${result.documentIds.length} documents.`)
}

main().catch((error) => {
	console.error(error)
	process.exitCode = 1
})
