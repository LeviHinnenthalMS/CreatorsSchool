// Run with: npx tsx --env-file=.env.local scripts/update-opening-hours-flexible.ts
import { createClient } from '@sanity/client'
import { randomUUID } from 'node:crypto'

const client = createClient({
	projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!,
	dataset: process.env.NEXT_PUBLIC_SANITY_DATASET!,
	token: process.env.SANITY_API_WRITE_TOKEN!,
	apiVersion: '2026-08-13',
	useCdn: false,
})

// Owner: no fixed office hours — she works flexibly and books appointments individually.
// Voice matches site tone: "du" (existing title was "Wann du uns erreichst").
const EYEBROW = 'Erreichbarkeit'
const BODY =
	'Wir arbeiten flexibel und sind daher nicht an feste Bürozeiten gebunden. Wenn du Fragen hast oder einen Termin vereinbaren möchtest, schreib uns gerne eine Nachricht oder ruf uns an — per E-Mail, WhatsApp oder Telefon. Wir melden uns zeitnah bei dir.'

// Rich title: "Wann sind wir für [dich] da?" — accent mark on "dich"
const TITLE_BLOCKS = [
	{
		_key: randomUUID().slice(0, 12),
		_type: 'block',
		style: 'normal',
		markDefs: [],
		children: [
			{ _key: randomUUID().slice(0, 12), _type: 'span', marks: [], text: 'Wann sind wir für ' },
			{ _key: randomUUID().slice(0, 12), _type: 'span', marks: ['accent'], text: 'dich' },
			{ _key: randomUUID().slice(0, 12), _type: 'span', marks: [], text: ' da?' },
		],
	},
]

type PageHit = { _id: string; _rev: string; ohKeys: string[] }

async function main() {
	const pages = await client.fetch<PageHit[]>(
		`*[_type == 'page' && count(modules[_type == 'opening-hours']) > 0]{
			_id, _rev, 'ohKeys': modules[_type == 'opening-hours']._key
		}`,
	)

	if (!pages.length) {
		console.log('No pages with opening-hours module found.')
		return
	}

	for (const page of pages) {
		let patch = client.patch(page._id).ifRevisionId(page._rev)
		for (const key of page.ohKeys) {
			patch = patch.set({
				[`modules[_key=="${key}"].eyebrow`]: EYEBROW,
				[`modules[_key=="${key}"].title`]: TITLE_BLOCKS,
				[`modules[_key=="${key}"].text`]: BODY,
				[`modules[_key=="${key}"].hours`]: [],
			})
		}
		const result = await patch.commit()
		console.log(`Updated ${result._id} (rev ${result._rev}) — ${page.ohKeys.length} module(s)`)
	}
}

main().catch((error) => {
	console.error(error)
	process.exitCode = 1
})
