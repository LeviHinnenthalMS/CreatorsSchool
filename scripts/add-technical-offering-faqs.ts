// Run with: npx tsx --env-file=.env.local scripts/add-technical-offering-faqs.ts
import { createClient } from '@sanity/client'

const client = createClient({
	projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!,
	dataset: process.env.NEXT_PUBLIC_SANITY_DATASET!,
	token: process.env.SANITY_API_WRITE_TOKEN!,
	apiVersion: '2026-08-13',
	useCdn: false,
})

type Faq = { _key: string; _type: 'qa'; q: string; a: string }
type Offering = { _id: string; _rev: string; faq?: Array<{ _key: string }> }

const recurringOfferingIds = [
	'offering-musikalische-fruehfoerderung',
	'offering-eltern-kind-kurs',
	'offering-taenzerische-fruehfoerderung',
	'offering-ballett',
	'offering-jazz-musicaldance',
]

const recurringFaqs: Faq[] = [
	{
		_key: 'technical-trial-lessons',
		_type: 'qa',
		q: 'Wie funktionieren die Probestunden?',
		a: 'Die ersten zwei Probestunden sind kostenlos, wenn du bzw. dein Kind danach nicht weitermachst. Entscheidest du dich für den weiteren Unterricht, werden beide Probestunden rückwirkend berechnet.',
	},
	{
		_key: 'technical-contract-term',
		_type: 'qa',
		q: 'Gibt es feste Vertragslaufzeiten?',
		a: 'Wir arbeiten mit Halbjahresverträgen, die sich automatisch verlängern und mit sechs Wochen Frist kündbar sind.',
	},
	{
		_key: 'technical-school-holidays',
		_type: 'qa',
		q: 'Was passiert in den Ferien?',
		a: 'In den Schulferien Niedersachsens pausiert der Unterricht. Die Beitragspauschale ist auf 38 Unterrichtswochen pro Jahr kalkuliert.',
	},
]

const kindergartenFaqs: Faq[] = [
	{
		_key: 'technical-project-agreement',
		_type: 'qa',
		q: 'Wie werden Umfang und Kosten vereinbart?',
		a: 'Im kostenlosen Erstgespräch stimmen wir Format, Termine und Kosten passend zur Einrichtung ab.',
	},
	{
		_key: 'technical-project-frequency',
		_type: 'qa',
		q: 'Sind nur regelmäßige Termine möglich?',
		a: 'Nein. Wir kommen wöchentlich oder gestalten eine einzelne Projektwoche — je nachdem, was zu eurer Einrichtung passt.',
	},
]

async function main() {
	const ids = [...recurringOfferingIds, 'offering-kindergarten-projekte']
	const offerings = await client.fetch<Offering[]>(
		'*[_id in $ids]{_id,_rev,faq[]{_key}}',
		{ ids },
	)

	if (offerings.length !== ids.length) {
		const found = new Set(offerings.map((offering) => offering._id))
		const missing = ids.filter((id) => !found.has(id))
		throw new Error(`Offering(s) not found: ${missing.join(', ')}`)
	}

	const transaction = client.transaction()
	let added = 0

	for (const offering of offerings) {
		const desired =
			offering._id === 'offering-kindergarten-projekte'
				? kindergartenFaqs
				: recurringFaqs
		const existingKeys = new Set(offering.faq?.map((item) => item._key))
		const missingFaqs = desired.filter((item) => !existingKeys.has(item._key))

		if (missingFaqs.length === 0) continue

		transaction.patch(offering._id, (patch) =>
			patch.ifRevisionId(offering._rev).append('faq', missingFaqs),
		)
		added += missingFaqs.length
	}

	if (added === 0) {
		console.log('All technical FAQs already exist.')
		return
	}

	const result = await transaction.commit()
	console.log(
		`Added ${added} FAQ entries across ${result.documentIds.length} offerings.`,
	)
}

main().catch((error) => {
	console.error(error)
	process.exitCode = 1
})
