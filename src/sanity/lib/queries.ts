import { fetchSanity, fetchSanityLive } from './fetch'
import { unstable_cache } from 'next/cache'
import { defineQuery, groq } from 'next-sanity'
import { BLOG_DIR } from '@/lib/env'
import type {
	SITE_QUERY_RESULT,
	NAVIGATION_DOC_QUERY_RESULT,
	FOOTER_QUERY_RESULT,
	ALL_TRANSLATIONS_QUERY_RESULT,
} from '@/sanity/types'

export const IMAGE_QUERY = `
	...,
	'lqip': @.asset->metadata.lqip,
	'assetAlt': @.asset->altText
`

const ASSET_IMG_QUERY = `
	...,
	image { ${IMAGE_QUERY} }
`

export const LINK_QUERY = `
	...,
	internal->{
		_type,
		title,
		language,
		metadata
	}
`

export const LINK_NAV_QUERY = `
	${LINK_QUERY},
	'icon': icon.asset->url
`

export const CTA_QUERY = `
	...,
	link{ ${LINK_QUERY} },
	'icon': icon.asset->url,
	'iconAspectRatio': icon.asset->metadata.dimensions.aspectRatio,
	iconHeight
`

const NAVIGATION_QUERY = `
	title,
	items[]{
		_type,
		_key,
		active,
		_type == 'link' => { ${LINK_QUERY} },
		_type == 'link.list' => {
			link{ ${LINK_QUERY} },
			links[]{ ${LINK_NAV_QUERY} },
		},
		_type == 'cta' => { ${CTA_QUERY} }
	}
`

/**
 * MODULES_QUERY — projection applied to every entry in a page's `modules[]`
 * array (and to global modules + the stage). Composed into PAGE_QUERY,
 * NOT_FOUND_QUERY, and BLOG_POST_QUERY via string interpolation.
 *
 * Conventions when adding a module projection here:
 *
 * 1. **Always use `$lang` for language filters, never `^.language`.**
 *    Inside a nested `*[...]` query, `^` refers to the surrounding *module*
 *    object — not the page — and modules don't carry a `language` field.
 *    Every consumer of MODULES_QUERY passes `$lang` as a query parameter, so
 *    referencing it directly is safe and unambiguous.
 *
 * 2. **Every consumer must provide `lang` in the query params.** If you add a
 *    new entry point that interpolates MODULES_QUERY, make sure its
 *    `fetchSanityLive({ params: { ..., lang } })` call includes `lang`, or
 *    next-sanity's tag-sync will throw "param $lang referenced, but not
 *    provided" — even for unrelated routes.
 *
 * 3. **Keep projections side-effect-free of their parent scope.** Use only
 *    `$param` references and same-doc field accesses. This makes module
 *    projections portable across PAGE_QUERY, NOT_FOUND_QUERY, etc.
 */
