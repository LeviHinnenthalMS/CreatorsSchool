import { BASE_URL, BLOG_DIR } from '@/lib/env'
import { DEFAULT_LANG, languages } from '@/lib/i18n'
import { getSite } from '@/sanity/lib/queries'

export async function GET() {
	const site = await getSite()
	const name = (site as { title?: string | null } | null)?.title ?? 'Site'

	const langLinks = languages
		.map((l) => {
			const prefix = l === DEFAULT_LANG ? '' : `/${l}`
			return `- [${l}] ${BASE_URL}${prefix}/`
		})
		.join('\n')

	const body = `# ${name}

> See sitemap.xml for the full list of indexable pages.

## Languages
${langLinks}

## Key resources
- Sitemap: ${BASE_URL}/sitemap.xml
- Blog: ${BASE_URL}/${BLOG_DIR}/
`

	return new Response(body, {
		headers: { 'Content-Type': 'text/plain; charset=utf-8' },
	})
}
