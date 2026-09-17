import { BASE_URL, vercelPreview } from './env'
import { DEFAULT_LANG, supportedLanguages } from './i18n'
import resolveUrl from './resolveUrl'
import type { DiscoveryContent, DiscoveryEntry } from '@/sanity/lib/discovery'

// CMS text must not break Markdown headings, link labels, or list boundaries.
function text(value?: string | null) {
	return (value ?? '')
		.replace(/\s+/g, ' ')
		.trim()
		.replace(/[\\`*_{}[\]<>#]/g, '\\$&')
}

function url(entry: DiscoveryEntry) {
	const slug = entry._type === 'blogPost' ? `blog/${entry.slug}` : entry.slug
	return new URL(
		resolveUrl(
			{ _type: entry._type, metadata: { slug: { current: slug } } },
			{ language: entry.language },
		),
		BASE_URL,
	).href
		.replace(/\(/g, '%28')
		.replace(/\)/g, '%29')
}

function label(entry: DiscoveryEntry) {
	const language = supportedLanguages.find(({ id }) => id === entry.language)
	return `${text(entry.title)}${entry.language !== DEFAULT_LANG ? ` (${text(language?.title ?? entry.language)})` : ''}`
}

function link(entry: DiscoveryEntry) {
	return `[${label(entry)}](${url(entry)})`
}

function description(entry: DiscoveryEntry) {
	return [
		text(entry.lede || entry.description),
		entry._type === 'performance' &&
			[entry.startDate, entry.dates, entry.venue]
				.filter(Boolean)
				.map(text)
				.join(' · '),
		entry._type === 'blogPost' && text(entry.publishedAt),
	]
		.filter(Boolean)
		.join(' — ')
}

const sections: Array<[DiscoveryEntry['_type'], string]> = [
	['page', 'Website'],
	['offering', 'Courses and services'],
	['performance', 'Performances'],
	['blogPost', 'Articles'],
]

/** Both documents use the same published snapshot and canonical source links. */
export function renderLlms(content: DiscoveryContent, detailed = false) {
	const { site, entries } = content
	if (!site?.title || !entries.length) {
		throw new Error(
			'Published site settings and indexable content are required',
		)
	}
	const home = entries.find(
		(entry) =>
			entry._type === 'page' &&
			entry.slug === 'index' &&
			entry.language === DEFAULT_LANG,
	)
	const summary = [site.tagline, home?.description]
		.filter(Boolean)
		.map(text)
		.join(' ')
	const lines = [
		`# ${text(site.title)}`,
		'',
		...(summary ? [`> ${summary}`, ''] : []),
		`Official website: ${BASE_URL}/`,
		...(site.addressLines?.length
			? [`Address: ${site.addressLines.map(text).join(', ')}`]
			: []),
		...(site.phone ? [`Phone: ${text(site.phone)}`] : []),
		...(site.email ? [`Email: ${text(site.email)}`] : []),
		'',
		'Content is drawn from the published website. Follow the linked source pages for current schedules, availability, prices and booking terms. Event dates may refer to past performances.',
		'',
		'## Resources',
		`- [${detailed ? 'Site guide' : 'Detailed course reference'}](${BASE_URL}/${detailed ? 'llms.txt' : 'llms-full.txt'}): ${detailed ? 'Concise index of official sources.' : 'Published course descriptions, facts, prices and FAQs in plain text, with source URLs.'}`,
		`- [Sitemap](${BASE_URL}/sitemap.xml): Indexable website URLs.`,
	]

	for (const [type, heading] of sections) {
		const group = entries
			.filter((entry) => entry._type === type)
			.sort((a, b) => Number(b.slug === 'index') - Number(a.slug === 'index'))
		if (!group.length) continue
		lines.push('', `## ${heading}`)
		for (const entry of group) {
			const summary = description(entry)
			if (!detailed || type !== 'offering') {
				lines.push(`- ${link(entry)}${summary ? `: ${summary}` : ''}`)
				continue
			}
			lines.push('', `### ${label(entry)}`, '', `Source: ${link(entry)}`)
			lines.push(`Updated: ${text(entry._updatedAt)}`)
			if (entry.lede || summary) lines.push('', text(entry.lede) || summary)
			const facts = [...(entry.facts ?? []), ...(entry.detailRows ?? [])]
			const factLines = facts
				.filter(({ key, value }) => key && value)
				.map(({ key, value }) => `- ${text(key)}: ${text(value)}`)
			if (factLines.length) lines.push('', ...new Set(factLines))
			const price = [
				entry.priceLabel,
				entry.priceValue,
				entry.priceCurrency,
				entry.priceUnit,
			]
				.filter(Boolean)
				.map(text)
				.join(' ')
			if (price) lines.push('', `Price: ${price}`)
			for (const { q, a } of entry.faq ?? []) {
				if (q && a) lines.push('', `#### ${text(q)}`, '', text(a))
			}
		}
	}
	return `${lines.join('\n')}\n`
}

export function llmsResponse(body: string) {
	return new Response(body, {
		headers: {
			'Content-Type': 'text/plain; charset=utf-8',
			'Cache-Control': vercelPreview
				? 'no-store'
				: 'public, max-age=0, must-revalidate',
			'X-Content-Type-Options': 'nosniff',
			'X-Robots-Tag': vercelPreview ? 'noindex, nofollow' : 'noindex',
			Link: `</llms.txt>; rel="describedby"`,
		},
	})
}