export const MODULES_QUERY = `
	...,
	ctas[]{ ${CTA_QUERY} },
	_type == 'about-story' => {
		content[]{
			...,
			_type == 'image' => { ${IMAGE_QUERY} }
		},
		timeline[]{
			year,
			image{ ${IMAGE_QUERY} }
		}
	},
	_type == 'blog-overview' => {
		'posts': *[_type == 'blog.post' && language == $lang] | order(publishDate desc) {
			_id,
			_type,
			publishDate,
			featured,
			language,
			metadata{
				title,
				description,
				slug,
				image{ ${IMAGE_QUERY} }
			},
			authors[]->{
				_id,
				name,
				slug,
				image{ ${IMAGE_QUERY} }
			}
		}
	},
	_type == 'breadcrumbs' => { crumbs[]{ ${LINK_QUERY} } },
	_type == 'comparison-cards' => {
		positiveCard{
			...,
			ctas[]{ ${CTA_QUERY} }
		},
		footnote{
			...,
			image{ ${ASSET_IMG_QUERY} }
		}
	},
	_type == 'feature-tabs' => {
		tabs[]{
			...,
			link{ ${LINK_QUERY} },
			image{ ${ASSET_IMG_QUERY} },
			video{ asset->{ url, mimeType } }
		}
	},
	_type == 'hero.split' => {
		eyebrowImage{ ${ASSET_IMG_QUERY} },
		assets[]{
			...,
			_type == 'img' => { ${ASSET_IMG_QUERY} }
		}
	},
	_type == 'meet-the-founder' => {
		founder->{
			name,
			bio,
			'image': image{ ${IMAGE_QUERY} }
		}
	},
	_type == 'meet-the-team' => {
		image{ ${IMAGE_QUERY} },
		mobileImage{ ${IMAGE_QUERY} }
	},
	_type == 'newsletter-cta' => {
		eyebrowImage{ ${ASSET_IMG_QUERY} },
		image{ ${ASSET_IMG_QUERY} }
	},
	_type == 'person-list' => { people[]-> },
	_type == 'social-proof.logos' => {
		logos[]->{
			...,
			image{
				default{ ${IMAGE_QUERY} },
				light{ ${IMAGE_QUERY} },
				dark{ ${IMAGE_QUERY} }
			}
		}
	},
	_type == 'richtext-module' => {
		content[]{
			...,
			_type == 'image' => { ${IMAGE_QUERY} }
		},
		'headings': select(
			tableOfContents => content[style in ['h2', 'h3', 'h4', 'h5', 'h6']]{
				style,
				'text': pt::text(@)
			}
		),
	},
	_type == 'testimonial.featured' => { testimonial-> },
	_type == 'testimonial.grid' => {
		testimonials[]{
			_key,
			_type,
			_type == 'reference' => { 'items': [@->] }
		}
	},
`

export const GLOBAL_MODULE_PATH_QUERY = `
	string::startsWith($slug, path)
	&& select(
		defined(excludePaths) => count(excludePaths[string::startsWith($slug, @)]) == 0,
		true
	)
`

export const TRANSLATIONS_QUERY = `
	'translations': *[_type == 'translation.metadata' && references(^._id)].translations[].value->{
		'slug': metadata.slug.current,
		language
	}
`

export const SITE_QUERY = defineQuery(groq`
	*[_type == 'site'][0]{
		...,
		ctas[]{ ${CTA_QUERY} },
		'ogimage': ogimage.asset->url
	}
`)

export async function getSite() {
	const site = await fetchSanityLive<SITE_QUERY_RESULT>({
		query: SITE_QUERY,
	})

	if (!site) {
		console.warn(
			'[getSite] No Site document found. Publish the Site singleton in Sanity Studio.',
		)
		return {} as NonNullable<SITE_QUERY_RESULT>
	}

	return site
}

export const NAVIGATION_DOC_QUERY = defineQuery(groq`*[_type == 'navigation' && language == $lang][0]{
	${NAVIGATION_QUERY}
}`)

export async function getNavigation(lang: string) {
	return await fetchSanityLive<NAVIGATION_DOC_QUERY_RESULT>({
		query: NAVIGATION_DOC_QUERY,
		params: { lang },
	})
}

export const FOOTER_QUERY = defineQuery(groq`*[_type == 'footer' && language == $lang][0]{
	...,
	columns[]{
		...,
		links[]{ ${LINK_QUERY} }
	},
	socials[]{ ${LINK_QUERY} },
	bottomLinks[]{ ${LINK_QUERY} },
	privacyPolicy{ ${LINK_QUERY} }
}`)

export async function getFooter(lang: string) {
	return await fetchSanityLive<FOOTER_QUERY_RESULT>({
		query: FOOTER_QUERY,
		params: { lang },
	})
}

