// ponytail: run via `pnpm seed` — uses npx tsx + Node's --env-file.
// No new devDep; tsx is fetched on demand and cached.
// Idempotent: createIfNotExists, safe to re-run.
import { createClient } from '@sanity/client'
import { supportedLanguages } from '../src/lib/i18n'

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET
const token = process.env.SANITY_API_WRITE_TOKEN

if (!projectId || !dataset || !token) {
	console.error(
		'Missing env. Need NEXT_PUBLIC_SANITY_PROJECT_ID, NEXT_PUBLIC_SANITY_DATASET, SANITY_API_WRITE_TOKEN in .env.local',
	)
	process.exit(1)
}

const client = createClient({
	projectId,
	dataset,
	token,
	apiVersion: '2024-12-01',
	useCdn: false,
})

const docs: { _id: string; _type: string; [k: string]: unknown }[] = [
	{ _id: 'site', _type: 'site', title: 'My site' },
]

for (const { id: lang } of supportedLanguages) {
	docs.push({
		_id: `home-${lang}`,
		_type: 'page',
		language: lang,
		title: 'Home',
		metadata: {
			_type: 'metadata',
			title: 'Home',
			slug: { _type: 'slug', current: 'index' },
		},
	})
}

;(async () => {
	for (const doc of docs) {
		const res = await client.createIfNotExists(doc as never)
		console.log(`✓ ${res._id}`)
	}
})()
