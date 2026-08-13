// Run with: pnpm apply-miriam-latest-feedback
import { createClient } from '@sanity/client'

const client = createClient({
	projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!,
	dataset: process.env.NEXT_PUBLIC_SANITY_DATASET!,
	token: process.env.SANITY_API_WRITE_TOKEN!,
	apiVersion: '2026-08-01',
	useCdn: false,
})

type Qa = { _key: string; _type: 'qa'; q: string; a: string }
type DetailRow = {
	_key: string
	_type: 'detailRow'
	key: string
	value: string
}

type TimelineItem = {
	_key: string
	_type: 'timelineItem'
	year: string
	title: Array<{
		_key: string
		_type: 'block'
		style: 'normal'
		markDefs: []
		children: Array<{
			_key: string
			_type: 'span'
			marks: []
			text: string
		}>
	}>
	text: string
}

const timelineItems: TimelineItem[] = [
	{
		_key: 'tl-2002',
		_type: 'timelineItem',
		year: '2002',
		title: [
			{
				_key: 'tl-2002-title',
				_type: 'block',
				style: 'normal',
				markDefs: [],
				children: [
					{
						_key: 'tl-2002-title-span',
						_type: 'span',
						marks: [],
						text: 'Die Schule entsteht',
					},
				],
			},
		],
		text: 'Das Forum Musaik wird gegründet und schafft einen Ort, an dem Kinder und Familien Musik, Kreativität und gemeinsames Erleben entdecken können.',
	},
	{
		_key: 'tl-2005',
		_type: 'timelineItem',
		year: '2005',
		title: [
			{
				_key: 'tl-2005-title',
				_type: 'block',
				style: 'normal',
				markDefs: [],
				children: [
					{
						_key: 'tl-2005-title-span',
						_type: 'span',
						marks: [],
						text: 'Ein fester Ort für musikalische Bildung',
					},
				],
			},
		],
		text: 'Über die ersten Jahre wächst die Schule und entwickelt sich zu einem festen Bestandteil der lokalen Bildungs- und Kulturlandschaft.',
	},
	{
		_key: 'tl-2011',
		_type: 'timelineItem',
		year: '2011',
		title: [
			{
				_key: 'tl-2011-title',
				_type: 'block',
				style: 'normal',
				markDefs: [],
				children: [
					{
						_key: 'tl-2011-title-span',
						_type: 'span',
						marks: [],
						text: 'Wachstum und Weiterentwicklung',
					},
				],
			},
		],
		text: 'Die Schule wächst und zu dieser Zeit hat Miriam als Lehrkraft schon zeitweise in der Schule gearbeitet.',
	},
	{
		_key: 'tl-i1',
		_type: 'timelineItem',
		year: '2018',
		title: [
			{
				_key: 'tl-i1t',
				_type: 'block',
				style: 'normal',
				markDefs: [],
				children: [
					{
						_key: 'tl-i1ta',
						_type: 'span',
						marks: [],
						text: 'Der Anfang – Übernahme des Forum Musaik',
					},
				],
			},
		],
		text: 'Das Forum Musaik beginnt mit musikalischer Frühförderung in Kindergärten und eigenen Räumen.',
	},
	{
		_key: 'tl-i2',
		_type: 'timelineItem',
		year: '2019',
		title: [
			{
				_key: 'tl-i2t',
				_type: 'block',
				style: 'normal',
				markDefs: [],
				children: [
					{
						_key: 'tl-i2ta',
						_type: 'span',
						marks: [],
						text: 'Tanz wird integriert',
					},
				],
			},
		],
		text: 'Der Tanz bekommt seinen eigenen Raum. Erste Tanzkurse entstehen und erweitern die Schule um eine neue Form des Ausdrucks',
	},
	{
		_key: 'tl-i3',
		_type: 'timelineItem',
		year: '2020',
		title: [
			{
				_key: 'tl-i3t',
				_type: 'block',
				style: 'normal',
				markDefs: [],
				children: [
					{
						_key: 'tl-i3ta',
						_type: 'span',
						marks: [],
						text: 'Alles steht still.',
					},
				],
			},
		],
		text: 'Von einem Moment auf den anderen darf sich nichts mehr bewegen. Doch wir sind geblieben, haben durchgehalten und immer wieder neue Wege gesucht.',
	},
	{
		_key: 'tl-i4',
		_type: 'timelineItem',
		year: '2022',
		title: [
			{
				_key: 'tl-i4t',
				_type: 'block',
				style: 'normal',
				markDefs: [],
				children: [
					{
						_key: 'tl-i4ta',
						_type: 'span',
						marks: [],
						text: 'Neuaufbau',
					},
				],
			},
		],
		text: 'Nach zwei Jahren Ausnahmezustand beginnt der Wiederaufbau. Nicht alles wie vorher, aber alles wächst in eine neue Richtung.',
	},
	{
		_key: 'tl-i5',
		_type: 'timelineItem',
		year: '2024',
		title: [
			{
				_key: 'tl-i5t',
				_type: 'block',
				style: 'normal',
				markDefs: [],
				children: [
					{
						_key: 'tl-i5ta',
						_type: 'span',
						marks: [],
						text: 'Ein Jahr des Wachstums',
					},
				],
			},
		],
		text: 'Etwas Normalität, etwas mehr Rhythmus, gleichzeitig entsteht im Hintergrund etwas Neues. Ideen entstehen, Erfahrungen und Erlebtes verbinden sich, langsam wird sichtbar, wohin sich die Schule entwickeln möchte.',
	},
	{
		_key: 'tl-i6',
		_type: 'timelineItem',
		year: '2025',
		title: [
			{
				_key: 'tl-i6t',
				_type: 'block',
				style: 'normal',
				markDefs: [],
				children: [
					{
						_key: 'tl-i6ta',
						_type: 'span',
						marks: [],
						text: 'Creators School',
					},
				],
			},
		],
		text: 'Ein neuer Boden, eine neue Vision – von hieraus wird weiter gebaut.',
	},
]