export const ALL_TRANSLATIONS_QUERY = defineQuery(groq`*[_type in ['page', 'blog.post'] && defined(language)]{
	'slug': '/' + select(
		_type == 'blog.post' => '${BLOG_DIR}/' + metadata.slug.current,
		metadata.slug.current != 'index' => metadata.slug.current,
		''
	),
	'translations': *[_type == 'translation.metadata' && references(^._id)].translations[].value->{
		'slug': '/' + select(
			_type == 'blog.post' => '${BLOG_DIR}/' + language + '/' + metadata.slug.current,
			metadata.slug.current != 'index' => language + '/' + metadata.slug.current,
			language
		),
		_type == 'blog.post' => {
			'slugBlogAlt': '/' + language + '/${BLOG_DIR}/' + metadata.slug.current
		},
		language
	}
}`)

export async function getTranslations() {
	return await fetchSanityLive<ALL_TRANSLATIONS_QUERY_RESULT>({
		query: ALL_TRANSLATIONS_QUERY,
	})
}

/**
 * Cached variant of {@link getTranslations} for use in the proxy/middleware,
 * which runs on every HTML request. Invalidate via `revalidateTag('translations')`
 * from a Sanity webhook on publish/unpublish of any translatable document.
 */
export const getCachedTranslations = unstable_cache(
	async () =>
		fetchSanity<ALL_TRANSLATIONS_QUERY_RESULT>({
			query: ALL_TRANSLATIONS_QUERY,
			next: { tags: ['translations'], revalidate: 3600 },
		}),
	['translations'],
	{ tags: ['translations'], revalidate: 3600 },
)

// ── Pages ────────────────────────────────────────────────────────────────

export const PAGE_SLUGS_QUERY = defineQuery(groq`*[
	_type == 'page'
	&& defined(metadata.slug.current)
	&& !(metadata.slug.current in ['index'])
]{
	'slug': metadata.slug.current
}`)

export const PAGE_QUERY = defineQuery(groq`*[
	_type == 'page'
	&& metadata.slug.current == $slug
	&& language == $lang
][0]{
	...,
	'modules': (
		// global modules (before)
		coalesce(*[_type == 'global-module' && path == '*'].before[]{ ${MODULES_QUERY} }, [])
		// path modules (before)
		+ coalesce(*[_type == 'global-module' && path != '*' && ${GLOBAL_MODULE_PATH_QUERY}].before[]{ ${MODULES_QUERY} }, [])
		// stage (hero)
		+ coalesce(stage[]{ ${MODULES_QUERY} }, [])
		// page modules
		+ coalesce(modules[]{ ${MODULES_QUERY} }, [])
		// path modules (after)
		+ coalesce(*[_type == 'global-module' && path != '*' && ${GLOBAL_MODULE_PATH_QUERY}].after[]{ ${MODULES_QUERY} }, [])
		// global modules (after)
		+ coalesce(*[_type == 'global-module' && path == '*'].after[]{ ${MODULES_QUERY} }, [])
	),
	metadata {
		...,
		'ogimage': image.asset->url + '?w=1200'
	},
	${TRANSLATIONS_QUERY},
}`)

export const NOT_FOUND_QUERY = defineQuery(groq`*[_type == 'page' && metadata.slug.current == '404' && language == $lang][0]{
	...,
	'modules': (
		// global modules (before)
		coalesce(*[_type == 'global-module' && path == '*'].before[]{ ${MODULES_QUERY} }, [])
		// page modules
		+ coalesce(modules[]{ ${MODULES_QUERY} }, [])
		// global modules (after)
		+ coalesce(*[_type == 'global-module' && path == '*'].after[]{ ${MODULES_QUERY} }, [])
	)
}`)

// ── Blog ─────────────────────────────────────────────────────────────────

export const BLOG_POST_SLUGS_QUERY = defineQuery(
	groq`*[_type == 'blog.post' && defined(metadata.slug.current)].metadata.slug.current`,
)

