import { fetchSanityLive } from '@/sanity/lib/fetch'
import { RSS_FEED_QUERY } from '@/sanity/lib/queries'
import resolveUrl from '@/lib/resolveUrl'
import { Feed } from 'feed'
import { escapeHTML, toHTML } from '@portabletext/to-html'
import { urlFor } from '@/sanity/lib/image'
import { DEFAULT_LANG } from '@/lib/i18n'
import type { RSS_FEED_QUERY_RESULT } from '@/sanity/types'

export async function GET() {
	const { blog, posts, copyright } = await fetchSanityLive<RSS_FEED_QUERY_RESULT>({
		query: RSS_FEED_QUERY,
	})

	if (!blog || !posts) {
		return new Response(
			'Missing either a blog page or blog posts in Sanity Studio',
			{ status: 500 },
		)
	}

	const url = resolveUrl(blog) || ''

	const feed = new Feed({
		title: blog?.title || blog.metadata?.title || '',
		description: blog.metadata?.description ?? undefined,
		link: url,
		id: url,
		copyright: copyright ?? '',
		favicon: process.env.NEXT_PUBLIC_BASE_URL + '/favicon.ico',
		language: DEFAULT_LANG,
	})

	posts.map((post) => {
		const url =
			resolveUrl(post, { language: post.language ?? undefined }) || ''
		const publishDate = post.publishDate ? new Date(post.publishDate) : new Date()

		return feed.addItem({
			title: escapeHTML(post.metadata?.title ?? ''),
			description: post.metadata?.description ?? undefined,
			id: url,
			link: url,
			published: publishDate,
			date: publishDate,
			author: post.authors?.map((author) => ({ name: author.name })),
			content: toHTML(post.body ?? [], {
				components: {
					types: {
						image: ({ value: { alt = '', caption, source, ...value } }) => {
							const img = `<img src="${urlFor(value).url()}" alt="${escapeHTML(alt)}" />`
							const figcaption =
								caption && `<figcaption>${escapeHTML(caption)}</figcaption>`
							const aSource = source && `<a href="${source}">(Source)</a>`
							return `<figure>${[img, figcaption, aSource].filter(Boolean).join(' ')}</figure>`
						},
						admonition: ({ value: { title, content } }) => {
							return `<dl><dt>${title}</dt><dd>${toHTML(content)}</dd></dl>`
						},
						code: ({ value }) =>
							`<pre><code>${escapeHTML(value.code)}</code></pre>`,
						'custom-html': () => '',
					},
				},
			}),
			image: post.image ?? undefined,
		})
	})

	return new Response(feed.atom1(), {
		headers: {
			'Content-Type': 'application/atom+xml',
		},
	})
}
