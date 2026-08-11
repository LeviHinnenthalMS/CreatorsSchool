// Run with: npx tsx --env-file=.env.local scripts/fix-group-size-messaging.ts
import { createClient } from '@sanity/client'

const client = createClient({
	projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!,
	dataset: process.env.NEXT_PUBLIC_SANITY_DATASET!,
	token: process.env.SANITY_API_WRITE_TOKEN!,
	apiVersion: '2026-08-11',
	useCdn: false,
})

async function main() {
	const transaction = client.transaction()

	transaction.patch('offering-musikalische-fruehfoerderung', (patch) =>
		patch.set({
			lede: 'Kinder entdecken Musik mit Stimme, Bewegung und ersten Instrumenten. In Gruppen von bis zu zehn Kindern bekommen Neugier, Rhythmusgefühl und eigener Ausdruck Raum.',
			'facts[_key=="k8"].value': 'Gruppe · bis zu 10 Kinder',
			'detailRows[_key=="k29"].value': 'Bis zu 10 Kinder',
		}),
	)

	transaction.patch('offering-taenzerische-fruehfoerderung', (patch) =>
		patch.set({
			'facts[_key=="k73"].value': 'Bis zu 10 Kinder',
			'detailRows[_key=="k94"].value': 'Bis zu 10 Kinder',
		}),
	)

	transaction.patch('page-home', (patch) =>
		patch.set({
			'modules[_key=="k452"].tagline':
				'Vom ersten Klangerlebnis mit 1,5 Jahren bis zur Bühne im Erwachsenenalter: In individuell begleiteten Gruppen geben wir Menschen Raum für ihren eigenen Ausdruck.',
			'modules[_key=="k452"].features[_key=="k457"].text':
				'In individuell begleiteten Gruppen entsteht echte Beziehung. Miriam und ihr Team kennen die Schüler:innen, nehmen ihre Entwicklung wahr und begleiten sie persönlich.',
			'modules[_key=="k452"].features[_key=="k459"].title':
				'Individuelle Gruppen',
			'modules[_key=="k452"].features[_key=="k459"].text':
				'Unsere Gruppen werden passend zum jeweiligen Angebot gestaltet. So bleibt Raum für das eigene Tempo und die persönliche Entwicklung.',
			'modules[_key=="k468"].tagline':
				'Singen, hören, bewegen und ausprobieren: In individuell begleiteten Gruppen bekommen die ersten musikalischen Impulse Zeit, sich zu entfalten.',
			'modules[_key=="k486"].stats[_key=="k493"].value': 'Individuell',
			'modules[_key=="k486"].stats[_key=="k493"].label': 'begleitete Gruppen',
		}),
	)

	transaction.patch('page-ueber-uns', (patch) =>
		patch.set({
			'modules[_key=="k597"].features[_key=="k602"].text':
				'Individuell begleitete Gruppen geben uns die Zeit, genau hinzusehen. Wir begleiten nicht nur Leistungen, sondern den Menschen mit seinem eigenen Tempo und Ausdruck.',
		}),
	)

	transaction.patch('page-jobs', (patch) =>
		patch.set({
			'modules[_key=="warum-wir"].lead':
				'Bei uns unterrichtest du in individuell begleiteten Gruppen und kennst deine Schüler:innen persönlich. Du bringst deine künstlerische Erfahrung ein und gestaltest Unterricht in einem Team, das miteinander denkt und füreinander da ist.',
			'modules[_key=="warum-wir"].items[_key=="wi1"].title':
				'Individuelle Gruppen',
			'modules[_key=="warum-wir"].items[_key=="wi1"].text':
				'Du kennst deine Schüler:innen persönlich und kannst ihre Entwicklung aufmerksam begleiten.',
		}),
	)

	transaction.patch('navigation-de', (patch) =>
		patch.set({
			'items[_key=="k714"].links[_key=="k716"].description':
				'3–6 Jahre · bis zu 10 Kinder',
		}),
	)

	transaction.patch('d10863bf-4540-4ba5-bc52-43d5ef607815', (patch) =>
		patch.set({
			'modules[_key=="9fc2ed65"].cards[_key=="lc1"].title':
				'Individuelle Gruppen',
			'modules[_key=="9fc2ed65"].cards[_key=="lc1"].text':
				'Je nach Angebot lernen die Schüler:innen in passend zusammengestellten Gruppen und werden aufmerksam begleitet.',
			'modules[_key=="146c9a8c"].items[_key=="acc1"].content[_key=="acc1_b1"].children[_key=="acc1_s1"].text':
				'Bei uns steht das Kind im Mittelpunkt. Individuell begleitete Gruppen, engagierte Lehrkräfte und ein liebevolles Umfeld machen den Unterschied.',
		}),
	)

	const result = await transaction.commit()
	console.log(`Updated ${result.documentIds.length} documents.`)
}

main().catch((error) => {
	console.error(error)
	process.exitCode = 1
})