export const BLOG_POST_QUERY = defineQuery(groq`*[
	_type == 'blog.post'
	&& metadata.slug.current == $slug
	&& language == $lang
][0]{
	...,
	body[]{
		...,
		_type == 'image' => {
			${IMAGE_QUERY},
			asset->
		}
	},
	'readTime': length(string::split(pt::text(body), ' ')) / 200,
	'headings': body[style in ['h2', 'h3']]{
		style,
		'text': pt::text(@)
	},
	authors[]->,
	metadata {
		...,
		'ogimage': image.asset->url + '?w=1200'
	},
	'modulesBefore': (
		*[_type == 'global-module' && path == '*'].before[]{ ${MODULES_QUERY} }
		+ *[_type == 'global-module' && path == '${BLOG_DIR}/'].before[]{ ${MODULES_QUERY} }
	),
	'modulesAfter': (
		*[_type == 'global-module' && path == '${BLOG_DIR}/'].after[]{ ${MODULES_QUERY} }
		+ *[_type == 'global-module' && path == '*'].after[]{ ${MODULES_QUERY} }
	),
	${TRANSLATIONS_QUERY},
}`)

export const RSS_FEED_QUERY = defineQuery(groq`{
	'blog': *[_type == 'page' && metadata.slug.current == '${BLOG_DIR}'][0]{
		_type,
		title,
		metadata,
		'image': metadata.image.asset->url,
	},
	'posts': *[_type == 'blog.post']{
		_type,
		body,
		publishDate,
		authors[]->,
		metadata,
		'image': metadata.image.asset->url,
		language,
	},
	'copyright': pt::text(*[_type == 'site'][0].copyright)
}`)

// ── Sitemap, search, announcements, misc ─────────────────────────────────

export const SITEMAP_QUERY = defineQuery(groq`{
	'pages': *[
		_type == 'page' &&
		!(metadata.slug.current in ['404']) &&
		metadata.noIndex != true
	]|order(metadata.slug.current){
		language,
		'url': (
			$baseUrl
			+ select(defined(language) && language != $defaultLang => language + '/', '')
			+ select(
				metadata.slug.current == 'index' => '',
				metadata.slug.current
			)
		),
		'lastModified': _updatedAt,
		'priority': select(
			metadata.slug.current == 'index' => 1,
			0.5
		),
		'alternates': *[_type == 'translation.metadata' && references(^._id)].translations[].value->{
			language,
			'url': (
				$baseUrl
				+ select(defined(language) && language != $defaultLang => language + '/', '')
				+ select(
					metadata.slug.current == 'index' => '',
					metadata.slug.current
				)
			)
		}
	},
	'blog': *[_type == 'blog.post' && metadata.noIndex != true]|order(name){
		language,
		'url': (
			$baseUrl
			+ select(defined(language) && language != $defaultLang => language + '/', '')
			+ '${BLOG_DIR}/'
			+ metadata.slug.current
		),
		'lastModified': _updatedAt,
		'priority': 0.4,
		'alternates': *[_type == 'translation.metadata' && references(^._id)].translations[].value->{
			language,
			'url': (
				$baseUrl
				+ select(defined(language) && language != $defaultLang => language + '/', '')
				+ '${BLOG_DIR}/'
				+ metadata.slug.current
			)
		}
	}
}`)

export const SEARCH_QUERY = defineQuery(groq`*[
	select(
		$scope == 'pages' => _type == 'page',
		$scope == 'path' => _type == 'page'
			&& metadata.slug.current match $path
			&& !(metadata.slug.current in ['404']),
		$scope == 'blog posts' => _type == 'blog.post',
		_type in ['page', 'blog.post'] && !(metadata.slug.current in ['404'])
	) &&
	[
		body[].children[].text,
		modules[].content[].children[].text,
		modules[].intro[].children[].text,
		title,
		metadata.title,
		metadata.description
	] match $query
]{
	_id,
	_type,
	title,
	language,
	metadata
}`)

export const ANNOUNCEMENTS_QUERY = defineQuery(groq`*[_type == 'site'][0].announcements[]->{
	...,
	cta{ ${LINK_QUERY} },
}`)

export const GLOBAL_MODULES_QUERY = defineQuery(groq`*[_type == 'global-module']{
	_id,
	path,
	excludePaths[]
}`)
