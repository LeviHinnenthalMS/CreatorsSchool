import { BASE_URL } from '@/lib/env'
import { DEFAULT_LANG, supportedLanguages } from '@/lib/i18n'
import { getSite } from '@/sanity/lib/queries'

export async function GET() {
	const site = await getSite()
	const name = (site as { title?: string | null } | null)?.title ?? 'Site'

	const langLinks = supportedLanguages
		.map(({ id, title }) => {
			const prefix = id === DEFAULT_LANG ? '' : `/${id}`
			return `- [${title}](${BASE_URL}${prefix}/)`
		})
		.join('\n')

	const body = `# ${name}

> See sitemap.xml for the full list of indexable pages.

## Languages
${langLinks}

## Key resources
- [Sitemap](${BASE_URL}/sitemap.xml)
- [Blog](${BASE_URL}/blog)
`

	return new Response(body, {
		headers: { 'Content-Type': 'text/plain; charset=utf-8' },
	})
}