async function main() {
	if (process.argv.includes('--timeline-only')) {
		const result = await client
			.patch('page-ueber-uns')
			.set({ 'modules[_key=="tl001"].items': timelineItems })
			.commit()
		console.log(`Updated the timeline in ${result._id}.`)
		return
	}

	const current = await client.fetch<{
		musicFaq: Qa[]
		balletFaq: Qa[]
		balletRows: DetailRow[]
	}>(`{
		"musicFaq": *[_id == "offering-musikalische-fruehfoerderung"][0].faq,
		"balletFaq": *[_id == "offering-ballett"][0].faq,
		"balletRows": *[_id == "offering-ballett"][0].detailRows
	}`)

	const lessonFaq: Qa = {
		_key: 'miriam-unterricht-20260811',
		_type: 'qa',
		q: 'Was passiert im Unterricht?',
		a: 'Durch Bewegung, Rhythmus, Stimme, Körper- und Sinneswahrnehmung entdecken die Kinder Musik. Wir verbinden alles zu einem ganzheitlichen Lernerlebnis, das Körper, Geist und Seele gleichermaßen anspricht.',
	}
	const musicFaq = [
		...(current.musicFaq ?? [])
			.filter(
				(item) =>
					item.q !== lessonFaq.q &&
					!/aufführung|auftritt/i.test(`${item.q} ${item.a}`),
			)
			.map((item) =>
				item._key === 'k36'
					? {
							...item,
							a: 'Ab drei Jahren können Kinder mitmachen — mit Freude an Musik und Bewegung, ganz ohne Vorkenntnisse.',
						}
					: item,
			),
		lessonFaq,
	]
	const balletFaq = (current.balletFaq ?? []).filter(
		(item) => !`${item.q} ${item.a}`.toLowerCase().includes('spitzen'),
	)
	const balletRows = (current.balletRows ?? []).filter(
		(item) => !`${item.key} ${item.value}`.toLowerCase().includes('spitzen'),
	)

	const transaction = client.transaction()

	transaction.patch('offering-eltern-kind-kurs', (patch) =>
		patch.set({ 'facts[_key=="k39"].value': '1,5–3 Jahre' }),
	)
	transaction.patch('offering-musikalische-fruehfoerderung', (patch) =>
		patch.set({
			'facts[_key=="k7"].value': '3–6 Jahre',
			'facts[_key=="k8"].value': 'Individuelle Gruppe · etwa 10 Kinder',
			'detailRows[_key=="k29"].value': 'Etwa 10 Kinder',
			'metadata.description':
				'Musikalische Frühförderung für Kinder von 3 bis 6 Jahren: Musik, Rhythmus und Bewegung in individuell begleiteten Gruppen mit etwa 10 Kindern.',
			lede: 'Kinder entdecken Musik mit Stimme, Bewegung und ersten Instrumenten. In individuell begleiteten Gruppen mit etwa zehn Kindern bekommen Neugier, Rhythmusgefühl und eigener Ausdruck Raum.',
			'forWho[_key=="k14"].title': 'Kinder von drei bis sechs Jahren',
			faq: musicFaq,
		}),
	)
	transaction.patch('offering-taenzerische-fruehfoerderung', (patch) =>
		patch.set({
			lede: 'Körper, den Raum und den Rhythmus der Musik. Erste Grundlagen des Balletts verbinden sich mit Geschichten, Fantasie und freier Bewegung und eröffnen einen spielerischen Zugang zur Sprache des Tanzes.',
			'facts[_key=="k71"].value': '3–6 Jahre',
			'facts[_key=="k73"].value': 'Etwa 10 Kinder',
			'detailRows[_key=="k94"].value': 'Etwa 10 Kinder',
			'forWho[_key=="k79"].title': 'Kinder von drei bis sechs Jahren',
		}),
	)
	transaction.patch('offering-ballett', (patch) =>
		patch.set({
			'facts[_key=="k104"].value': 'ab 6 Jahren',
			'forWho[_key=="k113"].text':
				'Für Tänzerinnen, die ihre Technik vertiefen und sich weiterentwickeln wollen.',
			faq: balletFaq,
			detailRows: balletRows,
		}),
	)
	transaction.patch('offering-jazz-musicaldance', (patch) =>
		patch.set({
			title: 'Modern-/Contemporary dance',
			eyebrow: 'Bereich Tanz · Modern/Contemporary',
			lede: 'Modern- und Contemporary dance verbinden Energie, Technik und Bühnenausdruck. Jugendliche und Erwachsene erleben den Tanz auf allen Ebenen.',
			decorativeLetter: 'm',
			'metadata.title': 'Modern-/Contemporary dance in Melle | Creators School',
			'metadata.description':
				'Modern- und Contemporary dance für Jugendliche und Erwachsene in Melle: Energie, Technik und Bühnenausdruck.',
			'facts[_key=="k138"].value': 'ab 8 Jahren',
			'learn[_key=="k153"].title': 'Tanztechnik',
			'learn[_key=="k153"].text':
				'Drehungen, Sprünge und Isolationen — Tanztechnik bildet die Grundlage für den Tanz.',
			'learn[_key=="k154"].title': 'Ausdruck',
			'learn[_key=="k154"].text':
				'Bewegungscharakterarbeit zeigt, wie Persönlichkeit und Tanz zusammenwirken.',
			'learn[_key=="k155"].title': 'Choreographie',
			'learn[_key=="k155"].text':
				'Choreographien entstehen im Ensemble und werden für die Aufführung vorbereitet.',
			'faq[_key=="k169"].a':
				'Modern- und Contemporary dance sind freier, sie sind auf Ausdruck und Individualität ausgerichtet.',
		}),
	)

	transaction.patch('navigation-de', (patch) =>
		patch
			.set({
				'items[_key=="k714"].links[_key=="k716"].description':
					'3–6 Jahre · etwa 10 Kinder',
				'items[_key=="k714"].links[_key=="k717"].description':
					'1,5–3 Jahre · mit Mama/Papa',
				'items[_key=="k714"].links[_key=="k718"].description':
					'3–6 Jahre · Bewegung & Tanz',
				'items[_key=="k714"].links[_key=="k719"].description':
					'ab 6 Jahren · klassische Technik',
				'items[_key=="k714"].links[_key=="k720"].label':
					'Modern-/Contemporary dance',
				'items[_key=="k714"].links[_key=="k720"].description':
					'ab 8 Jahren · Bühne & Ausdruck',
			})
			.unset([
				'items[_key=="k714"].links[_key=="k721"]',
				'items[_key=="k714"].links[_key=="k722"]',
			]),
	)
	transaction.patch('footer-de', (patch) =>
		patch.set({
			'columns[_key=="k729"].links[_key=="k734"].label':
				'Modern-/Contemporary dance',
		}),
	)
	transaction.patch('page-angebot-jazz-musicaldance', (patch) =>
		patch.set({
			title: 'Modern-/Contemporary dance',
			'metadata.title': 'Modern-/Contemporary dance | Creators School Melle',
			'metadata.description':
				'Informationen zu Modern-/Contemporary dance bei der Creators School in Melle.',
		}),
	)
	transaction.patch('page-home', (patch) =>
		patch.set({
			'modules[_key=="k461"].cards[_key=="k466"].text':
				'In Eltern-Kind-Kursen und musikalischer Frühförderung erleben Kinder Klang, Rhythmus und Bewegung. Von 1,5 bis 3 Jahren gemeinsam mit einer Bezugsperson, von 3 bis 6 Jahren in der Gruppe.',
			'modules[_key=="k461"].cards[_key=="k467"].text':
				'Von der tänzerischen Früherziehung für Drei- bis Sechsjährige über Ballett ab sechs Jahren bis zu Modern-/Contemporary dance ab acht Jahren. Mit Unterricht, der Entwicklung begleitet und auf echte Bühnenerfahrungen vorbereitet.',
		}),
	)
	transaction.patch('page-angebote', (patch) =>
		patch.set({
			'metadata.description':
				'Vom Eltern-Kind-Kurs für Kinder ab 1,5 Jahren bis zu Tanzangeboten für Erwachsene.',
			'stage[_key=="k495"].lede':
				'Vom Eltern-Kind-Kurs für Kinder von 1,5 bis 3 Jahren bis zu Tanzangeboten für Erwachsene: Unsere Angebote begleiten unterschiedliche Lebensphasen, Erfahrungen und Formen des persönlichen Ausdrucks.',
			'modules[_key=="k512"].items[_key=="k518"].a':
				'Unser Eltern-Kind-Kurs ist für Kinder von 1,5 bis 3 Jahren. Die Musikalische Frühförderung und die Tänzerische Früherziehung richten sich an Kinder von 3 bis 6 Jahren.',
			'modules[_key=="k512"].items[_key=="k519"].a':
				'Die Monatsbeiträge für unsere Gruppenangebote liegen aktuell – je nach Kurs und Unterrichtsdauer – zwischen 43 € und 45 €. Preise für individuelle Projekte teilen wir auf Anfrage mit. Für Geschwister gibt es Rabatte.',
			'modules[_key=="k512"].items[_key=="k520"].a':
				'Die ersten zwei Probestunden sind kostenlos, wenn du bzw. dein Kind danach nicht weitermachst. Entscheidest du dich für den weiteren Unterricht, werden beide Probestunden rückwirkend berechnet.',
			'modules[_key=="k512"].items[_key=="k520"].q':
				'Wie funktionieren die Probestunden?',
			'modules[_key=="k512"].items[_key=="k523"].a':
				'Absolut. Modern-/Contemporary dance und weitere Tanzangebote richten sich auch an Erwachsene. Es ist nie zu spät.',
		}),
	)
	transaction.patch('page-ueber-uns', (patch) =>
		patch.set({ 'modules[_key=="tl001"].items': timelineItems }),
	)
	transaction.patch('schedule-slot-001', (patch) =>
		patch.set({ ageRange: '3–6 Jahre' }),
	)
	transaction.patch('schedule-slot-002', (patch) =>
		patch.set({ name: 'Modern-/Contemporary dance', ageRange: 'ab 8 Jahren' }),
	)
	transaction.patch('person-charlotte-berg', (patch) =>
		patch.set({ bio: 'Klassisches Ballett, Choreografie' }),
	)
	transaction.patch('person-marlene-otten', (patch) =>
		patch.set({
			role: 'Modern · Contemporary',
			bio: 'Modern-/Contemporary dance',
		}),
	)
	transaction.patch('teacher-marlene-otten', (patch) =>
		patch.set({ role: 'Modern · Contemporary' }),
	)
	transaction.patch('person-elisa-hartmann', (patch) =>
		patch.set({ role: 'Stimmbildung · Gesang' }),
	)
	transaction.delete('page-angebot-hochzeitsgesang')
	transaction.delete('page-angebot-instrumentalunterricht')
	transaction.delete('offering-hochzeitsgesang')
	transaction.delete('offering-instrumentalunterricht')

	const result = await transaction.commit()
	console.log(
		`Applied Miriam's latest feedback to ${result.documentIds.length} documents.`,
	)
}

main().catch((error) => {
	console.error(error)
	process.exitCode = 1
})
