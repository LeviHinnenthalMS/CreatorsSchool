// Run with: npx tsx --env-file=.env.local scripts/audit-offering-group-consistency.ts
import { createClient } from '@sanity/client'

const client = createClient({
	projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!,
	dataset: process.env.NEXT_PUBLIC_SANITY_DATASET!,
	token:
		process.env.SANITY_API_READ_TOKEN || process.env.SANITY_API_WRITE_TOKEN,
	apiVersion: '2026-08-11',
	useCdn: false,
})

type Offering = {
	_id: string
	title?: string
	lede?: string
	facts?: Array<{ _key: string; key?: string; value?: string }>
	detailRows?: Array<{ _key: string; key?: string; value?: string }>
	[key: string]: unknown
}

type Match = { path: string; value: string }

const groupPattern =
	/klein(?:e|en|er)?\s+gruppen?|kleingrupp|max(?:imal)?\.?\s*(?:\d+|sechs|acht|zehn|zwölf)|höchstens\s+(?:\d+|sechs|acht|zehn|zwölf)|bis zu\s+(?:\d+|sechs|acht|zehn|zwölf)\s+(?:kinder|familien|schüler:innen)|gruppen?\s+von\s+(?:höchstens|bis zu)/i

function findMatches(value: unknown, path = ''): Match[] {
	if (typeof value === 'string') {
		return groupPattern.test(value) ? [{ path, value }] : []
	}

	if (Array.isArray(value)) {
		return value.flatMap((item, index) =>
			findMatches(item, `${path}[${index}]`),
		)
	}

	if (value && typeof value === 'object') {
		return Object.entries(value).flatMap(([key, item]) =>
			findMatches(item, path ? `${path}.${key}` : key),
		)
	}

	return []
}

async function main() {
	const query = `*[_type == "offering"] | order(title asc, _id asc)`
	const [published, drafts] = await Promise.all([
		client.withConfig({ perspective: 'published' }).fetch<Offering[]>(query),
		client.withConfig({ perspective: 'drafts' }).fetch<Offering[]>(query),
	])

	const buildReport = (offerings: Offering[]) =>
		offerings.map((offering) => ({
			id: offering._id,
			title: offering.title,
			groupFacts: (offering.facts ?? []).filter(({ key }) =>
				/gruppe|typ/i.test(key ?? ''),
			),
			groupDetailRows: (offering.detailRows ?? []).filter(({ key }) =>
				/gruppe|typ/i.test(key ?? ''),
			),
			matches: findMatches(offering).filter(
				({ path }) => !path.startsWith('_'),
			),
		}))

	console.log(
		JSON.stringify(
			{
				published: buildReport(published),
				drafts: buildReport(drafts),
			},
			null,
			2,
		),
	)
}

main().catch((error) => {
	console.error(error)
	process.exitCode = 1
})
